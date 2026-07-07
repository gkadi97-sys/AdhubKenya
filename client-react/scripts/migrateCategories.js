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

let sql = `-- AdHubKenya Mass Metadata Seed SQL\n\n`;

const escapeSql = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
};

const runMigration = () => {
  console.log('Generating Migration SQL...');

  let catSql = `INSERT INTO public.categories (id, slug, name, level, order_index, is_active, allow_price, allow_negotiable, allow_location, allow_condition) VALUES \n`;
  const catValues = [];
  
  let groupSql = `INSERT INTO public.attribute_groups (id, category_id, name, order_index) VALUES \n`;
  const groupValues = [];

  let attrSql = `INSERT INTO public.attributes (id, category_id, group_id, name, label, field_type, is_required, is_searchable, is_listing_card, display_order, options) VALUES \n`;
  const attrValues = [];

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

        let optionsStr = 'NULL';
        if (attr.options && Array.isArray(attr.options)) {
           // Stringify as JSON array
           optionsStr = `'${escapeSql(JSON.stringify(attr.options))}'::jsonb`;
        }

        const isReq = attr.postAd?.required ? 'true' : 'false';
        const isSearch = attr.search?.filterable ? 'true' : 'false';
        const isCard = 'false'; // Default to false

        const attrId = uuidv4();
        attrValues.push(`('${attrId}', (SELECT id FROM public.categories WHERE slug = '${slug}'), ${groupId ? `'${groupId}'` : 'NULL'}, '${escapeSql(attr.id)}', '${escapeSql(attr.label)}', '${fieldType}', ${isReq}, ${isSearch}, ${isCard}, ${aIndex}, ${optionsStr})`);
        
        aIndex += 10;
      }
    }
  }

  sql += catSql + catValues.join(',\n') + `\nON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, order_index = EXCLUDED.order_index;\n\n`;
  if (groupValues.length > 0) {
    sql += groupSql + groupValues.join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;
  }
  if (attrValues.length > 0) {
    sql += attrSql + attrValues.join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;
  }

  fs.writeFileSync('d:/AdHubKenya/client-react/scripts/seed_all_metadata.sql', sql, { encoding: 'utf8' });
  console.log('\nMigration Complete! Output written to: scripts/seed_all_metadata.sql');
};

runMigration();
