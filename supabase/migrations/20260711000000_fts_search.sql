-- ============================================================
-- Search Intelligence: Full-Text Search on listings
-- Migration: 20260711000000_fts_search.sql
-- ============================================================

-- 1. Add the search_vector column (tsvector type)
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 2. Backfill search_vector for all existing listings
UPDATE public.listings
SET search_vector = to_tsvector(
  'english',
  coalesce(title, '') || ' ' ||
  coalesce(description, '') || ' ' ||
  coalesce(make, '') || ' ' ||
  coalesce(model, '') || ' ' ||
  coalesce(location, '') || ' ' ||
  coalesce(category, '')
);

-- 3. Create GIN index for fast full-text lookups
CREATE INDEX IF NOT EXISTS listings_search_vector_idx
  ON public.listings USING GIN (search_vector);

-- 4. Create trigger function to auto-update search_vector on INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.listings_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.make, '') || ' ' ||
    coalesce(NEW.model, '') || ' ' ||
    coalesce(NEW.location, '') || ' ' ||
    coalesce(NEW.category, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach trigger to listings table
DROP TRIGGER IF EXISTS listings_search_vector_trigger ON public.listings;
CREATE TRIGGER listings_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, description, make, model, location, category
  ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.listings_search_vector_update();
