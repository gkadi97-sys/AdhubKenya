-- ==============================================================================
-- AdHub Kenya: Profile Status Sync Trigger
-- Ensures that when a user is banned or suspended, their active listings are hidden.
-- ==============================================================================

-- 1. Retroactively fix existing listings belonging to banned/suspended users
UPDATE public.listings
SET status = 'suspended'
WHERE status = 'active'
AND seller_id IN (
    SELECT id FROM public.profiles 
    WHERE status IN ('banned', 'suspended')
);

-- 2. Create function to automatically handle profile status changes
CREATE OR REPLACE FUNCTION public.handle_profile_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If a user is being banned or suspended, hide their active/pending listings
  IF NEW.status IN ('banned', 'suspended') AND OLD.status NOT IN ('banned', 'suspended') THEN
    UPDATE public.listings
    SET status = 'suspended'
    WHERE seller_id = NEW.id AND status IN ('active', 'pending');
  END IF;

  -- If a user is reactivated, optionally return their suspended listings to active
  IF NEW.status = 'active' AND OLD.status IN ('banned', 'suspended') THEN
    UPDATE public.listings
    SET status = 'active'
    WHERE seller_id = NEW.id AND status = 'suspended';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger on the profiles table
DROP TRIGGER IF EXISTS on_profile_status_changed ON public.profiles;
CREATE TRIGGER on_profile_status_changed
  AFTER UPDATE OF status ON public.profiles
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE PROCEDURE public.handle_profile_status_change();
