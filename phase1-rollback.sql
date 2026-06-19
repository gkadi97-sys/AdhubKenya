-- ==============================================================================
-- AdHubKenya Phase 1 Rollback
-- ==============================================================================

-- 3. Analytics
DROP TABLE IF EXISTS public.listing_events CASCADE;

-- 2. Retention
DROP TABLE IF EXISTS public.saved_searches CASCADE;

-- 1. Trust
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS is_phone_verified,
DROP COLUMN IF EXISTS is_email_verified,
DROP COLUMN IF EXISTS is_business_verified,
DROP COLUMN IF EXISTS business_name;
