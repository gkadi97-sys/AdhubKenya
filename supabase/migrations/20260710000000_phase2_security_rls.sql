-- Phase 2 Security RLS

-- 1. Metadata Admin Policies
-- Admins can INSERT, UPDATE, DELETE in metadata tables.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.is_admin());

-- Attribute Groups
DROP POLICY IF EXISTS "Admins can insert attribute_groups" ON public.attribute_groups;
DROP POLICY IF EXISTS "Admins can update attribute_groups" ON public.attribute_groups;
DROP POLICY IF EXISTS "Admins can delete attribute_groups" ON public.attribute_groups;

CREATE POLICY "Admins can insert attribute_groups" ON public.attribute_groups FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update attribute_groups" ON public.attribute_groups FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete attribute_groups" ON public.attribute_groups FOR DELETE USING (public.is_admin());

-- Attributes
DROP POLICY IF EXISTS "Admins can insert attributes" ON public.attributes;
DROP POLICY IF EXISTS "Admins can update attributes" ON public.attributes;
DROP POLICY IF EXISTS "Admins can delete attributes" ON public.attributes;

CREATE POLICY "Admins can insert attributes" ON public.attributes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update attributes" ON public.attributes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete attributes" ON public.attributes FOR DELETE USING (public.is_admin());

-- Attribute Dependencies
DROP POLICY IF EXISTS "Admins can insert attribute_dependencies" ON public.attribute_dependencies;
DROP POLICY IF EXISTS "Admins can update attribute_dependencies" ON public.attribute_dependencies;
DROP POLICY IF EXISTS "Admins can delete attribute_dependencies" ON public.attribute_dependencies;

CREATE POLICY "Admins can insert attribute_dependencies" ON public.attribute_dependencies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update attribute_dependencies" ON public.attribute_dependencies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete attribute_dependencies" ON public.attribute_dependencies FOR DELETE USING (public.is_admin());

-- Lookup Values
DROP POLICY IF EXISTS "Admins can insert lookup_values" ON public.lookup_values;
DROP POLICY IF EXISTS "Admins can update lookup_values" ON public.lookup_values;
DROP POLICY IF EXISTS "Admins can delete lookup_values" ON public.lookup_values;

CREATE POLICY "Admins can insert lookup_values" ON public.lookup_values FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update lookup_values" ON public.lookup_values FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete lookup_values" ON public.lookup_values FOR DELETE USING (public.is_admin());

-- 2. Storage Upload Policies
-- Fix listing-images
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Users can upload images to their own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (
      RIGHT(LOWER(name), 4) IN ('.jpg', '.png') OR
      RIGHT(LOWER(name), 5) IN ('.jpeg', '.webp')
    )
  );

-- Fix cv-documents
DROP POLICY IF EXISTS "Authenticated users can upload cv" ON storage.objects;
CREATE POLICY "Users can upload cvs to their own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cv-documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (
      RIGHT(LOWER(name), 4) IN ('.pdf', '.doc') OR
      RIGHT(LOWER(name), 5) IN ('.docx')
    )
  );
