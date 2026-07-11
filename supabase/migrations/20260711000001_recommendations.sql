-- ============================================================
-- Recommendations Engine: Interaction Tracking & Personalization
-- Migration: 20260711000001_recommendations.sql
-- ============================================================

-- 1. Create interaction types enum
DO $$ BEGIN
    CREATE TYPE interaction_type AS ENUM ('view', 'save', 'message', 'call');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_interactions table
CREATE TABLE IF NOT EXISTS public.user_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    interaction_type interaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for fast user history lookups
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_time 
    ON public.user_interactions(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can insert their own interactions" ON public.user_interactions;
CREATE POLICY "Users can insert their own interactions"
    ON public.user_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own interactions" ON public.user_interactions;
CREATE POLICY "Users can view their own interactions"
    ON public.user_interactions FOR SELECT
    USING (auth.uid() = user_id);

-- 3. Create the get_recommendations RPC
-- Logic:
--   a. Get user's top 2 categories interacted with in last 14 days
--   b. If no categories, return general trending listings
--   c. Otherwise, return active listings from those categories, ordered by recency, 
--      excluding listings the user has already viewed/interacted with.
CREATE OR REPLACE FUNCTION public.get_recommendations(p_user_id UUID, p_limit INT DEFAULT 12)
RETURNS SETOF public.listings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_categories TEXT[];
BEGIN
    -- Find top 2 categories for this user in the last 14 days
    SELECT array_agg(category) INTO v_categories
    FROM (
        SELECT category
        FROM public.user_interactions
        WHERE user_id = p_user_id 
          AND created_at >= now() - INTERVAL '14 days'
        GROUP BY category
        ORDER BY count(*) DESC
        LIMIT 2
    ) sub;

    -- If no interactions found, return globally trending/recent listings
    IF array_length(v_categories, 1) IS NULL THEN
        RETURN QUERY
        SELECT *
        FROM public.listings
        WHERE status = 'active'
        ORDER BY created_at DESC
        LIMIT p_limit;
    ELSE
        -- Return recommended listings
        RETURN QUERY
        SELECT *
        FROM public.listings l
        WHERE l.status = 'active'
          AND l.category = ANY(v_categories)
          AND NOT EXISTS (
              -- Exclude ones they have already interacted with
              SELECT 1 FROM public.user_interactions ui 
              WHERE ui.user_id = p_user_id AND ui.listing_id = l.id
          )
        ORDER BY l.created_at DESC
        LIMIT p_limit;
    END IF;
END;
$$;
