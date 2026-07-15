const fs = require('fs');

const data = {
  'Nairobi County': {
    'Westlands': {
      'Parklands': {
        'Parklands Area 1': {},
        'Parklands Area 2': {},
        'Parklands Area 3': {},
        'Highridge': {}
      }
    }
  },
  'Kajiado County': {
    'Kajiado East': {
      'Kitengela Constituency': {
        'Kitengela Ward': {
          'Kitengela': {
            'Yukos': {
              'Acacia': {},
              'Acacia Phase 2': {},
              'Deliverance': {},
              'Milimani': {}
            },
            'Milimani': {},
            'New Valley': {},
            'Noonkopir': {},
            'Korompoi': {},
            'EPZ': {}
          }
        }
      }
    }
  },
  'Mombasa County': {
    'Nyali': {
      'Kongowea': {},
      "Ziwa la Ng'ombe": {},
      'Bamburi': {},
      'Kadzandani': {},
      'Mkomani': {}
    }
  },
  'Kisii County': {
    'Ogembo': {
      'Egetuki': {},
      'Nyamonyo': {}
    }
  }
};

const COUNTIES_BASIC = [
  'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 'Wajir', 
  'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 
  'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', "Murang'a", 
  'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 
  'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 
  'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 
  'Kisumu', 'Homa Bay', 'Migori', 'Nyamira'
];

let sql = `
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

`;

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

for (const [county, level1] of Object.entries(data)) {
  sql += `  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, '${county.replace(/'/g, "''")}', '${slugify(county)}', 'County') RETURNING id INTO county_id;\n`;
  for (const [l1Name, level2] of Object.entries(level1)) {
    sql += `  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (county_id, '${l1Name.replace(/'/g, "''")}', '${slugify(l1Name)}', 'Level 1') RETURNING id INTO l1_id;\n`;
    for (const [l2Name, level3] of Object.entries(level2)) {
      sql += `  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l1_id, '${l2Name.replace(/'/g, "''")}', '${slugify(l2Name)}', 'Level 2') RETURNING id INTO l2_id;\n`;
      for (const [l3Name, level4] of Object.entries(level3)) {
        sql += `  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l2_id, '${l3Name.replace(/'/g, "''")}', '${slugify(l3Name)}', 'Level 3') RETURNING id INTO l3_id;\n`;
        for (const [l4Name, level5] of Object.entries(level4)) {
          sql += `  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (l3_id, '${l4Name.replace(/'/g, "''")}', '${slugify(l4Name)}', 'Level 4') RETURNING id INTO l4_id;\n`;
        }
      }
    }
  }
}

// Add the basic counties
for (const county of COUNTIES_BASIC) {
  const cName = county + ' County';
  sql += `  INSERT INTO public.locations (parent_id, name, slug, type) VALUES (kenya_id, '${cName.replace(/'/g, "''")}', '${slugify(cName)}', 'County');\n`;
}

sql += `
END $$;
`;

fs.writeFileSync('d:/AdHubKenya/supabase/migrations/20260716000001_seed_enterprise_locations.sql', sql);
console.log('Seed SQL generated.');
