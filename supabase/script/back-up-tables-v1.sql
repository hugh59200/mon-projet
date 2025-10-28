-- ============================================================
-- 💾 FULL BACKUP / RESTORE - VERSION 2025-10-24 (Admin Fix ✅)
-- Inclut : Realtime + RLS + triggers + seeds + fonction is_admin()
-- ============================================================

-- =============================
-- 🧹 CLEANUP
-- =============================
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- 👤 TABLE : PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  cgu_accepted boolean DEFAULT false,
  cgu_accepted_at timestamptz
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 🧩 POLICIES
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Read own profile" ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Update own profile" ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access" ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated can read profiles for role check" ON public.profiles';
END $$;

CREATE POLICY "Read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin full access"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated can read profiles for role check"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- ⚙️ Trigger handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name', 'user', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ⚙️ JWT Custom Claims
CREATE OR REPLACE FUNCTION public.jwt_custom_claims()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object('role', (SELECT role FROM public.profiles WHERE id = auth.uid()));
$$;

-- 👥 SEED
INSERT INTO public.profiles (id, email, role, created_at, full_name)
VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'lucas.martin@example.com', 'user', now(), 'Lucas Martin'),
('53b4ae6b-8339-4a20-8947-84b77f5ae5a4', 'maxime.riviere@example.com', 'admin', now(), 'Maxime Rivière'),
('a0dde032-184c-4770-8b9f-51d7a52f36b4', 'h.bogrand@gmail.com', 'admin', now(), 'Hugo Bogrand'),
('f60d71db-f34d-4610-821e-c5a679d13ee5', 'emma.dupont@example.com', 'user', now(), 'Emma Dupont');

-- ============================================================
-- 📦 TABLE : PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  purity numeric(5,2),
  stock boolean DEFAULT true,
  image text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Public can read products" ON public.products';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage products" ON public.products';
END $$;

CREATE POLICY "Public can read products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- 🌱 SEED
INSERT INTO public.products (name, category, price, purity, stock, image, description)
VALUES
('IGF-1 LR3', 'Performance', 59.90, 98.00, false, '/src/assets/products/igf-1-lr3/peptide-igf-1-lr3.png', 'Facteur de croissance insulinomimétique, variante LR3.'),
('Semax', 'Bien-être', 27.90, 99.00, true, '/src/assets/products/semax/peptide-semax.png', 'Peptide neuroprotecteur / stimulant cognitif.'),
('Retatrutide', 'Métabolisme', 54.90, 99.00, true, '/src/assets/products/retatrutide/peptide-retatrutide.png', 'Agoniste multiple étudié pour la perte de poids.'),
('Selank', 'Bien-être', 27.90, 99.00, true, '/src/assets/products/selank/peptide-selank.png', 'Peptide anxiolytique et nootropique.'),
('PT-141', 'Bien-être', 42.90, 99.00, true, '/src/assets/products/pt-141/peptide-pt-141.png', 'Bremelanotide ; applications libido / dysfonction sexuelle.'),
('DSIP', 'Bien-être', 29.90, 99.00, true, '/src/assets/products/dsip/peptide-dsip.png', 'Delta Sleep-Inducing Peptide, étudié pour le sommeil.');

-- ============================================================
-- 🧾 TABLE : ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
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

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "User can view own orders" ON public.orders';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access orders" ON public.orders';
END $$;

CREATE POLICY "User can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access orders"
  ON public.orders FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 💬 TABLE : MESSAGES (Chat utilisateur ↔️ Admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  sender_role text DEFAULT 'user' CHECK (sender_role IN ('user', 'admin')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  read_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Users can read own messages" ON public.messages';
  EXECUTE 'DROP POLICY IF EXISTS "Users can send messages" ON public.messages';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access messages" ON public.messages';
END $$;

CREATE POLICY "Users can read own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access messages"
  ON public.messages FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ⚙️ Trigger cascade delete
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

-- 🌱 SEED
INSERT INTO public.messages (user_id, sender_role, content, created_at, is_read)
VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'user',  'Bonjour, je voulais savoir si IGF-1 LR3 est toujours en stock ?', now() - interval '1 day', false),
('53b4ae6b-8339-4a20-8947-84b77f5ae5a4', 'admin', 'Oui, il revient en stock demain matin 🚚', now() - interval '22 hours', true),
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'user',  'Parfait, merci beaucoup !', now() - interval '21 hours', false),
('a0dde032-184c-4770-8b9f-51d7a52f36b4', 'admin', 'Test message depuis Hugo Bogrand (admin)', now() - interval '1 hour', false);

-- ============================================================
-- 🔧 FUNCTION : is_admin (SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- 🔔 ACTIVER LE REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE
  public.messages,
  public.orders,
  public.products,
  public.profiles;

-- ============================================================
-- 💬 TABLE : CONVERSATIONS (état par utilisateur)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  last_read_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_read_at timestamptz DEFAULT now(),
  last_admin_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_admin_read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_last_read_message_id ON public.conversations (last_read_message_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_admin_message_id ON public.conversations (last_admin_message_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations (updated_at);

-- ============================================================
-- 🔐 RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "User can read own conversation" ON public.conversations';
  EXECUTE 'DROP POLICY IF EXISTS "User can update own conversation" ON public.conversations';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access conversations" ON public.conversations';
END $$;

-- 👤 Un utilisateur peut lire / mettre à jour uniquement sa propre conversation
CREATE POLICY "User can read own conversation"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User can update own conversation"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- 🧑‍💼 Un administrateur peut tout lire / modifier
CREATE POLICY "Admin full access conversations"
  ON public.conversations FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- ⚙️ TRIGGER : mise à jour automatique du timestamp
-- ============================================================
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
-- 🌱 SEED : conversations initiales
-- ============================================================
INSERT INTO public.conversations (user_id, last_read_message_id, last_read_at)
SELECT DISTINCT user_id, MAX(id), MAX(created_at)
FROM public.messages
GROUP BY user_id
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- 🔍 VIEW : messages_unread_view
--   → compte le nombre de messages non lus par conversation
-- ============================================================
DROP VIEW IF EXISTS public.messages_unread_view CASCADE;

CREATE OR REPLACE VIEW public.messages_unread_view AS
SELECT
  m.user_id,
  COUNT(*) AS count
FROM public.messages m
LEFT JOIN public.conversations c ON c.user_id = m.user_id
WHERE
  m.sender_role = 'user'
  AND (
    c.last_read_message_id IS NULL
    OR m.id > c.last_read_message_id
  )
GROUP BY m.user_id;

-- ============================================================
-- 🧩 EXEMPLE DE VUE ADMIN
--   → facilite les requêtes côté dashboard (dernier message, etc.)
-- ============================================================
DROP VIEW IF EXISTS public.conversation_overview CASCADE;

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
  (SELECT COUNT(*) FROM public.messages mu
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

-- ============================================================
-- 🔔 ACTIVER LE REALTIME POUR LES NOUVELLES TABLES / VUES
-- ============================================================



create view user_overview as
select
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' as display_name,
  u.created_at as auth_created_at,
  p.full_name,
  p.role,
  p.cgu_accepted,
  p.created_at as profile_created_at
from auth.users u
left join public.profiles p on u.id = p.id;
