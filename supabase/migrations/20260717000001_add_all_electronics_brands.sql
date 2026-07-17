-- Add brands for all other Electronics subcategories

-- 1. Smart TV / Monitor (010ee1c4-8107-4a95-82f3-f3e268171067)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Samsung', 1, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'LG', 2, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Sony', 3, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'TCL', 4, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Hisense', 5, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Panasonic', 6, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Philips', 7, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Toshiba', 8, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Sharp', 9, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Skyworth', 10, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Vitron', 11, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Syinix', 12, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Vision Plus', 13, true, '010ee1c4-8107-4a95-82f3-f3e268171067'),
  ('electronics_brand', 'Other', 99, true, '010ee1c4-8107-4a95-82f3-f3e268171067');

-- 2. Camera / DSLR (51e3ddc2-f1a0-4d79-8c09-adde914bba7f)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Canon', 1, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Nikon', 2, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Sony', 3, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Fujifilm', 4, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Panasonic', 5, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Olympus', 6, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Leica', 7, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Pentax', 8, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'GoPro', 9, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'DJI', 10, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Blackmagic', 11, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f'),
  ('electronics_brand', 'Other', 99, true, '51e3ddc2-f1a0-4d79-8c09-adde914bba7f');

-- 3. Gaming Console (e8215cfa-5f31-47c5-b4f0-64e2963f26b5)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Sony (PlayStation)', 1, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5'),
  ('electronics_brand', 'Microsoft (Xbox)', 2, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5'),
  ('electronics_brand', 'Nintendo', 3, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5'),
  ('electronics_brand', 'Valve (Steam Deck)', 4, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5'),
  ('electronics_brand', 'Asus (ROG)', 5, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5'),
  ('electronics_brand', 'Lenovo (Legion)', 6, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5'),
  ('electronics_brand', 'Other', 99, true, 'e8215cfa-5f31-47c5-b4f0-64e2963f26b5');

-- 4. Tablet (bf8779ad-f08f-4fc9-bb7c-95912a9374af)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Apple (iPad)', 1, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Samsung', 2, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Lenovo', 3, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Microsoft (Surface)', 4, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Huawei', 5, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Amazon (Fire)', 6, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Xiaomi', 7, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Asus', 8, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Nokia', 9, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af'),
  ('electronics_brand', 'Other', 99, true, 'bf8779ad-f08f-4fc9-bb7c-95912a9374af');

-- 5. Smart Watch / Wearable (47eaf520-d216-4894-94da-4e4c275a7c89)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Apple', 1, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Samsung', 2, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Garmin', 3, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Fitbit', 4, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Huawei', 5, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Amazfit', 6, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Xiaomi', 7, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Fossil', 8, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Suunto', 9, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'TicWatch', 10, true, '47eaf520-d216-4894-94da-4e4c275a7c89'),
  ('electronics_brand', 'Other', 99, true, '47eaf520-d216-4894-94da-4e4c275a7c89');

-- 6. Printer / Scanner (de3796a2-6bd4-474e-9920-d506970d89dd)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'HP', 1, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Canon', 2, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Epson', 3, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Brother', 4, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Kyocera', 5, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Xerox', 6, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Ricoh', 7, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Lexmark', 8, true, 'de3796a2-6bd4-474e-9920-d506970d89dd'),
  ('electronics_brand', 'Other', 99, true, 'de3796a2-6bd4-474e-9920-d506970d89dd');

-- 7. Smartphone (fe4f24a5-16ae-451d-b381-b5fa587e545d)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Apple', 1, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Samsung', 2, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Google', 3, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Huawei', 4, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Xiaomi', 5, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Oppo', 6, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Vivo', 7, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'OnePlus', 8, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Nokia', 9, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Sony', 10, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Motorola', 11, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Tecno', 12, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Infinix', 13, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Itel', 14, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Realme', 15, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d'),
  ('electronics_brand', 'Other', 99, true, 'fe4f24a5-16ae-451d-b381-b5fa587e545d');

-- 8. Projector (41eef7c8-49bb-4672-89e8-7b53f759b950)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Epson', 1, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'BenQ', 2, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'Optoma', 3, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'Sony', 4, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'Panasonic', 5, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'ViewSonic', 6, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'LG', 7, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'Nebula', 8, true, '41eef7c8-49bb-4672-89e8-7b53f759b950'),
  ('electronics_brand', 'Other', 99, true, '41eef7c8-49bb-4672-89e8-7b53f759b950');

-- 9. Networking (Router/Modem) (323b946a-6c0e-47c5-b72f-739c28246a4a)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'TP-Link', 1, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'D-Link', 2, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Netgear', 3, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Asus', 4, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Huawei', 5, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Cisco', 6, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Ubiquiti', 7, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'MikroTik', 8, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Linksys', 9, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'ZTE', 10, true, '323b946a-6c0e-47c5-b72f-739c28246a4a'),
  ('electronics_brand', 'Other', 99, true, '323b946a-6c0e-47c5-b72f-739c28246a4a');

-- 10. Power Bank (b76a3e53-6cb8-4ba7-b361-04f340ff0ee0)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Anker', 1, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Oraimo', 2, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Samsung', 3, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Xiaomi', 4, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Romoss', 5, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Baseus', 6, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Ugreen', 7, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0'),
  ('electronics_brand', 'Other', 99, true, 'b76a3e53-6cb8-4ba7-b361-04f340ff0ee0');

-- 11. Accessories (a6393030-019e-4c8b-ac96-594e59f7eb0e)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Apple', 1, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e'),
  ('electronics_brand', 'Samsung', 2, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e'),
  ('electronics_brand', 'Anker', 3, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e'),
  ('electronics_brand', 'Ugreen', 4, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e'),
  ('electronics_brand', 'Baseus', 5, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e'),
  ('electronics_brand', 'Oraimo', 6, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e'),
  ('electronics_brand', 'Other', 99, true, 'a6393030-019e-4c8b-ac96-594e59f7eb0e');

-- 12. Other Electronics (6ac87e88-09e0-4192-9fb4-59a79499d20f)
INSERT INTO public.lookup_values (lookup_type, value, order_index, is_active, parent_id) VALUES
  ('electronics_brand', 'Other', 99, true, '6ac87e88-09e0-4192-9fb4-59a79499d20f');
