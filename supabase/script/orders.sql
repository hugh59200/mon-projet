-- =============================
-- 🧾 TABLE : orders
-- =============================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  zip text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  payment_method text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  items jsonb, -- ✅ Stocke les produits au format JSON
  status text DEFAULT 'pending', -- ✅ Uniformisé pour correspondre au webhook
  internal_notes text DEFAULT '',
  carrier text,
  tracking_number text,
  shipped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- 💳 Stripe : lien avec le paiement
  payment_intent_id text UNIQUE, -- ✅ lien avec Stripe PaymentIntent
  stripe_session_id text UNIQUE  -- ✅ pour garder la trace du Checkout Session
);

-- ✅ Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON public.orders (payment_intent_id);

-- ✅ RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ✅ Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own orders') THEN
    CREATE POLICY "Users can view their own orders"
      ON public.orders
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own orders') THEN
    CREATE POLICY "Users can insert their own orders"
      ON public.orders
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all orders') THEN
    CREATE POLICY "Admins can manage all orders"
      ON public.orders
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      );
  END IF;
END $$;

-- =============================
-- 📦 TABLE : order_items
-- =============================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  subtotal numeric(10,2) GENERATED ALWAYS AS (price * quantity) STORED
);

-- ✅ Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- ✅ RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ✅ Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own order_items') THEN
    CREATE POLICY "Users can view their own order_items"
      ON public.order_items
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = order_items.order_id
          AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own order_items') THEN
    CREATE POLICY "Users can insert their own order_items"
      ON public.order_items
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = order_items.order_id
          AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all order_items') THEN
    CREATE POLICY "Admins can manage all order_items"
      ON public.order_items
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      );
  END IF;
END $$;

-- =============================
-- ⚙️ FONCTION : create_full_order()
-- =============================
CREATE OR REPLACE FUNCTION create_full_order(
  _user_id uuid,
  _email text,
  _full_name text,
  _address text,
  _zip text,
  _city text,
  _country text,
  _payment_method text,
  _total_amount numeric,
  _items jsonb,
  _status text DEFAULT 'pending',
  _payment_intent_id text DEFAULT NULL,
  _stripe_session_id text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  new_order_id uuid;
BEGIN
  INSERT INTO orders (
    user_id,
    email,
    full_name,
    address,
    zip,
    city,
    country,
    payment_method,
    total_amount,
    items,
    status,
    payment_intent_id,
    stripe_session_id,
    created_at,
    updated_at
  )
  VALUES (
    _user_id,
    _email,
    _full_name,
    _address,
    _zip,
    _city,
    _country,
    _payment_method,
    _total_amount,
    _items,
    _status,
    _payment_intent_id,
    _stripe_session_id,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_order_id;

  RETURN new_order_id;
END;
$$;

-- 🔄 Recharge le schéma PostgREST pour l’API
NOTIFY pgrst, 'reload schema';

