/**
 * TAXONOMY ENGINE
 * =====================
 * This engine maps category slugs to their implicitly forced attributes.
 * When a user selects a category, these fields are automatically set in the form
 * and completely hidden from the UI to prevent redundancy and errors.
 */

export const TAXONOMY_RULES = {
  // ─── PROPERTY ──────────────────────────────────────────────────────────────
  'houses-sale': {
    implied: { propertyType: 'House', listingType: 'Sale' },
    hide: ['propertyType', 'listingType']
  },
  'houses-rent': {
    implied: { propertyType: 'House', listingType: 'Rent' },
    hide: ['propertyType', 'listingType']
  },
  'apartments-sale': {
    implied: { propertyType: 'Apartment', listingType: 'Sale' },
    hide: ['propertyType', 'listingType']
  },
  'apartments-rent': {
    implied: { propertyType: 'Apartment', listingType: 'Rent', pricePeriod: 'Per Month' },
    hide: ['propertyType', 'listingType', 'pricePeriod']
  },
  'land-plots': {
    implied: { propertyType: 'Land', listingType: 'Sale' },
    hide: ['propertyType', 'listingType']
  },
  'commercial-property': {
    implied: { propertyType: 'Commercial Office' },
    hide: []
  },
  'short-stays': {
    implied: { listingType: 'Short Let' },
    hide: ['listingType']
  },
  'student-hostels': {
    implied: { propertyType: 'Hostel', listingType: 'Rent', pricePeriod: 'Per Month' },
    hide: ['propertyType', 'listingType']
  },

  // ─── PHONES & TABLETS (Child Categories) ───────────────────────────────────
  'smartphones': {
    implied: { device_type: 'Mobile Phones' },
    hide: ['device_type']
  },
  'feature-phones': {
    implied: { device_type: 'Feature Phones' },
    hide: ['device_type']
  },
  'tablets': {
    implied: { device_type: 'Tablets' },
    hide: ['device_type']
  },
  'phone-accessories': {
    implied: { device_type: 'Accessories' },
    hide: ['device_type']
  },
  'wearables': {
    implied: { device_type: 'Smart Watches' },
    hide: ['device_type']
  },
  
  
  // ─── ELECTRONICS (Child Categories) ────────────────────────────────────────
  'televisions': {
    implied: { subcategory: 'Smart TV / Monitor' },
    hide: ['subcategory']
  },
  'audio-music': {
    implied: { subcategory: 'Audio / Speakers' },
    hide: ['subcategory']
  },
  'laptops-computers': {
    implied: { subcategory: 'Laptop / Computer' },
    hide: ['subcategory']
  },
  'cameras': {
    implied: { subcategory: 'Camera / DSLR' },
    hide: ['subcategory']
  },
  'gaming': {
    implied: { subcategory: 'Gaming Console' },
    hide: ['subcategory']
  },
  'printers-office': {
    implied: { subcategory: 'Printer / Scanner' },
    hide: ['subcategory']
  },
  'networking': {
    implied: { subcategory: 'Networking (Router/Modem)' },
    hide: ['subcategory']
  },
  'accessories': {
    implied: { subcategory: 'Accessories' },
    hide: ['subcategory']
  },

  // ─── FASHION (Child Categories) ────────────────────────────────────────────
  'mens-clothing': {
    implied: { category: 'Clothing', subcategory: 'Men', gender: 'Men' },
    hide: ['category', 'subcategory', 'gender']
  },
  'womens-clothing': {
    implied: { category: 'Clothing', subcategory: 'Women', gender: 'Women' },
    hide: ['category', 'subcategory', 'gender']
  },
  'kids-clothing': {
    implied: { category: 'Clothing', subcategory: 'Kids', gender: 'Kids' },
    hide: ['category', 'subcategory', 'gender']
  },
  'shoes': {
    implied: { category: 'Shoes', subcategory: 'Unisex' },
    hide: ['category', 'subcategory']
  },
  'bags-luggage': {
    implied: { category: 'Bags & Wallets', subcategory: 'Unisex' },
    hide: ['category', 'subcategory']
  },
  'watches-jewellery': {
    implied: { category: 'Watches', subcategory: 'Unisex' },
    hide: ['category', 'subcategory']
  },
  'eyewear': {
    implied: { category: 'Accessories', subcategory: 'Unisex' },
    hide: ['category', 'subcategory']
  },
  'solar-power': {
    implied: { subcategory: 'Solar / Power' },
    hide: ['subcategory']
  }
};

export function getTaxonomyRules(categorySlug) {
  return TAXONOMY_RULES[categorySlug] || { implied: {}, hide: [] };
}
