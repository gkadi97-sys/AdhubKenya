-- Enterprise Location Hierarchy Schema

CREATE TABLE public.locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  type text NOT NULL, -- 'Country', 'County', 'Sub County', etc.
  latitude numeric,
  longitude numeric,
  postal_code text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup and path traversal
CREATE INDEX idx_locations_parent ON public.locations(parent_id);
CREATE INDEX idx_locations_slug ON public.locations(slug);

-- Add to listings
ALTER TABLE public.listings 
  ADD COLUMN location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN lat numeric,
  ADD COLUMN lng numeric;

-- Function to get the full hierarchy path for a location
CREATE OR REPLACE FUNCTION get_location_path(target_id uuid)
RETURNS TABLE (
  id uuid,
  parent_id uuid,
  name text,
  slug text,
  type text,
  level int
) AS $$
WITH RECURSIVE location_tree AS (
  -- Base case: the target location
  SELECT l.id, l.parent_id, l.name, l.slug, l.type, 1 as level
  FROM locations l
  WHERE l.id = target_id
  
  UNION ALL
  
  -- Recursive step: find parent
  SELECT l.id, l.parent_id, l.name, l.slug, l.type, t.level + 1
  FROM locations l
  JOIN location_tree t ON t.parent_id = l.id
)
SELECT id, parent_id, name, slug, type, level
FROM location_tree
ORDER BY level DESC;
$$ LANGUAGE sql STABLE;

-- Geospatial distance calculation using Haversine formula (returns distance in km)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS numeric AS $$
DECLARE
    x numeric = 69.1 * (lat2 - lat1);
    y numeric = 69.1 * (lon2 - lon1) * cos(lat1 / 57.3);
BEGIN
    RETURN sqrt(x * x + y * y) * 1.60934; -- Return in km
END
$$ LANGUAGE plpgsql IMMUTABLE;

-- Search listings by radius
CREATE OR REPLACE FUNCTION search_listings_by_radius(
  target_lat numeric,
  target_lng numeric,
  radius_km numeric
)
RETURNS SETOF public.listings AS $$
BEGIN
  RETURN QUERY
  SELECT l.*
  FROM public.listings l
  WHERE l.lat IS NOT NULL 
    AND l.lng IS NOT NULL
    AND calculate_distance(target_lat, target_lng, l.lat, l.lng) <= radius_km
    AND l.status = 'active';
END;
$$ LANGUAGE plpgsql STABLE;
