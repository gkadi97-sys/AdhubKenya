-- AdHubKenya Metadata Seed SQL

INSERT INTO public.categories (id, slug, name, icon, level, order_index, is_active, allow_price, allow_negotiable, allow_location, allow_condition) VALUES 
('afd9220b-7e93-4999-bf65-d130edb6e5ba', 'vehicles', 'Vehicles', '🚗', 1, 10, true, true, true, true, true),
('19bc09e2-85cc-4564-9cfb-58fb685401f4', 'property', 'Property', '🏠', 1, 20, true, true, true, true, false)
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;

INSERT INTO public.attribute_groups (id, category_id, name, order_index) VALUES 
('1f99e5a5-015e-44b2-a8ed-e8c037e329ce', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', 'Basic Information', 10),
('2babf927-60b7-4d96-b820-76485d42e38d', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', 'Specifications', 20),
('82e29d7b-bf62-492e-af3a-c03a18d272e8', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', 'Features', 30),
('2c217f0f-b488-4b15-a29e-a93311fb12b4', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', 'Media', 40);

INSERT INTO public.lookup_values (id, lookup_type, value, parent_id) VALUES 
('cde43bb2-ce31-4bfd-85e8-1c65b9f54029', 'vehicle_makes', 'Toyota', NULL),
('6e74c3b8-58ee-4137-9b27-0c2ab5eb8295', 'vehicle_models', 'Corolla', 'cde43bb2-ce31-4bfd-85e8-1c65b9f54029'),
('d00b68be-78f7-47e9-92be-4752157ae35f', 'vehicle_models', 'Prado', 'cde43bb2-ce31-4bfd-85e8-1c65b9f54029'),
('642e96ef-b94f-474c-96e8-5098c4a1cec8', 'vehicle_models', 'Hilux', 'cde43bb2-ce31-4bfd-85e8-1c65b9f54029'),
('e0447675-34da-4abf-a1af-ff0883d15349', 'vehicle_makes', 'Nissan', NULL),
('1e67c4be-7224-43ca-be17-06fede59380e', 'vehicle_models', 'Note', 'e0447675-34da-4abf-a1af-ff0883d15349'),
('dd40e959-25ae-4432-b276-5daa8f720f99', 'vehicle_models', 'X-Trail', 'e0447675-34da-4abf-a1af-ff0883d15349'),
('642f9f71-5105-4e16-b310-c9e877e30f55', 'fuel_types', 'Petrol', NULL),
('2134ed57-f9f7-4772-9a00-61bf06bfee8e', 'fuel_types', 'Diesel', NULL),
('dd11a14d-990b-49c9-aa39-4e23d1a9c150', 'fuel_types', 'Hybrid (Petrol-Electric)', NULL),
('581a64ed-8cd5-48e9-8f29-1504caf6b3fb', 'fuel_types', 'Plug-in Hybrid (PHEV)', NULL),
('0dab2ee4-beb5-4094-b3fc-19ac60945c72', 'fuel_types', 'Electric (EV)', NULL),
('6e1b45ff-659b-4c9b-8e79-8207b48fe834', 'fuel_types', 'LPG / Gas', NULL),
('530d3e3c-605c-4968-bc7f-355d7549c3d3', 'fuel_types', 'Petrol-LPG (Dual Fuel)', NULL),
('bcef5c5e-fa35-4362-9369-0df8325673e8', 'transmission_types', 'Automatic', NULL),
('70cd00af-c72f-4ec6-9607-fc7aa0287377', 'transmission_types', 'Manual', NULL),
('cefab1ce-b82a-42b4-9b49-14dcacebf4e8', 'transmission_types', 'CVT (Continuously Variable Transmission)', NULL),
('bc77a50d-3719-4641-a1d4-0572acc28bf8', 'transmission_types', 'AMT (Automated Manual Transmission)', NULL),
('db3f573d-caf5-4c3f-8d00-22955b464383', 'transmission_types', 'Dual-Clutch (DCT / DSG)', NULL),
('ce20f99d-bc68-4df5-8540-77ad03d1fda6', 'transmission_types', 'Semi-Automatic / Tiptronic', NULL),
('c958b340-5edd-4bc0-8c3f-08a8ffcc3028', 'vehicle_conditions', 'Brand New', NULL),
('d8ee8ab6-55ee-4c04-bfa5-348c40399e60', 'vehicle_conditions', 'Foreign Used', NULL),
('66bc8d0f-2ba2-4714-97f2-b2cae4d4f6ab', 'vehicle_conditions', 'Locally Used', NULL),
('f72b569e-5328-4a5b-baf9-94235f24acc7', 'vehicle_drive_types', '2WD', NULL),
('c91ed105-bdc1-48b9-a78d-b90be1e4a885', 'vehicle_drive_types', '4WD', NULL),
('c2cb5864-56d3-4b63-ae42-2314f8714742', 'vehicle_drive_types', 'AWD', NULL);

INSERT INTO public.attributes (id, category_id, group_id, name, label, field_type, is_required, is_searchable, is_listing_card, lookup_type) VALUES 
('8a1212b7-eb4e-4db7-80df-f727a17f0ae6', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '1f99e5a5-015e-44b2-a8ed-e8c037e329ce', 'make', 'Make', 'select', true, true, true, 'vehicle_makes'),
('f554c457-3f4d-4d65-801f-295953ba1938', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '1f99e5a5-015e-44b2-a8ed-e8c037e329ce', 'model', 'Model', 'select', true, true, true, 'vehicle_models'),
('b24d23f5-c7e2-4cb7-bf3c-8c81b1105cad', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '1f99e5a5-015e-44b2-a8ed-e8c037e329ce', 'year', 'Year', 'number', true, true, true, NULL),
('c93cead1-f4c4-4a4d-836b-e26e9d290295', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '1f99e5a5-015e-44b2-a8ed-e8c037e329ce', 'mileage', 'Mileage (km)', 'number', true, true, true, NULL),
('12debcff-2b77-4012-9f59-8619f3fda719', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '1f99e5a5-015e-44b2-a8ed-e8c037e329ce', 'condition', 'Condition', 'select', true, true, true, 'vehicle_conditions'),
('db8cabbd-7231-4804-8d61-f8b82ec16157', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '2babf927-60b7-4d96-b820-76485d42e38d', 'transmission', 'Transmission', 'select', true, true, true, 'transmission_types'),
('5332b572-82b4-46f8-8c94-ef8b479a5176', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '2babf927-60b7-4d96-b820-76485d42e38d', 'fuel_type', 'Fuel Type', 'select', true, true, false, 'fuel_types'),
('f2b233a1-98ce-4531-8220-0a4cab5aebcc', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '2babf927-60b7-4d96-b820-76485d42e38d', 'drive_type', 'Drive Type', 'select', false, true, false, 'vehicle_drive_types'),
('aec63d01-fd8c-4267-8d11-cb81c148d06c', 'afd9220b-7e93-4999-bf65-d130edb6e5ba', '2babf927-60b7-4d96-b820-76485d42e38d', 'engine_size', 'Engine Size (CC)', 'number', false, true, false, NULL);

INSERT INTO public.attribute_dependencies (attribute_id, depends_on_attribute_id, operator, dependency_value, effect) VALUES 
('f554c457-3f4d-4d65-801f-295953ba1938', '8a1212b7-eb4e-4db7-80df-f727a17f0ae6', 'exists', NULL, 'show');

