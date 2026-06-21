// Central filter configuration for all categories.
// Each entry maps a category slug → array of filter definitions.
// type: 'select' | 'multicheck' | 'radio' | 'range' | 'text'
// urlParam: the key written to/read from URL search params

export const FILTER_CONFIG = {

  vehicles: {
    label: 'Vehicles',
    filters: [
      {
        id: 'vehicle_type', label: 'Vehicle Type', type: 'select', urlParam: 'vehicle_type',
        options: ['Cars','SUVs','Crossovers','Pickups','Vans','Light Trucks','Heavy Trucks','Buses','Motorcycles','Tuk Tuk','Tractor']
      },
      {
        id: 'bodyStyle', label: 'Body Style', type: 'select', urlParam: 'bodyStyle',
        options: ['Sedan', 'Hatchback', 'Station Wagon', 'SUV / Crossover', 'Coupe', 'Convertible', 'Pickup / Double Cabin', 'Van / Minivan']
      },
      {
        id: 'make', label: 'Brand', type: 'select', urlParam: 'make',
        options: ['Toyota','Nissan','Mitsubishi','Mazda','Honda','Subaru','Isuzu','Suzuki','Land Rover','Mercedes-Benz','BMW','Volkswagen','Ford','Hyundai','Kia','Jeep','Peugeot','Renault','Volvo','Scania','MAN','Hino','Fuso','UD Trucks','Tata','Ashok Leyland']
      },
      { id: 'model', label: 'Model', type: 'text', urlParam: 'model', placeholder: 'e.g. Prado, Fielder, NZJ...' },
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
        options: ['Automatic','Manual', 'CVT', 'DCT', 'Semi-Auto']
      },
      {
        id: 'drive', label: 'Drive', type: 'radio', urlParam: 'drive',
        options: ['FWD','RWD','AWD', '4WD']
      },
      {
        id: 'engineCC_max', label: 'Max Engine CC', type: 'select', urlParam: 'engineCC_max',
        options: ['1000', '1500', '1800', '2000', '2500', '3000', '4000', '5000+']
      },
      {
        id: 'mileage_max', label: 'Max Mileage', type: 'select', urlParam: 'mileage_max',
        options: ['10000', '30000', '50000', '80000', '100000', '150000', '200000']
      },
      {
        id: 'color', label: 'Color', type: 'select', urlParam: 'color',
        options: ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Brown', 'Green', 'Pearl White']
      },
      {
        id: 'numSeats', label: 'Number of Seats', type: 'radio', urlParam: 'numSeats',
        options: ['2', '4', '5', '6', '7', '8+']
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
        id: 'system', label: 'Part Category / System', type: 'select', urlParam: 'system',
        options: ['Engine & Components', 'Transmission & Drivetrain', 'Suspension & Steering', 'Braking System', 'Electrical & Lighting', 'Body & Exterior', 'Interior Parts', 'Cooling System', 'Exhaust System', 'Fuel System', 'Wheels & Tyres', 'Accessories & Upgrades']
      },
      {
        id: 'make', label: 'Compatible Brand', type: 'select', urlParam: 'make',
        options: ['Toyota','Nissan','Mitsubishi','Mazda','Honda','Subaru','Isuzu','Land Rover','Mercedes-Benz','BMW','Volkswagen','Ford','Universal']
      },
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['New','Ex-Japan','Locally Used','OEM (Original)','Aftermarket','Refurbished']
      }
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
        id: 'property_type', label: 'Property Type', type: 'select', urlParam: 'property_type',
        options: ['Apartment','House','Villa','Studio','Bedsitter','Maisonette','Bungalow','Office','Shop','Warehouse','Land','Plot']
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
        id: 'parking', label: 'Parking', type: 'radio', urlParam: 'parking',
        options: ['Yes','No']
      },
      {
        id: 'amenities', label: 'Amenities', type: 'multicheck', urlParam: 'amenities',
        options: ['Swimming Pool', 'Gym', 'Backup Generator', 'Borehole', 'Elevator', 'Balcony', 'Garden', 'Security Guard', 'CCTV', 'Internet / Wi-Fi', 'Pet Friendly']
      }
    ]
  },

  'phones-tablets': {
    label: 'Phones & Tablets',
    filters: [
      {
        id: 'make', label: 'Brand', type: 'select', urlParam: 'make',
        options: ['Apple','Samsung','Tecno','Infinix','Itel','Huawei','Nokia','Xiaomi','Oppo','Vivo','Realme','Google','Other']
      },
      { id: 'model', label: 'Model', type: 'text', urlParam: 'model', placeholder: 'e.g. iPhone 15, Galaxy S24...' },
      {
        id: 'storage', label: 'Storage', type: 'multicheck', urlParam: 'storage',
        options: ['16GB','32GB','64GB','128GB','256GB','512GB','1TB']
      },
      {
        id: 'ram', label: 'RAM', type: 'multicheck', urlParam: 'ram',
        options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB+']
      },
      {
        id: 'os', label: 'Operating System', type: 'radio', urlParam: 'os',
        options: ['Android', 'iOS', 'Windows', 'Other']
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
      {
        id: 'condition', label: 'Condition', type: 'radio', urlParam: 'condition',
        options: ['New','Used - Like New','Used - Good','Used - Fair']
      }
    ]
  },

  'home-furniture': {
    label: 'Home, Furniture & Appliances',
    filters: [
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
      {
        id: 'job_type', label: 'Job Type', type: 'multicheck', urlParam: 'job_type',
        options: ['Full Time','Part Time','Contract','Internship','Freelance','Remote']
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
