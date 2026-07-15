
-- Seed Enterprise Location Hierarchy
DO $$
DECLARE
  kenya_id uuid;
  county_id uuid;
  l1_id uuid;
  l2_id uuid;
  l3_id uuid;
  l4_id uuid;
  l5_id uuid;
BEGIN
  -- Insert Kenya
  INSERT INTO public.locations (name, slug, type) 
  VALUES ('Kenya', 'kenya', 'Country') RETURNING id INTO kenya_id;

  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Nairobi County', 'nairobi-county', 'County') RETURNING id INTO county_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (county_id, 'Westlands', 'westlands', 'Level 1') RETURNING id INTO l1_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Parklands', 'parklands', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l2_id, 'Parklands Area 1', 'parklands-area-1', 'Level 3') RETURNING id INTO l3_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l2_id, 'Parklands Area 2', 'parklands-area-2', 'Level 3') RETURNING id INTO l3_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l2_id, 'Parklands Area 3', 'parklands-area-3', 'Level 3') RETURNING id INTO l3_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l2_id, 'Highridge', 'highridge', 'Level 3') RETURNING id INTO l3_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kajiado County', 'kajiado-county', 'County') RETURNING id INTO county_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (county_id, 'Kajiado East', 'kajiado-east', 'Level 1') RETURNING id INTO l1_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Kitengela Constituency', 'kitengela-constituency', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l2_id, 'Kitengela Ward', 'kitengela-ward', 'Level 3') RETURNING id INTO l3_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l3_id, 'Kitengela', 'kitengela', 'Level 4') RETURNING id INTO l4_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Mombasa County', 'mombasa-county', 'County') RETURNING id INTO county_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (county_id, 'Nyali', 'nyali', 'Level 1') RETURNING id INTO l1_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Kongowea', 'kongowea', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Ziwa la Ng''ombe', 'ziwa-la-ng-ombe', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Bamburi', 'bamburi', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Kadzandani', 'kadzandani', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Mkomani', 'mkomani', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kisii County', 'kisii-county', 'County') RETURNING id INTO county_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (county_id, 'Ogembo', 'ogembo', 'Level 1') RETURNING id INTO l1_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Egetuki', 'egetuki', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, 'Nyamonyo', 'nyamonyo', 'Level 2') RETURNING id INTO l2_id;
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kwale County', 'kwale-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kilifi County', 'kilifi-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Tana River County', 'tana-river-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Lamu County', 'lamu-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Taita-Taveta County', 'taita-taveta-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Garissa County', 'garissa-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Wajir County', 'wajir-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Mandera County', 'mandera-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Marsabit County', 'marsabit-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Isiolo County', 'isiolo-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Meru County', 'meru-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Tharaka-Nithi County', 'tharaka-nithi-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Embu County', 'embu-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kitui County', 'kitui-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Machakos County', 'machakos-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Makueni County', 'makueni-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Nyandarua County', 'nyandarua-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Nyeri County', 'nyeri-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kirinyaga County', 'kirinyaga-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Murang''a County', 'murang-a-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kiambu County', 'kiambu-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Turkana County', 'turkana-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'West Pokot County', 'west-pokot-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Samburu County', 'samburu-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Trans Nzoia County', 'trans-nzoia-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Uasin Gishu County', 'uasin-gishu-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Elgeyo-Marakwet County', 'elgeyo-marakwet-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Nandi County', 'nandi-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Baringo County', 'baringo-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Laikipia County', 'laikipia-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Nakuru County', 'nakuru-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Narok County', 'narok-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kericho County', 'kericho-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Bomet County', 'bomet-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kakamega County', 'kakamega-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Vihiga County', 'vihiga-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Bungoma County', 'bungoma-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Busia County', 'busia-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Siaya County', 'siaya-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Kisumu County', 'kisumu-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Homa Bay County', 'homa-bay-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Migori County', 'migori-county', 'County');
  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, 'Nyamira County', 'nyamira-county', 'County');

END $$;
