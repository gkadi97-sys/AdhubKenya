export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adhubkenya.co.ke';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login/', '/register/', '/my-ads/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
