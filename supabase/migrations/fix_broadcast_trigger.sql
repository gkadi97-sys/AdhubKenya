-- Drop the old INSERT trigger
DROP TRIGGER IF EXISTS "broadcast-new-listing" ON public.listings;

-- Create a new trigger function that only fires on approval (status change to 'active')
CREATE OR REPLACE FUNCTION broadcast_on_approval() RETURNS trigger AS '
BEGIN
  IF NEW.status = ''active'' AND (OLD.status IS NULL OR OLD.status <> ''active'') THEN
    PERFORM net.http_post(
      ''https://htezwjuiboordwjclton.supabase.co/functions/v1/social-broadcast'',
      jsonb_build_object(''type'', ''UPDATE'', ''table'', ''listings'', ''record'', row_to_json(NEW)::jsonb),
      ''{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZXp3anVpYm9vcmR3amNsdG9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU5OTY1MywiZXhwIjoyMDk3MTc1NjUzfQ.KkIuNb9Go87gSi_RA2zNiGne_ZWkSfNmgOrpprNStbI"}''::jsonb,
      ''{}''::jsonb,
      5000
    );
  END IF;
  RETURN NEW;
END;
' LANGUAGE plpgsql;

-- Create the UPDATE trigger
CREATE TRIGGER "broadcast-listing-approved"
  AFTER UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION broadcast_on_approval();
