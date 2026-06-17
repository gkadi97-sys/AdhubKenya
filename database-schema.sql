-- Create profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  email text not null,
  phone text,
  whatsapp text,
  location text,
  avatar text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles: Anyone can read profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Profiles: Users can insert their own profile
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- Profiles: Users can update own profile
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create listings table
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price numeric not null,
  negotiable boolean default false,
  category text not null,
  location text not null,
  condition text,
  make text,
  model text,
  year integer,
  specs jsonb default '{}'::jsonb,
  images text[] default '{}',
  seller_id uuid references public.profiles(id) on delete cascade not null,
  phone text not null,
  whatsapp text,
  views integer default 0,
  is_featured boolean default false,
  status text default 'active' check (status in ('active', 'sold', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for listings
alter table public.listings enable row level security;

-- Listings: Anyone can read listings
create policy "Listings are viewable by everyone." on listings
  for select using (true);

-- Listings: Authenticated users can insert their own listings
create policy "Users can insert own listings." on listings
  for insert with check (auth.uid() = seller_id);

-- Listings: Users can update their own listings
create policy "Users can update own listings." on listings
  for update using (auth.uid() = seller_id);

-- Listings: Users can delete their own listings
create policy "Users can delete own listings." on listings
  for delete using (auth.uid() = seller_id);

-- Create a storage bucket for listing images
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true);

-- Enable RLS for the storage bucket
create policy "Public Access to listing-images" on storage.objects
  for select using (bucket_id = 'listing-images');

create policy "Authenticated users can upload images" on storage.objects
  for insert with check (
    bucket_id = 'listing-images' and auth.role() = 'authenticated'
  );

create policy "Users can update their own images" on storage.objects
  for update using (
    bucket_id = 'listing-images' and auth.uid() = owner
  );

create policy "Users can delete their own images" on storage.objects
  for delete using (
    bucket_id = 'listing-images' and auth.uid() = owner
  );

-- Create trigger to automatically create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'name', 'User'), 
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- AUTO SPARES INTELLIGENT FILTERING SCHEMA
-- ==============================================================================

-- 1. Master Categories (e.g. Engine Parts, Fuel System)
create table public.parts_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Specific Parts (e.g. Tie Rod End, Piston)
create table public.parts (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.parts_categories(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Part Aliases (e.g. Tie Rod End -> Track Rod End)
create table public.part_aliases (
  id uuid default gen_random_uuid() primary key,
  part_id uuid references public.parts(id) on delete cascade not null,
  alias text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Vehicle Makes (e.g. Toyota, Nissan)
create table public.vehicle_makes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Vehicle Models (e.g. Camry, Corolla)
create table public.vehicle_models (
  id uuid default gen_random_uuid() primary key,
  make_id uuid references public.vehicle_makes(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Vehicle Generations/Chassis (e.g. XV40, XV50)
create table public.vehicle_generations (
  id uuid default gen_random_uuid() primary key,
  model_id uuid references public.vehicle_models(id) on delete cascade not null,
  name text not null,
  year_start integer,
  year_end integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Engine Codes (e.g. 1AZ, 2AR)
create table public.engine_codes (
  id uuid default gen_random_uuid() primary key,
  generation_id uuid references public.vehicle_generations(id) on delete cascade,
  model_id uuid references public.vehicle_models(id) on delete cascade,
  code text not null,
  displacement text,
  fuel_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Part Numbers (OEM and Aftermarket)
create table public.part_numbers (
  id uuid default gen_random_uuid() primary key,
  part_id uuid references public.parts(id) on delete cascade not null,
  part_number text not null,
  type text default 'OEM' check (type in ('OEM', 'Aftermarket')),
  brand text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Compatibility Matrix (Junction Table)
create table public.compatibility (
  id uuid default gen_random_uuid() primary key,
  part_id uuid references public.parts(id) on delete cascade not null,
  make_id uuid references public.vehicle_makes(id) on delete cascade,
  model_id uuid references public.vehicle_models(id) on delete cascade,
  generation_id uuid references public.vehicle_generations(id) on delete cascade,
  engine_id uuid references public.engine_codes(id) on delete cascade,
  year_from integer,
  year_to integer,
  position text,
  oem_number_id uuid references public.part_numbers(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: The listings table already has a specs jsonb column which will store the selected compatibility tree.
