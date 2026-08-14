import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY); // Need service_role key to bypass RLS for deletes

async function deleteCategories() {
  const slugs = [
    'engine-components',
    'brakes-suspension',
    'body-exterior',
    'auto-electrical',
    'transmission',
    'tyres-wheels',
    'car-audio',
    'oils-fluids',
    'garage-tools'
  ];

  const { data, error } = await supabase
    .from('categories')
    .delete()
    .in('slug', slugs)
    .select('slug');

  if (error) console.error('Error deleting:', error);
  else console.log('Successfully deleted:', data);
}

deleteCategories();
