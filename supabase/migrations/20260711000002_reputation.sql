-- ============================================================
-- Reputation Engine: Reviews & Ratings
-- Migration: 20260711000002_reputation.sql
-- ============================================================

-- 1. Update Profiles Table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- 2. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    -- Prevent users from reviewing the same person multiple times
    CONSTRAINT unique_reviewer_reviewee UNIQUE (reviewer_id, reviewee_id),
    -- Prevent users from reviewing themselves
    CONSTRAINT check_not_self_review CHECK (reviewer_id != reviewee_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON public.reviews(reviewer_id);

-- 3. Enable RLS and Policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
CREATE POLICY "Anyone can read reviews"
    ON public.reviews FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = reviewer_id)
    WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE
    USING (auth.uid() = reviewer_id);

-- 4. Trigger to Auto-Calculate Ratings
-- This function recalculates the average_rating and review_count for a reviewee
CREATE OR REPLACE FUNCTION public.calculate_user_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
    new_avg NUMERIC;
    new_count INT;
BEGIN
    -- Determine which user's profile to update
    IF TG_OP = 'DELETE' THEN
        target_user_id := OLD.reviewee_id;
    ELSE
        target_user_id := NEW.reviewee_id;
    END IF;

    -- Calculate the new stats
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00), 
        COUNT(*)
    INTO new_avg, new_count
    FROM public.reviews
    WHERE reviewee_id = target_user_id;

    -- Update the profiles table
    UPDATE public.profiles
    SET average_rating = new_avg,
        review_count = new_count
    WHERE id = target_user_id;

    RETURN NULL; -- AFTER triggers can return NULL
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trg_update_user_rating ON public.reviews;

CREATE TRIGGER trg_update_user_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.calculate_user_rating();
