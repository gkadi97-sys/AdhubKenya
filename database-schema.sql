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
