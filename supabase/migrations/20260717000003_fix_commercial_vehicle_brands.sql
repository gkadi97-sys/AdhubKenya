-- Fix Commercial Vehicle Brands
-- Add cascade dependency so Make / Brand filters by Vehicle Type
INSERT INTO public.attribute_dependencies (attribute_id, depends_on_attribute_id, effect, operator)
VALUES ('3696cf87-3cba-4d14-8cca-baddd5170b0a', 'd8b190f6-b0fe-4a03-adef-5a1a28b45958', 'cascade', 'exists');

-- 1. Lorry / Truck (be902a8e-034e-45ee-b35e-5e0f9b574dc5)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Isuzu', 1, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Mitsubishi Fuso', 2, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Toyota', 3, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Hino', 4, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Scania', 5, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Mercedes-Benz', 6, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'MAN', 7, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Volvo', 8, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'UD Trucks', 9, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'DAF', 10, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Tata', 11, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Ashok Leyland', 12, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'FAW', 13, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Sinotruk (Howo)', 14, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5'),
  ('vehicle_make', 'Other', 99, true, 'be902a8e-034e-45ee-b35e-5e0f9b574dc5');

-- 2. Pickup Truck (7fb487f8-39ac-4148-a4f0-a82f3abb186e)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Toyota', 1, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Isuzu', 2, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Ford', 3, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Nissan', 4, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Mitsubishi', 5, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Mazda', 6, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Volkswagen', 7, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Mahindra', 8, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Tata', 9, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e'),
  ('vehicle_make', 'Other', 99, true, '7fb487f8-39ac-4148-a4f0-a82f3abb186e');

-- 3. Van / Matatu (e5b0db9e-5150-4049-9380-5099ea9f2176)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Toyota', 1, true, 'e5b0db9e-5150-4049-9380-5099ea9f2176'),
  ('vehicle_make', 'Nissan', 2, true, 'e5b0db9e-5150-4049-9380-5099ea9f2176'),
  ('vehicle_make', 'Mercedes-Benz', 3, true, 'e5b0db9e-5150-4049-9380-5099ea9f2176'),
  ('vehicle_make', 'Ford', 4, true, 'e5b0db9e-5150-4049-9380-5099ea9f2176'),
  ('vehicle_make', 'Volkswagen', 5, true, 'e5b0db9e-5150-4049-9380-5099ea9f2176'),
  ('vehicle_make', 'Other', 99, true, 'e5b0db9e-5150-4049-9380-5099ea9f2176');

-- 4. Bus / Coach (9c2b25a8-9bff-47b6-8e48-4899d370c207)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Isuzu', 1, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Scania', 2, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Mercedes-Benz', 3, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'MAN', 4, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Tata', 5, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Hino', 6, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Ashok Leyland', 7, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Volvo', 8, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207'),
  ('vehicle_make', 'Other', 99, true, '9c2b25a8-9bff-47b6-8e48-4899d370c207');

-- 5. Tractor (41967da0-7617-4022-a161-cc7b963fbed5)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Massey Ferguson', 1, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'John Deere', 2, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'New Holland', 3, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Mahindra', 4, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Kubota', 5, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Ford', 6, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Sonalika', 7, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Farmtrac', 8, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Case IH', 9, true, '41967da0-7617-4022-a161-cc7b963fbed5'),
  ('vehicle_make', 'Other', 99, true, '41967da0-7617-4022-a161-cc7b963fbed5');

-- 6. Excavator (e67b0623-7f44-48e5-b2be-a8f383e1cad2)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Caterpillar', 1, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Komatsu', 2, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Hitachi', 3, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'JCB', 4, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Volvo', 5, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Doosan', 6, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Hyundai', 7, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Kobelco', 8, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Sany', 9, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'XCMG', 10, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Liugong', 11, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2'),
  ('vehicle_make', 'Other', 99, true, 'e67b0623-7f44-48e5-b2be-a8f383e1cad2');

-- 7. Tipper (564023d3-2759-4313-af19-d97ea2d40042)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Isuzu', 1, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Mitsubishi Fuso', 2, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Hino', 3, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Scania', 4, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Mercedes-Benz', 5, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'MAN', 6, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Volvo', 7, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Tata', 8, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Ashok Leyland', 9, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Sinotruk (Howo)', 10, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Shacman', 11, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'FAW', 12, true, '564023d3-2759-4313-af19-d97ea2d40042'),
  ('vehicle_make', 'Other', 99, true, '564023d3-2759-4313-af19-d97ea2d40042');

-- 8. Tanker (51f04b2f-9583-4e31-b267-a80f49b75386)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Isuzu', 1, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Mitsubishi Fuso', 2, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Scania', 3, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Mercedes-Benz', 4, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'MAN', 5, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Volvo', 6, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Tata', 7, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Ashok Leyland', 8, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Sinotruk (Howo)', 9, true, '51f04b2f-9583-4e31-b267-a80f49b75386'),
  ('vehicle_make', 'Other', 99, true, '51f04b2f-9583-4e31-b267-a80f49b75386');

-- 9. Concrete Mixer (8c334d66-d7ea-4519-834f-f9584ea36bc4) & Mixer (b74699e7-cdab-42db-bd9e-cce0f6708609)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Isuzu', 1, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Mitsubishi Fuso', 2, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Hino', 3, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Scania', 4, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Mercedes-Benz', 5, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'MAN', 6, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Volvo', 7, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Sinotruk (Howo)', 8, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Shacman', 9, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Sany', 10, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Zoomlion', 11, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),
  ('vehicle_make', 'Other', 99, true, '8c334d66-d7ea-4519-834f-f9584ea36bc4'),

  ('vehicle_make', 'Isuzu', 1, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Mitsubishi Fuso', 2, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Hino', 3, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Scania', 4, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Mercedes-Benz', 5, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'MAN', 6, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Volvo', 7, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Sinotruk (Howo)', 8, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Shacman', 9, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Sany', 10, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Zoomlion', 11, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609'),
  ('vehicle_make', 'Other', 99, true, 'b74699e7-cdab-42db-bd9e-cce0f6708609');

-- 10. Grader (d16f7a7f-f016-461a-bd92-45e95c791ff6)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Caterpillar', 1, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'Komatsu', 2, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'Volvo', 3, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'XCMG', 4, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'Sany', 5, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'Liugong', 6, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'John Deere', 7, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'Case', 8, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6'),
  ('vehicle_make', 'Other', 99, true, 'd16f7a7f-f016-461a-bd92-45e95c791ff6');

-- 11. Crane (aab25e4c-fd6e-40de-b347-6cd951f2dc78)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Kato', 1, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Tadano', 2, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Liebherr', 3, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Grove', 4, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Terex', 5, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'XCMG', 6, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Sany', 7, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Zoomlion', 8, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Manitowoc', 9, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Kobelco', 10, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78'),
  ('vehicle_make', 'Other', 99, true, 'aab25e4c-fd6e-40de-b347-6cd951f2dc78');

-- 12. Forklift (158cfa1e-1c00-45df-85e3-95164e9f667d)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Toyota', 1, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Caterpillar', 2, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Komatsu', 3, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Hyster', 4, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Linde', 5, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Mitsubishi', 6, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Nissan', 7, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Yale', 8, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Crown', 9, true, '158cfa1e-1c00-45df-85e3-95164e9f667d'),
  ('vehicle_make', 'Other', 99, true, '158cfa1e-1c00-45df-85e3-95164e9f667d');

-- 13. Refuse Truck (efb8849b-ecc3-4443-898a-dce848b932e5)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Isuzu', 1, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Mitsubishi Fuso', 2, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Hino', 3, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Scania', 4, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Mercedes-Benz', 5, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'MAN', 6, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Volvo', 7, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Tata', 8, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Ashok Leyland', 9, true, 'efb8849b-ecc3-4443-898a-dce848b932e5'),
  ('vehicle_make', 'Other', 99, true, 'efb8849b-ecc3-4443-898a-dce848b932e5');

-- 14. Ambulance (6d96d2c5-ecc2-4423-b790-e20b3e20d66d)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Toyota', 1, true, '6d96d2c5-ecc2-4423-b790-e20b3e20d66d'),
  ('vehicle_make', 'Nissan', 2, true, '6d96d2c5-ecc2-4423-b790-e20b3e20d66d'),
  ('vehicle_make', 'Ford', 3, true, '6d96d2c5-ecc2-4423-b790-e20b3e20d66d'),
  ('vehicle_make', 'Mercedes-Benz', 4, true, '6d96d2c5-ecc2-4423-b790-e20b3e20d66d'),
  ('vehicle_make', 'Volkswagen', 5, true, '6d96d2c5-ecc2-4423-b790-e20b3e20d66d'),
  ('vehicle_make', 'Other', 99, true, '6d96d2c5-ecc2-4423-b790-e20b3e20d66d');

-- 15. Trailer (3cb550d3-9edf-49fd-b1ed-5be80e90b115)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Custom/Locally Built', 1, true, '3cb550d3-9edf-49fd-b1ed-5be80e90b115'),
  ('vehicle_make', 'Schmitz Cargobull', 2, true, '3cb550d3-9edf-49fd-b1ed-5be80e90b115'),
  ('vehicle_make', 'Krone', 3, true, '3cb550d3-9edf-49fd-b1ed-5be80e90b115'),
  ('vehicle_make', 'Other', 99, true, '3cb550d3-9edf-49fd-b1ed-5be80e90b115');

-- 16. Other (4cd03428-7a2c-407a-8d7d-73626b50c7fd)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('vehicle_make', 'Other', 1, true, '4cd03428-7a2c-407a-8d7d-73626b50c7fd');
