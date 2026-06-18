// ─────────────────────────────────────────────────────────────────────────────
// TRUCK DATA: Intelligent dependency engine for TruckForm.jsx
// Covers heavy commercial trucks + pickup trucks
// ─────────────────────────────────────────────────────────────────────────────

export const TRUCK_CONDITIONS    = ['Brand New', 'Ex-Japan', 'Ex-UK', 'Foreign Used', 'Locally Used', 'Refurbished'];
export const TRUCK_DRIVE_TYPES   = ['4×2', '4×4', '6×2', '6×4', '8×4', '10×4'];
export const TRUCK_FUELS         = ['Diesel', 'Petrol', 'Hybrid', 'Electric'];
export const TRUCK_TRANSMISSIONS = ['Manual', 'Automatic', 'AMT (Automated Manual)'];

// Grouped body types — used to render <optgroup> in the form
export const TRUCK_BODY_TYPES = {
  '🔒 Enclosed / Closed': [
    'Box / Van Body',
    'Refrigerated (Reefer)',
    'Tanker – Liquid',
    'Tanker – Bulk / Powder',
    'Curtainsider',
    'Garbage / Compactor',
  ],
  '🔓 Open / Flatbed': [
    'Flatbed',
    'Dropside',
    'Tipper / Dump',
    'Livestock Carrier',
    'Log / Timber Carrier',
    'Skip Loader',
  ],
  '🔧 Specialised': [
    'Prime Mover / Tractor Unit',
    'Container Carrier',
    'Car Carrier / Auto Transporter',
    'Crane Truck',
    'Concrete Mixer',
    'Recovery / Wrecker',
    'Fuel Bowser',
    'Water Bowser',
    'Ambulance / Medical',
    'Fire Truck',
    'Other',
  ],
};

// ── HEAVY TRUCK HIERARCHY ─────────────────────────────────────────────────────
export const HEAVY_TRUCK_DATA = {

  brands: [
    'Isuzu', 'Hino', 'Mitsubishi Fuso', 'Toyota', 'Nissan / UD',
    'Mercedes-Benz', 'Scania', 'Volvo', 'MAN', 'Iveco',
    'DAF', 'Ford', 'Hyundai', 'Ashok Leyland',
    'FAW', 'Sinotruk', 'JAC', 'Foton', 'DFSK',
  ],

  hierarchy: {

    // ── ISUZU ────────────────────────────────────────────────────────────────
    'Isuzu': {
      series: ['N Series (Light)', 'F Series (Medium)', 'C Series (Heavy)', 'Giga (Extra Heavy)'],
      models: {
        'N Series (Light)':        ['NHR', 'NPR', 'NPR-HD', 'NQR', 'NQR75', 'NMR'],
        'F Series (Medium)':       ['FRR', 'FSR', 'FTR', 'FVR'],
        'C Series (Heavy)':        ['CYZ', 'CXZ'],
        'Giga (Extra Heavy)':      ['Giga CYH', 'Giga EXZ'],
      },
    },

    // ── HINO ─────────────────────────────────────────────────────────────────
    'Hino': {
      series: ['300 Series (Light)', '500 Series (Medium)', '700 Series (Heavy)'],
      models: {
        '300 Series (Light)':      ['Dutro 110', 'Dutro 130', 'Dutro 150'],
        '500 Series (Medium)':     ['FG', 'FL', 'FM', 'GD', 'GH'],
        '700 Series (Heavy)':      ['SH', 'SS', 'FS'],
      },
    },

    // ── MITSUBISHI FUSO ──────────────────────────────────────────────────────
    'Mitsubishi Fuso': {
      series: ['Canter (Light)', 'Fighter (Medium)', 'Super Great (Heavy)'],
      models: {
        'Canter (Light)':          ['FE71', 'FE84', 'FE85'],
        'Fighter (Medium)':        ['FK', 'FM'],
        'Super Great (Heavy)':     ['FP', 'FU'],
      },
    },

    // ── TOYOTA ───────────────────────────────────────────────────────────────
    'Toyota': {
      series: ['Dyna', 'ToyoAce'],
      models: {
        'Dyna':                    ['Dyna 100', 'Dyna 150', 'Dyna 200'],
        'ToyoAce':                 ['ToyoAce 100', 'ToyoAce 200'],
      },
    },

    // ── NISSAN / UD ───────────────────────────────────────────────────────────
    'Nissan / UD': {
      series: ['Atlas / Cabstar (Light)', 'Condor (Medium)', 'Quon (Heavy)', 'Quester (Heavy)', 'Croner (Heavy)'],
      models: {
        'Atlas / Cabstar (Light)': ['Atlas F24', 'Atlas H43', 'Cabstar 35.13', 'Cabstar 45.13'],
        'Condor (Medium)':         ['Condor LK', 'Condor MK', 'Condor PK'],
        'Quon (Heavy)':            ['Quon GW', 'Quon GK', 'Quon CD'],
        'Quester (Heavy)':         ['Quester CWE', 'Quester CGE', 'Quester CDE'],
        'Croner (Heavy)':          ['Croner LKE', 'Croner PKE', 'Croner MKE'],
      },
    },

    // ── MERCEDES-BENZ ─────────────────────────────────────────────────────────
    'Mercedes-Benz': {
      series: ['Atego (Light/Medium)', 'Actros (Heavy)', 'Arocs (Construction)', 'Axor (Medium/Heavy)', 'Antos (Distribution)', 'Unimog (Special)'],
      models: {
        'Atego (Light/Medium)':    ['Atego 816', 'Atego 818', 'Atego 1218', 'Atego 1221', 'Atego 1222', 'Atego 1518', 'Atego 1621', 'Atego 1821', 'Atego 2121'],
        'Actros (Heavy)':         ['Actros 1831', 'Actros 1836', 'Actros 1840', 'Actros 1845', 'Actros 1848', 'Actros 2040', 'Actros 2545', 'Actros 2548', 'Actros 3348'],
        'Arocs (Construction)':   ['Arocs 1830', 'Arocs 1836', 'Arocs 2636', 'Arocs 3240', 'Arocs 3348', 'Arocs 4140', 'Arocs 4148'],
        'Axor (Medium/Heavy)':    ['Axor 1823', 'Axor 1826', 'Axor 2026', 'Axor 2533', 'Axor 2536', 'Axor 2640'],
        'Antos (Distribution)':   ['Antos 1824', 'Antos 2033', 'Antos 2533', 'Antos 2545'],
        'Unimog (Special)':       ['Unimog U218', 'Unimog U318', 'Unimog U418', 'Unimog U5023'],
      },
    },

    // ── SCANIA ────────────────────────────────────────────────────────────────
    'Scania': {
      series: ['P Series (Light/Medium)', 'G Series (Medium/Heavy)', 'R Series (Heavy)', 'S Series (Premium Heavy)'],
      models: {
        'P Series (Light/Medium)': ['P230', 'P280', 'P320', 'P360', 'P410'],
        'G Series (Medium/Heavy)': ['G380', 'G410', 'G440', 'G460', 'G500'],
        'R Series (Heavy)':        ['R410', 'R450', 'R500', 'R520', 'R560', 'R580', 'R650'],
        'S Series (Premium Heavy)':['S450', 'S500', 'S520', 'S560', 'S580', 'S650', 'S770'],
      },
    },

    // ── VOLVO ─────────────────────────────────────────────────────────────────
    'Volvo': {
      series: ['FL (Light)', 'FE (Medium)', 'FM (Heavy)', 'FMX (Construction)', 'FH (Long Haul)'],
      models: {
        'FL (Light)':              ['FL210', 'FL250'],
        'FE (Medium)':             ['FE280', 'FE320'],
        'FM (Heavy)':              ['FM330', 'FM370', 'FM420', 'FM460', 'FM500'],
        'FMX (Construction)':      ['FMX370', 'FMX420', 'FMX460', 'FMX500', 'FMX540'],
        'FH (Long Haul)':          ['FH420', 'FH460', 'FH500', 'FH540', 'FH600'],
      },
    },

    // ── MAN ───────────────────────────────────────────────────────────────────
    'MAN': {
      series: ['TGL (Light)', 'TGM (Medium)', 'TGS (Heavy)', 'TGX (Long Haul)'],
      models: {
        'TGL (Light)':             ['TGL 8.190', 'TGL 10.220', 'TGL 12.250'],
        'TGM (Medium)':            ['TGM 15.290', 'TGM 18.330', 'TGM 26.340'],
        'TGS (Heavy)':             ['TGS 18.360', 'TGS 18.400', 'TGS 26.400', 'TGS 33.400', 'TGS 40.400', 'TGS 41.400'],
        'TGX (Long Haul)':        ['TGX 18.440', 'TGX 18.470', 'TGX 18.510', 'TGX 18.640', 'TGX 26.470', 'TGX 26.510'],
      },
    },

    // ── IVECO ─────────────────────────────────────────────────────────────────
    'Iveco': {
      series: ['Daily (Light)', 'Eurocargo (Medium)', 'S-Way (Heavy)', 'Trakker (Construction)'],
      models: {
        'Daily (Light)':           ['Daily 35S14', 'Daily 35C15', 'Daily 50C18', 'Daily 70C18'],
        'Eurocargo (Medium)':      ['Eurocargo 75E21', 'Eurocargo 120E25', 'Eurocargo 180E32'],
        'S-Way (Heavy)':           ['S-Way AS260', 'S-Way AS440', 'S-Way X-WAY'],
        'Trakker (Construction)':  ['Trakker AD190', 'Trakker AD260', 'Trakker AD380', 'Trakker AD410'],
      },
    },

    // ── DAF ───────────────────────────────────────────────────────────────────
    'DAF': {
      series: ['LF (Light)', 'CF (Medium/Heavy)', 'XF (Long Haul)', 'XG (Premium)'],
      models: {
        'LF (Light)':              ['LF 180', 'LF 210', 'LF 230', 'LF 260'],
        'CF (Medium/Heavy)':       ['CF 260', 'CF 290', 'CF 330', 'CF 370', 'CF 400'],
        'XF (Long Haul)':         ['XF 440', 'XF 480', 'XF 530'],
        'XG (Premium)':           ['XG 480', 'XG 530', 'XG+ 480', 'XG+ 530'],
      },
    },

    // ── FORD ──────────────────────────────────────────────────────────────────
    'Ford': {
      series: ['Cargo', 'F-Max'],
      models: {
        'Cargo':                   ['Cargo 1042', 'Cargo 1048', 'Cargo 1722', 'Cargo 1726', 'Cargo 2533', 'Cargo 2542'],
        'F-Max':                   ['F-Max 500', 'F-Max 540'],
      },
    },

    // ── HYUNDAI ───────────────────────────────────────────────────────────────
    'Hyundai': {
      series: ['Mighty (Medium)', 'Xcient (Heavy)'],
      models: {
        'Mighty (Medium)':         ['Mighty EX8', 'Mighty EX9'],
        'Xcient (Heavy)':         ['Xcient P540', 'Xcient P540 6×4', 'Xcient P400'],
      },
    },

    // ── ASHOK LEYLAND ─────────────────────────────────────────────────────────
    'Ashok Leyland': {
      series: ['Partner (Light)', 'Boss (Medium)', 'Captain (Heavy)', 'AVTR (Premium)'],
      models: {
        'Partner (Light)':         ['Partner 9T', 'Partner 12T'],
        'Boss (Medium)':           ['Boss 1315', 'Boss 1916', 'Boss 2516'],
        'Captain (Heavy)':         ['Captain 3518', 'Captain 4018', 'Captain 4923'],
        'AVTR (Premium)':         ['AVTR 5542', 'AVTR 4923', 'AVTR 6×4'],
      },
    },

    // ── FAW ───────────────────────────────────────────────────────────────────
    'FAW': {
      series: ['CA Series (Medium)', 'JH6 (Heavy)', 'Tiger (Light)'],
      models: {
        'CA Series (Medium)':      ['CA1083', 'CA1087', 'CA1143', 'CA1250'],
        'JH6 (Heavy)':             ['JH6 J6P 430', 'JH6 J6P 460', 'JH6 J6M 340'],
        'Tiger (Light)':           ['Tiger V 120', 'Tiger V 160'],
      },
    },

    // ── SINOTRUK ──────────────────────────────────────────────────────────────
    'Sinotruk': {
      series: ['Howo (Heavy)', 'Sitrak (Premium)'],
      models: {
        'Howo (Heavy)':            ['Howo A7 371HP', 'Howo A7 420HP', 'Howo T7H 440HP', 'Howo T7H 480HP', 'Howo 6×4 Tipper', 'Howo 8×4 Tipper'],
        'Sitrak (Premium)':        ['Sitrak C7H 440', 'Sitrak C7H 480', 'Sitrak G7H 440', 'Sitrak G7H 520'],
      },
    },

    // ── JAC ───────────────────────────────────────────────────────────────────
    'JAC': {
      series: ['N Series (Light/Medium)', 'K Series (Heavy)'],
      models: {
        'N Series (Light/Medium)': ['N45', 'N56', 'N65', 'N80', 'N120'],
        'K Series (Heavy)':        ['K5 340HP', 'K5 430HP'],
      },
    },

    // ── FOTON ─────────────────────────────────────────────────────────────────
    'Foton': {
      series: ['Aumark (Light/Medium)', 'Auman (Heavy)'],
      models: {
        'Aumark (Light/Medium)':   ['Aumark C120', 'Aumark S', 'Aumark S1', 'Aumark S100'],
        'Auman (Heavy)':           ['Auman TX 420HP', 'Auman TX 460HP', 'Auman GTL 430HP', 'Auman EST-A'],
      },
    },

  },
};

// ── PICKUP TRUCK HIERARCHY (expanded) ─────────────────────────────────────────
export const PICKUP_DATA = {

  brands: [
    'Toyota', 'Ford', 'Isuzu', 'Mitsubishi', 'Nissan', 'Mazda',
    'Volkswagen', 'Mercedes-Benz', 'Renault', 'GWM / Haval', 'Chevrolet',
    'GMC', 'Ram / Dodge', 'JAC', 'Maxus / LDV', 'Foton', 'Mahindra',
    'Tata', 'Peugeot', 'Honda', 'Hyundai', 'Jeep', 'Rivian', 'Tesla',
    'Chery', 'DFSK', 'Other',
  ],

  hierarchy: {
    'Toyota': {
      series: ['Hilux', 'Tacoma', 'Tundra', 'Land Cruiser Pickup'],
      models: {
        'Hilux':                    ['Hilux Single Cab', 'Hilux Extra Cab', 'Hilux Double Cab', 'Hilux Revo Single Cab', 'Hilux Revo Extra Cab', 'Hilux Revo Double Cab', 'Hilux Champ', 'Hilux GR Sport'],
        'Tacoma':                   ['Tacoma SR', 'Tacoma SR5', 'Tacoma TRD Sport', 'Tacoma TRD Off-Road', 'Tacoma TRD Pro', 'Tacoma Limited'],
        'Tundra':                   ['Tundra SR', 'Tundra SR5', 'Tundra Limited', 'Tundra Platinum', 'Tundra 1794', 'Tundra TRD Pro'],
        'Land Cruiser Pickup':      ['LC 79 Single Cab', 'LC 79 Double Cab', 'LC 79 Workmate'],
      },
    },
    'Ford': {
      series: ['Ranger', 'F-150', 'F-Series Super Duty', 'Maverick', 'Courier'],
      models: {
        'Ranger':                   ['Ranger XL', 'Ranger XLS', 'Ranger XLT', 'Ranger Wildtrak', 'Ranger Sport', 'Ranger Raptor', 'Ranger Stormtrak'],
        'F-150':                    ['F-150 Regular Cab', 'F-150 SuperCab', 'F-150 SuperCrew', 'F-150 Raptor', 'F-150 Lightning (EV)', 'F-150 Tremor'],
        'F-Series Super Duty':      ['F-250 Regular Cab', 'F-250 SuperCab', 'F-250 Crew Cab', 'F-350 Regular Cab', 'F-350 SuperCab', 'F-350 Crew Cab', 'F-450'],
        'Maverick':                 ['Maverick XL', 'Maverick XLT', 'Maverick Lariat', 'Maverick Tremor'],
        'Courier':                  ['Courier Standard'],
      },
    },
    'Isuzu': {
      series: ['D-Max'],
      models: {
        'D-Max':                    ['D-Max Single Cab 4×2', 'D-Max Space Cab 4×2', 'D-Max Space Cab 4×4', 'D-Max Double Cab 4×2', 'D-Max Double Cab 4×4', 'D-Max V-Cross 4×4', 'D-Max LS-Terrain'],
      },
    },
    'Mitsubishi': {
      series: ['Triton / L200'],
      models: {
        'Triton / L200':            ['Triton Single Cab', 'Triton Club Cab', 'Triton Double Cab', 'Triton GLS', 'Triton Athlete', 'L200 Club Cab', 'L200 Double Cab'],
      },
    },
    'Nissan': {
      series: ['Navara', 'Frontier', 'Titan', 'NP300'],
      models: {
        'Navara':                   ['Navara Single Cab', 'Navara King Cab', 'Navara Double Cab', 'Navara Pro-4X'],
        'Frontier':                 ['Frontier S', 'Frontier SV', 'Frontier Pro-4X'],
        'Titan':                    ['Titan S', 'Titan SV', 'Titan PRO-4X', 'Titan XD'],
        'NP300':                    ['NP300 Single Cab', 'NP300 King Cab'],
      },
    },
    'Mazda': {
      series: ['BT-50'],
      models: {
        'BT-50':                    ['BT-50 Single Cab', 'BT-50 Freestyle Cab', 'BT-50 Double Cab', 'BT-50 Thunder'],
      },
    },
    'Volkswagen': {
      series: ['Amarok'],
      models: {
        'Amarok':                   ['Amarok Single Cab', 'Amarok Double Cab', 'Amarok V6', 'Amarok PanAmericana', 'Amarok Adventure', 'Amarok Aventura'],
      },
    },
    'Mercedes-Benz': {
      series: ['X-Class'],
      models: {
        'X-Class':                  ['X 220d Pure', 'X 250d Pure', 'X 250d Progressive', 'X 250d Power', 'X 350d Power 4MATIC'],
      },
    },
    'Renault': {
      series: ['Alaskan', 'Oroch'],
      models: {
        'Alaskan':                  ['Alaskan Single Cab', 'Alaskan Double Cab', 'Alaskan Pro-4X'],
        'Oroch':                    ['Oroch Expression', 'Oroch Outsider', 'Oroch Outsider+'],
      },
    },
    'GWM / Haval': {
      series: ['Cannon', 'P Series', 'Steed'],
      models: {
        'Cannon':                   ['Cannon Standard', 'Cannon Luxury', 'Cannon Off-Road'],
        'P Series':                 ['P Series Standard', 'P Series Luxury'],
        'Steed':                    ['Steed Single Cab', 'Steed Double Cab'],
      },
    },
    'Chevrolet': {
      series: ['Colorado', 'Silverado', 'S10'],
      models: {
        'Colorado':                 ['Colorado WT', 'Colorado LT', 'Colorado Z71', 'Colorado ZR2'],
        'Silverado':                ['Silverado 1500 Regular', 'Silverado 1500 Double Cab', 'Silverado 1500 Crew Cab', 'Silverado 2500HD', 'Silverado 3500HD'],
        'S10':                      ['S10 Regular Cab', 'S10 Extended Cab'],
      },
    },
    'GMC': {
      series: ['Canyon', 'Sierra'],
      models: {
        'Canyon':                   ['Canyon Regular', 'Canyon Elevation', 'Canyon AT4', 'Canyon Denali'],
        'Sierra':                   ['Sierra 1500 Regular', 'Sierra 1500 Double Cab', 'Sierra 1500 Crew Cab', 'Sierra 2500HD', 'Sierra 3500HD'],
      },
    },
    'Ram / Dodge': {
      series: ['Ram 1500', 'Ram Heavy Duty', 'Ram Classic'],
      models: {
        'Ram 1500':                 ['Ram 1500 Tradesman', 'Ram 1500 Big Horn', 'Ram 1500 Laramie', 'Ram 1500 Rebel', 'Ram 1500 Longhorn', 'Ram 1500 Limited', 'Ram 1500 TRX'],
        'Ram Heavy Duty':           ['Ram 2500 Tradesman', 'Ram 2500 Big Horn', 'Ram 2500 Laramie', 'Ram 2500 Power Wagon', 'Ram 3500 Tradesman', 'Ram 3500 Laramie'],
        'Ram Classic':              ['Ram 1000', 'Ram 1200'],
      },
    },
    'JAC': {
      series: ['T Series'],
      models: {
        'T Series':                 ['JAC T6', 'JAC T8', 'JAC T8 Pro', 'JAC T9'],
      },
    },
    'Maxus / LDV': {
      series: ['T Series'],
      models: {
        'T Series':                 ['Maxus T60', 'Maxus T70', 'Maxus T90'],
      },
    },
    'Foton': {
      series: ['Tunland'],
      models: {
        'Tunland':                  ['Tunland Single Cab', 'Tunland Double Cab', 'Tunland E Pro'],
      },
    },
    'Mahindra': {
      series: ['Scorpio Pickup', 'Bolero Pickup'],
      models: {
        'Scorpio Pickup':           ['Scorpio Getaway'],
        'Bolero Pickup':            ['Bolero Pik-Up Standard', 'Bolero Pik-Up Plus'],
      },
    },
    'Tata': {
      series: ['Xenon', 'Intra'],
      models: {
        'Xenon':                    ['Xenon 150', 'Xenon XT'],
        'Intra':                    ['Intra V10', 'Intra V20', 'Intra V30'],
      },
    },
    'Peugeot': {
      series: ['Landtrek'],
      models: {
        'Landtrek':                 ['Landtrek Standard', 'Landtrek 4×4'],
      },
    },
    'Honda': {
      series: ['Ridgeline'],
      models: {
        'Ridgeline':                ['Ridgeline Sport', 'Ridgeline RTL', 'Ridgeline RTL-E', 'Ridgeline Black Edition'],
      },
    },
    'Hyundai': {
      series: ['Santa Cruz'],
      models: {
        'Santa Cruz':               ['Santa Cruz SE', 'Santa Cruz SEL', 'Santa Cruz SEL Premium', 'Santa Cruz Limited'],
      },
    },
    'Jeep': {
      series: ['Gladiator'],
      models: {
        'Gladiator':                ['Gladiator Sport', 'Gladiator Willys', 'Gladiator Rubicon', 'Gladiator Mojave'],
      },
    },
    'Rivian': {
      series: ['R1T'],
      models: {
        'R1T':                      ['R1T Adventure', 'R1T Explore', 'R1T Launch Edition'],
      },
    },
    'Tesla': {
      series: ['Cybertruck'],
      models: {
        'Cybertruck':               ['Cybertruck RWD', 'Cybertruck AWD', 'Cybertruck Cyberbeast'],
      },
    },
    'Chery': {
      series: ['Tiggo Pickup'],
      models: { 'Tiggo Pickup': ['Tiggo Pickup Standard', 'Tiggo Pickup 4×4'] },
    },
    'DFSK': {
      series: ['C32'],
      models: { 'C32': ['C32 Standard Cab', 'C32 Double Cab'] },
    },
    'Other': {
      series: ['Other'],
      models: { 'Other': ['Other Pickup Truck'] },
    },
  },
};
