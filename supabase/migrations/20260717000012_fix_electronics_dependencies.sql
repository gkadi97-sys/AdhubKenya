-- Fix Electronics dependencies plural mismatch
-- Actual lookup_values: ["Smartphone", "Tablet", "Laptop / Computer", "Smart TV / Monitor", "Smart Watch / Wearable", "Audio / Speakers", "Camera / DSLR", "Gaming Console"]
-- Old dependency_values: ["Smartphones", "Tablets", "Laptops / Computers", "TVs / Monitors", "Smartwatches", "Cameras", "Gaming Consoles"]

-- 1. batteryMah
UPDATE attribute_dependencies
SET dependency_value = '["Smartphone", "Tablet", "Laptop / Computer", "Smart Watch / Wearable", "Audio / Speakers", "Camera / DSLR"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'subcategory' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'))
  AND attribute_id = (SELECT id FROM attributes WHERE name = 'batteryMah' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'));

-- 2. storageGB
UPDATE attribute_dependencies
SET dependency_value = '["Smartphone", "Tablet", "Laptop / Computer", "Gaming Console", "Camera / DSLR", "Smart Watch / Wearable"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'subcategory' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'))
  AND attribute_id = (SELECT id FROM attributes WHERE name = 'storageGB' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'));

-- 3. ramGB
UPDATE attribute_dependencies
SET dependency_value = '["Smartphone", "Tablet", "Laptop / Computer", "Smart Watch / Wearable"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'subcategory' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'))
  AND attribute_id = (SELECT id FROM attributes WHERE name = 'ramGB' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'));

-- 4. displaySize
UPDATE attribute_dependencies
SET dependency_value = '["Smartphone", "Tablet", "Laptop / Computer", "Smart TV / Monitor", "Smart Watch / Wearable"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'subcategory' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'))
  AND attribute_id = (SELECT id FROM attributes WHERE name = 'displaySize' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'));

-- 5. os
UPDATE attribute_dependencies
SET dependency_value = '["Smartphone", "Tablet", "Laptop / Computer", "Smart Watch / Wearable", "Smart TV / Monitor"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'subcategory' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'))
  AND attribute_id = (SELECT id FROM attributes WHERE name = 'os' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'));

-- 6. cpuChip
UPDATE attribute_dependencies
SET dependency_value = '["Smartphone", "Tablet", "Laptop / Computer", "Smart Watch / Wearable"]'::jsonb
WHERE depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'subcategory' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'))
  AND attribute_id = (SELECT id FROM attributes WHERE name = 'cpuChip' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics'));
