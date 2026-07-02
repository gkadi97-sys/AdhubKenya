/**
 * generate-sitemap.js
 * Run via: node scripts/generate-sitemap.js
 * Generates a sitemap.xml in the public/ directory covering static + category routes.
 * For listing-level sitemap, this is a placeholder that can be extended with a
 * Supabase query once the DB credentials are available in CI.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const BASE_URL = 'https://adhubkenya.co.ke';
const TODAY = new Date().toISOString().split('T')[0];

// Static pages
const STATIC_PAGES = [
  { url: '/',          priority: '1.0', changefreq: 'daily' },
  { url: '/browse',    priority: '0.9', changefreq: 'hourly' },
  { url: '/about',     priority: '0.5', changefreq: 'monthly' },
  { url: '/contact',   priority: '0.5', changefreq: 'monthly' },
  { url: '/help',      priority: '0.6', changefreq: 'monthly' },
  { url: '/safety',    priority: '0.5', changefreq: 'monthly' },
  { url: '/terms',     priority: '0.4', changefreq: 'yearly' },
  { url: '/privacy',   priority: '0.4', changefreq: 'yearly' },
  { url: '/careers',   priority: '0.4', changefreq: 'monthly' },
  { url: '/report',    priority: '0.3', changefreq: 'monthly' },
  { url: '/cookies',   priority: '0.3', changefreq: 'yearly' },
];

// Category routes — each gets its own clean canonical URL.
// NOTE: We intentionally omit /browse?category=X query-string variants
// to avoid duplicate content in Google's index. The clean slugs below are sufficient.
const CATEGORY_ROUTES = [
  'vehicles',
  'property',
  'land-plots',
  'phones-tablets',
  'electronics',
  'home-furniture',
  'fashion',
  'beauty',
  'services',
  'repair-construction',
  'commercial-equipment',
  'commercial-vehicles',
  'leisure',
  'babies-kids',
  'food-agriculture',
  'animals-pets',
  'auto-spares',
  'jobs',
  'seeking-work',
];

function buildUrl({ url, priority = '0.7', changefreq = 'daily' }) {
  return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [
  ...STATIC_PAGES.map(buildUrl),
  ...CATEGORY_ROUTES.map(slug =>
    buildUrl({ url: `/${slug}`, priority: '0.8', changefreq: 'hourly' })
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf-8');
console.log(`✅ sitemap.xml written to ${outPath} (${urls.length} URLs)`);
