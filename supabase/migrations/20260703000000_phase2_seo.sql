-- ==============================================================================
-- AdHub Kenya Phase 2: SEO & Performance Migration
-- ==============================================================================

-- 1. Add slug column to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create a function to generate slugs
DROP FUNCTION IF EXISTS generate_listing_slug(text, uuid);
CREATE OR REPLACE FUNCTION generate_listing_slug(title TEXT, id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  short_id TEXT;
BEGIN
  -- Take first 6 chars of UUID (no dashes) as short ID
  short_id := LOWER(REPLACE(id::TEXT, '-', '')) ;
  short_id := SUBSTRING(short_id FROM 1 FOR 8);

  -- Slugify the title: lowercase, replace non-alphanumeric with dash, trim dashes
  base_slug := LOWER(TRIM(title));
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '-{2,}', '-', 'g');
  base_slug := TRIM(base_slug, '-');
  -- Truncate to 60 chars
  base_slug := SUBSTRING(base_slug FROM 1 FOR 60);
  base_slug := TRIM(base_slug, '-');

  RETURN base_slug || '-' || short_id;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Backfill slugs for all existing listings that don't have one
UPDATE public.listings
SET slug = generate_listing_slug(title, id)
WHERE slug IS NULL OR slug = '';

-- 4. Create a trigger to auto-generate slug on INSERT if not provided
DROP FUNCTION IF EXISTS set_listing_slug();
CREATE OR REPLACE FUNCTION set_listing_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_listing_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_listing_slug ON public.listings;
CREATE TRIGGER trg_set_listing_slug
  BEFORE INSERT OR UPDATE OF title ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION set_listing_slug();

-- 5. Add a unique index on slug for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_slug ON public.listings(slug);

-- 6. Add a regular index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_listings_slug_text ON public.listings USING gin(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '')));

-- 7. Add search_events table for trending searches
CREATE TABLE IF NOT EXISTS public.search_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_events_keyword ON public.search_events(keyword);
CREATE INDEX IF NOT EXISTS idx_search_events_created ON public.search_events(created_at DESC);

-- Allow anonymous inserts for tracking
ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert search events" ON public.search_events;
CREATE POLICY "Anyone can insert search events" ON public.search_events
  FOR INSERT WITH CHECK (true);

-- 8. RPC function to get trending searches
DROP FUNCTION IF EXISTS get_trending_searches(int);
CREATE OR REPLACE FUNCTION get_trending_searches(limit_n INT DEFAULT 8)
RETURNS TABLE(keyword TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT se.keyword, COUNT(*) as count
  FROM public.search_events se
  WHERE se.created_at > NOW() - INTERVAL '7 days'
    AND LENGTH(se.keyword) > 2
  GROUP BY se.keyword
  ORDER BY count DESC
  LIMIT limit_n;
END;
$$ LANGUAGE plpgsql;

-- 9. RPC to get listing counts by county (for Browse by Location section)
DROP FUNCTION IF EXISTS get_county_counts();
CREATE OR REPLACE FUNCTION get_county_counts()
RETURNS TABLE(county TEXT, listing_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    SPLIT_PART(l.location, ',', 1) AS county,
    COUNT(*) AS listing_count
  FROM public.listings l
  WHERE l.status = 'active'
  GROUP BY SPLIT_PART(l.location, ',', 1)
  ORDER BY listing_count DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;
