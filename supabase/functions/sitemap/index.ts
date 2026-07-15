import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateSlug(text: string) {
  if (!text) return 'item';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

serve(async (req) => {
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, title, category, updated_at, status')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(50000); // Standard sitemap limit

    if (error) {
      throw error;
    }

    const domain = 'https://adhubkenya.co.ke';
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Routes
    const staticRoutes = [
      '',
      '/browse',
      '/about',
      '/contact',
      '/safety',
      '/vehicles',
      '/property',
      '/electronics',
      '/phones-tablets'
    ];

    for (const route of staticRoutes) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${domain}${route}</loc>\n`;
      sitemap += `    <changefreq>daily</changefreq>\n`;
      sitemap += `    <priority>1.0</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Dynamic Listing Routes
    if (listings) {
      for (const listing of listings) {
        const cat = generateSlug(listing.category);
        const slug = generateSlug(listing.title);
        const url = `${domain}/${cat}/${slug}-${listing.id}`;
        
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${escapeXml(url)}</loc>\n`;
        sitemap += `    <lastmod>${new Date(listing.updated_at || new Date()).toISOString()}</lastmod>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `    <priority>0.8</priority>\n`;
        sitemap += `  </url>\n`;
      }
    }

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
