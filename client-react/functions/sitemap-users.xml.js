/**
 * Cloudflare Pages Function: /sitemap-users.xml
 * Dynamically generates the seller/user profile sitemap by querying Supabase at request time.
 */

const BASE_URL = 'https://adhubkenya.co.ke';
const TODAY = new Date().toISOString().split('T')[0];

function generateSlug(text) {
  if (!text) return 'user';
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
    const res = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,name,created_at`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const sellers = await res.json();

    const urls = (sellers || []).map((s) => {
      const lastmod = s.created_at ? s.created_at.split('T')[0] : TODAY;
      return `  <url>
    <loc>${BASE_URL}/seller/${generateSlug(s.name)}-${s.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
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
