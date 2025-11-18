-- ============================================================
-- 🚀 SUPABASE CLEAN BACKUP 2025 — IDÉMPOTENT & ORGANISÉ
-- ============================================================
-- ✅ Re-lançable sans erreur
-- ✅ Compatible avec realtime, RLS, policies
-- ✅ Emails_sent créé AVANT les vues
-- ============================================================

-- ============================================================
-- 🧹 BLOC 1 — DROP EXISTING OBJECTS (SAFE ORDER)
-- ============================================================

-- Drop dependent views
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

-- Drop tables (dependency order)
DROP TABLE IF EXISTS
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

-- Drop triggers
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_messages_sync_conversation') THEN
    DROP TRIGGER tr_messages_sync_conversation ON public.messages;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_messages_sync_conversation_admin') THEN
    DROP TRIGGER tr_messages_sync_conversation_admin ON public.messages;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_conversations_touch_updated_at') THEN
    DROP TRIGGER tr_conversations_touch_updated_at ON public.conversations;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_order_number') THEN
    DROP TRIGGER set_order_number ON public.orders;
  END IF;
END $$;


-- Drop functions
DROP FUNCTION IF EXISTS
  public.handle_new_user,
  public.delete_user_messages,
  public.sync_conversation_on_read,
  public.sync_conversation_on_admin_read,
  public.touch_conversation_updated_at,
  public.generate_order_number,
  public.is_admin,
  public.jwt_custom_claims,
  public.user_exists_by_email
CASCADE;

-- ============================================================
-- ✅ BLOC 2 — TABLES (correct dependency order)
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

-- 📦 PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  purity numeric(5,2),
  stock boolean DEFAULT true,
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
CREATE UNIQUE INDEX IF NOT EXISTS uniq_cart_user_product
  ON public.user_cart_items (user_id, product_id);

-- 🧾 ORDERS
-- ✅ ENUM pour statuts commande
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'pending',
      'processing',
      'paid',
      'confirmed',
      'shipped',
      'completed',
      'canceled',
      'refunded',
      'failed'
    );
  END IF;
END $$;


-- 🧾 ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  address text,
  zip text,
  city text,
  country text,
  payment_method text,
  total_amount numeric(10,2),

  -- ✅ colonne typée ENUM, default propre
  status order_status NOT NULL DEFAULT 'pending',

  internal_notes text DEFAULT '',
  carrier text,
  tracking_number text,
  shipped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  payment_intent_id text,
  stripe_session_id text,
  order_number text UNIQUE
);


-- 🧾 ORDER ITEMS (dépend de orders + products)
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 📧 EMAILS SENT (placé AVANT les vues)
CREATE TABLE IF NOT EXISTS public.emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  type text CHECK (type IN (
    'confirmation','status_update','shipping','cancelation','payment','custom'
  )) NOT NULL DEFAULT 'custom',
  status text CHECK (status IN ('sent','error')) DEFAULT 'sent',
  provider_response jsonb,
  sent_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_emails_sent_order_id ON public.emails_sent(order_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_to_email ON public.emails_sent(to_email);
CREATE INDEX IF NOT EXISTS idx_emails_sent_type ON public.emails_sent(type);
CREATE INDEX IF NOT EXISTS idx_emails_sent_status ON public.emails_sent(status);

-- 📰 NEWS TOPICS
CREATE TABLE public.news_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now()
);

-- 📰 NEWS
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
-- ✅ BLOC 2 — RLS, POLICIES, FUNCTIONS, TRIGGERS
-- ============================================================

-- ✅ Activer RLS partout
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

-- ============================================================
-- 👤 PROFILES — POLICIES & FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Select own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin full access profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ✅ automatic profile creation on auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 📦 PRODUCTS — POLICIES
-- ============================================================

CREATE POLICY "Public can read products"
  ON public.products
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));


-- ============================================================
-- 💬 MESSAGES — POLICIES
-- ============================================================

CREATE POLICY "Admin can read all messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can insert messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "User can read own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update is_read on received messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND sender_role = 'admin')
  WITH CHECK (auth.uid() = user_id AND sender_role = 'admin');


-- ============================================================
-- 💬 CONVERSATIONS — POLICIES & TRIGGERS
-- ============================================================

CREATE POLICY "User can read own conversation"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own conversation"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own conversation"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access conversations"
  ON public.conversations FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Delete messages when profile removed
CREATE OR REPLACE FUNCTION public.delete_user_messages()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.messages WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_deleted ON public.profiles;

CREATE TRIGGER on_profile_deleted
AFTER DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.delete_user_messages();

-- Sync conversation when user reads a message
CREATE OR REPLACE FUNCTION public.sync_conversation_on_read()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_read = true AND (OLD.is_read IS DISTINCT FROM NEW.is_read) THEN
    NEW.read_at := now();
    UPDATE public.conversations
      SET last_read_message_id = NEW.id,
          last_read_at = NEW.read_at
      WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_messages_sync_conversation ON public.messages;

CREATE TRIGGER tr_messages_sync_conversation
AFTER UPDATE OF is_read ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.sync_conversation_on_read();

-- Sync conversation when admin reads
CREATE OR REPLACE FUNCTION public.sync_conversation_on_admin_read()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_read = true AND NEW.sender_role = 'user' THEN
    UPDATE public.conversations
      SET last_admin_message_id = NEW.id,
          last_admin_read_at = now()
      WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_messages_sync_conversation_admin ON public.messages;

CREATE TRIGGER tr_messages_sync_conversation_admin
AFTER UPDATE OF is_read ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.sync_conversation_on_admin_read();

-- Touch updated_at on conversation update
CREATE OR REPLACE FUNCTION public.touch_conversation_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_conversations_touch_updated_at ON public.conversations;

CREATE TRIGGER tr_conversations_touch_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.touch_conversation_updated_at();


-- ============================================================
-- 🛒 USER_CART_ITEMS — POLICY
-- ============================================================

CREATE POLICY "Users manage their own cart items"
  ON public.user_cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 🧾 ORDERS — POLICIES + ORDER NUMBER TRIGGER
-- ============================================================

CREATE POLICY "User can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Generate FP-YYYY-000001 numbers
CREATE SEQUENCE IF NOT EXISTS orders_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  formatted TEXT;
BEGIN
  SELECT nextval('orders_seq') INTO next_number;
  formatted := 'FP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_number::TEXT, 6, '0');
  NEW.order_number := formatted;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON public.orders;

CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION public.generate_order_number();


-- ============================================================
-- 📧 EMAILS_SENT — POLICIES
-- ============================================================

CREATE POLICY "Admins can read emails_sent"
  ON public.emails_sent
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Service role can insert emails_sent"
  ON public.emails_sent
  FOR INSERT
  TO service_role
  WITH CHECK (true);


-- ============================================================
-- 📰 NEWS + TOPICS — POLICIES
-- ============================================================

CREATE POLICY "Public read news"
  ON public.news
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access news"
  ON public.news
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Public read news topics"
  ON public.news_topics
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access topics"
  ON public.news_topics
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));


-- ============================================================
-- 🔐 JWT HELPERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.jwt_custom_claims()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object(
    'role', (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
$$;

-- Vérification existence email
CREATE OR REPLACE FUNCTION public.user_exists_by_email(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_email);
$$;

REVOKE ALL ON FUNCTION public.user_exists_by_email(text) FROM public;
GRANT EXECUTE ON FUNCTION public.user_exists_by_email(text) TO anon, authenticated;


-- ============================================================
-- ✅ BLOC 3 — VIEWS
-- ============================================================

-- Drop all views safely before recreate
DROP VIEW IF EXISTS
  public.conversation_overview,
  public.messages_unread_view,
  public.messages_by_conversation_view,
  public.user_cart_view,
  public.user_overview,
  public.orders_detailed_view,
  public.orders_full_view,
  public.orders_overview_for_admin
CASCADE;

-- ============================================================
-- 💬 conversation_overview
-- ============================================================

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

  -- number of unread user messages for admin
  (
    SELECT COUNT(*)
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


-- ============================================================
-- 💬 messages_unread_view
-- ============================================================

CREATE OR REPLACE VIEW public.messages_unread_view AS
SELECT
  user_id,
  COUNT(*) AS count
FROM public.messages
WHERE is_read = false
  AND sender_role = 'user'
GROUP BY user_id;


-- ============================================================
-- 💬 messages_by_conversation_view
-- ============================================================

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


-- ============================================================
-- 🛒 user_cart_view
-- ============================================================

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
  COALESCE(p.image, '') AS product_image,
  COALESCE(p.stock, true) AS product_stock

FROM public.user_cart_items c
JOIN public.products p ON p.id = c.product_id;

ALTER VIEW public.user_cart_view SET (security_invoker = true);
GRANT SELECT ON public.user_cart_view TO authenticated;


-- ============================================================
-- 👤 user_overview
-- ============================================================

CREATE OR REPLACE VIEW public.user_overview AS
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' AS display_name,
  u.created_at AS auth_created_at,
  p.full_name,
  p.role,
  p.cgu_accepted,
  p.created_at AS profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;


-- ============================================================
-- 🧾 orders_detailed_view
-- ============================================================
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
  o.total_amount,
  o.payment_method,
  o.tracking_number,
  o.carrier,
  o.shipped_at,
  o.updated_at,

  jsonb_agg(
    jsonb_build_object(
      'product_id', p.id,
      'product_name', p.name,
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


-- ============================================================
-- 🧾 orders_full_view (données complètes commande)
-- ============================================================

CREATE OR REPLACE VIEW public.orders_full_view AS
SELECT
  o.id AS order_id,
  o.user_id,

  -- Stripe
  o.stripe_session_id,
  o.payment_intent_id,
  o.order_number,

  -- Livraison (adresse de commande)
  o.full_name AS shipping_name,
  o.email AS shipping_email,
  o.address AS shipping_address,
  o.city AS shipping_city,
  o.zip AS shipping_zip,
  o.country AS shipping_country,

  -- Commande
  o.status,
  o.payment_method,
  o.total_amount,
  o.carrier,
  o.tracking_number,
  o.created_at,
  o.shipped_at,
  o.updated_at,

  odv.detailed_items,

  -- Emails envoyés
  (SELECT COUNT(*) FROM public.emails_sent e WHERE e.order_id = o.id) AS emails_count,
  (SELECT MAX(sent_at) FROM public.emails_sent e WHERE e.order_id = o.id) AS last_email_sent_at,
  (SELECT jsonb_agg(DISTINCT e.type) FROM public.emails_sent e WHERE e.order_id = o.id) AS email_types,

  -- ✅ Profil utilisateur avec fallback si user_id = NULL
  jsonb_build_object(
    'id',        COALESCE(p.id, o.user_id),
    'email',     COALESCE(p.email, o.email),
    'full_name', COALESCE(p.full_name, o.full_name),
    'role',      COALESCE(p.role, 'user'),
    'created_at', p.created_at
  ) AS profile_info

FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
LEFT JOIN public.orders_detailed_view odv ON odv.order_id = o.id;


ALTER VIEW public.orders_full_view SET (security_invoker = true);
GRANT SELECT ON public.orders_full_view TO authenticated;


-- ============================================================
-- 🧾 orders_overview_for_admin (vue légère dashboard Admin)
-- ============================================================

CREATE OR REPLACE VIEW public.orders_overview_for_admin AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.user_id,
  p.full_name AS customer_name,
  p.email AS customer_email,
  o.status,
  o.total_amount,
  o.payment_method,
  o.created_at,
  o.updated_at,
  o.tracking_number,
  o.carrier,
  o.shipped_at,

  -- Statistiques mails
  (SELECT COUNT(*) FROM public.emails_sent e WHERE e.order_id = o.id) AS emails_count,
  (SELECT MAX(sent_at) FROM public.emails_sent e WHERE e.order_id = o.id) AS last_email_sent_at,
  (SELECT e.type FROM public.emails_sent e WHERE e.order_id = o.id ORDER BY sent_at DESC LIMIT 1) AS last_email_type

FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id;

ALTER VIEW public.orders_overview_for_admin SET (security_invoker = true);
GRANT SELECT ON public.orders_overview_for_admin TO authenticated;


-- ============================================================
-- ✅ BLOC 4 — STORAGE, REALTIME, SEED
-- ============================================================

-- ============================================================
-- ✅ Storage Buckets (idempotent)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

INSERT INTO storage.buckets (id, name, public)
SELECT 'news-images', 'news-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'news-images');

INSERT INTO storage.buckets (id, name, public)
SELECT 'topic-images', 'topic-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'topic-images');


-- ============================================================
-- ✅ Storage Policies — drop old to keep idempotent
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view public buckets' AND tablename = 'objects') THEN
    EXECUTE 'DROP POLICY "Public can view public buckets" ON storage.objects';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own files' AND tablename = 'objects') THEN
    EXECUTE 'DROP POLICY "Users can upload own files" ON storage.objects';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own files' AND tablename = 'objects') THEN
    EXECUTE 'DROP POLICY "Users can update own files" ON storage.objects';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own files' AND tablename = 'objects') THEN
    EXECUTE 'DROP POLICY "Users can delete own files" ON storage.objects';
  END IF;
END $$;


-- ============================================================
-- ✅ New Storage Policies
-- ============================================================

CREATE POLICY "Public can view public buckets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars','news-images','topic-images'));

CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('avatars','news-images','topic-images') AND owner = auth.uid());

CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('avatars','news-images','topic-images') AND owner = auth.uid());

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('avatars','news-images','topic-images') AND owner = auth.uid());


-- ============================================================
-- ✅ Realtime
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE
  public.profiles,
  public.products,
  public.orders,
  public.order_items,
  public.messages,
  public.conversations,
  public.user_cart_items,
  public.emails_sent;

  -- ============================================================
-- ✅ Transaction : create_order_with_items
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
  p_total_amount numeric,
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
  -- ✅ 1 — création de la commande
  INSERT INTO public.orders (
    user_id, email, full_name, address, zip, city, country,
    payment_method, total_amount, status
  )
  VALUES (
    p_user_id, p_email, p_full_name, p_address, p_zip, p_city, p_country,
    p_payment_method, p_total_amount, 'pending'
  )
  RETURNING id INTO new_order_id;

  -- ✅ 2 — insertion des produits
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (
      new_order_id,
      (item->>'product_id')::uuid,
      COALESCE((item->>'quantity')::integer, 1),
      COALESCE((item->>'product_price')::numeric, 0)
    );
  END LOOP;

  -- ✅ 3 — récupération de l'ordre complet
  SELECT to_jsonb(ofv.*) INTO result
  FROM public.orders_full_view ofv
  WHERE ofv.order_id = new_order_id;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_with_items_full TO authenticated;


-- ✅ Autoriser l’insertion dans order_items via RPC / backend
CREATE POLICY "Allow insert from RPC" ON public.order_items
FOR INSERT
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');


GRANT SELECT ON public.orders_overview_for_admin TO authenticated;
ALTER VIEW public.orders_overview_for_admin SET (security_invoker = true);

-- ============================================================
-- ✅ RPC : admin_update_order_status
-- - Vérifie que l'utilisateur est admin
-- - Met à jour le statut
-- - Ajoute un email dans emails_sent (optionnel)
-- - Retourne la commande mise à jour
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
  -- ✅ check admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update order status';
  END IF;

  -- ✅ update statut
UPDATE public.orders
SET status = p_new_status::order_status,
    updated_at = now()
WHERE id = p_order_id;

  -- ✅ envoyer email
  IF p_send_email THEN
    INSERT INTO public.emails_sent(order_id, to_email, subject, body_html, type, status)
    SELECT
      o.id,
      o.email,
      'Mise à jour commande',
      '<p>Statut mis à jour : ' || p_new_status || '</p>',
      'status_update',
      'sent'
    FROM public.orders o
    WHERE o.id = p_order_id;
  END IF;

  -- ✅ récupérer commande complète
  SELECT to_jsonb(ofv.*)
  INTO updated_order
  FROM public.orders_full_view ofv
  WHERE ofv.order_id = p_order_id;

  RETURN updated_order;
END
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_order_status(uuid, text, boolean) TO authenticated;


-- ============================================================
-- 📜 PAYMENT EVENTS — Logs Stripe & PayPal (idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payment_events (
  id bigint generated always as identity primary key,
  provider text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_order_id 
  ON public.payment_events(order_id);

CREATE INDEX IF NOT EXISTS idx_payment_events_provider 
  ON public.payment_events(provider);



-- ============================================================
-- 🟡 PAYPAL ORDER ID (New column for orders)
-- ============================================================

ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS paypal_order_id text;

CREATE INDEX IF NOT EXISTS orders_paypal_order_id_idx 
  ON public.orders (paypal_order_id);



-- ============================================================
-- 🧾 UPDATE orders_full_view TO INCLUDE paypal_order_id
-- (Drop + recreate cleanly, keeping existing behavior)
-- ============================================================

DROP VIEW IF EXISTS public.orders_full_view CASCADE;

CREATE OR REPLACE VIEW public.orders_full_view AS
SELECT
  o.id AS order_id,
  o.user_id,

  -- Stripe
  o.stripe_session_id,
  o.payment_intent_id,
  o.order_number,

  -- PayPal
  o.paypal_order_id,

  -- Shipping info
  o.full_name AS shipping_name,
  o.email AS shipping_email,
  o.address AS shipping_address,
  o.city AS shipping_city,
  o.zip AS shipping_zip,
  o.country AS shipping_country,

  -- Order metadata
  o.status,
  o.payment_method,
  o.total_amount,
  o.carrier,
  o.tracking_number,
  o.created_at,
  o.shipped_at,
  o.updated_at,

  odv.detailed_items,

  -- Emails analytics
  (SELECT COUNT(*) FROM public.emails_sent e WHERE e.order_id = o.id) AS emails_count,
  (SELECT MAX(sent_at) FROM public.emails_sent e WHERE e.order_id = o.id) AS last_email_sent_at,
  (SELECT jsonb_agg(DISTINCT e.type) FROM public.emails_sent e WHERE e.order_id = o.id) AS email_types,

  -- Profile fallback
  jsonb_build_object(
    'id',        COALESCE(p.id, o.user_id),
    'email',     COALESCE(p.email, o.email),
    'full_name', COALESCE(p.full_name, o.full_name),
    'role',      COALESCE(p.role, 'user'),
    'created_at', p.created_at
  ) AS profile_info

FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
LEFT JOIN public.orders_detailed_view odv ON odv.order_id = o.id;

ALTER VIEW public.orders_full_view SET (security_invoker = true);
GRANT SELECT ON public.orders_full_view TO authenticated;
