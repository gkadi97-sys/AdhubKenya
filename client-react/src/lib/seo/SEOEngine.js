/**
 * SEOEngine.js
 * Central business logic for generating all SEO metadata.
 * Ensures titles, descriptions, canonical URLs, and robots directives are consistent.
 */

import UrlService from './UrlService';

const SITE_NAME = 'AdHub Kenya';
const BASE_URL = 'https://adhubkenya.co.ke';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = '@AdHubKenya';

// In-memory cache for listing metadata to prevent unnecessary recalculations
const SEOCache = new Map();
const MAX_CACHE_SIZE = 500;

class SEOEngine {
  /**
   * Generates a complete SEO metadata object for a listing.
   */
  static generateListing(listing) {
    if (!listing) return this.generateFallback();

    // Cache lookup based on ID and last updated timestamp
    const cacheKey = `${listing.id}-${listing.updated_at || ''}`;
    if (SEOCache.has(cacheKey)) {
      return SEOCache.get(cacheKey);
    }

    const title = `${listing.title} for Sale in ${listing.location || 'Kenya'} | ${SITE_NAME}`;
    
    // Build description safely
    let priceStr = '';
    if (listing.price && typeof listing.price === 'number') {
      priceStr = ` for KES ${listing.price.toLocaleString()}`;
    }
    const description = `Buy a ${listing.title}${priceStr} in ${listing.location || 'Kenya'}. Compare prices from verified sellers on ${SITE_NAME}.`;
    
    const canonical = UrlService.listing(listing);
    const imageUrl = (listing.images && listing.images.length > 0) ? listing.images[0] : DEFAULT_IMAGE;

    // Handle listing lifecycle indexation
    let noindex = false;
    let finalCanonical = canonical;

    if (listing.status === 'closed') {
      noindex = true;
    } else if (listing.status === 'deleted') {
      noindex = true;
      // Ideally handled by HTTP 410, but on SPA we do this
    } else if (listing.status === 'draft') {
      noindex = true;
    }

    const metadata = {
      title,
      description,
      canonical: finalCanonical,
      noindex,
      openGraph: {
        title,
        description,
        url: `${BASE_URL}${finalCanonical}`,
        image: imageUrl,
        type: 'product'
      },
      twitter: {
        card: 'summary_large_image',
        site: TWITTER_HANDLE,
        title,
        description,
        image: imageUrl
      }
    };

    // Store in cache with eviction policy
    if (SEOCache.size >= MAX_CACHE_SIZE) {
      // Delete the oldest entry (Map iterates in insertion order)
      const firstKey = SEOCache.keys().next().value;
      SEOCache.delete(firstKey);
    }
    SEOCache.set(cacheKey, metadata);

    return metadata;
  }

  /**
   * Generates SEO metadata for a Category Landing Page.
   */
  static generateCategory(categoryName, county = null) {
    const locStr = county ? ` in ${county}` : ' in Kenya';
    const title = `${categoryName} for Sale${locStr} | ${SITE_NAME}`;
    const description = `Browse ${categoryName.toLowerCase()}${locStr}. Find the best deals from trusted sellers across Kenya.`;
    
    const canonical = county 
      ? UrlService.location(categoryName, county) 
      : UrlService.category(categoryName);

    return {
      title,
      description,
      canonical,
      noindex: false,
      openGraph: {
        title,
        description,
        url: `${BASE_URL}${canonical}`,
        image: DEFAULT_IMAGE,
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        site: TWITTER_HANDLE,
        title,
        description,
        image: DEFAULT_IMAGE
      }
    };
  }

  /**
   * Generates SEO metadata for generic Search / Filtered pages.
   * Search result pages and complex filtered views should generally NOT be indexed to prevent index bloat.
   */
  static generateSearch(query) {
    const title = query ? `Search results for "${query}" | ${SITE_NAME}` : `Search ${SITE_NAME}`;
    const description = `Browse search results on ${SITE_NAME}.`;
    
    const canonical = UrlService.search(query);

    return {
      title,
      description,
      canonical,
      noindex: true, // Crucial: Don't index dynamic search results
      openGraph: {
        title,
        description,
        url: `${BASE_URL}${canonical}`,
        image: DEFAULT_IMAGE,
        type: 'website'
      },
      twitter: {
        card: 'summary',
        site: TWITTER_HANDLE,
        title,
        description,
        image: DEFAULT_IMAGE
      }
    };
  }

  /**
   * Generates a generic fallback / static page SEO object.
   */
  static generateStatic(title, description, path, noindex = false) {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const desc = description || `Kenya's free classifieds marketplace. Buy and sell cars, property, electronics, jobs and more.`;
    const canonical = UrlService.normalizePath(path);

    return {
      title: fullTitle,
      description: desc,
      canonical,
      noindex,
      openGraph: {
        title: fullTitle,
        description: desc,
        url: `${BASE_URL}${canonical}`,
        image: DEFAULT_IMAGE,
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        site: TWITTER_HANDLE,
        title: fullTitle,
        description: desc,
        image: DEFAULT_IMAGE
      }
    };
  }

  /**
   * Fallback if nothing else matches
   */
  static generateFallback() {
    return this.generateStatic(SITE_NAME, '', '/');
  }
}

export default SEOEngine;
