-- ============================================================
-- 👤 TABLE : PROFILES
-- ============================================================
DROP TABLE IF EXISTS public.profiles CASCADE;

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

COMMENT ON COLUMN public.profiles.avatar_url IS
  'Chemin relatif du fichier avatar stocké dans le bucket Supabase (ex: avatars/uuid-timestamp.png)';
COMMENT ON COLUMN public.profiles.ui_preferences IS
  'Préférences d’interface utilisateur au format JSON.';

-- ============================================================
-- 🔐 RLS : Row Level Security
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin full access profiles"
  ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- ⚙️ TRIGGER : handle_new_user()
-- ============================================================
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
-- 👥 SEED : exemples de profils
-- ============================================================
INSERT INTO public.profiles (id, email, role, created_at, full_name)
VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'lucas.martin@example.com', 'user', now(), 'Lucas Martin'),
('53b4ae6b-8339-4a20-8947-84b77f5ae5a4', 'maxime.riviere@example.com', 'admin', now(), 'Maxime Rivière'),
('a0dde032-184c-4770-8b9f-51d7a52f36b4', 'h.bogrand@gmail.com', 'admin', now(), 'Hugo Bogrand'),
('f60d71db-f34d-4610-821e-c5a679d13ee5', 'emma.dupont@example.com', 'user', now(), 'Emma Dupont')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 💬 TABLE : MESSAGES (Chat utilisateur ↔️ Admin)
-- ============================================================

DROP TABLE IF EXISTS public.messages CASCADE;

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
CREATE INDEX idx_messages_created_at ON public.messages (created_at);

-- ============================================================
-- 🔐 RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can mark messages as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access messages"
  ON public.messages FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- ⚙️ TRIGGER : cascade delete des messages lors de la suppression d’un profil
-- ============================================================
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

-- ============================================================
-- ⚙️ TRIGGERS DE SYNCHRO : lectures / statuts
-- ============================================================

-- ✅ Nettoyage d’anciennes fonctions/évènements
DROP TRIGGER IF EXISTS tr_messages_sync_conversation ON public.messages;
DROP TRIGGER IF EXISTS tr_messages_sync_conversation_admin ON public.messages;
DROP FUNCTION IF EXISTS public.sync_conversation_on_read();
DROP FUNCTION IF EXISTS public.sync_conversation_on_admin_read();

-- ✅ Fonction principale : mise à jour de conversation quand un message est lu
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

-- ✅ Fonction symétrique pour la lecture des messages utilisateur par l’admin
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

-- ============================================================
-- 🌱 SEED : exemples de messages
-- ============================================================
INSERT INTO public.messages (user_id, sender_role, content, created_at, is_read)
VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'user',  'Bonjour, je voulais savoir si IGF-1 LR3 est toujours en stock ?', now() - interval '1 day', false),
('53b4ae6b-8339-4a20-8947-84b77f5ae5a4', 'admin', 'Oui, il revient en stock demain matin 🚚', now() - interval '22 hours', true),
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'user',  'Parfait, merci beaucoup !', now() - interval '21 hours', false),
('a0dde032-184c-4770-8b9f-51d7a52f36b4', 'admin', 'Test message depuis Hugo Bogrand (admin)', now() - interval '1 hour', false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 💬 TABLE : CONVERSATIONS (état par utilisateur)
-- ============================================================

DROP TABLE IF EXISTS public.conversations CASCADE;

CREATE TABLE public.conversations (
  user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  last_read_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_read_at timestamptz DEFAULT now(),
  last_admin_message_id bigint REFERENCES public.messages (id) ON DELETE SET NULL,
  last_admin_read_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_conversations_last_read_message_id ON public.conversations (last_read_message_id);
CREATE INDEX idx_conversations_last_admin_message_id ON public.conversations (last_admin_message_id);
CREATE INDEX idx_conversations_updated_at ON public.conversations (updated_at);

-- ============================================================
-- 🔐 RLS (Row Level Security)
-- ============================================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own conversation"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User can update own conversation"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access conversations"
  ON public.conversations
  FOR ALL TO authenticated
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
-- 👀 VUE : conversation_overview
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
  (
    SELECT COUNT(*) FROM public.messages mu
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
-- 🧾 TABLE : ORDERS
-- ============================================================

DROP TABLE IF EXISTS public.orders CASCADE;

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

CREATE INDEX idx_orders_user_id ON public.orders (user_id);
CREATE INDEX idx_orders_created_at ON public.orders (created_at);

-- ============================================================
-- 🔐 RLS (Row Level Security)
-- ============================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access orders"
  ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 🌱 SEED : exemple de commandes
-- ============================================================

INSERT INTO public.orders (
  id, user_id, full_name, email, address, zip, city, country,
  payment_method, total_amount, items, status, carrier, tracking_number, shipped_at
)
VALUES
(
  gen_random_uuid(),
  '04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9',
  'Lucas Martin',
  'lucas.martin@example.com',
  '12 rue des Glycines',
  '75011',
  'Paris',
  'France',
  'card',
  89.80,
  '[{"product":"IGF-1 LR3","qty":1},{"product":"Semax","qty":1}]'::jsonb,
  'paid',
  'Colissimo',
  'FR1234567890',
  now() - interval '2 days'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 📦 TABLE : PRODUCTS
-- ============================================================

DROP TABLE IF EXISTS public.products CASCADE;

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

CREATE INDEX idx_products_name ON public.products (name);
CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_tags_gin ON public.products USING GIN (tags);

-- ============================================================
-- 🔐 RLS (Row Level Security)
-- ============================================================

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
-- 🌱 SEED : produits initiaux
-- ============================================================

INSERT INTO public.products (name, category, price, purity, stock, image, description, tags)
VALUES
('IGF-1 LR3', 'Performance', 59.90, 98.00, false,
 '/src/assets/products/igf-1-lr3/peptide-igf-1-lr3.png',
 'Facteur de croissance insulinomimétique, variante LR3.',
 ARRAY['performance','98%','hot']),

('Semax', 'Bien-être', 27.90, 99.00, true,
 '/src/assets/products/semax/peptide-semax.png',
 'Peptide neuroprotecteur / stimulant cognitif.',
 ARRAY['nootropique','bien-etre','99%']),

('Retatrutide', 'Métabolisme', 54.90, 99.00, true,
 '/src/assets/products/retatrutide/peptide-retatrutide.png',
 'Agoniste multiple étudié pour la perte de poids.',
 ARRAY['metabolisme','perte-de-poids','99%']),

('Selank', 'Bien-être', 27.90, 99.00, true,
 '/src/assets/products/selank/peptide-selank.png',
 'Peptide anxiolytique et nootropique.',
 ARRAY['nootropique','bien-etre','99%']),

('PT-141', 'Bien-être', 42.90, 99.00, true,
 '/src/assets/products/pt-141/peptide-pt-141.png',
 'Bremelanotide ; applications libido / dysfonction sexuelle.',
 ARRAY['libido','bien-etre','99%']),

('DSIP', 'Bien-être', 29.90, 99.00, true,
 '/src/assets/products/dsip/peptide-dsip.png',
 'Delta Sleep-Inducing Peptide, étudié pour le sommeil.',
 ARRAY['nootropique','bien-etre','99%'])
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 📰 TABLES : NEWS_TOPICS et NEWS
-- ============================================================

DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.news_topics CASCADE;

-- ============================================================
-- 🗂️ TABLE : NEWS_TOPICS
-- ============================================================

CREATE TABLE public.news_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  label text NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 📰 TABLE : NEWS
-- ============================================================

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

CREATE INDEX idx_news_topic_id ON public.news (topic_id);

-- ============================================================
-- 🔐 RLS (Row Level Security)
-- ============================================================

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
-- 🌱 SEED : topics
-- ============================================================

INSERT INTO public.news_topics (id, slug, label, description, image, created_at)
VALUES 
('76bb3e2d-d0c7-41aa-a59c-32f4c77379e9', 'recherche', 'Recherche & Innovation', 'Les dernières avancées sur les peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/recherche-innovation/topic-recherche-innovation.png', NOW()),
('82334ce4-0fcd-4947-9aa8-1bb16da64d91', 'bien-etre', 'Bien-être & Cosmétiques', 'Les peptides dans les soins, la beauté et le bien-être.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/bien-etre-cosmetiques/topic-bien-etre-cosmetiques.png', NOW()),
('ac5e9b57-ff9b-43d6-a69d-498a136c799a', 'marche', 'Marché & Économie', 'Les tendances et la croissance du marché des peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/marche-economie/topic-marche-economie.png', NOW()),
('b24c81ab-d24d-4860-91f7-faabad0892f7', 'usages', 'Usages & Performances', 'Les applications sportives et les bénéfices sur la santé.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/usages-performances/topic-usages-performances.png', NOW()),
('f5401164-9929-413d-8a7b-6f1bfdabf9dc', 'reglementation', 'Réglementation & Conformité', 'Les évolutions légales et politiques du marché.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/reglementation-conformite/topic-reglementation-conformite.png', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 🌱 SEED : news (extraits simplifiés)
-- ============================================================

INSERT INTO public.news (id, slug, title, excerpt, content, image, published_at, author_id, topic_id)
VALUES
('9d4a3f43-40b4-47a2-863b-9c6dd5c6af43', 'peptides-regeneration-cellulaire', 'Des peptides capables de stimuler la régénération cellulaire', 'De nouveaux peptides bioactifs montrent un fort potentiel pour la réparation des tissus endommagés.', 'Ces peptides biomimétiques pourraient transformer la médecine régénérative.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-regeneration-cellulaire.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),
('62d44c97-953f-4dee-8752-9eb287afb017', 'marche-peptides-2025', 'Le marché mondial des peptides atteint un nouveau record en 2025', 'Le secteur des peptides connaît une croissance sans précédent.', 'L’essor de la biotechnologie stimule fortement le marché international.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/marche-peptides-2025.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),
('47080cad-079c-450a-a8e4-544a58e57010', 'harmonisation-normes-peptides', 'Vers une harmonisation mondiale des normes sur les peptides', 'Les agences de régulation cherchent à unifier les standards internationaux.', 'Une meilleure coopération entre autorités permettra de faciliter les essais cliniques.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/harmonisation-normes-peptides.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),
('9c165271-a61d-4ff2-aba5-061289cdff3c', 'peptides-recuperation-musculaire', 'Les peptides révolutionnent la récupération musculaire', 'Certains peptides favorisent la réparation rapide des fibres après l’effort.', 'Ils stimulent la régénération tissulaire et optimisent la récupération sportive.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-recuperation-musculaire.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),
('78f05eef-ae13-479a-944c-88928052bfab', 'peptides-cosmetique-regeneratrice', 'Les peptides au cœur de la nouvelle cosmétique régénératrice', 'Les laboratoires misent sur les peptides pour stimuler la production de collagène.', 'Ces formules peptidiques promettent une peau plus ferme et visiblement rajeunie.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-cosmetique-regeneratrice.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ⚙️ FUNCTIONS & HELPERS
-- ============================================================

-- 🔧 Fonction : is_admin(uid)
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 🔧 Fonction : jwt_custom_claims()
DROP FUNCTION IF EXISTS public.jwt_custom_claims();
CREATE OR REPLACE FUNCTION public.jwt_custom_claims()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object(
    'role', (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
$$;

-- ============================================================
-- 🧩 VIEW : user_overview (profil + métadonnées auth)
-- ============================================================

DROP VIEW IF EXISTS public.user_overview CASCADE;

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
-- 🗂️ STORAGE BUCKETS : avatars / news-images / topic-images
-- ============================================================

-- ✅ Création des buckets publics s’ils n’existent pas déjà
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
-- 🔐 POLICIES : gestion des fichiers pour TOUS les buckets publics
-- ============================================================

DO $$
BEGIN
  -- Nettoyage des anciennes policies
  EXECUTE 'DROP POLICY IF EXISTS "Public can view public buckets" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update own files" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects';
END $$;

-- 👀 Lecture publique pour tous les buckets marqués "public"
CREATE POLICY "Public can view public buckets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('avatars', 'news-images', 'topic-images')
  );

-- 📤 Upload autorisé uniquement pour les utilisateurs connectés
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('avatars', 'news-images', 'topic-images')
    AND owner = auth.uid()
  );

-- ✏️ Modification de leurs propres fichiers
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('avatars', 'news-images', 'topic-images')
    AND owner = auth.uid()
  );

-- 🗑️ Suppression autorisée de leurs propres fichiers
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('avatars', 'news-images', 'topic-images')
    AND owner = auth.uid()
  );


-- ============================================================
-- 👀 VUES + REALTIME
-- ============================================================

-- ============================================================
-- 🧩 VIEW : conversation_overview
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

COMMENT ON VIEW public.conversation_overview IS
  'Vue de synthèse pour les conversations (dernier message, compteurs non lus, etc.).';

-- ============================================================
-- 🔔 ACTIVER LE REALTIME POUR LES TABLES CLÉS
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE
  public.profiles,
  public.products,
  public.orders,
  public.messages,
  public.conversations;

-- ============================================================
-- ✅ FIN DU BACKUP CLEAN 2025
-- ============================================================
-- 💾 Toutes les tables, policies, triggers et seeds sont prêtes.
-- 🚀 Tu peux exécuter ce script directement dans le SQL Editor Supabase.
-- Aucun ALTER ni doublon : tout est clean et idempotent.
-- ============================================================


-- ============================================================
-- 💬 SUPABASE CHAT — VUES (lecture seule)
-- ============================================================

-- 👀 Vue : messages_unread_view
DROP VIEW IF EXISTS public.messages_unread_view CASCADE;

CREATE OR REPLACE VIEW public.messages_unread_view AS
SELECT
  user_id,
  COUNT(*) AS count
FROM public.messages
WHERE is_read = false
  AND sender_role = 'user'
GROUP BY user_id;

COMMENT ON VIEW public.messages_unread_view IS
  'Vue listant le nombre de messages non lus par utilisateur (badges admin).';


-- 💬 Vue : messages_by_conversation_view
DROP VIEW IF EXISTS public.messages_by_conversation_view CASCADE;

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

COMMENT ON VIEW public.messages_by_conversation_view IS
  'Vue listant tous les messages groupés par utilisateur avec leurs infos profil.';


-- ============================================================
-- 🔐 Permissions
-- ============================================================

ALTER VIEW public.messages_unread_view OWNER TO postgres;
ALTER VIEW public.messages_by_conversation_view OWNER TO postgres;

GRANT SELECT ON public.messages_unread_view TO authenticated;
GRANT SELECT ON public.messages_by_conversation_view TO authenticated;


-- ============================================================
-- ✅ FIX : autoriser les utilisateurs à créer leur propre conversation
-- ============================================================

DROP POLICY IF EXISTS "User can insert own conversation" ON public.conversations;

CREATE POLICY "User can insert own conversation"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


  -- ============================================================
-- ✅ FIX : permissions de lecture / écriture pour la table messages
-- ============================================================

-- 🧹 On nettoie d'abord les anciennes policies qui bloquent
DROP POLICY IF EXISTS "Admin full access messages" ON public.messages;
DROP POLICY IF EXISTS "User can read own messages" ON public.messages;
DROP POLICY IF EXISTS "User can insert own messages" ON public.messages;

-- ============================================================
-- 👑 ADMIN — accès complet (lecture + écriture + update)
-- ============================================================
CREATE POLICY "Admin full access messages"
  ON public.messages
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 👤 USER — accès limité à ses propres messages
-- ============================================================
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
