-- Migration: Phase 9 Admin (Status column)
-- Adds status column to profiles table

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned'));

-- Allow admins to update the status column
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_p 
      WHERE admin_p.id = auth.uid() AND admin_p.role IN ('admin', 'super_admin')
    )
  );
