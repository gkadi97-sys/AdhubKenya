const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const categories = [
  { id: uuidv4(), slug: 'vehicles', name: 'Vehicles' },
  { id: uuidv4(), slug: 'property', name: 'Property' }
];

const attributeGroups = {
  vehicles: [
    { id: uuidv4(), name: 'Basic Information', order: 10 },
    { id: uuidv4(), name: 'Specifications', order: 20 },
    { id: uuidv4(), name: 'Condition', order: 30 }
  ],
  property: [
    { id: uuidv4(), name: 'Basic Information', order: 10 },
    { id: uuidv4(), name: 'Features', order: 20 }
  ]
};

const attributes = [];
// Vehicle Attributes
attributes.push({
  id: uuidv4(),
  category_id: categories[0].id,
  group_id: attributeGroups.vehicles[0].id,
  name: 'make',
  label: 'Make',
  field_type: 'select',
  is_required: true,
  is_searchable: true,
  display_order: 10
});

let sql = `-- Seed Metadata\n\n`;

for (const c of categories) {
  sql += `INSERT INTO public.categories (id, slug, name, level) VALUES ('${c.id}', '${c.slug}', '${c.name}', 1) ON CONFLICT (slug) DO NOTHING;\n`;
}

for (const catSlug in attributeGroups) {
  const cat = categories.find(c => c.slug === catSlug);
  for (const g of attributeGroups[catSlug]) {
    sql += `INSERT INTO public.attribute_groups (id, category_id, name, order_index) VALUES ('${g.id}', '${cat.id}', '${g.name}', ${g.order});\n`;
  }
}

for (const a of attributes) {
  sql += `INSERT INTO public.attributes (id, category_id, group_id, name, label, field_type, is_required, is_searchable, display_order) VALUES ('${a.id}', '${a.category_id}', '${a.group_id}', '${a.name}', '${a.label}', '${a.field_type}', ${a.is_required}, ${a.is_searchable}, ${a.display_order});\n`;
}

fs.writeFileSync(path.join(__dirname, '../../supabase/migrations/20260706000001_seed_metadata.sql'), sql);
console.log('Seed SQL generated.');
