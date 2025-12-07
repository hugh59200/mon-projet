/**
 * Script pour appliquer le trigger welcome email sur Supabase
 * Usage: SUPABASE_SERVICE_ROLE_KEY="..." node scripts/apply-welcome-trigger.cjs
 */

const https = require('https')

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required')
  process.exit(1)
}

const SQL = `
-- Fonction trigger pour envoyer l'email de bienvenue
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, extensions, pg_net
LANGUAGE plpgsql
AS $$
BEGIN
  -- Vérifie que email_confirmed_at vient d'être défini (première confirmation)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Appel asynchrone à l'Edge Function welcome-email via pg_net
    PERFORM net.http_post(
      url := 'https://dwomsbawthlktapmtmqu.supabase.co/functions/v1/welcome-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'user_id', NEW.id::text,
        'email', NEW.email,
        'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'locale', COALESCE(NEW.raw_user_meta_data->>'locale', 'fr')
      )
    );

    RAISE LOG 'Welcome email triggered for user: %', NEW.email;
  END IF;

  RETURN NEW;
END;
$$;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;

-- Créer le trigger sur auth.users
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

-- Commentaire
COMMENT ON FUNCTION public.trigger_welcome_email() IS
'Envoie un email de bienvenue lorsque l''utilisateur confirme son adresse email pour la première fois.';
`

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL('/rest/v1/rpc/exec_sql', SUPABASE_URL)

    // Utiliser l'endpoint SQL direct via PostgREST
    const postData = JSON.stringify({ query: sql })

    const options = {
      hostname: 'dwomsbawthlktapmtmqu.supabase.co',
      port: 443,
      path: '/rest/v1/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      }
    }

    // Essayons plutôt via pg-meta API
    const metaOptions = {
      hostname: 'dwomsbawthlktapmtmqu.supabase.co',
      port: 443,
      path: '/pg/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      }
    }

    const req = https.request(metaOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data })
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`))
        }
      })
    })

    req.on('error', reject)
    req.write(JSON.stringify({ query: sql }))
    req.end()
  })
}

async function main() {
  console.log('🚀 Applying welcome email trigger to Supabase...')

  try {
    const result = await executeSQL(SQL)
    console.log('✅ Welcome email trigger applied successfully!')
    console.log(result)
  } catch (error) {
    console.error('❌ Error:', error.message)

    // Fallback: afficher le SQL à exécuter manuellement
    console.log('\n📋 Please execute this SQL manually in Supabase Dashboard:\n')
    console.log('=' .repeat(60))
    console.log(SQL)
    console.log('=' .repeat(60))
  }
}

main()
