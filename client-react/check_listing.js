import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: cat } = await supabase
    .from('categories')
    .select('slug')
    .like('path', 'auto-spares/%')
    .eq('depth', 1);
  
  const slugs = cat.map(c => c.slug);
  console.log('Subcategory slugs:', slugs);

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, category')
    .in('category', slugs);
  
  console.log(`Listings in subcategories: ${listings.length}`);
  if (listings.length > 0) {
    console.log(listings);
  }
}

check();
