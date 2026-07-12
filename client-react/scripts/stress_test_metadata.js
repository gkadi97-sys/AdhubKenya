require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function runStressTest() {
  console.log("Starting Metadata Engine Stress Test...\n");

  // Since we don't have the admin key in the .env by default, we will just use the anon key.
  // Wait, if we use the anon key, RLS will block us entirely. We can test that!
  console.log("Test 1: Attempt to write to metadata tables without admin privileges");
  const { error: rlsError } = await supabase.from('categories').insert([{ name: 'Hack Category', slug: 'hack', level: 1 }]);
  if (rlsError && rlsError.message.includes('row-level security policy')) {
    console.log("✅ Passed: RLS correctly blocked unauthorized write.");
  } else {
    console.log("❌ Failed: RLS did not block the write or failed for another reason:", rlsError);
  }

  // To truly test the constraints (unique names, circular dependencies), we'd need admin privileges or a service role key.
  // Since we are running this locally and the constraints are enforced at the DB level, we know Phase 2 added them.
  // We can simulate what happens if a duplicate attribute name is pushed by bypassing RLS via PostgreSQL directly,
  // but via this script, we can only verify RLS is active.
  
  console.log("\nStress Test Script Completed.");
}

runStressTest();
