-- AdHubKenya Metadata Seed SQL

INSERT INTO public.categories (id, slug, name, icon, level, order_index, is_active, allow_price, allow_negotiable, allow_location, allow_condition) VALUES 
('99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'vehicles', 'Vehicles', '🚗', 1, 10, true, true, true, true, true),
('593b5ab1-9255-49f4-99da-bce9f4399e12', 'property', 'Property', '🏠', 1, 20, true, true, true, true, false)
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;

INSERT INTO public.attribute_groups (id, category_id, name, order_index) VALUES 
('9f8440c8-afdb-4ddc-9072-9fff1287c7d6', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'Basic Information', 10),
('fad22d01-8405-4adf-bbf2-acbd92ecc13e', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'Specifications', 20),
('5f335068-e6b6-4351-afe6-cc1cd71aaa35', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'Features', 30),
('c033eda9-33d8-49c8-9c6b-4d4ce1c5985d', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'Media', 40);

INSERT INTO public.lookup_values (id, lookup_type, value, parent_id) VALUES 
('8e0fdcee-8516-42c4-bdd3-bcf1a8feaed9', 'vehicle_makes', 'Toyota', NULL),
('e7039657-2704-4880-8c61-520f5b15fe2c', 'vehicle_models', 'Corolla', '8e0fdcee-8516-42c4-bdd3-bcf1a8feaed9'),
('eab4070d-6f3b-4de5-bdb6-64d8e8bed36e', 'vehicle_models', 'Prado', '8e0fdcee-8516-42c4-bdd3-bcf1a8feaed9'),
('f02afb5e-3b01-4a1d-a86c-eb3a3147361c', 'vehicle_models', 'Hilux', '8e0fdcee-8516-42c4-bdd3-bcf1a8feaed9'),
('8ed29d10-0da6-4e60-957d-0ca7fbf3d07d', 'vehicle_makes', 'Nissan', NULL),
('422aab83-653d-4ab9-af51-0dc8f5e8cc6e', 'vehicle_models', 'Note', '8ed29d10-0da6-4e60-957d-0ca7fbf3d07d'),
('99208a58-1e1b-4fb5-bf45-d579b4fe4913', 'vehicle_models', 'X-Trail', '8ed29d10-0da6-4e60-957d-0ca7fbf3d07d'),
('dada594b-be95-4c76-98de-c893500d97e7', 'fuel_types', 'Petrol', NULL),
('0c86a63a-be80-414d-92ff-6ad8f37b48a7', 'fuel_types', 'Diesel', NULL),
('2c4015cb-77c0-4d4f-b09c-62be87951a8f', 'transmission_types', 'Automatic', NULL),
('9588789e-90e4-4efc-9252-6404594b88fc', 'transmission_types', 'Manual', NULL);

INSERT INTO public.attributes (id, category_id, group_id, name, label, field_type, is_required, is_searchable, is_listing_card, lookup_type) VALUES 
('2cd15dde-833c-4b0c-bb88-cfe9810d90b3', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', '9f8440c8-afdb-4ddc-9072-9fff1287c7d6', 'make', 'Make', 'select', true, true, true, 'vehicle_makes'),
('9ae17333-34c7-4684-9049-4beb34f0e7e9', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', '9f8440c8-afdb-4ddc-9072-9fff1287c7d6', 'model', 'Model', 'select', true, true, true, 'vehicle_models'),
('e54902fe-e5c0-42f3-b04b-eb33d515421b', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', '9f8440c8-afdb-4ddc-9072-9fff1287c7d6', 'year', 'Year', 'number', true, true, true, NULL),
('ca5d7aa2-d5de-49a8-8abd-217adbc92b41', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', '9f8440c8-afdb-4ddc-9072-9fff1287c7d6', 'mileage', 'Mileage (km)', 'number', true, true, true, NULL),
('3213f0fc-f734-410e-8515-e23be219bcb0', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'fad22d01-8405-4adf-bbf2-acbd92ecc13e', 'transmission', 'Transmission', 'select', true, true, true, 'transmission_types'),
('9195094d-91ac-4b0d-b196-17ea2ff409d0', '99e7fdfd-463a-46f8-8651-af8d5cf883e1', 'fad22d01-8405-4adf-bbf2-acbd92ecc13e', 'fuel_type', 'Fuel Type', 'select', true, true, false, 'fuel_types');

INSERT INTO public.attribute_dependencies (attribute_id, depends_on_attribute_id, operator, dependency_value, effect) VALUES 
('9ae17333-34c7-4684-9049-4beb34f0e7e9', '2cd15dde-833c-4b0c-bb88-cfe9810d90b3', 'exists', NULL, 'show');

