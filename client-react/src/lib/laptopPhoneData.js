// ─────────────────────────────────────────────────────────────────────────────
// LAPTOP & PHONE DATA: Intelligent dependency engine for LaptopForm / PhoneForm
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED SPEC OPTIONS ───────────────────────────────────────────────────────

export const LAPTOP_CONDITIONS = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];
export const PHONE_CONDITIONS  = ['Brand New', 'Open Box', 'Ex-UK', 'Ex-USA', 'Foreign Used', 'Locally Used', 'Refurbished'];

export const CPU_SPEEDS     = ['Under 2.0 GHz', '2.0–2.5 GHz', '2.5–3.0 GHz', '3.0–3.5 GHz', '3.5–4.0 GHz', '4.0+ GHz'];
export const RAM_SIZES      = ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB', '24GB', '32GB', '64GB', '128GB'];
export const RAM_TYPES      = ['DDR3', 'DDR4', 'DDR5', 'LPDDR4', 'LPDDR5'];
export const STORAGE_TYPES  = ['HDD', 'SSD', 'NVMe SSD', 'Hybrid (HDD + SSD)'];
export const STORAGE_SIZES  = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB'];
export const SCREEN_SIZES   = ['11"', '12"', '13"', '13.3"', '14"', '15.6"', '16"', '17"', '18"'];
export const RESOLUTIONS    = ['HD (1366×768)', 'FHD (1920×1080)', '2K (2560×1440)', 'QHD (2560×1600)', '4K (3840×2160)'];
export const OS_OPTIONS     = ['Windows 10', 'Windows 11', 'macOS', 'Linux', 'ChromeOS'];

export const PHONE_STORAGE  = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
export const PHONE_RAM      = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '24GB'];
export const PHONE_NETWORKS = ['2G', '3G', '4G LTE', '5G'];

// ── GPU DATA ──────────────────────────────────────────────────────────────────
export const GPU_OPTIONS = {
  'Integrated': [
    'Intel UHD Graphics', 'Intel Iris Xe', 'Intel Arc Graphics',
    'AMD Radeon Integrated', 'Apple M-Series GPU'
  ],
  'Dedicated – NVIDIA': [
    'GTX 1050', 'GTX 1050 Ti', 'GTX 1650', 'GTX 1650 Ti',
    'RTX 2050', 'RTX 3050', 'RTX 3050 Ti', 'RTX 3060', 'RTX 3070', 'RTX 3080',
    'RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090'
  ],
  'Dedicated – AMD': [
    'Radeon RX 6500M', 'Radeon RX 6600M', 'Radeon RX 6700M',
    'Radeon RX 7600M', 'Radeon RX 7700S', 'Radeon RX 7900M'
  ]
};

// ── PROCESSOR HIERARCHY ───────────────────────────────────────────────────────
export const PROCESSOR_DATA = {
  'Intel': {
    families: ['Celeron', 'Pentium', 'Core i3', 'Core i5', 'Core i7', 'Core i9', 'Core Ultra 5', 'Core Ultra 7', 'Core Ultra 9'],
    generations: [
      '4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen',
      '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen', '14th Gen', '15th Gen (Core Ultra)'
    ]
  },
  'AMD': {
    families: ['Athlon', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'],
    generations: ['3000 Series', '4000 Series', '5000 Series', '6000 Series', '7000 Series', '8000 Series']
  },
  'Apple Silicon': {
    families: ['M1', 'M2', 'M3', 'M4'],
    generations: ['Base', 'Pro', 'Max', 'Ultra']
  },
  'Snapdragon (ARM)': {
    families: ['Snapdragon 7c', 'Snapdragon 8cx Gen 3', 'Snapdragon X Elite', 'Snapdragon X Plus'],
    generations: ['Gen 1', 'Gen 2', 'Gen 3']
  }
};

// ── LAPTOP BRAND HIERARCHY ────────────────────────────────────────────────────
export const LAPTOP_DATA = {
  brands: ['HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Microsoft', 'Samsung', 'Toshiba', 'MSI', 'Razer', 'Huawei', 'LG'],

  hierarchy: {

    'HP': {
      series: ['EliteBook', 'ProBook', 'Pavilion', 'Envy', 'Spectre', 'Victus', 'Omen', 'ZBook', 'Chromebook', 'Notebook'],
      models: {
        'EliteBook': [
          'EliteBook 820 G3', 'EliteBook 820 G4',
          'EliteBook 830 G5', 'EliteBook 830 G6', 'EliteBook 830 G7', 'EliteBook 830 G8', 'EliteBook 830 G9', 'EliteBook 830 G10',
          'EliteBook 840 G3', 'EliteBook 840 G4', 'EliteBook 840 G5', 'EliteBook 840 G6', 'EliteBook 840 G7', 'EliteBook 840 G8', 'EliteBook 840 G9', 'EliteBook 840 G10',
          'EliteBook 850 G5', 'EliteBook 850 G6', 'EliteBook 850 G7', 'EliteBook 850 G8',
          'EliteBook 1030 G3', 'EliteBook 1030 G4',
          'EliteBook 1040 G4', 'EliteBook 1040 G9', 'EliteBook 1040 G10',
          'EliteBook x360 1030', 'EliteBook x360 1040'
        ],
        'ProBook': [
          'ProBook 430 G5', 'ProBook 430 G6', 'ProBook 430 G7', 'ProBook 430 G8',
          'ProBook 440 G5', 'ProBook 440 G6', 'ProBook 440 G7', 'ProBook 440 G8', 'ProBook 440 G9', 'ProBook 440 G10',
          'ProBook 450 G5', 'ProBook 450 G6', 'ProBook 450 G7', 'ProBook 450 G8', 'ProBook 450 G9', 'ProBook 450 G10',
          'ProBook 455 G7', 'ProBook 455 G8', 'ProBook 455 G9', 'ProBook 455 G10',
          'ProBook 650 G4', 'ProBook 650 G5'
        ],
        'Pavilion': [
          'Pavilion 14', 'Pavilion 15', 'Pavilion 15 eg', 'Pavilion 16',
          'Pavilion Aero 13', 'Pavilion Gaming 15', 'Pavilion Gaming 16',
          'Pavilion x360 14', 'Pavilion x360 15'
        ],
        'Envy': [
          'Envy 13', 'Envy 14', 'Envy 15', 'Envy 16',
          'Envy x360 13', 'Envy x360 14', 'Envy x360 15', 'Envy x360 16'
        ],
        'Spectre': [
          'Spectre x360 13', 'Spectre x360 14', 'Spectre x360 16'
        ],
        'Victus': [
          'Victus 15', 'Victus 16'
        ],
        'Omen': [
          'Omen 15', 'Omen 16', 'Omen 17'
        ],
        'ZBook': [
          'ZBook Fury 15 G8', 'ZBook Fury 16 G10',
          'ZBook Studio G5', 'ZBook Studio G8', 'ZBook Studio G10',
          'ZBook Power G7', 'ZBook Power G8', 'ZBook Power G10'
        ],
        'Chromebook': [
          'Chromebook 11', 'Chromebook 14', 'Chromebook x360 14'
        ],
        'Notebook': [
          'HP 14', 'HP 15', 'HP 250 G7', 'HP 250 G8', 'HP 255 G8', 'HP 255 G9'
        ]
      }
    },

    'Dell': {
      series: ['Inspiron', 'Latitude', 'Vostro', 'XPS', 'Precision', 'Alienware', 'Chromebook'],
      models: {
        'Inspiron': [
          'Inspiron 14', 'Inspiron 14 Plus', 'Inspiron 15', 'Inspiron 15 Plus', 'Inspiron 16',
          'Inspiron 14 2-in-1', 'Inspiron 16 2-in-1',
          'Inspiron 3501', 'Inspiron 3502', 'Inspiron 3511', 'Inspiron 3515', 'Inspiron 5501', 'Inspiron 5510'
        ],
        'Latitude': [
          'Latitude 3420', 'Latitude 3430', 'Latitude 3440',
          'Latitude 5290', 'Latitude 5300', 'Latitude 5310',
          'Latitude 5400', 'Latitude 5410', 'Latitude 5420', 'Latitude 5430', 'Latitude 5440',
          'Latitude 5490', 'Latitude 5500', 'Latitude 5510', 'Latitude 5520', 'Latitude 5530', 'Latitude 5540',
          'Latitude 7300', 'Latitude 7400', 'Latitude 7410', 'Latitude 7420', 'Latitude 7430',
          'Latitude 9420', 'Latitude 9430'
        ],
        'Vostro': [
          'Vostro 3400', 'Vostro 3420', 'Vostro 3430',
          'Vostro 5402', 'Vostro 5410', 'Vostro 5502', 'Vostro 5510',
          'Vostro 14 3000', 'Vostro 15 3000'
        ],
        'XPS': [
          'XPS 13', 'XPS 13 Plus', 'XPS 13 2-in-1',
          'XPS 15', 'XPS 15 9500', 'XPS 15 9510', 'XPS 15 9520',
          'XPS 17', 'XPS 17 9710', 'XPS 17 9720'
        ],
        'Precision': [
          'Precision 3560', 'Precision 3570', 'Precision 3580',
          'Precision 5560', 'Precision 5570', 'Precision 5580',
          'Precision 7670', 'Precision 7680'
        ],
        'Alienware': [
          'Alienware m15 R6', 'Alienware m15 R7',
          'Alienware m16', 'Alienware m16 R2',
          'Alienware m18', 'Alienware m18 R2',
          'Alienware x14', 'Alienware x15 R2', 'Alienware x17 R2'
        ],
        'Chromebook': [
          'Chromebook 3100', 'Chromebook 5190'
        ]
      }
    },

    'Lenovo': {
      series: ['ThinkPad', 'IdeaPad', 'Yoga', 'ThinkBook', 'Legion', 'LOQ'],
      models: {
        'ThinkPad': [
          'ThinkPad T14 Gen 1', 'ThinkPad T14 Gen 2', 'ThinkPad T14 Gen 3', 'ThinkPad T14 Gen 4',
          'ThinkPad T14s Gen 1', 'ThinkPad T14s Gen 2', 'ThinkPad T14s Gen 3',
          'ThinkPad T480', 'ThinkPad T490', 'ThinkPad T495',
          'ThinkPad T580', 'ThinkPad T590',
          'ThinkPad X1 Carbon Gen 7', 'ThinkPad X1 Carbon Gen 8', 'ThinkPad X1 Carbon Gen 9', 'ThinkPad X1 Carbon Gen 10', 'ThinkPad X1 Carbon Gen 11', 'ThinkPad X1 Carbon Gen 12',
          'ThinkPad X1 Yoga Gen 7', 'ThinkPad X1 Yoga Gen 8',
          'ThinkPad X280', 'ThinkPad X390', 'ThinkPad X395',
          'ThinkPad E14 Gen 1', 'ThinkPad E14 Gen 2', 'ThinkPad E14 Gen 3', 'ThinkPad E14 Gen 4', 'ThinkPad E14 Gen 5',
          'ThinkPad E15 Gen 1', 'ThinkPad E15 Gen 2', 'ThinkPad E15 Gen 3', 'ThinkPad E15 Gen 4',
          'ThinkPad L14 Gen 1', 'ThinkPad L14 Gen 2', 'ThinkPad L14 Gen 3',
          'ThinkPad L15 Gen 1', 'ThinkPad L15 Gen 2', 'ThinkPad L15 Gen 3'
        ],
        'IdeaPad': [
          'IdeaPad 3 14', 'IdeaPad 3 15', 'IdeaPad 3 17',
          'IdeaPad 5 14', 'IdeaPad 5 15', 'IdeaPad 5 Pro',
          'IdeaPad Slim 3', 'IdeaPad Slim 5', 'IdeaPad Slim 5i',
          'IdeaPad Gaming 3', 'IdeaPad Gaming 3i'
        ],
        'Yoga': [
          'Yoga 6', 'Yoga 7', 'Yoga 7i', 'Yoga 9i',
          'Yoga Slim 6', 'Yoga Slim 7', 'Yoga Slim 7i',
          'Yoga Book 9i'
        ],
        'ThinkBook': [
          'ThinkBook 13s', 'ThinkBook 14', 'ThinkBook 14 G2', 'ThinkBook 14 G4',
          'ThinkBook 15', 'ThinkBook 15 G2', 'ThinkBook 15 G4',
          'ThinkBook 16', 'ThinkBook 16 G6'
        ],
        'Legion': [
          'Legion 5 15', 'Legion 5 16', 'Legion 5 Pro',
          'Legion 5i 15', 'Legion 5i 16', 'Legion 5i Pro',
          'Legion 7 16', 'Legion 7i 16',
          'Legion 9i'
        ],
        'LOQ': [
          'LOQ 15APH9', 'LOQ 15IRX9', 'LOQ 16IRX9'
        ]
      }
    },

    'Apple': {
      series: ['MacBook Air', 'MacBook Pro'],
      models: {
        'MacBook Air': [
          'MacBook Air M1 13"',
          'MacBook Air M2 13"', 'MacBook Air M2 15"',
          'MacBook Air M3 13"', 'MacBook Air M3 15"'
        ],
        'MacBook Pro': [
          'MacBook Pro M1 13"', 'MacBook Pro M1 Pro 14"', 'MacBook Pro M1 Pro 16"', 'MacBook Pro M1 Max 14"', 'MacBook Pro M1 Max 16"',
          'MacBook Pro M2 13"', 'MacBook Pro M2 Pro 14"', 'MacBook Pro M2 Pro 16"', 'MacBook Pro M2 Max 14"', 'MacBook Pro M2 Max 16"',
          'MacBook Pro M3 14"', 'MacBook Pro M3 Pro 14"', 'MacBook Pro M3 Pro 16"', 'MacBook Pro M3 Max 14"', 'MacBook Pro M3 Max 16"',
          'MacBook Pro M4 14"', 'MacBook Pro M4 Pro 14"', 'MacBook Pro M4 Pro 16"', 'MacBook Pro M4 Max 14"', 'MacBook Pro M4 Max 16"'
        ]
      }
    },

    'Asus': {
      series: ['ZenBook', 'VivoBook', 'ROG', 'TUF Gaming', 'ExpertBook', 'ProArt', 'Chromebook'],
      models: {
        'ZenBook': [
          'ZenBook 13 UX325', 'ZenBook 14 UX425', 'ZenBook 14X UX5401',
          'ZenBook 15 UX534', 'ZenBook Pro Duo 15', 'ZenBook Duo 14'
        ],
        'VivoBook': [
          'VivoBook 14', 'VivoBook 14X', 'VivoBook 15', 'VivoBook 15X', 'VivoBook 16',
          'VivoBook S14', 'VivoBook S15', 'VivoBook Go 14', 'VivoBook Go 15'
        ],
        'ROG': [
          'ROG Zephyrus G14', 'ROG Zephyrus G16', 'ROG Zephyrus M16',
          'ROG Strix G15', 'ROG Strix G16', 'ROG Strix G17', 'ROG Strix G18',
          'ROG Strix SCAR 16', 'ROG Strix SCAR 17', 'ROG Flow X13', 'ROG Flow X16', 'ROG Flow Z13'
        ],
        'TUF Gaming': [
          'TUF Gaming A15', 'TUF Gaming A16', 'TUF Gaming A17',
          'TUF Gaming F15', 'TUF Gaming F17'
        ],
        'ExpertBook': [
          'ExpertBook B1 B1500', 'ExpertBook B5 B5302', 'ExpertBook B9 B9400'
        ],
        'ProArt': [
          'ProArt Studiobook 16', 'ProArt Studiobook Pro 16'
        ],
        'Chromebook': ['ASUS Chromebook Flip C536']
      }
    },

    'Acer': {
      series: ['Aspire', 'Swift', 'Nitro', 'Predator', 'ConceptD', 'Chromebook'],
      models: {
        'Aspire': [
          'Aspire 3', 'Aspire 5', 'Aspire 5 Slim', 'Aspire 7',
          'Aspire Lite 14', 'Aspire Lite 15'
        ],
        'Swift': [
          'Swift 1', 'Swift 3', 'Swift 3 SF314', 'Swift 5', 'Swift X', 'Swift Go 14', 'Swift Go 16'
        ],
        'Nitro': [
          'Nitro 5 AN515', 'Nitro 5 AN517', 'Nitro 16', 'Nitro V 15', 'Nitro V 16'
        ],
        'Predator': [
          'Predator Helios 16', 'Predator Helios 18',
          'Predator Triton 300', 'Predator Triton 500 SE'
        ],
        'ConceptD': [
          'ConceptD 3', 'ConceptD 5', 'ConceptD 7'
        ],
        'Chromebook': ['Chromebook Spin 311', 'Chromebook 315']
      }
    },

    'Microsoft': {
      series: ['Surface Pro', 'Surface Laptop', 'Surface Book', 'Surface Go'],
      models: {
        'Surface Pro': [
          'Surface Pro 7', 'Surface Pro 7+', 'Surface Pro 8',
          'Surface Pro 9', 'Surface Pro 10', 'Surface Pro 11'
        ],
        'Surface Laptop': [
          'Surface Laptop 3', 'Surface Laptop 4', 'Surface Laptop 5', 'Surface Laptop 6', 'Surface Laptop 7',
          'Surface Laptop Go 2', 'Surface Laptop Go 3', 'Surface Laptop Studio 2'
        ],
        'Surface Book': ['Surface Book 3'],
        'Surface Go': ['Surface Go 2', 'Surface Go 3', 'Surface Go 4']
      }
    },

    'MSI': {
      series: ['Modern', 'Prestige', 'Creator', 'Raider', 'Titan', 'Stealth', 'Katana', 'Cyborg'],
      models: {
        'Modern': ['Modern 14', 'Modern 15'],
        'Prestige': ['Prestige 13 AI Evo', 'Prestige 14', 'Prestige 15', 'Prestige 16 Studio'],
        'Creator': ['Creator Z16', 'Creator Z17'],
        'Raider': ['Raider GE67 HX', 'Raider GE77 HX', 'Raider GE78 HX'],
        'Titan': ['Titan GT77 HX'],
        'Stealth': ['Stealth 14', 'Stealth 15', 'Stealth 16 Studio'],
        'Katana': ['Katana 15', 'Katana 17'],
        'Cyborg': ['Cyborg 14', 'Cyborg 15']
      }
    },

    'Razer': {
      series: ['Razer Blade'],
      models: {
        'Razer Blade': ['Razer Blade 14', 'Razer Blade 15', 'Razer Blade 16', 'Razer Blade 18']
      }
    }
  }
};

// ── PHONE BRAND HIERARCHY ─────────────────────────────────────────────────────
export const PHONE_DATA = {
  brands: [
    'Apple', 'Samsung', 'Xiaomi', 'TECNO', 'Infinix', 'itel', 'Huawei',
    'OnePlus', 'Realme', 'Oppo', 'Vivo', 'Nokia', 'Motorola', 'Google',
    'Sony', 'Nothing', 'Honor', 'Redmi'
  ],

  chipsets: {
    'Apple': ['Apple A15 Bionic', 'Apple A16 Bionic', 'Apple A17 Pro', 'Apple A18', 'Apple A18 Pro'],
    'Samsung': ['Exynos 1280', 'Exynos 2200', 'Exynos 2400', 'Snapdragon 778G', 'Snapdragon 888', 'Snapdragon 8 Gen 1', 'Snapdragon 8 Gen 2', 'Snapdragon 8 Gen 3'],
    'Xiaomi': ['Snapdragon 695', 'Snapdragon 778G', 'Snapdragon 870', 'Snapdragon 8 Gen 1', 'Snapdragon 8 Gen 2', 'Snapdragon 8 Gen 3', 'MediaTek Dimensity 920', 'MediaTek Dimensity 9200'],
    'TECNO': ['MediaTek Helio G88', 'MediaTek Helio G99', 'MediaTek Dimensity 6080', 'MediaTek Dimensity 8050'],
    'Infinix': ['MediaTek Helio G88', 'MediaTek Helio G99', 'MediaTek Dimensity 6080', 'Snapdragon 695'],
    'Huawei': ['Kirin 710A', 'Kirin 9000s', 'Kirin 9010'],
    'OnePlus': ['Snapdragon 780G', 'Snapdragon 888', 'Snapdragon 8 Gen 1', 'Snapdragon 8 Gen 2', 'Snapdragon 8 Gen 3'],
    'Google': ['Google Tensor G2', 'Google Tensor G3', 'Google Tensor G4'],
    'Nothing': ['Snapdragon 778G+', 'Snapdragon 8 Gen 1', 'Snapdragon 8 Gen 2'],
    'Default': ['Snapdragon 695', 'Snapdragon 778G', 'Snapdragon 888', 'MediaTek Helio G99', 'MediaTek Dimensity 920']
  },

  hierarchy: {

    'Apple': {
      series: ['iPhone 12 Series', 'iPhone 13 Series', 'iPhone 14 Series', 'iPhone 15 Series', 'iPhone 16 Series', 'iPhone 17 Series'],
      models: {
        'iPhone 12 Series': ['iPhone 12 mini', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max'],
        'iPhone 13 Series': ['iPhone 13 mini', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max'],
        'iPhone 14 Series': ['iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max'],
        'iPhone 15 Series': ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
        'iPhone 16 Series': ['iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max'],
        'iPhone 17 Series': ['iPhone 17', 'iPhone 17 Plus', 'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone 17 Air']
      }
    },

    'Samsung': {
      series: ['Galaxy S Series', 'Galaxy A Series', 'Galaxy M Series', 'Galaxy Z Series', 'Galaxy Note Series', 'Galaxy F Series'],
      models: {
        'Galaxy S Series': [
          'Galaxy S21', 'Galaxy S21+', 'Galaxy S21 Ultra',
          'Galaxy S22', 'Galaxy S22+', 'Galaxy S22 Ultra',
          'Galaxy S23', 'Galaxy S23+', 'Galaxy S23 Ultra',
          'Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra',
          'Galaxy S24 FE'
        ],
        'Galaxy A Series': [
          'Galaxy A05', 'Galaxy A05s', 'Galaxy A14', 'Galaxy A15', 'Galaxy A15 5G',
          'Galaxy A24', 'Galaxy A25', 'Galaxy A25 5G',
          'Galaxy A34', 'Galaxy A35', 'Galaxy A55',
          'Galaxy A54', 'Galaxy A54 5G',
          'Galaxy A73 5G', 'Galaxy A72'
        ],
        'Galaxy M Series': [
          'Galaxy M14', 'Galaxy M34', 'Galaxy M54', 'Galaxy M15', 'Galaxy M55'
        ],
        'Galaxy Z Series': [
          'Galaxy Z Flip 3', 'Galaxy Z Flip 4', 'Galaxy Z Flip 5', 'Galaxy Z Flip 6',
          'Galaxy Z Fold 3', 'Galaxy Z Fold 4', 'Galaxy Z Fold 5', 'Galaxy Z Fold 6'
        ],
        'Galaxy Note Series': [
          'Galaxy Note 10', 'Galaxy Note 10+', 'Galaxy Note 20', 'Galaxy Note 20 Ultra'
        ],
        'Galaxy F Series': ['Galaxy F14', 'Galaxy F54']
      }
    },

    'Xiaomi': {
      series: ['Xiaomi 12 Series', 'Xiaomi 13 Series', 'Xiaomi 14 Series', 'Note Series'],
      models: {
        'Xiaomi 12 Series': ['Xiaomi 12', 'Xiaomi 12 Pro', 'Xiaomi 12T', 'Xiaomi 12T Pro'],
        'Xiaomi 13 Series': ['Xiaomi 13', 'Xiaomi 13 Pro', 'Xiaomi 13T', 'Xiaomi 13T Pro'],
        'Xiaomi 14 Series': ['Xiaomi 14', 'Xiaomi 14 Pro', 'Xiaomi 14T', 'Xiaomi 14T Pro', 'Xiaomi 14 Ultra'],
        'Note Series': ['Xiaomi Redmi Note 11', 'Xiaomi Redmi Note 12', 'Xiaomi Redmi Note 13', 'Xiaomi Redmi Note 13 Pro', 'Xiaomi Redmi Note 13 Pro+']
      }
    },

    'Redmi': {
      series: ['Redmi 12 Series', 'Redmi 13 Series', 'Redmi Note Series', 'Redmi A Series'],
      models: {
        'Redmi 12 Series': ['Redmi 12', 'Redmi 12 4G', 'Redmi 12 5G'],
        'Redmi 13 Series': ['Redmi 13', 'Redmi 13C', 'Redmi 13R'],
        'Redmi Note Series': ['Redmi Note 11', 'Redmi Note 12', 'Redmi Note 12 Pro', 'Redmi Note 13', 'Redmi Note 13 Pro', 'Redmi Note 13 Pro+'],
        'Redmi A Series': ['Redmi A1', 'Redmi A2', 'Redmi A2+', 'Redmi A3']
      }
    },

    'TECNO': {
      series: ['Camon Series', 'Spark Series', 'Phantom Series', 'Pop Series', 'Pova Series'],
      models: {
        'Camon Series': ['Camon 19', 'Camon 19 Pro', 'Camon 20', 'Camon 20 Pro', 'Camon 30', 'Camon 30 Pro', 'Camon 30 Premier'],
        'Spark Series': ['Spark 10', 'Spark 10 Pro', 'Spark 20', 'Spark 20 Pro', 'Spark 20C', 'Spark Go 2024'],
        'Phantom Series': ['Phantom X2', 'Phantom X2 Pro', 'Phantom V Fold', 'Phantom V Flip'],
        'Pop Series': ['Pop 7', 'Pop 7 Pro', 'Pop 8'],
        'Pova Series': ['Pova 5', 'Pova 5 Pro', 'Pova 6 Pro']
      }
    },

    'Infinix': {
      series: ['Note Series', 'Hot Series', 'Zero Series', 'Smart Series', 'GT Series'],
      models: {
        'Note Series': ['Note 11', 'Note 12', 'Note 12 Pro', 'Note 30', 'Note 30 Pro', 'Note 30 VIP', 'Note 40', 'Note 40 Pro'],
        'Hot Series': ['Hot 20', 'Hot 20 Play', 'Hot 30', 'Hot 30 Play', 'Hot 40', 'Hot 40 Pro', 'Hot 40i'],
        'Zero Series': ['Zero 20', 'Zero 30', 'Zero 30 5G', 'Zero 40'],
        'Smart Series': ['Smart 7', 'Smart 8', 'Smart 8 Plus'],
        'GT Series': ['GT 10 Pro', 'GT 20 Pro']
      }
    },

    'itel': {
      series: ['A Series', 'P Series', 'S Series', 'Vision Series'],
      models: {
        'A Series': ['itel A50', 'itel A58', 'itel A70'],
        'P Series': ['itel P40', 'itel P55', 'itel P55+', 'itel P55 NFC'],
        'S Series': ['itel S23', 'itel S24'],
        'Vision Series': ['itel Vision 3', 'itel Vision 3 Plus']
      }
    },

    'Huawei': {
      series: ['P Series', 'Mate Series', 'Nova Series', 'Y Series'],
      models: {
        'P Series': ['P40', 'P40 Pro', 'P50', 'P50 Pro', 'P60', 'P60 Pro', 'P60 Art'],
        'Mate Series': ['Mate 40 Pro', 'Mate 50 Pro', 'Mate 60 Pro', 'Mate 60 Pro+', 'Mate X5'],
        'Nova Series': ['Nova 11', 'Nova 11 Pro', 'Nova 12', 'Nova 12 Pro'],
        'Y Series': ['Y90', 'Y70', 'Y61']
      }
    },

    'OnePlus': {
      series: ['OnePlus 11 Series', 'OnePlus 12 Series', 'Nord Series'],
      models: {
        'OnePlus 11 Series': ['OnePlus 11', 'OnePlus 11R'],
        'OnePlus 12 Series': ['OnePlus 12', 'OnePlus 12R'],
        'Nord Series': ['Nord CE 3', 'Nord CE 3 Lite', 'Nord CE 4', 'Nord N30', 'Nord 4']
      }
    },

    'Realme': {
      series: ['Realme 11 Series', 'Realme 12 Series', 'C Series', 'GT Series', 'Narzo Series'],
      models: {
        'Realme 11 Series': ['Realme 11', 'Realme 11 Pro', 'Realme 11 Pro+', 'Realme 11 5G'],
        'Realme 12 Series': ['Realme 12', 'Realme 12 Pro', 'Realme 12 Pro+', 'Realme 12 5G', 'Realme 12x 5G'],
        'C Series': ['Realme C51', 'Realme C53', 'Realme C55', 'Realme C65', 'Realme C67'],
        'GT Series': ['Realme GT 5', 'Realme GT 6', 'Realme GT 6T'],
        'Narzo Series': ['Narzo 60', 'Narzo 60 Pro', 'Narzo 60x 5G']
      }
    },

    'Google': {
      series: ['Pixel 7 Series', 'Pixel 8 Series', 'Pixel 9 Series', 'Pixel A Series'],
      models: {
        'Pixel 7 Series': ['Pixel 7', 'Pixel 7 Pro', 'Pixel 7a'],
        'Pixel 8 Series': ['Pixel 8', 'Pixel 8 Pro', 'Pixel 8a'],
        'Pixel 9 Series': ['Pixel 9', 'Pixel 9 Pro', 'Pixel 9 Pro XL', 'Pixel 9 Pro Fold'],
        'Pixel A Series': ['Pixel 7a', 'Pixel 8a']
      }
    },

    'Nokia': {
      series: ['G Series', 'C Series', 'X Series'],
      models: {
        'G Series': ['Nokia G10', 'Nokia G20', 'Nokia G21', 'Nokia G42 5G', 'Nokia G60 5G'],
        'C Series': ['Nokia C12', 'Nokia C32', 'Nokia C42'],
        'X Series': ['Nokia X30 5G']
      }
    },

    'Motorola': {
      series: ['Moto G Series', 'Moto Edge Series', 'Razr Series'],
      models: {
        'Moto G Series': ['Moto G54 5G', 'Moto G64 5G', 'Moto G84 5G', 'Moto G Power', 'Moto G Stylus'],
        'Moto Edge Series': ['Moto Edge 40', 'Moto Edge 40 Pro', 'Moto Edge 50 Pro', 'Moto Edge 50 Ultra'],
        'Razr Series': ['Motorola Razr 40', 'Motorola Razr 40 Ultra', 'Motorola Razr 50', 'Motorola Razr 50 Ultra']
      }
    },

    'Sony': {
      series: ['Xperia 1 Series', 'Xperia 5 Series', 'Xperia 10 Series'],
      models: {
        'Xperia 1 Series': ['Xperia 1 IV', 'Xperia 1 V', 'Xperia 1 VI'],
        'Xperia 5 Series': ['Xperia 5 IV', 'Xperia 5 V'],
        'Xperia 10 Series': ['Xperia 10 V', 'Xperia 10 VI']
      }
    },

    'Nothing': {
      series: ['Phone Series', 'CMF Series'],
      models: {
        'Phone Series': ['Nothing Phone (1)', 'Nothing Phone (2)', 'Nothing Phone (2a)', 'Nothing Phone (2a) Plus'],
        'CMF Series': ['CMF Phone 1']
      }
    },

    'Honor': {
      series: ['Honor 90 Series', 'Honor 200 Series', 'Honor Magic Series', 'X Series'],
      models: {
        'Honor 90 Series': ['Honor 90', 'Honor 90 Lite', 'Honor 90 Pro'],
        'Honor 200 Series': ['Honor 200', 'Honor 200 Lite', 'Honor 200 Pro'],
        'Honor Magic Series': ['Honor Magic 6 Pro', 'Honor Magic V2'],
        'X Series': ['Honor X6', 'Honor X6b', 'Honor X8', 'Honor X8b', 'Honor X9b']
      }
    },

    'Oppo': {
      series: ['Find X Series', 'Reno Series', 'A Series'],
      models: {
        'Find X Series': ['Find X6', 'Find X6 Pro', 'Find X7', 'Find X7 Ultra'],
        'Reno Series': ['Reno 11', 'Reno 11 Pro', 'Reno 11F', 'Reno 12', 'Reno 12 Pro'],
        'A Series': ['Oppo A38', 'Oppo A58', 'Oppo A78', 'Oppo A98']
      }
    }
  }
};
