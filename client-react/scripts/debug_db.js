import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htezwjuiboordwjclton.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZXp3anVpYm9vcmR3amNsdG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTk2NTMsImV4cCI6MjA5NzE3NTY1M30.tcjpSqjMEGecLfPr_YSOTCkA0Rm5Imfw13JGikhwz1A';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log("=== DB DEBUG ===");
  
  // 1. Check if Samsung exists in brands
  const { data: brands } = await supabase
    .from('lookup_values')
    .select('*')
    .eq('lookup_type', 'phones_tablets_brand')
    .eq('value', 'Samsung');
  console.log("Samsung Brands:", JSON.stringify(brands, null, 2));

  if (brands.length > 0) {
    // 2. Check models parented to the first Samsung brand
    const { data: models } = await supabase
      .from('lookup_values')
      .select('*')
      .eq('lookup_type', 'phones_tablets_model')
      .eq('parent_id', brands[0].id);
    console.log(`Models for Samsung (${brands[0].id}):`, models.length);
  }

  // 3. Check attribute dependencies for Model
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'phones-tablets').single();
  const { data: attrBrand } = await supabase.from('attributes').select('id').eq('category_id', cat.id).eq('name', 'brand').single();
  const { data: attrModel } = await supabase.from('attributes').select('id').eq('category_id', cat.id).eq('name', 'model').single();

  console.log("Brand Attr ID:", attrBrand?.id);
  console.log("Model Attr ID:", attrModel?.id);

  const { data: deps } = await supabase.from('attribute_dependencies').select('*').eq('attribute_id', attrModel?.id);
  console.log("Model Dependencies:", JSON.stringify(deps, null, 2));
}

debug();
