/**
 * useSEO – lightweight hook to set per-page <title>, <meta>, and OG/Twitter tags
 * without needing react-helmet.
 *
 * Usage:
 *   useSEO({
 *     title: 'Vehicles for Sale in Kenya',
 *     description: 'Browse thousands of cars...',
 *     canonicalPath: '/vehicles',
 *     ogImage: 'https://adhubkenya.co.ke/img.jpg', // optional
 *     ogType: 'product',                            // optional, defaults to 'website'
 *     keywords: ['Toyota', 'cars Kenya'],           // optional
 *     noindex: true,                                // optional, adds noindex for search/filter pages
 *   });
 */
import { useEffect } from 'react';
import { setSEO } from './seoStore';

export function useSEO(props = {}) {
  // Use stringified props so we don't trigger effect on every render if props object is recreated
  const propsString = JSON.stringify(props);

  useEffect(() => {
    setSEO(props);
    return () => {
      // Revert to defaults on unmount
      setSEO({});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally run only on initial mount
  }, [propsString]);
}
