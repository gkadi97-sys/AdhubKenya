// src/lib/schemaRegistry.js
import { MANUFACTURE_YEARS } from './categoryData';

// This file is the Single Source of Truth for the Auto-Generated Discovery Architecture.
// It maps every category to its complete structured attribute schema.
// These definitions drive Ad Creation, Detail Pages, Browse Filters, and API Search.

export const SCHEMA_REGISTRY = {
  vehicles: {
    attributes: [
      { id: 'make', label: 'Make', type: 'dynamic-select' },
      { id: 'model', label: 'Model', type: 'dynamic-select', dependsOn: { field: 'make' } },
      { id: 'year', label: 'Year of Manufacture', type: 'dynamic-select', dependsOn: { field: 'model' } },
      { id: 'mileage', label: 'Mileage (km)', type: 'number', filterType: 'max' },
      { id: 'transmission', label: 'Transmission', type: 'radio', options: ['Automatic', 'Manual', 'CVT', 'DCT', 'Semi-Auto'] },
      { id: 'fuelType', label: 'Fuel Type', type: 'multicheck', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'] },
      { id: 'bodyType', label: 'Body Style', type: 'select', options: ['Sedan', 'Hatchback', 'Station Wagon', 'SUV / Crossover', 'Coupe', 'Convertible', 'Pickup / Double Cabin', 'Van / Minivan'] },
      { id: 'driveType', label: 'Drive Type', type: 'radio', options: ['FWD', 'RWD', 'AWD', '4WD'] },
      { id: 'engineSize', label: 'Engine Size (CC)', type: 'number', filterType: 'max' },
      { id: 'color', label: 'Color', type: 'select', options: ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Brown', 'Green', 'Pearl White', 'Other'] },

      { id: 'registered', label: 'Registered in Kenya?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'exchange', label: 'Exchange Accepted?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'seats', label: 'Number of Seats', type: 'radio', options: ['2', '4', '5', '6', '7', '8+'] },
      { id: 'doors', label: 'Number of Doors', type: 'radio', options: ['2', '3', '4', '5'] },
      { id: 'usageType', label: 'Usage Type', type: 'radio', options: ['Local', 'Import / Ex-Japan', 'Import / Ex-UK', 'Ex-Lease', 'Diplomatic'] },
    ]
  },
  'auto-spares': {
    attributes: [
      { id: 'listingType', label: 'Listing Type', type: 'radio', options: ['spare-part', 'accessory'] },
      
      // Spare Part Specific
      { id: 'make', label: 'Vehicle Make', type: 'dynamic-select', dependsOn: { field: 'listingType', value: 'spare-part' } },
      { id: 'model', label: 'Vehicle Model', type: 'dynamic-select', dependsOn: { field: 'make' } },
      { id: 'compatibleYear', label: 'Compatible Year', type: 'dynamic-select', dependsOn: { field: 'model' } },
      { id: 'partCategory', label: 'Part Category', type: 'dynamic-select', dependsOn: { field: 'compatibleYear' } },
      { id: 'part', label: 'Spare Part', type: 'dynamic-select', dependsOn: { field: 'partCategory' } },
      { id: 'position', label: 'Position', type: 'select', options: ['Front', 'Rear', 'Left', 'Right', 'Upper', 'Lower', 'Inner', 'Outer'], dependsOn: { field: 'partCategory' } },
      { id: 'generation', label: 'Generation / Chassis', type: 'text', dependsOn: { field: 'make' } },
      { id: 'engine', label: 'Engine Code', type: 'text', dependsOn: { field: 'make' } },
      { id: 'oemNumber', label: 'OEM Part Number', type: 'text', dependsOn: { field: 'listingType', value: 'spare-part' } },

      // Accessories Specific
      { id: 'category', label: 'Accessory Category', type: 'dynamic-cascade', cascadeLevel: 1, dependsOn: { field: 'listingType', value: 'accessory' } },
      { id: 'subcategory', label: 'Subcategory', type: 'dynamic-cascade', cascadeParent: 'category', dependsOn: { field: 'listingType', value: 'accessory' } },
      { id: 'item', label: 'Accessory Item', type: 'dynamic-cascade', cascadeParent: 'subcategory', cascadeGrandparent: 'category', dependsOn: { field: 'listingType', value: 'accessory' } },
      { id: 'universal', label: 'Universal Fit', type: 'radio', options: ['Yes', 'No'], dependsOn: { field: 'listingType', value: 'accessory' } },
      { id: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Car', 'SUV', 'Pickup', 'Truck', 'Motorcycle'], dependsOn: { field: 'listingType', value: 'accessory' } },
      
    ]
  },
  property: {
    attributes: [
      { id: 'listingCategory', label: 'Listing Category', type: 'radio', options: ['For Sale', 'For Rent', 'For Lease'] },
      { id: 'propertyCategory', label: 'Property Category', type: 'dynamic-select', dependsOn: { field: 'listingCategory' } }, // e.g. Residential, Commercial
      { id: 'propertyType', label: 'Property Type', type: 'dynamic-select', dependsOn: { field: 'propertyCategory' } }, // e.g. Apartment, House
      { id: 'bedrooms', label: 'Bedrooms', type: 'radio', options: ['1', '2', '3', '4', '5+'] },
      { id: 'bathrooms', label: 'Bathrooms', type: 'radio', options: ['1', '2', '3+'] },
      { id: 'furnished', label: 'Furnished', type: 'radio', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
      { id: 'floors', label: 'Floor', type: 'radio', options: ['Ground', '1', '2', '3', '4', '5+'] },
      { id: 'parking', label: 'Parking Available', type: 'radio', options: ['Yes', 'No'] },
      { id: 'amenities', label: 'Amenities', type: 'multicheck', options: ['Swimming Pool', 'Gym', 'Backup Generator', 'Borehole', 'Elevator', 'Balcony', 'Garden', 'Security Guard', 'CCTV', 'Internet / Wi-Fi', 'Pet Friendly'] }
    ]
  },
  'phones-tablets': {
    attributes: [
      { id: 'brand', label: 'Brand', type: 'dynamic-select' },
      { id: 'series', label: 'Series', type: 'dynamic-select', dependsOn: { field: 'brand' } },
      { id: 'model', label: 'Model', type: 'dynamic-select', dependsOn: { field: 'series' } },
      { id: 'storage', label: 'Internal Storage', type: 'multicheck', options: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'] },
      { id: 'ram', label: 'RAM', type: 'multicheck', options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB+'] },
      { id: 'network', label: 'Network', type: 'multicheck', options: ['3G', '4G LTE', '5G'] },
      { id: 'os', label: 'Operating System', type: 'radio', options: ['Android', 'iOS', 'Windows', 'Other'] },
      { id: 'color', label: 'Color', type: 'select', options: ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Other'] }
    ]
  },
  electronics: {
    attributes: [
      { id: 'subcategory', label: 'Category', type: 'dynamic-select' }, // e.g. Laptops, TVs, Audio
      
      // Laptops
      { id: 'brand', label: 'Brand', type: 'dynamic-select', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'series', label: 'Series', type: 'dynamic-select', dependsOn: { field: 'brand' } },
      { id: 'model', label: 'Model', type: 'dynamic-select', dependsOn: { field: 'series' } },
      { id: 'cpuBrand', label: 'Processor Brand', type: 'select', options: ['Intel', 'AMD', 'Apple', 'Other'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'cpuGen', label: 'Processor Generation', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'ram', label: 'RAM', type: 'multicheck', options: ['4GB', '8GB', '16GB', '32GB', '64GB'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'storageType', label: 'Storage Type', type: 'radio', options: ['SSD', 'HDD', 'eMMC'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'storageSize', label: 'Storage Size', type: 'select', options: ['128GB', '256GB', '512GB', '1TB', '2TB+'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'screenSize', label: 'Screen Size', type: 'select', options: ['11"', '12"', '13"', '14"', '15"', '16"', '17"+'], dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      { id: 'gpu', label: 'Graphics Card', type: 'text', dependsOn: { field: 'subcategory', value: 'Laptops & Computers' } },
      
      // TVs
      { id: 'tvBrand', label: 'Brand', type: 'dynamic-select', dependsOn: { field: 'subcategory', value: 'Televisions' } },
      { id: 'tvSeries', label: 'Series', type: 'dynamic-select', dependsOn: { field: 'tvBrand' } },
      { id: 'screenSizeTv', label: 'Screen Size', type: 'select', options: ['32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"+'], dependsOn: { field: 'subcategory', value: 'Televisions' } },
      { id: 'displayTech', label: 'Display Technology', type: 'select', options: ['LED', 'OLED', 'QLED', 'NanoCell', 'Plasma'], dependsOn: { field: 'subcategory', value: 'Televisions' } },
      { id: 'resolution', label: 'Resolution', type: 'select', options: ['HD', 'Full HD', '4K UHD', '8K'], dependsOn: { field: 'subcategory', value: 'Televisions' } },
      { id: 'smartPlatform', label: 'Smart Platform', type: 'select', options: ['Android TV', 'Google TV', 'WebOS', 'Tizen', 'VIDAA', 'Roku', 'Non Smart'], dependsOn: { field: 'subcategory', value: 'Televisions' } },
      
      // Audio
      { id: 'equipmentType', label: 'Equipment Type', type: 'dynamic-select', dependsOn: { field: 'subcategory', value: 'Audio & Music' } },
      { id: 'audioBrand', label: 'Brand', type: 'dynamic-select', dependsOn: { field: 'equipmentType' } },
      { id: 'channels', label: 'Channels', type: 'select', options: ['2.0', '2.1', '3.1', '5.0', '5.1', '7.1', '9.1', '11.1'], dependsOn: { field: 'subcategory', value: 'Audio & Music' } },
      { id: 'connectivity', label: 'Connectivity', type: 'multicheck', options: ['Bluetooth', 'Wi-Fi', 'HDMI', 'HDMI ARC', 'HDMI eARC', 'USB', 'Optical', 'AUX'], dependsOn: { field: 'subcategory', value: 'Audio & Music' } }
    ]
  },
  jobs: {
    attributes: [
      { id: 'employmentType', label: 'Employment Type', type: 'multicheck', options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Remote'] },
      { id: 'workArrangement', label: 'Work Arrangement', type: 'radio', options: ['On-site', 'Remote', 'Hybrid'] },
      { id: 'experienceLevel', label: 'Experience Level', type: 'radio', options: ['Entry Level', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'] },
      { id: 'educationLevel', label: 'Education Level', type: 'radio', options: ['KCSE / O-Level', 'Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'] },
      { id: 'industry', label: 'Industry', type: 'select', options: ['IT & Technology', 'Finance & Banking', 'Healthcare', 'Education', 'NGO', 'Hospitality', 'Transport & Logistics', 'Agriculture', 'Construction', 'Media & Marketing', 'Sales', 'Admin & HR', 'Legal', 'Government', 'Other'] },
      { id: 'salaryMin', label: 'Min Salary', type: 'number', filterType: 'min' },
      { id: 'salaryMax', label: 'Max Salary', type: 'number', filterType: 'max' }
    ]
  },
  // Add fallback for default DynamicListingForm
  default: {
    attributes: []
  }
};
