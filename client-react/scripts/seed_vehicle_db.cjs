/**
 * seed_vehicle_db.cjs
 */
const https = require('https');

const TARGET_MAKES = [
  "Toyota", "Lexus", "Nissan", "Honda", "Mazda", "Subaru", 
  "Suzuki", "Mitsubishi", "Isuzu", "Mercedes-Benz", "BMW", "Audi", "Volkswagen", 
  "Porsche", "Land Rover", "Jaguar", "Ford", "Chevrolet", "Jeep", "Hyundai", "Kia", 
  "Peugeot", "Volvo", "Mahindra", "Yamaha", "Kawasaki", "John Deere", "Caterpillar"
];

const SUPABASE_TOKEN = "SUPABASE_PAT_REDACTED";
const PROJECT_REF = "htezwjuiboordwjclton";

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', reject);
  });
};

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
  console.log("Starting DB Seed Process...");
  
  for (const makeName of TARGET_MAKES) {
    console.log(`\nFetching models for [${makeName}]...`);
    
    let vType = "Passenger/Commercial";
    if (["Yamaha", "Kawasaki"].includes(makeName)) vType = "Motorcycle";
    else if (["John Deere", "Caterpillar"].includes(makeName)) vType = "Commercial";

    // 1. Insert Make
    const makeSql = `
      INSERT INTO public.vehicle_makes (vehicle_type, name, is_active) 
      VALUES ('${vType}', '${makeName.replace(/'/g, "''")}', true) 
      RETURNING id;
    `;
    const makeRes = await runSql(makeSql);
    let makeId = null;
    try {
      const parsed = JSON.parse(makeRes);
      if (parsed && parsed.length > 0) makeId = parsed[0].id;
    } catch (e) {}

    if (!makeId) {
      console.log(`Failed to insert make ${makeName}`);
      continue;
    }

    // 2. Fetch Models
    const searchName = makeName.replace(' ', '%20');
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${searchName}?format=json`;
    const response = await fetchJson(nhtsaUrl);
    
    if (response && response.Results && response.Results.length > 0) {
      const uniqueModels = [...new Set(response.Results.map(r => r.Model_Name.trim()))];
      console.log(`Found ${uniqueModels.length} models for ${makeName}. Inserting...`);
      
      const chunkSize = 50;
      for (let i = 0; i < uniqueModels.length; i += chunkSize) {
        const chunk = uniqueModels.slice(i, i + chunkSize);
        const values = chunk.map(m => `('${makeId}', '${m.replace(/'/g, "''")}', true, '{}'::jsonb)`).join(',');
        const modelSql = `INSERT INTO public.vehicle_models (make_id, name, is_active, metadata) VALUES ${values};`;
        await runSql(modelSql);
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log("\nFinished seeding vehicle DB!");
}

seed().catch(console.error);
