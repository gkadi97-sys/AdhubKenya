-- ============================================================
-- AdHub Kenya - Dynamic Filter Parity
-- Add GIN indexes on the `specs` JSONB column for fast filtering
-- ============================================================

-- Create a GIN index on the entire specs JSONB column
-- This enables fast arbitrary key/value filtering like specs->>'storage' ILIKE '%256GB%'
CREATE INDEX IF NOT EXISTS idx_listings_specs ON public.listings USING GIN (specs);

-- Create specific expression indexes for the most heavily queried deep attributes
-- This is optional but highly recommended for performance as data grows
CREATE INDEX IF NOT EXISTS idx_listings_specs_make ON public.listings ((specs->>'make'));
CREATE INDEX IF NOT EXISTS idx_listings_specs_model ON public.listings ((specs->>'model'));
CREATE INDEX IF NOT EXISTS idx_listings_specs_subcategory ON public.listings ((specs->>'subcategory'));
CREATE INDEX IF NOT EXISTS idx_listings_specs_system ON public.listings ((specs->>'system'));
CREATE INDEX IF NOT EXISTS idx_listings_specs_part ON public.listings ((specs->>'part'));
