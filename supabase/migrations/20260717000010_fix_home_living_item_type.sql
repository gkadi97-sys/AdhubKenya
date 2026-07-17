-- Fix: home-living "Item Type" (name=model) has wrong lookup_type 'vehicle_model'
-- This field should be a free-text field (brand/item type) since home-living items
-- don't use the vehicle model cascade chain. Change to NULL so it renders as text input.
UPDATE attributes
SET 
  lookup_type = NULL,
  field_type  = 'text'
WHERE id = '5ce5b999-309e-4fc0-9a24-4b7c9d7aa65e'
  AND category_id = (SELECT id FROM categories WHERE slug = 'home-living');
