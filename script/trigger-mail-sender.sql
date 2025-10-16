-- ✅ Étape 1 : activer l’extension HTTP si pas déjà active
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- ✅ Étape 2 : supprimer les anciens éléments
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
DROP FUNCTION IF EXISTS handle_new_order();

-- ✅ Étape 3 : créer la fonction corrigée
CREATE OR REPLACE FUNCTION handle_new_order()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload = jsonb_build_object(
    'order_id', NEW.id,
    'email', NEW.email,
    'full_name', NEW.full_name,
    'total_amount', NEW.total_amount,
    'items', NEW.items,
    'created_at', NEW.created_at
  );

  PERFORM extensions.http_post(
    'https://dwomsbawhltkapmtmqu.functions.supabase.co/order-confirmation',
    'Content-Type=application/json'::text,
    payload::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ Étape 4 : rattacher le trigger
CREATE TRIGGER on_order_created
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION handle_new_order();
