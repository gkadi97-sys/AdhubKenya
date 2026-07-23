export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);

  // 1. Fetch the static HTML from the Pages asset build
  const response = await env.ASSETS.fetch(request);
  const clonedResponse = new Response(response.body, response);

  const listingId = params.id;
  if (!listingId) {
    return clonedResponse;
  }

  try {
    // 2. Fetch listing data directly from Supabase REST API
    // Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Cloudflare Pages settings
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return clonedResponse; // Fallback gracefully if vars are missing
    }

    const apiUrl = `${supabaseUrl}/rest/v1/listings?id=eq.${listingId}&select=title,location,price,images,status`;
    const sbResponse = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!sbResponse.ok) {
      return clonedResponse;
    }

    const data = await sbResponse.json();
    if (!data || data.length === 0) {
      return clonedResponse;
    }

    const listing = data[0];

    // 3. Prepare the SEO metadata
    const SITE_NAME = 'AdHub Kenya';
    const title = `${listing.title} for Sale in ${listing.location || 'Kenya'} | ${SITE_NAME}`;
    
    let priceStr = '';
    if (listing.price && typeof listing.price === 'number') {
      priceStr = ` for KES ${listing.price.toLocaleString()}`;
    }
    const description = `Buy a ${listing.title}${priceStr} in ${listing.location || 'Kenya'}. Compare prices from verified sellers on ${SITE_NAME}.`;
    
    const imageUrl = (listing.images && listing.images.length > 0) 
      ? listing.images[0] 
      : `https://${url.hostname}/og-image.png`;

    // 4. Use HTMLRewriter to inject into the response
    class MetaTagInjector {
      element(element) {
        // Remove default generic meta tags so we don't have duplicates
        const name = element.getAttribute('name');
        const property = element.getAttribute('property');
        
        const toRemove = [
          'title', 'description', 
          'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
          'twitter:title', 'twitter:description', 'twitter:image', 'twitter:card'
        ];
        
        if (toRemove.includes(name) || toRemove.includes(property)) {
          element.remove();
        }
      }
    }

    class HeadInjector {
      element(element) {
        // Inject the specific listing tags directly into the <head>
        element.append(`<title>${title}</title>`, { html: true });
        element.append(`<meta name="description" content="${description}" />`, { html: true });
        
        // OpenGraph
        element.append(`<meta property="og:type" content="product" />`, { html: true });
        element.append(`<meta property="og:title" content="${title}" />`, { html: true });
        element.append(`<meta property="og:description" content="${description}" />`, { html: true });
        element.append(`<meta property="og:image" content="${imageUrl}" />`, { html: true });
        element.append(`<meta property="og:url" content="${url.href}" />`, { html: true });
        
        // Twitter
        element.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
        element.append(`<meta name="twitter:title" content="${title}" />`, { html: true });
        element.append(`<meta name="twitter:description" content="${description}" />`, { html: true });
        element.append(`<meta name="twitter:image" content="${imageUrl}" />`, { html: true });
      }
    }

    return new HTMLRewriter()
      .on('title', { element: (el) => el.remove() }) // Remove original generic title
      .on('meta', new MetaTagInjector())
      .on('head', new HeadInjector())
      .transform(clonedResponse);

  } catch (error) {
    // If anything fails, return the normal SPA app
    return clonedResponse;
  }
}
