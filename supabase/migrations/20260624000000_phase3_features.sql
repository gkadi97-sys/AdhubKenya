-- ==============================================================================
-- PHASE 3 MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor to enable Saved Searches and Promoted Ads
-- ==============================================================================

-- 1. Create the `saved_searches` table
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    keyword TEXT,
    filters JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add Row Level Security (RLS) to `saved_searches`
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own saved searches" ON public.saved_searches;
CREATE POLICY "Users can view their own saved searches"
    ON public.saved_searches FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved searches" ON public.saved_searches;
CREATE POLICY "Users can insert their own saved searches"
    ON public.saved_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved searches" ON public.saved_searches;
CREATE POLICY "Users can delete their own saved searches"
    ON public.saved_searches FOR DELETE
    USING (auth.uid() = user_id);


-- 2. Add Promotion columns to `listings` table
-- `promoted_until` tracks when the premium status expires.
-- `badge_type` can be 'featured', 'urgent', or NULL.
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS promoted_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS badge_type TEXT;

-- 3. Create a helper function for the frontend to easily fetch featured listings
DROP FUNCTION IF EXISTS get_featured_listings(int);
CREATE OR REPLACE FUNCTION get_featured_listings(lim INT DEFAULT 6)
RETURNS SETOF public.listings
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM public.listings
  WHERE status = 'active'
    AND promoted_until IS NOT NULL
    AND promoted_until > NOW()
  ORDER BY promoted_until DESC
  LIMIT lim;
$$;
