export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adhubkenya.co.ke';
  
  // Base static routes
  const routes = [
    '',
    '/post-ad',
    '/browse',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  // In a real production deployment, this would dynamically fetch all active categories, subcategories, and locations.
  const categories = ['vehicles', 'property', 'electronics', 'fashion', 'jobs', 'services', 'agriculture'];
  const topLocations = ['nairobi', 'mombasa', 'nakuru', 'kisumu', 'kiambu'];
  
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/${cat}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'hourly',
    priority: 0.9,
  }));

  // Programmatic Hubs
  const programmaticRoutes = [];
  categories.forEach((cat) => {
    topLocations.forEach((loc) => {
      programmaticRoutes.push({
        url: `${baseUrl}/${cat}/${loc}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
  });

  return [...routes, ...categoryRoutes, ...programmaticRoutes];
}
