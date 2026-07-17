-- Fix: Add proper audio brand lookup values for Electronics > Audio / Speakers subcategory
-- Step 1: Add 'electronics_audio_brand' lookup values
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id)
VALUES
  ('electronics_brand', 'Sony',          1,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'JBL',           2,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Bose',          3,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Samsung',       4,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'LG',            5,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Yamaha',        6,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Denon',         7,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Harman Kardon', 8,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Sonos',         9,  true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Polk Audio',    10, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Klipsch',       11, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Edifier',       12, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Creative',      13, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Anker',         14, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Marshall',      15, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Philips',       16, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Pioneer',       17, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Onkyo',         18, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Marantz',       19, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Vitron',        20, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Vision Plus',   21, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Sayona',        22, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Ramtons',       23, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3'),
  ('electronics_brand', 'Other',         99, true, '3a71035d-7a65-4808-953b-4c222d6ffcf3');
