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
      { id: 'features', title: 'Features & Amenities' }
    ],
    attributes: [
      { 
        id: 'listingCategory', 
        label: 'Listing Category', 
        type: 'enum', 
        options: ['For Sale', 'For Rent', 'For Lease'],
        postAd: { required: true, group: 'classification', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'propertyCategory',
        label: 'Property Category',
        type: 'dynamic-cascade',
        cascadeLevel: 1, 
        dependsOn: { field: 'listingCategory' },
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
        id: 'bedrooms', 
        label: 'Bedrooms', 
        type: 'enum', 
        options: ['1', '2', '3', '4', '5+'],
        postAd: { required: false, group: 'features', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'bathrooms', 
        label: 'Bathrooms', 
        type: 'enum', 
        options: ['1', '2', '3+'],
        postAd: { required: false, group: 'features', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'furnished', 
        label: 'Furnished', 
        type: 'enum', 
        options: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        postAd: { required: false, group: 'features', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'floors', 
        label: 'Floor', 
        type: 'enum', 
        options: ['Ground', '1', '2', '3', '4', '5+'],
        postAd: { required: false, group: 'features', uiType: 'select' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'parking', 
        label: 'Parking Available', 
        type: 'enum', 
        options: ['Yes', 'No'],
        postAd: { required: false, group: 'features', uiType: 'radio' },
        search: { filterable: true, uiType: 'radio' }
      },
      { 
        id: 'amenities', 
        label: 'Amenities', 
        type: 'enum', 
        options: ['Swimming Pool', 'Gym', 'Backup Generator', 'Borehole', 'Elevator', 'Balcony', 'Garden', 'Security Guard', 'CCTV', 'Internet / Wi-Fi', 'Pet Friendly'],
        postAd: { required: false, group: 'features', uiType: 'multicheck' },
        search: { filterable: true, uiType: 'multicheck' }
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

  'home-furniture': {
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
        options: ['Black', 'White', 'Grey', 'Brown', 'Beige', 'Cream', 'Blue', 'Green', 'Red', 'Multi-color', 'Other'],
        postAd: { required: false, group: 'specs', uiType: 'select' },
        search: { filterable: true, uiType: 'select' }
      },
      {
        id: 'material',
        label: 'Material',
        type: 'enum',
        options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric / Upholstered', 'Leather', 'Rattan / Wicker', 'Other'],
        postAd: { required: false, group: 'specs', uiType: 'select' },
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
