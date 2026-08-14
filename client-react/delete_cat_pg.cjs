const { Client } = require('pg'); 
const c = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/adhub' }); 
c.connect()
  .then(() => c.query(`DELETE FROM categories WHERE slug IN ('engine-components', 'brakes-suspension', 'body-exterior', 'auto-electrical', 'transmission', 'tyres-wheels', 'car-audio', 'oils-fluids', 'garage-tools');`))
  .then(res => { console.log('Deleted rows:', res.rowCount); c.end(); })
  .catch(console.error);
