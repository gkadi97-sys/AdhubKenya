import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htezwjuiboordwjclton.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZXp3anVpYm9vcmR3amNsdG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTk2NTMsImV4cCI6MjA5NzE3NTY1M30.tcjpSqjMEGecLfPr_YSOTCkA0Rm5Imfw13JGikhwz1A';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getLookupValues(lookupType, parentId = null) {
  let query = supabase
    .from('lookup_values')
    .select('*')
    .eq('lookup_type', lookupType)
    .eq('is_active', true)
    .order('order_index');
    
  if (parentId === 'any') {
    // No parent filter, just fetch by lookup_type
  } else if (parentId) {
    query = query.eq('parent_id', parentId);
  } else {
    query = query.is('parent_id', null);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("Query Error:", error);
    return [];
  }
  return data;
}

async function debugReact() {
  console.log("=== SIMULATING REACT LOGIC ===");
  
  // 1. Simulating parentLookupId effect
  console.log("1. Finding parentLookupId for 'Samsung' in 'phones_tablets_brand'");
  const rows = await getLookupValues('phones_tablets_brand', 'any');
  console.log(`   Found ${rows.length} rows for 'phones_tablets_brand'`);
  const match = rows.find(r => r.value === 'Samsung');
  const parentLookupId = match?.id ?? null;
  console.log(`   match found:`, match ? match.id : 'NO MATCH');

  // 2. Simulating options fetch effect
  console.log(`\n2. Fetching options for 'phones_tablets_model' using parentLookupId: ${parentLookupId}`);
  const options = await getLookupValues('phones_tablets_model', parentLookupId);
  console.log(`   Found ${options.length} options!`);
  if (options.length > 0) {
    console.log(`   First option:`, options[0].value);
  } else {
    console.log(`   WHY IS IT EMPTY?`);
    // Let's dump the raw query
    const { data: raw } = await supabase.from('lookup_values').select('*').eq('lookup_type', 'phones_tablets_model').limit(5);
    console.log("   Here are 5 random models from the DB just to see what their parent_id is:");
    console.log(JSON.stringify(raw, null, 2));
  }
}

debugReact();
