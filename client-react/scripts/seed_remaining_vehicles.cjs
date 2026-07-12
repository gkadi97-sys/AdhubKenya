/**
 * seed_remaining_vehicles.cjs
 * Seeds manufacturers NOT pulled by NHTSA (motorcycles, agriculture, construction, China brands)
 * Uses the Supabase Management API to insert directly.
 */
const https = require('https');

const SUPABASE_TOKEN = "SUPABASE_PAT_REDACTED";
const PROJECT_REF = "htezwjuiboordwjclton";

// Additional makes with their models that NHTSA doesn't cover
const ADDITIONAL_DATA = [
  // Motorcycles (with models)
  { name: "Honda", vehicle_type: "Motorcycle", models: ["CB125", "CB150", "CB300", "CB500", "CB650", "CB750", "CB1000", "CBR300", "CBR500", "CBR600", "CBR650", "CBR1000", "CRF110", "CRF250", "CRF300", "CRF450", "Rebel 300", "Rebel 500", "Africa Twin", "Gold Wing", "PCX 125", "PCX 150", "ADV 150", "Forza 125", "Forza 250", "Forza 350", "SH125", "SH150", "Shine", "Unicorn", "Activa"] },
  { name: "Yamaha", vehicle_type: "Motorcycle", models: ["YZF-R15", "YZF-R3", "YZF-R7", "YZF-R1", "MT-03", "MT-07", "MT-09", "MT-10", "NMAX 125", "NMAX 155", "Aerox 155", "Fascino 125", "FZ-S", "FZS-FI", "FZ-X", "XSR125", "XSR700", "XSR900", "Tenere 700", "WR250R", "YZ250F", "YZ450F", "XMAX 300", "TMAX 560", "Tracer 700", "Tracer 900"] },
  { name: "Kawasaki", vehicle_type: "Motorcycle", models: ["Ninja 125", "Ninja 300", "Ninja 400", "Ninja 650", "Ninja 1000", "Ninja H2", "Z125", "Z250", "Z400", "Z650", "Z900", "Z1000", "Vulcan 650", "Vulcan 1700", "Versys 300", "Versys 650", "Versys 1000", "KLX 110", "KLX 150", "KLX 230", "KLX 300", "KX250", "KX450", "W175", "W800"] },
  { name: "Suzuki", vehicle_type: "Motorcycle", models: ["GSX-R150", "GSX-R600", "GSX-R750", "GSX-R1000", "GSX-S125", "GSX-S750", "GSX-S1000", "V-Strom 250", "V-Strom 650", "V-Strom 1050", "Burgman 125", "Burgman 200", "Burgman 400", "Access 125", "Gixxer 150", "Gixxer 250", "Intruder 150", "DR650", "RMZ450"] },
  { name: "KTM", vehicle_type: "Motorcycle", models: ["Duke 125", "Duke 200", "Duke 250", "Duke 390", "Duke 890", "Duke 1290", "RC 125", "RC 200", "RC 390", "Adventure 250", "Adventure 390", "Adventure 790", "Adventure 890", "Adventure 1290", "EXC 250", "EXC 300", "SX 250", "SX 450"] },
  { name: "Royal Enfield", vehicle_type: "Motorcycle", models: ["Bullet 350", "Bullet 500", "Classic 350", "Classic 500", "Meteor 350", "Thunderbird 350", "Thunderbird 500", "Himalayan", "Interceptor 650", "Continental GT 650", "Scram 411", "Hunter 350", "Super Meteor 650"] },
  { name: "Harley-Davidson", vehicle_type: "Motorcycle", models: ["Sportster 883", "Sportster 1200", "Iron 883", "Forty-Eight", "Street 750", "Street Bob", "Softail Standard", "Fat Bob", "Heritage Classic", "Road King", "Street Glide", "Road Glide", "Ultra Limited", "Pan America 1250", "Nightster"] },
  { name: "Triumph", vehicle_type: "Motorcycle", models: ["Street Triple 660", "Street Triple 765", "Speed Triple 1200", "Tiger 660", "Tiger 800", "Tiger 900", "Tiger 1200", "Bonneville T100", "Bonneville T120", "Scrambler 400", "Scrambler 900", "Scrambler 1200", "Thruxton 1200", "Speed Twin 900", "Rocket 3"] },
  { name: "Ducati", vehicle_type: "Motorcycle", models: ["Monster 797", "Monster 937", "Monster 1200", "Panigale V2", "Panigale V4", "Streetfighter V2", "Streetfighter V4", "Multistrada 950", "Multistrada V4", "Diavel 1260", "Scrambler Icon", "Scrambler Desert Sled", "Hypermotard 950", "SuperSport 950"] },
  { name: "Aprilia", vehicle_type: "Motorcycle", models: ["RS 125", "RS 150", "RS 660", "Tuono 660", "Tuono 1100", "RS-V4", "Tuono V4", "Dorsoduro 900", "SX 125", "RX 125", "Storm 125"] },
  { name: "BMW Motorrad", vehicle_type: "Motorcycle", models: ["G 310 R", "G 310 GS", "F 450 GS", "F 750 GS", "F 850 GS", "F 900 R", "F 900 XR", "R 1250 GS", "R 1250 RT", "R 18", "M 1000 RR", "S 1000 RR", "S 1000 R", "S 1000 XR", "K 1600 GT"] },
  { name: "Benelli", vehicle_type: "Motorcycle", models: ["TRK 502", "TRK 502X", "TRK 702", "Leoncino 250", "Leoncino 500", "Imperiale 400", "BN 302", "TNT 600", "TNT 300", "302S"] },
  { name: "CFMoto", vehicle_type: "Motorcycle", models: ["150NK", "250NK", "400NK", "650NK", "800NK", "300SR", "400SR", "700CL-X", "450MT", "800MT"] },
  { name: "Hero", vehicle_type: "Motorcycle", models: ["Splendor Plus", "Splendor Pro", "HF 100", "HF Deluxe", "Passion Pro", "Glamour", "Xtreme 160R", "Xtreme 200R", "Xpulse 200", "Destini 125", "Maestro Edge"] },
  { name: "Vespa", vehicle_type: "Motorcycle", models: ["Sprint 125", "Sprint 150", "GTS 300", "GTV 300", "Primavera 125", "Primavera 150", "Elettrica", "S 125", "Sei Giorni"] },
  { name: "Piaggio", vehicle_type: "Motorcycle", models: ["Liberty 125", "Liberty 150", "Medley 125", "Medley 150", "MP3 300", "MP3 500", "TYPHOON 125"] },
  // Agriculture
  { name: "John Deere", vehicle_type: "Commercial/Industrial", models: ["5E 85", "5E 95", "5E 105", "5M 110", "5M 125", "6M 145", "6M 165", "6R 155", "6R 195", "7R 310", "8R 310", "8R 370", "9R 490", "9R 590", "1025R", "2025R", "3025E", "3038E", "4044M", "4052M", "5055E", "5065E", "5075E", "Gator HPX615E", "Gator XUV835M", "S770", "S790", "C850"] },
  { name: "Massey Ferguson", vehicle_type: "Commercial/Industrial", models: ["MF 1725M", "MF 2706E", "MF 3707", "MF 4709", "MF 5710", "MF 5711", "MF 5712", "MF 5713", "MF 6713", "MF 6714", "MF 6715", "MF 6716", "MF 7719", "MF 7720", "MF 8735S", "MF 8740S", "MF Delta", "MF Beta", "MF 245", "MF 255", "MF 265", "MF 275", "MF 285", "MF 290", "MF 360", "MF 375", "MF 385"] },
  { name: "New Holland", vehicle_type: "Commercial/Industrial", models: ["Boomer 24", "Boomer 40", "Boomer 50", "Workmaster 25", "Workmaster 35", "Workmaster 55", "T4.55", "T4.75", "T4.100", "T5.110", "T5.140", "T6.180", "T7.315", "T8.435", "CR8.90", "FR9060", "TS6.120", "TD5.115"] },
  { name: "Kubota", vehicle_type: "Commercial/Industrial", models: ["B2301", "B2601", "B3350", "L2501", "L3301", "L3901", "L5460", "M5-111", "M7-172", "MX5100", "MX6000", "BX25D", "BX2380", "BX80 Series", "RTV-X900", "RTV-X1100", "KX057", "U17", "SVL75", "M108S"] },
  { name: "Case IH", vehicle_type: "Commercial/Industrial", models: ["Farmall 35A", "Farmall 55A", "Farmall 75A", "Farmall 90A", "Farmall 95", "Maxxum 115", "Maxxum 145", "Puma 175", "Puma 220", "Magnum 250", "Magnum 380", "Steiger 540", "Axial-Flow 250", "Axial-Flow 8250", "WD2504"] },
  { name: "CLAAS", vehicle_type: "Commercial/Industrial", models: ["Elios 200", "Elios 300", "Nexos 210", "Nexos 240", "Arion 410", "Arion 620", "Axion 800", "Axion 960", "Lexion 5000", "Lexion 8900", "Tucano 440", "Tucano 580", "Jaguar 960", "Jaguar 994", "Xerion 4000"] },
  { name: "Sonalika", vehicle_type: "Commercial/Industrial", models: ["GT 20", "GT 26", "GT 35", "GT 42", "GT 55", "RX 35", "RX 47", "RX 55", "RX 60", "DI 750", "DI 740", "DI 730", "Worldtrac 90", "Tiger", "Sikander"] },
  // Construction Equipment
  { name: "Caterpillar", vehicle_type: "Commercial/Industrial", models: ["CAT 306", "CAT 308", "CAT 315", "CAT 320", "CAT 336", "CAT 374", "CAT 950GC", "CAT 966", "CAT 972", "CAT 980", "CAT 14M3 Grader", "CAT D5", "CAT D6", "CAT D8", "CAT D9", "CAT 770G", "CAT 772G", "CAT 140GC Grader", "CAT 730", "CAT 745", "CAT 216B3 Skid Steer", "CAT 262D3 Skid Steer"] },
  { name: "Komatsu", vehicle_type: "Commercial/Industrial", models: ["PC30MR", "PC55MR", "PC88MR", "PC130", "PC160", "PC200", "PC300", "PC450", "PC750", "WA100", "WA200", "WA380", "WA480", "D37", "D51", "D65", "D85", "D155", "GD511A", "GD655", "HM250", "HM400"] },
  { name: "Hitachi", vehicle_type: "Commercial/Industrial", models: ["ZX17U", "ZX26U", "ZX50U", "ZX130", "ZX200", "ZX290", "ZX350", "ZX450", "ZX690", "ZX870", "EX1200", "AH250", "AH400", "LX130E", "LX230E"] },
  { name: "JCB", vehicle_type: "Commercial/Industrial", models: ["1CX", "2CX", "3CX", "4CX", "5CX", "JZ140", "JS130", "JS200", "JS300", "JS460", "4DX", "3DX", "531-70", "533-105", "541-70", "Skid Steer 135", "Skid Steer 175", "Teletruck 4013", "HTD5", "RT65"] },
  { name: "Volvo CE", vehicle_type: "Commercial/Industrial", models: ["ECR25D", "ECR50D", "ECR145E", "EC140E", "EC220E", "EC300E", "EC480E", "EC750E", "L25H", "L60H", "L90H", "L150H", "A25G", "A35G", "A45G", "G930B Grader"] },
  { name: "Liebherr", vehicle_type: "Commercial/Industrial", models: ["R916", "R926", "R940", "R960", "R9150", "LH22M", "LH30M", "LH50M", "PR716", "PR726", "PR736", "PR756", "LR1100", "LR1200", "LTM 1100", "LTM 1300"] },
  { name: "SANY", vehicle_type: "Commercial/Industrial", models: ["SY16C", "SY26U", "SY60C", "SY135C", "SY205C", "SY305H", "SY485H", "SY750H", "SY2000", "SW956K Wheel Loader", "SG16-3A Grader", "SPW313A Paver", "SRC500C Crane", "SAC1000 Crane", "SY26 Mini Excavator"] },
  { name: "XCMG", vehicle_type: "Commercial/Industrial", models: ["XE15U", "XE35U", "XE60DA", "XE135B", "XE210C", "XE370CA", "XE490HK", "LW188", "LW300KN", "LW500KN", "GR135", "GR215", "NXG5250GJBN Concrete Mixer", "SL60W", "SL08BU Mini Loader"] },
  { name: "Bobcat", vehicle_type: "Commercial/Industrial", models: ["S510", "S530", "S570", "S590", "S630", "S650", "S770", "T250", "T550", "T590", "T650", "T770", "E10", "E17", "E26", "E35", "E42", "E55", "E62", "E85", "MT100", "MT55"] },
  { name: "Takeuchi", vehicle_type: "Commercial/Industrial", models: ["TB216", "TB225", "TB235", "TB245", "TB260", "TB270", "TB285", "TB2150", "TL6R", "TL8", "TL12R2", "TW65", "TW85", "TB53FR", "TB153FR"] },
  // China brands (commonly sold in Africa)
  { name: "BYD", vehicle_type: "Passenger/Commercial", models: ["Atto 3", "Atto 2", "Dolphin", "Han", "Tang", "Seal", "Seagull", "Song Plus", "Song Pro", "Yuan Plus", "BYD F3", "BYD E6", "T3", "D1", "EA1", "Destroyer 05"] },
  { name: "Chery", vehicle_type: "Passenger/Commercial", models: ["Tiggo 2", "Tiggo 4", "Tiggo 5x", "Tiggo 7", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Arrizo 5", "Arrizo 6", "Arrizo 8", "Tiggo 2 Pro", "Tiggo 3x"] },
  { name: "Geely", vehicle_type: "Passenger/Commercial", models: ["Atlas", "Atlas Pro", "Coolray", "Emgrand", "Boyue", "Tugella", "Preface", "Azkarra", "Okavango", "Star Ship L", "Xingyue L"] },
  { name: "Haval", vehicle_type: "Passenger/Commercial", models: ["H1", "H2", "H4", "H6", "H7", "H8", "H9", "F5", "F7", "F7x", "Jolion", "Dargo", "Big Dog", "Raptor"] },
  { name: "GWM", vehicle_type: "Passenger/Commercial", models: ["Ute", "P-Series Ute", "Cannon", "Poer", "Pao", "Wingle 5", "Wingle 6", "Wingle 7", "Steed"] },
  { name: "Tank", vehicle_type: "Passenger/Commercial", models: ["Tank 300", "Tank 400", "Tank 500"] },
  { name: "Jetour", vehicle_type: "Passenger/Commercial", models: ["T2", "X70", "X70 Plus", "X90 Plus", "X95", "Dashing"] },
  { name: "Omoda", vehicle_type: "Passenger/Commercial", models: ["OMODA C5", "OMODA E5"] },
  { name: "Jaecoo", vehicle_type: "Passenger/Commercial", models: ["J7", "J8"] },
  { name: "Zeekr", vehicle_type: "Passenger/Commercial", models: ["001", "007", "009", "X"] },
  { name: "JAC", vehicle_type: "Passenger/Commercial", models: ["T6", "T8", "S2", "S3", "S4", "S7", "S8", "Sunray", "HFC", "N55", "N75"] },
  { name: "Foton", vehicle_type: "Passenger/Commercial", models: ["Tunland", "Aumark S", "Aumark T", "Auman", "Mini Truck", "Truck 3000", "BJ1031", "View C2"] },
  { name: "Changan", vehicle_type: "Passenger/Commercial", models: ["CS35 Plus", "CS55 Plus", "CS75 Plus", "CS85 Coupe", "CS95", "UNI-K", "UNI-T", "UNI-V", "EADO", "Alsvin"] },
  { name: "NIO", vehicle_type: "Passenger/Commercial", models: ["ET5", "ET7", "ES6", "ES7", "ES8", "EC6", "EC7"] },
  { name: "XPeng", vehicle_type: "Passenger/Commercial", models: ["P5", "P7", "G3", "G6", "G9", "X9"] },
  { name: "Li Auto", vehicle_type: "Passenger/Commercial", models: ["L6", "L7", "L8", "L9", "MEGA"] },
  { name: "Leapmotor", vehicle_type: "Passenger/Commercial", models: ["T03", "C11", "C10", "C01"] },
  { name: "ORA", vehicle_type: "Passenger/Commercial", models: ["Good Cat", "Black Cat", "Lightning Cat"] },
  // India brands
  { name: "Mahindra", vehicle_type: "Passenger/Commercial", models: ["Thar", "Scorpio", "Scorpio-N", "XUV300", "XUV400", "XUV700", "Bolero", "Bolero Neo", "KUV100", "Marazzo", "TUV300", "Pik Up", "Supro", "Jeeto", "Gio"] },
  { name: "Tata", vehicle_type: "Passenger/Commercial", models: ["Punch", "Nexon", "Harrier", "Safari", "Altroz", "Tiago", "Tigor", "Nexon EV", "Punch EV", "Prima", "Signa", "Ultra", "Ace", "Super Ace"] },
  { name: "Ashok Leyland", vehicle_type: "Commercial/Industrial", models: ["Dost", "Dost Plus", "Bada Dost", "Partner", "Phoenix", "Stile", "Captain", "U-Truck", "Jan Bus", "Circuit"] },
  { name: "Force Motors", vehicle_type: "Commercial/Industrial", models: ["Gurkha", "Trax Toofan", "Trax Cruiser", "Traveller", "T1N", "Mini Truck"] },
  // More Japanese/European
  { name: "Infiniti", vehicle_type: "Passenger/Commercial", models: ["Q50", "Q60", "Q70", "QX30", "QX50", "QX55", "QX60", "QX70", "QX80"] },
  { name: "Acura", vehicle_type: "Passenger/Commercial", models: ["ILX", "TLX", "RLX", "RDX", "MDX", "NSX", "Integra", "ZDX"] },
  { name: "Daihatsu", vehicle_type: "Passenger/Commercial", models: ["Gran Max", "Luxio", "Terios", "Rocky", "Sirion", "Charade", "Copen", "Move", "Tanto", "Mira", "Boon", "Be-go", "Feroza"] },
  { name: "Hino", vehicle_type: "Commercial/Industrial", models: ["300 Series", "500 Series", "700 Series", "150 Bus", "AK Bus", "RK Bus", "FE", "FG", "FJ", "FL", "FS", "FW"] },
  { name: "Mitsubishi Fuso", vehicle_type: "Commercial/Industrial", models: ["Canter", "Fighter", "Super Great", "Rosa Bus", "Aero Bus", "eCanter"] },
  { name: "UD Trucks", vehicle_type: "Commercial/Industrial", models: ["Croner", "Quester", "Condor", "Phoenix", "Kuzer"] },
  { name: "Opel", vehicle_type: "Passenger/Commercial", models: ["Corsa", "Astra", "Insignia", "Grandland", "Mokka", "Crossland", "Zafira", "Combo", "Vivaro", "Movano"] },
  { name: "Smart", vehicle_type: "Passenger/Commercial", models: ["Fortwo", "Forfour", "#1", "#3"] },
  { name: "MAN", vehicle_type: "Commercial/Industrial", models: ["TGE", "TGL", "TGM", "TGS", "TGX", "Lion's City Bus", "Lion's Coach Bus"] },
  { name: "Range Rover", vehicle_type: "Passenger/Commercial", models: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery", "Discovery Sport", "Freelander"] },
  { name: "Lotus", vehicle_type: "Passenger/Commercial", models: ["Emira", "Eletre", "Evija", "Elise", "Exige", "Evora"] },
  { name: "Maybach", vehicle_type: "Passenger/Commercial", models: ["S-Class", "GLS", "EQS", "Landaulet"] },
  { name: "Koenigsegg", vehicle_type: "Passenger/Commercial", models: ["Agera RS", "Jesko", "Jesko Absolut", "Gemera", "Regera", "CC850"] },
  { name: "Polestar", vehicle_type: "Passenger/Commercial", models: ["Polestar 1", "Polestar 2", "Polestar 3", "Polestar 4"] },
  { name: "Scania", vehicle_type: "Commercial/Industrial", models: ["R Series", "S Series", "G Series", "P Series", "L Series", "F Series", "Citywide Bus", "Interlink Bus"] },
  { name: "Škoda", vehicle_type: "Passenger/Commercial", models: ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Slavia", "Kushaq"] },
  { name: "Dacia", vehicle_type: "Passenger/Commercial", models: ["Sandero", "Sandero Stepway", "Logan", "Logan MCV", "Duster", "Spring Electric", "Jogger", "Bigster"] },
  { name: "Peugeot", vehicle_type: "Passenger/Commercial", models: ["108", "208", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Partner", "Expert", "Boxer", "Landtrek"] },
  { name: "Citroën", vehicle_type: "Passenger/Commercial", models: ["C1", "C3", "C4", "C5 X", "C3 Aircross", "C5 Aircross", "Berlingo", "Dispatch", "Relay", "C-Elysée"] },
  { name: "DS", vehicle_type: "Passenger/Commercial", models: ["DS 3", "DS 4", "DS 7", "DS 9", "DS 3 Crossback E-Tense"] },
  { name: "Lancia", vehicle_type: "Passenger/Commercial", models: ["Ypsilon", "Stratos", "Delta"] },
  { name: "Maserati", vehicle_type: "Passenger/Commercial", models: ["Ghibli", "Quattroporte", "Levante", "Grecale", "MC20", "GranTurismo", "GranCabrio"] },
  { name: "Iveco", vehicle_type: "Commercial/Industrial", models: ["Daily", "Eurocargo", "Stralis", "S-Way", "X-Way", "Crossway Bus", "Urbanway Bus", "Evadys Bus"] },
  { name: "Genesis", vehicle_type: "Passenger/Commercial", models: ["G70", "G80", "G90", "GV70", "GV80", "GV60", "G70 Shooting Brake"] },
  { name: "SsangYong", vehicle_type: "Passenger/Commercial", models: ["Tivoli", "Korando", "Musso", "Rexton", "Rodius", "Actyon"] },
  { name: "KG Mobility", vehicle_type: "Passenger/Commercial", models: ["Torres", "Torres EVX", "Musso Grand"] },
  { name: "Dongfeng", vehicle_type: "Commercial/Industrial", models: ["DF6", "DF3504", "Rich 6", "Rich Max", "Succe", "DFM H30", "DFM 330", "CM7 Bus", "E11K"] },
  { name: "FAW", vehicle_type: "Commercial/Industrial", models: ["J6P", "CA1040", "CA1141", "Jiefang", "Bestune T77", "Bestune T99", "Hongqi H9"] },
  { name: "BAIC", vehicle_type: "Commercial/Industrial", models: ["BJ40", "BJ80", "X55", "X35", "EU5", "EC5", "B40", "Saab"] },
  { name: "JMC", vehicle_type: "Commercial/Industrial", models: ["Vigus", "Vigus 6", "Carrying", "N720", "N900", "Transit Van", "Teshun"] },
  { name: "SDLG", vehicle_type: "Commercial/Industrial", models: ["E6135F", "E6150F", "E6200F", "E6250F", "LG918H", "LG938L", "LG956L", "G9165F Grader"] },
  { name: "Doosan", vehicle_type: "Commercial/Industrial", models: ["DX140LC", "DX180LC", "DX255LC", "DX300LC", "DX420LC", "DL200TC", "DL300TC", "DL420TC"] },
  { name: "Hyundai CE", vehicle_type: "Commercial/Industrial", models: ["R80-9A", "R140LC-9A", "R210LC-9", "R300LC-9S", "R480LC-9A", "HX145A", "HX220A", "HL960A"] },
  { name: "Liebherr", vehicle_type: "Commercial/Industrial", models: ["R 918", "R 926", "R 938", "R 960 SME", "LR 1160", "LTM 1070", "LTM 1160", "LTM 1500", "L 507 Stereo", "L 538 Stereo", "T 264 Mining Truck"] },
  // Rivian, Lucid
  { name: "Rivian", vehicle_type: "Passenger/Commercial", models: ["R1T", "R1S", "EDV 500", "EDV 700"] },
  { name: "Lucid", vehicle_type: "Passenger/Commercial", models: ["Air Pure", "Air Touring", "Air Grand Touring", "Air Sapphire", "Gravity SUV"] },
  // Escorts Agri
  { name: "Escorts", vehicle_type: "Commercial/Industrial", models: ["Farmtrac 45", "Farmtrac 60", "Farmtrac 70", "Farmtrac 80", "Powertrac 434", "Powertrac 445", "Powertrac 457", "Powertrac 55"] },
  // Bajaj & TVS motorcycles
  { name: "Bajaj", vehicle_type: "Motorcycle", models: ["Pulsar 125", "Pulsar 150", "Pulsar 180", "Pulsar 200 NS", "Pulsar 220F", "Pulsar N250", "Pulsar RS200", "Avenger 160", "Avenger 220", "Dominar 250", "Dominar 400", "Platina", "CT 100", "Discover 110", "Discover 125"] },
  { name: "TVS", vehicle_type: "Motorcycle", models: ["Apache RTR 160", "Apache RTR 200", "Apache RR 310", "Raider 125", "Jupiter", "Ntorq 125", "iQube Electric", "Star City+", "Sport", "XL100", "Ronin"] },
];

const runSql = (sql) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query: sql });
    const req = https.request(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(responseData);
        else resolve(null);
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

async function seed() {
  console.log("Seeding additional vehicle data...");

  for (const entry of ADDITIONAL_DATA) {
    console.log(`\nAdding [${entry.name}] as ${entry.vehicle_type}...`);

    // Check if make already exists
    const checkSql = `SELECT id FROM public.vehicle_makes WHERE name = '${entry.name.replace(/'/g, "''")}';`;
    const checkRes = await runSql(checkSql);
    let makeId = null;
    try {
      const parsed = JSON.parse(checkRes);
      if (parsed && parsed.length > 0) {
        makeId = parsed[0].id;
        console.log(`  Already exists with id ${makeId}`);
      }
    } catch (e) {}

    if (!makeId) {
      const insertMakeSql = `
        INSERT INTO public.vehicle_makes (vehicle_type, name, is_active) 
        VALUES ('${entry.vehicle_type}', '${entry.name.replace(/'/g, "''")}', true) 
        RETURNING id;
      `;
      const makeRes = await runSql(insertMakeSql);
      try {
        const parsed = JSON.parse(makeRes);
        if (parsed && parsed.length > 0) makeId = parsed[0].id;
      } catch (e) {}
    }

    if (!makeId) {
      console.log(`  Failed to get make id for ${entry.name}`);
      continue;
    }

    // Insert models in chunks
    if (entry.models && entry.models.length > 0) {
      console.log(`  Inserting ${entry.models.length} models...`);
      const chunkSize = 50;
      for (let i = 0; i < entry.models.length; i += chunkSize) {
        const chunk = entry.models.slice(i, i + chunkSize);
        // Check existing models to avoid duplicates
        const values = chunk.map(m => `('${makeId}', '${m.replace(/'/g, "''")}', true, '{}'::jsonb)`).join(',');
        const modelSql = `
          INSERT INTO public.vehicle_models (make_id, name, is_active, metadata) 
          VALUES ${values}
          ON CONFLICT DO NOTHING;
        `;
        await runSql(modelSql);
      }
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log("\nDone seeding additional vehicles!");
}

seed().catch(console.error);
