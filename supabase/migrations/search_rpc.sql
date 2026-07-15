-- Enable pg_trgm extension for trigram-based fuzzy matching
create extension if not exists pg_trgm;

-- Create an index to speed up trigram searches on listings (title and description)
create index if not exists listings_title_trgm_idx on public.listings using gin (title gin_trgm_ops);
create index if not exists listings_description_trgm_idx on public.listings using gin (description gin_trgm_ops);

-- Create RPC function for fuzzy searching listings
create or replace function public.search_listings(
  search_term text,
  p_category text default null,
  p_status text default 'active',
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  id uuid,
  title text,
  description text,
  price numeric,
  negotiable boolean,
  category text,
  location text,
  condition text,
  make text,
  model text,
  year integer,
  specs jsonb,
  images text[],
  seller_id uuid,
  phone text,
  whatsapp text,
  views integer,
  is_featured boolean,
  status text,
  created_at timestamp with time zone,
  similarity_score real
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    l.id, l.title, l.description, l.price, l.negotiable, l.category, l.location, l.condition, l.make, l.model, l.year, l.specs, l.images, l.seller_id, l.phone, l.whatsapp, l.views, l.is_featured, l.status, l.created_at,
    (similarity(l.title, search_term) * 2.0 + similarity(l.description, search_term))::real as similarity_score
  from public.listings l
  where 
    (l.status = p_status) and
    (p_category is null or l.category = p_category) and
    (l.title % search_term or l.description % search_term)
  order by similarity_score desc
  limit p_limit
  offset p_offset;
end;
$$;
