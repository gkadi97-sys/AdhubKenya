/**
 * Cloudflare Pages Function: /sitemap-listings.xml
 * Dynamically generates the listings sitemap by querying Supabase at request time.
 * This means the sitemap is always 100% fresh — no build step needed.
 */

const BASE_URL = 'https://adhubkenya.co.ke';
const TODAY = new Date().toISOString().split('T')[0];

function generateSlug(text) {
  if (!text) return 'item';
  return text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function onRequest(context) {
  const { env } = context;

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response('<!-- Missing Supabase credentials -->', {
      headers: { 'Content-Type': 'application/xml' },
      status: 500,
    });
  }

  try {
    // Fetch all active listings from Supabase
    const res = await fetch(
      `${supabaseUrl}/rest/v1/listings?status=eq.active&select=id,title,slug,category,created_at`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const listings = await res.json();

    const urls = (listings || []).map((l) => {
      const cat = generateSlug(l.category || 'misc');
      const slug = l.slug || generateSlug(l.title);
      const lastmod = l.created_at ? l.created_at.split('T')[0] : TODAY;
      return `  <url>
    <loc>${BASE_URL}/${cat}/${slug}-${l.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Cache for 1 hour on Cloudflare edge, but always revalidate
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return new Response(`<!-- Error: ${err.message} -->`, {
      headers: { 'Content-Type': 'application/xml' },
      status: 500,
    });
  }
}
