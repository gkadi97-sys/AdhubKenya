-- Fix: Phones & Tablets dependencies look for old/wrong device types.
-- Currently checks for ["Smartphone", "Tablet", "Smartwatch", "Feature Phone"]
-- Actual lookup_values are ["Mobile Phones", "Tablets", "Wearables", "Feature Phones"]

UPDATE attribute_dependencies
SET dependency_value = '["Mobile Phones", "Tablets", "Wearables", "Feature Phones"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'device_type' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'))
  AND dependency_value @> '["Smartphone"]'::jsonb;
  
-- There are some that don't have Feature Phone (like OS, Storage, RAM)
-- We'll just update them specifically:

-- Update for Network, Battery (All 4)
UPDATE attribute_dependencies
SET dependency_value = '["Mobile Phones", "Tablets", "Wearables", "Feature Phones"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'device_type' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'))
  AND attribute_id IN (SELECT id FROM attributes WHERE name IN ('network', 'battery') AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'));

-- Update for Storage, RAM, OS (No Feature Phones)
UPDATE attribute_dependencies
SET dependency_value = '["Mobile Phones", "Tablets", "Wearables"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'device_type' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'))
  AND attribute_id IN (SELECT id FROM attributes WHERE name IN ('storage', 'ram', 'os') AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'));
