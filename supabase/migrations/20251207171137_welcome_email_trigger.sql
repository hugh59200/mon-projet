-- Migration: Trigger to send welcome email after confirmation
-- Triggered when email_confirmed_at changes from NULL to a date

-- Trigger function to send welcome email
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, extensions, pg_net
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if email_confirmed_at was just set (first confirmation)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Async call to Edge Function welcome-email via pg_net
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

-- Trigger on auth.users to detect email confirmation
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;

CREATE TRIGGER on_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

-- Documentation comment
COMMENT ON FUNCTION public.trigger_welcome_email() IS
'Sends a welcome email when user confirms their email address for the first time.';
