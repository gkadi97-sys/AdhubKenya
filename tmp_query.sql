SELECT id, slug, name FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = 'vehicles');
