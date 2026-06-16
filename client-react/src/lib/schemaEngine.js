export const SCHEMA_CATEGORIES = {
  property: {
    id: 'property',
    name: 'Property',
    transactionTypes: ['Sale', 'Rent', 'Lease'],
    subcategories: [
      { id: 'residential', name: 'Residential Properties' },
      { id: 'commercial', name: 'Commercial Properties' },
      { id: 'land', name: 'Land and Plots' },
      { id: 'industrial', name: 'Industrial Properties' }
    ]
  },
  vehicles: {
    id: 'vehicles',
    name: 'Vehicles',
    transactionTypes: ['Sale', 'Rent'],
    subcategories: [
      { id: 'car', name: 'Cars' },
      { id: 'bus', name: 'Buses & Microbuses' },
      { id: 'truck', name: 'Heavy Commercial / Trucks' },
      { id: 'motorcycle', name: 'Motorcycles & Scooters' }
    ]
  },
  jobs: {
    id: 'jobs',
    name: 'Jobs',
    transactionTypes: ['Full-time', 'Part-time', 'Contract'],
    subcategories: [
      { id: 'it', name: 'IT & Software' },
      { id: 'sales', name: 'Sales & Marketing' },
      { id: 'admin', name: 'Admin & Office' }
    ]
  }
};

export const SCHEMA_ATTRIBUTES = {
  // Common
  price: { id: 'price', label: 'Price (KES)', type: 'number', required: true },
  
  // Property - Sale
  titleDeed: { id: 'titleDeed', label: 'Title Deed Available', type: 'checkbox', section: 'Legal' },
  ownershipTransfer: { id: 'ownershipTransfer', label: 'Ownership Transfer Ready', type: 'checkbox', section: 'Legal' },
  freehold: { id: 'freehold', label: 'Freehold/Leasehold', type: 'select', options: ['Freehold', 'Leasehold'], section: 'Legal' },
  mortgageOptions: { id: 'mortgageOptions', label: 'Mortgage Options Available', type: 'checkbox', section: 'Financial' },
  
  // Property - Rent
  deposit: { id: 'deposit', label: 'Deposit Required (KES)', type: 'number', section: 'Financial' },
  waterIncluded: { id: 'waterIncluded', label: 'Water Included', type: 'checkbox', section: 'Utilities' },
  electricityIncluded: { id: 'electricityIncluded', label: 'Electricity Included', type: 'checkbox', section: 'Utilities' },
  internet: { id: 'internet', label: 'Internet / WiFi', type: 'checkbox', section: 'Utilities' },
  availableFrom: { id: 'availableFrom', label: 'Available From', type: 'date', section: 'Availability' },
  
  // Property - Residential / Shared
  bedrooms: { id: 'bedrooms', label: 'Bedrooms', type: 'select', options: ['1', '2', '3', '4', '5+'], section: 'Layout' },
  bathrooms: { id: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'], section: 'Layout' },
  furnished: { id: 'furnished', label: 'Furnished', type: 'select', options: ['Unfurnished', 'Semi-furnished', 'Fully Furnished'], section: 'Layout' },
  balcony: { id: 'balcony', label: 'Balcony / Patio', type: 'checkbox', section: 'Features' },
  floorNumber: { id: 'floorNumber', label: 'Floor Number', type: 'number', section: 'Layout' },
  
  // Property - Land
  plotSize: { id: 'plotSize', label: 'Plot Size (Acres/SqFt)', type: 'text', section: 'Dimensions' },
  surveyMap: { id: 'surveyMap', label: 'Survey Map Available', type: 'checkbox', section: 'Legal' },
  roadAccess: { id: 'roadAccess', label: 'Road Access', type: 'checkbox', section: 'Features' },
  waterAvailability: { id: 'waterAvailability', label: 'Water Availability on Site', type: 'checkbox', section: 'Features' },
  
  // Common Features (Used across subcategories)
  parking: { id: 'parking', label: 'Parking Spaces', type: 'number', section: 'Features' },
  security: { id: 'security', label: '24/7 Security', type: 'checkbox', section: 'Features' },

  // Vehicles
  make: { id: 'make', label: 'Make', type: 'text', section: 'Specs', required: true },
  model: { id: 'model', label: 'Model', type: 'text', section: 'Specs', required: true },
  variant: { id: 'variant', label: 'Variant / Trim', type: 'text', section: 'Specs' },
  year: { id: 'year', label: 'Year of Manufacture', type: 'number', section: 'Specs', required: true },
  mileage: { id: 'mileage', label: 'Mileage (km)', type: 'number', section: 'Specs' },
  fuelType: { id: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], section: 'Specs' },
  transmission: { id: 'transmission', label: 'Transmission', type: 'select', options: ['Automatic', 'Manual'], section: 'Specs' },
  engineCapacity: { id: 'engineCapacity', label: 'Engine Capacity (cc)', type: 'number', section: 'Specs' },
  driveType: { id: 'driveType', label: 'Drive Type', type: 'select', options: ['2WD', '4WD', 'AWD'], section: 'Specs' },

  // Jobs
  salary: { id: 'salary', label: 'Salary Range', type: 'text', section: 'Job Details' },
  employmentType: { id: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Internship'], section: 'Job Details' },
  experience: { id: 'experience', label: 'Years of Experience', type: 'select', options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'], section: 'Job Details' },
  deadline: { id: 'deadline', label: 'Application Deadline', type: 'date', section: 'Job Details' },
  remoteOption: { id: 'remoteOption', label: 'Remote Work Option', type: 'checkbox', section: 'Job Details' }
};

export const SCHEMA_RULES = [
  // ── PROPERTY RULES ──────────────────────────────────────
  // Rent Logic
  {
    attributeId: ['deposit', 'waterIncluded', 'electricityIncluded', 'internet', 'availableFrom'],
    visibleIf: { category: 'property', transactionType: ['Rent', 'Lease'] }
  },
  // Sale Logic
  {
    attributeId: ['titleDeed', 'ownershipTransfer', 'mortgageOptions'],
    visibleIf: { category: 'property', transactionType: ['Sale'] }
  },
  // Freehold/Leasehold (Property Sale, not for Rent)
  {
    attributeId: ['freehold'],
    visibleIf: { category: 'property', transactionType: ['Sale'] }
  },
  
  // Residential / Commercial Layout (Hide for Land)
  {
    attributeId: ['bedrooms', 'bathrooms', 'furnished', 'balcony', 'floorNumber'],
    visibleIf: { category: 'property', subcategory: ['residential', 'commercial'] },
    hiddenIf: { subcategory: ['land'] }
  },
  
  // Land Only Logic
  {
    attributeId: ['plotSize', 'surveyMap', 'roadAccess', 'waterAvailability'],
    visibleIf: { category: 'property', subcategory: ['land'] }
  },
  
  // General Property Features
  {
    attributeId: ['parking', 'security'],
    visibleIf: { category: 'property' }
  },

  // ── VEHICLE RULES ───────────────────────────────────────
  {
    attributeId: ['make', 'model', 'variant', 'year', 'mileage', 'fuelType', 'transmission', 'engineCapacity', 'driveType'],
    visibleIf: { category: 'vehicles' }
  },

  // ── JOB RULES ───────────────────────────────────────────
  {
    attributeId: ['salary', 'employmentType', 'experience', 'deadline', 'remoteOption'],
    visibleIf: { category: 'jobs' }
  }
];

/**
 * Returns a list of attribute definitions that are visible for the given context.
 */
export function getVisibleAttributes(context) {
  const { category, transactionType, subcategory } = context;
  const visibleAttrIds = new Set();

  SCHEMA_RULES.forEach(rule => {
    let isVisible = true;
    
    // Check visibleIf conditions
    if (rule.visibleIf) {
      if (rule.visibleIf.category && !forceArray(rule.visibleIf.category).includes(category)) isVisible = false;
      if (rule.visibleIf.transactionType && !forceArray(rule.visibleIf.transactionType).includes(transactionType)) isVisible = false;
      if (rule.visibleIf.subcategory && !forceArray(rule.visibleIf.subcategory).includes(subcategory)) isVisible = false;
    }

    // Check hiddenIf conditions (overrides visibleIf)
    if (rule.hiddenIf && isVisible) {
      let isHidden = false;
      if (rule.hiddenIf.category && forceArray(rule.hiddenIf.category).includes(category)) isHidden = true;
      if (rule.hiddenIf.transactionType && forceArray(rule.hiddenIf.transactionType).includes(transactionType)) isHidden = true;
      if (rule.hiddenIf.subcategory && forceArray(rule.hiddenIf.subcategory).includes(subcategory)) isHidden = true;
      
      if (isHidden) isVisible = false;
    }

    if (isVisible) {
      forceArray(rule.attributeId).forEach(id => visibleAttrIds.add(id));
    }
  });

  // Map IDs to actual attribute objects, grouped by section
  const visibleAttrs = Array.from(visibleAttrIds).map(id => SCHEMA_ATTRIBUTES[id]).filter(Boolean);
  
  return visibleAttrs;
}

function forceArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}
