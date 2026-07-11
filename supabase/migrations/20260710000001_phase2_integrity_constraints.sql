-- Phase 2 Data Integrity Constraints

-- 1. Metadata Uniqueness
-- Ensure that within a specific category, an attribute name is unique.
-- This prevents the metadata engine from loading duplicate form fields.
ALTER TABLE public.attributes 
  ADD CONSTRAINT unique_category_attribute_name UNIQUE (category_id, name);

-- 2. Listings Category Reference
-- The listings table currently stores category as TEXT but does not reference the categories table.
-- Let's add a foreign key constraint to ensure listings only reference valid category slugs.
-- Note: existing listings with invalid categories might break this, but cleanup_duplicates.sql 
-- and other phase 1 scripts should have already cleaned them up.
ALTER TABLE public.listings 
  ADD CONSTRAINT fk_listings_category 
  FOREIGN KEY (category) 
  REFERENCES public.categories(slug) 
  ON UPDATE CASCADE 
  ON DELETE RESTRICT;

-- 3. Lookup Values Uniqueness
-- Ensure that within a specific lookup type and parent, the value is unique.
-- COALESCE is used for parent_id because NULLs are not considered equal in standard UNIQUE constraints.
CREATE UNIQUE INDEX unique_lookup_value_per_type_and_parent 
  ON public.lookup_values (lookup_type, value, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- 4. Attribute Dependencies 
-- Add unique constraint to prevent duplicate rules for the same attribute and target.
ALTER TABLE public.attribute_dependencies
  ADD CONSTRAINT unique_attribute_dependency UNIQUE (attribute_id, depends_on_attribute_id);
