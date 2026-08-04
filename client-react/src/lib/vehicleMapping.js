export const VEHICLE_CLASSIFICATIONS = {
  suvs: new Set([
    'Prado', 'Land Cruiser', 'Harrier', 'Vanguard', 'RAV4', 'Rush', 'Fortuner', 'Cruiser', 'Sequoia', 'Highlander', 'C-HR', 'Corolla Cross', 'Yaris Cross', 'Urban Cruiser',
    'CR-V', 'HR-V', 'Vezel', 'Pilot', 'Passport', 'Crossroad',
    'X-Trail', 'Qashqai', 'Juke', 'Patrol', 'Murano', 'Pathfinder', 'Kicks', 'Dualis',
    'Forester', 'Outback', 'XV', 'Crosstrek', 'Tribeca', 'Ascent',
    'CX-5', 'CX-3', 'CX-8', 'CX-9', 'CX-30',
    'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7',
    'Touareg', 'Tiguan', 'Atlas',
    'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Discovery', 'Discovery Sport', 'Defender',
    'G-Class', 'GLE', 'GLC', 'GLA', 'GLS', 'ML-Class',
    'Macan', 'Cayenne',
    'Santa Fe', 'Tucson', 'Palisade', 'Kona', 'Creta',
    'Sportage', 'Sorento', 'Telluride', 'Seltos',
    'XC40', 'XC60', 'XC90',
    'Q3', 'Q5', 'Q7', 'Q8',
    'F-Pace', 'E-Pace', 'I-Pace',
    'Levante', 'Urus', 'Bentayga', 'Cullinan'
  ]),
  pickups: new Set([
    'Hilux', 'Tacoma', 'Tundra', 'Land Cruiser Pickup',
    'Ranger', 'F-150', 'F-250', 'F-350', 'Raptor',
    'D-Max',
    'Navara', 'Hardbody', 'Titan', 'Frontier',
    'BT-50',
    'Amarok',
    'L200', 'Triton',
    'Colorado', 'Silverado',
    'Ram 1500', 'Ram 2500'
  ]),
  vans: new Set([
    'HiAce', 'Probox', 'Succeed', 'TownAce', 'LiteAce', 'Noah', 'Voxy', 'Esquire', 'Alphard', 'Vellfire', 'Sienta', 'Wish',
    'Caravan', 'NV200', 'NV350', 'Serena', 'Elgrand',
    'Stepwgn', 'Odyssey', 'Freed', 'Fit Shuttle',
    'Transporter', 'Multivan', 'Caravelle', 'Crafter', 'Caddy',
    'Vito', 'Sprinter', 'V-Class',
    'Transit', 'Tourneo',
    'Bongo'
  ]),
  cars: new Set([
    // If a category is just "cars", we typically mean Sedans, Hatchbacks, Wagons, Coupes.
    // Instead of listing them all, we will use this to EXCLUDE suvs, pickups, vans if needed,
    // or explicitly list popular ones. We'll rely on an exclusion check in the API instead of inclusion.
  ])
};
