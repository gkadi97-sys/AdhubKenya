import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase
    .from('attributes')
    .select('name, category_id, categories(slug)')
    .in('name', ['listingType', 'partCategory', 'part']);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

check();
