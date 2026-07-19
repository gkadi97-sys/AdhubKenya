/**
 * Generates seed_subcategories.sql by reading the current root category IDs
 * from the DB and building INSERT statements.
 * 
 * Run: node generate_seed_sql.js
 * Then: npx supabase db query -f seed_subcategories.sql --linked
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'client-react/.env') });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TAXONOMY = [
  {
    parentSlug: 'vehicles',
    children: [
      { name: 'Cars', slug: 'cars', icon: '🚗' },
      { name: 'SUVs & Crossovers', slug: 'suvs', icon: '🚙' },
      { name: 'Motorcycles', slug: 'motorcycles', icon: '🏍️' },
      { name: 'Pickups & Trucks', slug: 'pickups', icon: '🛻' },
      { name: 'Vans & Minivans', slug: 'vans', icon: '🚐' },
      { name: 'Buses', slug: 'buses', icon: '🚌' },
      { name: 'Tuk Tuks & 3-Wheelers', slug: 'tuk-tuks', icon: '🛺' },
      { name: 'Electric Vehicles', slug: 'electric-vehicles', icon: '⚡' },
      { name: 'Trailers', slug: 'trailers', icon: '🚛' },
      { name: 'Construction Equipment', slug: 'construction-equipment', icon: '🏗️' },
      { name: 'Agricultural Equipment', slug: 'agricultural-equipment', icon: '🚜' },
    ],
  },
  {
    parentSlug: 'property',
    children: [
      { name: 'Houses for Sale', slug: 'houses-sale', icon: '🏡' },
      { name: 'Houses for Rent', slug: 'houses-rent', icon: '🏠' },
      { name: 'Apartments for Sale', slug: 'apartments-sale', icon: '🏢' },
      { name: 'Apartments for Rent', slug: 'apartments-rent', icon: '🏨' },
      { name: 'Land & Plots', slug: 'land-plots', icon: '📐' },
      { name: 'Commercial Property', slug: 'commercial-property', icon: '🏬' },
      { name: 'Short Stays & Airbnb', slug: 'short-stays', icon: '🛏️' },
      { name: 'Student Hostels', slug: 'student-hostels', icon: '🏫' },
    ],
  },
  {
    parentSlug: 'phones-tablets',
    children: [
      { name: 'Smartphones', slug: 'smartphones', icon: '📱' },
      { name: 'Tablets', slug: 'tablets', icon: '📲' },
      { name: 'Feature Phones', slug: 'feature-phones', icon: '📞' },
      { name: 'Smartwatches & Wearables', slug: 'wearables', icon: '⌚' },
      { name: 'Phone Accessories', slug: 'phone-accessories', icon: '🔌' },
    ],
  },
  {
    parentSlug: 'electronics',
    children: [
      { name: 'Televisions', slug: 'televisions', icon: '📺' },
      { name: 'Laptops & Computers', slug: 'laptops-computers', icon: '💻' },
      { name: 'Audio & Music', slug: 'audio-music', icon: '🔊' },
      { name: 'Cameras & Photography', slug: 'cameras', icon: '📷' },
      { name: 'Gaming', slug: 'gaming', icon: '🎮' },
      { name: 'Printers & Office', slug: 'printers-office', icon: '🖨️' },
      { name: 'Networking & IT', slug: 'networking', icon: '🌐' },
      { name: 'Home Appliances', slug: 'home-appliances', icon: '🫙' },
      { name: 'Solar & Power', slug: 'solar-power', icon: '☀️' },
    ],
  },
  {
    parentSlug: 'home-living',
    children: [
      { name: 'Furniture', slug: 'furniture', icon: '🪑' },
      { name: 'Kitchen & Dining', slug: 'kitchen-dining', icon: '🍽️' },
      { name: 'Bedding & Bath', slug: 'bedding-bath', icon: '🛁' },
      { name: 'Garden & Outdoor', slug: 'garden-outdoor', icon: '🌿' },
      { name: 'Tools & Hardware', slug: 'tools-hardware', icon: '🔨' },
      { name: 'Decor & Art', slug: 'decor-art', icon: '🖼️' },
      { name: 'Cleaning & Laundry', slug: 'cleaning-laundry', icon: '🧹' },
    ],
  },
  {
    parentSlug: 'fashion',
    children: [
      { name: "Men's Clothing", slug: 'mens-clothing', icon: '👔' },
      { name: "Women's Clothing", slug: 'womens-clothing', icon: '👗' },
      { name: 'Kids Clothing', slug: 'kids-clothing', icon: '👕' },
      { name: 'Shoes & Footwear', slug: 'shoes', icon: '👟' },
      { name: 'Bags & Luggage', slug: 'bags-luggage', icon: '👜' },
      { name: 'Watches & Jewellery', slug: 'watches-jewellery', icon: '💍' },
      { name: 'Sunglasses & Eyewear', slug: 'eyewear', icon: '🕶️' },
    ],
  },
  {
    parentSlug: 'beauty',
    children: [
      { name: 'Skincare', slug: 'skincare', icon: '🧴' },
      { name: 'Hair Care', slug: 'hair-care', icon: '💇' },
      { name: 'Makeup & Cosmetics', slug: 'makeup', icon: '💄' },
      { name: 'Fragrances & Perfumes', slug: 'fragrances', icon: '🌸' },
      { name: 'Vitamins & Supplements', slug: 'supplements', icon: '💊' },
      { name: 'Medical Equipment', slug: 'medical-equipment', icon: '🩺' },
    ],
  },
  {
    parentSlug: 'services',
    children: [
      { name: 'Cleaning Services', slug: 'cleaning-services', icon: '🧽' },
      { name: 'Tutoring & Education', slug: 'tutoring', icon: '📚' },
      { name: 'Event Planning', slug: 'event-planning', icon: '🎉' },
      { name: 'Photography & Video', slug: 'photography-video', icon: '🎥' },
      { name: 'IT & Tech Support', slug: 'it-support', icon: '🖥️' },
      { name: 'Legal & Financial', slug: 'legal-financial', icon: '⚖️' },
      { name: 'Transport & Logistics', slug: 'transport-logistics', icon: '🚚' },
      { name: 'Health & Wellness', slug: 'health-wellness', icon: '🏥' },
    ],
  },
  {
    parentSlug: 'repair-construction',
    children: [
      { name: 'Plumbing', slug: 'plumbing', icon: '🚿' },
      { name: 'Electrical', slug: 'electrical', icon: '💡' },
      { name: 'Roofing & Waterproofing', slug: 'roofing', icon: '🏗️' },
      { name: 'Painting & Decorating', slug: 'painting-decorating', icon: '🎨' },
      { name: 'Masonry & Tiling', slug: 'masonry-tiling', icon: '🧱' },
      { name: 'Carpentry & Joinery', slug: 'carpentry', icon: '🪵' },
      { name: 'HVAC & AC Services', slug: 'hvac', icon: '❄️' },
    ],
  },
  {
    parentSlug: 'commercial-equipment',
    children: [
      { name: 'Industrial Machinery', slug: 'industrial-machinery', icon: '⚙️' },
      { name: 'Restaurant & Catering', slug: 'restaurant-catering', icon: '🍳' },
      { name: 'Office Furniture & Equipment', slug: 'office-equipment', icon: '🗂️' },
      { name: 'Medical & Lab Equipment', slug: 'medical-lab', icon: '🧪' },
      { name: 'Retail & POS Systems', slug: 'retail-pos', icon: '🏪' },
      { name: 'Cold Room & Refrigeration', slug: 'cold-room', icon: '🧊' },
    ],
  },
  {
    parentSlug: 'commercial-vehicles',
    children: [
      { name: 'Heavy Trucks', slug: 'heavy-trucks', icon: '🚛' },
      { name: 'Light Commercial Vans', slug: 'light-vans', icon: '🚐' },
      { name: 'Minibuses & Matatus', slug: 'minibuses', icon: '🚌' },
      { name: 'Tankers & Tippers', slug: 'tankers-tippers', icon: '🪣' },
      { name: 'Tractor Units', slug: 'tractor-units', icon: '🚜' },
    ],
  },
  {
    parentSlug: 'leisure',
    children: [
      { name: 'Sports Equipment', slug: 'sports-equipment', icon: '⚽' },
      { name: 'Gym & Fitness', slug: 'gym-fitness', icon: '🏋️' },
      { name: 'Musical Instruments', slug: 'musical-instruments', icon: '🎸' },
      { name: 'Books & Magazines', slug: 'books', icon: '📖' },
      { name: 'Bicycles', slug: 'bicycles', icon: '🚲' },
      { name: 'Outdoor & Camping', slug: 'outdoor-camping', icon: '⛺' },
      { name: 'Board Games & Toys', slug: 'board-games', icon: '🎲' },
      { name: 'Arts & Crafts', slug: 'arts-crafts', icon: '✂️' },
    ],
  },
  {
    parentSlug: 'babies-kids',
    children: [
      { name: 'Baby Clothing', slug: 'baby-clothing', icon: '🍼' },
      { name: 'Prams & Strollers', slug: 'prams-strollers', icon: '🛒' },
      { name: 'Baby Gear & Furniture', slug: 'baby-gear', icon: '🛏️' },
      { name: 'Toys', slug: 'toys', icon: '🧸' },
      { name: 'School Supplies', slug: 'school-supplies', icon: '🎒' },
    ],
  },
  {
    parentSlug: 'food-agriculture',
    children: [
      { name: 'Fresh Produce', slug: 'fresh-produce', icon: '🥦' },
      { name: 'Farm Animals & Livestock', slug: 'livestock', icon: '🐄' },
      { name: 'Seeds & Seedlings', slug: 'seeds-seedlings', icon: '🌱' },
      { name: 'Farm Inputs & Fertilizers', slug: 'farm-inputs', icon: '🧪' },
      { name: 'Irrigation & Farming Equipment', slug: 'irrigation-equipment', icon: '💧' },
    ],
  },
  {
    parentSlug: 'animals-pets',
    children: [
      { name: 'Dogs', slug: 'dogs', icon: '🐕' },
      { name: 'Cats', slug: 'cats', icon: '🐈' },
      { name: 'Birds', slug: 'birds', icon: '🦜' },
      { name: 'Fish & Aquariums', slug: 'fish-aquariums', icon: '🐟' },
      { name: 'Pet Supplies & Accessories', slug: 'pet-supplies', icon: '🦴' },
    ],
  },
  {
    parentSlug: 'auto-spares',
    children: [
      { name: 'Engine Components', slug: 'engine-components', icon: '🔩' },
      { name: 'Brakes & Suspension', slug: 'brakes-suspension', icon: '🔧' },
      { name: 'Body & Exterior', slug: 'body-exterior', icon: '🚘' },
      { name: 'Electrical & Lighting', slug: 'auto-electrical', icon: '💡' },
      { name: 'Transmission & Drivetrain', slug: 'transmission', icon: '⚙️' },
      { name: 'Tyres & Wheels', slug: 'tyres-wheels', icon: '🛞' },
      { name: 'Car Audio & Accessories', slug: 'car-audio', icon: '🔊' },
      { name: 'Oil, Fluids & Filters', slug: 'oils-fluids', icon: '🛢️' },
      { name: 'Tools & Garage Equipment', slug: 'garage-tools', icon: '🔨' },
    ],
  },
  {
    parentSlug: 'jobs',
    children: [
      { name: 'Accounting & Finance', slug: 'accounting-finance', icon: '💰' },
      { name: 'Admin & Secretarial', slug: 'admin-secretarial', icon: '📋' },
      { name: 'Agriculture & Farming', slug: 'agri-jobs', icon: '🌾' },
      { name: 'Construction & Engineering', slug: 'construction-jobs', icon: '🏗️' },
      { name: 'Customer Service & Sales', slug: 'customer-service', icon: '🤝' },
      { name: 'Driving & Transport', slug: 'driving-jobs', icon: '🚕' },
      { name: 'Education & Training', slug: 'education-jobs', icon: '🎓' },
      { name: 'Healthcare & Medical', slug: 'healthcare-jobs', icon: '🏥' },
      { name: 'Hospitality & Tourism', slug: 'hospitality-jobs', icon: '🏨' },
      { name: 'ICT & Tech', slug: 'ict-jobs', icon: '💻' },
      { name: 'Legal', slug: 'legal-jobs', icon: '⚖️' },
      { name: 'Media & Creative', slug: 'media-jobs', icon: '🎬' },
      { name: 'Security & Guarding', slug: 'security-jobs', icon: '🛡️' },
    ],
  },
  {
    parentSlug: 'seeking-work',
    children: [
      { name: 'Drivers & Chauffeurs', slug: 'seeking-driver', icon: '🚗' },
      { name: 'Domestic Workers', slug: 'seeking-domestic', icon: '🏠' },
      { name: 'IT & Tech Professionals', slug: 'seeking-ict', icon: '💻' },
      { name: 'Engineers & Technicians', slug: 'seeking-engineer', icon: '🔧' },
      { name: 'Teachers & Tutors', slug: 'seeking-teacher', icon: '📚' },
      { name: 'Healthcare Workers', slug: 'seeking-healthcare', icon: '🩺' },
    ],
  },
];

function esc(str) {
  return str.replace(/'/g, "''");
}

async function main() {
  const { data: roots, error } = await supabase
    .from('categories')
    .select('id, slug, allow_condition, allow_location, allow_negotiable, allow_price, allow_video, allow_pdf, allow_360, min_photos, max_photos, listing_fee, order_index')
    .is('parent_id', null);

  if (error) { console.error(error); process.exit(1); }

  const rootMap = Object.fromEntries(roots.map(r => [r.slug, r]));

  const lines = [];
  lines.push('-- Auto-generated subcategory seed SQL');
  lines.push("SET session_replication_role = 'replica'; -- bypass RLS for this session");
  lines.push('');

  for (const group of TAXONOMY) {
    const parent = rootMap[group.parentSlug];
    if (!parent) { console.warn(`WARNING: parent "${group.parentSlug}" not found`); continue; }

    lines.push(`-- Children of: ${group.parentSlug}`);
    for (let i = 0; i < group.children.length; i++) {
      const c = group.children[i];
      const childPath = `${group.parentSlug}/${c.slug}`;
      const orderIdx = (parent.order_index || 0) * 100 + i;

      lines.push(
        `INSERT INTO categories (name, slug, path, depth, parent_id, icon, is_active, level, order_index, ` +
        `allow_condition, allow_location, allow_negotiable, allow_price, allow_video, allow_pdf, allow_360, ` +
        `min_photos, max_photos, listing_fee)` +
        ` VALUES (` +
        `'${esc(c.name)}', '${esc(c.slug)}', '${childPath}', 1, '${parent.id}', '${esc(c.icon)}', true, 2, ${orderIdx}, ` +
        `${parent.allow_condition}, ${parent.allow_location}, ${parent.allow_negotiable}, ${parent.allow_price}, ` +
        `${parent.allow_video}, ${parent.allow_pdf}, ${parent.allow_360}, ` +
        `${parent.min_photos}, ${parent.max_photos}, ${parent.listing_fee}` +
        `) ON CONFLICT (path) DO NOTHING;`
      );
    }
    lines.push('');
  }

  lines.push("SET session_replication_role = 'origin';");
  lines.push('');
  lines.push('-- Verify');
  lines.push("SELECT COUNT(*) AS total_categories, COUNT(parent_id) AS child_categories FROM categories;");

  fs.writeFileSync('seed_subcategories.sql', lines.join('\n'), 'utf8');
  console.log(`✅ Generated seed_subcategories.sql with ${lines.length} lines`);
}

main();
