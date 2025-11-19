-- ============================================================
-- 🚀 SUPABASE CLEAN BACKUP V2.0 — E-COMMERCE PRO
-- ============================================================
-- ✅ Migration Structurelle Complète (Stocks, Finance, Snapshots)
-- ✅ Idempotent (Drop & Rebuild)
-- ============================================================

-- ============================================================
-- 🧹 BLOC 1 — DROP EXISTING OBJECTS (SAFE ORDER)
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
  -- Triggers
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
  public.admin_update_order_status
CASCADE;

-- ============================================================
-- ✅ BLOC 2 — TABLES (STRUCTURE V2.0)
-- ============================================================

-- 👤 PROFILES
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
  country text,
  birthdate date,
  gender text CHECK (gender IN ('male','female','other')),
  ui_preferences jsonb DEFAULT '{}'::jsonb
);

-- 📦 PRODUCTS (Updated V2.0)
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  
  -- ✨ V2.0: Gestion Stocks & Promo
  stock integer NOT NULL DEFAULT 0, -- Remplace le boolean
  sale_price numeric(10,2),         -- Prix barré/promo
  is_on_sale boolean DEFAULT false, -- Trigger promo
  
  purity numeric(5,2),
  image text,
  description text,
  tags text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now()
);

-- 💬 MESSAGES
CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  sender_role text DEFAULT 'user' CHECK (sender_role IN ('user','admin')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  read_at timestamptz
);

-- 💬 CONVERSATIONS
CREATE TABLE public.conversations (
  user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  last_read_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_read_at timestamptz DEFAULT now(),
  last_admin_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_admin_read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- 🛒 CART ITEMS
CREATE TABLE public.user_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  updated_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_cart_user_product ON public.user_cart_items (user_id, product_id);

-- 🧾 ORDERS (Updated V2.0)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'paid', 'confirmed', 'shipped', 'completed', 'canceled', 'refunded', 'failed');
  END IF;
END $$;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE,
  
  -- Infos Client
  full_name text NOT NULL,
  email text NOT NULL,
  address text,
  zip text,
  city text,
  country text,
  
  -- Infos Paiement
  payment_method text,
  payment_intent_id text,
  stripe_session_id text,
  paypal_order_id text, -- Intégré nativement ici
  
  -- ✨ V2.0: Détails Financiers
  subtotal numeric(10,2) DEFAULT 0,      -- Total produits HT/TTC avant frais
  tax_amount numeric(10,2) DEFAULT 0,    -- Montant TVA
  shipping_cost numeric(10,2) DEFAULT 0, -- Frais de port
  discount_amount numeric(10,2) DEFAULT 0, -- Réductions
  total_amount numeric(10,2) NOT NULL,   -- Total final payé
  
  status order_status NOT NULL DEFAULT 'pending',
  internal_notes text DEFAULT '',
  
  -- Logistique
  carrier text,
  tracking_number text,
  shipped_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 🧾 ORDER ITEMS (Updated V2.0)
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT, -- Empêche suppression produit si commande existe
  
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(10,2) NOT NULL,
  
  -- ✨ V2.0: Snapshot Historique
  product_name_snapshot text NOT NULL, -- Nom du produit au moment de l'achat
  
  created_at timestamptz DEFAULT now()
);

-- 📧 EMAILS SENT
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

-- 📜 PAYMENT EVENTS
CREATE TABLE public.payment_events (
  id bigint generated always as identity primary key,
  provider text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- 📰 NEWS & TOPICS
CREATE TABLE public.news_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now()
);

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
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ✅ BLOC 3 — RLS POLICIES (SECURITY)
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
-- Products
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
CREATE POLICY "User create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);
-- News
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read topics" ON public.news_topics FOR SELECT USING (true);

-- ADMIN POLICIES (Function based)
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid) RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Admin full profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full products" ON public.products FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full messages" ON public.messages FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full conversations" ON public.conversations FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full news" ON public.news FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full topics" ON public.news_topics FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin read emails" ON public.emails_sent FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Service Insert Emails" ON public.emails_sent FOR INSERT TO service_role WITH CHECK (true);

-- ============================================================
-- ✅ BLOC 4 — FUNCTIONS & TRIGGERS
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

-- 2. Generate Order Number (FP-YYYY-000XXX)
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

-- 3. Messages & Conversations Sync Logic
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

-- 4. Helper JWT
CREATE OR REPLACE FUNCTION public.jwt_custom_claims() RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object('role', (SELECT role FROM public.profiles WHERE id = auth.uid()));
$$;

CREATE OR REPLACE FUNCTION public.user_exists_by_email(p_email text) RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_email);
$$;
GRANT EXECUTE ON FUNCTION public.user_exists_by_email(text) TO anon, authenticated;


-- ============================================================
-- ✅ BLOC 5 — V2.0 RPC TRANSACTION (COMMANDE COMPLEXE)
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
  -- Financials V2.0
  p_subtotal numeric,
  p_tax_amount numeric,
  p_shipping_cost numeric,
  p_discount_amount numeric,
  p_total_amount numeric,
  -- Items
  p_items jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  new_order_id uuid;
  item jsonb;
  result jsonb;
BEGIN
  -- 1. Création Commande avec détails financiers
  INSERT INTO public.orders (
    user_id, email, full_name, address, zip, city, country,
    payment_method, status,
    subtotal, tax_amount, shipping_cost, discount_amount, total_amount
  )
  VALUES (
    p_user_id, p_email, p_full_name, p_address, p_zip, p_city, p_country,
    p_payment_method, 'pending',
    COALESCE(p_subtotal, 0), COALESCE(p_tax_amount, 0), COALESCE(p_shipping_cost, 0), COALESCE(p_discount_amount, 0), p_total_amount
  )
  RETURNING id INTO new_order_id;

  -- 2. Insertion Produits avec Snapshot du Nom
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price, product_name_snapshot)
    SELECT 
      new_order_id,
      (item->>'product_id')::uuid,
      COALESCE((item->>'quantity')::integer, 1),
      COALESCE((item->>'product_price')::numeric, 0),
      p.name -- 📸 Snapshot: On prend le nom actuel dans la table produits
    FROM public.products p
    WHERE p.id = (item->>'product_id')::uuid;
  END LOOP;

  RETURN jsonb_build_object('order_id', new_order_id, 'status', 'success');
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items_full TO authenticated;
-- Permettre l'insert RPC
CREATE POLICY "Allow insert from RPC" ON public.order_items FOR INSERT WITH CHECK (true);


-- ============================================================
-- ✅ BLOC 6 — VUES (VIEWS) UPDATE V2.0
-- ============================================================

-- 1. Orders Detailed (Avec Snapshots & Finance)
CREATE OR REPLACE VIEW public.orders_detailed_view AS
SELECT
  o.id AS order_id,
  o.user_id,
  o.email,
  o.full_name,
  o.address, o.city, o.country,
  o.status,
  o.created_at,
  -- Finance V2.0
  o.subtotal,
  o.tax_amount,
  o.shipping_cost,
  o.discount_amount,
  o.total_amount,
  
  o.payment_method,
  o.tracking_number,
  o.carrier,
  o.shipped_at,
  
  jsonb_agg(
    jsonb_build_object(
      'product_id', p.id,
      'product_name', COALESCE(oi.product_name_snapshot, p.name), -- Priorité au snapshot
      'product_price', oi.price,
      'product_image', p.image,
      'product_stock', p.stock,
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
  o.stripe_session_id,
  o.payment_intent_id,
  o.paypal_order_id,
  o.order_number,
  
  -- Shipping Info
  o.full_name AS shipping_name,
  o.email AS shipping_email,
  o.address AS shipping_address,
  o.city AS shipping_city,
  o.zip AS shipping_zip,
  o.country AS shipping_country,

  -- Details
  o.status,
  o.payment_method,
  o.subtotal,
  o.tax_amount,
  o.shipping_cost,
  o.discount_amount,
  o.total_amount,
  
  o.carrier, o.tracking_number,
  o.created_at, o.shipped_at, o.updated_at,
  odv.detailed_items,

  -- Profile Fallback
  jsonb_build_object(
    'id', COALESCE(p.id, o.user_id),
    'email', COALESCE(p.email, o.email),
    'full_name', COALESCE(p.full_name, o.full_name),
    'role', COALESCE(p.role, 'user')
  ) AS profile_info

FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
LEFT JOIN public.orders_detailed_view odv ON odv.order_id = o.id;

ALTER VIEW public.orders_full_view SET (security_invoker = true);
GRANT SELECT ON public.orders_full_view TO authenticated;

-- 3. Admin Overview
CREATE OR REPLACE VIEW public.orders_overview_for_admin AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.user_id,
  p.full_name AS customer_name,
  p.email AS customer_email,
  o.status,
  o.total_amount,
  o.created_at,
  o.shipped_at,
  (SELECT COUNT(*) FROM public.emails_sent e WHERE e.order_id = o.id) AS emails_count
FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id;

ALTER VIEW public.orders_overview_for_admin SET (security_invoker = true);
GRANT SELECT ON public.orders_overview_for_admin TO authenticated;

-- 4. User Cart View (Updated for Stock Integer)
CREATE OR REPLACE VIEW public.user_cart_view AS
SELECT
  c.id AS cart_item_id,
  c.user_id,
  c.product_id,
  COALESCE(c.quantity, 1) AS quantity,
  c.updated_at,
  p.name AS product_name,
  p.category AS product_category,
  COALESCE(p.price, 0)::numeric(10,2) AS product_price,
  COALESCE(p.sale_price, 0)::numeric(10,2) AS product_sale_price, -- New V2.0
  COALESCE(p.is_on_sale, false) AS is_on_sale,                     -- New V2.0
  COALESCE(p.image, '') AS product_image,
  COALESCE(p.stock, 0) AS product_stock                           -- Updated V2.0 (int)
FROM public.user_cart_items c
JOIN public.products p ON p.id = c.product_id;

ALTER VIEW public.user_cart_view SET (security_invoker = true);
GRANT SELECT ON public.user_cart_view TO authenticated;

-- 5. Other Views (Conversations)
CREATE OR REPLACE VIEW public.conversation_overview AS
SELECT p.id AS user_id, p.email AS user_email, p.full_name AS user_name,
  c.last_read_message_id, c.last_read_at, c.last_admin_message_id, c.last_admin_read_at,
  m.content AS last_message, m.created_at AS last_message_at,
  (SELECT COUNT(*) FROM public.messages mu WHERE mu.user_id = p.id AND mu.sender_role = 'user' AND (c.last_admin_message_id IS NULL OR mu.id > c.last_admin_message_id)) AS unread_count_admin
FROM public.profiles p
LEFT JOIN public.conversations c ON c.user_id = p.id
LEFT JOIN LATERAL (SELECT content, created_at FROM public.messages WHERE messages.user_id = p.id ORDER BY created_at DESC LIMIT 1) m ON TRUE;

CREATE OR REPLACE VIEW public.messages_unread_view AS
SELECT user_id, COUNT(*) AS count FROM public.messages WHERE is_read = false AND sender_role = 'user' GROUP BY user_id;

CREATE OR REPLACE VIEW public.messages_by_conversation_view AS
SELECT m.id AS message_id, m.user_id, p.email AS user_email, p.full_name AS user_name, m.sender_role, m.content, m.created_at, m.is_read, m.read_at
FROM public.messages m LEFT JOIN public.profiles p ON p.id = m.user_id ORDER BY m.user_id, m.created_at ASC;

CREATE OR REPLACE VIEW public.user_overview AS
SELECT u.id, u.email, u.raw_user_meta_data->>'name' AS display_name, u.created_at AS auth_created_at, p.full_name, p.role, p.cgu_accepted
FROM auth.users u LEFT JOIN public.profiles p ON u.id = p.id;

-- ============================================================
-- ✅ BLOC 7 — STORAGE & REALTIME
-- ============================================================

INSERT INTO storage.buckets (id, name, public) SELECT 'avatars', 'avatars', true WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');
INSERT INTO storage.buckets (id, name, public) SELECT 'news-images', 'news-images', true WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'news-images');
INSERT INTO storage.buckets (id, name, public) SELECT 'topic-images', 'topic-images', true WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'topic-images');

-- Idempotent policies drop
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view public buckets' AND tablename = 'objects') THEN EXECUTE 'DROP POLICY "Public can view public buckets" ON storage.objects'; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own files' AND tablename = 'objects') THEN EXECUTE 'DROP POLICY "Users can upload own files" ON storage.objects'; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own files' AND tablename = 'objects') THEN EXECUTE 'DROP POLICY "Users can update own files" ON storage.objects'; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own files' AND tablename = 'objects') THEN EXECUTE 'DROP POLICY "Users can delete own files" ON storage.objects'; END IF;
END $$;

CREATE POLICY "Public can view public buckets" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars','news-images','topic-images'));
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('avatars','news-images','topic-images') AND owner = auth.uid());
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('avatars','news-images','topic-images') AND owner = auth.uid());
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('avatars','news-images','topic-images') AND owner = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles, public.products, public.orders, public.order_items, public.messages, public.conversations, public.user_cart_items, public.emails_sent;