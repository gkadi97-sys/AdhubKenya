import fs from 'fs';
import { ATTRIBUTE_ENGINE } from '../src/lib/attributeEngine.js';
import crypto from 'crypto';

const uuidv4 = () => crypto.randomUUID();

// Define categories we want to migrate
const CATEGORY_MAP = {
  'phones-tablets': { name: 'Phones & Tablets', level: 1, order: 30 },
  'electronics': { name: 'Electronics', level: 1, order: 40 },
  'home-living': { name: 'Home & Living', level: 1, order: 50 },
  'fashion': { name: 'Fashion', level: 1, order: 60 },
  'beauty': { name: 'Health & Beauty', level: 1, order: 70 },
  'services': { name: 'Services', level: 1, order: 80 },
  'repair-construction': { name: 'Repair & Construction', level: 1, order: 90 },
  'commercial-equipment': { name: 'Commercial Equipment', level: 1, order: 100 },
  'commercial-vehicles': { name: 'Commercial Vehicles', level: 1, order: 110 },
  'leisure': { name: 'Hobbies, Art & Sport', level: 1, order: 120 },
  'babies-kids': { name: 'Babies & Kids', level: 1, order: 130 },
  'food-agriculture': { name: 'Agriculture & Food', level: 1, order: 140 },
  'animals-pets': { name: 'Animals & Pets', level: 1, order: 150 },
  'auto-spares': { name: 'Auto Parts & Accessories', level: 1, order: 160 },
  'jobs': { name: 'Jobs', level: 1, order: 170 },
  'seeking-work': { name: 'Seeking Work', level: 1, order: 180 }
};

const escapeSql = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
};

const runMigration = () => {
  console.log('Generating Migration SQL...');

  let sql = `-- AdHubKenya Mass Metadata Seed SQL\n-- Generated: ${new Date().toISOString()}\n\n`;

  const catValues = [];
  const groupValues = [];
  const attrValues = [];
  const lookupTypeSet = new Set(); // track unique lookup_type names already seeded
  const lookupValues = []; // { lookup_type, value, order_index }

  for (const slug of Object.keys(CATEGORY_MAP)) {
    const meta = CATEGORY_MAP[slug];
    const engineConfig = ATTRIBUTE_ENGINE[slug];
    
    const catId = uuidv4();
    catValues.push(`('${catId}', '${slug}', '${escapeSql(meta.name)}', ${meta.level}, ${meta.order}, true, true, true, true, true)`);

    if (!engineConfig) {
      console.warn(`No ATTRIBUTE_ENGINE config for ${slug}. Skipping attributes.`);
      continue;
    }

    const groupMap = {}; // oldGroupId -> newUuid
    let gIndex = 10;
    
    if (engineConfig.groups && Array.isArray(engineConfig.groups)) {
      for (const group of engineConfig.groups) {
        const groupId = uuidv4();
        groupMap[group.id] = groupId;
        groupValues.push(`('${groupId}', (SELECT id FROM public.categories WHERE slug = '${slug}'), '${escapeSql(group.title)}', ${gIndex})`);
        gIndex += 10;
      }
    }

    let aIndex = 10;
    if (engineConfig.attributes && Array.isArray(engineConfig.attributes)) {
      for (const attr of engineConfig.attributes) {
        let fieldType = 'text';
        if (attr.type === 'number') fieldType = 'number';
        if (attr.type === 'enum' || attr.type === 'dynamic-cascade') fieldType = 'select';
        if (attr.postAd?.uiType === 'multicheck') fieldType = 'multiselect';
        if (attr.type === 'boolean') fieldType = 'boolean';
        
        const groupId = groupMap[attr.postAd?.group];
        const isReq = attr.postAd?.required ? 'true' : 'false';
        const isSearch = attr.search?.filterable ? 'true' : 'false';

        // Generate lookup_type key: slug_attrId (e.g. phones-tablets_subcategory)
        let lookupTypeStr = 'NULL';
        if (attr.options && Array.isArray(attr.options) && attr.options.length > 0) {
          const lookupType = `${slug}_${attr.id}`;
          lookupTypeStr = `'${lookupType}'`;

          // Only add lookup values once per unique lookup_type
          if (!lookupTypeSet.has(lookupType)) {
            lookupTypeSet.add(lookupType);
            let lvIndex = 0;
            for (const opt of attr.options) {
              const optValue = typeof opt === 'string' ? opt : (opt.label || opt.value || String(opt));
              lookupValues.push(`('${uuidv4()}', '${lookupType}', '${escapeSql(optValue)}', ${lvIndex})`);
              lvIndex += 10;
            }
          }
        }

        const attrId = uuidv4();
        attrValues.push(`('${attrId}', (SELECT id FROM public.categories WHERE slug = '${slug}'), ${groupId ? `'${groupId}'` : 'NULL'}, '${escapeSql(attr.id)}', '${escapeSql(attr.label)}', '${fieldType}', ${isReq}, ${isSearch}, false, ${aIndex}, ${lookupTypeStr})`);
        
        aIndex += 10;
      }
    }
  }

  // 1. Categories
  sql += `INSERT INTO public.categories (id, slug, name, level, order_index, is_active, allow_price, allow_negotiable, allow_location, allow_condition) VALUES \n`;
  sql += catValues.join(',\n');
  sql += `\nON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, order_index = EXCLUDED.order_index;\n\n`;

  // 2. Attribute Groups
  if (groupValues.length > 0) {
    sql += `INSERT INTO public.attribute_groups (id, category_id, name, order_index) VALUES \n`;
    sql += groupValues.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n\n`;
  }

  // 3. Lookup Values (options)
  if (lookupValues.length > 0) {
    sql += `INSERT INTO public.lookup_values (id, lookup_type, value, order_index) VALUES \n`;
    sql += lookupValues.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n\n`;
  }

  // 4. Attributes
  if (attrValues.length > 0) {
    sql += `INSERT INTO public.attributes (id, category_id, group_id, name, label, field_type, is_required, is_searchable, is_listing_card, display_order, lookup_type) VALUES \n`;
    sql += attrValues.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n\n`;
  }

  fs.writeFileSync('d:/AdHubKenya/client-react/scripts/seed_all_metadata.sql', sql, { encoding: 'utf8' });
  console.log(`\nMigration Complete!`);
  console.log(`  Categories: ${catValues.length}`);
  console.log(`  Groups: ${groupValues.length}`);
  console.log(`  Lookup Values: ${lookupValues.length}`);
  console.log(`  Attributes: ${attrValues.length}`);
  console.log(`  Output: scripts/seed_all_metadata.sql`);
};

runMigration();
