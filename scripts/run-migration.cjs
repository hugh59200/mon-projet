/**
 * Script pour exécuter la migration SQL V6.2 (User Sessions)
 * Usage: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/run-migration.cjs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function runMigration() {
  console.log('🚀 Running migration V6.2 - User Sessions Tracking...\n');

  // Lire le fichier SQL
  const sqlPath = path.join(__dirname, '../supabase/script/migrate-v6.2-sessions.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Séparer les commandes SQL (par les points-virgules suivis de newlines)
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  console.log(`📝 ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';

    try {
      // Utiliser rpc pour exécuter du SQL brut n'est pas possible
      // On doit utiliser l'API de management ou le SQL Editor
      // Pour l'instant, on affiche juste les commandes
      console.log(`[${i + 1}/${statements.length}] ${preview}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Migration preview complete`);
  console.log(`\n⚠️  Pour exécuter réellement la migration:`);
  console.log(`   1. Aller sur https://supabase.com/dashboard/project/dwomsbawthlktapmtmqu/sql`);
  console.log(`   2. Copier-coller le contenu de: supabase/script/migrate-v6.2-sessions.sql`);
  console.log(`   3. Cliquer sur "Run"\n`);
}

runMigration().catch(console.error);
