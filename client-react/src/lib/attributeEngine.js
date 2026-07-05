// src/lib/attributeEngine.js

/**
 * ATTRIBUTE ENGINE
 * Single Source of Truth for all category-specific attributes.
 * These definitions power both the Ad Posting Form (DynamicListingForm)
 * and the Browse Sidebar (FilterPanel).
 */

import * as LaptopEnums from './laptopSchemaEnums';

export const ATTRIBUTE_ENGINE = {
  vehicles: {
    groups: [
      { id: 'basics', title: 'Vehicle Basics' },
      { id: 'specs', title: 'Specifications' },
      { id: 'details', title: 'Details & Condition' }
    ],
    attributes: [
      { 
        id: 'make', 
        label: 'Make', 
        type: 'dynamic-cascade', 
        cascadeLevel: 1,
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'model', 
        label: 'Model', 
        type: 'dynamic-cascade', 
        cascadeLevel: 2,
        cascadeParent: 'make',
        dependsOn: { field: 'make' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'year', 
        label: 'Year of Manufacture', 
        type: 'enum', 
        options: Array.from({length: 36}, (_, i) => (new Date().getFullYear() - i).toString()),
        dependsOn: { field: 'model' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'mileage', 
        label: 'Mileage (km)', 
        type: 'number',
        postAd: { required: true, group: 'basics', uiType: 'number' },
        search: { filterable: true, uiType: 'range' }
      },
      { 
        id: 'transmission', 
        label: 'Transmission', 
        type: 'enum', 
        options: ['Automatic', 'Manual', 'CVT', 'DCT', 'Semi-Auto'],
        postAd: { required: true, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'fuelType', 
        label: 'Fuel Type', 
        type: 'enum', 
        options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'],
        postAd: { required: true, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      { 
        id: 'bodyType', 
        label: 'Body Style', 
        type: 'enum', 
        options: ['Sedan', 'Hatchback', 'Station Wagon', 'SUV / Crossover', 'Coupe', 'Convertible', 'Pickup / Double Cabin', 'Van / Minivan'],
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'driveType', 
        label: 'Drive Type', 
        type: 'enum', 
        options: ['FWD', 'RWD', 'AWD', '4WD'],
        postAd: { required: false, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'engineSize', 
        label: 'Engine Size (CC)', 
        type: 'number',
        postAd: { required: false, group: 'specs', uiType: 'number' },
        search: { filterable: true, uiType: 'range' }
      },
      { 
        id: 'color', 
        label: 'Color', 
        type: 'enum', 
        options: ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Brown', 'Green', 'Pearl White', 'Other'],
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'registered', 
        label: 'Registered in Kenya?', 
        type: 'enum', 
        options: ['Yes', 'No'],
        postAd: { required: true, group: 'details', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'exchange', 
        label: 'Exchange Accepted?', 
        type: 'enum', 
        options: ['Yes', 'No'],
        postAd: { required: true, group: 'details', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'seats', 
        label: 'Number of Seats', 
        type: 'enum', 
        options: ['2', '4', '5', '6', '7', '8+'],
        postAd: { required: false, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'doors', 
        label: 'Number of Doors', 
        type: 'enum', 
        options: ['2', '3', '4', '5'],
        postAd: { required: false, group: 'details', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'usageType', 
        label: 'Usage Type', 
        type: 'enum', 
        options: ['Local', 'Import / Ex-Japan', 'Import / Ex-UK', 'Ex-Lease', 'Diplomatic'],
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'condition',
        label: 'Condition',
        type: 'enum',
        options: ['Brand New', 'Foreign Used', 'Local Used'],
        postAd: { required: true, group: 'details', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      }
    ]
  },
  'auto-spares': {
    groups: [
      { id: 'basics', title: 'Part Classification' },
      { id: 'details', title: 'Part Details' },
      { id: 'vehicle', title: 'Vehicle Compatibility' }
    ],
    attributes: [
      // ─── STEP 1: Listing Type ─────────────────────────────────────────────
      {
        id: 'listingType',
        label: 'Listing Type',
        type: 'enum',
        options: ['spare-part', 'accessory'],
        optionLabels: {
          'spare-part': 'Spare Part',
          'accessory': 'Accessory'
        },
        postAd: { required: true, group: 'basics', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },

      // ─── STEP 2A: SPARE PARTS cascade ────────────────────────────────────
      {
        id: 'partCategory',
        label: 'Part Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        dependsOn: { field: 'listingType', value: 'spare-part' },
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'part',
        label: 'Spare Part',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'partCategory',
        dependsOn: { and: [
          { field: 'listingType', value: 'spare-part' },
          { field: 'partCategory' }
        ]},
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'position',
        label: 'Position',
        type: 'dynamic-cascade',
        cascadeLevel: 3,
        cascadeParent: 'part',
        dependsOn: { and: [
          { field: 'listingType', value: 'spare-part' },
          { field: 'part' } 
        ]},
        postAd: { required: false, group: 'details', uiType: 'select' },
        search: { filterable: false } // position is part-specific; not meaningful as a browse filter
      },
      {
        id: 'oemNumber',
        label: 'OEM Part Number',
        type: 'text',
        postAd: { required: false, group: 'details', uiType: 'text' },
        search: { filterable: true, uiType: 'text' }
      },

      // ─── STEP 2B: ACCESSORIES cascade ────────────────────────────────────
      {
        id: 'accCategory',
        label: 'Accessory Group',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        dependsOn: { field: 'listingType', value: 'accessory' },
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'accSubcategory',
        label: 'Accessory Category',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'accCategory',
        dependsOn: { and: [
          { field: 'listingType', value: 'accessory' },
          { field: 'accCategory' }
        ]},
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'item',
        label: 'Accessory Item',
        type: 'dynamic-cascade',
        cascadeLevel: 3,
        cascadeParent: 'accSubcategory',
        dependsOn: { and: [
          { field: 'listingType', value: 'accessory' },
          { field: 'accSubcategory' }
        ]},
        postAd: { required: true, group: 'details', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },

      // ─── STEP 3: COMPATIBILITY SELECTOR (Accessories only — posting only) ─
      {
        id: 'compatibility',
        label: 'Compatibility',
        type: 'enum',
        options: ['UNIVERSAL', 'VEHICLE_CLASS', 'MAKE_SPECIFIC', 'MODEL_SPECIFIC'],
        optionLabels: {
          UNIVERSAL: 'Universal (fits any vehicle)',
          VEHICLE_CLASS: 'Vehicle Class (e.g. SUV, Pickup, Truck)',
          MAKE_SPECIFIC: 'Make Specific (e.g. Toyota, Nissan)',
          MODEL_SPECIFIC: 'Model Specific (e.g. Toyota Hilux)'
        },
        dependsOn: { and: [
          { field: 'listingType', value: 'accessory' },
          { field: 'item' }
        ]},
        postAd: { required: true, group: 'vehicle', uiType: 'select' },
        search: { filterable: false }  // posting-only — buyers filter by class/make/model directly
      },

      // ─── STEP 4A: Vehicle Class — shown in discovery for accessories ───────
      {
        id: 'vehicleClass',
        label: 'Vehicle Class',
        type: 'enum',
        options: ['Car', 'SUV', 'Pickup', 'Truck', 'Motorcycle', 'Van', 'Bus', 'Commercial'],
        dependsOn: { and: [
          { field: 'listingType', value: 'accessory' },
          { field: 'compatibility', value: 'VEHICLE_CLASS' }
        ]},
        postAd: { required: true, group: 'vehicle', uiType: 'select' },
        // In discovery, always show for accessories so buyers can filter by class
        search: { filterable: true, uiType: 'radio' }
      },

      // ─── STEP 4B: Vehicle Make (spare-parts OR make/model specific accessories)
      {
        id: 'make',
        label: 'Vehicle Make',
        type: 'enum',
        options: [
          'Alfa Romeo', 'Audi', 'BMW', 'Chevrolet', 'Chrysler',
          'Citroën', 'Daihatsu', 'Dodge', 'Ferrari', 'Fiat',
          'Ford', 'GAC', 'GMC', 'Great Wall', 'Honda',
          'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep',
          'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Mahindra',
          'Maserati', 'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
          'Nissan', 'Peugeot', 'Porsche', 'Renault', 'Rolls-Royce',
          'Rover', 'Saab', 'Ssangyong', 'Subaru', 'Suzuki',
          'Toyota', 'Volkswagen', 'Volvo',
        ],
        // In discovery, show Make for accessories whenever listingType=accessory
        dependsOn: [
          { field: 'listingType', value: 'spare-part' },
          { field: 'listingType', value: 'accessory' }
        ],
        postAd: {
          // posting: only show for spare-parts or make/model-specific accessories
          required: true, group: 'vehicle', uiType: 'select',
          dependsOn: [
            { field: 'listingType', value: 'spare-part' },
            { and: [
              { field: 'listingType', value: 'accessory' },
              { field: 'compatibility', value: ['MAKE_SPECIFIC', 'MODEL_SPECIFIC'] }
            ]}
          ]
        },
        search: { filterable: true, uiType: 'select' }
      },

      // ─── STEP 4C: Vehicle Model (cascades from Make) ──────────────────────
      {
        id: 'model',
        label: 'Vehicle Model',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'make',
        dependsOn: { field: 'make' },
        postAd: { required: true, group: 'vehicle', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },

      // ─── STEP 4D: Year, Generation, Engine ───────────────────────────────
      {
        id: 'compatibleYear',
        label: 'Compatible Year',
        type: 'enum',
        options: Array.from({length: 36}, (_, i) => (new Date().getFullYear() - i).toString()),
        dependsOn: { field: 'make' },
        postAd: { required: false, group: 'vehicle', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'generation',
        label: 'Generation / Chassis',
        type: 'text',
        dependsOn: { field: 'make' },
        postAd: { required: false, group: 'vehicle', uiType: 'text' },
        search: { filterable: false } // free-text; useless as a browse filter
      },
      {
        id: 'engine',
        label: 'Engine Code',
        type: 'text',
        dependsOn: { field: 'make' },
        postAd: { required: false, group: 'vehicle', uiType: 'text' },
        search: { filterable: false } // free-text; useless as a browse filter
      }
    ]
  },
  property: {
    groups: [
      { id: 'classification', title: 'Property Classification' },
      { id: 'location', title: 'Location' },
      { id: 'residential', title: 'Residential Details' },
      { id: 'land', title: 'Land Details' },
      { id: 'commercial', title: 'Commercial Details' },
      { id: 'amenities', title: 'Amenities' },
      { id: 'nearby', title: 'Nearby Facilities' },
      { id: 'seller', title: 'Seller Information' }
    ],
    attributes: [
      // ─── Classification ───────────────────────────────────────────────
      {
        id: 'listingType',
        label: 'Listing Type',
        type: 'enum',
        options: ['For Sale', 'For Rent', 'For Lease', 'Auction'],
        postAd: { required: true, group: 'classification', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'propertyCategory',
        label: 'Property Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'classification', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'propertyType',
        label: 'Property Type',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'propertyCategory',
        dependsOn: { field: 'propertyCategory' },
        postAd: { required: true, group: 'classification', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'propertyVariant',
        label: 'Property Variant',
        type: 'dynamic-cascade',
        cascadeLevel: 3,
        cascadeParent: 'propertyType',
        cascadeGrandparent: 'propertyCategory',
        dependsOn: { field: 'propertyType' },
        postAd: { required: false, group: 'classification', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'propertyCondition',
        label: 'Property Condition',
        type: 'enum',
        options: ['New', 'Recently Renovated', 'Good', 'Fair', 'Needs Renovation', 'Off-plan'],
        postAd: { required: false, group: 'classification', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'availabilityDate',
        label: 'Available From',
        type: 'text',
        postAd: { required: false, group: 'classification', uiType: 'text' },
        search: { filterable: false, uiType: 'text' }
      },
      {
        id: 'negotiable',
        label: 'Price Negotiable',
        type: 'enum',
        options: ['Yes', 'No'],
        postAd: { required: false, group: 'classification', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },

      // ─── Location ─────────────────────────────────────────────────────
      {
        id: 'estate',
        label: 'Estate / Neighbourhood',
        type: 'text',
        postAd: { required: false, group: 'location', uiType: 'text' },
        search: { filterable: true, uiType: 'text' }
      },
      {
        id: 'gpsLocation',
        label: 'GPS Coordinates / Map Pin',
        type: 'text',
        postAd: { required: false, group: 'location', uiType: 'text' },
        search: { filterable: false, uiType: 'text' }
      },
      {
        id: 'virtualTourLink',
        label: 'Virtual Tour / Video Link',
        type: 'text',
        postAd: { required: false, group: 'location', uiType: 'text' },
        search: { filterable: false, uiType: 'text' }
      },

      // ─── Residential ──────────────────────────────────────────────────
      {
        id: 'bedrooms',
        label: 'Bedrooms',
        type: 'enum',
        options: ['Bedsitter', 'Studio', '1', '2', '3', '4', '5', '6', '7+'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property'] },
        postAd: { required: false, group: 'residential', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'bathrooms',
        label: 'Bathrooms',
        type: 'enum',
        options: ['1', '2', '3', '4', '5+'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property', 'Commercial Property'] },
        postAd: { required: false, group: 'residential', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'toilets',
        label: 'Toilets',
        type: 'enum',
        options: ['1', '2', '3', '4', '5+'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property'] },
        postAd: { required: false, group: 'residential', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'floors',
        label: 'Number of Floors',
        type: 'enum',
        options: ['1', '2', '3', '4', '5+'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property'] },
        postAd: { required: false, group: 'residential', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'floorNumber',
        label: 'Floor Number',
        type: 'enum',
        options: ['Ground', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
        dependsOn: { field: 'propertyType', value: ['Apartments for Sale', 'Apartments for Rent', 'Studio Apartments', 'Bedsitters', 'Offices'] },
        postAd: { required: false, group: 'residential', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'builtUpArea',
        label: 'Built-up Area (sq ft)',
        type: 'number',
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property', 'Commercial Property'] },
        postAd: { required: false, group: 'residential', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'yearBuilt',
        label: 'Year Built',
        type: 'number',
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property', 'Commercial Property'] },
        postAd: { required: false, group: 'residential', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'furnished',
        label: 'Furnished',
        type: 'enum',
        options: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        dependsOn: [
          { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property'] },
          { field: 'propertyCategory', value: ['Commercial Property'] }
        ],
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'serviceCharge',
        label: 'Service Charge',
        type: 'enum',
        options: ['Included', 'Not Included', 'Negotiable'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Commercial Property'] },
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'petsAllowed',
        label: 'Pets Allowed',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Holiday Property'] },
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'occupancyStatus',
        label: 'Occupancy Status',
        type: 'enum',
        options: ['Vacant', 'Occupied', 'Under Construction'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Commercial Property', 'Holiday Property'] },
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'newBuild',
        label: 'New Build',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Commercial Property'] },
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'offPlan',
        label: 'Off-plan',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Commercial Property'] },
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'rentalPeriod',
        label: 'Rental Period',
        type: 'enum',
        options: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        dependsOn: { field: 'listingType', value: ['For Rent', 'For Lease'] },
        postAd: { required: false, group: 'residential', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },

      // ─── Land ─────────────────────────────────────────────────────────
      {
        id: 'landSize',
        label: 'Land Size',
        type: 'number',
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'landSizeUnit',
        label: 'Size Unit',
        type: 'enum',
        options: ['Acres', 'Hectares', 'Square Metres', 'Square Feet'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'plotSize',
        label: 'Plot Size (sq ft)',
        type: 'number',
        dependsOn: { field: 'propertyCategory', value: ['Residential Property', 'Commercial Property', 'Holiday Property'] },
        postAd: { required: false, group: 'land', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'titleDeed',
        label: 'Title Deed Available',
        type: 'enum',
        options: ['Yes', 'No', 'In Process'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'tenure',
        label: 'Tenure',
        type: 'enum',
        options: ['Freehold', 'Leasehold'],
        dependsOn: { field: 'propertyCategory', value: ['Land', 'Residential Property', 'Commercial Property'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'fenced',
        label: 'Fenced',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'cornerPlot',
        label: 'Corner Plot',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'roadAccess',
        label: 'Road Access',
        type: 'enum',
        options: ['Tarmac Road', 'Murram Road', 'No Road'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'landUtilities',
        label: 'Available Utilities',
        type: 'enum',
        options: ['Electricity', 'Water', 'Sewer', 'Borehole'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'multicheck' },
        search: { filterable: false, uiType: 'multicheck' }
      },
      {
        id: 'soilType',
        label: 'Soil Type',
        type: 'enum',
        options: ['Black Cotton', 'Red Soil', 'Loam', 'Sandy', 'Rocky', 'Other'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'topography',
        label: 'Topography',
        type: 'enum',
        options: ['Flat', 'Gentle Slope', 'Steep', 'Undulating'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'surveyed',
        label: 'Surveyed',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'beaconed',
        label: 'Beaconed',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'readyForDevelopment',
        label: 'Ready for Development',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Land'] },
        postAd: { required: false, group: 'land', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },

      // ─── Commercial ───────────────────────────────────────────────────
      {
        id: 'officeSize',
        label: 'Office Size (sq ft)',
        type: 'number',
        dependsOn: { field: 'propertyType', value: ['Offices', 'Co-working Spaces', 'Business Premises'] },
        postAd: { required: false, group: 'commercial', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'parkingCapacity',
        label: 'Parking Capacity (vehicles)',
        type: 'number',
        dependsOn: { field: 'propertyCategory', value: ['Commercial Property'] },
        postAd: { required: false, group: 'commercial', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'meetingRooms',
        label: 'Meeting Rooms',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyType', value: ['Offices', 'Co-working Spaces', 'Serviced Offices'] },
        postAd: { required: false, group: 'commercial', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'reception',
        label: 'Reception Area',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyType', value: ['Offices', 'Serviced Offices'] },
        postAd: { required: false, group: 'commercial', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'lift',
        label: 'Lift / Elevator',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Commercial Property'] },
        postAd: { required: false, group: 'commercial', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'loadingBay',
        label: 'Loading Bay',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyType', value: ['Warehouses', 'Factories', 'Industrial Buildings'] },
        postAd: { required: false, group: 'commercial', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'warehouseHeight',
        label: 'Warehouse Height (m)',
        type: 'number',
        dependsOn: { field: 'propertyType', value: ['Warehouses'] },
        postAd: { required: false, group: 'commercial', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'dockAccess',
        label: 'Dock Access',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyType', value: ['Warehouses', 'Factories', 'Industrial Buildings'] },
        postAd: { required: false, group: 'commercial', uiType: 'radio' },
        search: { filterable: false, uiType: 'radio' }
      },
      {
        id: 'powerSupply',
        label: 'Power Supply',
        type: 'enum',
        options: ['Single Phase', 'Three Phase', 'Generator', 'Solar'],
        dependsOn: { field: 'propertyCategory', value: ['Commercial Property'] },
        postAd: { required: false, group: 'commercial', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'fibreInternet',
        label: 'Fibre Internet',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'propertyCategory', value: ['Commercial Property'] },
        postAd: { required: false, group: 'commercial', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },

      // ─── Amenities ────────────────────────────────────────────────────
      {
        id: 'amenities',
        label: 'Amenities',
        type: 'enum',
        options: [
          'Swimming Pool', 'Gym', 'Lift / Elevator', 'Balcony', 'Garden', 'Rooftop',
          "Children's Playground", 'CCTV', 'Security Guards', 'Electric Fence',
          'Backup Generator', 'Borehole', 'Water Tank', 'Solar Power', 'Solar Water Heating',
          'Fibre Internet', 'Parking', 'Visitor Parking', 'Garage', 'Laundry Area',
          'DSQ (Servants Quarters)', 'Walk-in Closet', 'Air Conditioning', 'Fireplace',
          'Smart Home', 'Wheelchair Access', 'Gated Community', 'Clubhouse',
          'Tennis Court', 'Basketball Court', 'Golf Course',
          'Lake View', 'Ocean View', 'Mountain View', 'City View'
        ],
        postAd: { required: false, group: 'amenities', uiType: 'multicheck' },
        search: { filterable: true, uiType: 'multicheck' }
      },

      // ─── Nearby Facilities ────────────────────────────────────────────
      {
        id: 'nearbyFacilities',
        label: 'Nearby Facilities',
        type: 'enum',
        options: [
          'School', 'Hospital', 'Mall', 'Market', 'Police Station',
          'Church', 'Mosque', 'Bus Stop', 'Airport', 'Railway Station',
          'University', 'Petrol Station'
        ],
        postAd: { required: false, group: 'nearby', uiType: 'multicheck' },
        search: { filterable: false, uiType: 'multicheck' }
      },

      // ─── Seller Information ───────────────────────────────────────────
      {
        id: 'sellerType',
        label: 'Seller / Agent Type',
        type: 'enum',
        options: ['Owner', 'Agent', 'Developer', 'Property Management Company', 'Bank', 'Auctioneer', 'Government'],
        postAd: { required: false, group: 'seller', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'openHouse',
        label: 'Open House Available',
        type: 'enum',
        options: ['Yes', 'No'],
        postAd: { required: false, group: 'seller', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      }
    ]
  },

  'phones-tablets': {
    groups: [
      { id: 'basics', title: 'Device Info' },
      { id: 'specs', title: 'Technical Specifications' }
    ],
    attributes: [
      { 
        id: 'subcategory',
        label: 'Device Type',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'brand',
        label: 'Brand',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'subcategory', 
        dependsOn: { field: 'subcategory' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'model',
        label: 'Model',
        type: 'dynamic-cascade',
        cascadeLevel: 3,
        cascadeParent: 'brand',
        dependsOn: { field: 'brand' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'storage', 
        label: 'Internal Storage', 
        type: 'enum', 
        options: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      { 
        id: 'ram', 
        label: 'RAM', 
        type: 'enum', 
        options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB+'],
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      { 
        id: 'network', 
        label: 'Network', 
        type: 'enum', 
        options: ['3G', '4G LTE', '5G'],
        postAd: { required: false, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      { 
        id: 'os', 
        label: 'Operating System', 
        type: 'enum', 
        options: ['Android', 'iOS', 'Windows', 'Other'],
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'color', 
        label: 'Color', 
        type: 'enum', 
        options: ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Other'],
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      }
    ]
  },
  electronics: {
        groups: [
      { id: 'basics', title: 'Basic Information' },
      { id: 'cpu', title: 'Processor (CPU)' },
      { id: 'ram', title: 'Memory (RAM)' },
      { id: 'storage', title: 'Storage' },
      { id: 'gpu', title: 'Graphics (GPU)' },
      { id: 'display', title: 'Display' },
      { id: 'camera', title: 'Camera' },
      { id: 'battery', title: 'Battery & Charging' },
      { id: 'form_factor', title: 'Form Factor' },
      { id: 'build_design', title: 'Build & Design' },
      { id: 'input', title: 'Input Devices' },
      { id: 'audio', title: 'Audio' },
      { id: 'os', title: 'Operating System' },
      { id: 'connectivity', title: 'Connectivity' },
      { id: 'ports', title: 'Ports' },
      { id: 'security', title: 'Security' },
      { id: 'business', title: 'Business Features' },
      { id: 'gaming', title: 'Gaming Features' },
      { id: 'cooling', title: 'Cooling' },
      { id: 'condition_details', title: 'Condition Details' },
      { id: 'included', title: 'Included Accessories' },
      { id: 'commercial', title: 'Commercial Details' },
      { id: 'seller', title: 'Seller Details' },
      { id: 'specs', title: 'Specifications' }
    ],
    attributes: [
      { 
        id: 'subcategory',
        label: 'Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      // Laptops - Complete Master List

      // 1. BASIC CLASSIFICATION
      { id: 'brand', label: 'Brand', type: 'dynamic-cascade', cascadeLevel: 1, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'basics', uiType: 'select' }, search: { filterable: true, uiType: 'dynamic-cascade' } },
      { id: 'series', label: 'Series', type: 'dynamic-cascade', cascadeLevel: 2, cascadeParent: 'brand', dependsOn: { field: 'brand' }, postAd: { required: false, group: 'basics', uiType: 'select' }, search: { filterable: true, uiType: 'dynamic-cascade' } },
      { id: 'model', label: 'Model', type: 'dynamic-cascade', cascadeLevel: 3, cascadeParent: 'series', dependsOn: { field: 'series' }, postAd: { required: true, group: 'basics', uiType: 'select' }, search: { filterable: true, uiType: 'dynamic-cascade' } },
      { id: 'deviceType', label: 'Device Type', type: 'enum', options: LaptopEnums.DEVICE_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'basics', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'releaseYear', label: 'Release Year', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'basics', uiType: 'text' }, search: { filterable: true, uiType: 'text' } },

      // 2. PROCESSOR (CPU)
      { id: 'cpuBrand', label: 'Processor Brand', type: 'enum', options: LaptopEnums.CPU_BRANDS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'cpu', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'cpuFamily', label: 'Processor Family', type: 'enum', options: LaptopEnums.CPU_FAMILIES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'cpu', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'cpuGen', label: 'Processor Generation', type: 'enum', options: LaptopEnums.CPU_GENERATIONS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'cpuModel', label: 'Processor Model', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'cpuSpeed', label: 'Processor Speed (GHz)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'coreCount', label: 'Core Count', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'threadCount', label: 'Thread Count', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'turboBoostSpeed', label: 'Turbo Boost Speed', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'cpuArchitecture', label: 'CPU Architecture', type: 'enum', options: LaptopEnums.CPU_ARCHITECTURES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cpu', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },

      // 3. MEMORY (RAM)
      { id: 'ram', label: 'RAM Size', type: 'enum', options: LaptopEnums.RAM_MAX_SUPPORTED, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'ram', uiType: 'select' }, search: { filterable: true, uiType: 'multicheck' } },
      { id: 'ramType', label: 'RAM Type', type: 'enum', options: LaptopEnums.RAM_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'ram', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'ramSpeed', label: 'RAM Speed', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'ram', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'ramSlots', label: 'RAM Slots', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'ram', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'maxSupportedRam', label: 'Maximum Supported RAM', type: 'enum', options: LaptopEnums.RAM_MAX_SUPPORTED, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'ram', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'ramUpgradeable', label: 'RAM Upgradeable', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'ram', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 4. STORAGE
      { id: 'storageType', label: 'Storage Type', type: 'enum', options: LaptopEnums.STORAGE_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'storage', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'storageSize', label: 'Storage Capacity', type: 'enum', options: ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB+'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'storage', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'secondaryStorage', label: 'Secondary Storage', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'storage', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'storageSlots', label: 'Storage Slots', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'storage', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'numberOfDrives', label: 'Number of Drives', type: 'enum', options: LaptopEnums.NUMBER_OF_DRIVES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'storage', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'expandableStorage', label: 'Expandable Storage', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'storage', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'raidSupport', label: 'RAID Support', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'storage', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 5. GRAPHICS (GPU)
      { id: 'gpuType', label: 'GPU Type', type: 'enum', options: LaptopEnums.GPU_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'gpu', uiType: 'radio' }, search: { filterable: true, uiType: 'select' } },
      { id: 'gpuBrand', label: 'GPU Brand', type: 'enum', options: LaptopEnums.GPU_BRANDS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'gpu', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'gpuSeries', label: 'GPU Series', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gpu', uiType: 'text' }, search: { filterable: true, uiType: 'text' } },
      { id: 'gpu', label: 'GPU Model', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gpu', uiType: 'text' }, search: { filterable: true, uiType: 'text' } },
      { id: 'gpuMemory', label: 'GPU Memory', type: 'enum', options: LaptopEnums.GPU_MEMORY, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'gpu', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'graphicsGeneration', label: 'Graphics Generation', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'muxSwitch', label: 'MUX Switch', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gpu', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'gpuPower', label: 'GPU Power (W)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gpu', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },

      // 6. DISPLAY
      { id: 'screenSize', label: 'Screen Size', type: 'enum', options: ['11"', '12"', '13"', '13.3"', '14"', '15"', '15.6"', '16"', '17"', '18"'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'display', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'resolution', label: 'Resolution', type: 'enum', options: ['HD (1366x768)', 'FHD (1920x1080)', 'WUXGA (1920x1200)', 'QHD (2560x1440)', 'QHD+ (2560x1600)', '3K', '4K UHD (3840x2160)'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'display', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'refreshRate', label: 'Refresh Rate', type: 'enum', options: LaptopEnums.SCREEN_RATES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'display', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'panelType', label: 'Panel Type', type: 'enum', options: LaptopEnums.PANEL_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'display', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'screenFinish', label: 'Screen Finish', type: 'enum', options: LaptopEnums.SCREEN_FINISHES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'display', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'brightness', label: 'Brightness (nits)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'display', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'aspectRatio', label: 'Aspect Ratio', type: 'enum', options: LaptopEnums.ASPECT_RATIOS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'display', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'colorAccuracy', label: 'Color Accuracy', type: 'enum', options: LaptopEnums.COLOR_ACCURACY, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'display', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'touchscreen', label: 'Touchscreen', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'display', uiType: 'radio' }, search: { filterable: true, uiType: 'radio' } },
      { id: 'screenToBodyRatio', label: 'Screen-to-Body Ratio', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'display', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },

      // 7. CAMERA
      { id: 'webcamResolution', label: 'Webcam Resolution', type: 'enum', options: LaptopEnums.WEBCAM_RESOLUTIONS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'camera', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'privacyShutter', label: 'Privacy Shutter', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'camera', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 8. BATTERY & CHARGING
      { id: 'batteryHealth', label: 'Battery Health', type: 'enum', options: LaptopEnums.BATTERY_HEALTH, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'battery', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'batteryCondition', label: 'Battery Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'batteryLife', label: 'Battery Life (Hours)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'text' }, search: { filterable: false, uiType: 'text' }, },
      { id: 'batteryCapacity', label: 'Battery Capacity (Wh)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'chargingType', label: 'Charging Type', type: 'enum', options: LaptopEnums.CHARGING_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'fastCharging', label: 'Fast Charging', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'chargerWattage', label: 'Charger Wattage (W)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'text' }, search: { filterable: false, uiType: 'text' }, },
      { id: 'originalCharger', label: 'Original Charger Included', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'battery', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 9. FORM FACTOR
      { id: 'formFactor', label: 'Laptop Form Factor', type: 'enum', options: LaptopEnums.FORM_FACTORS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'form_factor', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'openingAngle', label: 'Opening Angle', type: 'enum', options: LaptopEnums.OPENING_ANGLES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'form_factor', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'foldType', label: 'Fold Type', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'form_factor', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },

      // 10. BUILD & DESIGN
      { id: 'color', label: 'Color', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'build_design', uiType: 'text' }, search: { filterable: true, uiType: 'text' } },
      { id: 'material', label: 'Material', type: 'enum', options: LaptopEnums.MATERIALS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'weight', label: 'Weight (kg)', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'bodyCondition', label: 'Body Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'scratchLevel', label: 'Scratch Level', type: 'enum', options: LaptopEnums.SCRATCH_LEVELS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'screenCondition', label: 'Screen Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'keyboardCondition', label: 'Keyboard Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'hingeCondition', label: 'Hinge Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'build_design', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },

      // 11. INPUT DEVICES
      { id: 'keyboardType', label: 'Keyboard Type', type: 'enum', options: LaptopEnums.KEYBOARD_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'keyboardLayout', label: 'Keyboard Layout', type: 'enum', options: LaptopEnums.KEYBOARD_LAYOUTS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'keyboardBacklight', label: 'Keyboard Backlight', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'numericKeypad', label: 'Numeric Keypad', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'trackpadType', label: 'Trackpad Type', type: 'enum', options: LaptopEnums.TRACKPAD_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'stylusSupport', label: 'Stylus Support', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'stylusIncluded', label: 'Stylus Included', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'input', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 12. AUDIO
      { id: 'speakerCount', label: 'Speaker Count', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'audio', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'audioCertification', label: 'Audio Certification', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'audio', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'builtInMicrophone', label: 'Built-in Microphone', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'audio', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 13. OPERATING SYSTEM
      { id: 'os', label: 'Operating System', type: 'enum', options: ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'ChromeOS', 'DOS / No OS'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'os', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'osVersion', label: 'OS Version', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'os', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'licenseIncluded', label: 'License Included', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'os', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 14. CONNECTIVITY
      { id: 'wifi', label: 'Wi-Fi', type: 'enum', options: LaptopEnums.WI_FI_STANDARDS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'connectivity', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'bluetooth', label: 'Bluetooth', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'connectivity', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'lte', label: 'LTE Support', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'connectivity', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: '5g', label: '5G Support', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'connectivity', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'ethernet', label: 'Ethernet', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'connectivity', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 15. PORTS (MULTI-SELECT)
      { id: 'ports', label: 'Ports', type: 'multicheck', options: LaptopEnums.LAPTOP_PORTS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'ports', uiType: 'multicheck' }, search: { filterable: true, uiType: 'multicheck' } },

      // 16. SECURITY
      { id: 'fingerprintReader', label: 'Fingerprint Reader', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'security', uiType: 'radio' }, search: { filterable: true, uiType: 'radio' } },
      { id: 'faceUnlock', label: 'Face Unlock', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'security', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'tpm', label: 'TPM', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'security', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'smartCardReader', label: 'Smart Card Reader', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'security', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'kensingtonLock', label: 'Kensington Lock', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'security', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 17. BUSINESS FEATURES
      { id: 'dockingSupport', label: 'Docking Support', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'business', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'vPro', label: 'vPro', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'business', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      { id: 'enterpriseGrade', label: 'Enterprise Grade', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'business', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 18. GAMING FEATURES
      { id: 'rgbKeyboard', label: 'RGB Keyboard', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gaming', uiType: 'radio' }, search: { filterable: true, uiType: 'radio' } },
      { id: 'rgbZones', label: 'RGB Zones', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gaming', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'vrReady', label: 'VR Ready', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'gaming', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 19. COOLING
      { id: 'coolingType', label: 'Cooling Type', type: 'enum', options: LaptopEnums.COOLING_TYPES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cooling', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'coolingCondition', label: 'Cooling Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'cooling', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },

      // 20. CONDITION
      { id: 'condition', label: 'Condition', type: 'enum', options: LaptopEnums.CONDITIONS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: true, group: 'condition_details', uiType: 'select' }, search: { filterable: true, uiType: 'select' } },
      { id: 'physicalCondition', label: 'Physical Condition', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'condition_details', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'usageHistory', label: 'Usage History', type: 'enum', options: LaptopEnums.USAGE_HISTORY, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'condition_details', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'ownership', label: 'Ownership', type: 'enum', options: LaptopEnums.OWNERSHIPS, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'condition_details', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },

      // 21. INCLUDED ACCESSORIES
      { id: 'includedAccessories', label: 'Included Accessories', type: 'multicheck', options: LaptopEnums.INCLUDED_ACCESSORIES, dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'included', uiType: 'multicheck' }, search: { filterable: true, uiType: 'multicheck' } },

      // 22. COMMERCIAL DETAILS
      { id: 'warranty', label: 'Warranty', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'commercial', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'availability', label: 'Availability', type: 'enum', options: ['In Stock', 'Pre-order', 'Out of Stock'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'commercial', uiType: 'select' }, search: { filterable: false, uiType: 'select' } },
      { id: 'negotiable', label: 'Negotiable', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'commercial', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },

      // 23. SELLER DETAILS
      { id: 'reasonForSelling', label: 'Reason For Selling', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'seller', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'purchaseDate', label: 'Purchase Date', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'seller', uiType: 'text' }, search: { filterable: false, uiType: 'text' } },
      { id: 'receiptAvailable', label: 'Receipt Available', type: 'enum', options: ['Yes', 'No'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' }, postAd: { required: false, group: 'seller', uiType: 'radio' }, search: { filterable: false, uiType: 'radio' } },
      // TVs
      { 
        id: 'tvBrand', 
        label: 'Brand', 
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'subcategory',
        dependsOn: { field: 'subcategory', value: 'Televisions' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'tvSeries', 
        label: 'Series / Line', 
        type: 'dynamic-cascade',
        cascadeLevel: 3,
        cascadeParent: 'tvBrand',
        dependsOn: { field: 'tvBrand' },
        postAd: { required: false, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'screenSizeTv', 
        label: 'Screen Size', 
        type: 'enum', 
        options: ['32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"+'], 
        dependsOn: { field: 'subcategory', value: 'Televisions' },
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'displayTech', 
        label: 'Display Technology', 
        type: 'enum', 
        options: ['LED', 'OLED', 'QLED', 'NanoCell', 'Plasma'], 
        dependsOn: { field: 'subcategory', value: 'Televisions' },
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'resolution', 
        label: 'Resolution', 
        type: 'enum', 
        options: ['HD', 'Full HD', '4K UHD', '8K'], 
        dependsOn: { field: 'subcategory', value: 'Televisions' },
        postAd: { required: true, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'smartPlatform', 
        label: 'Smart Platform', 
        type: 'enum', 
        options: ['Android TV', 'Google TV', 'WebOS', 'Tizen', 'VIDAA', 'Roku', 'Non Smart'], 
        dependsOn: { field: 'subcategory', value: 'Televisions' },
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      // Audio
      { 
        id: 'equipmentType',
        label: 'Equipment Type',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'subcategory', 
        dependsOn: { field: 'subcategory', value: 'Audio & Music' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'audioBrand', 
        label: 'Brand', 
        type: 'dynamic-cascade',
        cascadeLevel: 3,
        cascadeParent: 'equipmentType',
        dependsOn: { field: 'equipmentType' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'channels', 
        label: 'Channels', 
        type: 'enum', 
        options: ['2.0', '2.1', '3.1', '5.0', '5.1', '7.1', '9.1', '11.1'], 
        dependsOn: { field: 'subcategory', value: 'Audio & Music' },
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'connectivity', 
        label: 'Connectivity', 
        type: 'enum', 
        options: ['Bluetooth', 'Wi-Fi', 'HDMI', 'HDMI ARC', 'HDMI eARC', 'USB', 'Optical', 'AUX'], 
        dependsOn: { field: 'subcategory', value: 'Audio & Music' },
        postAd: { required: false, group: 'specs', uiType: 'multicheck' },
        search: { filterable: true, uiType: 'multicheck' }
      }
    ]
  },
  jobs: {
    groups: [
      { id: 'basics', title: 'Job Details' },
      { id: 'requirements', title: 'Requirements' },
      { id: 'salary', title: 'Compensation' }
    ],
    attributes: [
      { 
        id: 'subcategory', 
        label: 'Job Category', 
        type: 'dynamic-cascade', 
        cascadeLevel: 1,
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'employmentType', 
        label: 'Employment Type', 
        type: 'enum', 
        options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Remote'],
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      { 
        id: 'workArrangement', 
        label: 'Work Arrangement', 
        type: 'enum', 
        options: ['On-site', 'Remote', 'Hybrid'],
        postAd: { required: true, group: 'basics', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'experienceLevel', 
        label: 'Experience Level', 
        type: 'enum', 
        options: ['Entry Level', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'],
        postAd: { required: true, group: 'requirements', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'educationLevel', 
        label: 'Education Level', 
        type: 'enum', 
        options: ['KCSE / O-Level', 'Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'],
        postAd: { required: true, group: 'requirements', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'industry', 
        label: 'Industry', 
        type: 'enum', 
        options: ['IT & Technology', 'Finance & Banking', 'Healthcare', 'Education', 'NGO', 'Hospitality', 'Transport & Logistics', 'Agriculture', 'Construction', 'Media & Marketing', 'Sales', 'Admin & HR', 'Legal', 'Government', 'Other'],
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      { 
        id: 'salaryMin', 
        label: 'Min Salary', 
        type: 'number',
        postAd: { required: false, group: 'salary', uiType: 'number' },
        search: { filterable: true, uiType: 'range' }
      },
      { 
        id: 'salaryMax', 
        label: 'Max Salary', 
        type: 'number',
        postAd: { required: false, group: 'salary', uiType: 'number' },
        search: { filterable: true, uiType: 'range' }
      }
    ]
  },
  'seeking-work': {
    groups: [
      { id: 'basics', title: 'Professional Profile' },
      { id: 'qualifications', title: 'Qualifications & Experience' }
    ],
    attributes: [
      { 
        id: 'subcategory', 
        label: 'Profession / Field', 
        type: 'dynamic-cascade', 
        cascadeLevel: 1,
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      { 
        id: 'employmentType', 
        label: 'Employment Type Sought', 
        type: 'enum', 
        options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Remote'],
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      { 
        id: 'workArrangement', 
        label: 'Preferred Work Arrangement', 
        type: 'enum', 
        options: ['On-site', 'Remote', 'Hybrid'],
        postAd: { required: true, group: 'basics', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'experienceLevel', 
        label: 'Experience Level', 
        type: 'enum', 
        options: ['Entry Level', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'],
        postAd: { required: true, group: 'qualifications', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'educationLevel', 
        label: 'Highest Education Level', 
        type: 'enum', 
        options: ['KCSE / O-Level', 'Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'],
        postAd: { required: true, group: 'qualifications', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'industry',
        label: 'Industry',
        type: 'enum',
        options: [
          'IT & Technology', 'Finance & Banking', 'Healthcare & Medical',
          'Education & Teaching', 'NGO & Development', 'Hospitality & Tourism',
          'Transport & Logistics', 'Agriculture & Farming', 'Construction & Engineering',
          'Media & Marketing', 'Sales & Business Development', 'Admin & HR',
          'Legal & Compliance', 'Government & Public Sector', 'Manufacturing',
          'Security & Safety', 'Retail & Wholesale', 'Domestic & Household', 'Other'
        ],
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'availability',
        label: 'Availability',
        type: 'enum',
        options: ['Immediately', '2 Weeks Notice', '1 Month Notice', 'Negotiable'],
        postAd: { required: true, group: 'basics', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'employmentStatus',
        label: 'Current Employment Status',
        type: 'enum',
        options: ['Employed', 'Unemployed', 'Self-employed', 'Student'],
        postAd: { required: true, group: 'basics', uiType: 'radio' },
        search: { filterable: false }
      },
      {
        id: 'skills',
        label: 'Key Skills',
        type: 'text',
        postAd: { required: false, group: 'qualifications', uiType: 'tags' },
        search: { filterable: true, uiType: 'text' }
      },
      {
        id: 'languages',
        label: 'Languages',
        type: 'enum',
        options: ['English', 'Swahili', 'French', 'Arabic', 'Somali', 'Kikuyu', 'Luo', 'Kamba', 'Luhya', 'Kalenjin', 'Other'],
        postAd: { required: false, group: 'qualifications', uiType: 'select' },
        search: { filterable: true, uiType: 'multicheck' }
      },
      {
        id: 'salaryMin',
        label: 'Expected Min Salary (KES)',
        type: 'number',
        postAd: { required: false, group: 'qualifications', uiType: 'number' },
        search: { filterable: true, uiType: 'range' }
      },
      {
        id: 'salaryMax',
        label: 'Expected Max Salary (KES)',
        type: 'number',
        postAd: { required: false, group: 'qualifications', uiType: 'number' },
        search: { filterable: true, uiType: 'range' }
      },
      {
        id: 'salaryPeriod',
        label: 'Salary Period',
        type: 'enum',
        options: ['Monthly', 'Annual'],
        postAd: { required: false, group: 'qualifications', uiType: 'radio' },
        search: { filterable: false }
      }
    ]
  },
  fashion: {
    groups: [
      { id: 'item', title: 'Item Details' },
      { id: 'specs', title: 'Specifications' },
    ],
    attributes: [
      {
        id: 'category',
        label: 'Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'item', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'subcategory',
        label: 'Item',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        dependsOn: { field: 'category' },
        postAd: { required: true, group: 'item', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'gender',
        label: 'Gender',
        type: 'enum',
        options: ['Men', 'Women', 'Unisex', 'Kids'],
        postAd: { required: true, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'size',
        label: 'Size',
        type: 'enum',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'text',
        postAd: { required: false, group: 'specs', uiType: 'text' },
        search: { filterable: true, uiType: 'text' }
      },
      {
        id: 'color',
        label: 'Color',
        type: 'enum',
        options: ['Black', 'White', 'Grey', 'Brown', 'Beige', 'Navy', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Multi-color'],
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
    ]
  },

  'home-living': {
    groups: [
      { id: 'item', title: 'Item Classification' },
      { id: 'specs', title: 'Key Specifications' },
      { id: 'dimensions', title: 'Dimensions & Sizing' },
      { id: 'technical', title: 'Technical Details' },
      { id: 'features', title: 'Features & Extras' }
    ],
    attributes: [
      {
        id: 'subcategory',
        label: 'Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'item', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'model',
        label: 'Item Type',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        cascadeParent: 'subcategory',
        dependsOn: { field: 'subcategory' },
        postAd: { required: true, group: 'item', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'condition',
        label: 'Condition',
        type: 'enum',
        options: ['Brand New', 'Refurbished', 'Used'],
        postAd: { required: true, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'text',
        postAd: { required: false, group: 'specs', uiType: 'text' },
        search: { filterable: true, uiType: 'text' }
      },
      {
        id: 'material',
        label: 'Material',
        type: 'enum',
        options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric / Upholstered', 'Leather', 'Rattan / Wicker', 'Ceramic', 'Stone', 'Other'],
        dependsOn: { field: 'subcategory', value: ['Furniture', 'Beds & Mattresses', 'Home Décor', 'Garden & Outdoor'] },
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'color',
        label: 'Colour',
        type: 'enum',
        options: ['Black', 'White', 'Grey', 'Brown', 'Beige', 'Cream', 'Blue', 'Green', 'Red', 'Multi-color', 'Other'],
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'width',
        label: 'Width (cm)',
        type: 'number',
        dependsOn: { field: 'subcategory', value: ['Furniture', 'Home Appliances', 'Storage & Organization'] },
        postAd: { required: false, group: 'dimensions', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        dependsOn: { field: 'subcategory', value: ['Furniture', 'Home Appliances', 'Storage & Organization'] },
        postAd: { required: false, group: 'dimensions', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'length',
        label: 'Length / Depth (cm)',
        type: 'number',
        dependsOn: { field: 'subcategory', value: ['Furniture', 'Home Appliances', 'Storage & Organization'] },
        postAd: { required: false, group: 'dimensions', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'assemblyRequired',
        label: 'Assembly Required',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'subcategory', value: ['Furniture', 'Beds & Mattresses', 'Storage & Organization'] },
        postAd: { required: false, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'mattressSize',
        label: 'Mattress Size',
        type: 'enum',
        options: ['Single', 'Double', 'Queen', 'King', 'Super King', 'Cot Size', 'Custom'],
        dependsOn: { field: 'subcategory', value: ['Beds & Mattresses'] },
        postAd: { required: false, group: 'dimensions', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'bedSize',
        label: 'Bed Size',
        type: 'enum',
        options: ['Single', 'Double', 'Queen', 'King', 'Super King', 'Bunk', 'Custom'],
        dependsOn: { field: 'subcategory', value: ['Beds & Mattresses'] },
        postAd: { required: false, group: 'dimensions', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'storageIncluded',
        label: 'Storage Included',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'subcategory', value: ['Beds & Mattresses'] },
        postAd: { required: false, group: 'features', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'mattressIncluded',
        label: 'Mattress Included',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'subcategory', value: ['Beds & Mattresses'] },
        postAd: { required: false, group: 'features', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'capacity',
        label: 'Capacity (Liters / kg)',
        type: 'text',
        dependsOn: { field: 'subcategory', value: ['Home Appliances', 'Kitchen & Dining'] },
        postAd: { required: false, group: 'technical', uiType: 'text' },
        search: { filterable: false, uiType: 'text' }
      },
      {
        id: 'powerRating',
        label: 'Power Rating (Watts)',
        type: 'number',
        dependsOn: { field: 'subcategory', value: ['Home Appliances', 'Lighting'] },
        postAd: { required: false, group: 'technical', uiType: 'number' },
        search: { filterable: false, uiType: 'range' }
      },
      {
        id: 'energyRating',
        label: 'Energy Rating',
        type: 'enum',
        options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
        dependsOn: { field: 'subcategory', value: ['Home Appliances'] },
        postAd: { required: false, group: 'technical', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'voltage',
        label: 'Voltage',
        type: 'enum',
        options: ['220-240V', '110V', 'Dual Voltage', '12V', '24V', 'Other'],
        dependsOn: { field: 'subcategory', value: ['Home Appliances', 'Lighting', 'Security & Safety', 'Smart Home'] },
        postAd: { required: false, group: 'technical', uiType: 'select' },
        search: { filterable: false, uiType: 'select' }
      },
      {
        id: 'warranty',
        label: 'Warranty',
        type: 'enum',
        options: ['No Warranty', '1 Month', '3 Months', '6 Months', '1 Year', '2 Years', '3+ Years'],
        postAd: { required: false, group: 'features', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'wattage',
        label: 'Wattage (W)',
        type: 'number',
        dependsOn: { field: 'subcategory', value: ['Lighting'] },
        postAd: { required: false, group: 'technical', uiType: 'number' },
        search: { filterable: false, uiType: 'number' }
      },
      {
        id: 'bulbType',
        label: 'Bulb Type',
        type: 'enum',
        options: ['LED', 'Incandescent', 'Halogen', 'Fluorescent', 'CFL', 'Smart Bulb', 'Other'],
        dependsOn: { field: 'subcategory', value: ['Lighting'] },
        postAd: { required: false, group: 'technical', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'indoorOutdoor',
        label: 'Indoor / Outdoor',
        type: 'enum',
        options: ['Indoor', 'Outdoor', 'Both'],
        dependsOn: { field: 'subcategory', value: ['Lighting', 'Home Décor'] },
        postAd: { required: false, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'smartCompatible',
        label: 'Smart Compatible',
        type: 'enum',
        options: ['Yes', 'No'],
        dependsOn: { field: 'subcategory', value: ['Lighting', 'Home Appliances', 'Security & Safety', 'Smart Home'] },
        postAd: { required: false, group: 'features', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'manualElectric',
        label: 'Operation Mode',
        type: 'enum',
        options: ['Manual', 'Electric', 'Battery Powered', 'Solar Powered', 'Petrol/Diesel'],
        dependsOn: { field: 'subcategory', value: ['Garden & Outdoor', 'Cleaning Supplies', 'Home Improvement'] },
        postAd: { required: false, group: 'technical', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
    ]
  },

  services: {
    groups: [
      { id: 'basics', title: 'Service Details' },
    ],
    attributes: [
      {
        id: 'category',
        label: 'Service Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'subcategory',
        label: 'Service Type',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        dependsOn: { field: 'category' },
        postAd: { required: true, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'serviceMode',
        label: 'Service Mode',
        type: 'enum',
        options: ['On-site', 'Remote / Online', 'Both'],
        postAd: { required: false, group: 'basics', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      {
        id: 'experience',
        label: 'Years of Experience',
        type: 'enum',
        options: ['Less than 1 Year', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'],
        postAd: { required: false, group: 'basics', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
    ]
  },

  beauty: {
    groups: [
      { id: 'item', title: 'Product Details' },
      { id: 'specs', title: 'Specifications' },
    ],
    attributes: [
      {
        id: 'category',
        label: 'Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1,
        postAd: { required: true, group: 'item', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'subcategory',
        label: 'Item',
        type: 'dynamic-cascade',
        cascadeLevel: 2,
        dependsOn: { field: 'category' },
        postAd: { required: true, group: 'item', uiType: 'select' },
        search: { filterable: true, uiType: 'dynamic-cascade' }
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'text',
        postAd: { required: false, group: 'specs', uiType: 'text' },
        search: { filterable: true, uiType: 'text' }
      },
      {
        id: 'targetGender',
        label: 'For',
        type: 'enum',
        options: ['Women', 'Men', 'Unisex'],
        postAd: { required: false, group: 'specs', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
    ]
  },

  default: {
    groups: [],
    attributes: []
  }
};
