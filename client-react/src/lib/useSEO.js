/**
 * useSEO – lightweight hook to set per-page <title>, <meta>, and OG tags
 * without needing react-helmet.
 *
 * Usage:
 *   useSEO({
 *     title: 'Vehicles for Sale in Kenya',        // brand suffix auto-appended
 *     description: 'Browse thousands of cars...',
 *     canonicalPath: '/vehicles',
 *     ogImage: 'https://adhubkenya.co.ke/img.jpg', // optional, defaults to site OG image
 *     ogType: 'product',                           // optional, defaults to 'website'
 *   });
 */
import { useEffect } from 'react';

const SITE_NAME = 'AdHub Kenya';
const BASE_URL  = 'https://adhubkenya.co.ke';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function useSEO({ title, description, canonicalPath, ogImage, ogType } = {}) {
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

    // ── Description ────────────────────────────────────────────────────────────
    setMeta('meta[name="description"]', 'content', description);

    // ── Canonical + OG URL ────────────────────────────────────────────────────
    if (canonicalPath) {
      const fullUrl = `${BASE_URL}${canonicalPath}`;
      setMeta('link[rel="canonical"]', 'href', fullUrl);
      setMeta('meta[property="og:url"]', 'content', fullUrl);
    }

    // ── Open Graph ────────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]',       'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:image"]',       'content', ogImage || DEFAULT_OG_IMAGE);
    setMeta('meta[property="og:type"]',        'content', ogType  || 'website');

    // ── Twitter Card ──────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]',       'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]',       'content', ogImage || DEFAULT_OG_IMAGE);

    // ── Cleanup: reset to defaults on unmount ─────────────────────────────────
    return () => {
      document.title = `${SITE_NAME} – Buy & Sell Anything in Kenya`;
      setMeta('meta[property="og:type"]', 'content', 'website');
      setMeta('meta[property="og:image"]', 'content', DEFAULT_OG_IMAGE);
    };
  }, [title, description, canonicalPath, ogImage, ogType]);
}
