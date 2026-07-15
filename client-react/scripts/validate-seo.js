/**
 * validate-seo.js
 * 
 * Static analysis tool to ensure SEO requirements are met across the AdHub Kenya codebase.
 * Fails the build if critical pages are missing `useSEO` or structured data integrations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

const REQUIRED_SEO_PAGES = [
  'Listing.jsx',
  'Browse.jsx',
  'Home.jsx',
];

let errors = 0;

function validatePage(filePath, filename) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. Must use the SEO hook or component
  if (!content.includes('useSEO') && !content.includes('SEOEngine')) {
    console.error(`❌ [SEO Error] ${filename} is missing useSEO or SEOEngine implementation.`);
    errors++;
  } else {
    console.log(`✅ [SEO Pass] ${filename} includes SEO metadata.`);
  }

  // 2. Listing page must include JSON-LD
  if (filename === 'Listing.jsx' || filename === 'Browse.jsx') {
    if (!content.includes('application/ld+json') && !content.includes('SchemaFactory')) {
      console.error(`❌ [SEO Error] ${filename} is missing Structured Data (JSON-LD).`);
      errors++;
    } else {
      console.log(`✅ [SEO Pass] ${filename} includes Structured Data.`);
    }
  }
}

console.log('🔍 Running AdHub Kenya SEO Validator...\n');

if (fs.existsSync(SRC_PAGES_DIR)) {
  const files = fs.readdirSync(SRC_PAGES_DIR);
  for (const file of files) {
    if (REQUIRED_SEO_PAGES.includes(file)) {
      validatePage(path.join(SRC_PAGES_DIR, file), file);
    }
  }
}

console.log('');
if (errors > 0) {
  console.error(`🛑 SEO Validation failed with ${errors} errors. Build rejected.`);
  process.exit(1);
} else {
  console.log('🎉 SEO Validation passed! Codebase is ready for production.');
  process.exit(0);
}
