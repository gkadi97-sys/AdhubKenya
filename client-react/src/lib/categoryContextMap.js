/**
 * CATEGORY CONTEXT MAP
 * =====================
 * Single source of truth for marketplace-wide, category-specific intelligence.
 *
 * Powers:
 *  - HeroSearch: placeholder text, trending searches, quick filter tabs
 *  - FilterPanel: subcat-aware filter groups, attribute dependency clears
 *  - MetadataDrivenForm: same taxonomy enforced on listing creation
 *
 * RULE: Every category behaves as its own marketplace.
 * RULE: Child attributes must never appear without their parent being selected.
 * RULE: Changing a parent attribute must auto-clear all its children.
 */

export const CATEGORY_CONTEXT = {

  // ─── VEHICLES ─────────────────────────────────────────────────────────────
  vehicles: {
    label: 'Vehicles',
    icon: '🚗',
    placeholder: 'Search makes, models, body types...',
    trending: ['Toyota Fielder', 'Toyota Prado', 'Subaru Forester', 'Nissan Note', 'Isuzu D-Max'],
    quickLinks: [
      { label: 'Toyota', params: { make: 'Toyota' } },
      { label: 'Nissan',  params: { make: 'Nissan' } },
      { label: 'Subaru',  params: { make: 'Subaru' } },
      { label: 'SUVs',    params: { bodyType: 'SUV / Crossover' } },
      { label: 'Automatic', params: { transmission: 'Automatic' } },
      { label: 'Diesel',  params: { fuelType: 'Diesel' } },
    ],
    // Attributes that must be cleared when their parent changes
    cascadeChain: ['make', 'model', 'year', 'trim'],
  },

  cars: {
    label: 'Cars',
    icon: '🚗',
    placeholder: 'Search car make, model or body type...',
    trending: ['Toyota Premio', 'Toyota Allion', 'Mazda Atenza', 'BMW 3 Series', 'Mercedes C Class'],
    quickLinks: [
      { label: 'Sedan', params: { bodyType: 'Sedan' } },
      { label: 'SUV', params: { bodyType: 'SUV / Crossover' } },
      { label: 'Station Wagon', params: { bodyType: 'Station Wagon' } },
      { label: 'Petrol', params: { fuelType: 'Petrol' } },
      { label: 'Diesel', params: { fuelType: 'Diesel' } },
      { label: 'Hybrid', params: { fuelType: 'Hybrid' } },
    ],
    cascadeChain: ['make', 'model', 'year'],
  },

  motorcycles: {
    label: 'Motorcycles',
    icon: '🏍️',
    placeholder: 'Search motorcycle make or engine size...',
    trending: ['Honda CB', 'Yamaha', 'Bajaj Boxer', 'TVS Apache', 'Haojue'],
    quickLinks: [
      { label: 'Honda', params: { make: 'Honda' } },
      { label: 'Yamaha', params: { make: 'Yamaha' } },
      { label: 'Bajaj', params: { make: 'Bajaj' } },
      { label: 'Under 150cc', params: { engineCC_max: '150' } },
    ],
    cascadeChain: ['make', 'model'],
  },

  trucks: {
    label: 'Trucks',
    icon: '🚛',
    placeholder: 'Search truck make, payload or axles...',
    trending: ['Isuzu NQR', 'Mitsubishi Canter', 'Mercedes Actros', 'MAN TGS', 'Volvo FH'],
    quickLinks: [
      { label: 'Isuzu', params: { make: 'Isuzu' } },
      { label: 'Mitsubishi', params: { make: 'Mitsubishi' } },
      { label: 'Tipper', params: { truckType: 'Tipper' } },
    ],
    cascadeChain: ['make', 'model'],
  },

  buses: {
    label: 'Buses',
    icon: '🚌',
    placeholder: 'Search bus make or seating capacity...',
    trending: ['Isuzu Bus', 'Toyota Coaster', 'Rosa Minibus', '33 Seater', '51 Seater'],
    quickLinks: [
      { label: 'Toyota Coaster', params: { make: 'Toyota', model: 'Coaster' } },
      { label: 'Isuzu', params: { make: 'Isuzu' } },
    ],
    cascadeChain: ['make', 'model'],
  },

  'heavy-equipment': {
    label: 'Heavy Equipment',
    icon: '🏗️',
    placeholder: 'Search excavators, bulldozers, cranes...',
    trending: ['CAT Excavator', 'Komatsu PC200', 'JCB Backhoe', 'Volvo Wheel Loader'],
    quickLinks: [
      { label: 'Caterpillar', params: { make: 'Caterpillar' } },
      { label: 'Komatsu', params: { make: 'Komatsu' } },
      { label: 'JCB', params: { make: 'JCB' } },
      { label: 'Excavator', params: { equipmentType: 'Excavator' } },
    ],
    cascadeChain: ['make', 'model'],
  },

  'agricultural-machinery': {
    label: 'Agricultural Machinery',
    icon: '🚜',
    placeholder: 'Search tractors, harvesters, implements...',
    trending: ['John Deere Tractor', 'Massey Ferguson', 'Kubota', 'Case IH'],
    quickLinks: [
      { label: 'John Deere', params: { make: 'John Deere' } },
      { label: 'Massey Ferguson', params: { make: 'Massey Ferguson' } },
      { label: 'Tractor', params: { machineryType: 'Tractor' } },
    ],
    cascadeChain: ['make', 'model'],
  },

  // ─── AUTO PARTS & ACCESSORIES ─────────────────────────────────────────────
  'auto-parts-accessories': {
    label: 'Auto Parts & Accessories',
    icon: '🔧',
    placeholder: 'Search by car make, part type or OEM number...',
    trending: ['Toyota Brake Pads', 'Nissan Alternator', 'Car Tyres 205/65R15', 'LED Headlights', 'Car Batteries'],
    quickLinks: [
      { label: 'Body Parts', params: { partCategory: 'Body Parts' } },
      { label: 'Engine Parts', params: { partCategory: 'Engine' } },
      { label: 'Tyres & Rims', params: { partCategory: 'Tyres & Rims' } },
      { label: 'Electrical', params: { partCategory: 'Electrical' } },
    ],
    cascadeChain: ['make', 'model', 'year', 'partCategory', 'part'],
  },

  // ─── PROPERTY ─────────────────────────────────────────────────────────────
  property: {
    label: 'Property',
    icon: '🏠',
    placeholder: 'Search apartments, land, office space...',
    trending: ['2 Bedroom Apartment Kilimani', 'Land for Sale Ruiru', 'Bedsitter Roysambu', '1 Bedroom Westlands'],
    quickLinks: [
      { label: 'For Rent', params: { purpose: 'Rent' } },
      { label: 'For Sale', params: { purpose: 'Sale' } },
      { label: 'Apartments', params: { propertyCategory: 'Apartment' } },
      { label: 'Land', params: { propertyCategory: 'Land' } },
      { label: 'Houses', params: { propertyCategory: 'House' } },
      { label: 'Commercial', params: { propertyCategory: 'Commercial' } },
    ],
    cascadeChain: ['propertyCategory', 'propertyType'],
  },

  // ─── PHONES & TABLETS ─────────────────────────────────────────────────────
  'phones-tablets': {
    label: 'Phones & Tablets',
    icon: '📱',
    placeholder: 'Search iPhone, Samsung, Tecno...',
    trending: ['iPhone 15 Pro Max', 'Samsung Galaxy S24', 'Tecno Camon 30', 'iPad Pro', 'Samsung Tab'],
    quickLinks: [
      { label: 'Apple', params: { brand: 'Apple' } },
      { label: 'Samsung', params: { brand: 'Samsung' } },
      { label: 'Tecno', params: { brand: 'Tecno' } },
      { label: 'Brand New', params: { condition: 'Brand New' } },
      { label: '5G', params: { network: '5G' } },
    ],
    cascadeChain: ['brand', 'series', 'model', 'variant'],
  },

  phones: {
    label: 'Phones',
    icon: '📱',
    placeholder: 'Search smartphone brand or model...',
    trending: ['iPhone 15 Pro Max', 'Samsung S24 Ultra', 'Tecno Camon 30', 'Infinix Zero'],
    quickLinks: [
      { label: 'Apple', params: { brand: 'Apple' } },
      { label: 'Samsung', params: { brand: 'Samsung' } },
      { label: 'Tecno', params: { brand: 'Tecno' } },
      { label: 'Brand New', params: { condition: 'Brand New' } },
    ],
    cascadeChain: ['brand', 'series', 'model', 'variant'],
  },

  tablets: {
    label: 'Tablets',
    icon: '📲',
    placeholder: 'Search iPad, Samsung Tab, Lenovo Tab...',
    trending: ['iPad Pro 12.9', 'Samsung Galaxy Tab S9', 'Lenovo Tab P12'],
    quickLinks: [
      { label: 'Apple', params: { brand: 'Apple' } },
      { label: 'Samsung', params: { brand: 'Samsung' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  // ─── ELECTRONICS ──────────────────────────────────────────────────────────
  electronics: {
    label: 'Electronics',
    icon: '💻',
    placeholder: 'Search laptops, TVs, cameras, audio...',
    trending: ['MacBook Pro M3', 'Dell XPS 15', 'Samsung 55" 4K TV', 'Sony PlayStation 5', 'GoPro Hero 12'],
    quickLinks: [
      { label: 'Laptops', params: { subcategory: 'laptops' } },
      { label: 'TVs', params: { subcategory: 'televisions' } },
      { label: 'Cameras', params: { subcategory: 'cameras' } },
      { label: 'Audio', params: { subcategory: 'audio' } },
      { label: 'Gaming', params: { subcategory: 'gaming' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  televisions: {
    label: 'TVs & Monitors',
    icon: '📺',
    placeholder: 'Search by brand, screen size or resolution...',
    trending: ['Samsung 65" QLED', 'LG OLED 55"', 'Sony Bravia 4K', 'TCL 50"', 'Hisense 43"'],
    quickLinks: [
      { label: 'Samsung', params: { brand: 'Samsung' } },
      { label: 'LG', params: { brand: 'LG' } },
      { label: 'Sony', params: { brand: 'Sony' } },
      { label: '4K', params: { resolution: '4K UHD' } },
      { label: 'Smart TV', params: { smartTV: 'Yes' } },
    ],
    // brand → series → model (all isolated under tvs_* lookup_types)
    cascadeChain: ['brand', 'series', 'model'],
  },

  'audio-music': {
    label: 'Audio & Music',
    icon: '🔊',
    placeholder: 'Search by brand, speaker type or audio format...',
    trending: ['JBL Xtreme 3', 'Sony WH-1000XM5', 'Bose QuietComfort', 'Marshall Emberton', 'Yamaha MusicCast'],
    quickLinks: [
      { label: 'JBL', params: { brand: 'JBL' } },
      { label: 'Sony', params: { brand: 'Sony' } },
      { label: 'Bose', params: { brand: 'Bose' } },
      { label: 'Soundbar', params: { audioType: 'Soundbar' } },
      { label: 'Headphones', params: { audioType: 'Headphones' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  'laptops-computers': {
    label: 'Laptops & Computers',
    icon: '💻',
    placeholder: 'Search by brand, CPU, RAM or screen size...',
    trending: ['MacBook Pro M3', 'Dell XPS 15', 'HP EliteBook 840', 'Lenovo ThinkPad X1', 'ASUS ROG'],
    quickLinks: [
      { label: 'Apple', params: { brand: 'Apple' } },
      { label: 'Dell', params: { brand: 'Dell' } },
      { label: 'HP', params: { brand: 'HP' } },
      { label: 'Gaming Laptop', params: { laptopType: 'Gaming' } },
      { label: '16GB RAM', params: { ram: '16GB' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  cameras: {
    label: 'Cameras & Photography',
    icon: '📷',
    placeholder: 'Search by brand, type or megapixels...',
    trending: ['Sony A7 IV', 'Canon EOS R6', 'Nikon Z6 III', 'DJI Air 3', 'GoPro Hero 12'],
    quickLinks: [
      { label: 'Sony', params: { brand: 'Sony' } },
      { label: 'Canon', params: { brand: 'Canon' } },
      { label: 'Mirrorless', params: { cameraType: 'Mirrorless' } },
      { label: 'DSLR', params: { cameraType: 'DSLR' } },
      { label: 'Drone', params: { cameraType: 'Drone' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  gaming: {
    label: 'Gaming',
    icon: '🎮',
    placeholder: 'Search consoles, games or accessories...',
    trending: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Steam Deck', 'ASUS ROG Ally'],
    quickLinks: [
      { label: 'PlayStation', params: { brand: 'Sony (PlayStation)' } },
      { label: 'Xbox', params: { brand: 'Microsoft (Xbox)' } },
      { label: 'Nintendo', params: { brand: 'Nintendo' } },
      { label: 'PC Gaming', params: { brand: 'Asus (ROG)' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  'printers-office': {
    label: 'Printers & Office',
    icon: '🖨️',
    placeholder: 'Search printers, scanners or office equipment...',
    trending: ['Epson L3250', 'HP LaserJet Pro', 'Canon PIXMA', 'Brother DCP'],
    quickLinks: [
      { label: 'Epson', params: { brand: 'Epson' } },
      { label: 'HP', params: { brand: 'HP' } },
      { label: 'Canon', params: { brand: 'Canon' } },
      { label: 'Laser', params: { printerType: 'Laser' } },
      { label: 'Inkjet', params: { printerType: 'Inkjet' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  networking: {
    label: 'Networking & IT',
    icon: '📡',
    placeholder: 'Search routers, switches, access points...',
    trending: ['TP-Link Archer AX90', 'Ubiquiti UniFi', 'MikroTik hEX', 'Cisco Switch', 'Netgear Nighthawk'],
    quickLinks: [
      { label: 'TP-Link', params: { brand: 'TP-Link' } },
      { label: 'Ubiquiti', params: { brand: 'Ubiquiti' } },
      { label: 'MikroTik', params: { brand: 'MikroTik' } },
      { label: 'Router', params: { deviceType: 'Router' } },
      { label: 'Switch', params: { deviceType: 'Switch' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },

  'home-appliances': {
    label: 'Home Appliances',
    icon: '🏠',
    placeholder: 'Search fridges, washing machines, microwaves...',
    trending: ['Samsung Fridge', 'LG Washing Machine', 'Miele Dishwasher', 'Ramtons Microwave'],
    quickLinks: [
      { label: 'Fridges', params: { applianceType: 'Fridge' } },
      { label: 'Washing Machine', params: { applianceType: 'Washing Machine' } },
      { label: 'Microwave', params: { applianceType: 'Microwave' } },
      { label: 'Air Conditioner', params: { applianceType: 'Air Conditioner' } },
    ],
    cascadeChain: ['brand', 'model'],
  },

  'solar-power': {
    label: 'Solar & Power',
    icon: '☀️',
    placeholder: 'Search solar panels, inverters, batteries...',
    trending: ['Victron Inverter', 'Pylontech Battery', '400W Solar Panel', 'Growatt MPPT'],
    quickLinks: [
      { label: 'Solar Panels', params: { solarType: 'Solar Panel' } },
      { label: 'Inverters', params: { solarType: 'Inverter' } },
      { label: 'Batteries', params: { solarType: 'Battery' } },
      { label: 'Complete Kit', params: { solarType: 'Complete Kit' } },
    ],
    cascadeChain: ['brand', 'model'],
  },

  // Alias for backwards-compat with slug 'laptops'
  laptops: {
    label: 'Laptops & Computers',
    icon: '💻',
    placeholder: 'Search by brand, CPU or RAM...',
    trending: ['MacBook Pro M3', 'Dell XPS 15', 'HP EliteBook 840', 'Lenovo ThinkPad X1'],
    quickLinks: [
      { label: 'Apple', params: { brand: 'Apple' } },
      { label: 'Dell', params: { brand: 'Dell' } },
      { label: 'HP', params: { brand: 'HP' } },
      { label: 'i7', params: { cpu: 'Intel Core i7' } },
      { label: '16GB RAM', params: { ram: '16GB' } },
    ],
    cascadeChain: ['brand', 'series', 'model'],
  },


  'home-living': {
    label: 'Home & Living',
    icon: '🛋️',
    placeholder: 'Search sofas, beds, dining sets...',
    trending: ['7-Seater Sofa Set', 'Queen Bed Frame', 'Dining Table 6 Seats', 'Wardrobe 3 Door'],
    quickLinks: [
      { label: 'Sofas', params: { subcategory: 'sofas' } },
      { label: 'Beds', params: { subcategory: 'beds' } },
      { label: 'Mattresses', params: { subcategory: 'mattresses' } },
      { label: 'Dining', params: { subcategory: 'dining-tables' } },
      { label: 'Wardrobes', params: { subcategory: 'wardrobes' } },
    ],
    cascadeChain: [],
  },

  // ─── FASHION ──────────────────────────────────────────────────────────────
  fashion: {
    label: 'Fashion',
    icon: '👗',
    placeholder: 'Search clothing, shoes or accessories...',
    trending: ['Nike Sneakers', 'Louis Vuitton Bag', 'Men Suit', 'Ladies Dress', 'Rolex Watch'],
    quickLinks: [
      { label: 'Men', params: { gender: 'Men' } },
      { label: 'Women', params: { gender: 'Women' } },
      { label: 'Shoes', params: { subcategory: 'shoes' } },
      { label: 'Bags', params: { subcategory: 'bags' } },
      { label: 'Watches', params: { subcategory: 'watches' } },
    ],
    cascadeChain: [],
  },
  'mens-clothing': {
    label: "Men's Clothing",
    icon: '👔',
    placeholder: 'Search shirts, trousers, suits...',
    trending: ['Men Suit', 'Jeans', 'T-Shirts', 'Jackets'],
    quickLinks: [
      { label: 'Suits', params: { search: 'suit' } },
      { label: 'Jeans', params: { search: 'jeans' } }
    ],
    cascadeChain: [],
  },
  'womens-clothing': {
    label: "Women's Clothing",
    icon: '👗',
    placeholder: 'Search dresses, tops, skirts...',
    trending: ['Ladies Dress', 'Skirts', 'Blouses', 'Jeans'],
    quickLinks: [
      { label: 'Dresses', params: { search: 'dress' } },
      { label: 'Tops', params: { search: 'top' } }
    ],
    cascadeChain: [],
  },
  'kids-clothing': {
    label: "Kids' Clothing",
    icon: '👕',
    placeholder: 'Search boys, girls, baby clothes...',
    trending: ['Baby Romper', 'Kids Dress', 'Boys Suit'],
    quickLinks: [
      { label: 'Baby', params: { search: 'baby' } },
      { label: 'School Uniform', params: { search: 'uniform' } }
    ],
    cascadeChain: [],
  },
  'shoes': {
    label: 'Shoes',
    icon: '👞',
    placeholder: 'Search sneakers, boots, heels...',
    trending: ['Nike Sneakers', 'Jordan 1', 'Air Force 1', 'High Heels', 'Chelsea Boots'],
    quickLinks: [
      { label: 'Sneakers', params: { search: 'sneakers' } },
      { label: 'Boots', params: { search: 'boots' } },
      { label: 'Heels', params: { search: 'heels' } }
    ],
    cascadeChain: ['brand', 'model', 'sizeStandard', 'size'],
  },
  'bags-luggage': {
    label: 'Bags & Luggage',
    icon: '👜',
    placeholder: 'Search handbags, backpacks, suitcases...',
    trending: ['Louis Vuitton Bag', 'Travel Suitcase', 'Leather Backpack', 'Laptop Bag'],
    quickLinks: [
      { label: 'Handbags', params: { search: 'handbag' } },
      { label: 'Backpacks', params: { search: 'backpack' } },
      { label: 'Suitcases', params: { search: 'suitcase' } }
    ],
    cascadeChain: [],
  },
  'watches-jewellery': {
    label: 'Watches & Jewellery',
    icon: '⌚',
    placeholder: 'Search watches, rings, necklaces...',
    trending: ['Rolex Watch', 'Gold Chain', 'Engagement Ring', 'Smart Watch'],
    quickLinks: [
      { label: 'Watches', params: { search: 'watch' } },
      { label: 'Rings', params: { search: 'ring' } },
      { label: 'Necklaces', params: { search: 'necklace' } }
    ],
    cascadeChain: ['brand', 'model'],
  },
  'eyewear': {
    label: 'Eyewear',
    icon: '🕶️',
    placeholder: 'Search sunglasses, optical frames...',
    trending: ['Ray-Ban Sunglasses', 'Designer Frames', 'Reading Glasses'],
    quickLinks: [
      { label: 'Sunglasses', params: { search: 'sunglasses' } },
      { label: 'Frames', params: { search: 'frames' } }
    ],
    cascadeChain: [],
  },

  // ─── HEALTH & BEAUTY ──────────────────────────────────────────────────────
  'health-beauty': {
    label: 'Health & Beauty',
    icon: '💄',
    placeholder: 'Search perfumes, skincare, makeup...',
    trending: ['Chanel No. 5', 'L\'Oreal Foundation', 'Nivea Body Lotion', 'Hair Weave'],
    quickLinks: [
      { label: 'Perfume', params: { subcategory: 'perfumes' } },
      { label: 'Skincare', params: { subcategory: 'skincare' } },
      { label: 'Makeup', params: { subcategory: 'makeup' } },
      { label: 'Hair Products', params: { subcategory: 'hair-products' } },
    ],
    cascadeChain: [],
  },

  // ─── SERVICES ─────────────────────────────────────────────────────────────
  services: {
    label: 'Services',
    icon: '🛠️',
    placeholder: 'Search plumbers, electricians, cleaners...',
    trending: ['House Cleaning Nairobi', 'Plumber Emergency', 'Wedding Photographer', 'Private Tutor Math'],
    quickLinks: [
      { label: 'Cleaning', params: { serviceType: 'Cleaning' } },
      { label: 'Repair', params: { serviceType: 'Repair' } },
      { label: 'Photography', params: { serviceType: 'Photography' } },
      { label: 'Tutoring', params: { serviceType: 'Tutoring' } },
      { label: 'Legal', params: { serviceType: 'Legal' } },
    ],
    cascadeChain: [],
  },

  // ─── REPAIR & CONSTRUCTION ────────────────────────────────────────────────
  'repair-construction': {
    label: 'Repair & Construction',
    icon: '🏗️',
    placeholder: 'Search electricians, plumbers, contractors...',
    trending: ['Electrician Nairobi', 'Plumber Emergency', 'Interior Designer', 'House Painter'],
    quickLinks: [
      { label: 'Electrician', params: { tradeType: 'Electrician' } },
      { label: 'Plumber', params: { tradeType: 'Plumber' } },
      { label: 'Contractor', params: { tradeType: 'Contractor' } },
      { label: 'Architect', params: { tradeType: 'Architect' } },
      { label: 'Emergency', params: { emergency: 'Yes' } },
    ],
    cascadeChain: [],
  },

  // ─── COMMERCIAL EQUIPMENT ─────────────────────────────────────────────────
  'commercial-equipment': {
    label: 'Commercial Equipment',
    icon: '🏭',
    placeholder: 'Search restaurant, medical or industrial equipment...',
    trending: ['Commercial Oven', 'Espresso Machine', 'Industrial Generator', 'Medical Bed'],
    quickLinks: [
      { label: 'Restaurant', params: { equipmentCategory: 'Restaurant' } },
      { label: 'Medical', params: { equipmentCategory: 'Medical' } },
      { label: 'Manufacturing', params: { equipmentCategory: 'Manufacturing' } },
      { label: 'Refrigeration', params: { equipmentCategory: 'Refrigeration' } },
    ],
    cascadeChain: [],
  },

  // ─── COMMERCIAL VEHICLES ──────────────────────────────────────────────────
  'commercial-vehicles': {
    label: 'Commercial Vehicles',
    icon: '🚐',
    placeholder: 'Search pickups, vans, lorries, trailers...',
    trending: ['Toyota Hilux Pickup', 'Isuzu FRR Lorry', 'Mitsubishi Van', 'Refrigerated Truck'],
    quickLinks: [
      { label: 'Pickup', params: { vehicleType: 'Pickup' } },
      { label: 'Van', params: { vehicleType: 'Van' } },
      { label: 'Lorry', params: { vehicleType: 'Lorry' } },
      { label: 'Refrigerated', params: { vehicleType: 'Refrigerated' } },
      { label: 'Tanker', params: { vehicleType: 'Tanker' } },
    ],
    cascadeChain: ['vehicleType', 'make', 'model'],
  },

  // ─── HOBBIES, ART & SPORT ─────────────────────────────────────────────────
  'hobbies-art-sport': {
    label: 'Hobbies, Art & Sport',
    icon: '🎸',
    placeholder: 'Search instruments, gym equipment, art supplies...',
    trending: ['Guitar Acoustic', 'Treadmill', 'Dumbbells Set', 'Piano Keyboard', 'Bicycle Mountain'],
    quickLinks: [
      { label: 'Gym Equipment', params: { hobbyCategory: 'Gym Equipment' } },
      { label: 'Musical Instruments', params: { hobbyCategory: 'Musical Instruments' } },
      { label: 'Art Supplies', params: { hobbyCategory: 'Art Supplies' } },
      { label: 'Outdoor & Sport', params: { hobbyCategory: 'Sport' } },
    ],
    cascadeChain: [],
  },

  // ─── BABIES & KIDS ────────────────────────────────────────────────────────
  'babies-kids': {
    label: 'Babies & Kids',
    icon: '🍼',
    placeholder: 'Search strollers, car seats, toys, clothes...',
    trending: ['Stroller Bugaboo', 'ISOFIX Car Seat', 'LEGO Set', 'Baby Monitor'],
    quickLinks: [
      { label: 'Strollers', params: { kidsCategory: 'Strollers' } },
      { label: 'Car Seats', params: { kidsCategory: 'Car Seats' } },
      { label: 'Toys', params: { kidsCategory: 'Toys' } },
      { label: 'Clothing', params: { kidsCategory: 'Clothing' } },
    ],
    cascadeChain: [],
  },

  // ─── AGRICULTURE & FOOD ───────────────────────────────────────────────────
  'agriculture-food': {
    label: 'Agriculture & Food',
    icon: '🌾',
    placeholder: 'Search seeds, fertilizer, livestock feed, equipment...',
    trending: ['Hybrid Maize Seed', 'DAP Fertilizer', 'Broiler Feed', 'Drip Irrigation Kit'],
    quickLinks: [
      { label: 'Seeds', params: { agriCategory: 'Seeds' } },
      { label: 'Fertilizer', params: { agriCategory: 'Fertilizer' } },
      { label: 'Livestock Feed', params: { agriCategory: 'Livestock Feed' } },
      { label: 'Farm Equipment', params: { agriCategory: 'Farm Equipment' } },
    ],
    cascadeChain: [],
  },

  // ─── ANIMALS & PETS ───────────────────────────────────────────────────────
  'animals-pets': {
    label: 'Animals & Pets',
    icon: '🐕',
    placeholder: 'Search dogs, cats, birds, livestock...',
    trending: ['German Shepherd Puppy', 'Persian Cat', 'Friesian Cow', 'Broiler Chicken'],
    quickLinks: [
      { label: 'Dogs', params: { animalType: 'Dog' } },
      { label: 'Cats', params: { animalType: 'Cat' } },
      { label: 'Birds', params: { animalType: 'Bird' } },
      { label: 'Livestock', params: { animalType: 'Livestock' } },
      { label: 'Vaccinated', params: { vaccinated: 'Yes' } },
    ],
    cascadeChain: ['animalType', 'breed'],
  },

  // ─── JOBS ─────────────────────────────────────────────────────────────────
  jobs: {
    label: 'Jobs',
    icon: '💼',
    placeholder: 'Search job titles, industries or skills...',
    trending: ['Software Engineer Nairobi', 'Sales Manager', 'Accountant', 'Teacher', 'Driver'],
    quickLinks: [
      { label: 'Full-Time', params: { employmentType: 'Full-Time' } },
      { label: 'Part-Time', params: { employmentType: 'Part-Time' } },
      { label: 'Remote', params: { remote: 'Yes' } },
      { label: 'IT & Tech', params: { industry: 'Technology' } },
      { label: 'Finance', params: { industry: 'Finance' } },
    ],
    cascadeChain: [],
  },

  // ─── SEEKING WORK ─────────────────────────────────────────────────────────
  'seeking-work': {
    label: 'Seeking Work',
    icon: '🙋',
    placeholder: 'Search candidates, professions or skills...',
    trending: ['Software Developer', 'Accountant CPA', 'Nurse', 'Driver', 'Sales Executive'],
    quickLinks: [
      { label: 'Available Now', params: { availability: 'Immediately' } },
      { label: 'Remote', params: { workMode: 'Remote' } },
      { label: 'IT & Tech', params: { profession: 'Technology' } },
    ],
    cascadeChain: [],
  },
};

/**
 * Get context for a given category slug (handles both slug and subcategory path).
 * Returns the most-specific match, falling back to a sensible default.
 */
export function getCategoryContext(categorySlug) {
  if (!categorySlug) return null;
  // Try exact match, then try to match from full path (e.g. "vehicles/cars" -> "cars")
  const parts = categorySlug.split('/').filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    if (CATEGORY_CONTEXT[parts[i]]) return CATEGORY_CONTEXT[parts[i]];
  }
  return null;
}

/**
 * Build attribute cascade chain for a given category.
 * Returns an ordered list of attribute names where each child depends on the prior.
 */
export function getCascadeChain(categorySlug) {
  const ctx = getCategoryContext(categorySlug);
  return ctx?.cascadeChain || [];
}
