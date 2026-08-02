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
  'solar-power': {
    implied: { subcategory: 'Solar / Power' },
    hide: ['subcategory']
  }
};

export function getTaxonomyRules(categorySlug) {
  return TAXONOMY_RULES[categorySlug] || { implied: {}, hide: [] };
}
