-- ============================================================
-- AdHub Kenya Admin Panel - Supabase SQL Migration v1
-- ============================================================

-- 1. Add 'role' column to profiles table (safe - IF NOT EXISTS)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- 2. Add CHECK constraint for role (drop if exists to avoid errors on re-run)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin','admin','moderator','support','finance','content_reviewer','analytics_viewer','user'));

-- 3. Expand status column on listings to include admin moderation statuses
ALTER TABLE public.listings
  DROP CONSTRAINT IF EXISTS listings_status_check;

ALTER TABLE public.listings
  ADD CONSTRAINT listings_status_check
  CHECK (status IN ('active','pending','rejected','archived','expired','sold'));

-- 4. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,
  target_type  TEXT,
  target_id    TEXT,
  details      JSONB,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 5. Performance indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id  ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created   ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status      ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role        ON public.profiles(role);

-- 6. RLS: Enable and add admin policy for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','moderator')
    )
  );

-- 7. Allow admins to update any listing (for moderation)
DROP POLICY IF EXISTS "Admins can update any listing" ON public.listings;
CREATE POLICY "Admins can update any listing"
  ON public.listings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','moderator')
    )
  );

-- 8. Allow admins to delete any listing
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.listings;
CREATE POLICY "Admins can delete any listing"
  ON public.listings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','moderator')
    )
  );

-- ============================================================
-- DONE. Verify with:
--   SELECT id, name, email, role FROM public.profiles LIMIT 10;
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_name='profiles' AND column_name='role';
-- ============================================================
