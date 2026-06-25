export const DEVICE_TYPES = ['Laptop', 'Desktop', 'All-in-One', 'Mini PC', 'Workstation', 'Server'];

export const CPU_BRANDS = ['Intel', 'AMD', 'Apple', 'Snapdragon (ARM)', 'Other'];

export const CPU_FAMILIES = [
  'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
  'Intel Core Ultra 5', 'Intel Core Ultra 7', 'Intel Core Ultra 9',
  'Intel Xeon', 'Intel Pentium', 'Intel Celeron',
  'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9',
  'AMD Threadripper', 'AMD Athlon',
  'Apple M1', 'Apple M2', 'Apple M3', 'Apple M4',
  'Snapdragon X Elite', 'Snapdragon X Plus'
];

export const CPU_GENERATIONS = [
  '1st Gen', '2nd Gen', '3rd Gen', '4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen',
  '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen', '14th Gen', '15th Gen (Core Ultra)',
  'Ryzen 3000 Series', 'Ryzen 4000 Series', 'Ryzen 5000 Series', 'Ryzen 6000 Series', 'Ryzen 7000 Series', 'Ryzen 8000 Series',
  'Base', 'Pro', 'Max', 'Ultra', 'Gen 1', 'Gen 2', 'Gen 3'
];

export const CPU_ARCHITECTURES = ['x86', 'x64', 'ARM64'];
export const RAM_TYPES = ['DDR3', 'DDR4', 'DDR5', 'LPDDR4', 'LPDDR4x', 'LPDDR5', 'LPDDR5x', 'Unified Memory'];
export const RAM_MAX_SUPPORTED = ['8GB', '16GB', '32GB', '64GB', '128GB', '256GB'];

export const STORAGE_TYPES = ['HDD', 'SATA SSD', 'NVMe PCIe 3.0 SSD', 'NVMe PCIe 4.0 SSD', 'NVMe PCIe 5.0 SSD', 'eMMC', 'Hybrid (HDD + SSD)'];
export const NUMBER_OF_DRIVES = ['1', '2', '3', '4+'];

export const GPU_TYPES = ['Integrated', 'Dedicated'];
export const GPU_BRANDS = ['Intel', 'AMD', 'NVIDIA', 'Apple', 'Qualcomm'];
export const GPU_MEMORY = ['Shared', '2GB', '4GB', '6GB', '8GB', '10GB', '12GB', '16GB', '24GB'];

export const SCREEN_RATES = ['60Hz', '90Hz', '120Hz', '144Hz', '165Hz', '240Hz', '300Hz', '360Hz+'];
export const PANEL_TYPES = ['IPS', 'OLED', 'Mini-LED', 'TN', 'VA', 'Liquid Retina XDR'];
export const SCREEN_FINISHES = ['Matte / Anti-Glare', 'Glossy'];
export const ASPECT_RATIOS = ['16:9', '16:10', '3:2'];
export const COLOR_ACCURACY = ['100% sRGB', '100% DCI-P3', '100% Adobe RGB', 'Standard'];

export const WEBCAM_RESOLUTIONS = ['720p', '1080p', '1440p', '4K', 'None'];

export const BATTERY_HEALTH = ['Excellent (90-100%)', 'Good (80-89%)', 'Fair (70-79%)', 'Poor (<70%)'];
export const CHARGING_TYPES = ['Barrel Plug', 'USB-C', 'MagSafe'];

export const FORM_FACTORS = ['Traditional Clamshell', '2-in-1 Convertible', '2-in-1 Detachable', 'Dual Screen'];
export const OPENING_ANGLES = ['135 Degrees', '180 Degrees', '360 Degrees'];

export const MATERIALS = ['Plastic', 'Aluminum', 'Magnesium Alloy', 'Carbon Fiber', 'Glass'];
export const SCRATCH_LEVELS = ['None', 'Light/Micro-scratches', 'Moderate', 'Heavy'];
export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Requires Repair'];

export const KEYBOARD_TYPES = ['Chiclet / Membrane', 'Mechanical', 'Optical-Mechanical'];
export const KEYBOARD_LAYOUTS = ['US English', 'UK English', 'Arabic', 'French', 'Other'];
export const TRACKPAD_TYPES = ['Mechanical Clickpad', 'Haptic Touchpad'];

export const WI_FI_STANDARDS = ['Wi-Fi 5 (802.11ac)', 'Wi-Fi 6 (802.11ax)', 'Wi-Fi 6E', 'Wi-Fi 7', 'None'];

export const LAPTOP_PORTS = [
  'USB-A', 'USB-C', 'Thunderbolt', 'HDMI', 'Mini HDMI', 'DisplayPort', 'Mini DisplayPort',
  'Ethernet Port', 'Audio Jack', 'SD Card Reader', 'MicroSD Reader', 'VGA', 'Dock Connector'
];

export const COOLING_TYPES = ['Passive (Fanless)', 'Single Fan', 'Dual Fan', 'Liquid Cooling', 'Vapor Chamber'];
export const USAGE_HISTORY = ['Light/Office Use', 'Gaming', 'Programming', 'Graphic Design', 'Heavy Rendering'];
export const OWNERSHIPS = ['First Owner', 'Second Owner', 'Multiple Owners', 'Company Owned'];

export const INCLUDED_ACCESSORIES = [
  'Original Box', 'Charger', 'Bag', 'Mouse', 'Dock', 'Stylus', 'Adapter', 'Laptop Sleeve', 'Cooling Pad', 'External Keyboard'
];
