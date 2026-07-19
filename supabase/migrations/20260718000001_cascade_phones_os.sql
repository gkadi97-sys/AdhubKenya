-- Migration to make phones_os cascade from phones_brand

-- 1. Remove the old flat list of OS options
DELETE FROM lookup_values WHERE lookup_type = 'phones_os';

-- 2. Insert new cascading OS options based on brand
-- Apple -> iOS
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'iOS', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value = 'Apple';

-- Nokia -> Android, Windows, KaiOS
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'Android', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value = 'Nokia';
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'Windows', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value = 'Nokia';
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'KaiOS', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value = 'Nokia';

-- Huawei -> Android, HarmonyOS
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'Android', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value = 'Huawei';
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'HarmonyOS', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value = 'Huawei';

-- All other brands -> Android
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'Android', id FROM lookup_values WHERE lookup_type = 'phones_brand' AND value NOT IN ('Apple', 'Nokia', 'Huawei');

-- Also add 'Other' OS for all brands just in case
INSERT INTO lookup_values (lookup_type, value, parent_id)
SELECT 'phones_os', 'Other', id FROM lookup_values WHERE lookup_type = 'phones_brand';

-- 3. Update attribute dependencies to make OS cascade from brand
-- First delete the existing 'show' dependency on device_type for 'os'
DELETE FROM attribute_dependencies 
WHERE attribute_id = (SELECT id FROM attributes WHERE name = 'os' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'))
  AND depends_on_attribute_id = (SELECT id FROM attributes WHERE name = 'device_type' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets'));

-- Insert the new 'cascade' dependency on brand for 'os'
INSERT INTO attribute_dependencies (attribute_id, depends_on_attribute_id, effect, operator)
VALUES (
  (SELECT id FROM attributes WHERE name = 'os' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets')),
  (SELECT id FROM attributes WHERE name = 'brand' AND category_id = (SELECT id FROM categories WHERE slug = 'phones-tablets')),
  'cascade',
  'exists'
);
