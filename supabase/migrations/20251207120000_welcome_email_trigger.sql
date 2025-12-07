-- Migration: Trigger pour envoyer l'email de bienvenue après confirmation
-- Déclenché quand email_confirmed_at passe de NULL à une date

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

-- Trigger sur auth.users pour détecter la confirmation d'email
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;

CREATE TRIGGER on_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

-- Commentaire pour la documentation
COMMENT ON FUNCTION public.trigger_welcome_email() IS
'Envoie un email de bienvenue lorsque l''utilisateur confirme son adresse email pour la première fois.';
