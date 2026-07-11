-- ============================================================
-- Migration: Add vehicle features multicheck attribute
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Update the Features group so it shows correctly in the form
UPDATE public.attribute_groups
SET
  icon        = 'zap',
  auto_expand = FALSE,
  show_continue = FALSE
WHERE id = '5f335068-e6b6-4351-afe6-cc1cd71aaa35';

-- Insert the features multicheck attribute
INSERT INTO public.attributes (
  id,
  category_id,
  group_id,
  name,
  label,
  field_type,
  is_required,
  is_searchable,
  is_filterable,
  is_listing_card,
  is_hidden,
  is_admin_only,
  display_order,
  validation_rules
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '99e7fdfd-463a-46f8-8651-af8d5cf883e1',  -- vehicles category
  '5f335068-e6b6-4351-afe6-cc1cd71aaa35',  -- Features group
  'features',
  'Features',
  'multicheck',
  false,
  true,
  true,
  false,
  false,
  false,
  10,
  '{
    "options": [
      "Dashcam",
      "Reverse Camera",
      "360 Camera",
      "Parking Sensors",
      "Blind Spot Sensor",
      "Lane Departure Warning",
      "Cruise Control",
      "Adaptive Cruise Control",
      "Apple CarPlay",
      "Android Auto",
      "Bluetooth",
      "USB Ports",
      "Wireless Charging",
      "Sunroof / Moonroof",
      "Leather Seats",
      "Heated Seats",
      "Ventilated Seats",
      "Power Seats",
      "Memory Seats",
      "Keyless Entry",
      "Push Button Start",
      "Remote Start",
      "Auto Headlights",
      "Rain Sensing Wipers",
      "Tinted Windows",
      "Alloy Wheels",
      "Spare Wheel",
      "Roof Rack",
      "Bull Bar",
      "Nudge Bar"
    ]
  }'
)
ON CONFLICT (id) DO UPDATE
  SET validation_rules = EXCLUDED.validation_rules,
      label            = EXCLUDED.label,
      field_type       = EXCLUDED.field_type;
