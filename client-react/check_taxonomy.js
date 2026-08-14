import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: lv } = await supabase
    .from('lookup_values')
    .select('id, value')
    .eq('lookup_type', 'auto-spares_partCategory');
  console.log('lookup_values partCategory:', lv);

  const { data: cat } = await supabase
    .from('categories')
    .select('name, slug')
    .like('path', 'auto-spares/%')
    .eq('depth', 1);
  console.log('categories under auto-spares:', cat);
}

check();
