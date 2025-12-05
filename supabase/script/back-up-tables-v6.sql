-- ============================================================
-- SUPABASE CLEAN BACKUP V6.0 — REVIEWS + NEWSLETTER
-- ============================================================
-- V6.0 : Système d'avis produits (reviews) + Newsletter
--        - Table reviews avec types (standard, premium, pro, verified)
--        - Vue product_reviews_summary pour SEO aggregateRating
--        - Tables newsletter (subscribers, campaigns, sends)
-- V5.3 : Système complet de codes promo (manuels + automatiques)
--        - Table promo_codes avec validation RPC
--        - Codes automatiques (bienvenue, fidélité, abandon panier)
--        - Interface admin + tracking utilisation
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
  public.user_cart_view,
  public.promo_codes_admin,
  public.product_reviews_summary,
  public.newsletter_stats
CASCADE;

DROP TABLE IF EXISTS
  public.newsletter_sends,
  public.newsletter_campaigns,
  public.newsletter_subscribers,
  public.reviews,
  public.user_promo_rewards,
  public.promo_code_usage,
  public.auto_promo_settings,
  public.payment_events,
  public.emails_sent,
  public.order_items,
  public.orders,
  public.promo_codes,
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
  public.is_admin(uuid),
  public.is_admin(),
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
  public.remove_order_relay,
  -- Promo codes functions
  public.validate_promo_code,
  public.apply_promo_code,
  public.generate_unique_promo_code,
  public.create_welcome_promo,
  public.check_loyalty_reward,
  public.create_cart_abandonment_promo,
  public.find_abandoned_carts,
  public.trigger_welcome_promo,
  public.trigger_check_loyalty,
  -- Reviews functions
  public.update_reviews_updated_at,
  -- Newsletter functions
  public.update_newsletter_subscribers_updated_at,
  public.subscribe_to_newsletter,
  public.unsubscribe_from_newsletter,
  public.confirm_newsletter_subscription
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
  category_i18n jsonb DEFAULT '{}'::jsonb,
  -- COA (Certificate of Analysis)
  coa_url text
);

COMMENT ON COLUMN public.products.name_i18n IS 'Traductions du nom: {"en": "...", "de": "...", "es": "..."}';
COMMENT ON COLUMN public.products.description_i18n IS 'Traductions de la description';
COMMENT ON COLUMN public.products.category_i18n IS 'Traductions de la categorie';
COMMENT ON COLUMN public.products.coa_url IS 'URL du Certificate of Analysis (COA) - Preuve de purete du peptide';

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
-- PROMO CODES
-- ============================
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount numeric(10,2) DEFAULT 0 CHECK (min_order_amount >= 0),
  max_discount_amount numeric(10,2),
  max_uses integer,
  max_uses_per_user integer DEFAULT 1,
  current_uses integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_promo_codes_code ON public.promo_codes (upper(code));
CREATE INDEX idx_promo_codes_active ON public.promo_codes (active) WHERE active = true;

COMMENT ON TABLE public.promo_codes IS 'Codes promotionnels pour remises sur commandes';
COMMENT ON COLUMN public.promo_codes.discount_type IS 'percentage = remise en %, fixed = remise en euros';

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

  -- Code promo appliqué
  promo_code_id uuid REFERENCES public.promo_codes(id) ON DELETE SET NULL,
  promo_code_snapshot text,

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
-- PROMO CODE USAGE (tracking par utilisateur)
-- ============================
CREATE TABLE public.promo_code_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_applied numeric(10,2) NOT NULL,
  used_at timestamptz DEFAULT now()
);

CREATE INDEX idx_promo_usage_code ON public.promo_code_usage (promo_code_id);
CREATE INDEX idx_promo_usage_user ON public.promo_code_usage (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_promo_usage_email ON public.promo_code_usage (lower(user_email));

-- ============================
-- USER PROMO REWARDS (codes automatiques attribués)
-- ============================
CREATE TABLE public.user_promo_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  promo_code_id uuid REFERENCES public.promo_codes(id) ON DELETE SET NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('welcome', 'loyalty', 'cart_abandonment', 'birthday')),
  generated_code text,
  is_used boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_user_promo_rewards_user ON public.user_promo_rewards (user_id);
CREATE INDEX idx_user_promo_rewards_email ON public.user_promo_rewards (lower(user_email));
CREATE INDEX idx_user_promo_rewards_type ON public.user_promo_rewards (reward_type);

COMMENT ON TABLE public.user_promo_rewards IS 'Codes promo automatiques attribués aux utilisateurs';

-- ============================
-- AUTO PROMO SETTINGS (configuration codes automatiques)
-- ============================
CREATE TABLE public.auto_promo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Configuration par défaut
INSERT INTO public.auto_promo_settings (setting_key, setting_value, is_enabled) VALUES
  ('welcome', '{
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 0,
    "expires_days": 30,
    "email_subject": "Bienvenue ! Voici votre code promo",
    "max_uses_per_code": 1
  }'::jsonb, true),
  ('loyalty', '{
    "orders_threshold": 3,
    "discount_type": "percentage",
    "discount_value": 15,
    "min_order_amount": 0,
    "expires_days": 60,
    "email_subject": "Merci pour votre fidélité !"
  }'::jsonb, true),
  ('cart_abandonment', '{
    "delay_hours": 24,
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 30,
    "expires_days": 7,
    "email_subject": "Vous avez oublié quelque chose..."
  }'::jsonb, true)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================
-- EMAILS SENT
-- ============================
CREATE TABLE public.emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  type text CHECK (type IN ('confirmation','status_update','shipping','cancelation','payment','custom','pending_payment','payment_validated','auth_signup','auth_recovery','auth_email_change')) NOT NULL DEFAULT 'custom',
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

-- Version sans argument (utilise auth.uid() par défaut)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
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
  p_relay_country text DEFAULT 'FR',
  -- Parametres optionnels pour le code promo
  p_promo_code_id uuid DEFAULT NULL,
  p_promo_code_snapshot text DEFAULT NULL
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

  -- 1. Creation Commande avec infos relay et promo optionnelles
  INSERT INTO public.orders (
    user_id, email, full_name, address, zip, city, country,
    payment_method, status,
    subtotal, tax_amount, shipping_cost, discount_amount, total_amount,
    relay_id, relay_name, relay_address, relay_zipcode, relay_city, relay_country,
    promo_code_id, promo_code_snapshot
  )
  VALUES (
    p_user_id, p_email, p_full_name, p_address, p_zip, p_city, p_country,
    p_payment_method, 'pending',
    COALESCE(p_subtotal, 0), COALESCE(p_tax_amount, 0),
    COALESCE(p_shipping_cost, 0), COALESCE(p_discount_amount, 0),
    p_total_amount,
    p_relay_id, p_relay_name, p_relay_address, p_relay_zipcode, p_relay_city,
    CASE WHEN p_relay_id IS NOT NULL THEN COALESCE(p_relay_country, 'FR') ELSE NULL END,
    p_promo_code_id, p_promo_code_snapshot
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
-- BLOC 9.5 — PROMO CODE FUNCTIONS
-- ============================================================

-- ============================
-- FONCTION: validate_promo_code
-- Valide un code promo et calcule la remise
-- ============================
CREATE OR REPLACE FUNCTION public.validate_promo_code(
  p_code text,
  p_subtotal numeric,
  p_user_id uuid DEFAULT NULL,
  p_user_email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_discount_amount numeric(10,2);
  v_user_usage_count integer;
  v_effective_email text;
BEGIN
  -- Normaliser le code (majuscules, trim)
  p_code := upper(trim(p_code));

  -- Email effectif (user connecte ou guest)
  v_effective_email := COALESCE(
    p_user_email,
    (SELECT email FROM profiles WHERE id = p_user_id)
  );

  -- Rechercher le code
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE upper(code) = p_code;

  -- Code non trouve
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_NOT_FOUND',
      'message', 'Ce code promo n''existe pas'
    );
  END IF;

  -- Code inactif
  IF NOT v_promo.active THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_INACTIVE',
      'message', 'Ce code promo n''est plus actif'
    );
  END IF;

  -- Verifier la periode de validite
  IF v_promo.valid_from IS NOT NULL AND now() < v_promo.valid_from THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_NOT_YET_VALID',
      'message', 'Ce code promo n''est pas encore valide'
    );
  END IF;

  IF v_promo.valid_until IS NOT NULL AND now() > v_promo.valid_until THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_EXPIRED',
      'message', 'Ce code promo a expire'
    );
  END IF;

  -- Verifier la limite totale d'utilisation
  IF v_promo.max_uses IS NOT NULL AND v_promo.current_uses >= v_promo.max_uses THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_MAX_USES_REACHED',
      'message', 'Ce code promo a atteint sa limite d''utilisation'
    );
  END IF;

  -- Verifier la limite par utilisateur
  IF v_promo.max_uses_per_user IS NOT NULL AND v_effective_email IS NOT NULL THEN
    SELECT COUNT(*) INTO v_user_usage_count
    FROM promo_code_usage
    WHERE promo_code_id = v_promo.id
      AND lower(user_email) = lower(v_effective_email);

    IF v_user_usage_count >= v_promo.max_uses_per_user THEN
      RETURN jsonb_build_object(
        'valid', false,
        'error', 'CODE_USER_LIMIT_REACHED',
        'message', 'Vous avez deja utilise ce code promo'
      );
    END IF;
  END IF;

  -- Verifier le montant minimum
  IF p_subtotal < v_promo.min_order_amount THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'MIN_AMOUNT_NOT_REACHED',
      'message', format('Montant minimum requis: %s EUR', v_promo.min_order_amount),
      'min_amount', v_promo.min_order_amount
    );
  END IF;

  -- Calculer la remise
  IF v_promo.discount_type = 'percentage' THEN
    v_discount_amount := ROUND(p_subtotal * v_promo.discount_value / 100, 2);
    -- Appliquer le plafond si defini
    IF v_promo.max_discount_amount IS NOT NULL AND v_discount_amount > v_promo.max_discount_amount THEN
      v_discount_amount := v_promo.max_discount_amount;
    END IF;
  ELSE
    -- Remise fixe
    v_discount_amount := v_promo.discount_value;
    -- Ne pas depasser le subtotal
    IF v_discount_amount > p_subtotal THEN
      v_discount_amount := p_subtotal;
    END IF;
  END IF;

  -- Succes
  RETURN jsonb_build_object(
    'valid', true,
    'promo_code_id', v_promo.id,
    'code', v_promo.code,
    'discount_type', v_promo.discount_type,
    'discount_value', v_promo.discount_value,
    'discount_amount', v_discount_amount,
    'message', CASE
      WHEN v_promo.discount_type = 'percentage'
      THEN format('-%s%% applique', v_promo.discount_value::integer)
      ELSE format('-%s EUR applique', v_promo.discount_value)
    END
  );
END;
$$;

COMMENT ON FUNCTION public.validate_promo_code IS 'Valide un code promo et retourne le montant de remise calcule';
GRANT EXECUTE ON FUNCTION public.validate_promo_code TO authenticated, anon;

-- ============================
-- FONCTION: apply_promo_code
-- Enregistre l'utilisation d'un code promo
-- ============================
CREATE OR REPLACE FUNCTION public.apply_promo_code(
  p_promo_code_id uuid,
  p_order_id uuid,
  p_user_id uuid,
  p_user_email text,
  p_discount_applied numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Incrementer le compteur d'utilisation
  UPDATE promo_codes
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = p_promo_code_id;

  -- Enregistrer l'utilisation
  INSERT INTO promo_code_usage (
    promo_code_id,
    user_id,
    user_email,
    order_id,
    discount_applied
  ) VALUES (
    p_promo_code_id,
    p_user_id,
    p_user_email,
    p_order_id,
    p_discount_applied
  );

  RETURN true;
END;
$$;

-- ============================
-- FONCTION: generate_unique_promo_code
-- Genere un code promo unique
-- ============================
CREATE OR REPLACE FUNCTION public.generate_unique_promo_code(
  p_prefix text DEFAULT 'AUTO'
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_code text;
  v_exists boolean;
BEGIN
  LOOP
    -- Generer un code: PREFIX + 6 caracteres alphanumeriques
    v_code := p_prefix || '-' || upper(substr(md5(random()::text), 1, 6));

    -- Verifier qu'il n'existe pas deja
    SELECT EXISTS(SELECT 1 FROM promo_codes WHERE code = v_code) INTO v_exists;

    IF NOT v_exists THEN
      RETURN v_code;
    END IF;
  END LOOP;
END;
$$;

-- ============================
-- FONCTION: create_welcome_promo
-- Cree un code de bienvenue pour un nouvel utilisateur
-- ============================
CREATE OR REPLACE FUNCTION public.create_welcome_promo(
  p_user_id uuid,
  p_user_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings jsonb;
  v_is_enabled boolean;
  v_code text;
  v_promo_id uuid;
  v_expires_at timestamptz;
  v_already_exists boolean;
BEGIN
  -- Verifier si le systeme est active
  SELECT setting_value, is_enabled INTO v_settings, v_is_enabled
  FROM auto_promo_settings
  WHERE setting_key = 'welcome';

  IF NOT v_is_enabled THEN
    RETURN jsonb_build_object('success', false, 'reason', 'welcome_promo_disabled');
  END IF;

  -- Verifier si l'utilisateur a deja recu un code de bienvenue
  SELECT EXISTS(
    SELECT 1 FROM user_promo_rewards
    WHERE (user_id = p_user_id OR lower(user_email) = lower(p_user_email))
    AND reward_type = 'welcome'
  ) INTO v_already_exists;

  IF v_already_exists THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_received');
  END IF;

  -- Generer un code unique
  v_code := generate_unique_promo_code('WELCOME');
  v_expires_at := now() + ((v_settings->>'expires_days')::integer || ' days')::interval;

  -- Creer le code promo
  INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    max_uses_per_user,
    valid_until,
    active
  ) VALUES (
    v_code,
    'Code de bienvenue pour ' || p_user_email,
    v_settings->>'discount_type',
    (v_settings->>'discount_value')::numeric,
    COALESCE((v_settings->>'min_order_amount')::numeric, 0),
    1,
    1,
    v_expires_at,
    true
  )
  RETURNING id INTO v_promo_id;

  -- Enregistrer l'attribution
  INSERT INTO user_promo_rewards (
    user_id,
    user_email,
    promo_code_id,
    reward_type,
    generated_code,
    expires_at,
    metadata
  ) VALUES (
    p_user_id,
    p_user_email,
    v_promo_id,
    'welcome',
    v_code,
    v_expires_at,
    jsonb_build_object('discount_value', v_settings->>'discount_value', 'discount_type', v_settings->>'discount_type')
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'promo_code_id', v_promo_id,
    'discount_type', v_settings->>'discount_type',
    'discount_value', v_settings->>'discount_value',
    'expires_at', v_expires_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_welcome_promo TO authenticated;

-- ============================
-- FONCTION: check_loyalty_reward
-- Verifie et attribue un code de fidelite apres X commandes
-- ============================
CREATE OR REPLACE FUNCTION public.check_loyalty_reward(
  p_user_id uuid,
  p_user_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings jsonb;
  v_is_enabled boolean;
  v_orders_count integer;
  v_threshold integer;
  v_code text;
  v_promo_id uuid;
  v_expires_at timestamptz;
  v_already_rewarded boolean;
  v_reward_level integer;
BEGIN
  -- Verifier si le systeme est active
  SELECT setting_value, is_enabled INTO v_settings, v_is_enabled
  FROM auto_promo_settings
  WHERE setting_key = 'loyalty';

  IF NOT v_is_enabled THEN
    RETURN jsonb_build_object('success', false, 'reason', 'loyalty_promo_disabled');
  END IF;

  v_threshold := (v_settings->>'orders_threshold')::integer;

  -- Compter les commandes confirmees de l'utilisateur
  SELECT COUNT(*) INTO v_orders_count
  FROM orders
  WHERE (user_id = p_user_id OR lower(email) = lower(p_user_email))
  AND status IN ('confirmed', 'processing', 'shipped', 'delivered');

  -- Calculer le niveau de recompense (multiples du seuil)
  v_reward_level := v_orders_count / v_threshold;

  IF v_reward_level < 1 THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'threshold_not_reached',
      'orders_count', v_orders_count,
      'threshold', v_threshold
    );
  END IF;

  -- Verifier si deja recompense pour ce niveau
  SELECT EXISTS(
    SELECT 1 FROM user_promo_rewards
    WHERE (user_id = p_user_id OR lower(user_email) = lower(p_user_email))
    AND reward_type = 'loyalty'
    AND (metadata->>'reward_level')::integer = v_reward_level
  ) INTO v_already_rewarded;

  IF v_already_rewarded THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_rewarded_for_level', 'level', v_reward_level);
  END IF;

  -- Generer un code unique
  v_code := generate_unique_promo_code('MERCI');
  v_expires_at := now() + ((v_settings->>'expires_days')::integer || ' days')::interval;

  -- Creer le code promo
  INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    max_uses_per_user,
    valid_until,
    active
  ) VALUES (
    v_code,
    'Code fidelite niveau ' || v_reward_level || ' pour ' || p_user_email,
    v_settings->>'discount_type',
    (v_settings->>'discount_value')::numeric,
    COALESCE((v_settings->>'min_order_amount')::numeric, 0),
    1,
    1,
    v_expires_at,
    true
  )
  RETURNING id INTO v_promo_id;

  -- Enregistrer l'attribution
  INSERT INTO user_promo_rewards (
    user_id,
    user_email,
    promo_code_id,
    reward_type,
    generated_code,
    expires_at,
    metadata
  ) VALUES (
    p_user_id,
    p_user_email,
    v_promo_id,
    'loyalty',
    v_code,
    v_expires_at,
    jsonb_build_object(
      'reward_level', v_reward_level,
      'orders_count', v_orders_count,
      'discount_value', v_settings->>'discount_value',
      'discount_type', v_settings->>'discount_type'
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'promo_code_id', v_promo_id,
    'reward_level', v_reward_level,
    'orders_count', v_orders_count,
    'discount_type', v_settings->>'discount_type',
    'discount_value', v_settings->>'discount_value',
    'expires_at', v_expires_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_loyalty_reward TO authenticated;

-- ============================
-- FONCTION: create_cart_abandonment_promo
-- Cree un code pour panier abandonne
-- ============================
CREATE OR REPLACE FUNCTION public.create_cart_abandonment_promo(
  p_user_id uuid,
  p_user_email text,
  p_cart_value numeric DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings jsonb;
  v_is_enabled boolean;
  v_code text;
  v_promo_id uuid;
  v_expires_at timestamptz;
  v_recent_abandonment boolean;
BEGIN
  -- Verifier si le systeme est active
  SELECT setting_value, is_enabled INTO v_settings, v_is_enabled
  FROM auto_promo_settings
  WHERE setting_key = 'cart_abandonment';

  IF NOT v_is_enabled THEN
    RETURN jsonb_build_object('success', false, 'reason', 'cart_abandonment_disabled');
  END IF;

  -- Verifier qu'on n'a pas envoye de code recemment (7 jours)
  SELECT EXISTS(
    SELECT 1 FROM user_promo_rewards
    WHERE (user_id = p_user_id OR lower(user_email) = lower(p_user_email))
    AND reward_type = 'cart_abandonment'
    AND created_at > now() - interval '7 days'
  ) INTO v_recent_abandonment;

  IF v_recent_abandonment THEN
    RETURN jsonb_build_object('success', false, 'reason', 'recent_abandonment_code_sent');
  END IF;

  -- Generer un code unique
  v_code := generate_unique_promo_code('PANIER');
  v_expires_at := now() + ((v_settings->>'expires_days')::integer || ' days')::interval;

  -- Creer le code promo
  INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    max_uses_per_user,
    valid_until,
    active
  ) VALUES (
    v_code,
    'Code panier abandonne pour ' || p_user_email,
    v_settings->>'discount_type',
    (v_settings->>'discount_value')::numeric,
    COALESCE((v_settings->>'min_order_amount')::numeric, 0),
    1,
    1,
    v_expires_at,
    true
  )
  RETURNING id INTO v_promo_id;

  -- Enregistrer l'attribution
  INSERT INTO user_promo_rewards (
    user_id,
    user_email,
    promo_code_id,
    reward_type,
    generated_code,
    expires_at,
    metadata
  ) VALUES (
    p_user_id,
    p_user_email,
    v_promo_id,
    'cart_abandonment',
    v_code,
    v_expires_at,
    jsonb_build_object(
      'cart_value', p_cart_value,
      'discount_value', v_settings->>'discount_value',
      'discount_type', v_settings->>'discount_type'
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'promo_code_id', v_promo_id,
    'discount_type', v_settings->>'discount_type',
    'discount_value', v_settings->>'discount_value',
    'expires_at', v_expires_at,
    'cart_value', p_cart_value
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_cart_abandonment_promo TO authenticated;

-- ============================
-- FONCTION: find_abandoned_carts
-- Trouve les paniers abandonnes pour le cron job
-- ============================
CREATE OR REPLACE FUNCTION public.find_abandoned_carts(
  p_cutoff_time timestamptz,
  p_min_value numeric DEFAULT 30
)
RETURNS TABLE (
  user_id uuid,
  email text,
  cart_total numeric,
  last_activity timestamptz,
  items_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.email,
    COALESCE(SUM(
      CASE
        WHEN pr.is_on_sale AND pr.sale_price IS NOT NULL
        THEN pr.sale_price * ci.quantity
        ELSE pr.price * ci.quantity
      END
    ), 0) as cart_total,
    MAX(ci.updated_at) as last_activity,
    COUNT(ci.id) as items_count
  FROM profiles p
  INNER JOIN user_cart_items ci ON ci.user_id = p.id
  INNER JOIN products pr ON pr.id = ci.product_id
  WHERE
    -- Panier mis a jour avant le cutoff (abandonne)
    ci.updated_at < p_cutoff_time
    -- Pas de commande recente (dans les dernieres 48h)
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.user_id = p.id
      AND o.created_at > p_cutoff_time - interval '24 hours'
    )
    -- Pas de code abandon envoye recemment (7 jours)
    AND NOT EXISTS (
      SELECT 1 FROM user_promo_rewards upr
      WHERE upr.user_id = p.id
      AND upr.reward_type = 'cart_abandonment'
      AND upr.created_at > now() - interval '7 days'
    )
  GROUP BY p.id, p.email
  HAVING COALESCE(SUM(
    CASE
      WHEN pr.is_on_sale AND pr.sale_price IS NOT NULL
      THEN pr.sale_price * ci.quantity
      ELSE pr.price * ci.quantity
    END
  ), 0) >= p_min_value;
END;
$$;

GRANT EXECUTE ON FUNCTION public.find_abandoned_carts TO authenticated;

-- ============================
-- TRIGGER: Creer code bienvenue a l'inscription
-- ============================
CREATE OR REPLACE FUNCTION public.trigger_welcome_promo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Creer le code de bienvenue directement
  v_result := create_welcome_promo(NEW.id, NEW.email);

  -- Log le resultat (pour debug)
  IF (v_result->>'success')::boolean THEN
    RAISE NOTICE 'Code bienvenue cree pour %: %', NEW.email, v_result->>'code';
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas bloquer l'inscription si la creation du code echoue
    RAISE WARNING 'Erreur creation code bienvenue pour %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger sur creation de profil
DROP TRIGGER IF EXISTS tr_welcome_promo ON public.profiles;
CREATE TRIGGER tr_welcome_promo
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_welcome_promo();

-- ============================
-- TRIGGER: Verifier fidelite apres commande confirmee
-- ============================
CREATE OR REPLACE FUNCTION public.trigger_check_loyalty()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Verifier seulement si le statut passe a 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status <> 'confirmed') THEN
    -- Verifier et attribuer un code de fidelite
    v_result := check_loyalty_reward(NEW.user_id, NEW.email);

    IF (v_result->>'success')::boolean THEN
      RAISE NOTICE 'Code fidelite cree pour %: % (niveau %)',
        NEW.email, v_result->>'code', v_result->>'reward_level';
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas bloquer la commande si le check fidelite echoue
    RAISE WARNING 'Erreur check fidelite pour %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_loyalty ON public.orders;
CREATE TRIGGER tr_check_loyalty
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_loyalty();

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

-- Note: security_invoker désactivé pour permettre aux Edge Functions (service_role) d'accéder aux commandes guest
GRANT SELECT ON public.orders_full_view TO authenticated, service_role;

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

-- 6. Vue Admin des Codes Promo
CREATE OR REPLACE VIEW public.promo_codes_admin AS
SELECT
  pc.id,
  pc.code,
  pc.description,
  pc.discount_type,
  pc.discount_value,
  pc.min_order_amount,
  pc.max_discount_amount,
  pc.max_uses,
  pc.max_uses_per_user,
  pc.current_uses,
  pc.valid_from,
  pc.valid_until,
  pc.active,
  pc.created_at,
  pc.updated_at,
  -- Statistiques d'utilisation
  COALESCE(usage_stats.total_uses, 0) AS total_uses,
  COALESCE(usage_stats.total_discount_given, 0) AS total_discount_given,
  usage_stats.last_used_at,
  -- Type de code (manuel ou automatique)
  CASE
    WHEN pc.code LIKE 'WELCOME-%' THEN 'welcome'
    WHEN pc.code LIKE 'MERCI-%' THEN 'loyalty'
    WHEN pc.code LIKE 'PANIER-%' THEN 'cart_abandonment'
    ELSE 'manual'
  END AS code_type
FROM public.promo_codes pc
LEFT JOIN (
  SELECT
    promo_code_id,
    COUNT(*) AS total_uses,
    SUM(discount_applied) AS total_discount_given,
    MAX(used_at) AS last_used_at
  FROM public.promo_code_usage
  GROUP BY promo_code_id
) usage_stats ON usage_stats.promo_code_id = pc.id
ORDER BY pc.created_at DESC;

ALTER VIEW public.promo_codes_admin SET (security_invoker = true);
GRANT SELECT ON public.promo_codes_admin TO authenticated;

-- ============================================================
-- BLOC 10.5 — RLS POLICIES PROMO CODES
-- ============================================================

-- Activer RLS sur les tables promo
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_promo_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_promo_settings ENABLE ROW LEVEL SECURITY;

-- PROMO_CODES: Les codes actifs sont lisibles par tous (pour validation)
CREATE POLICY "promo_codes_select_active" ON public.promo_codes
  FOR SELECT USING (active = true);

-- PROMO_CODES: Seuls les admins peuvent gerer les codes
CREATE POLICY "promo_codes_admin_all" ON public.promo_codes
  FOR ALL USING (public.is_admin());

-- PROMO_CODE_USAGE: Les utilisateurs peuvent voir leurs propres utilisations
CREATE POLICY "promo_usage_user_select" ON public.promo_code_usage
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- PROMO_CODE_USAGE: Seul le systeme (via SECURITY DEFINER) peut inserer
CREATE POLICY "promo_usage_insert_system" ON public.promo_code_usage
  FOR INSERT WITH CHECK (public.is_admin());

-- USER_PROMO_REWARDS: Les utilisateurs peuvent voir leurs propres recompenses
CREATE POLICY "user_promo_rewards_user_select" ON public.user_promo_rewards
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- USER_PROMO_REWARDS: Seuls les admins peuvent tout gerer
CREATE POLICY "user_promo_rewards_admin_all" ON public.user_promo_rewards
  FOR ALL USING (public.is_admin());

-- AUTO_PROMO_SETTINGS: Lecture publique, ecriture admin
CREATE POLICY "auto_promo_settings_select" ON public.auto_promo_settings
  FOR SELECT USING (true);

CREATE POLICY "auto_promo_settings_admin" ON public.auto_promo_settings
  FOR ALL USING (public.is_admin());

-- ============================================================
-- BLOC 10.6 — GRANTS PROMO CODES
-- ============================================================

GRANT SELECT ON public.promo_codes TO authenticated, anon;
GRANT SELECT ON public.promo_code_usage TO authenticated;
GRANT SELECT ON public.user_promo_rewards TO authenticated;
GRANT SELECT ON public.auto_promo_settings TO authenticated, anon;

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
-- BLOC 12 — REVIEWS SYSTEM (V6.0)
-- ============================================================

-- ============================
-- REVIEWS TABLE
-- ============================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Informations de l'auteur
  author_name VARCHAR(100) NOT NULL,
  author_type VARCHAR(20) DEFAULT 'standard' CHECK (author_type IN ('standard', 'premium', 'pro', 'verified')),
  author_title VARCHAR(100),
  author_institution VARCHAR(200),

  -- Contenu de l'avis
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,

  -- Critères détaillés (optionnels)
  rating_quality INTEGER CHECK (rating_quality >= 1 AND rating_quality <= 5),
  rating_purity INTEGER CHECK (rating_purity >= 1 AND rating_purity <= 5),
  rating_shipping INTEGER CHECK (rating_shipping >= 1 AND rating_shipping <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),

  -- Métadonnées
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

COMMENT ON TABLE public.reviews IS 'Avis produits avec types (standard, premium, pro, verified) pour SEO aggregateRating';

-- ============================
-- REVIEWS SUMMARY VIEW
-- ============================
CREATE OR REPLACE VIEW public.product_reviews_summary AS
SELECT
  product_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  ROUND(AVG(rating_quality)::numeric, 1) as avg_quality,
  ROUND(AVG(rating_purity)::numeric, 1) as avg_purity,
  ROUND(AVG(rating_shipping)::numeric, 1) as avg_shipping,
  ROUND(AVG(rating_value)::numeric, 1) as avg_value,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
  COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
  COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
  COUNT(*) FILTER (WHERE rating = 1) as one_star_count
FROM public.reviews
WHERE is_approved = true
GROUP BY product_id;

-- ============================
-- REVIEWS RLS POLICIES
-- ============================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_approved = false);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full reviews"
  ON public.reviews FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================
-- REVIEWS TRIGGER
-- ============================
CREATE OR REPLACE FUNCTION public.update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reviews_updated_at();

-- ============================================================
-- BLOC 13 — NEWSLETTER SYSTEM (V6.0)
-- ============================================================

-- ============================
-- NEWSLETTER SUBSCRIBERS
-- ============================
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
  preferences JSONB DEFAULT '{"frequency": "weekly", "topics": ["products", "research", "promotions", "news"], "format": "html"}'::jsonb,
  source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'checkout', 'popup', 'footer', 'admin', 'import')),
  confirmation_token TEXT,
  confirmed_at TIMESTAMPTZ,
  locale VARCHAR(5) DEFAULT 'fr',
  country VARCHAR(2),
  last_email_sent_at TIMESTAMPTZ,
  last_email_opened_at TIMESTAMPTZ,
  emails_sent_count INTEGER DEFAULT 0,
  emails_opened_count INTEGER DEFAULT 0,
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_newsletter_status ON public.newsletter_subscribers(status) WHERE status = 'active';
CREATE INDEX idx_newsletter_locale ON public.newsletter_subscribers(locale);
CREATE INDEX idx_newsletter_source ON public.newsletter_subscribers(source);
CREATE INDEX idx_newsletter_created ON public.newsletter_subscribers(created_at DESC);
CREATE INDEX idx_newsletter_preferences ON public.newsletter_subscribers USING GIN (preferences);

-- ============================
-- NEWSLETTER CAMPAIGNS
-- ============================
CREATE TABLE public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(200) NOT NULL,
  preview_text VARCHAR(300),
  content_html TEXT NOT NULL,
  content_text TEXT,
  target_status VARCHAR(20) DEFAULT 'active',
  target_locales TEXT[] DEFAULT ARRAY['fr', 'en'],
  target_topics TEXT[],
  recipients_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- NEWSLETTER SENDS
-- ============================
CREATE TABLE public.newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_reason TEXT,
  provider_message_id TEXT,
  UNIQUE(campaign_id, subscriber_id)
);

CREATE INDEX idx_newsletter_sends_campaign ON public.newsletter_sends(campaign_id);
CREATE INDEX idx_newsletter_sends_subscriber ON public.newsletter_sends(subscriber_id);

-- ============================
-- NEWSLETTER STATS VIEW
-- ============================
CREATE OR REPLACE VIEW public.newsletter_stats AS
SELECT
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE status = 'active') as active_subscribers,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_subscribers,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_last_30_days,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_last_7_days,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'active')::numeric /
    NULLIF(COUNT(*)::numeric, 0) * 100,
    1
  ) as active_rate,
  COUNT(DISTINCT locale) as locales_count
FROM public.newsletter_subscribers;

-- ============================
-- NEWSLETTER RLS POLICIES
-- ============================
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can check email existence"
  ON public.newsletter_subscribers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own subscription"
  ON public.newsletter_subscribers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admin full newsletter_subscribers"
  ON public.newsletter_subscribers FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin full newsletter_campaigns"
  ON public.newsletter_campaigns FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin full newsletter_sends"
  ON public.newsletter_sends FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================
-- NEWSLETTER TRIGGERS
-- ============================
CREATE OR REPLACE FUNCTION public.update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_newsletter_subscribers_updated_at();

CREATE TRIGGER trigger_newsletter_campaigns_updated_at
  BEFORE UPDATE ON public.newsletter_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_newsletter_subscribers_updated_at();

-- ============================
-- NEWSLETTER FUNCTIONS
-- ============================
CREATE OR REPLACE FUNCTION public.subscribe_to_newsletter(
  p_email TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'website',
  p_locale TEXT DEFAULT 'fr',
  p_preferences JSONB DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_subscriber_id UUID;
  v_confirmation_token TEXT;
  v_existing_status TEXT;
BEGIN
  SELECT id, status INTO v_subscriber_id, v_existing_status
  FROM public.newsletter_subscribers
  WHERE email = LOWER(TRIM(p_email));

  IF v_existing_status = 'active' THEN
    RETURN json_build_object('success', true, 'message', 'already_subscribed', 'subscriber_id', v_subscriber_id);
  END IF;

  IF v_existing_status = 'unsubscribed' THEN
    UPDATE public.newsletter_subscribers
    SET status = 'active', unsubscribed_at = NULL, unsubscribe_reason = NULL, confirmed_at = NOW()
    WHERE id = v_subscriber_id;
    RETURN json_build_object('success', true, 'message', 'resubscribed', 'subscriber_id', v_subscriber_id);
  END IF;

  v_confirmation_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO public.newsletter_subscribers (email, first_name, source, locale, preferences, confirmation_token, status)
  VALUES (
    LOWER(TRIM(p_email)),
    p_first_name,
    p_source,
    p_locale,
    COALESCE(p_preferences, '{"frequency": "weekly", "topics": ["products", "research", "promotions", "news"]}'::jsonb),
    v_confirmation_token,
    'active'
  )
  ON CONFLICT (email) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, public.newsletter_subscribers.first_name),
    source = EXCLUDED.source,
    locale = EXCLUDED.locale,
    preferences = COALESCE(EXCLUDED.preferences, public.newsletter_subscribers.preferences),
    status = 'active',
    confirmed_at = NOW()
  RETURNING id INTO v_subscriber_id;

  RETURN json_build_object('success', true, 'message', 'subscribed', 'subscriber_id', v_subscriber_id, 'confirmation_token', v_confirmation_token);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.subscribe_to_newsletter TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.unsubscribe_from_newsletter(
  p_email TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_subscriber_id UUID;
BEGIN
  UPDATE public.newsletter_subscribers
  SET status = 'unsubscribed', unsubscribed_at = NOW(), unsubscribe_reason = p_reason
  WHERE email = LOWER(TRIM(p_email))
  RETURNING id INTO v_subscriber_id;

  IF v_subscriber_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'not_found');
  END IF;

  RETURN json_build_object('success', true, 'message', 'unsubscribed', 'subscriber_id', v_subscriber_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.unsubscribe_from_newsletter TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.confirm_newsletter_subscription(p_token TEXT)
RETURNS JSON AS $$
DECLARE
  v_subscriber_id UUID;
BEGIN
  UPDATE public.newsletter_subscribers
  SET status = 'active', confirmed_at = NOW(), confirmation_token = NULL
  WHERE confirmation_token = p_token AND status = 'pending'
  RETURNING id INTO v_subscriber_id;

  IF v_subscriber_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'invalid_token');
  END IF;

  RETURN json_build_object('success', true, 'message', 'confirmed', 'subscriber_id', v_subscriber_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.confirm_newsletter_subscription TO anon, authenticated;

-- ============================================================
-- FIN DU BACKUP V6.0 — REVIEWS + NEWSLETTER
-- ============================================================
-- V6.0 : Système d'avis produits + Newsletter complète
-- Inclut toutes les tables, vues, fonctions, RLS et triggers
-- ============================================================
