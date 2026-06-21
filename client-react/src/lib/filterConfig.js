// Central filter configuration for all categories.
// Each entry maps a category slug → array of filter definitions.
// type: 'select' | 'multicheck' | 'radio' | 'range' | 'text' | 'dynamic-select'
// urlParam: the key written to/read from URL search params
//
// SINGLE SOURCE OF TRUTH:
// Cascade filters (brand/model hierarchy) are derived from CATEGORY_ATTRIBUTES in
// categoryData.js via filterEngine.js. Flat filters below are static enum options
// that don't change based on existing ad inventory.
//
// FIELD ALIGNMENT NOTES:
// - `fuel` urlParam: api.js queries BOTH specs.fuel AND specs.fuelType for backward compat
// - `drive` urlParam: api.js queries BOTH specs.drive AND specs.driveType for backward compat
// - `job_type` urlParam: api.js queries BOTH specs.job_type AND specs.employmentType
// - `tv_size` urlParam: api.js maps to specs.screenSize (TvForm saves screenSize)
// - `tv_tech` urlParam: api.js maps to specs.displayTech (TvForm saves displayTech)

export const FILTER_CONFIG = {

  vehicles: {
    label: 'Vehicles',
    // Make/Model cascades handled by CascadeFilterGroup via filterEngine.js
    filters: [
      {
        id: 'vehicle_type', label: 'Vehicle Type', type: 'select', urlParam: 'vehicle_type',
        options: ['Cars','SUVs','Crossovers','Pickups','Vans','Light Trucks','Heavy Trucks','Buses','Motorcycles','Tuk Tuk','Tractor']
      },
      {
        id: 'bodyStyle', label: 'Body Style', type: 'select', urlParam: 'bodyStyle',
        options: ['Sedan','Hatchback','Station Wagon','SUV / Crossover','Coupe','Convertible','Pickup / Double Cabin','Van / Minivan']
      },
      {
        id: 'year_min', label: 'Year From', type: 'select', urlParam: 'year_min',
        options: Array.from({length: new Date().getFullYear() - 1989}, (_, i) => String(2025 - i))
      },
      {
        id: 'year_max', label: 'Year To', type: 'select', urlParam: 'year_max',
        options: Array.from({length: new Date().getFullYear() - 1989}, (_, i) => String(2025 - i))
      },
      {
        id: 'fuel', label: 'Fuel Type', type: 'multicheck', urlParam: 'fuel',
        options: ['Petrol','Diesel','Hybrid','Electric','LPG']
      },
      {
        id: 'transmission', label: 'Transmission', type: 'radio', urlParam: 'transmission',
        options: ['Automatic','Manual','CVT','DCT','Semi-Auto']
      },
      {
        id: 'drive', label: 'Drive', type: 'radio', urlParam: 'drive',
        options: ['FWD','RWD','AWD','4WD']
      },
      {
        id: 'engineCC_max', label: 'Max Engine CC', type: 'select', urlParam: 'engineCC_max',
        options: ['1000','1500','1800','2000','2500','3000','4000','5000+']
      },
      {
        id: 'mileage_max', label: 'Max Mileage (km)', type: 'select', urlParam: 'mileage_max',
        options: ['10000','30000','50000','80000','100000','150000','200000']
      },
      {
        id: 'color', label: 'Color', type: 'select', urlParam: 'color',
        options: ['White','Black','Silver','Grey','Blue','Red','Brown','Green','Pearl White']
      },
      {
        id: 'numSeats', label: 'Number of Seats', type: 'radio', urlParam: 'numSeats',
        options: ['2','4','5','6','7','8+']
      },
      {
        id: 'numDoors', label: 'Number of Doors', type: 'radio', urlParam: 'numDoors',
        options: ['2','3','4','5']
      },
      {
        id: 'usageType', label: 'Usage Type', type: 'radio', urlParam: 'usageType',
        options: ['Local','Import / Ex-Japan','Import / Ex-UK','Ex-Lease','Diplomatic']
      },
      {
        id: 'overallCondition', label: 'Overall Condition', type: 'radio', urlParam: 'overallCondition',
        options: ['Excellent','Good','Fair','Needs Work']
      },
      {
        id: 'registered', label: 'Registered in Kenya?', type: 'radio', urlParam: 'registered',
        options: ['Yes','No']
      },
      {
        id: 'exchange', label: 'Exchange Accepted?', type: 'radio', urlParam: 'exchange',
        options: ['Yes','No']
      }
    ]
  },

  'auto-spares': {
    label: 'Auto Spares & Accessories',
    filters: [
      {
        id: 'make', label: 'Compatible Brand', type: 'select', urlParam: 'make',
        options: ['Toyota','Nissan','Mitsubishi','Mazda','Honda','Subaru','Isuzu','Land Rover','Mercedes-Benz','BMW','Volkswagen','Ford','Universal']
      },
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['New','Ex-Japan','Locally Used','OEM (Original)','Aftermarket','Refurbished']
      }
      // System → Part cascade handled by CascadeFilterGroup via filterEngine
    ]
  },

  property: {
    label: 'Property',
    filters: [
      {
        id: 'purpose', label: 'Purpose', type: 'radio', urlParam: 'purpose',
        options: ['Rent','Sale']
      },
      {
        id: 'listingCategory', label: 'Listing Type', type: 'radio', urlParam: 'listingCategory',
        options: ['For Sale','For Rent','For Lease']
      },
      {
        id: 'bedrooms', label: 'Bedrooms', type: 'radio', urlParam: 'bedrooms',
        options: ['1','2','3','4','5+']
      },
      {
        id: 'bathrooms', label: 'Bathrooms', type: 'radio', urlParam: 'bathrooms',
        options: ['1','2','3+']
      },
      {
        id: 'furnished', label: 'Furnished', type: 'radio', urlParam: 'furnished',
        options: ['Furnished','Semi-Furnished','Unfurnished']
      },
      {
        id: 'floors', label: 'Floor', type: 'radio', urlParam: 'floors',
        options: ['Ground','1','2','3','4','5+']
      },
      {
        id: 'parking', label: 'Parking', type: 'radio', urlParam: 'parking',
        options: ['Yes','No']
      },
      {
        id: 'amenities', label: 'Amenities', type: 'multicheck', urlParam: 'amenities',
        options: ['Swimming Pool','Gym','Backup Generator','Borehole','Elevator','Balcony','Garden','Security Guard','CCTV','Internet / Wi-Fi','Pet Friendly']
      }
    ]
  },

  'phones-tablets': {
    label: 'Phones & Tablets',
    filters: [
      // Brand/Series from dynamic DB aggregates
      { id: 'brand',  label: 'Brand',  type: 'dynamic-select', urlParam: 'brand' },
      { id: 'series', label: 'Series', type: 'dynamic-select', urlParam: 'series' },
      {
        id: 'storage', label: 'Storage', type: 'multicheck', urlParam: 'storage',
        options: ['16GB','32GB','64GB','128GB','256GB','512GB','1TB']
      },
      {
        id: 'ram', label: 'RAM', type: 'multicheck', urlParam: 'ram',
        options: ['2GB','3GB','4GB','6GB','8GB','12GB','16GB+']
      },
      {
        id: 'network', label: 'Network', type: 'multicheck', urlParam: 'network',
        options: ['3G','4G LTE','5G']
      },
      {
        id: 'os', label: 'Operating System', type: 'radio', urlParam: 'os',
        options: ['Android','iOS','Windows','Other']
      },
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['Brand New','Open Box','Ex-UK','Ex-USA','Foreign Used','Locally Used','Refurbished']
      }
    ]
  },

  electronics: {
    label: 'Electronics',
    filters: [
      // All electronics — detect sub-type to narrow filters
      { id: 'equipmentType', label: 'Equipment Type', type: 'dynamic-select', urlParam: 'equipmentType' },
      { id: 'brand',  label: 'Brand',  type: 'dynamic-select', urlParam: 'brand' },
      // TV-specific (TvForm saves as screenSize / displayTech)
      { id: 'tv_size', label: 'TV Screen Size', type: 'dynamic-select', urlParam: 'tv_size' },
      { id: 'tv_tech', label: 'Display Technology', type: 'dynamic-select', urlParam: 'tv_tech' },
      {
        id: 'resolution', label: 'Resolution', type: 'multicheck', urlParam: 'resolution',
        options: ['HD','Full HD','4K UHD','8K']
      },
      {
        id: 'smartPlatform', label: 'Smart Platform', type: 'multicheck', urlParam: 'smartPlatform',
        options: ['Android TV','Google TV','WebOS','Tizen','VIDAA','Roku','Non Smart']
      },
      // Audio-specific (AudioForm saves as channels / connectivity)
      {
        id: 'channels', label: 'Channels', type: 'multicheck', urlParam: 'channels',
        options: ['2.0','2.1','3.1','5.0','5.1','7.1','9.1','11.1']
      },
      {
        id: 'connectivity', label: 'Connectivity', type: 'multicheck', urlParam: 'connectivity',
        options: ['Bluetooth','Wi-Fi','HDMI','HDMI ARC','HDMI eARC','USB','Optical','AUX']
      },
      // Laptop-specific
      { id: 'cpuBrand', label: 'Processor Brand', type: 'dynamic-select', urlParam: 'cpuBrand' },
      {
        id: 'ram', label: 'RAM', type: 'multicheck', urlParam: 'ram',
        options: ['4GB','8GB','16GB','32GB','64GB']
      },
      {
        id: 'os', label: 'Operating System', type: 'multicheck', urlParam: 'os',
        options: ['Windows','macOS','Linux','Chrome OS']
      },
      // Series/Model (all sub-categories)
      { id: 'series', label: 'Series', type: 'dynamic-select', urlParam: 'series' },
      { id: 'model',  label: 'Model',  type: 'dynamic-select', urlParam: 'model' },
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['New','Used - Like New','Used - Good','Used - Fair']
      }
    ]
  },

  'home-furniture': {
    label: 'Home, Furniture & Appliances',
    filters: [
      { id: 'brand', label: 'Brand', type: 'dynamic-select', urlParam: 'brand' },
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['New','Used - Like New','Used - Good','Used - Fair']
      }
    ]
  },

  fashion: {
    label: 'Fashion',
    filters: [
      {
        id: 'gender', label: 'For', type: 'radio', urlParam: 'gender',
        options: ['Men','Women','Kids','Unisex']
      },
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['New','Used']
      }
    ]
  },

  jobs: {
    label: 'Jobs',
    filters: [
      // job_type urlParam → api.js queries both specs.job_type AND specs.employmentType
      {
        id: 'job_type', label: 'Employment Type', type: 'multicheck', urlParam: 'job_type',
        options: ['Full Time','Part Time','Contract','Internship','Freelance','Remote']
      },
      {
        id: 'workArrangement', label: 'Work Arrangement', type: 'radio', urlParam: 'workArrangement',
        options: ['On-site','Remote','Hybrid']
      },
      {
        id: 'experienceLevel', label: 'Experience Level', type: 'radio', urlParam: 'experienceLevel',
        options: ['Entry Level','1-3 Years','3-5 Years','5-10 Years','10+ Years']
      },
      {
        id: 'educationLevel', label: 'Education Level', type: 'radio', urlParam: 'educationLevel',
        options: ['KCSE / O-Level','Certificate','Diploma','Bachelor\'s Degree','Master\'s Degree','PhD']
      },
      {
        id: 'industry', label: 'Industry', type: 'select', urlParam: 'industry',
        options: ['IT & Technology','Finance & Banking','Healthcare','Education','NGO','Hospitality','Transport & Logistics','Agriculture','Construction','Media & Marketing','Sales','Admin & HR','Legal','Government','Other']
      }
    ]
  },

  'animals-pets': {
    label: 'Animals & Pets',
    filters: [
      {
        id: 'animal_type', label: 'Type', type: 'select', urlParam: 'animal_type',
        options: ['Dogs','Cats','Birds','Livestock','Poultry','Fish','Rabbits','Other']
      },
      {
        id: 'condition', label: 'Status', type: 'radio', urlParam: 'condition',
        options: ['For Sale','For Adoption']
      }
    ]
  }
};

// Filters shown for ALL categories (universal)
export const UNIVERSAL_FILTERS = [
  {
    id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
    options: ['New','Used']
  },
  {
    id: 'posted', label: 'Date Posted', type: 'radio', urlParam: 'posted',
    options: ['Today','Last 7 days','Last 30 days']
  },
  {
    id: 'seller_type', label: 'Seller Type', type: 'radio', urlParam: 'seller_type',
    options: ['Individual','Dealer']
  }
];

// Quick filter chips on the homepage
export const QUICK_CHIPS = [
  { label: '🔥 Under 10k',   params: { maxPrice: '10000' } },
  { label: '🚘 Vehicles',    params: { category: 'vehicles' } },
  { label: '🏠 Houses',      params: { category: 'property', purpose: 'Sale' } },
  { label: '🏠 Rent',        params: { category: 'property', purpose: 'Rent' } },
  { label: '📱 Phones',      params: { category: 'phones-tablets' } },
  { label: '💼 Jobs',        params: { category: 'jobs' } },
  { label: '🛋 Furniture',   params: { category: 'home-furniture' } },
  { label: '🆕 New Today',   params: { posted: 'Today', condition: 'New' } },
  { label: '🐶 Pets',        params: { category: 'animals-pets' } },
  { label: '🌱 Agriculture', params: { category: 'food-agriculture' } },
];

// Popular searches shown below the search bar
export const POPULAR_SEARCHES = [
  'Toyota Fielder',
  'Bedsitter Nairobi',
  'iPhone 15',
  'Mitsubishi FH',
  'PlayStation 5',
  'Land for Sale Kitengela',
  'Samsung Galaxy S24',
  'Nissan X-Trail',
  '2 Bedroom Apartment',
  'Toyota Hilux',
];
