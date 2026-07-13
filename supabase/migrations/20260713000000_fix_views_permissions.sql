-- ==============================================================================
-- Fix: Grant anon access to view counts + atomic increment of listings.views
-- ==============================================================================

-- 1. Grant EXECUTE on get_listing_views to both anon and authenticated roles
--    (previously only authenticated users could call it, causing guests to see 0)
GRANT EXECUTE ON FUNCTION get_listing_views(UUID) TO anon, authenticated;

-- 2. Create an atomic increment-and-return function that:
--    - Increments listings.views directly on the row (no RLS issues — SECURITY DEFINER)
--    - Inserts a listing_event for analytics
--    - Returns the new view count
--    This replaces the two-step client-side fire-and-forget approach.
DROP FUNCTION IF EXISTS increment_listing_views(UUID);
CREATE OR REPLACE FUNCTION increment_listing_views(p_listing_id UUID)
RETURNS INT AS $$
DECLARE
  new_views INT;
BEGIN
  -- Atomically increment the views counter on the listing
  UPDATE public.listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = p_listing_id
  RETURNING views INTO new_views;

  -- Also record the event for analytics
  INSERT INTO public.listing_events (listing_id, event_type)
  VALUES (p_listing_id, 'view');

  RETURN COALESCE(new_views, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant to both roles so any visitor (logged-in or not) can call it
GRANT EXECUTE ON FUNCTION increment_listing_views(UUID) TO anon, authenticated;
