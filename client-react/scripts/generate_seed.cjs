const fs = require('fs');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

let sql = `-- AdHubKenya Metadata Seed SQL\n\n`;

const genId = () => uuidv4();

const catVehicles = genId();
const catProperty = genId();

sql += `INSERT INTO public.categories (id, slug, name, icon, level, order_index, is_active, allow_price, allow_negotiable, allow_location, allow_condition) VALUES 
('${catVehicles}', 'vehicles', 'Vehicles', '🚗', 1, 10, true, true, true, true, true),
('${catProperty}', 'property', 'Property', '🏠', 1, 20, true, true, true, true, false)
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;\n\n`;

const vehiclesGroups = {
  basic: genId(),
  specs: genId(),
  features: genId(),
  media: genId()
};

sql += `INSERT INTO public.attribute_groups (id, category_id, name, order_index) VALUES 
('${vehiclesGroups.basic}', '${catVehicles}', 'Basic Information', 10),
('${vehiclesGroups.specs}', '${catVehicles}', 'Specifications', 20),
('${vehiclesGroups.features}', '${catVehicles}', 'Features', 30),
('${vehiclesGroups.media}', '${catVehicles}', 'Media', 40);\n\n`;

// Lookup Tables
const lookups = [];
const addLookup = (type, value, parent = null) => {
  const id = genId();
  lookups.push(`('${id}', '${type}', '${value}', ${parent ? `'${parent}'` : 'NULL'})`);
  return id;
};

const toyotaId = addLookup('vehicle_makes', 'Toyota');
addLookup('vehicle_models', 'Corolla', toyotaId);
addLookup('vehicle_models', 'Prado', toyotaId);
addLookup('vehicle_models', 'Hilux', toyotaId);
const nissanId = addLookup('vehicle_makes', 'Nissan');
addLookup('vehicle_models', 'Note', nissanId);
addLookup('vehicle_models', 'X-Trail', nissanId);

const petrolId = addLookup('fuel_types', 'Petrol');
const dieselId = addLookup('fuel_types', 'Diesel');

const autoId = addLookup('transmission_types', 'Automatic');
const manualId = addLookup('transmission_types', 'Manual');

if (lookups.length > 0) {
  sql += `INSERT INTO public.lookup_values (id, lookup_type, value, parent_id) VALUES \n` + lookups.join(',\n') + `;\n\n`;
}

// Attributes
const attrs = [];
const addAttr = (catId, groupId, name, label, type, req, search, card, lookuptype = 'NULL', deps = null) => {
  const id = genId();
  attrs.push(`('${id}', '${catId}', '${groupId}', '${name}', '${label}', '${type}', ${req}, ${search}, ${card}, ${lookuptype !== 'NULL' ? `'${lookuptype}'` : 'NULL'})`);
  return { id, name };
};

const make = addAttr(catVehicles, vehiclesGroups.basic, 'make', 'Make', 'select', true, true, true, 'vehicle_makes');
const model = addAttr(catVehicles, vehiclesGroups.basic, 'model', 'Model', 'select', true, true, true, 'vehicle_models');
const year = addAttr(catVehicles, vehiclesGroups.basic, 'year', 'Year', 'number', true, true, true);
const mileage = addAttr(catVehicles, vehiclesGroups.basic, 'mileage', 'Mileage (km)', 'number', true, true, true);
const transmission = addAttr(catVehicles, vehiclesGroups.specs, 'transmission', 'Transmission', 'select', true, true, true, 'transmission_types');
const fuel = addAttr(catVehicles, vehiclesGroups.specs, 'fuel_type', 'Fuel Type', 'select', true, true, false, 'fuel_types');

if (attrs.length > 0) {
  sql += `INSERT INTO public.attributes (id, category_id, group_id, name, label, field_type, is_required, is_searchable, is_listing_card, lookup_type) VALUES \n` + attrs.join(',\n') + `;\n\n`;
}

// Dependencies
sql += `INSERT INTO public.attribute_dependencies (attribute_id, depends_on_attribute_id, operator, dependency_value, effect) VALUES 
('${model.id}', '${make.id}', 'exists', NULL, 'show');\n\n`;

fs.writeFileSync('d:/AdHubKenya/client-react/scripts/seed_metadata.sql', sql);
console.log('Seed SQL generated to d:/AdHubKenya/client-react/scripts/seed_metadata.sql');
