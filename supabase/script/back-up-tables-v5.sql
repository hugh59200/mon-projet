-- ============================================================
-- SUPABASE CLEAN BACKUP V5.2 — i18n + GUEST + RELAY + MANUAL PAYMENT
-- ============================================================
-- V5.2 : Suppression Stripe/PayPal - Paiements manuels uniquement (Virement/Crypto)
-- V5.1 : Ajout payment_method dans orders_overview_for_admin (validation paiement manuel)
-- V5.0 : Support multilingue (colonnes JSONB i18n)
-- V4.0 : Integration Mondial Relay
-- V3.1 : Guest checkout secured avec tracking token
-- ============================================================

-- ============================================================
-- BLOC 1 — DROP EXISTING OBJECTS (SAFE ORDER)
-- ============================================================

DROP VIEW IF EXISTS
  public.orders_full_view,
  public.orders_overview_for_admin,
  public.orders_detailed_view,
  public.conversation_overview,
  public.messages_unread_view,
  public.messages_by_conversation_view,
  public.user_overview,
  public.user_cart_view
CASCADE;

DROP TABLE IF EXISTS
  public.payment_events,
  public.emails_sent,
  public.order_items,
  public.orders,
  public.user_cart_items,
  public.news,
  public.news_topics,
  public.conversations,
  public.messages,
  public.products,
  public.profiles
CASCADE;

-- Drop triggers & functions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_messages_sync_conversation') THEN DROP TRIGGER tr_messages_sync_conversation ON public.messages; END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_messages_sync_conversation_admin') THEN DROP TRIGGER tr_messages_sync_conversation_admin ON public.messages; END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_conversations_touch_updated_at') THEN DROP TRIGGER tr_conversations_touch_updated_at ON public.conversations; END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_order_number') THEN DROP TRIGGER set_order_number ON public.orders; END IF;
END $$;

DROP FUNCTION IF EXISTS
  public.handle_new_user,
  public.delete_user_messages,
  public.sync_conversation_on_read,
  public.sync_conversation_on_admin_read,
  public.touch_conversation_updated_at,
  public.generate_order_number,
  public.is_admin,
  public.jwt_custom_claims,
  public.user_exists_by_email,
  public.create_order_with_items_full,
  public.admin_update_order_status,
  public.claim_order_for_user,
  public.get_guest_order_details,
  public.get_order_summary_public,
  public.get_guest_order_by_token,
  public.claim_guest_orders,
  public.update_order_relay,
  public.remove_order_relay
CASCADE;

-- ============================================================
-- BLOC 2 — TABLES (STRUCTURE V5.0)
-- ============================================================

-- ============================
-- PROFILES
-- ============================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  cgu_accepted boolean DEFAULT false,
  cgu_accepted_at timestamptz,
  phone text,
  address text,
  zip text,
  city text,
  country text,
  birthdate date,
  gender text CHECK (gender IN ('male','female','other')),
  ui_preferences jsonb DEFAULT '{}'::jsonb
);

-- ============================
-- PRODUCTS (avec i18n)
-- ============================
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dosage text,
  category text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sale_price numeric(10,2) CHECK (sale_price >= 0),
  is_on_sale boolean DEFAULT false,
  purity numeric(5,2) CHECK (purity >= 0 AND purity <= 100),
  image text,
  tags text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  -- i18n : traductions multilingues (JSONB)
  name_i18n jsonb DEFAULT '{}'::jsonb,
  description_i18n jsonb DEFAULT '{}'::jsonb,
  category_i18n jsonb DEFAULT '{}'::jsonb
);

COMMENT ON COLUMN public.products.name_i18n IS 'Traductions du nom: {"en": "...", "de": "...", "es": "..."}';
COMMENT ON COLUMN public.products.description_i18n IS 'Traductions de la description';
COMMENT ON COLUMN public.products.category_i18n IS 'Traductions de la categorie';

CREATE UNIQUE INDEX uniq_product_name_dosage ON public.products (name, dosage);
CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_on_sale ON public.products (is_on_sale) WHERE is_on_sale = true;

-- ============================
-- MESSAGES & CONVERSATIONS
-- ============================
CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  sender_role text DEFAULT 'user' CHECK (sender_role IN ('user','admin')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  read_at timestamptz
);
CREATE INDEX idx_messages_user_id ON public.messages (user_id);
CREATE INDEX idx_messages_unread ON public.messages (user_id, is_read) WHERE is_read = false;

CREATE TABLE public.conversations (
  user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  last_read_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_read_at timestamptz DEFAULT now(),
  last_admin_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_admin_read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- ============================
-- CART ITEMS
-- ============================
CREATE TABLE public.user_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  updated_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX uniq_cart_user_product ON public.user_cart_items (user_id, product_id);

-- ============================
-- ORDERS (Guest Ready + Relay)
-- ============================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'paid', 'confirmed', 'shipped', 'completed', 'canceled', 'refunded', 'failed');
  END IF;
END $$;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE,

  -- Token de tracking securise pour invites
  tracking_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),

  -- Flag pour distinguer Guest vs User
  is_guest_order boolean GENERATED ALWAYS AS (user_id IS NULL) STORED,

  -- Coordonnees client
  full_name text NOT NULL,
  email text NOT NULL,
  address text,
  zip text,
  city text,
  country text,

  -- Paiement (Virement bancaire / Crypto)
  payment_method text,

  -- Montants
  subtotal numeric(10,2) DEFAULT 0 CHECK (subtotal >= 0),
  tax_amount numeric(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_cost numeric(10,2) DEFAULT 0 CHECK (shipping_cost >= 0),
  discount_amount numeric(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),

  -- Statut
  status order_status NOT NULL DEFAULT 'pending',
  internal_notes text DEFAULT '',

  -- Livraison
  carrier text,
  tracking_number text,
  shipped_at timestamptz,

  -- Point Relais (Mondial Relay)
  relay_id text,
  relay_name text,
  relay_address text,
  relay_zipcode text,
  relay_city text,
  relay_country text DEFAULT 'FR',

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index de performance
CREATE INDEX idx_orders_user_id ON public.orders (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_orders_email ON public.orders (lower(email));
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX idx_orders_tracking_token ON public.orders (tracking_token);
CREATE INDEX idx_orders_guest ON public.orders (is_guest_order) WHERE is_guest_order = true;
CREATE INDEX idx_orders_relay_id ON public.orders (relay_id) WHERE relay_id IS NOT NULL;

COMMENT ON COLUMN public.orders.relay_id IS 'ID du point relais Mondial Relay. NULL = livraison domicile.';
COMMENT ON COLUMN public.orders.relay_name IS 'Nom commercial du point relais';

-- ============================
-- ORDER ITEMS
-- ============================
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  product_name_snapshot text NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items (product_id);

-- ============================
-- EMAILS SENT
-- ============================
CREATE TABLE public.emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  type text CHECK (type IN ('confirmation','status_update','shipping','cancelation','payment','custom')) NOT NULL DEFAULT 'custom',
  status text CHECK (status IN ('sent','error')) DEFAULT 'sent',
  provider_response jsonb,
  sent_at timestamptz DEFAULT now()
);
CREATE INDEX idx_emails_order_id ON public.emails_sent (order_id);
CREATE INDEX idx_emails_sent_at ON public.emails_sent (sent_at DESC);

-- ============================
-- PAYMENT EVENTS
-- ============================
CREATE TABLE public.payment_events (
  id bigint generated always as identity primary key,
  provider text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_payment_events_order_id ON public.payment_events (order_id);

-- ============================
-- NEWS & TOPICS (avec i18n)
-- ============================
CREATE TABLE public.news_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now(),
  -- i18n
  label_i18n jsonb DEFAULT '{}'::jsonb,
  description_i18n jsonb DEFAULT '{}'::jsonb
);

COMMENT ON COLUMN public.news_topics.label_i18n IS 'Traductions du label: {"en": "...", "de": "..."}';
COMMENT ON COLUMN public.news_topics.description_i18n IS 'Traductions de la description';

CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  image text,
  published_at timestamptz,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  topic_id uuid REFERENCES public.news_topics(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  -- i18n
  title_i18n jsonb DEFAULT '{}'::jsonb,
  excerpt_i18n jsonb DEFAULT '{}'::jsonb,
  content_i18n jsonb DEFAULT '{}'::jsonb
);

COMMENT ON COLUMN public.news.title_i18n IS 'Traductions du titre';
COMMENT ON COLUMN public.news.excerpt_i18n IS 'Traductions de l''extrait';
COMMENT ON COLUMN public.news.content_i18n IS 'Traductions du contenu';

CREATE INDEX idx_news_published_at ON public.news (published_at DESC);
CREATE INDEX idx_news_topic_id ON public.news (topic_id);

-- ============================================================
-- BLOC 3 — RLS POLICIES (SECURITY)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails_sent ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Products (Public)
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Messages
CREATE POLICY "User read own" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User insert own" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User update read" ON public.messages FOR UPDATE USING (auth.uid() = user_id AND sender_role = 'admin');

-- Conversations
CREATE POLICY "User manage own conversation" ON public.conversations FOR ALL USING (auth.uid() = user_id);

-- Cart
CREATE POLICY "User manage cart" ON public.user_cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "User view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Order Items
CREATE POLICY "Users view own order items" ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND o.user_id = auth.uid()
    )
  );

-- News (Public)
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read topics" ON public.news_topics FOR SELECT USING (true);

-- ============================================================
-- BLOC 4 — ADMIN POLICIES
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid) RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Admin full profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full products" ON public.products FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full messages" ON public.messages FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full conversations" ON public.conversations FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full order_items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full news" ON public.news FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full topics" ON public.news_topics FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin read emails" ON public.emails_sent FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Service Insert Emails" ON public.emails_sent FOR INSERT TO service_role WITH CHECK (true);

-- ============================================================
-- BLOC 5 — FUNCTIONS & TRIGGERS
-- ============================================================

-- 1. Handle New User
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''), 'user', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Generate Order Number
CREATE SEQUENCE IF NOT EXISTS orders_seq START 1;
CREATE OR REPLACE FUNCTION public.generate_order_number() RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT nextval('orders_seq') INTO next_number;
  NEW.order_number := 'FP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_number::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders FOR EACH ROW WHEN (NEW.order_number IS NULL) EXECUTE FUNCTION public.generate_order_number();

-- 3. Messages Sync
CREATE OR REPLACE FUNCTION public.delete_user_messages() RETURNS trigger AS $$
BEGIN DELETE FROM public.messages WHERE user_id = OLD.id; RETURN OLD; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_profile_deleted AFTER DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.delete_user_messages();

CREATE OR REPLACE FUNCTION public.sync_conversation_on_read() RETURNS trigger AS $$
BEGIN
  IF NEW.is_read = true AND (OLD.is_read IS DISTINCT FROM NEW.is_read) THEN
    UPDATE public.conversations SET last_read_message_id = NEW.id, last_read_at = now() WHERE user_id = NEW.user_id;
  END IF; RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER tr_messages_sync_conversation AFTER UPDATE OF is_read ON public.messages FOR EACH ROW EXECUTE FUNCTION public.sync_conversation_on_read();

CREATE OR REPLACE FUNCTION public.sync_conversation_on_admin_read() RETURNS trigger AS $$
BEGIN
  IF NEW.is_read = true AND NEW.sender_role = 'user' THEN
    UPDATE public.conversations SET last_admin_message_id = NEW.id, last_admin_read_at = now() WHERE user_id = NEW.user_id;
  END IF; RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER tr_messages_sync_conversation_admin AFTER UPDATE OF is_read ON public.messages FOR EACH ROW EXECUTE FUNCTION public.sync_conversation_on_admin_read();

CREATE OR REPLACE FUNCTION public.touch_conversation_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER tr_conversations_touch_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.touch_conversation_updated_at();

-- 4. Helpers
CREATE OR REPLACE FUNCTION public.jwt_custom_claims() RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object('role', (SELECT role FROM public.profiles WHERE id = auth.uid()));
$$;

CREATE OR REPLACE FUNCTION public.user_exists_by_email(p_email text) RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_email);
$$;
GRANT EXECUTE ON FUNCTION public.user_exists_by_email(text) TO anon, authenticated;

-- ============================================================
-- BLOC 6 — RPC TRANSACTION (COMMANDE) - GUEST + RELAY
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_order_with_items_full(
  p_user_id uuid,
  p_email text,
  p_full_name text,
  p_address text,
  p_zip text,
  p_city text,
  p_country text,
  p_payment_method text,
  p_subtotal numeric,
  p_tax_amount numeric,
  p_shipping_cost numeric,
  p_discount_amount numeric,
  p_total_amount numeric,
  p_items jsonb,
  -- Parametres optionnels pour le point relais
  p_relay_id text DEFAULT NULL,
  p_relay_name text DEFAULT NULL,
  p_relay_address text DEFAULT NULL,
  p_relay_zipcode text DEFAULT NULL,
  p_relay_city text DEFAULT NULL,
  p_relay_country text DEFAULT 'FR'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_order_id uuid;
  new_tracking_token text;
  item jsonb;
  product_record RECORD;
BEGIN
  -- Validation des donnees
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email requis';
  END IF;

  IF p_total_amount <= 0 THEN
    RAISE EXCEPTION 'Montant invalide';
  END IF;

  -- 1. Creation Commande avec infos relay optionnelles
  INSERT INTO public.orders (
    user_id, email, full_name, address, zip, city, country,
    payment_method, status,
    subtotal, tax_amount, shipping_cost, discount_amount, total_amount,
    relay_id, relay_name, relay_address, relay_zipcode, relay_city, relay_country
  )
  VALUES (
    p_user_id, p_email, p_full_name, p_address, p_zip, p_city, p_country,
    p_payment_method, 'pending',
    COALESCE(p_subtotal, 0), COALESCE(p_tax_amount, 0),
    COALESCE(p_shipping_cost, 0), COALESCE(p_discount_amount, 0),
    p_total_amount,
    p_relay_id, p_relay_name, p_relay_address, p_relay_zipcode, p_relay_city,
    CASE WHEN p_relay_id IS NOT NULL THEN COALESCE(p_relay_country, 'FR') ELSE NULL END
  )
  RETURNING id, tracking_token INTO new_order_id, new_tracking_token;

  -- 2. Insertion Produits avec verification de stock
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO product_record
    FROM public.products p
    WHERE p.id = (item->>'product_id')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produit introuvable: %', item->>'product_id';
    END IF;

    IF product_record.stock < COALESCE((item->>'quantity')::integer, 1) THEN
      RAISE EXCEPTION 'Stock insuffisant pour: %', product_record.name;
    END IF;

    INSERT INTO public.order_items (order_id, product_id, quantity, price, product_name_snapshot)
    VALUES (
      new_order_id,
      product_record.id,
      COALESCE((item->>'quantity')::integer, 1),
      CASE
        WHEN product_record.is_on_sale AND product_record.sale_price IS NOT NULL
        THEN product_record.sale_price
        ELSE product_record.price
      END,
      product_record.name || CASE
        WHEN product_record.dosage IS NOT NULL
        THEN ' (' || product_record.dosage || ')'
        ELSE ''
      END
    );

    -- Decrementation du stock
    UPDATE public.products
    SET stock = stock - COALESCE((item->>'quantity')::integer, 1)
    WHERE id = product_record.id;
  END LOOP;

  -- Si user connecte, vider son panier
  IF p_user_id IS NOT NULL THEN
    DELETE FROM public.user_cart_items WHERE user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'order_id', new_order_id,
    'tracking_token', new_tracking_token,
    'is_relay_delivery', (p_relay_id IS NOT NULL),
    'status', 'success'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items_full TO anon, authenticated;

-- ============================================================
-- BLOC 7 — GUEST ORDER FUNCTIONS
-- ============================================================

-- Tracking securise par TOKEN
CREATE OR REPLACE FUNCTION public.get_guest_order_by_token(
  p_tracking_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_data jsonb;
BEGIN
  SELECT to_jsonb(ofv.*)
  INTO v_order_data
  FROM public.orders_full_view ofv
  WHERE ofv.tracking_token = p_tracking_token
  AND ofv.is_guest_order = true;

  IF v_order_data IS NULL THEN
    RETURN jsonb_build_object('found', false, 'message', 'Commande introuvable.');
  END IF;

  RETURN jsonb_build_object('found', true, 'order', v_order_data);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_order_by_token TO anon, authenticated;

-- Fallback: Tracking par Email + Order Number
CREATE OR REPLACE FUNCTION public.get_guest_order_details(
  p_email text,
  p_order_number text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_data jsonb;
BEGIN
  SELECT to_jsonb(ofv.*)
  INTO v_order_data
  FROM public.orders_full_view ofv
  WHERE lower(ofv.shipping_email) = lower(p_email)
  AND ofv.order_number = p_order_number
  AND ofv.is_guest_order = true;

  IF v_order_data IS NULL THEN
    RETURN jsonb_build_object('found', false, 'message', 'Commande introuvable ou informations incorrectes.');
  END IF;

  RETURN jsonb_build_object('found', true, 'order', v_order_data);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_order_details TO anon, authenticated;

-- Migration Guest → User
CREATE OR REPLACE FUNCTION public.claim_order_for_user(
  p_order_id uuid,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_email text;
  v_user_email text;
  v_rows_affected int;
BEGIN
  SELECT email INTO v_order_email
  FROM public.orders
  WHERE id = p_order_id AND user_id IS NULL;

  IF v_order_email IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Commande introuvable ou deja attribuee.');
  END IF;

  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = p_user_id;

  IF v_user_email IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Utilisateur introuvable.');
  END IF;

  IF LOWER(v_order_email) != LOWER(v_user_email) THEN
    RETURN jsonb_build_object('success', false, 'message', 'L''email du compte ne correspond pas a la commande.');
  END IF;

  UPDATE public.orders
  SET user_id = p_user_id, updated_at = now()
  WHERE id = p_order_id AND user_id IS NULL;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;

  IF v_rows_affected > 0 THEN
    RETURN jsonb_build_object('success', true, 'message', 'Commande liee avec succes.');
  ELSE
    RETURN jsonb_build_object('success', false, 'message', 'Erreur lors de la mise a jour.');
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_order_for_user TO authenticated;

-- Bulk claim: Recuperer toutes les commandes invites par email
CREATE OR REPLACE FUNCTION public.claim_guest_orders(
  p_email text,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count int;
BEGIN
  UPDATE public.orders
  SET
    user_id = p_user_id,
    updated_at = now()
  WHERE
    lower(email) = lower(p_email)
    AND user_id IS NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'count', v_count,
    'message', v_count || ' commande(s) recuperee(s).'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_guest_orders TO authenticated;

-- Recuperation email pour confirmation (public)
CREATE OR REPLACE FUNCTION public.get_order_summary_public(p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'email', email,
    'status', status,
    'order_number', order_number,
    'tracking_token', tracking_token,
    'total_amount', total_amount
  )
  INTO v_result
  FROM public.orders
  WHERE id = p_order_id;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_order_summary_public TO anon, authenticated;

-- ============================================================
-- BLOC 8 — RELAY FUNCTIONS
-- ============================================================

-- Mettre a jour le point relais d'une commande
CREATE OR REPLACE FUNCTION public.update_order_relay(
  p_order_id uuid,
  p_relay_id text,
  p_relay_name text,
  p_relay_address text,
  p_relay_zipcode text,
  p_relay_city text,
  p_relay_country text DEFAULT 'FR'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_status text;
  v_order_user_id uuid;
BEGIN
  SELECT status, user_id INTO v_order_status, v_order_user_id
  FROM public.orders
  WHERE id = p_order_id;

  IF v_order_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Commande introuvable.');
  END IF;

  IF v_order_status IN ('shipped', 'completed', 'canceled', 'refunded') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Impossible de modifier une commande expediee ou terminee.');
  END IF;

  IF NOT (public.is_admin(auth.uid()) OR v_order_user_id = auth.uid()) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Acces refuse.');
  END IF;

  UPDATE public.orders
  SET
    relay_id = p_relay_id,
    relay_name = p_relay_name,
    relay_address = p_relay_address,
    relay_zipcode = p_relay_zipcode,
    relay_city = p_relay_city,
    relay_country = COALESCE(p_relay_country, 'FR'),
    updated_at = now()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Point relais mis a jour.',
    'relay_id', p_relay_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_order_relay TO authenticated;

-- Supprimer le point relais (revenir a livraison domicile)
CREATE OR REPLACE FUNCTION public.remove_order_relay(p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_status text;
  v_order_user_id uuid;
BEGIN
  SELECT status, user_id INTO v_order_status, v_order_user_id
  FROM public.orders
  WHERE id = p_order_id;

  IF v_order_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Commande introuvable.');
  END IF;

  IF v_order_status IN ('shipped', 'completed', 'canceled', 'refunded') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Impossible de modifier une commande expediee ou terminee.');
  END IF;

  IF NOT (public.is_admin(auth.uid()) OR v_order_user_id = auth.uid()) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Acces refuse.');
  END IF;

  UPDATE public.orders
  SET
    relay_id = NULL,
    relay_name = NULL,
    relay_address = NULL,
    relay_zipcode = NULL,
    relay_city = NULL,
    relay_country = NULL,
    updated_at = now()
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'message', 'Livraison changee en domicile.');
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_order_relay TO authenticated;

-- ============================================================
-- BLOC 9 — ADMIN FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_update_order_status(
  p_order_id uuid,
  p_new_status text,
  p_send_email boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_order jsonb;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acces refuse.';
  END IF;

  UPDATE public.orders
  SET
    status = p_new_status::order_status,
    updated_at = now(),
    shipped_at = CASE WHEN p_new_status = 'shipped' THEN now() ELSE shipped_at END
  WHERE id = p_order_id;

  IF p_send_email THEN
    INSERT INTO public.emails_sent(order_id, to_email, subject, body_html, type, status)
    SELECT
      o.id,
      o.email,
      'Mise a jour de votre commande ' || o.order_number,
      '<p>Le statut de votre commande est passe a : <strong>' || p_new_status || '</strong></p>',
      'status_update',
      'sent'
    FROM public.orders o
    WHERE o.id = p_order_id;
  END IF;

  SELECT to_jsonb(ofv.*) INTO updated_order
  FROM public.orders_full_view ofv
  WHERE ofv.order_id = p_order_id;

  RETURN updated_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_order_status TO authenticated;

-- ============================================================
-- BLOC 10 — VUES (VIEWS) V5.0
-- ============================================================

-- 1. Orders Detailed
CREATE OR REPLACE VIEW public.orders_detailed_view AS
SELECT
  o.id AS order_id,
  o.user_id,
  o.email,
  o.full_name,
  o.address,
  o.city,
  o.country,
  o.status,
  o.created_at,
  o.subtotal,
  o.tax_amount,
  o.shipping_cost,
  o.discount_amount,
  o.total_amount,
  o.payment_method,
  o.tracking_number,
  o.carrier,
  o.shipped_at,
  o.is_guest_order,
  -- Colonnes Relay
  o.relay_id,
  o.relay_name,
  o.relay_address,
  o.relay_zipcode,
  o.relay_city,
  o.relay_country,
  (o.relay_id IS NOT NULL) AS is_relay_delivery,
  jsonb_agg(
    jsonb_build_object(
      'product_id', p.id,
      'product_name', COALESCE(oi.product_name_snapshot, p.name),
      'product_dosage', p.dosage,
      'product_price', oi.price,
      'product_image', p.image,
      'quantity', oi.quantity,
      'total', (oi.price * oi.quantity)
    )
  ) AS detailed_items
FROM public.orders o
LEFT JOIN public.order_items oi ON oi.order_id = o.id
LEFT JOIN public.products p ON p.id = oi.product_id
GROUP BY o.id;

-- 2. Orders Full View
CREATE OR REPLACE VIEW public.orders_full_view AS
SELECT
  o.id AS order_id,
  o.user_id,
  o.order_number,
  o.tracking_token,
  o.is_guest_order,
  -- Adresse de facturation/domicile
  o.full_name AS shipping_name,
  o.email AS shipping_email,
  o.address AS shipping_address,
  o.city AS shipping_city,
  o.zip AS shipping_zip,
  o.country AS shipping_country,
  -- Point Relais
  o.relay_id,
  o.relay_name,
  o.relay_address,
  o.relay_zipcode,
  o.relay_city,
  o.relay_country,
  (o.relay_id IS NOT NULL) AS is_relay_delivery,
  -- Adresse de livraison effective (relais ou domicile)
  CASE
    WHEN o.relay_id IS NOT NULL THEN o.relay_name
    ELSE o.full_name
  END AS delivery_name,
  CASE
    WHEN o.relay_id IS NOT NULL THEN o.relay_address
    ELSE o.address
  END AS delivery_address,
  CASE
    WHEN o.relay_id IS NOT NULL THEN o.relay_zipcode
    ELSE o.zip
  END AS delivery_zip,
  CASE
    WHEN o.relay_id IS NOT NULL THEN o.relay_city
    ELSE o.city
  END AS delivery_city,
  CASE
    WHEN o.relay_id IS NOT NULL THEN o.relay_country
    ELSE o.country
  END AS delivery_country,
  -- Autres champs
  o.status,
  o.payment_method,
  o.subtotal,
  o.tax_amount,
  o.shipping_cost,
  o.discount_amount,
  o.total_amount,
  o.carrier,
  o.tracking_number,
  o.created_at,
  o.shipped_at,
  o.updated_at,
  odv.detailed_items,
  jsonb_build_object(
    'id', COALESCE(p.id, o.user_id),
    'email', COALESCE(p.email, o.email),
    'full_name', COALESCE(p.full_name, o.full_name),
    'role', COALESCE(p.role, 'guest')
  ) AS profile_info
FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
LEFT JOIN public.orders_detailed_view odv ON odv.order_id = o.id;

ALTER VIEW public.orders_full_view SET (security_invoker = true);
GRANT SELECT ON public.orders_full_view TO authenticated;

-- 3. Admin Overview (V5.1: ajout payment_method pour validation paiement manuel)
CREATE OR REPLACE VIEW public.orders_overview_for_admin AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.user_id,
  o.is_guest_order,
  o.full_name AS customer_name,
  o.email AS customer_email,
  o.status,
  o.total_amount,
  o.payment_method,  -- V5.1: Pour identifier Virement/Crypto et valider manuellement
  o.created_at,
  o.shipped_at,
  -- Info relay pour l'admin
  o.relay_id,
  o.relay_name,
  (o.relay_id IS NOT NULL) AS is_relay_delivery,
  -- Adresse de livraison effective
  CASE
    WHEN o.relay_id IS NOT NULL THEN o.relay_city
    ELSE o.city
  END AS delivery_city,
  (SELECT COUNT(*) FROM public.emails_sent e WHERE e.order_id = o.id) AS emails_count
FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
ORDER BY o.created_at DESC;

ALTER VIEW public.orders_overview_for_admin SET (security_invoker = true);
GRANT SELECT ON public.orders_overview_for_admin TO authenticated;

-- 4. User Cart View
CREATE OR REPLACE VIEW public.user_cart_view AS
SELECT
  c.id AS cart_item_id,
  c.user_id,
  c.product_id,
  COALESCE(c.quantity, 1) AS quantity,
  c.updated_at,
  p.name AS product_name,
  p.dosage AS product_dosage,
  p.category AS product_category,
  COALESCE(p.price, 0)::numeric(10,2) AS product_price,
  COALESCE(p.sale_price, 0)::numeric(10,2) AS product_sale_price,
  COALESCE(p.is_on_sale, false) AS is_on_sale,
  COALESCE(p.image, '') AS product_image,
  COALESCE(p.stock, 0) AS product_stock,
  p.purity AS product_purity,
  -- i18n fields
  p.name_i18n,
  p.category_i18n
FROM public.user_cart_items c
JOIN public.products p ON p.id = c.product_id;

ALTER VIEW public.user_cart_view SET (security_invoker = true);
GRANT SELECT ON public.user_cart_view TO authenticated;

-- 5. Other Views
CREATE OR REPLACE VIEW public.conversation_overview AS
SELECT
  p.id AS user_id,
  p.email AS user_email,
  p.full_name AS user_name,
  c.last_read_message_id,
  c.last_read_at,
  c.last_admin_message_id,
  c.last_admin_read_at,
  m.content AS last_message,
  m.created_at AS last_message_at,
  (SELECT COUNT(*)
   FROM public.messages mu
   WHERE mu.user_id = p.id
   AND mu.sender_role = 'user'
   AND (c.last_admin_message_id IS NULL OR mu.id > c.last_admin_message_id)
  ) AS unread_count_admin
FROM public.profiles p
LEFT JOIN public.conversations c ON c.user_id = p.id
LEFT JOIN LATERAL (
  SELECT content, created_at
  FROM public.messages
  WHERE messages.user_id = p.id
  ORDER BY created_at DESC
  LIMIT 1
) m ON TRUE;

CREATE OR REPLACE VIEW public.messages_unread_view AS
SELECT user_id, COUNT(*) AS count
FROM public.messages
WHERE is_read = false AND sender_role = 'user'
GROUP BY user_id;

CREATE OR REPLACE VIEW public.messages_by_conversation_view AS
SELECT
  m.id AS message_id,
  m.user_id,
  p.email AS user_email,
  p.full_name AS user_name,
  m.sender_role,
  m.content,
  m.created_at,
  m.is_read,
  m.read_at
FROM public.messages m
LEFT JOIN public.profiles p ON p.id = m.user_id
ORDER BY m.user_id, m.created_at ASC;

CREATE OR REPLACE VIEW public.user_overview AS
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' AS display_name,
  u.created_at AS auth_created_at,
  p.full_name,
  p.role,
  p.cgu_accepted
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- ============================================================
-- BLOC 11 — REALTIME CONFIGURATION
-- ============================================================

-- Activer Realtime sur la table messages pour le chat en temps reel
-- Note: La publication supabase_realtime est creee automatiquement par Supabase
DO $$
BEGIN
  -- Verifier si la table messages est deja dans la publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    RAISE NOTICE 'Table messages ajoutee a la publication supabase_realtime';
  ELSE
    RAISE NOTICE 'Table messages deja presente dans supabase_realtime';
  END IF;
END $$;

-- ============================================================
-- FIN DU BACKUP V5.2 — i18n + GUEST + RELAY + MANUAL PAYMENT
-- ============================================================
