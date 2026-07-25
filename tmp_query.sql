SELECT slug, name, parent_id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE slug = 'animals-pets') ORDER BY name;
