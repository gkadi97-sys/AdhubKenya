/**
 * modelSpecs.js
 * =============
 * Structured metadata dictionary for dependent (cascading) filter validation.
 * This prevents impossible attribute combinations (e.g. an iOS Samsung Galaxy S6).
 * 
 * Hierarchy: categorySlug -> level1 (e.g. brand/make) -> level2 (e.g. model) -> allowed attributes
 */

export const MODEL_SPECS = {
  'phones-tablets': {
    'Samsung': {
      'Galaxy S6': {
        ram: ['3GB'],
        storage: ['32GB', '64GB', '128GB'],
        network: ['2G', '3G', '4G LTE'], // No 5G
        os: ['Android'],
        color: ['White', 'Black', 'Gold', 'Blue', 'Other']
      },
      'Galaxy S24': {
        ram: ['8GB'],
        storage: ['128GB', '256GB', '512GB'],
        network: ['4G LTE', '5G'],
        os: ['Android'],
        color: ['Black', 'Grey', 'Violet', 'Yellow', 'Other']
      }
    },
    'Apple': {
      'iPhone 15 Pro': {
        ram: ['8GB'],
        storage: ['128GB', '256GB', '512GB', '1TB'],
        network: ['4G LTE', '5G'],
        os: ['iOS'],
        color: ['Titanium', 'Black', 'White', 'Blue', 'Other']
      }
    }
  },
  'electronics': {
    'Apple': {
      'MacBook Air M1': {
        ram: ['8GB', '16GB'],
        storage: ['256GB', '512GB', '1TB', '2TB'],
        os: ['macOS'],
        screenSize: ['13.3"']
      }
    }
  },
  'vehicles': {
    'Toyota': {
      'Premio': {
        engineSize_min: ['1490'],
        engineSize_max: ['2000'],
        transmission: ['Automatic', 'CVT'],
        fuelType: ['Petrol'],
        bodyType: ['Sedan']
      }
    }
  }
};
