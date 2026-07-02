-- ==============================================================================
-- AdHub Kenya Phase 3: Marketplace Trust & UX
-- ==============================================================================

-- 1. Add 'pending' and 'rejected' to listing status constraint
-- Drop existing constraint if it exists
DO $$
BEGIN
  ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_status_check;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Add new constraint
ALTER TABLE public.listings
  ADD CONSTRAINT listings_status_check
  CHECK (status IN ('active', 'sold', 'expired', 'pending', 'rejected'));

-- 2. Create RPC for Seller Stats
-- This calculates total active listings and registration date for a given seller
CREATE OR REPLACE FUNCTION get_seller_stats(p_seller_id UUID)
RETURNS TABLE (
  total_listings BIGINT,
  member_since TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.listings WHERE seller_id = p_seller_id AND status = 'active')::BIGINT as total_listings,
    p.created_at as member_since
  FROM public.profiles p
  WHERE p.id = p_seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure 'listing_events' tracking policies allow anonymous inserts for view counting
-- (In case it was restricted in Phase 1)
ALTER TABLE public.listing_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert listing events" ON public.listing_events;
CREATE POLICY "Anyone can insert listing events" ON public.listing_events
  FOR INSERT WITH CHECK (true);

-- 4. Create RPC for Listing View Counts
CREATE OR REPLACE FUNCTION get_listing_views(p_listing_id UUID)
RETURNS BIGINT AS $$
DECLARE
  view_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO view_count
  FROM public.listing_events
  WHERE listing_id = p_listing_id AND event_type = 'view';
  
  RETURN view_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
