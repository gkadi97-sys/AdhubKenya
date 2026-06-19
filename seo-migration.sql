-- ==============================================================================
-- AdHubKenya SEO & Location Hierarchy Migration
-- ==============================================================================

-- 1. SEO Metadata Overrides
-- Allows marketers to override generated titles and descriptions for specific programmatic hubs.
CREATE TABLE public.seo_metadata (
    id SERIAL PRIMARY KEY,
    route_pattern VARCHAR(255) UNIQUE NOT NULL, -- e.g., 'vehicles/cars/nairobi'
    h1_override VARCHAR(255),
    title_override VARCHAR(255),
    description_override TEXT,
    faq_json JSONB, -- Schema.org FAQ structured data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Granular Location Taxonomy (Counties, Towns, Estates)
CREATE TABLE public.locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    level INT NOT NULL, -- 1: County, 2: Town/Constituency, 3: Estate/Ward
    parent_id INT REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast location lookups
CREATE INDEX idx_locations_parent ON public.locations(parent_id);
CREATE INDEX idx_locations_slug ON public.locations(slug);

-- 3. Update Listings to reference explicit location IDs instead of plain text
ALTER TABLE public.listings 
ADD COLUMN location_id INT REFERENCES public.locations(id) ON DELETE SET NULL;

-- 4. Materialized View for Category x Location counts (Fast Programmatic Pages)
CREATE MATERIALIZED VIEW public.category_location_counts AS
SELECT 
    l.category, 
    loc.id as location_id,
    loc.slug as location_slug,
    COUNT(l.id) as active_listings 
FROM public.listings l
JOIN public.locations loc ON l.location_id = loc.id
WHERE l.status = 'active'
GROUP BY l.category, loc.id, loc.slug;

CREATE UNIQUE INDEX idx_cat_loc ON public.category_location_counts(category, location_id);

-- 5. Function & Trigger to refresh Materialized View (Nightly or on insert/update)
CREATE OR REPLACE FUNCTION refresh_category_location_counts()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- We use CONCURRENTLY if possible, but requires the unique index created above
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.category_location_counts;
  RETURN NULL;
END;
$$;

-- Trigger to refresh counts when listings change
CREATE TRIGGER refresh_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.listings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_category_location_counts();

-- 6. Insert Core Counties for Kenya (Example dataset)
INSERT INTO public.locations (name, slug, level, parent_id) VALUES
('Nairobi', 'nairobi', 1, NULL),
('Mombasa', 'mombasa', 1, NULL),
('Kiambu', 'kiambu', 1, NULL),
('Nakuru', 'nakuru', 1, NULL),
('Kajiado', 'kajiado', 1, NULL),
('Machakos', 'machakos', 1, NULL),
('Kisumu', 'kisumu', 1, NULL);

-- Insert Top Estates in Nairobi
INSERT INTO public.locations (name, slug, level, parent_id) VALUES
('Kilimani', 'kilimani', 3, (SELECT id FROM public.locations WHERE slug = 'nairobi')),
('Kileleshwa', 'kileleshwa', 3, (SELECT id FROM public.locations WHERE slug = 'nairobi')),
('Westlands', 'westlands', 3, (SELECT id FROM public.locations WHERE slug = 'nairobi')),
('Roysambu', 'roysambu', 3, (SELECT id FROM public.locations WHERE slug = 'nairobi'));
