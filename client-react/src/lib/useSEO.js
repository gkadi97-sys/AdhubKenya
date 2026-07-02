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

const SITE_NAME    = 'AdHub Kenya';
const TWITTER_SITE = '@AdHubKenya';
const BASE_URL     = 'https://adhubkenya.co.ke';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function useSEO({ title, description, canonicalPath, ogImage, ogType, keywords, noindex } = {}) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────────────
    const fullTitle = title
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : `${SITE_NAME} – Buy & Sell Anything in Kenya`;
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el && value) el.setAttribute(attr, value);
    };

    const removeMeta = (selector, attr) => {
      const el = document.querySelector(selector);
      if (el) el.removeAttribute(attr);
    };

    // ── Description ────────────────────────────────────────────────────────────
    setMeta('meta[name="description"]', 'content', description);

    // ── Canonical + OG URL ─────────────────────────────────────────────────────
    if (canonicalPath) {
      const fullUrl = `${BASE_URL}${canonicalPath}`;
      setMeta('link[rel="canonical"]', 'href', fullUrl);
      setMeta('meta[property="og:url"]', 'content', fullUrl);
    }

    // ── Open Graph ─────────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]',       'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:image"]',       'content', ogImage || DEFAULT_OG_IMAGE);
    setMeta('meta[property="og:type"]',        'content', ogType  || 'website');

    // ── Twitter Card ───────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image');
    setMeta('meta[name="twitter:site"]',        'content', TWITTER_SITE);
    setMeta('meta[name="twitter:title"]',       'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]',       'content', ogImage || DEFAULT_OG_IMAGE);

    // ── Keywords ────────────────────────────────────────────────────────────────
    if (keywords && keywords.length > 0) {
      let keywordEl = document.querySelector('meta[name="keywords"]');
      if (!keywordEl) {
        keywordEl = document.createElement('meta');
        keywordEl.name = 'keywords';
        document.head.appendChild(keywordEl);
      }
      keywordEl.content = keywords.join(', ');
    }

    // ── Robots / noindex ───────────────────────────────────────────────────────
    let robotsEl = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsEl) {
        robotsEl = document.createElement('meta');
        robotsEl.name = 'robots';
        document.head.appendChild(robotsEl);
      }
      robotsEl.content = 'noindex, follow';
    } else if (robotsEl) {
      // Remove noindex if navigating back to an indexable page
      robotsEl.content = 'index, follow';
    }

    // ── Cleanup: reset to defaults on unmount ──────────────────────────────────
    return () => {
      document.title = `${SITE_NAME} – Buy & Sell Anything in Kenya`;
      setMeta('meta[property="og:type"]',  'content', 'website');
      setMeta('meta[property="og:image"]', 'content', DEFAULT_OG_IMAGE);
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.content = 'index, follow';
    };
  }, [title, description, canonicalPath, ogImage, ogType, keywords, noindex]);
}
