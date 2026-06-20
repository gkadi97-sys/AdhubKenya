/**
 * useSEO – lightweight hook to set per-page <title> and <meta description>
 * without needing react-helmet.
 *
 * Usage:
 *   useSEO({
 *     title: 'Vehicles for Sale in Kenya | AdHub Kenya',
 *     description: 'Browse thousands of cars, trucks, and motorcycles for sale in Kenya.',
 *   });
 */
import { useEffect } from 'react';

const SITE_NAME = 'AdHub Kenya';

export function useSEO({ title, description, canonicalPath } = {}) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    }

    // Description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl && description) descEl.setAttribute('content', description);

    // OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) ogTitle.setAttribute('content', document.title);

    // OG description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description);

    // OG url + canonical
    const base = 'https://adhubkenya.co.ke';
    if (canonicalPath) {
      const fullUrl = `${base}${canonicalPath}`;
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', fullUrl);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', fullUrl);
    }

    // Twitter
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && title) twTitle.setAttribute('content', document.title);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && description) twDesc.setAttribute('content', description);

    // Reset to defaults on unmount
    return () => {
      document.title = `${SITE_NAME} – Buy & Sell Anything in Kenya`;
    };
  }, [title, description, canonicalPath]);
}
