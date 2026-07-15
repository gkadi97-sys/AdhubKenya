/**
 * validate-seo.js
 *
 * Static analysis tool to ensure SEO requirements are met across the AdHub Kenya codebase.
 * Fails CI if critical pages are missing `useSEO`, structured data, or routing integrations.
 *
 * Run: node scripts/validate-seo.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');
const SRC_PAGES_DIR = path.join(SRC_DIR, 'pages');
const SRC_LIB_DIR  = path.join(SRC_DIR, 'lib');
const SRC_COMP_DIR = path.join(SRC_DIR, 'components');

let errors = 0;
let warnings = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function read(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function check(filePath, label, rule, isError = true) {
  const content = read(filePath);
  const pass = rule(content);
  if (pass) {
    console.log(`  ✅ ${label}`);
  } else if (isError) {
    console.error(`  ❌ ${label}`);
    errors++;
  } else {
    console.warn(`  ⚠️  ${label}`);
    warnings++;
  }
}

function section(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 54 - title.length))}`);
}

// ─── Validations ──────────────────────────────────────────────────────────────
console.log('\n🔍 AdHub Kenya SEO Validator\n');

// 1. SEO Engine & SchemaFactory
section('SEO Engine');
const seoEngineFile  = path.join(SRC_LIB_DIR, 'seo', 'SEOEngine.js');
const schemaFile     = path.join(SRC_LIB_DIR, 'seo', 'SchemaFactory.js');
const urlServiceFile = path.join(SRC_LIB_DIR, 'seo', 'UrlService.js');
const useSeoFile     = path.join(SRC_LIB_DIR, 'useSEO.js');

check(seoEngineFile,  'SEOEngine.js exists',                       c => c.length > 0);
check(schemaFile,     'SchemaFactory.js exists',                    c => c.length > 0);
check(urlServiceFile, 'UrlService.js exists',                       c => c.length > 0);
check(useSeoFile,     'useSEO.js exists',                           c => c.length > 0);
check(seoEngineFile,  'SEOEngine has in-memory cache',              c => c.includes('SEOCache') || c.includes('new Map'));
check(seoEngineFile,  'SEOEngine handles noindex for closed/draft', c => c.includes('noindex') && (c.includes('closed') || c.includes('draft')));
check(schemaFile,     'SchemaFactory supports CollectionPage',      c => c.includes('CollectionPage'));
check(schemaFile,     'SchemaFactory supports SearchResultsPage',   c => c.includes('SearchResultsPage'));
check(schemaFile,     'SchemaFactory supports ItemList',            c => c.includes('ItemList'));
check(schemaFile,     'SchemaFactory supports BreadcrumbList',      c => c.includes('BreadcrumbList'));
check(schemaFile,     'SchemaFactory supports AggregateRating',     c => c.includes('AggregateRating'));
check(urlServiceFile, 'UrlService has brand() generator',           c => c.includes('static brand('));
check(urlServiceFile, 'UrlService has model() generator',           c => c.includes('static model('));
check(urlServiceFile, 'UrlService has listing() generator',         c => c.includes('static listing('));

// 2. Pages — SEO Hooks & Structured Data
section('Pages');
const listingFile = path.join(SRC_PAGES_DIR, 'Listing.jsx');
const browseFile  = path.join(SRC_PAGES_DIR, 'Browse.jsx');
const homeFile    = path.join(SRC_PAGES_DIR, 'Home.jsx');

check(listingFile, 'Listing.jsx uses useSEO',             c => c.includes('useSEO'));
check(listingFile, 'Listing.jsx uses SEOEngine',          c => c.includes('SEOEngine'));
check(listingFile, 'Listing.jsx uses SchemaFactory',      c => c.includes('SchemaFactory'));
check(listingFile, 'Listing.jsx has BreadcrumbList',      c => c.includes("'BreadcrumbList'"));
check(listingFile, 'Listing.jsx has internal context links', c => c.includes('UrlService.brand') || c.includes('UrlService.category'));

check(browseFile,  'Browse.jsx uses useSEO',              c => c.includes('useSEO'));
check(browseFile,  'Browse.jsx uses SchemaFactory',       c => c.includes('SchemaFactory'));
check(browseFile,  'Browse.jsx generates CollectionPage', c => c.includes("'CollectionPage'"));
check(browseFile,  'Browse.jsx generates ItemList',       c => c.includes("'ItemList'"));
check(browseFile,  'Browse.jsx generates SearchResultsPage', c => c.includes("'SearchResultsPage'"));
check(browseFile,  'Browse.jsx uses useParams for brand/model', c => c.includes('useParams'));
check(browseFile,  'Browse.jsx has noindex logic',        c => c.includes('noindex'));

check(homeFile,    'Home.jsx uses useSEO or SEOEngine',   c => c.includes('useSEO') || c.includes('SEOEngine'));

// 3. Routing
section('Routing');
const appFile = path.join(SRC_DIR, 'App.jsx');
const listingOrBrowseFile = path.join(SRC_PAGES_DIR, 'ListingOrBrowse.jsx');

check(appFile,            'App.jsx imports ListingOrBrowse',          c => c.includes('ListingOrBrowse'));
check(appFile,            'App.jsx has /:category/:brand route',      c => c.includes(':brand'));
check(appFile,            'App.jsx has /:category/:brand/:model route', c => c.includes(':model'));
check(listingOrBrowseFile,'ListingOrBrowse.jsx exists and checks UUID', c => c.includes('uuid') || c.includes('UUID'));

// 4. Components
section('Components');
const seoLandingFile = path.join(SRC_COMP_DIR, 'SEOLandingBottom.jsx');
check(seoLandingFile, 'SEOLandingBottom.jsx exists',          c => c.length > 0);
check(seoLandingFile, 'SEOLandingBottom accepts brand prop',  c => c.includes('brand'));
check(seoLandingFile, 'SEOLandingBottom accepts model prop',  c => c.includes('model'));
check(seoLandingFile, 'SEOLandingBottom has FAQPage schema',  c => c.includes('FAQPage'));

// 5. Static Assets
section('Static Assets');
const publicDir = path.join(__dirname, '..', 'public');
check(path.join(publicDir, 'robots.txt'),  'robots.txt exists',        c => c.length > 0);
check(path.join(publicDir, 'robots.txt'),  'robots.txt has Sitemap:',  c => c.includes('Sitemap:'));
check(path.join(publicDir, 'sitemap.xml'), 'sitemap.xml exists',       c => c.length > 0);

// 6. Edge Functions
section('Supabase Edge Functions');
const sitemapFnFile = path.join(__dirname, '..', '..', 'supabase', 'functions', 'sitemap', 'index.ts');
check(sitemapFnFile, 'sitemap edge function exists',           c => c.length > 0);
check(sitemapFnFile, 'sitemap edge fn generates XML',          c => c.includes('application/xml'));

// 7. Backend Migrations
section('Database Migrations');
const searchRpcFile = path.join(__dirname, '..', '..', 'supabase', 'migrations', 'search_rpc.sql');
check(searchRpcFile, 'search_rpc.sql exists',                  c => c.length > 0);
check(searchRpcFile, 'search_rpc.sql uses pg_trgm',            c => c.includes('pg_trgm'));
check(searchRpcFile, 'search_rpc.sql has search_listings RPC', c => c.includes('search_listings'));

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(58));
if (errors > 0) {
  console.error(`\n🛑 SEO Validation FAILED: ${errors} error(s), ${warnings} warning(s).`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`\n⚠️  SEO Validation passed with ${warnings} warning(s).`);
  process.exit(0);
} else {
  console.log('\n🎉 All SEO checks passed! Codebase is production-ready.\n');
  process.exit(0);
}
