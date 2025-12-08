/**
 * Script pour exécuter du SQL sur Supabase via connexion PostgreSQL directe
 *
 * Usage:
 *   node scripts/exec-sql.cjs <fichier.sql>
 *
 * Exemple:
 *   node scripts/exec-sql.cjs supabase/script/migrate-v6.2-sessions.sql
 *
 * Prérequis:
 *   npm install pg (si pas déjà installé)
 *
 * La connexion utilise le pooler de Supabase (port 6543)
 * Le mot de passe est demandé interactivement ou via DATABASE_PASSWORD env var
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration Supabase
const SUPABASE_PROJECT_REF = 'dwomsbawthlktapmtmqu';
const SUPABASE_DB_HOST = `db.${SUPABASE_PROJECT_REF}.supabase.co`;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PORT = 5432; // Direct connection

async function askPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Database password: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const sqlFile = process.argv[2];

  if (!sqlFile) {
    console.log('Usage: node scripts/exec-sql.cjs <fichier.sql>');
    console.log('');
    console.log('Exemple:');
    console.log('  node scripts/exec-sql.cjs supabase/script/migrate-v6.2-sessions.sql');
    process.exit(1);
  }

  const sqlPath = path.resolve(process.cwd(), sqlFile);

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Fichier non trouvé: ${sqlPath}`);
    process.exit(1);
  }

  // Vérifier si pg est installé
  let pg;
  try {
    pg = require('pg');
  } catch (e) {
    console.error('❌ Le package "pg" n\'est pas installé.');
    console.log('');
    console.log('Installez-le avec: npm install pg');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`📄 Fichier SQL: ${sqlFile}`);
  console.log(`📊 Taille: ${sql.length} caractères`);
  console.log('');

  // Récupérer le mot de passe
  const password = process.env.DATABASE_PASSWORD || await askPassword();

  if (!password) {
    console.error('❌ Mot de passe requis');
    process.exit(1);
  }

  // Connexion à la base (connexion directe)
  const connectionString = `postgresql://${DB_USER}:${password}@${SUPABASE_DB_HOST}:${DB_PORT}/${DB_NAME}`;

  console.log(`🔌 Connexion à Supabase (${SUPABASE_PROJECT_REF})...`);

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connecté!\n');

    console.log('🚀 Exécution du SQL...\n');

    const result = await client.query(sql);

    console.log('✅ Migration exécutée avec succès!');

    if (Array.isArray(result)) {
      console.log(`   ${result.length} commandes exécutées`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.position) {
      const lines = sql.substring(0, parseInt(error.position)).split('\n');
      console.error(`   Ligne approximative: ${lines.length}`);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Déconnecté');
  }
}

main();
