/**
 * UrlService.js
 * Centralized service for generating clean, stable SEO URLs across the AdHub Kenya platform.
 * NEVER manually concatenate strings for routes. Always use this service.
 */

class UrlService {
  /**
   * Normalizes a string into a URL-friendly slug.
   * e.g., "Samsung Galaxy S24 Ultra 12GB/512GB" -> "samsung-galaxy-s24-ultra-12gb-512gb"
   * @param {string} text 
   * @returns {string}
   */
  static generateSlug(text) {
    if (!text) return 'item';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')           // Replace spaces and underscores with hyphens
      .replace(/[^\w-]+/g, '')           // Remove all non-word chars
      .replace(/--+/g, '-')              // Replace multiple hyphens with single hyphen
      .replace(/^-+/, '')                // Trim hyphens from start
      .replace(/-+$/, '');               // Trim hyphens from end
  }

  /**
   * Normalizes an entire URL path to ensure no duplicate slashes, trailing slashes, etc.
   * e.g. "/Phones//Samsung///48392/" -> "/phones/samsung/48392"
   * @param {string} path 
   * @returns {string}
   */
  static normalizePath(path) {
    if (!path) return '/';
    let normalized = path
      .toLowerCase()
      .replace(/\/+/g, '/') // Remove duplicate slashes
      .replace(/\/+$/, ''); // Remove trailing slashes
    return normalized === '' ? '/' : normalized;
  }

  /**
   * Generates a permanent URL for a listing.
   * e.g. /phones-tablets/samsung-galaxy-s24-ultra-12gb-512gb-48392
   * @param {Object} listing 
   * @returns {string}
   */
  static listing(listing) {
    if (!listing || !listing.id) return '/';
    
    // Fallback if category or slug is missing
    const categorySlug = listing.category ? this.generateSlug(listing.category) : 'misc';
    
    // We prefer a DB-persisted slug if available. Otherwise, generate one from title.
    let itemSlug = listing.slug;
    if (!itemSlug) {
      itemSlug = listing.title ? this.generateSlug(listing.title) : 'listing';
    }

    return this.normalizePath(`/${categorySlug}/${itemSlug}-${listing.id}`);
  }

  /**
   * Generates a URL for a category landing page.
   * e.g. /vehicles
   */
  static category(categoryName) {
    return this.normalizePath(`/${this.generateSlug(categoryName)}`);
  }

  /**
   * Generates a URL for a location landing page.
   * e.g. /vehicles/in/nairobi
   */
  static location(categoryName, county) {
    const cat = this.generateSlug(categoryName);
    const loc = this.generateSlug(county);
    return this.normalizePath(`/${cat}/in/${loc}`);
  }

  /**
   * Generates a URL for a brand landing page.
   * e.g. /phones-tablets/samsung
   */
  static brand(categoryName, brandName) {
    const cat = this.generateSlug(categoryName);
    const brand = this.generateSlug(brandName);
    return this.normalizePath(`/${cat}/${brand}`);
  }

  /**
   * Generates a URL for a model landing page.
   * e.g. /phones-tablets/samsung/galaxy-s24-ultra
   */
  static model(categoryName, brandName, modelName) {
    const cat = this.generateSlug(categoryName);
    const brand = this.generateSlug(brandName);
    const model = this.generateSlug(modelName);
    return this.normalizePath(`/${cat}/${brand}/${model}`);
  }

  /**
   * Generates a URL for a seller's public profile.
   * e.g. /seller/john-motors-123
   */
  static seller(userId, username) {
    const name = username ? this.generateSlug(username) : 'user';
    return this.normalizePath(`/seller/${name}-${userId}`);
  }

  /**
   * Generates a URL for a buying guide.
   */
  static guide(guideTitle) {
    return this.normalizePath(`/guides/${this.generateSlug(guideTitle)}`);
  }

  /**
   * Generates a URL for an article/blog post.
   */
  static article(articleTitle) {
    return this.normalizePath(`/blog/${this.generateSlug(articleTitle)}`);
  }

  /**
   * Generates a URL for a generic search result (NOINDEX).
   */
  static search(query) {
    const params = new URLSearchParams();
    if (query) params.set('keyword', query);
    return `/browse?${params.toString()}`;
  }
}

export default UrlService;
