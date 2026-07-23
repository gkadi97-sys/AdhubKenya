/**
 * generate-sitemap.js
 * Generates an Enterprise XML Sitemap Index and modular child sitemaps.
 * Run via: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BASE_URL = 'https://adhubkenya.co.ke';
const TODAY = new Date().toISOString().split('T')[0];

// -- URL Normalizer Helper --
function generateSlug(text) {
  if (!text) return 'item';
  return text.toString().toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

// 1. Load Supabase Credentials
let SUPABASE_URL = '';
let SUPABASE_KEY = '';

try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
    SUPABASE_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
  }
} catch (e) {
  console.warn('Could not read .env, falling back to process.env');
  SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Sitemap generation skipped.');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -- XML Generators --
function buildUrlset(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}${u.url}</loc>
    <lastmod>${u.lastmod || TODAY}</lastmod>
    <changefreq>${u.changefreq || 'daily'}</changefreq>
    <priority>${u.priority || '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function buildSitemapIndex(sitemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sm => `  <sitemap>
    <loc>${BASE_URL}/${sm}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

// -- Fetch Data --
async function generateSitemaps() {
  console.log('Generating Enterprise Sitemaps...');
  
  // 1. Static Pages
  const staticUrls = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/browse', priority: '0.9', changefreq: 'hourly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/safety', priority: '0.5', changefreq: 'monthly' },
    { url: '/terms', priority: '0.4', changefreq: 'yearly' },
  ];
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-static.xml'), buildUrlset(staticUrls));

  // 2. Categories
  const { data: categories } = await supabase.from('categories').select('slug').eq('is_active', true);
  const catUrls = (categories || []).map(c => ({
    url: `/${c.slug}`,
    priority: '0.8',
    changefreq: 'daily'
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-categories.xml'), buildUrlset(catUrls));

  // 3. Listings
  // For production with >50k listings, this should paginate. Keeping it simple here.
  const { data: listings } = await supabase.from('listings').select('id, title, slug, category, created_at').eq('status', 'active');
  const listingUrls = (listings || []).map(l => {
    const cat = generateSlug(l.category || 'misc');
    const slug = l.slug || generateSlug(l.title);
    return {
      url: `/${cat}/${slug}-${l.id}`,
      priority: '0.9',
      changefreq: 'daily',
      lastmod: l.created_at ? l.created_at.split('T')[0] : TODAY
    };
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-listings.xml'), buildUrlset(listingUrls));

  // 4. Sellers / Users
  const { data: sellers } = await supabase.from('profiles').select('id, name, created_at');
  const sellerUrls = (sellers || []).map(s => ({
    url: `/seller/${generateSlug(s.name)}-${s.id}`,
    priority: '0.6',
    changefreq: 'weekly',
    lastmod: s.created_at ? s.created_at.split('T')[0] : TODAY
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-users.xml'), buildUrlset(sellerUrls));

  // 5. Locations (distinct counties from listings)
  const locUrls = [];
  if (listings && categories) {
    // Generate Location Pages for top categories
    const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']; 
    categories.forEach(c => {
      counties.forEach(county => {
        locUrls.push({
          url: `/${c.slug}/in/${generateSlug(county)}`,
          priority: '0.7',
          changefreq: 'weekly'
        });
      });
    });
  }
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-locations.xml'), buildUrlset(locUrls));

  // -- Master Index --
  const sitemaps = [
    'sitemap-static.xml',
    'sitemap-categories.xml',
    'sitemap-listings.xml',
    'sitemap-users.xml',
    'sitemap-locations.xml'
  ];
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapIndex(sitemaps));

  // -- Robots.txt --
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /messages
Disallow: /settings
Disallow: /saved-searches
Disallow: /my-ads
Disallow: /post-ad
Disallow: /browse?*keyword=*
Disallow: /browse?*sort=*
Disallow: /*?*keyword=*

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt);

  console.log(`✅ Sitemaps generated successfully.`);
  console.log(`   - Listings: ${listingUrls.length}`);
  console.log(`   - Categories: ${catUrls.length}`);
  console.log(`   - Users: ${sellerUrls.length}`);
}

generateSitemaps().catch(e => {
  console.error('Error generating sitemaps:', e);
});
