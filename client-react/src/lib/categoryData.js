import { MASTER_SPARE_PARTS } from './autoSparesData';
// ============================================================
//  ADHUB KENYA — Category Attributes Data (Comprehensive Edition)
// ============================================================

export const CATEGORY_ATTRIBUTES = {

  vehicles: {
    level1Label: 'Make',
    level2Label: 'Model',
    hasYear: true,
    data: {
      // ── JAPANESE ─────────────────────────────────────────────
      'Toyota': [
        'Allion','Alphard','Aqua','Avalon','Avensis','Axio','Aygo',
        'Belta','Bb','Brevis','Caldina','Cami','Camry','Carib',
        'Carina','Cavalier','C-HR','Chaser','Corolla','Corolla Cross',
        'Corona','Cressida','Crown','Cresta','Cynos','Dyna',
        'Estima','Esquire','Fielder','FJ Cruiser','Fortuner',
        'Funcargo','Gaia','Granvia','GR86','Harrier','HiAce',
        'HiAce Commuter','HiAce Grand Cabin','HiAce Van','Hilux',
        'Hilux Surf','Ipsum','IST','Ist Spade','Kluger','Lafesta',
        'Land Cruiser 70 Series','Land Cruiser 80 Series',
        'Land Cruiser 100 Series','Land Cruiser 200 Series',
        'Land Cruiser 300 Series','Land Cruiser Prado 90',
        'Land Cruiser Prado 120','Land Cruiser Prado 150',
        'Land Cruiser Prado 250','Lite Ace','Mark II','Mark X',
        'MR2','Nadia','Noah','Opa','Paseo','Porte','Premio',
        'Previa','Prius','Prius Alpha','Probox','RAV4','Raize',
        'Regius','Roomy','Rush','Sienta','Soarer','Solara','Spade',
        'Sprinter','Starlet','Succeed','Supra','Tarago','Tank',
        'Tercel','ToyoAce','Vellfire','Verso','Vista','Vitz',
        'Voltz','Voxy','Wish','Yaris','Yaris Cross','Other Toyota',
      ],
      'Nissan': [
        'AD Van','Almera','Altima','Armada','Avenir','Bluebird',
        'Caravan','Cedric','Cefiro','Civilian','Cube','Datsun',
        'Dayz','Dualis','Elgrand','Expert','Extrai','Frontier',
        'Fuga','Gloria','GT-R','Juke','Lafesta','Largo','Latio',
        'Laurel','Leaf','Livina','Lucino','March','Maxima','Micra',
        'Murano','Navara NP300','Note','NV200','NV350 Caravan',
        'Otti','Pathfinder','Patrol','Prairie','Presage','Primera',
        'Pulsar','Qashqai','Quest','Rasheen','Safari','Serena',
        'Skyline','Stagea','Stanza','Sunny','Sylphy','Teana',
        'Tiida','Titan','Urvan','Wingroad','X-Trail T30',
        'X-Trail T31','X-Trail T32','Xterra','Other Nissan',
      ],
      'Honda': [
        'Accord','Accord Inspire','Airwave','Amaze','Ascot',
        'Avancier','Ballade','Brio','BR-V','City','Civic','CR-V',
        'CR-X','CR-Z','Crossroad','Domani','e (Electric)',
        'Edix','Elysion','Fit','Freed','Freed Spike','HR-V',
        'Inspire','Integra','Jazz','Jade','Legend','Life',
        'Logo','Mobilio','N-Box','N-One','N-WGN','Odyssey',
        'Pilot','Prelude','Ridgeline','S2000','Shuttle',
        'Stepwgn','Stream','That\'s','Today','Toneo','Vezel',
        'WR-V','Zest','Other Honda',
      ],
      'Mazda': [
        'Atenza','Axela','AZ-Wagon','Biante','Bongo','BT-50',
        'Carol','CX-3','CX-30','CX-5','CX-60','CX-7','CX-8',
        'CX-9','Demio','Familia','Laputa','MX-5 (Miata)',
        'Mazda 2','Mazda 3','Mazda 6','Mazda 323','Mazda 626',
        'MPV','Premacy','Proceed','RX-7','RX-8','Scrum',
        'Titan','Tribute','Verisa','Other Mazda',
      ],
      'Mitsubishi': [
        'ASX','Attrage','Carisma','Canter','Challenger',
        'Colt','Delica','Diamante','Eclipse','Eclipse Cross',
        'Endeavor','Expo','FTO','Galant','GTO / 3000GT',
        'Grandis','i-MiEV','L200 Triton','L300','Lancer',
        'Lancer Evolution','Legnum','Montero','Outlander',
        'Outlander PHEV','Pajero','Pajero IO','Pajero Mini',
        'Pajero Sport','Raider','Rosa','RVR','Sigma',
        'Space Runner','Space Star','Space Wagon','Starion',
        'Strada','Toppo','Other Mitsubishi',
      ],
      'Isuzu': [
        'Bighon','D-Max','D-Max V-Cross','ELF NKR','ELF NPR',
        'Elf NMR','Forward FRR','Forward FSR','Forward FVR',
        'Mu-7','MU-X','NQR','Rodeo','Trooper','TF Pickup',
        'Other Isuzu',
      ],
      'Subaru': [
        'Ascent','Baja','BRZ','Crosstrek','Dex','Dias Wagon',
        'Domingo','Exiga','Forester','Impreza','Justy','Legacy',
        'Levorg','Libero','Outback','Pleo','R1','R2','Rex',
        'Sambar','Stella','SVX','Trezia','Tribeca','Vivio',
        'WRX','WRX STI','XV','Other Subaru',
      ],
      'Suzuki': [
        'Alto','APV','Baleno','Carry','Celerio','Cultus',
        'Ertiga','Esteem','Every','Fronte','Grand Vitara',
        'Ignis','Jimny','Kei','Lapin','Landy','Liana',
        'MR Wagon','Palette','S-Cross','Solio','Spacia',
        'Swift','SX4','Vitara','Wagon R','Wagon R Stingray',
        'XL7','Other Suzuki',
      ],
      'Daihatsu': [
        'Atrai','Be-go','Boon','Charade','Copen','Cuore',
        'Delta','Esse','Feroza','Gran Max','Hijet','Materia',
        'Max','Mira','Move','Move Conte','Naked','Pyzar',
        'Rocky','Sirion','Tanto','Terios','Thor','Wake',
        'YRV','Other Daihatsu',
      ],
      'Lexus': [
        'CT200h','ES250','ES300','ES350','GS300','GS350',
        'GS430','GS450h','GS460','GX400','GX460','GX470',
        'IS200','IS250','IS300','IS350','IS500','LC500',
        'LFA','LS400','LS430','LS460','LS500','LX450',
        'LX470','LX570','LX600','NX200t','NX300','NX350',
        'RX270','RX300','RX330','RX350','RX400h','RX450h',
        'RX500h','SC400','SC430','UX200','UX250h','Other Lexus',
      ],
      'Infiniti': [
        'EX35','EX37','FX35','FX37','FX50','G35','G37',
        'JX35','M30','M35','M37','M56','Q30','Q45','Q50',
        'Q60','Q70','QX30','QX50','QX56','QX60','QX70',
        'QX80','Other Infiniti',
      ],
      'Acura': [
        'CL','ILX','Integra','Legend','MDX','NSX','RDX',
        'RL','RLX','RSX','TL','TLX','TSX','ZDX','Other Acura',
      ],

      // ── KOREAN ───────────────────────────────────────────────
      'Hyundai': [
        'Accent','Atos','Azera','Centennial','Cona','Coupe',
        'Creta','Dynasty','Elantra','Entourage','Equus',
        'Excel','Genesis','Getz','Grandeur','H-1 Starex',
        'H100','H200','i10','i20','i30','i40','Ioniq',
        'Ioniq 5','Ioniq 6','Kona','Lantra','Matrix',
        'Palisade','Santa Cruz','Santa Fe','Santamo',
        'Sonata','Staria','Terracan','Tiburon','Trajet',
        'Tucson','Veloster','Veracruz','Other Hyundai',
      ],
      'Kia': [
        'Besta','Cadenza','Carens','Canival','Ceed',
        'Cerato','Clarus','EV6','EV9','Magentis',
        'Mojave','Niro','Opirus','Optima','Pegas','Picanto',
        'Pregio','Pro Ceed','Rio','Seltos','Shuma',
        'Sorento','Soul','Sportage','Stinger','Stonic',
        'Telluride','Venga','Other Kia',
      ],
      'Ssangyong': [
        'Actyon','Actyon Sports','Chairman','Korando',
        'Kyron','Musso','Musso Grand','Rexton','Rexton W',
        'Rodius','Tivoli','Torres','Other Ssangyong',
      ],
      'Daewoo': [
        'Espero','Kalos','Lacetti','Laganza','Lanos',
        'Leganza','Lublin','Magnus','Matiz','Nubira',
        'Racer','Rezzo','Tacuma','Tosca','Other Daewoo',
      ],

      // ── GERMAN ───────────────────────────────────────────────
      'Mercedes-Benz': [
        'A180','A200','A250','A45 AMG',
        'B180','B200',
        'C180','C200','C220','C250','C300','C350','C43 AMG','C63 AMG',
        'CLA 180','CLA 200','CLA 250','CLA 45 AMG',
        'CLS 350','CLS 400','CLS 500','CLS 63 AMG',
        'E200','E220','E250','E300','E350','E400','E500','E43 AMG','E63 AMG',
        'G350','G500','G550','G63 AMG',
        'GLA 180','GLA 200','GLA 250','GLA 45 AMG',
        'GLB 200','GLB 250',
        'GLC 200','GLC 220d','GLC 250','GLC 300','GLC 43 AMG','GLC 63 AMG',
        'GLE 250d','GLE 300d','GLE 350','GLE 400','GLE 450','GLE 53 AMG','GLE 63 AMG',
        'GLS 400','GLS 450','GLS 500','GLS 580','GLS 63 AMG',
        'ML 250','ML 320','ML 350','ML 400','ML 500','ML 63 AMG',
        'S320','S350','S400','S450','S500','S550','S560','S600','S63 AMG','S65 AMG','Maybach S-Class',
        'SL 400','SL 500','SL 63 AMG',
        'SLK 200','SLK 250','SLK 350',
        'V220d','V250d','V300d',
        'Vito','Sprinter',
        'EQA','EQB','EQC','EQE','EQS',
        'AMG GT',
        'Other Mercedes-Benz',
      ],
      'BMW': [
        '116i','118i','120i','125i','135i',
        '316i','318i','320i','320d','325i','328i','330i','335i','340i','M3',
        '420i','428i','430i','435i','440i','M4',
        '520i','520d','523i','525i','528i','530i','535i','540i','550i','M5',
        '730i','740i','745i','750i','760i',
        '840i','850i','M8',
        'X1','X2','X3','X4','X5','X6','X7',
        'X3 M','X4 M','X5 M','X6 M',
        'i3','i4','i5','i7','iX','iX3',
        'Z3','Z4',
        'Other BMW',
      ],
      'Volkswagen': [
        'Amarok','Arteon','Beetle','Bora','Caddy','Califonia',
        'Caravelle','Crafter','Fox','Golf','Golf GTI',
        'Golf R','ID.3','ID.4','Jetta','Lupo','Multivan',
        'Passat','Phaeton','Polo','Scirocco','Sharan',
        'T-Cross','T-Roc','Tiguan','Tiguan Allspace',
        'Touareg','Touran','Transporter','Up','Other VW',
      ],
      'Audi': [
        'A1','A2','A3','A3 Sportback','A4','A4 Allroad',
        'A4 Avant','A5','A6','A6 Allroad','A7','A8',
        'e-tron','e-tron GT','Q2','Q3','Q5','Q5 Sportback',
        'Q7','Q8','R8','RS3','RS4','RS5','RS6','RS7',
        'S3','S4','S5','S6','S7','S8','SQ5','SQ7',
        'SQ8','TT','TTS','TT RS','Other Audi',
      ],
      'Opel / Vauxhall': [
        'Adam','Agila','Antara','Astra','Cascada','Combo',
        'Corsa','Crossland','Frontera','Grandland',
        'Insignia','Kadett','Meriva','Mokka','Monterey',
        'Movano','Omega','Signum','Sintra','Vectra',
        'Vivaro','Zafira','Other Opel',
      ],
      'Porsche': [
        '718 Boxster','718 Cayman','911 Carrera','911 GT3',
        '911 Turbo','Cayenne','Cayenne Coupe','Macan',
        'Panamera','Taycan','Other Porsche',
      ],

      // ── BRITISH ──────────────────────────────────────────────
      'Land Rover': [
        'Defender 90','Defender 110','Defender 130',
        'Discovery 1','Discovery 2','Discovery 3',
        'Discovery 4','Discovery 5','Discovery Sport',
        'Freelander 1','Freelander 2','Range Rover Classic',
        'Range Rover P38','Range Rover L322','Range Rover L405',
        'Range Rover Sport L320','Range Rover Sport L494',
        'Range Rover Evoque','Range Rover Velar','Other Land Rover',
      ],
      'Jaguar': [
        'E-Pace','F-Pace','F-Type','I-Pace','S-Type',
        'X-Type','XE','XF','XJ','XK','Other Jaguar',
      ],
      'Mini': [
        'Cooper','Cooper S','Cooper SE','Convertible',
        'Clubman','Clubvan','Countryman','Coupe',
        'Paceman','Roadster','One','Other Mini',
      ],

      // ── FRENCH ───────────────────────────────────────────────
      'Peugeot': [
        '107','108','205','206','207','208','307','308',
        '406','407','508','1007','2008','3008','4007',
        '4008','5008','Boxer','Expert','Partner',
        'RCZ','Traveller','Other Peugeot',
      ],
      'Renault': [
        'Arkana','Austral','Captur','Clio','Espace',
        'Fluence','Kadjar','Kangoo','Koleos','Laguna',
        'Master','Megane','Modus','Safrane','Sandero',
        'Scenic','Symbol','Trafic','Twizy','Zoe',
        'Other Renault',
      ],
      'Citroën': [
        'Berlingo','C1','C2','C3','C3 Aircross','C4',
        'C4 Cactus','C4 Picasso','C5','C5 Aircross',
        'C8','Dispatch','DS3','DS4','DS5','Jumpy',
        'Relay','Saxo','Xantia','Xsara','ZX','Other Citroën',
      ],

      // ── ITALIAN ──────────────────────────────────────────────
      'Fiat': [
        '124 Spider','127','128','500','500L','500X',
        'Barchetta','Bravo','Cinquecento','Doblo',
        'Ducato','Fiorino','Freemont','Grande Punto',
        'Idea','Linea','Multipla','Panda','Punto',
        'Qubo','Scudo','Sedici','Seicento','Stilo',
        'Tipo','Ulysse','Other Fiat',
      ],
      'Alfa Romeo': [
        '145','146','147','155','156','159','164',
        '166','Brera','Crosswagon','GTV','Giulia',
        'Giulietta','GT','GTA','MiTo','Spider',
        'Stelvio','Tonale','Other Alfa Romeo',
      ],
      'Maserati': [
        'Ghibli','Grancabrio','GranTurismo','Grecale',
        'Levante','MC20','Quattroporte','Other Maserati',
      ],

      // ── AMERICAN ─────────────────────────────────────────────
      'Ford': [
        'B-Max','Bronco','C-Max','Cougar','Edge','Escape',
        'Everest','EcoSport','Explorer','Expedition',
        'F-150','F-250','F-350','Fiesta','Five Hundred',
        'Flex','Focus','Fusion','Galaxy','Ka','Kuga',
        'Maverick','Mondeo','Mustang','Mustang Mach-E',
        'Puma','Ranger','S-Max','Taurus','Thunderbird',
        'Touneo Connect','Touneo Custom','Transit',
        'Transit Connect','Transit Custom','Territory',
        'Other Ford',
      ],
      'Chevrolet / GMC': [
        'Astro','Avalanche','Aveo','Blazer','Captiva',
        'Colorado','Cruze','Epica','Equinox','Express Van',
        'Kalos','Lacetti','Lumina','Malibu','Niva',
        'Orlando','S10','Silverado','Sonic','Spark',
        'Suburban','Tahoe','Terrain','Trailblazer',
        'Traverse','Trax','Uplander','Yukon','Other GM',
      ],
      'Dodge': [
        'Avenger','Caliber','Caravan','Challenger',
        'Charger','Dakota','Durango','Grand Caravan',
        'Jouney','Neon','Nitro','RAM 1500','RAM 2500',
        'Stratus','Viper','Other Dodge',
      ],
      'Chrysler': [
        '200','300','300C','300M','Aspen','Crossfire',
        'Grand Voyager','LeBaron','Neon','Pacifica',
        'PT Cruiser','Sebring','Town & Country','Voyager',
        'Other Chrysler',
      ],
      'Jeep': [
        'Cherokee','Commander','Compass','Gladiator',
        'Grand Cherokee','Grand Cherokee L','Grand Wagoneer',
        'Liberty','Patriot','Renegade','Wrangler','Other Jeep',
      ],
      'Cadillac': [
        'ATS','CT4','CT5','CT6','CTS','DeVille',
        'DTS','Eldorado','Escalade','LYRIQ','SRX',
        'STS','XLR','XT4','XT5','XT6','Other Cadillac',
      ],
      'Buick': [
        'Enclave','Encore','Encore GX','Envision','LaCrosse',
        'LeSabre','Park Avenue','Rainier','Regal','Rendezvous',
        'Riviera','Terraza','Verano','Other Buick',
      ],
      'Lincoln': [
        'Aviator','Continental','Corsair','MKC','MKS',
        'MKT','MKX','MKZ','Navigator','Town Car','Zephyr',
        'Other Lincoln',
      ],
      'Hummer': ['H1','H2','H3','H3T','Other Hummer'],

      // ── SWEDISH ──────────────────────────────────────────────
      'Volvo': [
        'C30','C40','C70','EX30','EX90','S40','S60',
        'S70','S80','S90','V40','V50','V60','V70',
        'V90','XC40','XC60','XC70','XC90','Other Volvo',
      ],
      'Saab': [
        '9-2X','9-3','9-3X','9-5','9-7X','900','9000',
        'Other Saab',
      ],

      // ── SPANISH / CZECH ──────────────────────────────────────
      'SEAT': [
        'Alhambra','Altea','Arona','Ateca','Cordoba',
        'Exeo','Ibiza','Leon','Mii','Tarraco','Toledo',
        'Other SEAT',
      ],
      'Skoda': [
        'Citigo','Enyaq','Fabia','Kamiq','Karoq',
        'Kodiaq','Octavia','Rapid','Roomster','Scala',
        'Superb','Yeti','Other Skoda',
      ],
      'Dacia': [
        'Duster','Jogger','Lodgy','Logan','Sandero',
        'Spring','Dokker','Other Dacia',
      ],

      // ── ELECTRIC / NEW ENERGY ────────────────────────────────
      'Tesla': [
        'Cybertruck','Model 3','Model S','Model X',
        'Model Y','Roadster','Semi','Other Tesla',
      ],
      'BYD': [
        'Atto 3','Dolphin','Han','Seal','Song','Tang',
        'Qin','Yuan Plus','Destroyer 05','Other BYD',
      ],
      'MG / Morris Garages': [
        'MG 4','MG 5','MG 6','MG GS','MG HS','MG RX5',
        'MG ZS','MG ZS EV','Marvel R','Other MG',
      ],

      // ── CHINESE ──────────────────────────────────────────────
      'Chery': [
        'Arrizo 5','Arrizo 6','Arrizo 8','Exeed TX',
        'Exeed TXL','Tiggo 4','Tiggo 4 Pro','Tiggo 5x',
        'Tiggo 7','Tiggo 7 Pro','Tiggo 8','Tiggo 8 Pro',
        'Other Chery',
      ],
      'GWM / Haval': [
        'Haval H1','Haval H2','Haval H6','Haval H6 GT',
        'Haval H9','GWM P Series','GWM Steed',
        'Wey Coffee 01','Wey Coffee 02','Other GWM',
      ],
      'JAC': [
        'JAC J7','JAC S3','JAC S4','JAC S5','JAC T6',
        'JAC T8 Pro','JAC Refine A60','Other JAC',
      ],
      'Geely': [
        'Azkarra','Coolray','Emgrand','GX3 Pro','Okavango',
        'Tugella','Vision X3','Other Geely',
      ],

      // ── INDIAN / OTHER ASIAN ─────────────────────────────────
      'Mahindra': [
        'Bolero','KUV100','Marazzo','Pik-Up','Scorpio',
        'Scorpio-N','Thar','TUV300','XUV300','XUV400',
        'XUV500','XUV700','Other Mahindra',
      ],
      'Tata': [
        'Harrier','Hexa','Indica','Indigo','Nano',
        'Nexon','Punch','Safari','Sierra','Sumo',
        'Telcoline','Tigor','Xenon XT','Zest','Other Tata',
      ],
      'Proton': [
        'Gen-2','Inspira','Iriz','Perdana','Persona',
        'Preve','Saga','Satria','Waja','Wira','X50',
        'X70','Other Proton',
      ],

      // ── MOTORCYCLES & 3-WHEELERS ─────────────────────────────
      'Bajaj': [
        'Avenger 150','Avenger 220','Boxer 150','CT100',
        'Discover 100','Discover 125','Platina 100',
        'Pulsar 135','Pulsar 150','Pulsar 180','Pulsar 220',
        'Pulsar NS200','RE (Auto Rickshaw)','Boxer CT100',
        'Other Bajaj',
      ],
      'TVS': [
        'Apache RTR 160','Apache RTR 180','Apache RTR 200',
        'HLX 125','HLX 150','King Deluxe (3-Wheeler)',
        'Metro ES','Neo 110','Ntorq 125','Star City 125',
        'StaR HLX 100','Victor','XL100 (SuperHeavy Load)',
        'Other TVS',
      ],
      'Hero': [
        'Glamour','HF 100','HF Deluxe','Hunk','Ignitor',
        'Maestro Edge','Passion','Pleasure','Splendor',
        'Xtreme','Other Hero',
      ],
      'Yamaha': [
        'Fazer FZ','FZ 16','NMAX','R15','Ray ZR',
        'Saluto','SZ-RR','YBR','Other Yamaha',
      ],
      'Other Motorcycle': [
        'Lifan','Loncin','Haojue','Dayun','Other Brand',
      ],
      'Other / Unspecified': ['Other Make & Model'],
    },
  },

  'auto-spares': {
    'level1Label': 'System',
    'level2Label': 'Part',
    'hasYear': false,
    'data': MASTER_SPARE_PARTS
  },

  'phones-tablets': {
    level1Label: 'Category',
    level2Label: 'Brand',
    hasYear: false,
    data: {
      'Mobile Phones': {
        'Samsung': [
          'Galaxy S','Galaxy S II','Galaxy S III','Galaxy S4','Galaxy S5','Galaxy S5 Mini',
          'Galaxy S5 Active','Galaxy S5 Neo','Galaxy S6','Galaxy S6 Edge','Galaxy S6 Edge+',
          'Galaxy S7','Galaxy S7 Edge','Galaxy S8','Galaxy S8+','Galaxy S8 Active','Galaxy S9',
          'Galaxy S9+','Galaxy S10e','Galaxy S10','Galaxy S10+','Galaxy S10 5G','Galaxy S20',
          'Galaxy S20+','Galaxy S20 Ultra','Galaxy S20 FE','Galaxy S21','Galaxy S21+',
          'Galaxy S21 Ultra','Galaxy S21 FE','Galaxy S22','Galaxy S22+','Galaxy S22 Ultra',
          'Galaxy S23','Galaxy S23+','Galaxy S23 Ultra','Galaxy S23 FE','Galaxy S24','Galaxy S24+',
          'Galaxy S24 Ultra','Galaxy S24 FE','Galaxy S25','Galaxy S25+','Galaxy S25 Ultra',
          'Galaxy S25 Edge','Galaxy S25 FE','Galaxy S26','Galaxy S26+','Galaxy S26 Ultra',
          'Galaxy Note','Galaxy Note II','Galaxy Note 3','Galaxy Note 4','Galaxy Note Edge',
          'Galaxy Note 5','Galaxy Note 7','Galaxy Note FE','Galaxy Note 8','Galaxy Note 9',
          'Galaxy Note 10','Galaxy Note 10+','Galaxy Note 10 Lite','Galaxy Note 20',
          'Galaxy Note 20 Ultra','Galaxy Fold','Galaxy Z Fold 2','Galaxy Z Fold 3','Galaxy Z Fold 4',
          'Galaxy Z Fold 5','Galaxy Z Fold 6','Galaxy Z Fold 7','Galaxy Z Flip','Galaxy Z Flip 3',
          'Galaxy Z Flip 4','Galaxy Z Flip 5','Galaxy Z Flip 6','Galaxy Z Flip 7','Galaxy A01',
          'Galaxy A02','Galaxy A02s','Galaxy A03','Galaxy A03 Core','Galaxy A03s','Galaxy A04',
          'Galaxy A04e','Galaxy A04s','Galaxy A05','Galaxy A05s','Galaxy A06','Galaxy A07',
          'Galaxy A10','Galaxy A11','Galaxy A12','Galaxy A13','Galaxy A14','Galaxy A15','Galaxy A16',
          'Galaxy A17','Galaxy A20','Galaxy A20e','Galaxy A21','Galaxy A21s','Galaxy A22',
          'Galaxy A23','Galaxy A24','Galaxy A25','Galaxy A26','Galaxy A27','Galaxy A30',
          'Galaxy A30s','Galaxy A31','Galaxy A32','Galaxy A33','Galaxy A34','Galaxy A35',
          'Galaxy A36','Galaxy A37','Galaxy A50','Galaxy A50s','Galaxy A51','Galaxy A52',
          'Galaxy A52s','Galaxy A53','Galaxy A54','Galaxy A55','Galaxy A56','Galaxy A57',
          'Galaxy A70','Galaxy A70s','Galaxy A71','Galaxy A72','Galaxy A73','Galaxy M01',
          'Galaxy M02','Galaxy M03','Galaxy M04','Galaxy M05','Galaxy M10','Galaxy M11','Galaxy M12',
          'Galaxy M13','Galaxy M14','Galaxy M15','Galaxy M20','Galaxy M21','Galaxy M22','Galaxy M23',
          'Galaxy M30','Galaxy M31','Galaxy M32','Galaxy M33','Galaxy M34','Galaxy M35','Galaxy M51',
          'Galaxy M52','Galaxy M53','Galaxy M54','Galaxy M55','Galaxy M56','Galaxy F02','Galaxy F04',
          'Galaxy F05','Galaxy F06','Galaxy F12','Galaxy F13','Galaxy F14','Galaxy F15','Galaxy F22',
          'Galaxy F23','Galaxy F34','Galaxy F41','Galaxy F42','Galaxy F54','Galaxy F55','Galaxy F56',
          'Galaxy J1','Galaxy J2','Galaxy J3','Galaxy J4','Galaxy J5','Galaxy J6','Galaxy J7',
          'Galaxy J8','Galaxy Ace','Galaxy Ace 2','Galaxy Core','Galaxy Core Prime','Galaxy Grand',
          'Galaxy Grand Prime','Galaxy Young','Galaxy Star','Galaxy V','Galaxy Express','Galaxy Win',
          'Galaxy XCover series'
        ],
        'Tecno': [
          'Spark','Spark 2','Spark 3','Spark 3 Pro','Spark 4','Spark 4 Air','Spark 4 Lite','Spark 5',
          'Spark 5 Air','Spark 5 Pro','Spark 6','Spark 6 Air','Spark 6 Go','Spark 7','Spark 7 Pro',
          'Spark 7P','Spark 8','Spark 8C','Spark 8P','Spark 8 Pro','Spark 9','Spark 9T',
          'Spark 9 Pro','Spark 10','Spark 10 5G','Spark 10C','Spark 10 Pro','Spark Go (2023)',
          'Spark Go (2024)','Spark Go 1','Spark Go 2','Spark Go 3','Spark Go 5G','Spark 20',
          'Spark 20C','Spark 20 Pro','Spark 20 Pro+','Spark 20 Pro 5G','Spark 30','Spark 30C',
          'Spark 30C 5G','Spark 30 Pro','Spark 40','Spark 40 Pro','Spark 40 Pro+','Spark 50',
          'Spark 50 4G','Spark 50 5G','Camon C5','Camon C7','Camon CX','Camon CX Air','Camon CM',
          'Camon X','Camon X Pro','Camon 11','Camon 11 Pro','Camon 12','Camon 12 Air','Camon 12 Pro',
          'Camon 15','Camon 15 Air','Camon 15 Premier','Camon 16','Camon 16 Premier','Camon 16 Pro',
          'Camon 17','Camon 17 Pro','Camon 18','Camon 18 Premier','Camon 19','Camon 19 Pro',
          'Camon 19 Pro 5G','Camon 20','Camon 20 Pro','Camon 20 Pro 5G','Camon 20 Premier 5G',
          'Camon 30','Camon 30 5G','Camon 30 Pro 5G','Camon 30 Premier 5G','Camon 30S',
          'Camon 30S Pro','Camon 40','Camon 40 Pro','Camon 40 Premier 5G','Camon 50','Camon 50 Pro',
          'Camon 50 Ultra 5G','Phantom A','Phantom A+','Phantom Z','Phantom 5','Phantom 6',
          'Phantom 6 Plus','Phantom 8','Phantom X','Phantom X2','Phantom X2 Pro','Phantom V Fold',
          'Phantom V Fold 2 5G','Phantom V Flip','Phantom V Flip 2 5G','Pova','Pova 2','Pova Neo',
          'Pova Neo 2','Pova Neo 3','Pova 3','Pova 4','Pova 4 Pro','Pova 5','Pova 5 Pro','Pova 6',
          'Pova 6 Neo','Pova 6 Pro 5G','Pova Curve 5G','Pova Curve 2 5G','Pova 7 5G','Pova 7 Pro 5G',
          'Pop 1','Pop 2','Pop 2F','Pop 2 Plus','Pop 3','Pop 4','Pop 5','Pop 5 Go','Pop 5 LTE',
          'Pop 6','Pop 7','Pop 7 Pro','Pop 8','Pop 9 4G','Pop 9 5G','Pop X','Pouvoir 1','Pouvoir 2',
          'Pouvoir 3','Pouvoir 4','DroiPad series','Megapad 10'
        ],
        'Huawei': [
          'Ascend P1','Ascend P1 XL','Ascend P1 LTE','Ascend P1 S','Ascend P2','Ascend P6',
          'Ascend P6 S','Ascend P7','Ascend P7 Mini','Ascend D1','Ascend D1 XL','Ascend D Quad',
          'Ascend D Quad XL','Ascend D2','Ascend G300','Ascend G312','Ascend G330','Ascend G350',
          'Ascend G510','Ascend G525','Ascend G526','Ascend G535','Ascend G600','Ascend G615',
          'Ascend G620','Ascend G628','Ascend G630','Ascend G700','Ascend G730','Ascend G740',
          'Ascend Y201','Ascend Y210','Ascend Y220','Ascend Y221','Ascend Y300','Ascend Y320',
          'Ascend Y330','Ascend Y520','Ascend Y530','Ascend Y540','Ascend Mate','Ascend Mate 2',
          'Ascend Mate 7','Ascend W1','Ascend W2','P8','P8 Lite','P8 Max','P9','P9 Lite','P9 Plus',
          'P10','P10 Lite','P10 Plus','P20','P20 Lite','P20 Pro','P30','P30 Lite','P30 Pro','P40',
          'P40 Lite','P40 Pro','P40 Pro+','P50','P50 Pro','P60','P60 Pro','Pura 70','Pura 70 Pro',
          'Pura 70 Pro+','Pura 70 Ultra','Pura 80','Pura 80 Pro','Pura 80 Pro+','Pura 80 Ultra',
          'Mate S','Mate 8','Mate 9','Mate 9 Pro','Mate 10','Mate 10 Pro','Mate 10 Porsche Design',
          'Mate 20','Mate 20 Lite','Mate 20 Pro','Mate 20 X','Mate 20 RS Porsche Design','Mate 30',
          'Mate 30 Pro','Mate 30 RS Porsche Design','Mate 40','Mate 40 Pro','Mate 40 Pro+',
          'Mate 40 RS Porsche Design','Mate 50','Mate 50 Pro','Mate 50 RS Porsche Design','Mate 60',
          'Mate 60 Pro','Mate 60 Pro+','Mate 60 RS Ultimate Design','Mate 70','Mate 70 Pro',
          'Mate 70 Pro+','Mate 70 RS','Mate X','Mate X2','Mate X3','Mate X5','Mate X6','Mate X7',
          'Mate XT Ultimate Design','Nova','Nova 2','Nova 2 Plus','Nova 2i','Nova 3','Nova 3i',
          'Nova 4','Nova 4e','Nova 5','Nova 5T','Nova 6','Nova 7','Nova 8','Nova 9','Nova 10',
          'Nova 10 Pro','Nova 11','Nova 11 Pro','Nova 12','Nova 12 Pro','Nova 13','Nova 13 Pro',
          'Nova 14','Nova 14 Pro','Nova 15','Nova 15 Pro','Nova 15 Max','Y3','Y3 II','Y5','Y5 II',
          'Y5 Lite','Y5 Prime','Y6','Y6 Pro','Y6 Prime','Y7','Y7 Prime','Y7 Pro','Y9','Y9 Prime',
          'Y9s','Y Max','Enjoy 5','Enjoy 5s','Enjoy 6','Enjoy 7','Enjoy 8','Enjoy 9','Enjoy 10',
          'Enjoy 20','Enjoy 50','Enjoy 60','Enjoy 70','Enjoy 90','Nexus 6P','G7 Plus','G8','SnapTo',
          'Summit','Honor'
        ],
        'Infinix': [
          'Zero','Zero 2','Zero 3','Zero 4','Zero 4 Plus','Zero 5','Zero 5 Pro','Zero 6',
          'Zero 6 Pro','Zero 8','Zero 8i','Zero 9','Zero X','Zero X Neo','Zero X Pro','Zero 5G',
          'Zero 5G 2023','Zero Ultra','Zero 30','Zero 30 5G','Zero 40','Zero 40 5G','Zero Flip',
          'Note','Hot Note','Note 2','Note 3','Note 3 Pro','Note 4','Note 4 Pro','Note 5',
          'Note 5 Stylus','Note 6','Note 7','Note 7 Lite','Note 8','Note 8i','Note 9','Note 10',
          'Note 10 Pro','Note 11','Note 11 Pro','Note 11 Pro NFC','Note 12','Note 12 Pro',
          'Note 12 VIP','Note 30','Note 30 5G','Note 30 Pro','Note 30 VIP','Note 40','Note 40 Pro',
          'Note 40 Pro+','Note 50','Note 50 Pro','Note 60','Note 60 Pro','Note 60 Ultra','Hot',
          'Hot 3','Hot 4','Hot 4 Pro','Hot 5','Hot 5 Lite','Hot 6','Hot 6 Pro','Hot 6X','Hot 7',
          'Hot 7 Pro','Hot 8','Hot 9','Hot 9 Play','Hot 10','Hot 10 Lite','Hot 10 Play','Hot 10S',
          'Hot 11','Hot 11 Play','Hot 12','Hot 12 Play','Hot 12i','Hot 20','Hot 20i','Hot 20 Play',
          'Hot 20 5G','Hot 30','Hot 30i','Hot 30 Play','Hot 30 5G','Hot 40','Hot 40i','Hot 40 Pro',
          'Hot 50','Hot 50i','Hot 50 Pro','Hot 50 Pro+','Hot 60','Hot 60i','Hot 60 Pro','Hot 70',
          'Smart','Smart 2','Smart 2 HD','Smart 2 Pro','Smart 3','Smart 3 Plus','Smart 4','Smart 5',
          'Smart 5 Pro','Smart 6','Smart 6 HD','Smart 7','Smart 7 HD','Smart 8','Smart 9','Smart 10',
          'Smart 20','GT 10 Pro','GT 20 Pro','GT 30 Pro','GT 50 Pro','S2','S2 Pro','S3','S3X','S4',
          'S5','S5 Pro','S5 Lite','S6','XBand series','XPAD'
        ],
        'Xiaomi': [
          'Xiaomi Mi 1','Xiaomi Mi 1S','Xiaomi Mi 2','Xiaomi Mi 2S','Xiaomi Mi 3','Xiaomi Mi 4',
          'Xiaomi Mi 4i','Xiaomi Mi 4c','Xiaomi Mi 5','Xiaomi Mi 5s','Xiaomi Mi 5s Plus',
          'Xiaomi Mi 6','Xiaomi Mi 8','Xiaomi Mi 8 SE','Xiaomi Mi 9','Xiaomi Mi 9 SE',
          'Xiaomi Mi 9 Lite','Xiaomi Mi 9T','Xiaomi Mi 9T Pro','Xiaomi Mi 10','Xiaomi Mi 10 Pro',
          'Xiaomi Mi 10 Lite','Xiaomi Mi 10T','Xiaomi Mi 10T Pro','Xiaomi Mi 11','Xiaomi Mi 11 Lite',
          'Xiaomi Mi 11 Lite 5G','Xiaomi Mi 11 Pro','Xiaomi Mi 11 Ultra','Xiaomi 11T',
          'Xiaomi 11T Pro','Xiaomi 12','Xiaomi 12X','Xiaomi 12 Pro','Xiaomi 12T','Xiaomi 12T Pro',
          'Xiaomi 13','Xiaomi 13 Pro','Xiaomi 13 Lite','Xiaomi 13T','Xiaomi 13T Pro','Xiaomi 14',
          'Xiaomi 14 Pro','Xiaomi 14 Ultra','Xiaomi 14T','Xiaomi 14T Pro','Xiaomi 15',
          'Xiaomi 15 Pro','Xiaomi 15 Ultra','Xiaomi 15T','Xiaomi 15T Pro','Redmi 1','Redmi 1S',
          'Redmi 2','Redmi 3','Redmi 4','Redmi 5','Redmi 6','Redmi 7','Redmi 8','Redmi 9','Redmi 10',
          'Redmi 11','Redmi 12','Redmi 13','Redmi 14','Redmi 15','Redmi Note','Redmi Note 2',
          'Redmi Note 3','Redmi Note 4','Redmi Note 5','Redmi Note 6 Pro','Redmi Note 7',
          'Redmi Note 7 Pro','Redmi Note 8','Redmi Note 8 Pro','Redmi Note 9','Redmi Note 9 Pro',
          'Redmi Note 10','Redmi Note 10 Pro','Redmi Note 10 Pro Max','Redmi Note 11',
          'Redmi Note 11 Pro','Redmi Note 11 Pro+','Redmi Note 12','Redmi Note 12 Pro',
          'Redmi Note 12 Pro+','Redmi Note 13','Redmi Note 13 Pro','Redmi Note 13 Pro+',
          'Redmi Note 14','Redmi Note 14 Pro','Redmi Note 14 Pro+','Redmi Note 15',
          'Redmi Note 15 Pro','Redmi Note 15 Pro+','Redmi K20','Redmi K20 Pro','Redmi K30',
          'Redmi K30 Pro','Redmi K40','Redmi K40 Pro','Redmi K40 Pro+','Redmi K50','Redmi K50 Pro',
          'Redmi K50 Gaming','Redmi K60','Redmi K60 Pro','Redmi K70','Redmi K70 Pro','Redmi K80',
          'Redmi K80 Pro','Redmi A1','Redmi A1+','Redmi A2','Redmi A2+','Redmi A3','Redmi A3x',
          'Redmi A4','Redmi A5','POCO F1','POCO F2 Pro','POCO F3','POCO F4','POCO F5','POCO F6',
          'POCO F7','POCO F8','POCO X2','POCO X3 NFC','POCO X3 Pro','POCO X4 Pro','POCO X5',
          'POCO X5 Pro','POCO X6','POCO X6 Pro','POCO X7','POCO X8','POCO M2','POCO M2 Pro',
          'POCO M3','POCO M4','POCO M4 Pro','POCO M5','POCO M6','POCO M7','POCO C31','POCO C40',
          'POCO C50','POCO C51','POCO C55','POCO C65','POCO C75','POCO C85','Xiaomi Mi MIX',
          'Xiaomi Mi MIX 2','Xiaomi Mi MIX 2S','Xiaomi Mi MIX 3','Xiaomi MIX 4','Xiaomi MIX Fold',
          'Xiaomi MIX Fold 2','Xiaomi MIX Fold 3','Xiaomi MIX Flip','Xiaomi Civi','Xiaomi Civi 1S',
          'Xiaomi Civi 2','Xiaomi Civi 3','Xiaomi Civi 4','Xiaomi Mi Note','Xiaomi Mi Note Pro',
          'Xiaomi Mi Max','Xiaomi Mi Max 2','Xiaomi Mi Max 3','Xiaomi Mi A1','Xiaomi Mi A2',
          'Xiaomi Mi A3'
        ],
        'Apple': [
          'iPhone (1st generation)','iPhone 3G','iPhone 3GS','iPhone 4','iPhone 4S','iPhone 5',
          'iPhone 5c','iPhone 5s','iPhone 6','iPhone 6 Plus','iPhone 6s','iPhone 6s Plus',
          'iPhone SE (1st generation)','iPhone 7','iPhone 7 Plus','iPhone 8','iPhone 8 Plus',
          'iPhone X','iPhone XS','iPhone XS Max','iPhone XR','iPhone 11','iPhone 11 Pro',
          'iPhone 11 Pro Max','iPhone SE (2nd generation)','iPhone 12 mini','iPhone 12',
          'iPhone 12 Pro','iPhone 12 Pro Max','iPhone 13 mini','iPhone 13','iPhone 13 Pro',
          'iPhone 13 Pro Max','iPhone SE (3rd generation)','iPhone 14','iPhone 14 Plus',
          'iPhone 14 Pro','iPhone 14 Pro Max','iPhone 15','iPhone 15 Plus','iPhone 15 Pro',
          'iPhone 15 Pro Max','iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max',
          'iPhone 16e','iPhone 17','iPhone 17 Air','iPhone 17 Pro','iPhone 17 Pro Max','iPhone 17e'
        ],
        'OnePlus': [
          'One','2','X','3','3T','5','5T','6','6T','6T McLaren Edition','7','7 Pro','7 Pro 5G','7T',
          '7T Pro','7T Pro 5G McLaren Edition','8','8 Pro','8 5G UW (Verizon)','8T',
          '8T Cyberpunk 2077 Edition','9','9 Pro','9R','9RT','9 Pro LE','10 Pro','10T','10R',
          '10R 150W','11','11R','12','12R','12R Genshin Impact Edition','13','13R','13T','13 Pro',
          '13 Ultra','15','15R','15T','Nord','Nord CE','Nord CE 2','Nord CE 2 Lite','Nord CE 3',
          'Nord CE 3 Lite','Nord CE 4','Nord CE 4 Lite','Nord CE 5','Nord 2','Nord 2T','Nord 3',
          'Nord 4','Nord 5','Nord 6','Nord N10 5G','Nord N100','Nord N200 5G','Nord N20 5G',
          'Nord N20 SE','Nord N30 5G','Nord N30 SE','Nord N40','Open','Open 2','Ace','Ace 2',
          'Ace 2 Pro','Ace 2V','Ace 3','Ace 3 Pro','Ace 3V','Ace 5','Ace 5 Pro'
        ],
        'Vivo': [
          'X1','X1S','X3','X3S','X5','X5 Max','X5 Pro','X5 Plus','X6','X6 Plus','X6S','X6S Plus',
          'X7','X7 Plus','X9','X9 Plus','X9s','X9s Plus','X20','X20 Plus','X21','X21 UD','X23','X27',
          'X30','X30 Pro','X50','X50 Pro','X50 Pro+','X60','X60 Pro','X60 Pro+','X70','X70 Pro',
          'X70 Pro+','X80','X80 Pro','X90','X90 Pro','X90 Pro+','X100','X100 Pro','X100 Pro+','X200',
          'X200 Pro','X200 Ultra','X200 FE','X300','X300 Pro','X300 Ultra','V1','V1 Max','V3',
          'V3Max','V5','V5 Plus','V5s','V7','V7+','V9','V9 Youth','V11','V11 Pro','V15','V15 Pro',
          'V17','V17 Pro','V19','V20','V20 SE','V21','V21e','V23','V23e','V25','V25 Pro','V27',
          'V27 Pro','V29','V29 Pro','V30','V30 Pro','V30e','V40','V40 Pro','V40e','V50','V50 Lite',
          'V50e','V60','V60 Lite','V70','V70 FE','V70 Elite','Y1','Y3','Y5','Y11','Y12','Y15','Y15s',
          'Y17','Y18','Y19','Y20','Y20s','Y21','Y21s','Y22','Y27','Y28','Y29','Y30','Y31','Y31d',
          'Y33','Y33s','Y35','Y36','Y37','Y38','Y39','Y50','Y51','Y53','Y55','Y55s','Y56','Y58',
          'Y66','Y67','Y69','Y70','Y71','Y72','Y73','Y74','Y75','Y76','Y77','Y78','Y79','Y80','Y81',
          'Y83','Y85','Y90','Y91','Y93','Y95','Y97','Y100','Y100A','Y200','Y200e','Y200 Pro',
          'Y200 GT','Y200i','Y300 series','T1','T1x','T2','T2x','T2 Pro','T3','T3x','T3 Pro',
          'T3 Ultra','T4','T4x','T4 Pro','T4 Ultra','T5 Pro','S1','S1 Pro','S5','S6','S7','S7e','S9',
          'S10','S10 Pro','S12','S12 Pro','S15','S15 Pro','S16','S16 Pro','S17','S17 Pro','S18',
          'S18 Pro','S19','S20','S30','S50','iQOO','iQOO Pro','iQOO 3','iQOO 5','iQOO 7','iQOO 9',
          'iQOO 11','iQOO 12','iQOO 13','iQOO 15','iQOO Neo 3','iQOO Neo 5','iQOO Neo 6',
          'iQOO Neo 7','iQOO Neo 8','iQOO Neo 9','iQOO Neo 10','iQOO Z1','iQOO Z3','iQOO Z5',
          'iQOO Z6','iQOO Z7','iQOO Z8','iQOO Z9','iQOO Z10','iQOO Z11','X Fold','X Fold 2',
          'X Fold 3','X Flip','X Fold 5','Xplay','Xplay3S','Xshot'
        ],
        'OPPO': [
          'Find','Find 5','Find 7','Find 7a','Find X','Find X Lamborghini Edition','Find X2',
          'Find X2 Lite','Find X2 Neo','Find X2 Pro','Find X3','Find X3 Lite','Find X3 Neo',
          'Find X3 Pro','Find X5','Find X5 Lite','Find X5 Pro','Find X6','Find X6 Pro','Find X7',
          'Find X7 Ultra','Find X8','Find X8 Pro','Find X8 Ultra','Reno','Reno 2','Reno 2Z',
          'Reno 2F','Reno 3','Reno 3 Pro','Reno 3 Z','Reno 4','Reno 4 Pro','Reno 4 Z','Reno 5',
          'Reno 5 Lite','Reno 5 Pro','Reno 5 Pro+','Reno 6','Reno 6 Pro','Reno 6 Pro+','Reno 7',
          'Reno 7 Pro','Reno 7 Z','Reno 8','Reno 8 Pro','Reno 8 Z','Reno 9','Reno 9 Pro',
          'Reno 9 Pro+','Reno 10','Reno 10 Pro','Reno 10 Pro+','Reno 11','Reno 11 Pro','Reno 12',
          'Reno 12 Pro','Reno 13','Reno 13 Pro','Reno 14','Reno 14 Pro','A1','A1k','A1s','A3','A3s',
          'A3x','A5','A5s','A5 2020','A5x','A7','A9','A9 2020','A11','A12','A15','A16','A16k','A17',
          'A18','A31','A32','A33','A33f','A37','A38','A53','A54','A55','A57','A58','A59','A60','A77',
          'A78','A79','A96','A97','A98','A2','A3 Pro','F1','F1 Plus','F1s','F3','F3 Plus','F5',
          'F5 Youth','F7','F9','F9 Pro','F11','F11 Pro','F15','F17','F17 Pro','F19','F19 Pro',
          'F21 Pro','F23','F25','F27','K1','K3','K5','K7','K7x','K9','K9 Pro','K10','K10 Pro','K10x',
          'K11','K12','K13','K13x','N1','N3','Find N','Find N2','Find N2 Flip','Find N3',
          'Find N3 Flip','Find N5','Reno Ace','Reno Ace 2','Find X2 League of Legends Edition',
          'Reno 10x Zoom','R1','R1S','R5','R7','R7 Plus','R9','R9 Plus','R11','R11s','R15','R15 Pro',
          'R17','R17 Pro'
        ],
        'Nokia': [
          '101','105','110','1110','1112','1200','1208','1280','1600','1616','1650','1661',
          '1680 classic','1800','2100','2300','2310','2323 classic','2330 classic','2600','2630',
          '2650','2660 Flip','2700 classic','2720 Fold','2730 classic','2760 Flip','3110 classic',
          '3200','3210','3220','3230','3250','3300','3310','3410','3500 classic','3510','3600',
          '3610','3650','3660','3710 fold','3720 classic','5000','5030','5130 XpressMusic','5200',
          '5300 XpressMusic','5320 XpressMusic','5330','5500 Sport','5610 XpressMusic',
          '5800 XpressMusic','6110 Navigator','6120 classic','6131','6210 Navigator','6220 classic',
          '6230','6233','6260','6280','6300','6310','6500 classic','6500 slide','6600','6610','6630',
          '6650','6670','6680','6700 classic','6710 Navigator','6720 classic','6730 classic',
          '6760 slide','6800','6810','6820','7110','7210','7250','7260','7270','7280','7370','7390',
          '7500 Prism','7600','7610','7650','7700','7710','7900 Prism','8800','8800 Arte',
          '8800 Sirocco','8810','8850','8910','9000 Communicator','9210 Communicator','9300',
          '9500 Communicator','Lumia 520','Lumia 521','Lumia 530','Lumia 535','Lumia 610',
          'Lumia 620','Lumia 625','Lumia 630','Lumia 635','Lumia 636','Lumia 638','Lumia 640',
          'Lumia 640 XL','Lumia 710','Lumia 720','Lumia 730','Lumia 735','Lumia 800','Lumia 820',
          'Lumia 822','Lumia 830','Lumia 900','Lumia 920','Lumia 925','Lumia 928','Lumia 929',
          'Lumia 930','Lumia 1020','Lumia 1320','Lumia 1520','1','1 Plus','1.3','1.4','1.5','1.6',
          '1.7','1.8','1.9','2','2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','3','3.1','3.2',
          '3.4','3.5','3.6','3.7','3.8','4.2','4.3','4.4','4.5','5','5.1','5.1 Plus','5.3','5.4',
          '5.5','5.6','5.7','6','6.1','6.1 Plus','6.2','6.3','6.4','6.5','6.6','6.7','6.8','7',
          '7 Plus','7.1','7.2','7.3','7.4','7.5','7.6','8','8 Sirocco','8.1','8.3 5G','8.5','8.6',
          '9 PureView','9.1','9.2','9.3','C1','C1 Plus','C2','C2 2nd Edition','C3','C5 Endi','C10',
          'C10 Plus','C20','C20 Plus','C21','C21 Plus','C22','C30','C31','C32','C33','C110','C210',
          'C300','G10','G11','G11 Plus','G20','G21','G22','G23','G24','G30','G31','G42','G50','G60',
          'G70','G100','G200','X10','X20','X30','X30 5G','X100','X200','X300','X500','XR20','XR21',
          'XR30','125','130','150','215','220 4G','225','230','2720 Flip','2780 Flip','800 Tough',
          '8000 4G','8110 4G','8210 4G'
        ]
      },
      'Tablets': [
        'iPad Pro M4 (13-inch)','iPad Pro M4 (11-inch)','iPad Pro 12.9"','iPad Pro 11"',
        'iPad Air M2 (13-inch)','iPad Air M2 (11-inch)','iPad Air 5th Gen',
        'iPad mini 6th Gen','iPad (10th Gen)','iPad (9th Gen)',
        'Samsung Galaxy Tab S10 Ultra','Samsung Galaxy Tab S10+','Samsung Galaxy Tab S10',
        'Samsung Galaxy Tab S9 Ultra','Samsung Galaxy Tab S9',
        'Samsung Galaxy Tab S8','Samsung Galaxy Tab A8',
        'Samsung Galaxy Tab A7 Lite',
        'Huawei MatePad Pro','Huawei MatePad 11',
        'Lenovo Tab P12','Lenovo Tab P11 Pro','Lenovo Tab M10',
        'Xiaomi Pad 6','Xiaomi Pad 5',
        'Amazon Fire HD 10','Amazon Fire HD 8',
        'Other Tablet'
      ],
      'Wearables': [
        'Apple Watch Series 9','Apple Watch SE',
        'Samsung Galaxy Watch 6','Samsung Galaxy Watch 5',
        'Garmin Forerunner','Garmin Fenix',
        'Fitbit Versa','Fitbit Charge',
        'Xiaomi Mi Band','Huawei Band',
        'Other Smartwatch / Fitness Tracker'
      ]
    }
  },

  'property': {
    level1Label: 'Category',
    level2Label: 'Type',
    hasYear: false,
    data: {
      'Residential Properties': [
        'Apartments', 'Flats', 'Studio apartments', 'Bedsitters', 'Maisonettes',
        'Townhouses', 'Villas', 'Bungalows', 'Detached houses', 'Semi-detached houses',
        'Duplexes', 'Penthouses', 'Gated community homes', 'Serviced apartments',
        'Holiday homes', 'Vacation rentals', 'Student housing', 'Shared accommodation / roommates'
      ],
      'Commercial Properties': [
        'Office spaces', 'Co-working spaces', 'Corporate headquarters', 'Business centers',
        'Retail shops', 'Shopping malls', 'Supermarkets', 'Restaurants and cafés',
        'Hotels', 'Guest houses', 'Lodges', 'Conference centers', 'Warehouses',
        'Distribution centers', 'Industrial parks', 'Factories', 'Workshops', 'Showrooms'
      ],
      'Land and Plots': [
        'Residential plots', 'Commercial plots', 'Industrial land', 'Agricultural land',
        'Ranches', 'Farms', 'Mixed-use land', 'Beachfront land', 'Lakeside land',
        'Hilltop plots', 'Estate development land', 'Investment plots'
      ],
      'Industrial Properties': [
        'Manufacturing plants', 'Processing facilities', 'Storage facilities', 'Logistics centers',
        'Cold rooms', 'Assembly plants', 'Industrial sheds', 'Industrial yards'
      ],
      'Special-Purpose Properties': [
        'Schools', 'Universities', 'Hospitals', 'Clinics', 'Religious buildings',
        'Community centers', 'Sports complexes', 'Event venues', 'Cinemas',
        'Entertainment centers', 'Petrol stations', 'Car wash facilities'
      ]
    }
  },

  'electronics': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Laptops & Computers': [
        'Apple MacBooks','HP Laptops','Dell Laptops','Lenovo Laptops',
        'Asus Laptops','Acer Laptops','Microsoft Surface',
        'Desktop Computers','Monitors','Printers & Scanners','Computer Accessories'
      ],
      'Televisions': [], // Rendered dynamically via TvForm
      'Audio & Music': [], // Rendered dynamically via AudioForm
      'Gaming': [
        'PlayStation Consoles','Xbox Consoles','Nintendo Consoles',
        'Video Games','Gaming Accessories','VR Headsets'
      ],
      'Cameras & Optics': [
        'DSLR Cameras','Mirrorless Cameras','Drones','Lenses',
        'Tripods & Accessories','Security Cameras'
      ],
      'Other Electronics': [
        'Projectors','Power Banks','Cables & Adapters','Smart Home Devices'
      ]
    }
  },

  'home-furniture': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Appliances': [
        'Fridges & Freezers','Cookers & Ovens','Microwaves',
        'Washing Machines & Dryers','Blenders & Mixers','Water Dispensers',
        'Vacuum Cleaners','Irons & Steamers','Fans & Air Conditioners'
      ],
      'Furniture': [
        'Beds & Frames','Mattresses','Sofas & Couches',
        'Wardrobes & Closets','Dining Tables & Chairs','TV Stands',
        'Coffee Tables','Office Desks & Chairs','Outdoor Furniture'
      ],
      'Home Decor': [
        'Rugs & Carpets','Curtains & Blinds','Lighting & Lamps',
        'Wall Art & Mirrors','Cushions & Pillows','Clocks'
      ],
      'Kitchenware': [
        'Pots & Pans','Cutlery & Utensils','Plates & Bowls',
        'Glasses & Mugs','Storage Containers'
      ]
    }
  },

  'fashion': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      "Men's Clothing": [
        'Shirts & T-Shirts','Trousers & Jeans','Suits & Blazers',
        'Jackets & Coats','Activewear','Underwear & Socks'
      ],
      "Women's Clothing": [
        'Dresses & Skirts','Tops & Blouses','Trousers & Jeans',
        'Jackets & Coats','Activewear','Lingerie & Sleepwear'
      ],
      'Shoes': [
        "Men's Sneakers","Men's Formal Shoes","Men's Boots",
        "Women's Heels","Women's Flats & Sandals","Women's Sneakers"
      ],
      'Accessories': [
        'Bags & Purses','Backpacks','Watches','Jewelry',
        'Sunglasses','Belts','Hats & Caps'
      ]
    }
  },

  'beauty': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Skincare': [
        'Lotions & Creams','Serums & Oils','Sunscreen',
        'Face Wash & Cleansers','Face Masks','Soaps & Body Wash'
      ],
      'Hair Care': [
        'Wigs & Extensions','Shampoos & Conditioners','Hair Oils & Serums',
        'Hair Styling Tools','Hair Dyes','Hair Accessories'
      ],
      'Makeup': [
        'Foundation & Concealer','Lipstick & Lip Gloss','Eye Makeup',
        'Brushes & Applicators','Makeup Removers'
      ],
      'Fragrances': [
        "Women's Perfumes","Men's Colognes",'Body Splashes & Mists',
        'Deodorants & Antiperspirants'
      ],
      'Personal Hygiene': [
        'Dental Care','Feminine Care','Shaving & Hair Removal'
      ]
    }
  },

  'services': {
    level1Label: 'Category',
    level2Label: 'Type',
    hasYear: false,
    data: {
      'Home & Cleaning': [
        'House Cleaning','Pest Control','Laundry & Dry Cleaning',
        'Fumigation','Carpet Cleaning'
      ],
      'Moving & Logistics': [
        'House Moving','Office Relocation','Courier & Delivery',
        'Freight Forwarding'
      ],
      'Events & Catering': [
        'Catering Services','Photography & Video','Event Planning',
        'DJ & Entertainment','Tent & Chair Hire'
      ],
      'Professional Services': [
        'Legal Services','Accounting & Tax','Business Consulting',
        'Translation & Writing','Graphic Design'
      ],
      'IT & Web': [
        'Website Development','App Development','IT Support',
        'Digital Marketing','Social Media Management'
      ],
      'Education & Tutors': [
        'Academic Tutoring','Language Classes','Driving Schools',
        'Music Lessons','Fitness Training'
      ]
    }
  },

  'repair-construction': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Tools & Hardware': [
        'Power Drills','Grinders','Saws & Cutters',
        'Generators','Hand Tools','Safety Gear & PPE',
        'Welding Equipment'
      ],
      'Building Materials': [
        'Cement & Sand','Iron Sheets (Mabati)','Paints & Finishes',
        'Plumbing Pipes & Fittings','Tiles & Flooring','Timber & Wood',
        'Doors & Windows','Roofing Materials'
      ],
      'Contractors & Services': [
        'Plumbers','Electricians','Carpenters',
        'Masons & Builders','Painters','Roofing Contractors'
      ]
    }
  },

  'commercial-equipment': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Industrial Machinery': [
        'Lathes & Milling Machines','Heavy Welding Equipment','Packaging Machinery',
        'Textile Machinery','Woodworking Machinery'
      ],
      'Restaurant & Hotel': [
        'Commercial Ovens','Deep Fryers','Commercial Fridges & Chillers',
        'Display Cabinets','Coffee Machines'
      ],
      'Medical & Lab': [
        'Hospital Beds','Ultrasound Machines','Lab Microscopes',
        'Dental Equipment','Surgical Instruments'
      ],
      'Office & Retail': [
        'POS Systems','Barcode Scanners','Photocopiers',
        'Shop Shelving','Mannequins'
      ],
      'Salon & Beauty': [
        'Barber Chairs','Hair Dryers & Steamers','Massage Beds',
        'Nail Care Equipment'
      ]
    }
  },

  'leisure': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Fitness & Gym': [
        'Treadmills','Dumbbells & Weights','Exercise Bikes',
        'Resistance Bands','Yoga Mats'
      ],
      'Cycling & Skating': [
        'Bicycles (Mountain/Road)','Electric Scooters','Roller Skates',
        'Helmets & Gear'
      ],
      'Camping & Outdoors': [
        'Tents','Sleeping Bags','Camping Chairs','Cooler Boxes'
      ],
      'Musical Instruments': [
        'Acoustic/Electric Guitars','Keyboards & Pianos','Drum Sets',
        'Microphones','Studio Equipment'
      ],
      'Books & Games': [
        'Novels & Fiction','Textbooks & Educational','Board Games',
        'Puzzles','Art Supplies'
      ]
    }
  },

  'babies-kids': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Prams & Cots': [
        'Prams & Strollers','Cots & Cribs','Baby Carriers',
        'Car Seats','High Chairs'
      ],
      'Toys & Games': [
        'Educational Toys','Action Figures','Dolls',
        'Remote Control Cars','Bicycles & Tricycles'
      ],
      'Kids Clothing & Shoes': [
        'Baby Clothes (0-24m)','Boys Clothing','Girls Clothing',
        'Boys Shoes','Girls Shoes'
      ],
      'Care & Hygiene': [
        'Diapers & Wipes','Baby Bath & Skin Care','Potty Training',
        'Feeding Bottles & Accessories'
      ],
      'Maternity': [
        'Maternity Clothes','Breast Pumps','Nursing Pillows'
      ]
    }
  },

  'food-agriculture': {
    level1Label: 'Category',
    level2Label: 'Item',
    hasYear: false,
    data: {
      'Fresh Produce': [
        'Fresh Fruits','Vegetables','Onions & Tomatoes','Potatoes'
      ],
      'Grains & Staples': [
        'Maize','Beans','Rice','Wheat','Flour'
      ],
      'Farm Inputs': [
        'Seeds & Seedlings','Fertilizers','Pesticides & Herbicides',
        'Animal Feeds & Supplements'
      ],
      'Farm Machinery': [
        'Tractors','Water Pumps & Irrigation','Chaff Cutters',
        'Milking Machines','Incubators','Ploughs & Harrows'
      ],
      'Processed Foods': [
        'Honey','Cooking Oil','Spices & Seasoning','Snacks & Beverages'
      ]
    }
  },

  'animals-pets': {
    level1Label: 'Category',
    level2Label: 'Breed/Item',
    hasYear: false,
    data: {
      'Dogs': [
        'Puppies','Adult Dogs','German Shepherd','Rottweiler',
        'Boerboel','Terrier','Husky','Golden Retriever','Other Dog Breeds'
      ],
      'Cats': [
        'Kittens','Adult Cats','Persian','Siamese','Other Cat Breeds'
      ],
      'Birds & Fish': [
        'Parrots','Pigeons','Aquarium Fish','Fish Tanks & Pumps'
      ],
      'Livestock': [
        'Dairy Cows','Beef Cattle','Goats','Sheep',
        'Poultry (Chicken, Ducks, Turkeys)','Pigs','Rabbits'
      ],
      'Pet Accessories': [
        'Dog/Cat Food','Leashes & Collars','Cages & Carriers',
        'Pet Toys','Veterinary Supplies'
      ]
    }
  },

  'jobs': {
    level1Label: 'Category',
    level2Label: 'Role',
    hasYear: false,
    hasCustomForm: true, // Tells PostAd to use JobForm
    data: {} // Data is now handled inside jobsData.js and JobForm.jsx
  },

  'seeking-work': {
    level1Label: 'Category',
    level2Label: 'Role',
    hasYear: false,
    data: {
      'Professional CVs': [
        'IT Professionals','Accountants','Marketers','Engineers',
        'Teachers','Healthcare Professionals'
      ],
      'Skilled Trade': [
        'Drivers','Plumbers','Electricians','Carpenters',
        'Mechanics','Tailors'
      ],
      'Casual Labor': [
        'House Helps / Maids','Cleaners','Security Guards',
        'Construction Workers','Farm Workers'
      ]
    }
  },

};

export const CATEGORY_ICONS = [
  { slug: 'auto-spares',          name: 'Auto Spares',                  icon: '⚙️', count: 1842 },
  { slug: 'vehicles',             name: 'Vehicles',                     icon: '🚗', count: 3421 },
  { slug: 'property',             name: 'Property',                     icon: '🏠', count: 1842 },
  { slug: 'phones-tablets',       name: 'Phones & Tablets',             icon: '📱', count: 2319 },
  { slug: 'electronics',          name: 'Electronics',                  icon: '💻', count: 1540 },
  { slug: 'home-furniture',       name: 'Home & Furniture',             icon: '🛋️', count: 890 },
  { slug: 'fashion',              name: 'Fashion',                      icon: '👗', count: 420 },
  { slug: 'beauty',               name: 'Beauty & Personal Care',       icon: '✨', count: 310 },
  { slug: 'services',             name: 'Services',                     icon: '🔧', count: 650 },
  { slug: 'repair-construction',  name: 'Repair & Construction',        icon: '🛠️', count: 215 },
  { slug: 'commercial-equipment', name: 'Commercial Equipment',         icon: '🚜', count: 110 },
  { slug: 'leisure',              name: 'Leisure & Sports',             icon: '⚽', count: 275 },
  { slug: 'babies-kids',          name: 'Babies & Kids',                icon: '🧸', count: 480 },
  { slug: 'food-agriculture',     name: 'Agriculture & Food',           icon: '🍎', count: 620 },
  { slug: 'animals-pets',         name: 'Animals & Pets',               icon: '🐶', count: 185 },
  { slug: 'jobs',                 name: 'Jobs',                         icon: '💼', count: 945 },
  { slug: 'seeking-work',         name: 'CVs & Resumes',                icon: '📄', count: 120 },
];

export const TOP_CATEGORIES = CATEGORY_ICONS;
export const MANUFACTURE_YEARS = Array.from({length: 30}, (_, i) => new Date().getFullYear() - i);
export function getSpecs(categorySlug, level1, level2) {
  if (categorySlug === 'auto-spares') {
    return [
      { key: 'partNumber', label: 'Part Number', type: 'text' },
      { key: 'oemNumber', label: 'OEM Number', type: 'text' },
      { key: 'partCondition', label: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] },
      { key: 'partType', label: 'Part Type', type: 'select', options: ['Genuine', 'OEM', 'Aftermarket'] },
      { key: 'placement', label: 'Placement', type: 'select', options: ['Front', 'Rear', 'Left', 'Right', 'Upper', 'Lower', 'N/A'] }
    ];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// VEHICLE SPECS: All options used by VehicleForm.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const VEHICLE_SPECS = {

  vehicleTypes: [
    'Car', 'SUV', 'Pickup / Truck', 'Van', 'Minivan',
    'Bus', 'Heavy Truck', 'Motorcycle', 'Tuk Tuk / 3-Wheeler',
    'Trailer', 'Construction Equipment', 'Agricultural Equipment',
  ],

  // Flat list kept for fallback
  bodyStyles: [
    'Sedan', 'Hatchback', 'Wagon / Estate', 'Coupe', 'Convertible',
    'SUV', 'Crossover', 'Pickup', 'Van', 'Minivan', 'Limousine',
    'Bus', 'Truck', 'MPV', 'Fastback', 'Liftback',
  ],

  // Per-vehicle-type body style filter
  bodyStylesByType: {
    'Car':                    ['Sedan', 'Hatchback', 'Wagon / Estate', 'Coupe', 'Convertible', 'Fastback', 'Liftback', 'MPV', 'Limousine'],
    'SUV':                    ['SUV', 'Crossover', 'Off-Road 4×4'],
    'Pickup / Truck':         ['Single Cab', 'Extra Cab', 'Double Cab / Crew Cab', 'Flatbed', 'Tipper'],
    'Van':                    ['Panel Van', 'Cargo Van', 'High-Roof Van', 'Window Van', 'Crew Van'],
    'Minivan':                ['Minivan', 'MPV', 'People Carrier'],
    'Bus':                    ['Minibus', 'Midibus', 'Full-Size Bus', 'School Bus', 'Coach'],
    'Heavy Truck':            ['Box Truck', 'Flatbed Truck', 'Tipper / Dump Truck', 'Tanker', 'Refrigerator Truck', 'Curtain-Side Truck', 'Low Loader'],
    'Motorcycle':             ['Standard / Naked', 'Sport / Supersport', 'Cruiser', 'Adventure / Dual-Sport', 'Dirt / Off-Road', 'Scooter', 'Moped', 'Touring'],
    'Tuk Tuk / 3-Wheeler':   ['Passenger Tuk Tuk', 'Cargo Tuk Tuk'],
    'Trailer':                ['Flatbed Trailer', 'Box Trailer', 'Tanker Trailer', 'Low-Loader Trailer', 'Refrigerated Trailer', 'Car Transporter'],
    'Construction Equipment': ['Excavator', 'Bulldozer', 'Grader', 'Loader', 'Compactor / Roller', 'Crane', 'Forklift', 'Concrete Mixer'],
    'Agricultural Equipment': ['Tractor', 'Combine Harvester', 'Plough', 'Sprayer', 'Irrigation Equipment', 'Baler'],
  },

  fuelTypes: [
    'Petrol', 'Diesel', 'Hybrid', 'Plug-in Hybrid',
    'Electric', 'LPG', 'CNG', 'Other',
  ],

  usageTypes: [
    'Personal', 'Commercial', 'Fleet', 'Taxi',
    'Ride-hailing (e.g. Uber)', 'Rental', 'Government',
  ],

  comfortFeatures: [
    'Air Conditioning', 'Climate Control', 'Dual-Zone Climate',
    'Rear Climate Control', 'Cruise Control', 'Adaptive Cruise Control',
    'Push Start / Keyless Ignition', 'Keyless Entry', 'Remote Start',
    'Auto Start-Stop', 'Electric Windows', 'Power Mirrors',
    'Auto-Fold Mirrors', 'Rain Sensing Wipers', 'Auto Headlights',
    'Wireless Charger', 'Power Tailgate', 'Electric Seats',
    'Heated Seats', 'Ventilated Seats', 'Memory Seats',
    'Heated Steering Wheel', 'Multifunction Steering Wheel',
    'Folding Rear Seats', 'Rear AC Vents', 'Ambient Lighting',
    'Head-Up Display', 'Digital Instrument Cluster', 'Sunroof',
    'Panoramic Roof', 'Roof Rails', 'Running Boards', 'Tow Hitch',
  ],

  infotainmentFeatures: [
    'Touchscreen Display', 'Navigation / GPS', 'Apple CarPlay',
    'Android Auto', 'Bluetooth', 'USB Ports', 'AUX Input',
    'Wi-Fi Hotspot', 'Voice Control', 'Premium Sound System',
    'Rear Entertainment', 'CD / DVD Player', 'DAB Radio',
    'Wireless Phone Connectivity',
  ],

  safetyFeatures: [
    'ABS (Anti-lock Brakes)', 'EBD', 'ESC (Stability Control)',
    'Traction Control', 'Brake Assist', 'Front Airbags',
    'Side Airbags', 'Curtain Airbags', 'Knee Airbags',
    'ISOFIX (Child Seat Anchors)', 'Child Locks',
    'Blind Spot Monitoring', 'Lane Departure Warning',
    'Lane Keep Assist', 'Forward Collision Warning',
    'Automatic Emergency Braking', 'Pedestrian Detection',
    'Driver Monitoring', '360° Camera', 'Reverse Camera',
    'Front Parking Sensors', 'Rear Parking Sensors',
    'Tire Pressure Monitoring (TPMS)', 'Alarm & Immobilizer', 'Dashcam',
  ],

  exteriorFeatures: [
    'Alloy Wheels', 'Spare Wheel', 'LED Headlights', 'Xenon Headlights',
    'Fog Lights', 'Daytime Running Lights (DRLs)', 'Adaptive Headlights',
    'Window Tint', 'Bull Bar', 'Side Steps / Running Boards',
    'Roof Rack', 'Nudge Bar', 'Snorkel', 'Differential Lock',
  ],

  conditionDetails: [
    'Original Paint', 'Accident Damaged', 'Previously Repainted',
    'Flood Damaged', 'Engine Replaced', 'Gearbox Replaced',
    'Smoke Free', 'Non-Smoker Owner', 'Rust Present', 'Rebuilt',
    'Inspection Certificate Available', 'Service Records Available',
    'Import Documents Available',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VEHICLE MAKES BY TYPE
// Maps each vehicle type to the correct makes + models to display.
// VehicleForm.jsx uses this to filter the Make dropdown.
// ─────────────────────────────────────────────────────────────────────────────
export const VEHICLE_MAKES_BY_TYPE = {

  // ── STANDARD CARS / SUVs ONLY use the main vehicle data ───────────────────
  _useMainData: ['Car', 'SUV'],

  // ── PICKUP / TRUCK ─────────────────────────────────────────────────────────
  'Pickup / Truck': {
    'Toyota': [
      'Hilux Single Cab', 'Hilux Extra Cab', 'Hilux Double Cab',
      'Hilux Revo Single Cab', 'Hilux Revo Extra Cab', 'Hilux Revo Double Cab',
      'Hilux Champ', 'Land Cruiser 70 Pick Up', 'Dyna',
    ],
    'Ford': [
      'Ranger XL', 'Ranger XLS', 'Ranger XLT', 'Ranger Wildtrak',
      'Ranger Raptor', 'F-150', 'F-250', 'F-350',
    ],
    'Isuzu': [
      'D-Max Single Cab', 'D-Max Space Cab', 'D-Max Double Cab',
      'D-Max V-Cross', 'TFR Single Cab', 'TFR Double Cab',
      'NKR', 'NPR', 'NQR', 'FRR', 'FTR', 'FSR',
    ],
    'Mitsubishi': [
      'L200 Single Cab', 'L200 Club Cab', 'L200 Double Cab', 'L200 Triton',
      'Triton Single Cab', 'Triton Double Cab',
    ],
    'Nissan': [
      'Navara Single Cab', 'Navara King Cab', 'Navara Double Cab',
      'Frontier', 'Titan', 'NP300',
    ],
    'Mazda': [
      'BT-50 Single Cab', 'BT-50 Freestyle Cab', 'BT-50 Double Cab',
    ],
    'Volkswagen': [
      'Amarok Single Cab', 'Amarok Double Cab', 'Amarok V6',
    ],
    'Mercedes-Benz': [
      'X-Class 220d', 'X-Class 250d', 'X-Class 350d', 'Sprinter Chassis',
    ],
    'Renault': ['Alaskan Single Cab', 'Alaskan Double Cab'],
    'GWM': ['Steed Single Cab', 'Steed Double Cab', 'Cannon'],
    'Chery': ['Tiggo Pickup', 'QQ Pickup'],
    'JAC': ['JAC T8 Pro', 'JAC T9'],
    'Foton': ['Foton Tunland', 'Foton Thunder'],
    'DFSK': ['DFSK Glory Pickup', 'DFSK C32'],
    'Hino': ['Hino 300 Series', 'Hino 500 Series', 'Hino 700 Series'],
    'Other': ['Other Pickup / Truck'],
  },

  // ── VAN ────────────────────────────────────────────────────────────────────
  'Van': {
    'Toyota': [
      'HiAce (Panel Van)', 'HiAce (Window Van)', 'HiAce High Roof',
      'ProAce', 'HiAce H100',
    ],
    'Nissan': [
      'Urvan NV350', 'Urvan E25', 'NV200', 'NV400',
    ],
    'Mercedes-Benz': [
      'Sprinter Panel Van', 'Sprinter Crew Van', 'Vito', 'Metris',
    ],
    'Ford': ['Transit', 'Transit Custom', 'Transit Connect', 'E-Transit'],
    'Volkswagen': ['Transporter T5', 'Transporter T6', 'Crafter', 'Caddy'],
    'Peugeot': ['Partner', 'Expert', 'Boxer'],
    'Renault': ['Trafic', 'Master', 'Kangoo'],
    'Mitsubishi': ['L300', 'Delica Cargo', 'Canter'],
    'Isuzu': ['N-Series Cargo'],
    'Fiat': ['Ducato', 'Scudo', 'Doblo Cargo'],
    'Hyundai': ['H350', 'Staria Load', 'H-1 Van'],
    'Kia': ['K2500', 'K2700'],
    'DFSK': ['DFSK C35 Van', 'DFSK V21 Van', 'DFSK V27 Van'],
    'Other': ['Other Van'],
  },

  // ── MINIVAN ────────────────────────────────────────────────────────────────
  'Minivan': {
    'Toyota': [
      'Sienna', 'Hiace Commuter', 'HiAce 9-Seater',
      'Noah', 'Voxy', 'Wish', 'Isis', 'Alphard',
    ],
    'Honda': ['Odyssey', 'Stepwgn', 'Freed'],
    'Nissan': ['Serena', 'Elgrand', 'Quest'],
    'Mazda': ['MPV', 'Biante'],
    'Hyundai': ['Staria', 'H-1', 'Starex'],
    'Kia': ['Carnival', 'Sedona'],
    'Ford': ['S-Max', 'Galaxy'],
    'Volkswagen': ['Sharan', 'Caravelle', 'Multivan'],
    'Mercedes-Benz': ['Viano', 'V-Class'],
    'Chrysler': ['Pacifica', 'Grand Caravan'],
    'Mitsubishi': ['Delica', 'Grandis'],
    'Subaru': ['Exiga'],
    'Other': ['Other Minivan'],
  },

  // ── MOTORCYCLES ────────────────────────────────────────────────────────────
  'Motorcycle': {
    'Honda (Motorcycles)': [
      'CB125F','CB150R','CB190R','CB300R','CB500F','CB500X',
      'CB650R','CB750 Hornet','CBR150R','CBR250R','CBR300R',
      'CBR500R','CBR650R','CBR1000RR Fireblade','CG125',
      'CT125 Hunter Cub','Shine 125','Unicorn 150','Livo 110',
      'Dream Yuga','Navi','X-Blade','Other Honda Moto',
    ],
    'Yamaha (Motorcycles)': [
      'YBR 125','YBR 250','FZ-S 150','FZN 150','FZ 16',
      'FZ 25','MT-03','MT-07','MT-09','MT-10',
      'R3','R7','R1','NMAX 155','Aerox 155',
      'Fascino 125','Ray ZR 125','Saluto 125','SZ-RR',
      'XT660Z Ténéré','XSR 700','Other Yamaha Moto',
    ],
    'Kawasaki': [
      'Ninja 300','Ninja 400','Ninja 650','Ninja ZX-6R','Ninja ZX-10R',
      'Z300','Z400','Z650','Z800','Z900','Z1000',
      'Versys 300','Versys 650','Versys 1000',
      'KLX 150','KLX 230','KLX 300','KLX 450R',
      'W175','W800','Vulcan S','H2','Other Kawasaki',
    ],
    'Suzuki (Motorcycles)': [
      'GSX-R150','GSX-R600','GSX-R750','GSX-R1000',
      'GSX-S150','GSX-S750','GSX-S1000','V-Strom 250',
      'V-Strom 650','V-Strom 1050','DR150','DR200',
      'GN125','GS150R','Hayabusa','Burgman 400','Other Suzuki Moto',
    ],
    'Bajaj': [
      'Pulsar 135','Pulsar 150','Pulsar 160NS','Pulsar 180',
      'Pulsar 200NS','Pulsar 200RS','Pulsar 220F','Pulsar N250',
      'Pulsar F250','Avenger Cruise 220','Avenger Street 220',
      'Discover 100','Discover 125','Platina 100','CT100',
      'Boxer 150','Boxer CT100','Other Bajaj',
    ],
    'TVS': [
      'Apache RTR 160','Apache RTR 160 4V','Apache RTR 180',
      'Apache RTR 200 4V','Apache RR 310','Raider 125',
      'Ronin 225','Star City 125','Sport 110','Metro ES',
      'HLX 125','HLX 150','Ntorq 125','Neo 110','Victor',
      'Other TVS',
    ],
    'Hero MotoCorp': [
      'Splendor Plus','Splendor Pro','Passion Pro','Passion XPro',
      'Glamour','Glamour Xtec','HF 100','HF Deluxe',
      'HF 100','Xtreme 160R','Xtreme 200R','Xtreme 200S',
      'Maestro Edge 110','Maestro Edge 125','Destini 125',
      'Xoom 110','Other Hero',
    ],
    'KTM': [
      '125 Duke','200 Duke','250 Duke','390 Duke','790 Duke','890 Duke',
      '125 RC','200 RC','250 RC','390 RC','390 Adventure',
      '790 Adventure','890 Adventure','1090 Adventure',
      '1190 Adventure','1290 Super Adventure','Other KTM',
    ],
    'Royal Enfield': [
      'Bullet 350','Classic 350','Meteor 350','Hunter 350',
      'Thunderbird 350','Thunderbird 500','Himalayan 450',
      'Scram 411','Super Meteor 650','Interceptor 650',
      'Continental GT 650','Other Royal Enfield',
    ],
    'Lifan': ['KP150','KP200','KPR 150','KPR 200','X-Pect 200','LF150-10S','Other Lifan'],
    'Loncin': ['GP150','GP250','CR5','LX150GY','LX250GY','Other Loncin'],
    'Haojue': ['DR160','HJ150-26','HJ150-2D','HJ125T-9','Other Haojue'],
    'Other Motorcycle Brand': ['Other Brand / Model'],
  },

  // ── TUK TUKS / 3-WHEELERS ─────────────────────────────────────────────────
  'Tuk Tuk / 3-Wheeler': {
    'Bajaj (Tuk Tuk)': ['RE (Auto Rickshaw) 4S','RE Compact','RE Optima CNG','RE Optima LPG','Other Bajaj RE'],
    'TVS (Tuk Tuk)': ['King Deluxe','King Duramax','XL100 Super Heavy','Other TVS King'],
    'Piaggio': ['Ape City','Ape Truk','Ape Xtra LDX','Porter 700','Porter 1000','Other Piaggio'],
    'Mahindra (3-Wheeler)': ['Alfa Plus','Alfa Load','Treo Yaari','Other Mahindra'],
    'Qute (Bajaj)': ['Qute RE60','Other Qute'],
    'Other 3-Wheeler Brand': ['Other Brand / Model'],
  },

  // ── BUSES ──────────────────────────────────────────────────────────────────
  'Bus': {
    'Toyota': ['HiAce (14-seater)','HiAce Commuter (18-seater)','HiAce Grand Cabin','Coaster 29-seater','Coaster 33-seater','Other Toyota Bus'],
    'Isuzu': ['NQR Bus','NPR Bus','FRR Bus','FSR Bus','FVR Bus','Other Isuzu Bus'],
    'Mercedes-Benz (Bus)': ['Sprinter Minibus','Tourismo','Travego','Intouro','Other MB Bus'],
    'Higer': ['KLQ6119','KLQ6122','KLQ6128','Other Higer'],
    'Yutong': ['ZK6122','ZK6128','ZK6119','ZK6999','Other Yutong'],
    'King Long': ['XMQ6900','XMQ6120','XMQ6130','Other King Long'],
    'Scania (Bus)': ['Touring HD','Interlink HD','Citywide LF','Other Scania Bus'],
    'Volvo (Bus)': ['B8R','B11R','8900','9900','9700','Other Volvo Bus'],
    'Rosa (Mitsubishi)': ['Rosa 28-seater','Rosa 33-seater','Other Rosa'],
    'Nissan (Bus)': ['Civilian','Urvan (14-seater)','Other Nissan Bus'],
    'Other Bus Brand': ['Other Brand / Model'],
  },

  // ── HEAVY TRUCKS ───────────────────────────────────────────────────────────
  'Heavy Truck': {
    'Isuzu (Trucks)': ['ELF NKR','ELF NPR','ELF NMR','Forward NQR','Forward FSR','Forward FRR','Forward FVR','GIGA FVZ','GIGA GXZ','Other Isuzu Truck'],
    'Mercedes-Benz (Trucks)': ['Actros','Arocs','Atego','Axor','Econic','Unimog','Other MB Truck'],
    'Volvo (Trucks)': ['FH','FM','FMX','FE','FL','VM','Other Volvo Truck'],
    'Scania (Trucks)': ['R-Series','S-Series','P-Series','G-Series','L-Series','Other Scania'],
    'MAN': ['TGS','TGX','TGM','TGE','CLA','Other MAN'],
    'DAF': ['XF','XG','CF','LF','Other DAF'],
    'Hino': ['500 Series','700 Series','300 Series','Ranger','Other Hino'],
    'Mitsubishi Fuso': ['Canter','Fighter','Super Great','Other Fuso'],
    'Nissan (Trucks)': ['Condor','Quon','NT500','Other Nissan Truck'],
    'SINOTRUK (HOWO)': ['A7','T7H','HOWO-A7','CQ3317','Other HOWO'],
    'Foton': ['Auman GTL','Auman EST','Aumark','Forland','Other Foton'],
    'Dongfeng': ['Kinland DFH','Tianjin','Cummins Series','Other Dongfeng'],
    'FAW': ['J6P','J7','Tiger V','Other FAW'],
    'Other Truck Brand': ['Other Brand / Model'],
  },

  // ── TRAILERS ───────────────────────────────────────────────────────────────
  'Trailer': {
    'Wabash National': ['Dry Van','Flatbed','Reefer','Other Wabash'],
    'Utility Trailer Mfg': ['Dry Van','Flatbed','Reefer','Other Utility'],
    'Great Dane': ['Dry Van','Flatbed','Reefer','Other Great Dane'],
    'Schmitz Cargobull': ['S.CS','S.KO COOL','S.CF','Other Schmitz'],
    'Local Fabricated': ['Flatbed Trailer','Low Bed Trailer','Tanker','Tipper','Skeletal (Container)','Other Local'],
    'Other Trailer Brand': ['Other Brand / Model'],
  },

  // ── CONSTRUCTION EQUIPMENT ─────────────────────────────────────────────────
  'Construction Equipment': {
    'Caterpillar (CAT)': ['Excavator 320','Excavator 330','Excavator 336','Wheel Loader 950','Wheel Loader 966','Bulldozer D6','Bulldozer D8','Motor Grader 140','Other CAT'],
    'Komatsu': ['PC200','PC300','PC400','WA470','D85','GD655','HD465','Other Komatsu'],
    'JCB': ['3CX Backhoe','4CX Backhoe','JS205','JS300','535-95 Telehandler','Other JCB'],
    'Volvo (Construction)': ['EC220','EC300','EC480','L110','L150','A40','Other Volvo CE'],
    'Hitachi': ['ZX200','ZX300','ZX450','EX1200','Other Hitachi'],
    'Liebherr': ['R 920','R 936','R 9200','LTM 1100','Other Liebherr'],
    'Doosan': ['DX225','DX300','DX480','Other Doosan'],
    'Hyundai (Construction)': ['HX220','HX300','HL960','Other Hyundai CE'],
    'Manitowoc (Crane)': ['Grove RT760E','Potain MDT 219','Other Manitowoc'],
    'XCMG': ['XE215C','XE335C','XZ360','LW500FN','Other XCMG'],
    'SANY': ['SY215','SY365','SY550','Other SANY'],
    'Other Construction Brand': ['Other Brand / Model'],
  },

  // ── AGRICULTURAL EQUIPMENT ─────────────────────────────────────────────────
  'Agricultural Equipment': {
    'Massey Ferguson': ['MF 375','MF 385','MF 390','MF 1035','MF 4710','MF 7720','Other MF'],
    'John Deere': ['5075E','5105','5310','6110M','6120M','8R 370','Other John Deere'],
    'New Holland': ['TT75','TD5.110','T7.270','T8.435','TC5.80','Other New Holland'],
    'Case IH': ['Farmall 75A','Farmall 95A','Maxxum 145','Puma 200','Other Case IH'],
    'Kubota': ['M7040','M8540','M9540','M7-172','L3800','B2420','Other Kubota'],
    'Deutz-Fahr': ['5100 G','5130 G','6180 TTV','7250 TTV','Other Deutz-Fahr'],
    'Same': ['Dorado 70','Dorado 90','Iron 110','Other Same'],
    'Sonalika': ['DI 42','DI 60','DI 75','RX 42','Other Sonalika'],
    'Kioti': ['CK2610','DK5510','RX6620','Other Kioti'],
    'Other Agriculture Brand': ['Other Brand / Model'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY SPECS: All options used by PropertyForm.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const PROPERTY_SPECS = {
  listingCategories: [
    'For Sale', 'For Rent', 'For Lease'
  ],
  currencies: [
    'KES', 'USD', 'EUR', 'GBP'
  ],
  residentialFeatures: [
    'Ensuite', 'Walk-in closets', 'Pantry', 'Laundry room', 
    'Balcony', 'Terrace', 'Fireplace', 'Fitted Kitchen', 'Study Room',
    'DSQ (Domestic Staff Quarters)', 'Basement'
  ],
  amenities: [
    'Parking', 'Swimming pool', 'Gym', 'Elevator', 'Garden', 
    'Children\'s play area', 'Security guards', 'CCTV', 'Electric fence',  
    'Backup generator', 'Borehole', 'Water tanks', 'Internet connectivity', 
    'Solar power', 'Air conditioning', 'Clubhouse', 'Intercom'
  ],
  commercialFeatures: [
    'Office partitions', 'Meeting rooms', 'Reception area', 'Loading bays', 
    'Dock access', 'Storage rooms', 'High-speed internet', 'Security systems',
    'Kitchenette', 'Cafeteria', 'Conference facilities'
  ],
  legalInfo: [
    'Title deed available', 'Sectional property title', 'Freehold', 'Leasehold',
    'Approved plans', 'NEMA approval', 'Change of user complete'
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// TV SPECS: Intelligent categorization for Televisions (TvForm.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const TV_SPECS = {
  brands: ['Samsung', 'LG', 'Sony', 'Hisense', 'TCL', 'Skyworth', 'Panasonic', 'Philips', 'Toshiba', 'Sharp', 'Vitron', 'Vision Plus', 'Syinix', 'Nobel', 'Nobel Plus', 'Bruhm', 'Mika', 'Roch', 'SmartPro', 'Haier', 'Nunix', 'Icona', 'Ailyons', 'Beko', 'Changhong', 'Coocaa', 'Konka', 'JVC', 'Hitachi', 'Daewoo', 'Hyundai', 'AOC', 'Akai', 'Xiaomi', 'Redmi', 'Huawei', 'OnePlus', 'Realme', 'Nokia', 'Motorola', 'Thomson', 'Blaupunkt', 'Telefunken', 'Grundig', 'Vestel', 'Westinghouse', 'Polaroid', 'Element', 'Insignia', 'Sceptre', 'Onn', 'RCA', 'Sansui', 'Kodak', 'Lloyd', 'Vu', 'Tornado', 'Funai', 'NEC', 'Metz', 'Finlux', 'Continental Edison', 'Saba', 'Loewe'],
  sizes: ['19"', '22"', '24"', '28"', '32"', '40"', '43"', '50"', '55"', '58"', '60"', '65"', '70"', '75"', '77"', '83"', '85"', '98"'],
  techs: ['LED', 'QLED', 'Neo QLED', 'OLED', 'Mini LED', 'Crystal UHD', 'NanoCell', 'QNED', 'LCD'],
  os: ['Android TV', 'Google TV', 'WebOS', 'Tizen', 'VIDAA', 'Roku', 'Linux', 'Non Smart'],
  resolutions: ['HD', 'Full HD', '4K UHD', '8K'],
  conditions: ['New', 'Used', 'Refurbished'],

  hierarchy: {
    'Samsung': {
      sizes: ['32"', '43"', '50"', '55"', '65"', '75"', '85"', '98"'],
      techs: {
        '32"': ['LED'],
        '43"': ['LED', 'Crystal UHD', 'QLED'],
        '50"': ['LED', 'Crystal UHD', 'QLED', 'Neo QLED'],
        '55"': ['Crystal UHD', 'QLED', 'Neo QLED', 'OLED'],
        '65"': ['Crystal UHD', 'QLED', 'Neo QLED', 'OLED'],
        '75"': ['Crystal UHD', 'QLED', 'Neo QLED'],
        '85"': ['Crystal UHD', 'QLED', 'Neo QLED'],
        '98"': ['QLED', 'Neo QLED']
      },
      series: {
        'LED': ['T5300', 'T5350'],
        'Crystal UHD': ['AU7000', 'BU8000', 'CU7000', 'DU7000'],
        'QLED': ['Q60', 'Q70', 'Q80', 'Q90'],
        'Neo QLED': ['QN85', 'QN90', 'QN95'],
        'OLED': ['S85', 'S90', 'S95']
      }
    },
    'LG': {
      sizes: ['32"', '43"', '50"', '55"', '65"', '75"', '77"', '83"'],
      techs: {
        '32"': ['LED'],
        '43"': ['LED', 'NanoCell'],
        '50"': ['LED', 'NanoCell', 'QNED'],
        '55"': ['LED', 'NanoCell', 'QNED', 'OLED'],
        '65"': ['LED', 'NanoCell', 'QNED', 'OLED'],
        '75"': ['LED', 'NanoCell', 'QNED'],
        '77"': ['OLED'],
        '83"': ['OLED']
      },
      series: {
        'LED': ['32LQ630', '43UR7800', '55UR8000'],
        'NanoCell': ['50NANO75', '55NANO80'],
        'QNED': ['55QNED75', '65QNED80'],
        'OLED': ['OLED55B3', 'OLED55C3', 'OLED65C3', 'OLED77G3']
      }
    },
    'Sony': {
      sizes: ['43"', '50"', '55"', '65"', '75"', '85"'],
      techs: {
        '43"': ['LED'],
        '50"': ['LED'],
        '55"': ['LED', 'XR', 'OLED'],
        '65"': ['LED', 'XR', 'OLED'],
        '75"': ['LED', 'XR'],
        '85"': ['XR']
      },
      series: {
        'LED': ['43X75', '50X80', '65X85'],
        'XR': ['65X90', '75X95'],
        'OLED': ['55A80', '65A80', '65A95']
      }
    },
    'Hisense': {
      sizes: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
      techs: {
        '32"': ['LED'],
        '43"': ['LED'],
        '50"': ['LED', 'ULED'],
        '55"': ['LED', 'ULED'],
        '65"': ['LED', 'ULED'],
        '75"': ['ULED'],
        '85"': ['ULED']
      },
      series: {
        'LED': ['32A4', '43A6', '55A7'],
        'ULED': ['55U6', '65U7', '75U8']
      }
    },
    'TCL': {
      sizes: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
      techs: {
        '32"': ['LED'],
        '43"': ['LED'],
        '50"': ['LED', 'QLED'],
        '55"': ['LED', 'QLED', 'Mini LED'],
        '65"': ['LED', 'QLED', 'Mini LED'],
        '75"': ['QLED', 'Mini LED'],
        '85"': ['Mini LED']
      },
      series: {
        'LED': ['43P635', '50P735'],
        'QLED': ['55C645', '65C745'],
        'Mini LED': ['75C845']
      }
    },
    'Vitron': {
      sizes: ['24"', '32"', '43"', '50"', '55"', '65"'],
      series: {
        'LED': ['32 Smart', '43 Smart', '50 Smart', '55 Smart', '65 Smart']
      }
    },
    'Vision Plus': {
      sizes: ['32"', '43"', '50"', '55"', '65"'],
      series: {
        'LED': ['32 VP8832', '43 VP8843', '50 VP8850', '65 VP8865']
      }
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO SPECS: Intelligent categorization for Audio Equipment (AudioForm.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const AUDIO_SPECS = {
  equipmentTypes: [
    'Soundbar', 'Home Theatre', 'Woofer', 'Subwoofer', 'Amplifier', 'Speaker',
    'Bluetooth Speaker', 'Headphones', 'Earphones', 'Microphone', 'DJ Equipment',
    'PA System', 'Car Audio', 'Mixer', 'Studio Equipment', 'Receiver', 'Turntable'
  ],
  channels: ['2.0', '2.1', '3.1', '5.0', '5.1', '7.1', '9.1', '11.1'],
  connectivity: ['Bluetooth', 'Wi-Fi', 'HDMI', 'HDMI ARC', 'HDMI eARC', 'USB', 'Optical', 'AUX'],
  conditions: ['Brand New', 'Open Box', 'Ex-UK', 'Foreign Used', 'Locally Used', 'Refurbished'],
  
  hierarchy: {
    'Soundbar': {
      brands: ['Samsung', 'LG', 'Sony', 'JBL', 'Hisense', 'TCL', 'Skyworth', 'Vision Plus', 'Vitron', 'Bose', 'Sonos', 'Yamaha', 'Panasonic', 'Philips'],
      brandData: {
        'JBL': {
          series: ['Bar Series'],
          models: {
            'Bar Series': ['JBL Bar 2.0 All-in-One', 'JBL Bar 2.1', 'JBL Bar 2.1 Deep Bass', 'JBL Bar 3.1', 'JBL Bar 5.0 MultiBeam', 'JBL Bar 5.1', 'JBL Bar 5.1 Surround', 'JBL Bar 9.1 True Wireless Surround', 'JBL Bar 300', 'JBL Bar 500', 'JBL Bar 700', 'JBL Bar 800', 'JBL Bar 1000', 'JBL Bar 1300', 'JBL Bar 1300X']
          }
        },
        'Samsung': {
          series: ['B Series', 'Q Series', 'S Series'],
          models: {
            'B Series': ['HW-B450', 'HW-B550'],
            'Q Series': ['HW-Q600', 'HW-Q700', 'HW-Q800', 'HW-Q930', 'HW-Q990'],
            'S Series': ['HW-S50', 'HW-S60', 'HW-S800']
          }
        },
        'LG': {
          series: ['SN Series', 'SP Series', 'SC Series', 'SG Series', 'S Series'],
          models: {
            'SN Series': ['SN4', 'SN5'],
            'SP Series': ['SP8', 'SP9'],
            'SC Series': ['SC9'],
            'SG Series': ['SG10'],
            'S Series': ['S40', 'S60']
          }
        },
        'Sony': {
          series: ['HT Series'],
          models: {
            'HT Series': ['HT-S20', 'HT-S40', 'HT-G700', 'HT-A3000', 'HT-A5000', 'HT-A7000']
          }
        },
        'Hisense': {
          series: ['Standard'],
          models: {
            'Standard': ['HS2100', 'HS214', 'HS218', 'AX3100']
          }
        },
        'TCL': {
          series: ['TS Series', 'S Series'],
          models: {
            'TS Series': ['TS3010', 'TS6100', 'TS8132'],
            'S Series': ['S643W']
          }
        },
        'Bose': {
          series: ['Smart Soundbar'],
          models: {
            'Smart Soundbar': ['Smart Soundbar 300', 'Smart Soundbar 600', 'Smart Soundbar 900', 'Ultra Soundbar']
          }
        },
        'Sonos': {
          series: ['Standard'],
          models: {
            'Standard': ['Ray', 'Beam', 'Beam Gen 2', 'Arc', 'Arc Ultra']
          }
        },
        'Yamaha': {
          series: ['YAS Series', 'SR Series'],
          models: {
            'YAS Series': ['YAS-109', 'YAS-209', 'YAS-209BL'],
            'SR Series': ['SR-B20A', 'SR-C20A']
          }
        }
      }
    },

    // ── HOME THEATRE ──────────────────────────────────────────────────────────
    'Home Theatre': {
      brands: ['Samsung', 'LG', 'Sony', 'JBL', 'Hisense', 'Yamaha', 'Denon', 'Marantz', 'Bose', 'Philips', 'Panasonic', 'Pioneer', 'Onkyo', 'Vision Plus', 'Vitron'],
      brandData: {
        'Samsung': {
          series: ['HT Series'],
          models: { 'HT Series': ['HT-J4500', 'HT-J5500', 'HT-J7750W', 'HT-H7500'] }
        },
        'LG': {
          series: ['LHD Series', 'DH Series'],
          models: {
            'LHD Series': ['LHD625', 'LHD756', 'LHD857'],
            'DH Series': ['DH6530T', 'DH7630T']
          }
        },
        'Sony': {
          series: ['BDV Series', 'HBD Series'],
          models: {
            'BDV Series': ['BDV-E190', 'BDV-E3200', 'BDV-N7200W', 'BDV-N9200W'],
            'HBD Series': ['HBD-E190', 'HBD-E3200']
          }
        },
        'JBL': {
          series: ['Cinema Series'],
          models: { 'Cinema Series': ['Cinema SB110', 'Cinema SB120', 'Cinema SB150', 'Cinema 510', 'Cinema 610'] }
        },
        'Philips': {
          series: ['HTB Series'],
          models: { 'HTB Series': ['HTB3520', 'HTB5570', 'HTB7250'] }
        },
        'Yamaha': {
          series: ['YHT Series'],
          models: { 'YHT Series': ['YHT-1840', 'YHT-3072', 'YHT-4950'] }
        },
        'Denon': {
          series: ['DHT Series'],
          models: { 'DHT Series': ['DHT-S217', 'DHT-S316', 'DHT-S517'] }
        },
        'Onkyo': {
          series: ['HT-S Series'],
          models: { 'HT-S Series': ['HT-S3910', 'HT-S5915', 'HT-S7805'] }
        },
        'Pioneer': {
          series: ['HTP Series'],
          models: { 'HTP Series': ['HTP-074', 'HTP-208', 'HTP-YL35'] }
        }
      }
    },

    // ── WOOFER ────────────────────────────────────────────────────────────────
    'Woofer': {
      brands: ['Sony', 'LG', 'Samsung', 'JBL', 'Vitron', 'Vision Plus', 'Syinix', 'Sayona', 'Bruhm', 'Mika', 'Amtec', 'Hisense', 'TCL'],
      brandData: {
        'Sony': {
          series: ['GTK Series', 'MHC Series'],
          models: {
            'GTK Series': ['GTK-XB5', 'GTK-XB7', 'GTK-XB90'],
            'MHC Series': ['MHC-V11', 'MHC-V21D', 'MHC-V41D', 'MHC-V71D', 'MHC-V81D', 'MHC-V90DW']
          }
        },
        'LG': {
          series: ['XBOOM Series'],
          models: { 'XBOOM Series': ['XBOOM XL5', 'XBOOM XL7', 'XBOOM XL9', 'RN5', 'RN7', 'RN9'] }
        },
        'JBL': {
          series: ['PartyBox Series'],
          models: { 'PartyBox Series': ['PartyBox 110', 'PartyBox 310', 'PartyBox 710', 'PartyBox 1000'] }
        },
        'Vitron': {
          series: ['Standard'],
          models: { 'Standard': ['V-8500BT', 'V-8800BT', 'V-9000BT'] }
        },
        'Sayona': {
          series: ['Standard'],
          models: { 'Standard': ['SHT-1120BT', 'SHT-1152BT', 'SHT-1175BT', 'SHT-1178BT'] }
        }
      }
    },

    // ── SUBWOOFER ─────────────────────────────────────────────────────────────
    'Subwoofer': {
      brands: ['JBL', 'Sony', 'Samsung', 'LG', 'Bose', 'Klipsch', 'SVS', 'Polk Audio', 'Denon', 'Yamaha', 'KEF', 'REL'],
      brandData: {
        'JBL': {
          series: ['Stage Series', 'Club Series'],
          models: {
            'Stage Series': ['Stage 200P', 'Stage 201P', 'Stage 210P'],
            'Club Series': ['Club WS1000']
          }
        },
        'Sony': {
          series: ['SA-CS Series'],
          models: { 'SA-CS Series': ['SA-CS9', 'SA-SW3', 'SA-SW5'] }
        },
        'Samsung': {
          series: ['SWA Series'],
          models: { 'SWA Series': ['SWA-9200S', 'SWA-9500S'] }
        },
        'Klipsch': {
          series: ['R Series'],
          models: { 'R Series': ['R-10SW', 'R-12SW', 'R-100SW', 'R-120SW', 'SPL-120SW'] }
        },
        'SVS': {
          series: ['SB Series', 'PB Series'],
          models: {
            'SB Series': ['SB-1000 Pro', 'SB-2000 Pro', 'SB-3000'],
            'PB Series': ['PB-1000 Pro', 'PB-2000 Pro', 'PB-3000']
          }
        },
        'Polk Audio': {
          series: ['HTS Series'],
          models: { 'HTS Series': ['HTS 10', 'HTS 12'] }
        }
      }
    },

    // ── AMPLIFIER ─────────────────────────────────────────────────────────────
    'Amplifier': {
      brands: ['Yamaha', 'Denon', 'Marantz', 'Pioneer', 'Onkyo', 'Sony', 'Cambridge Audio', 'NAD', 'Crown', 'QSC', 'Harman Kardon', 'JBL'],
      brandData: {
        'Yamaha': {
          series: ['A Series', 'RX Series (AV)'],
          models: {
            'A Series': ['A-S301', 'A-S501', 'A-S701', 'A-S1200', 'A-S2200'],
            'RX Series (AV)': ['RX-V4A', 'RX-V6A', 'RX-A2A', 'RX-A4A', 'RX-A6A', 'RX-A8A']
          }
        },
        'Denon': {
          series: ['PMA Series', 'AVR Series'],
          models: {
            'PMA Series': ['PMA-600NE', 'PMA-800NE', 'PMA-1600NE', 'PMA-2500NE'],
            'AVR Series': ['AVR-X1700H', 'AVR-X2700H', 'AVR-X3700H', 'AVR-X4700H', 'AVR-X6700H']
          }
        },
        'Marantz': {
          series: ['PM Series', 'SR Series'],
          models: {
            'PM Series': ['PM5005', 'PM6007', 'PM7000N', 'PM8006'],
            'SR Series': ['SR5015', 'SR6015', 'SR7015', 'SR8015']
          }
        },
        'Sony': {
          series: ['STR Series'],
          models: { 'STR Series': ['STR-DH590', 'STR-DH790', 'STR-AN1000'] }
        },
        'Cambridge Audio': {
          series: ['AXA Series', 'CXA Series'],
          models: {
            'AXA Series': ['AXA25', 'AXA35'],
            'CXA Series': ['CXA61', 'CXA81']
          }
        }
      }
    },

    // ── BLUETOOTH SPEAKER ─────────────────────────────────────────────────────
    'Bluetooth Speaker': {
      brands: ['JBL', 'Bose', 'Sony', 'Marshall', 'Anker', 'Ultimate Ears', 'Harman Kardon', 'Tribit', 'Vitron', 'Vision Plus', 'Sayona', 'Mika'],
      brandData: {
        'JBL': {
          series: ['Flip Series', 'Charge Series', 'Xtreme Series', 'Go Series', 'Clip Series', 'Boombox Series'],
          models: {
            'Flip Series': ['Flip 4', 'Flip 5', 'Flip 6', 'Flip 7'],
            'Charge Series': ['Charge 4', 'Charge 5', 'Charge 5 Wi-Fi'],
            'Xtreme Series': ['Xtreme 2', 'Xtreme 3', 'Xtreme 4'],
            'Go Series': ['Go 3', 'Go 3 Eco', 'Go 4'],
            'Clip Series': ['Clip 3', 'Clip 4', 'Clip 4 Eco', 'Clip 5'],
            'Boombox Series': ['Boombox 2', 'Boombox 3']
          }
        },
        'Bose': {
          series: ['SoundLink Series'],
          models: {
            'SoundLink Series': ['SoundLink Flex', 'SoundLink Flex 2', 'SoundLink Max', 'SoundLink Mini II', 'SoundLink Revolve+']
          }
        },
        'Sony': {
          series: ['SRS-XB Series', 'SRS-XG Series'],
          models: {
            'SRS-XB Series': ['SRS-XB13', 'SRS-XB23', 'SRS-XB33', 'SRS-XB43', 'SRS-XB100'],
            'SRS-XG Series': ['SRS-XG300', 'SRS-XG500']
          }
        },
        'Marshall': {
          series: ['Stockwell', 'Emberton', 'Kilburn', 'Tufton', 'Woburn'],
          models: {
            'Stockwell': ['Stockwell II', 'Stockwell III'],
            'Emberton': ['Emberton', 'Emberton II', 'Emberton III'],
            'Kilburn': ['Kilburn II'],
            'Tufton': ['Tufton'],
            'Woburn': ['Woburn II', 'Woburn III']
          }
        },
        'Anker': {
          series: ['Soundcore Series'],
          models: { 'Soundcore Series': ['Motion Boom', 'Motion Boom Plus', 'Motion X600', 'Motion X500', 'Rave Neo 2', 'Flare 2'] }
        },
        'Ultimate Ears': {
          series: ['BOOM Series', 'WONDERBOOM Series', 'HYPERBOOM Series'],
          models: {
            'BOOM Series': ['BOOM 3', 'MEGABOOM 3', 'BOOM 4', 'MEGABOOM 4'],
            'WONDERBOOM Series': ['WONDERBOOM 3', 'WONDERBOOM 4'],
            'HYPERBOOM Series': ['HYPERBOOM']
          }
        },
        'Harman Kardon': {
          series: ['Onyx Series', 'Aura Series'],
          models: {
            'Onyx Series': ['Onyx Studio 6', 'Onyx Studio 7', 'Onyx Studio 8'],
            'Aura Series': ['Aura Studio 3', 'Aura Studio 4']
          }
        }
      }
    },

    // ── HEADPHONES ────────────────────────────────────────────────────────────
    'Headphones': {
      brands: ['Sony', 'Bose', 'Apple', 'Samsung', 'Sennheiser', 'Audio-Technica', 'JBL', 'Beats', 'AKG', 'Jabra', 'Anker', 'Edifier'],
      brandData: {
        'Sony': {
          series: ['WH Series', 'MDR Series'],
          models: {
            'WH Series': ['WH-1000XM4', 'WH-1000XM5', 'WH-CH520', 'WH-CH720N', 'WH-XB910N'],
            'MDR Series': ['MDR-7506', 'MDR-ZX310', 'MDR-ZX770BN']
          }
        },
        'Bose': {
          series: ['QuietComfort Series'],
          models: {
            'QuietComfort Series': ['QuietComfort 45', 'QuietComfort Ultra', 'QuietComfort 35 II', 'Noise Cancelling 700']
          }
        },
        'Apple': {
          series: ['AirPods Max'],
          models: { 'AirPods Max': ['AirPods Max (USB-C)', 'AirPods Max (Lightning)'] }
        },
        'Sennheiser': {
          series: ['HD Series', 'Momentum Series', 'ACCENTUM Series'],
          models: {
            'HD Series': ['HD 200 Pro', 'HD 400S', 'HD 450BT', 'HD 560S', 'HD 600', 'HD 650', 'HD 660S2', 'HD 800 S'],
            'Momentum Series': ['Momentum 3', 'Momentum 4', 'Momentum True Wireless 3', 'Momentum True Wireless 4'],
            'ACCENTUM Series': ['ACCENTUM', 'ACCENTUM Plus', 'ACCENTUM True Wireless']
          }
        },
        'JBL': {
          series: ['Tune Series', 'Live Series'],
          models: {
            'Tune Series': ['Tune 510BT', 'Tune 520BT', 'Tune 710BT', 'Tune 770NC'],
            'Live Series': ['Live 460NC', 'Live 660NC', 'Live 770NC']
          }
        },
        'Beats': {
          series: ['Studio Series', 'Solo Series'],
          models: {
            'Studio Series': ['Studio 3', 'Studio Pro'],
            'Solo Series': ['Solo 3', 'Solo 4']
          }
        },
        'Audio-Technica': {
          series: ['ATH-M Series'],
          models: { 'ATH-M Series': ['ATH-M20x', 'ATH-M30x', 'ATH-M40x', 'ATH-M50x', 'ATH-M50xBT2'] }
        }
      }
    },

    // ── EARPHONES ─────────────────────────────────────────────────────────────
    'Earphones': {
      brands: ['Apple', 'Samsung', 'Sony', 'JBL', 'Jabra', 'Sennheiser', 'Anker', 'Xiaomi', 'Huawei', 'OnePlus', 'Realme', 'Nothing', 'Beats'],
      brandData: {
        'Apple': {
          series: ['AirPods Series', 'EarPods'],
          models: {
            'AirPods Series': ['AirPods 2', 'AirPods 3', 'AirPods 4', 'AirPods Pro 2'],
            'EarPods': ['EarPods with USB-C', 'EarPods with Lightning', 'EarPods with 3.5mm']
          }
        },
        'Samsung': {
          series: ['Galaxy Buds Series'],
          models: { 'Galaxy Buds Series': ['Galaxy Buds Live', 'Galaxy Buds Pro', 'Galaxy Buds 2', 'Galaxy Buds 2 Pro', 'Galaxy Buds FE', 'Galaxy Buds3', 'Galaxy Buds3 Pro'] }
        },
        'Sony': {
          series: ['WF Series', 'LinkBuds Series'],
          models: {
            'WF Series': ['WF-1000XM4', 'WF-1000XM5', 'WF-C500', 'WF-C700N'],
            'LinkBuds Series': ['LinkBuds', 'LinkBuds S', 'LinkBuds Open']
          }
        },
        'JBL': {
          series: ['Tune Series', 'Reflect Series'],
          models: {
            'Tune Series': ['Tune 115TWS', 'Tune 125TWS', 'Tune 130NC TWS', 'Tune 215TWS'],
            'Reflect Series': ['Reflect Flow', 'Reflect Flow Pro', 'Reflect Mini NC']
          }
        },
        'Anker': {
          series: ['Soundcore Series'],
          models: { 'Soundcore Series': ['Liberty 4', 'Liberty 4 NC', 'Liberty 4 Pro', 'Space A40', 'P30i', 'P40i'] }
        },
        'Jabra': {
          series: ['Elite Series'],
          models: { 'Elite Series': ['Elite 3', 'Elite 4', 'Elite 5', 'Elite 7 Pro', 'Elite 75t', 'Elite 85t'] }
        },
        'Nothing': {
          series: ['Ear Series'],
          models: { 'Ear Series': ['Ear (1)', 'Ear (2)', 'Ear (a)', 'Ear (open)'] }
        }
      }
    },

    // ── MICROPHONE ────────────────────────────────────────────────────────────
    'Microphone': {
      brands: ['Shure', 'Audio-Technica', 'Blue (Logitech)', 'Rode', 'Sennheiser', 'AKG', 'Behringer', 'Samson', 'HyperX', 'Razer', 'Fifine'],
      brandData: {
        'Shure': {
          series: ['SM Series', 'MV Series', 'PGA Series'],
          models: {
            'SM Series': ['SM7B', 'SM7dB', 'SM58', 'SM57', 'SM86'],
            'MV Series': ['MV7', 'MV7+', 'MV5', 'MV51'],
            'PGA Series': ['PGA48', 'PGA58', 'PGA81', 'PGA27']
          }
        },
        'Audio-Technica': {
          series: ['AT Series', 'ATR Series'],
          models: {
            'AT Series': ['AT2020', 'AT2020USB+', 'AT2035', 'AT2050', 'AT4040', 'AT4050'],
            'ATR Series': ['ATR2100x-USB', 'ATR2500x-USB']
          }
        },
        'Rode': {
          series: ['NT Series', 'Wireless Series'],
          models: {
            'NT Series': ['NT1', 'NT1 5th Gen', 'NT1-A', 'NT2-A', 'NT-USB', 'NT-USB+'],
            'Wireless Series': ['Wireless GO II', 'Wireless ME', 'Wireless FILMMAKER KIT']
          }
        },
        'Blue (Logitech)': {
          series: ['Yeti Series', 'Snowball Series'],
          models: {
            'Yeti Series': ['Yeti', 'Yeti X', 'Yeti Nano', 'Yeti GX'],
            'Snowball Series': ['Snowball', 'Snowball iCE']
          }
        },
        'Fifine': {
          series: ['USB Series', 'XLR Series'],
          models: {
            'USB Series': ['K669B', 'K678', 'K683A', 'AM8'],
            'XLR Series': ['K688', 'AmpliGame A8']
          }
        }
      }
    },

    // ── DJ EQUIPMENT ─────────────────────────────────────────────────────────
    'DJ Equipment': {
      brands: ['Pioneer DJ', 'Denon DJ', 'Numark', 'Rane', 'Reloop', 'Native Instruments', 'Allen & Heath', 'Hercules'],
      brandData: {
        'Pioneer DJ': {
          series: ['CDJ Series', 'DDJ Series', 'XDJ Series', 'DJM Series'],
          models: {
            'CDJ Series': ['CDJ-2000NXS2', 'CDJ-3000'],
            'DDJ Series': ['DDJ-200', 'DDJ-400', 'DDJ-800', 'DDJ-1000', 'DDJ-FLX4', 'DDJ-FLX6', 'DDJ-FLX10', 'DDJ-REV1', 'DDJ-REV5', 'DDJ-REV7'],
            'XDJ Series': ['XDJ-RR', 'XDJ-RX3', 'XDJ-XZ'],
            'DJM Series': ['DJM-250MK2', 'DJM-450', 'DJM-750MK2', 'DJM-900NXS2', 'DJM-A9', 'DJM-S9', 'DJM-S11']
          }
        },
        'Denon DJ': {
          series: ['SC Series', 'Prime Series'],
          models: {
            'SC Series': ['SC6000M', 'SC5000M'],
            'Prime Series': ['Prime 2', 'Prime 4+', 'Prime GO']
          }
        },
        'Numark': {
          series: ['Mixtrack Series', 'NS Series'],
          models: {
            'Mixtrack Series': ['Mixtrack Platinum FX', 'Mixtrack Pro FX'],
            'NS Series': ['NS6II', 'NS7III']
          }
        },
        'Native Instruments': {
          series: ['Traktor Series'],
          models: { 'Traktor Series': ['Traktor Kontrol S2 MK3', 'Traktor Kontrol S3', 'Traktor Kontrol S4 MK3', 'Traktor Kontrol Z1 MK2'] }
        }
      }
    },

    // ── PA SYSTEM ─────────────────────────────────────────────────────────────
    'PA System': {
      brands: ['JBL', 'Yamaha', 'Bose', 'QSC', 'Electro-Voice', 'Mackie', 'Behringer', 'Alto Professional', 'Peavey'],
      brandData: {
        'JBL': {
          series: ['EON Series', 'PRX Series', 'SRX Series'],
          models: {
            'EON Series': ['EON615', 'EON618S', 'EON712', 'EON718S', 'EON ONE Compact', 'EON ONE MK2'],
            'PRX Series': ['PRX815W', 'PRX818XLFW', 'PRX835W'],
            'SRX Series': ['SRX815P', 'SRX818SP', 'SRX835P']
          }
        },
        'Yamaha': {
          series: ['DXR Series', 'DBR Series', 'DSR Series'],
          models: {
            'DXR Series': ['DXR8', 'DXR10', 'DXR12', 'DXR15'],
            'DBR Series': ['DBR10', 'DBR12', 'DBR15'],
            'DSR Series': ['DSR112', 'DSR115', 'DSR118W', 'DSR215']
          }
        },
        'QSC': {
          series: ['K Series', 'CP Series'],
          models: {
            'K Series': ['K8.2', 'K10.2', 'K12.2', 'K Sub', 'KS118'],
            'CP Series': ['CP8', 'CP12']
          }
        },
        'Mackie': {
          series: ['Thump Series', 'SRM Series'],
          models: {
            'Thump Series': ['Thump12A', 'Thump15A', 'Thump18S'],
            'SRM Series': ['SRM450v3', 'SRM550', 'SRM650']
          }
        },
        'Behringer': {
          series: ['Eurolive Series'],
          models: { 'Eurolive Series': ['B212D', 'B215D', 'B218XL', 'VP1220D', 'VP1520D', 'B1800D Pro'] }
        }
      }
    },

    // ── CAR AUDIO ─────────────────────────────────────────────────────────────
    'Car Audio': {
      brands: ['Pioneer', 'Sony', 'JVC', 'Kenwood', 'Alpine', 'JBL', 'Clarion', 'Boss Audio', 'Focal', 'Hertz', 'Rockford Fosgate'],
      brandData: {
        'Pioneer': {
          series: ['AVH Series', 'DMH Series', 'MVH Series'],
          models: {
            'AVH Series': ['AVH-1550NEX', 'AVH-2550NEX', 'AVH-3550NEX', 'AVH-W4500NEX'],
            'DMH Series': ['DMH-A345BT', 'DMH-A5100BT', 'DMH-W4660NEX'],
            'MVH Series': ['MVH-S215BT', 'MVH-S315BT']
          }
        },
        'Sony': {
          series: ['XAV Series', 'DSX Series'],
          models: {
            'XAV Series': ['XAV-AX1000', 'XAV-AX3000', 'XAV-AX4000', 'XAV-AX5000', 'XAV-AX6000', 'XAV-AX8000'],
            'DSX Series': ['DSX-GS80']
          }
        },
        'Kenwood': {
          series: ['DMX Series', 'DDX Series'],
          models: {
            'DMX Series': ['DMX125BT', 'DMX4707S', 'DMX5020S', 'DMX7706S', 'DMX8020S'],
            'DDX Series': ['DDX9020DABS', 'DDX9020S']
          }
        },
        'Alpine': {
          series: ['iLX Series', 'INE Series'],
          models: {
            'iLX Series': ['iLX-W650', 'iLX-W690D', 'iLX-F115D', 'iLX-F511D'],
            'INE Series': ['INE-W611DC', 'INE-W720D']
          }
        },
        'JVC': {
          series: ['KW Series', 'KD Series'],
          models: {
            'KW Series': ['KW-M560BT', 'KW-M780BT', 'KW-M900BW', 'KW-V960BW'],
            'KD Series': ['KD-T716BT', 'KD-X472BT', 'KD-X282BT']
          }
        }
      }
    },

    // ── MIXER ─────────────────────────────────────────────────────────────────
    'Mixer': {
      brands: ['Yamaha', 'Behringer', 'Mackie', 'Allen & Heath', 'Soundcraft', 'PreSonus', 'Tascam', 'Zoom', 'Roland'],
      brandData: {
        'Yamaha': {
          series: ['MG Series', 'TF Series', 'CL Series'],
          models: {
            'MG Series': ['MG06X', 'MG10XU', 'MG12XU', 'MG16XU', 'MG20XU'],
            'TF Series': ['TF1', 'TF3', 'TF5'],
            'CL Series': ['CL1', 'CL3', 'CL5']
          }
        },
        'Behringer': {
          series: ['Xenyx Series', 'X-Air Series', 'Wing Series'],
          models: {
            'Xenyx Series': ['Xenyx 802S', 'Xenyx Q802USB', 'Xenyx Q1204USB', 'Xenyx X1832USB'],
            'X-Air Series': ['XR12', 'XR16', 'XR18', 'X18'],
            'Wing Series': ['WING', 'WING Rack', 'WING Compact']
          }
        },
        'Mackie': {
          series: ['ProFX Series', 'Mix Series', 'DL Series'],
          models: {
            'ProFX Series': ['ProFX6v3', 'ProFX10v3', 'ProFX12v3', 'ProFX16v3', 'ProFX22v3'],
            'Mix Series': ['Mix5', 'Mix8', 'Mix12FX'],
            'DL Series': ['DL16S', 'DL32S', 'DL32R']
          }
        },
        'Allen & Heath': {
          series: ['ZED Series', 'SQ Series', 'Avantis Series'],
          models: {
            'ZED Series': ['ZED-6', 'ZED-10FX', 'ZED-16FX', 'ZED-22FX'],
            'SQ Series': ['SQ-5', 'SQ-6', 'SQ-7'],
            'Avantis Series': ['Avantis', 'Avantis Solo']
          }
        }
      }
    },

    // ── STUDIO EQUIPMENT ─────────────────────────────────────────────────────
    'Studio Equipment': {
      brands: ['Focusrite', 'Universal Audio', 'PreSonus', 'Native Instruments', 'Arturia', 'M-Audio', 'Audient', 'Roland'],
      brandData: {
        'Focusrite': {
          series: ['Scarlett Series', 'Clarett Series'],
          models: {
            'Scarlett Series': ['Scarlett Solo', 'Scarlett 2i2', 'Scarlett 4i4', 'Scarlett 8i6', 'Scarlett 18i20'],
            'Clarett Series': ['Clarett+ 2Pre', 'Clarett+ 4Pre', 'Clarett+ 8Pre']
          }
        },
        'Universal Audio': {
          series: ['Apollo Series'],
          models: { 'Apollo Series': ['Apollo Solo', 'Apollo Twin X Duo', 'Apollo Twin X Quad', 'Apollo x4', 'Apollo x6', 'Apollo x8', 'Apollo x16'] }
        },
        'PreSonus': {
          series: ['AudioBox Series', 'Studio Series'],
          models: {
            'AudioBox Series': ['AudioBox USB 96', 'AudioBox iTwo'],
            'Studio Series': ['Studio 24c', 'Studio 26c', 'Studio 68c', 'Studio 192']
          }
        },
        'Native Instruments': {
          series: ['Komplete Audio', 'Maschine Series'],
          models: {
            'Komplete Audio': ['Komplete Audio 1', 'Komplete Audio 2', 'Komplete Audio 6 MK2'],
            'Maschine Series': ['Maschine+', 'Maschine MK3', 'Maschine Mikro MK3']
          }
        },
        'M-Audio': {
          series: ['Air Series'],
          models: { 'Air Series': ['AIR 192|4', 'AIR 192|6', 'AIR 192|8', 'AIR 192|14'] }
        }
      }
    },

    // ── RECEIVER ─────────────────────────────────────────────────────────────
    'Receiver': {
      brands: ['Yamaha', 'Denon', 'Marantz', 'Sony', 'Onkyo', 'Pioneer', 'Harman Kardon', 'NAD'],
      brandData: {
        'Yamaha': {
          series: ['RX-V Series', 'RX-A Aventage Series'],
          models: {
            'RX-V Series': ['RX-V4A', 'RX-V6A', 'RX-V8A'],
            'RX-A Aventage Series': ['RX-A2A', 'RX-A4A', 'RX-A6A', 'RX-A8A']
          }
        },
        'Denon': {
          series: ['AVR-X Series', 'AVR-S Series'],
          models: {
            'AVR-X Series': ['AVR-X1700H', 'AVR-X2700H', 'AVR-X3700H', 'AVR-X4700H', 'AVR-X6700H'],
            'AVR-S Series': ['AVR-S570BT', 'AVR-S660H', 'AVR-S760H', 'AVR-S970H']
          }
        },
        'Marantz': {
          series: ['SR Series', 'Cinema Series'],
          models: {
            'SR Series': ['SR5015', 'SR6015', 'SR7015', 'SR8015'],
            'Cinema Series': ['Cinema 60', 'Cinema 70s', 'Cinema 80s']
          }
        },
        'Sony': {
          series: ['STR-AN Series', 'STR-DH Series'],
          models: {
            'STR-AN Series': ['STR-AN1000'],
            'STR-DH Series': ['STR-DH590', 'STR-DH790']
          }
        },
        'Harman Kardon': {
          series: ['AVR Series'],
          models: { 'AVR Series': ['AVR 151S', 'AVR 161S', 'AVR 171S', 'AVR 271', 'AVR 370'] }
        }
      }
    },

    // ── TURNTABLE ─────────────────────────────────────────────────────────────
    'Turntable': {
      brands: ['Audio-Technica', 'Rega', 'Pro-Ject', 'Denon', 'Pioneer DJ', 'Technics', 'Crosley', 'Victrola', 'U-Turn'],
      brandData: {
        'Audio-Technica': {
          series: ['AT-LP Series'],
          models: { 'AT-LP Series': ['AT-LP60X', 'AT-LP60XBT', 'AT-LP120XBT-USB', 'AT-LP120XUSB', 'AT-LP140XP', 'AT-LP5x', 'AT-LP7', 'AT-LPW30TK', 'AT-LPW50BT-RW'] }
        },
        'Rega': {
          series: ['Planar Series'],
          models: { 'Planar Series': ['Planar 1', 'Planar 1 Plus', 'Planar 2', 'Planar 3', 'Planar 6', 'Planar 8', 'Planar 10'] }
        },
        'Pro-Ject': {
          series: ['Debut Series', 'T Series', 'X Series'],
          models: {
            'Debut Series': ['Debut Carbon EVO', 'Debut EVO', 'Debut PRO'],
            'T Series': ['T1 Phono SB', 'T1 BT'],
            'X Series': ['X1', 'X2 B', 'X8 Evolution']
          }
        },
        'Pioneer DJ': {
          series: ['PLX Series'],
          models: { 'PLX Series': ['PLX-500', 'PLX-1000'] }
        },
        'Technics': {
          series: ['SL Series'],
          models: { 'SL Series': ['SL-1200MK7', 'SL-1210MK7', 'SL-1500C', 'SL-1000R'] }
        },
        'Crosley': {
          series: ['Cruiser Series', 'C Series'],
          models: {
            'Cruiser Series': ['Cruiser Plus', 'Cruiser Deluxe'],
            'C Series': ['C6', 'C8', 'C62', 'C100']
          }
        }
      }
    },

    // ── SPEAKER ───────────────────────────────────────────────────────────────
    'Speaker': {
      brands: ['JBL', 'Bose', 'Klipsch', 'KEF', 'Sony', 'Polk Audio', 'Sonos', 'Yamaha', 'Wharfedale', 'Vitron', 'Vision Plus'],
      brandData: {
        'JBL': {
          series: ['Studio Series', 'L Series', 'HDI Series'],
          models: {
            'Studio Series': ['Studio 220', 'Studio 230', 'Studio 520C', 'Studio 530', 'Studio 590'],
            'L Series': ['L52 Classic', 'L82 Classic', 'L100 Classic'],
            'HDI Series': ['HDI-1600', 'HDI-3600', 'HDI-4500']
          }
        },
        'Klipsch': {
          series: ['RP Series', 'R Series'],
          models: {
            'RP Series': ['RP-500M', 'RP-600M', 'RP-8000F', 'RP-500C', 'RP-504C'],
            'R Series': ['R-14M', 'R-15M', 'R-41M', 'R-51M', 'R-51PM', 'R-41PM']
          }
        },
        'Sony': {
          series: ['SS Series'],
          models: { 'SS Series': ['SS-CS3', 'SS-CS5', 'SS-CS8', 'SS-NA2ES', 'SS-NA5ES'] }
        },
        'Polk Audio': {
          series: ['Signature Elite', 'Reserve Series'],
          models: {
            'Signature Elite': ['ES10', 'ES15', 'ES20', 'ES60', 'ES90'],
            'Reserve Series': ['R100', 'R200', 'R400', 'R600', 'R700']
          }
        },
        'Sonos': {
          series: ['Standard'],
          models: { 'Standard': ['Era 100', 'Era 300', 'Five', 'Move 2'] }
        }
      }
    }

  }
};

export default CATEGORY_ATTRIBUTES;



