-- ==============================================================================
-- AdHub Kenya: Listing Moderation & Approval Workflow
-- ==============================================================================

-- 1. Extend the listings table
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS updated_after_review BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS revision_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE;

-- 2. Update status constraint
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_status_check 
  CHECK (status IN ('active', 'sold', 'expired', 'pending', 'rejected', 'suspended', 'draft', 'needs_revision'));

-- 3. Create Moderation Audit Logs Table
CREATE TABLE IF NOT EXISTS public.moderation_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.moderation_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.moderation_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'admin', 'moderator')
        )
    );

-- 4. Secure the listings table visibility
-- Drop the old overly permissive policy
DROP POLICY IF EXISTS "Listings are viewable by everyone." ON public.listings;

-- Create secure policy where only active/sold/expired are public, but sellers see their own, and admins see all
CREATE POLICY "Secure listings visibility" ON public.listings
    FOR SELECT USING (
        status IN ('active', 'sold', 'expired') 
        OR auth.uid() = seller_id
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'admin', 'moderator', 'support')
        )
    );

-- Note: The insert, update, and delete policies for users modifying their own listings are already configured in database-schema.sql
