const { Client } = require('pg'); 
const c = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/adhub' }); 
c.connect()
  .then(() => c.query(`SELECT a.name, a.is_filterable FROM attributes a JOIN category_attributes ca ON a.id = ca.attribute_id JOIN categories c ON c.id = ca.category_id WHERE c.slug = 'auto-spares'`))
  .then(res => { console.log(res.rows); c.end(); })
  .catch(console.error);
