-- ============================================================
-- 🚀 SUPABASE CLEAN BACKUP 2025 — VERSION COMPLÈTE ET IDÉMPOTENTE
-- ============================================================
-- ✅ Tout sous le schéma public
-- ✅ RLS activé partout
-- ✅ Peut être relancé sans erreur
-- ============================================================

-- ============================================================
-- 🧹 CLEAN START — DROP EXISTING OBJECTS (SAFE ORDER)
-- ============================================================

-- Drop dependent views
DROP VIEW IF EXISTS
  public.conversation_overview,
  public.messages_unread_view,
  public.messages_by_conversation_view,
  public.user_overview
CASCADE;

-- Drop tables (in dependency order)
DROP TABLE IF EXISTS
  public.user_cart_items,
  public.user_cart,
  public.orders,
  public.news,
  public.news_topics,
  public.conversations,
  public.messages,
  public.products,
  public.profiles
CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS
  public.handle_new_user,
  public.delete_user_messages,
  public.sync_conversation_on_read,
  public.sync_conversation_on_admin_read,
  public.touch_conversation_updated_at,
  public.is_admin,
  public.jwt_custom_claims
CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;



-- ============================================================
-- 👤 TABLE : PROFILES
-- ============================================================

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

-- ============================================================
-- 🔧 Fonction : is_admin(uid)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- Trigger on new auth user
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

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 📦 TABLE : PRODUCTS
-- ============================================================

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

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
-- 💬 TABLE : MESSAGES
-- ============================================================

CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  sender_role text DEFAULT 'user' CHECK (sender_role IN ('user','admin')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  read_at timestamptz
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access messages"
  ON public.messages
  FOR ALL
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

-- ============================================================
-- 💬 TABLE : CONVERSATIONS
-- ============================================================

CREATE TABLE public.conversations (
  user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  last_read_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_read_at timestamptz DEFAULT now(),
  last_admin_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_admin_read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

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

-- ============================================================
-- ⚙️ TRIGGERS & FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.delete_user_messages()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.messages WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_deleted
AFTER DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.delete_user_messages();

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

CREATE TRIGGER tr_messages_sync_conversation
AFTER UPDATE OF is_read ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.sync_conversation_on_read();

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

CREATE TRIGGER tr_messages_sync_conversation_admin
AFTER UPDATE OF is_read ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.sync_conversation_on_admin_read();

CREATE OR REPLACE FUNCTION public.touch_conversation_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_conversations_touch_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.touch_conversation_updated_at();

-- ============================================================
-- 🛒 TABLE : USER_CART_ITEMS
-- ============================================================

CREATE TABLE public.user_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own cart items"
  ON public.user_cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE UNIQUE INDEX uniq_cart_user_product
  ON public.user_cart_items (user_id, product_id);

CREATE INDEX idx_cart_updated_at
  ON public.user_cart_items (updated_at DESC);

-- ============================================================
-- 🧾 TABLE : ORDERS
-- ============================================================

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  address text,
  zip text,
  city text,
  country text,
  payment_method text,
  total_amount numeric(10,2),
  items jsonb,
  status text DEFAULT 'pending',
  internal_notes text DEFAULT '',
  carrier text,
  tracking_number text,
  shipped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  payment_intent_id text,
  stripe_session_id text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 📰 TABLES : NEWS_TOPICS & NEWS
-- ============================================================

CREATE TABLE public.news_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
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
  published_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  topic_id uuid REFERENCES public.news_topics (id) ON DELETE SET NULL
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read news"
  ON public.news
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access news"
  ON public.news
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can read topics"
  ON public.news_topics
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access topics"
  ON public.news_topics
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 👀 VIEWS
-- ============================================================

CREATE OR REPLACE VIEW public.conversation_overview AS
SELECT
  p.id AS user_id,
  p.email AS user_email,
  p.full_name,
  c.last_read_message_id,
  c.last_read_at,
  c.last_admin_message_id,
  c.last_admin_read_at,
  m.content AS last_message,
  m.created_at AS last_message_at,
  (
    SELECT COUNT(*)
    FROM public.messages mu
    WHERE mu.user_id = p.id
      AND mu.sender_role = 'user'
      AND (c.last_read_message_id IS NULL OR mu.id > c.last_read_message_id)
  ) AS unread_count
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
SELECT
  user_id,
  COUNT(*) AS count
FROM public.messages
WHERE is_read = false
  AND sender_role = 'user'
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
  p.cgu_accepted,
  p.created_at AS profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- ============================================================
-- 🗂️ STORAGE BUCKETS  (safe and idempotent)
-- ============================================================

-- Buckets
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

INSERT INTO storage.buckets (id, name, public)
SELECT 'news-images', 'news-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'news-images');

INSERT INTO storage.buckets (id, name, public)
SELECT 'topic-images', 'topic-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'topic-images');

-- 🧹 Drop existing storage policies to make the script re-runnable
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

-- ✅ Now recreate them
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
-- 🔔 REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE
  public.profiles,
  public.products,
  public.orders,
  public.messages,
  public.conversations,
  public.user_cart_items;

-- ============================================================
-- 🌱 SEED DATA
-- ============================================================

-- Profiles
INSERT INTO public.profiles (id, email, role, full_name)
VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9','lucas.martin@example.com','user','Lucas Martin'),
('53b4ae6b-8339-4a20-8947-84b77f5ae5a4','maxime.riviere@example.com','admin','Maxime Rivière'),
('a0dde032-184c-4770-8b9f-51d7a52f36b4','h.bogrand@gmail.com','admin','Hugo Bogrand'),
('f60d71db-f34d-4610-821e-c5a679d13ee5','emma.dupont@example.com','user','Emma Dupont');

-- Products
INSERT INTO public.products (id,name,category,price,purity,stock,image,description,tags)
VALUES
('9442a410-7f73-40a4-ae47-76e49dcdecde','DSIP','Bien-être',29.90,99.00,true,'/src/assets/products/dsip/peptide-dsip.png','Delta Sleep-Inducing Peptide, aide au sommeil.','{"nootropique","sommeil"}');

-- Messages (exemple)
INSERT INTO public.messages (user_id,sender_role,content,is_read)
VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9','user','Bonjour, je voulais savoir si IGF-1 LR3 est toujours en stock ?',false);

-- ============================================================
-- ✅ FIN DU SCRIPT
-- ============================================================
-- Tout recréé proprement, sans dépendance manquante.
-- Réexécutable à volonté.
-- ============================================================

-- ============================================================
-- 🧩 HELPERS & SECURITY FUNCTIONS
-- ============================================================



CREATE OR REPLACE FUNCTION public.jwt_custom_claims()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object(
    'role', (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
$$;