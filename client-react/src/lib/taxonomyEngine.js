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
    implied: { property_type: 'House', listing_type: 'Sale' },
    hide: ['property_type', 'listing_type']
  },
  'houses-rent': {
    implied: { property_type: 'House', listing_type: 'Rent' },
    hide: ['property_type', 'listing_type']
  },
  'apartments-sale': {
    implied: { property_type: 'Apartment', listing_type: 'Sale' },
    hide: ['property_type', 'listing_type']
  },
  'apartments-rent': {
    implied: { property_type: 'Apartment', listing_type: 'Rent', price_period: 'Per Month' },
    hide: ['property_type', 'listing_type', 'price_period']
  },
  'land-plots': {
    implied: { property_type: 'Land', listing_type: 'Sale' },
    hide: ['property_type', 'listing_type']
  },
  'commercial-property': {
    implied: { property_type: 'Commercial Office' },
    hide: []
  },
  'short-stays': {
    implied: { listing_type: 'Short Let' },
    hide: ['listing_type']
  },
  'student-hostels': {
    implied: { property_type: 'Hostel', listing_type: 'Rent', price_period: 'Per Month' },
    hide: ['property_type', 'listing_type']
  }
};

export function getTaxonomyRules(categorySlug) {
  return TAXONOMY_RULES[categorySlug] || { implied: {}, hide: [] };
}
