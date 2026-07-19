-- =============================================================================
-- AUTO-SPARES TAXONOMY MIGRATION
-- Repairs parent_id links on existing parts and seeds the full taxonomy.
-- =============================================================================

BEGIN;

-- ─── STEP 1: Insert missing Part Categories ───────────────────────────────────
-- Existing: Body & Exterior, Brakes, Electrical & Lighting, Engine Components,
--           Exhaust Systems, Interior Parts, Suspension & Steering,
--           Transmission & Drivetrain
-- New:      Cooling System, Fuel System, Air Intake & Emissions,
--           Wheels & Tyres, Air Conditioning & Heating,
--           Filters & Service Items, Bearings & Seals, Accessories, Other

INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active)
VALUES
  -- New categories
  ('11111111-aaaa-4001-a001-000000000001', 'auto-spares_partCategory', NULL, 'Cooling System',              '{}', 90,  true),
  ('11111111-aaaa-4001-a001-000000000002', 'auto-spares_partCategory', NULL, 'Fuel System',                 '{}', 100, true),
  ('11111111-aaaa-4001-a001-000000000003', 'auto-spares_partCategory', NULL, 'Air Intake & Emissions',      '{}', 110, true),
  ('11111111-aaaa-4001-a001-000000000004', 'auto-spares_partCategory', NULL, 'Wheels & Tyres',              '{}', 120, true),
  ('11111111-aaaa-4001-a001-000000000005', 'auto-spares_partCategory', NULL, 'Air Conditioning & Heating',  '{}', 130, true),
  ('11111111-aaaa-4001-a001-000000000006', 'auto-spares_partCategory', NULL, 'Filters & Service Items',     '{}', 140, true),
  ('11111111-aaaa-4001-a001-000000000007', 'auto-spares_partCategory', NULL, 'Bearings & Seals',            '{}', 150, true),
  ('11111111-aaaa-4001-a001-000000000008', 'auto-spares_partCategory', NULL, 'Accessories',                 '{}', 160, true),
  ('11111111-aaaa-4001-a001-000000000009', 'auto-spares_partCategory', NULL, 'Other',                       '{}', 170, true)
ON CONFLICT (id) DO NOTHING;

-- ─── STEP 2: Fix parent_id for existing 11 parts ──────────────────────────────
-- Existing category IDs (hardcoded from DB):
--   Body & Exterior       = c022c08d-85df-4164-9046-83568b927072
--   Brakes                = 6a2ed685-ed5a-47d6-adbf-75bacc6b1a42
--   Electrical & Lighting = 9d8d0461-d207-408f-9046-988c36c54c0d
--   Engine Components     = 854cf207-96df-43c2-b9d3-ffb60df6990f
--   Exhaust Systems       = 9ff77516-4e07-4a55-90c6-5b6a7bfea489
--   Interior Parts        = a132aeb8-aadf-4572-8c75-a2be3a0c5a69
--   Suspension & Steering = dbd3a424-f4f9-4d5f-bdce-5339ad3695c9
--   Transmission & Driv.  = 5e2f6b1d-942e-4d64-b95c-9e32d29d322d
--
-- Existing part IDs:
--   Alternators    = 1c634ae9-eb58-4f22-b1dd-be676ea0049d  -> Engine Components
--   Brake Pads     = 713d5b9a-47ab-4f38-920f-e563ff0e01aa  -> Brakes
--   Bumpers        = 6faac571-0013-473b-a4ea-fd07e957630f  -> Body & Exterior
--   Headlights     = 81eb814e-0299-441a-b47b-d33d71e0c0c3  -> Body & Exterior
--   Mirrors        = 5e183669-3fb9-4f4d-9296-d9ba4fca046d  -> Body & Exterior
--   Other          = ef03e5ea-2612-42f4-bb16-9319d7d0a0c0  -> Other (new cat)
--   Pistons & Rings= bf6dcd16-c8ea-4566-8570-f755d5e7f0c9  -> Engine Components
--   Rotors         = 3749c5ee-8c77-411f-9b5a-1a893465c775  -> Brakes
--   Shock Absorbers= bd132cca-acc3-4594-9ae5-cbd88ee6f523  -> Suspension & Steering
--   Starters       = 8a460c2a-924d-4656-aa1f-71ff75dae613  -> Engine Components
--   Taillights     = d291fbc2-786e-4ac6-8d6d-0e5819a09a5d  -> Body & Exterior

UPDATE lookup_values SET parent_id = 'c022c08d-85df-4164-9046-83568b927072' WHERE id = '6faac571-0013-473b-a4ea-fd07e957630f'; -- Bumpers
UPDATE lookup_values SET parent_id = 'c022c08d-85df-4164-9046-83568b927072' WHERE id = '81eb814e-0299-441a-b47b-d33d71e0c0c3'; -- Headlights
UPDATE lookup_values SET parent_id = 'c022c08d-85df-4164-9046-83568b927072' WHERE id = '5e183669-3fb9-4f4d-9296-d9ba4fca046d'; -- Mirrors
UPDATE lookup_values SET parent_id = 'c022c08d-85df-4164-9046-83568b927072' WHERE id = 'd291fbc2-786e-4ac6-8d6d-0e5819a09a5d'; -- Taillights

UPDATE lookup_values SET parent_id = '854cf207-96df-43c2-b9d3-ffb60df6990f' WHERE id = '1c634ae9-eb58-4f22-b1dd-be676ea0049d'; -- Alternators
UPDATE lookup_values SET parent_id = '854cf207-96df-43c2-b9d3-ffb60df6990f' WHERE id = 'bf6dcd16-c8ea-4566-8570-f755d5e7f0c9'; -- Pistons & Rings
UPDATE lookup_values SET parent_id = '854cf207-96df-43c2-b9d3-ffb60df6990f' WHERE id = '8a460c2a-924d-4656-aa1f-71ff75dae613'; -- Starters

UPDATE lookup_values SET parent_id = '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42' WHERE id = '713d5b9a-47ab-4f38-920f-e563ff0e01aa'; -- Brake Pads
UPDATE lookup_values SET parent_id = '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42' WHERE id = '3749c5ee-8c77-411f-9b5a-1a893465c775'; -- Rotors

UPDATE lookup_values SET parent_id = 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9' WHERE id = 'bd132cca-acc3-4594-9ae5-cbd88ee6f523'; -- Shock Absorbers

UPDATE lookup_values SET parent_id = '11111111-aaaa-4001-a001-000000000009' WHERE id = 'ef03e5ea-2612-42f4-bb16-9319d7d0a0c0'; -- Other

-- ─── STEP 3: Insert all new parts ─────────────────────────────────────────────

-- ── Body & Exterior (c022c08d) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000001-0000-4000-b000-000000000001', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Grilles',                '{}', 10, true),
  ('22000001-0000-4000-b000-000000000002', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Fenders',                '{}', 20, true),
  ('22000001-0000-4000-b000-000000000003', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Bonnets/Hoods',          '{}', 30, true),
  ('22000001-0000-4000-b000-000000000004', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Doors',                  '{}', 40, true),
  ('22000001-0000-4000-b000-000000000005', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Boot Lids',              '{}', 50, true),
  ('22000001-0000-4000-b000-000000000006', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Side Skirts',            '{}', 60, true),
  ('22000001-0000-4000-b000-000000000007', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Spoilers',               '{}', 70, true),
  ('22000001-0000-4000-b000-000000000008', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Roof Racks',             '{}', 80, true),
  ('22000001-0000-4000-b000-000000000009', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Mud Flaps',              '{}', 90, true),
  ('22000001-0000-4000-b000-000000000010', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Number Plate Holders',   '{}', 100, true),
  ('22000001-0000-4000-b000-000000000011', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Wiper Arms',             '{}', 110, true),
  ('22000001-0000-4000-b000-000000000012', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Wiper Blades',           '{}', 120, true),
  ('22000001-0000-4000-b000-000000000013', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Windshield',             '{}', 130, true),
  ('22000001-0000-4000-b000-000000000014', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Rear Windshield',        '{}', 140, true),
  ('22000001-0000-4000-b000-000000000015', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Quarter Glass',          '{}', 150, true),
  ('22000001-0000-4000-b000-000000000016', 'auto-spares_part', 'c022c08d-85df-4164-9046-83568b927072', 'Side Windows',           '{}', 160, true)
ON CONFLICT (id) DO NOTHING;

-- ── Engine Components (854cf207) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000002-0000-4000-b000-000000000001', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Engine Block',           '{}', 10, true),
  ('22000002-0000-4000-b000-000000000002', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Cylinder Head',          '{}', 20, true),
  ('22000002-0000-4000-b000-000000000003', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Crankshaft',             '{}', 30, true),
  ('22000002-0000-4000-b000-000000000004', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Camshaft',               '{}', 40, true),
  ('22000002-0000-4000-b000-000000000005', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Connecting Rods',        '{}', 50, true),
  ('22000002-0000-4000-b000-000000000006', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Timing Belt',            '{}', 60, true),
  ('22000002-0000-4000-b000-000000000007', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Timing Chain',           '{}', 70, true),
  ('22000002-0000-4000-b000-000000000008', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Timing Kit',             '{}', 80, true),
  ('22000002-0000-4000-b000-000000000009', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Valves',                 '{}', 90, true),
  ('22000002-0000-4000-b000-000000000010', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Valve Cover',            '{}', 100, true),
  ('22000002-0000-4000-b000-000000000011', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Oil Pump',               '{}', 110, true),
  ('22000002-0000-4000-b000-000000000012', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Water Pump',             '{}', 120, true),
  ('22000002-0000-4000-b000-000000000013', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Fuel Pump',              '{}', 130, true),
  ('22000002-0000-4000-b000-000000000014', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Injectors',              '{}', 140, true),
  ('22000002-0000-4000-b000-000000000015', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Turbocharger',           '{}', 150, true),
  ('22000002-0000-4000-b000-000000000016', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Supercharger',           '{}', 160, true),
  ('22000002-0000-4000-b000-000000000017', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Flywheel',               '{}', 170, true),
  ('22000002-0000-4000-b000-000000000018', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Engine Mounts',          '{}', 180, true),
  ('22000002-0000-4000-b000-000000000019', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Intake Manifold',        '{}', 190, true),
  ('22000002-0000-4000-b000-000000000020', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Exhaust Manifold',       '{}', 200, true),
  ('22000002-0000-4000-b000-000000000021', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Gaskets',                '{}', 210, true),
  ('22000002-0000-4000-b000-000000000022', 'auto-spares_part', '854cf207-96df-43c2-b9d3-ffb60df6990f', 'Engine Sensors',         '{}', 220, true)
ON CONFLICT (id) DO NOTHING;

-- ── Transmission & Drivetrain (5e2f6b1d) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000003-0000-4000-b000-000000000001', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Gearbox/Transmission',   '{}', 10, true),
  ('22000003-0000-4000-b000-000000000002', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Clutch Kit',             '{}', 20, true),
  ('22000003-0000-4000-b000-000000000003', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Clutch Disc',            '{}', 30, true),
  ('22000003-0000-4000-b000-000000000004', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Pressure Plate',         '{}', 40, true),
  ('22000003-0000-4000-b000-000000000005', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Release Bearing',        '{}', 50, true),
  ('22000003-0000-4000-b000-000000000006', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Torque Converter',       '{}', 60, true),
  ('22000003-0000-4000-b000-000000000007', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Differential',           '{}', 70, true),
  ('22000003-0000-4000-b000-000000000008', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Drive Shaft',            '{}', 80, true),
  ('22000003-0000-4000-b000-000000000009', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'CV Joint',               '{}', 90, true),
  ('22000003-0000-4000-b000-000000000010', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Axle Shaft',             '{}', 100, true),
  ('22000003-0000-4000-b000-000000000011', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Transfer Case',          '{}', 110, true),
  ('22000003-0000-4000-b000-000000000012', 'auto-spares_part', '5e2f6b1d-942e-4d64-b95c-9e32d29d322d', 'Propeller Shaft',        '{}', 120, true)
ON CONFLICT (id) DO NOTHING;

-- ── Brakes (6a2ed685) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000004-0000-4000-b000-000000000001', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Shoes',             '{}', 10, true),
  ('22000004-0000-4000-b000-000000000002', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Discs/Rotors',      '{}', 20, true),
  ('22000004-0000-4000-b000-000000000003', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Drums',             '{}', 30, true),
  ('22000004-0000-4000-b000-000000000004', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Calipers',          '{}', 40, true),
  ('22000004-0000-4000-b000-000000000005', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Master Cylinder',   '{}', 50, true),
  ('22000004-0000-4000-b000-000000000006', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Booster',           '{}', 60, true),
  ('22000004-0000-4000-b000-000000000007', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Brake Lines',             '{}', 70, true),
  ('22000004-0000-4000-b000-000000000008', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'ABS Module',              '{}', 80, true),
  ('22000004-0000-4000-b000-000000000009', 'auto-spares_part', '6a2ed685-ed5a-47d6-adbf-75bacc6b1a42', 'Handbrake Components',    '{}', 90, true)
ON CONFLICT (id) DO NOTHING;

-- ── Suspension & Steering (dbd3a424) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000005-0000-4000-b000-000000000001', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Struts',                 '{}', 10, true),
  ('22000005-0000-4000-b000-000000000002', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Coil Springs',           '{}', 20, true),
  ('22000005-0000-4000-b000-000000000003', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Leaf Springs',           '{}', 30, true),
  ('22000005-0000-4000-b000-000000000004', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Control Arms',           '{}', 40, true),
  ('22000005-0000-4000-b000-000000000005', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Ball Joints',            '{}', 50, true),
  ('22000005-0000-4000-b000-000000000006', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Tie Rod Ends',           '{}', 60, true),
  ('22000005-0000-4000-b000-000000000007', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Steering Rack',          '{}', 70, true),
  ('22000005-0000-4000-b000-000000000008', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Steering Pump',          '{}', 80, true),
  ('22000005-0000-4000-b000-000000000009', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Steering Column',        '{}', 90, true),
  ('22000005-0000-4000-b000-000000000010', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Stabilizer Links',       '{}', 100, true),
  ('22000005-0000-4000-b000-000000000011', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Wheel Bearings',         '{}', 110, true),
  ('22000005-0000-4000-b000-000000000012', 'auto-spares_part', 'dbd3a424-f4f9-4d5f-bdce-5339ad3695c9', 'Bushings',               '{}', 120, true)
ON CONFLICT (id) DO NOTHING;

-- ── Cooling System (11111111-aaaa-4001-a001-000000000001) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000006-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000001', 'Radiators',              '{}', 10, true),
  ('22000006-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000001', 'Cooling Fans',           '{}', 20, true),
  ('22000006-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000001', 'Thermostats',            '{}', 30, true),
  ('22000006-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000001', 'Radiator Hoses',         '{}', 40, true),
  ('22000006-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000001', 'Expansion Tanks',        '{}', 50, true),
  ('22000006-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000001', 'Intercoolers',           '{}', 60, true)
ON CONFLICT (id) DO NOTHING;

-- ── Electrical & Lighting (9d8d0461) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000007-0000-4000-b000-000000000001', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Batteries',              '{}', 10, true),
  ('22000007-0000-4000-b000-000000000002', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Alternators',            '{}', 20, true),
  ('22000007-0000-4000-b000-000000000003', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Starters',               '{}', 30, true),
  ('22000007-0000-4000-b000-000000000004', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Wiring Harnesses',       '{}', 40, true),
  ('22000007-0000-4000-b000-000000000005', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Fuses',                  '{}', 50, true),
  ('22000007-0000-4000-b000-000000000006', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Relays',                 '{}', 60, true),
  ('22000007-0000-4000-b000-000000000007', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Ignition Coils',         '{}', 70, true),
  ('22000007-0000-4000-b000-000000000008', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Spark Plugs',            '{}', 80, true),
  ('22000007-0000-4000-b000-000000000009', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Glow Plugs',             '{}', 90, true),
  ('22000007-0000-4000-b000-000000000010', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'ECU/Engine Computer',    '{}', 100, true),
  ('22000007-0000-4000-b000-000000000011', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Sensors',                '{}', 110, true),
  ('22000007-0000-4000-b000-000000000012', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Switches',               '{}', 120, true),
  ('22000007-0000-4000-b000-000000000013', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Horns',                  '{}', 130, true),
  ('22000007-0000-4000-b000-000000000014', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Interior Lights',        '{}', 140, true),
  ('22000007-0000-4000-b000-000000000015', 'auto-spares_part', '9d8d0461-d207-408f-9046-988c36c54c0d', 'Exterior Lights',        '{}', 150, true)
ON CONFLICT (id) DO NOTHING;

-- ── Fuel System (11111111-aaaa-4001-a001-000000000002) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000008-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Fuel Tank',              '{}', 10, true),
  ('22000008-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Fuel Pump',              '{}', 20, true),
  ('22000008-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Fuel Filter',            '{}', 30, true),
  ('22000008-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Fuel Injectors',         '{}', 40, true),
  ('22000008-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Carburetors',            '{}', 50, true),
  ('22000008-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Fuel Rail',              '{}', 60, true),
  ('22000008-0000-4000-b000-000000000007', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000002', 'Throttle Body',          '{}', 70, true)
ON CONFLICT (id) DO NOTHING;

-- ── Air Intake & Emissions (11111111-aaaa-4001-a001-000000000003) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000009-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'Air Filters',            '{}', 10, true),
  ('22000009-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'Air Boxes',              '{}', 20, true),
  ('22000009-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'Mass Air Flow Sensors',  '{}', 30, true),
  ('22000009-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'Throttle Bodies',        '{}', 40, true),
  ('22000009-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'Catalytic Converters',   '{}', 50, true),
  ('22000009-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'EGR Valves',             '{}', 60, true),
  ('22000009-0000-4000-b000-000000000007', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000003', 'Oxygen Sensors',         '{}', 70, true)
ON CONFLICT (id) DO NOTHING;

-- ── Exhaust System (9ff77516 — existing "Exhaust Systems" category) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000010-0000-4000-b000-000000000001', 'auto-spares_part', '9ff77516-4e07-4a55-90c6-5b6a7bfea489', 'Exhaust Pipes',          '{}', 10, true),
  ('22000010-0000-4000-b000-000000000002', 'auto-spares_part', '9ff77516-4e07-4a55-90c6-5b6a7bfea489', 'Mufflers',               '{}', 20, true),
  ('22000010-0000-4000-b000-000000000003', 'auto-spares_part', '9ff77516-4e07-4a55-90c6-5b6a7bfea489', 'Catalytic Converters',   '{}', 30, true),
  ('22000010-0000-4000-b000-000000000004', 'auto-spares_part', '9ff77516-4e07-4a55-90c6-5b6a7bfea489', 'Resonators',             '{}', 40, true),
  ('22000010-0000-4000-b000-000000000005', 'auto-spares_part', '9ff77516-4e07-4a55-90c6-5b6a7bfea489', 'Exhaust Tips',           '{}', 50, true),
  ('22000010-0000-4000-b000-000000000006', 'auto-spares_part', '9ff77516-4e07-4a55-90c6-5b6a7bfea489', 'Exhaust Manifolds',      '{}', 60, true)
ON CONFLICT (id) DO NOTHING;

-- ── Wheels & Tyres (11111111-aaaa-4001-a001-000000000004) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000011-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Tyres',                  '{}', 10, true),
  ('22000011-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Alloy Wheels',           '{}', 20, true),
  ('22000011-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Steel Wheels',           '{}', 30, true),
  ('22000011-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Wheel Covers',           '{}', 40, true),
  ('22000011-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Wheel Nuts',             '{}', 50, true),
  ('22000011-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Wheel Spacers',          '{}', 60, true),
  ('22000011-0000-4000-b000-000000000007', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000004', 'Spare Wheels',           '{}', 70, true)
ON CONFLICT (id) DO NOTHING;

-- ── Interior Parts (a132aeb8) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000012-0000-4000-b000-000000000001', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Seats',                  '{}', 10, true),
  ('22000012-0000-4000-b000-000000000002', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Seat Belts',             '{}', 20, true),
  ('22000012-0000-4000-b000-000000000003', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Dashboard',              '{}', 30, true),
  ('22000012-0000-4000-b000-000000000004', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Steering Wheel',         '{}', 40, true),
  ('22000012-0000-4000-b000-000000000005', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Gear Knob',              '{}', 50, true),
  ('22000012-0000-4000-b000-000000000006', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Door Panels',            '{}', 60, true),
  ('22000012-0000-4000-b000-000000000007', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Floor Mats',             '{}', 70, true),
  ('22000012-0000-4000-b000-000000000008', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Carpets',                '{}', 80, true),
  ('22000012-0000-4000-b000-000000000009', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Center Console',         '{}', 90, true),
  ('22000012-0000-4000-b000-000000000010', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Instrument Cluster',     '{}', 100, true),
  ('22000012-0000-4000-b000-000000000011', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Sun Visors',             '{}', 110, true),
  ('22000012-0000-4000-b000-000000000012', 'auto-spares_part', 'a132aeb8-aadf-4572-8c75-a2be3a0c5a69', 'Interior Mirrors',       '{}', 120, true)
ON CONFLICT (id) DO NOTHING;

-- ── Air Conditioning & Heating (11111111-aaaa-4001-a001-000000000005) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000013-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000005', 'AC Compressor',          '{}', 10, true),
  ('22000013-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000005', 'Condenser',              '{}', 20, true),
  ('22000013-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000005', 'Evaporator',             '{}', 30, true),
  ('22000013-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000005', 'Blower Motor',           '{}', 40, true),
  ('22000013-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000005', 'Heater Core',            '{}', 50, true),
  ('22000013-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000005', 'AC Hoses',               '{}', 60, true)
ON CONFLICT (id) DO NOTHING;

-- ── Filters & Service Items (11111111-aaaa-4001-a001-000000000006) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000014-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Oil Filters',            '{}', 10, true),
  ('22000014-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Air Filters',            '{}', 20, true),
  ('22000014-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Cabin Filters',          '{}', 30, true),
  ('22000014-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Fuel Filters',           '{}', 40, true),
  ('22000014-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Transmission Filters',   '{}', 50, true),
  ('22000014-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Engine Oil',             '{}', 60, true),
  ('22000014-0000-4000-b000-000000000007', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Brake Fluid',            '{}', 70, true),
  ('22000014-0000-4000-b000-000000000008', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Coolant',                '{}', 80, true),
  ('22000014-0000-4000-b000-000000000009', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000006', 'Power Steering Fluid',   '{}', 90, true)
ON CONFLICT (id) DO NOTHING;

-- ── Bearings & Seals (11111111-aaaa-4001-a001-000000000007) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000015-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000007', 'Wheel Bearings',         '{}', 10, true),
  ('22000015-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000007', 'Oil Seals',              '{}', 20, true),
  ('22000015-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000007', 'Gaskets',                '{}', 30, true),
  ('22000015-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000007', 'O-rings',                '{}', 40, true),
  ('22000015-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000007', 'Hub Bearings',           '{}', 50, true)
ON CONFLICT (id) DO NOTHING;

-- ── Accessories (11111111-aaaa-4001-a001-000000000008) ──
INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index, is_active) VALUES
  ('22000016-0000-4000-b000-000000000001', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Car Covers',             '{}', 10, true),
  ('22000016-0000-4000-b000-000000000002', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Floor Mats',             '{}', 20, true),
  ('22000016-0000-4000-b000-000000000003', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Phone Holders',          '{}', 30, true),
  ('22000016-0000-4000-b000-000000000004', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Roof Boxes',             '{}', 40, true),
  ('22000016-0000-4000-b000-000000000005', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Tow Bars',               '{}', 50, true),
  ('22000016-0000-4000-b000-000000000006', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Jump Starters',          '{}', 60, true),
  ('22000016-0000-4000-b000-000000000007', 'auto-spares_part', '11111111-aaaa-4001-a001-000000000008', 'Battery Chargers',       '{}', 70, true)
ON CONFLICT (id) DO NOTHING;

-- ── Other (11111111-aaaa-4001-a001-000000000009) — existing "Other" part moved here ──
-- Already done via UPDATE above. No new inserts needed for this category.

-- ─── STEP 4: Verify results ────────────────────────────────────────────────────
SELECT
  cat.value AS "Part Category",
  COUNT(part.id) AS "Parts Count"
FROM lookup_values cat
LEFT JOIN lookup_values part
  ON part.lookup_type = 'auto-spares_part'
  AND part.parent_id = cat.id
WHERE cat.lookup_type = 'auto-spares_partCategory'
GROUP BY cat.value
ORDER BY cat.value;

COMMIT;
