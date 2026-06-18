export const MASTER_SPARE_PARTS = {
  'Engine Parts': [
    'Engine Assembly', 'Engine Block', 'Cylinder Head', 'Cylinder Head Gasket', 'Valve Cover', 'Valve Cover Gasket',
    'Piston', 'Piston Rings', 'Connecting Rod', 'Crankshaft', 'Camshaft', 'Timing Chain', 'Timing Belt', 'Timing Tensioner',
    'Timing Guide', 'Flywheel', 'Oil Pump', 'Oil Pan', 'Oil Filter Housing', 'Oil Cooler', 'Main Bearings', 'Rod Bearings',
    'Valve', 'Valve Spring', 'Rocker Arm', 'Lifter', 'Push Rod', 'PCV Valve', 'Engine Mount', 'Turbocharger',
    'Turbo Actuator', 'Intercooler', 'Intercooler Pipe', 'Throttle Body', 'Intake Manifold', 'Exhaust Manifold', 'Dipstick', 'Engine Cover'
  ],
  'Fuel System': [
    'Fuel Tank', 'Fuel Pump', 'Fuel Filter', 'Fuel Injector', 'Fuel Rail', 'Fuel Pressure Regulator', 'Fuel Sender',
    'Diesel Pump', 'Common Rail', 'High Pressure Pump', 'Fuel Hose', 'Fuel Cap', 'Carburetor'
  ],
  'Cooling System': [
    'Radiator', 'Radiator Fan', 'Fan Motor', 'Water Pump', 'Thermostat', 'Coolant Tank', 'Coolant Hose', 'Radiator Cap',
    'Heater Core', 'Temperature Sensor'
  ],
  'Transmission': [
    'Gearbox', 'Automatic Transmission', 'Manual Transmission', 'Transfer Case', 'Torque Converter', 'Transmission Mount',
    'Transmission Filter', 'Clutch Kit', 'Pressure Plate', 'Release Bearing', 'Master Cylinder', 'Slave Cylinder', 'Shift Cable'
  ],
  'Drivetrain': [
    'Differential', 'Propeller Shaft', 'CV Joint', 'CV Axle', 'Drive Shaft', 'Wheel Hub', 'Hub Bearing', 'Universal Joint', 'Axle Shaft'
  ],
  'Steering': [
    'Steering Rack', 'Steering Box', 'Steering Pump', 'Steering Column', 'Tie Rod', 'Tie Rod End', 'Drag Link', 'Pitman Arm',
    'Idler Arm', 'Steering Knuckle', 'Rack End'
  ],
  'Suspension': [
    'Shock Absorber', 'Strut', 'Coil Spring', 'Leaf Spring', 'Control Arm', 'Upper Control Arm', 'Lower Control Arm',
    'Ball Joint', 'Stabilizer Link', 'Sway Bar', 'Sway Bar Bushing', 'Strut Mount', 'Suspension Bushing', 'Air Suspension Compressor'
  ],
  'Brakes': [
    'Brake Pads', 'Brake Disc', 'Brake Drum', 'Brake Shoes', 'Brake Caliper', 'Brake Booster', 'Brake Master Cylinder',
    'ABS Pump', 'ABS Sensor', 'Brake Cable', 'Brake Line'
  ],
  'Electrical': [
    'Battery', 'Alternator', 'Starter Motor', 'ECU', 'Fuse Box', 'Relay', 'Spark Plug', 'Glow Plug', 'Ignition Coil',
    'Wiring Harness', 'Immobilizer', 'OBD Module'
  ],
  'Lighting': [
    'Headlight', 'Tail Light', 'Fog Light', 'Indicator', 'Reverse Lamp', 'DRL', 'Interior Lamp', 'LED Module'
  ],
  'Body Parts': [
    'Bonnet', 'Front Bumper', 'Rear Bumper', 'Fender', 'Door', 'Tailgate', 'Mirror', 'Mirror Glass', 'Grille', 'Roof Panel', 'Mudguard'
  ],
  'Glass': [
    'Windscreen', 'Door Glass', 'Rear Glass', 'Quarter Glass', 'Sunroof Glass', 'Window Regulator'
  ],
  'Interior': [
    'Dashboard', 'Seats', 'Seat Belt', 'Door Trim', 'Instrument Cluster', 'Steering Cover', 'Arm Rest', 'Console Box',
    'Floor Carpet', 'Roof Lining'
  ],
  'AC & Heating': [
    'AC Compressor', 'Condenser', 'Evaporator', 'Blower Motor', 'Cabin Filter', 'Expansion Valve', 'Climate Control Unit'
  ],
  'Wheels & Tyres': [
    'Tyre', 'Alloy Rim', 'Steel Rim', 'Wheel Cap', 'Wheel Nut', 'Wheel Spacer'
  ],
  'Exhaust': [
    'Catalytic Converter', 'Muffler', 'Exhaust Pipe', 'Resonator', 'Oxygen Sensor'
  ],
  'Sensors': [
    'Speed Sensor', 'ABS Sensor', 'Oxygen Sensor', 'MAF Sensor', 'MAP Sensor', 'Parking Sensor', 'TPMS Sensor'
  ]
};

// Mock Hierarchical Data for cascade testing
export const MOCK_VEHICLE_HIERARCHY = {
  'Toyota': {
    'Camry': {
      'XV30': { '1AZ': ['2001', '2002', '2003', '2004', '2005', '2006'] },
      'XV40': { '2AZ': ['2006', '2007', '2008', '2009', '2010', '2011'] },
      'XV50': { 
        '1AZ': ['2012', '2013', '2014'],
        '2AR': ['2012', '2013', '2014', '2015', '2016', '2017'],
        '2GR': ['2012', '2013', '2014', '2015', '2016', '2017']
      },
      'XV70': { 'A25A': ['2018', '2019', '2020', '2021', '2022', '2023'] }
    },
    'Corolla': {
      'E140': { '1ZZ': ['2007', '2008', '2009', '2010'] },
      'E170': { '2ZR': ['2014', '2015', '2016', '2017', '2018'] }
    },
    'Hilux': {
      'AN120': { '1GD': ['2015', '2016', '2017', '2018', '2019', '2020'] }
    }
  },
  'Nissan': {
    'X-Trail': {
      'T31': { 'MR20DE': ['2007', '2008', '2009', '2010', '2011', '2012', '2013'] },
      'T32': { 'MR20DD': ['2014', '2015', '2016', '2017', '2018', '2019', '2020'] }
    }
  },
  'Honda': {
    'CR-V': {
      'RM': { 'K24': ['2012', '2013', '2014', '2015', '2016'] },
      'RW': { 'L15B7': ['2017', '2018', '2019', '2020', '2021', '2022'] }
    }
  }
};

export const POSITIONS = [
  'Front', 'Rear', 'Left', 'Right', 'Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'Upper', 'Lower', 'N/A'
];
