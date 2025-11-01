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

-- ============================================
-- 🧩 TABLE : public.news_topics
-- ============================================

DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.news_topics CASCADE;

-- ============================================
-- 🧩 TABLE : public.news_topics
-- ============================================

CREATE TABLE public.news_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  label text NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 📰 TABLE : public.news
-- ============================================

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

CREATE INDEX IF NOT EXISTS idx_news_topic_id ON public.news (topic_id);

-- ============================================
-- 🔒 RLS (sécurité)
-- ============================================

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_topics ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Public can read news" ON public.news';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access news" ON public.news';
  EXECUTE 'DROP POLICY IF EXISTS "Public can read topics" ON public.news_topics';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access topics" ON public.news_topics';
END $$;

CREATE POLICY "Public can read news"
  ON public.news FOR SELECT USING (true);

CREATE POLICY "Admin full access news"
  ON public.news FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can read topics"
  ON public.news_topics FOR SELECT USING (true);

CREATE POLICY "Admin full access topics"
  ON public.news_topics FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 🌐 INSERT DES TOPICS
-- ============================================

INSERT INTO public.news_topics (id, slug, label, description, image, created_at)
VALUES 
('76bb3e2d-d0c7-41aa-a59c-32f4c77379e9', 'recherche', 'Recherche & Innovation', 'Les dernières avancées sur les peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/recherche-innovation/topic-recherche-innovation-de988705-a90a-4fd8-bf3a-5a09091b5c5b.png', NOW()),
('82334ce4-0fcd-4947-9aa8-1bb16da64d91', 'bien-etre', 'Bien-être & Cosmétiques', 'Les peptides dans les soins, la beauté et le bien-être.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/bien-etre-cosmetiques/topic-bien-etre-cosmetiques-1761754899574.png?v=1761754899574', NOW()),
('ac5e9b57-ff9b-43d6-a69d-498a136c799a', 'marche', 'Marché & Économie', 'Les tendances et la croissance du marché des peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/marche-economie/topic-marche-economie-1761754697638.png?v=1761754697638', NOW()),
('b24c81ab-d24d-4860-91f7-faabad0892f7', 'usages', 'Usages & Performances', 'Les applications sportives et les bénéfices sur la santé.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/usages-performances/topic-usages-performances-1761754829727.png?v=1761754829727', NOW()),
('f5401164-9929-413d-8a7b-6f1bfdabf9dc', 'reglementation', 'Réglementation & Conformité', 'Les évolutions légales et politiques du marché.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/reglementation-conformite/topic-reglementation-conformite-1761754763294.png?v=1761754763294', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 📰 INSERT DES ACTUALITÉS
-- ============================================

INSERT INTO public.news (id, slug, title, excerpt, content, image, published_at, author_id, topic_id)
VALUES
-- 🧬 Recherche & Innovation
('9d4a3f43-40b4-47a2-863b-9c6dd5c6af43', 'peptides-regeneration-cellulaire', 'Des peptides capables de stimuler la régénération cellulaire', 'De nouveaux peptides bioactifs montrent un fort potentiel pour la réparation des tissus endommagés.', 'Ces peptides biomimétiques pourraient transformer la médecine régénérative et favoriser la cicatrisation avancée.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/des-peptides-capables-de-stimuler-la-regeneration-cellulaire-1761755829537/news-des-peptides-capables-de-stimuler-la-regeneration-cellulaire-1761755829537.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),
('a2bab8fc-943b-4b32-acb9-044d54828014', 'ia-decouverte-peptides-therapeutiques', 'L’intelligence artificielle accélère la découverte de peptides thérapeutiques', 'L’IA révolutionne la recherche en identifiant des séquences peptidiques prometteuses en un temps record.', 'En combinant modélisation moléculaire et machine learning, les chercheurs découvrent plus rapidement de nouveaux candidats thérapeutiques.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/l-intelligence-artificielle-accelere-la-decouverte-de-peptides-therapeutiques-1761755758519/news-l-intelligence-artificielle-accelere-la-decouverte-de-peptides-therapeutiques-1761755758519.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),
('facb0cb2-d70d-4fcb-a0b2-04466bfb9904', 'avancee-peptides-synthetiques', 'Une avancée majeure dans la conception de peptides synthétiques', 'Des chercheurs développent de nouveaux peptides plus stables et efficaces pour la recherche biomédicale.', 'Cette innovation ouvre la voie à des peptides de nouvelle génération capables de résister à la dégradation et d’améliorer la précision thérapeutique.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/une-avancee-majeure-dans-la-conception-de-peptides-synthetiques-1761755661276/news-une-avancee-majeure-dans-la-conception-de-peptides-synthetiques-1761755661276.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

-- 💼 Marché & Économie
('62d44c97-953f-4dee-8752-9eb287afb017', 'marche-peptides-2025', 'Le marché mondial des peptides atteint un nouveau record en 2025', 'Le secteur des peptides connaît une croissance sans précédent, portée par la demande pharmaceutique et cosmétique.', 'L’essor de la biotechnologie et des traitements personnalisés stimule fortement le marché international des peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/le-marche-mondial-des-peptides-atteint-un-nouveau-record-en-2025-1761755894429/news-le-marche-mondial-des-peptides-atteint-un-nouveau-record-en-2025-1761755894429.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),
('67170960-eef3-4ead-b88c-f6ebed45be0f', 'startups-biotech-peptides', 'Les startups biotechs se tournent vers les peptides de nouvelle génération', 'Un nombre croissant de jeunes entreprises investissent dans la recherche et la production de peptides innovants.', 'Ces nouvelles sociétés combinent IA, automatisation et biologie synthétique pour créer des peptides plus performants.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-startups-biotechs-se-tournent-vers-les-peptides-de-nouvelle-generation-1761755973847/news-les-startups-biotechs-se-tournent-vers-les-peptides-de-nouvelle-generation-1761755973847.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),
('2474f359-cf06-494a-887d-60cd534e95be', 'economie-des-peptides', 'L’économie des peptides : un pilier de la biotechnologie moderne', 'Les peptides deviennent un acteur économique clé dans le développement pharmaceutique et nutritionnel.', 'Entre investissement public et privé, le marché des peptides se positionne comme une source d’innovation durable.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/l-economie-des-peptides-un-pilier-de-la-biotechnologie-moderne-1761756061388/news-l-economie-des-peptides-un-pilier-de-la-biotechnologie-moderne-1761756061388.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),

-- ⚖️ Réglementation & Conformité
('47080cad-079c-450a-a8e4-544a58e57010', 'harmonisation-normes-peptides', 'Vers une harmonisation mondiale des normes sur les peptides', 'Les agences de régulation cherchent à unifier les standards internationaux pour les peptides.', 'Une meilleure coopération entre autorités permettra de faciliter les essais cliniques et la commercialisation globale.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/vers-une-harmonisation-mondiale-des-normes-sur-les-peptides-1761756968952/news-vers-une-harmonisation-mondiale-des-normes-sur-les-peptides-1761756968952.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),
('4ff13258-7338-4de2-8ed9-7c9b8ff85368', 'directives-europeennes-peptides', 'Nouvelles directives européennes sur les peptides en recherche', 'L’Union européenne renforce la réglementation sur la production et l’utilisation des peptides.', 'Ces nouvelles règles visent à assurer la traçabilité et la sécurité dans la recherche scientifique et médicale.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/nouvelles-directives-europeennes-sur-les-peptides-en-recherche-1761756981526/news-nouvelles-directives-europeennes-sur-les-peptides-en-recherche-1761756981526.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),
('a1178be8-e547-4a28-8677-07404bcc5f67', 'controle-peptides-recherche', 'Contrôle renforcé sur les peptides destinés à la recherche', 'Les autorités mettent en place de nouveaux protocoles de contrôle pour les peptides de laboratoire.', 'L’objectif est de prévenir les abus et d’assurer la conformité aux bonnes pratiques scientifiques.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/controle-renforce-sur-les-peptides-destines-a-la-recherche-1761757065279/news-controle-renforce-sur-les-peptides-destines-a-la-recherche-1761757065279.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

-- 💪 Usages & Performances
('9c165271-a61d-4ff2-aba5-061289cdff3c', 'peptides-recuperation-musculaire', 'Les peptides révolutionnent la récupération musculaire', 'Des études montrent que certains peptides favorisent la réparation rapide des fibres musculaires après l’effort.', 'Ces composés naturels stimulent la régénération tissulaire et optimisent la récupération sportive.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-peptides-revolutionnent-la-recuperation-musculaire-1761757146896/news-les-peptides-revolutionnent-la-recuperation-musculaire-1761757146896.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),
('a76da968-bc21-4122-ba61-f11e69f1af78', 'peptides-performance-physique', 'Le rôle des peptides dans la performance physique', 'Les peptides bioactifs améliorent la force, l’endurance et la récupération musculaire.', 'Une nouvelle génération de peptides naturels offre un soutien métabolique inédit pour les athlètes.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/le-role-des-peptides-dans-la-performance-physique-1761757260028/news-le-role-des-peptides-dans-la-performance-physique-1761757260028.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),
('22c306ec-1546-4a72-96c1-52bca32d29fe', 'peptides-metabolisme-performance', 'Peptides et métabolisme : une approche biochimique de la performance', 'Les recherches explorent comment les peptides régulent l’énergie et le métabolisme musculaire.', 'Ces découvertes pourraient transformer les approches nutritionnelles du sport de haut niveau.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-et-metabolisme-une-approche-biochimique-de-la-performance-1761757342295/news-peptides-et-metabolisme-une-approche-biochimique-de-la-performance-1761757342295.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

-- 💎 Bien-être & Cosmétiques
('78f05eef-ae13-479a-944c-88928052bfab', 'peptides-cosmetique-regeneratrice', 'Les peptides au cœur de la nouvelle cosmétique régénératrice', 'Les laboratoires misent sur les peptides pour stimuler la production naturelle de collagène.', 'Ces formules peptidiques promettent une peau plus ferme, plus lisse et visiblement rajeunie.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-peptides-au-c-ur-de-la-nouvelle-cosmetique-regeneratrice-1761757413848/news-les-peptides-au-c-ur-de-la-nouvelle-cosmetique-regeneratrice-1761757413848.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),
('a7848dff-911e-41e8-beb2-559aaf5d7263', 'peptides-soins-peau', 'Peptides et soins de la peau : la science du rajeunissement', 'Les peptides deviennent un ingrédient clé dans les crèmes anti-âge de nouvelle génération.', 'En agissant directement sur les cellules cutanées, ils restaurent l’élasticité et l’éclat du visage.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-et-soins-de-la-peau-la-science-du-rajeunissement-1761757489202/news-peptides-et-soins-de-la-peau-la-science-du-rajeunissement-1761757489202.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),
('1584153b-0144-484b-91a9-6abf00d53e35', 'biotechnologie-bien-etre-cutane', 'La biotechnologie au service du bien-être cutané', 'Les innovations en biotechnologie cosmétique exploitent les peptides pour une peau plus saine.', 'Ces avancées associent nature et science pour une approche durable et efficace du soin de la peau.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625/news-la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91');

UPDATE public.news_topics
SET description = CASE slug
  WHEN 'recherche' THEN '<p><strong>Découvrez les dernières avancées</strong> sur les <em>peptides biomimétiques</em> et leur rôle dans la médecine moderne.</p><p style="color:#0070f3;">Innovation, science et potentiel thérapeutique.</p>'
  WHEN 'bien-etre' THEN '<p>Les <strong>peptides</strong> dans les soins de la peau et le <em>bien-être quotidien</em>.</p><ul><li>Beauté naturelle</li><li>Régénération cellulaire</li><li>Science du rajeunissement</li></ul>'
  WHEN 'marche' THEN '<p>Suivez les <strong>tendances économiques</strong> du marché des peptides.</p><p style="color:#0070f3;">De la recherche à la commercialisation mondiale.</p>'
  WHEN 'usages' THEN '<p><em>Sport, santé, énergie</em> — les peptides au service de la <strong>performance humaine</strong>.</p><p style="color:#0070f3;">Applications concrètes et bienfaits physiologiques.</p>'
  WHEN 'reglementation' THEN '<p>Les <strong>évolutions légales</strong> et <em>normes internationales</em> autour des peptides.</p><p style="color:#0070f3;">Un cadre en constante adaptation.</p>'
END
WHERE slug IN ('recherche', 'bien-etre', 'marche', 'usages', 'reglementation');

-- ============================================
-- 🧬 RECHERCHE & INNOVATION
-- ============================================

UPDATE public.news
SET content = $$
<p>De récentes études ont mis en évidence la capacité de certains <strong>peptides biomimétiques</strong> à activer les mécanismes naturels de réparation cellulaire. Ces molécules de petite taille imitent les signaux biologiques de l’organisme et encouragent la <em>régénération tissulaire</em>.</p>
<h2>Un levier pour la médecine régénérative</h2>
<p>Ces peptides favorisent la <strong>cicatrisation avancée</strong> des plaies et la réparation des tissus endommagés après une blessure ou une intervention chirurgicale. Leur potentiel ouvre la voie à des traitements innovants en dermatologie, en orthopédie et même en neurologie.</p>
<ul>
  <li>Stimulation des fibroblastes et du collagène</li>
  <li>Réduction de l’inflammation</li>
  <li>Amélioration du renouvellement cellulaire</li>
</ul>
<p style="color:#0070f3;">Un espoir concret pour la médecine régénérative du futur.</p>
$$
WHERE slug = 'peptides-regeneration-cellulaire';

UPDATE public.news
SET content = $$
<p>L’<strong>intelligence artificielle</strong> transforme la recherche biomédicale en identifiant de nouveaux <em>peptides thérapeutiques</em> en un temps record. Grâce aux algorithmes de machine learning, il est désormais possible de prédire la structure et la fonction d’un peptide avant même sa synthèse.</p>
<h2>Une révolution scientifique</h2>
<p>Les chercheurs combinent <strong>modélisation moléculaire</strong> et IA pour explorer des milliers de séquences peptidiques virtuelles. Cette approche réduit considérablement les coûts et accélère la mise au point de nouveaux traitements.</p>
<p style="color:#0070f3;">L’IA redéfinit la vitesse d’innovation dans la découverte de médicaments.</p>
$$
WHERE slug = 'ia-decouverte-peptides-therapeutiques';

UPDATE public.news
SET content = $$
<p>Une équipe de recherche internationale a mis au point une nouvelle méthode de <strong>synthèse peptidique</strong> améliorant la stabilité et la biodisponibilité des molécules. Cette innovation représente un tournant dans la conception de <em>peptides thérapeutiques de nouvelle génération</em>.</p>
<h2>Des peptides plus performants</h2>
<p>En optimisant les chaînes d’acides aminés, ces scientifiques ont réussi à produire des peptides capables de <strong>résister à la dégradation enzymatique</strong> et de maintenir leur efficacité dans l’organisme plus longtemps.</p>
<p style="color:#0070f3;">Une étape clé vers des traitements plus sûrs et durables.</p>
$$
WHERE slug = 'avancee-peptides-synthetiques';

-- ============================================
-- 💼 MARCHÉ & ÉCONOMIE
-- ============================================

UPDATE public.news
SET content = $$
<p>Le marché des peptides connaît une <strong>croissance historique</strong>, soutenue par les avancées en biotechnologie et la demande croissante en cosmétique, nutrition et pharmaceutique.</p>
<h2>Une industrie en pleine expansion</h2>
<p>Les peptides représentent désormais un <em>secteur clé de la bioéconomie</em>, générant plusieurs milliards d’euros de revenus annuels. Cette progression est stimulée par la montée en puissance des traitements ciblés et des soins personnalisés.</p>
<p style="color:#0070f3;">Le peptide devient un acteur stratégique de la santé et du bien-être mondiaux.</p>
$$
WHERE slug = 'marche-peptides-2025';

UPDATE public.news
SET content = $$
<p>Un nombre croissant de <strong>startups biotechnologiques</strong> misent sur les peptides pour développer des solutions thérapeutiques et cosmétiques innovantes. Ces jeunes entreprises associent <em>IA, automatisation et biologie synthétique</em> pour accélérer leurs découvertes.</p>
<h2>Un écosystème en effervescence</h2>
<p>Grâce à des modèles économiques agiles, ces sociétés parviennent à réduire le temps de développement de nouveaux produits et à renforcer la <strong>compétitivité du secteur biomédical</strong>.</p>
<p style="color:#0070f3;">L’innovation peptidique au cœur de la nouvelle économie de la santé.</p>
$$
WHERE slug = 'startups-biotech-peptides';

UPDATE public.news
SET content = $$
<p>Les peptides deviennent un <strong>acteur économique clé</strong> dans le développement pharmaceutique et nutritionnel. Entre investissements publics et privés, le marché des peptides s’impose comme une <em>source d’innovation durable</em>.</p>
<h2>Un pilier de la biotechnologie moderne</h2>
<p>Cette dynamique économique s’accompagne d’une forte expansion des laboratoires spécialisés et d’un intérêt croissant des investisseurs internationaux.</p>
<p style="color:#0070f3;">L’économie des peptides s’affirme comme un levier stratégique du progrès biomédical.</p>
$$
WHERE slug = 'economie-des-peptides';

-- ============================================
-- ⚖️ RÉGLEMENTATION & CONFORMITÉ
-- ============================================

UPDATE public.news
SET content = $$
<p>Les autorités internationales travaillent à une <strong>harmonisation des réglementations</strong> concernant la production, le contrôle et l’usage des peptides.</p>
<h2>Une coopération mondiale renforcée</h2>
<p>Cette évolution vise à faciliter les <em>essais cliniques</em> et la <strong>commercialisation internationale</strong> tout en garantissant la sécurité et la traçabilité des produits.</p>
<p style="color:#0070f3;">Un pas décisif vers un cadre global pour la biotechnologie peptidique.</p>
$$
WHERE slug = 'harmonisation-normes-peptides';

UPDATE public.news
SET content = $$
<p>L’Union européenne a adopté de nouvelles <strong>directives encadrant la recherche</strong> sur les peptides. Ces mesures visent à harmoniser les procédures de fabrication et de contrôle au sein des laboratoires.</p>
<h2>Des règles pour une science plus sûre</h2>
<p>Cette initiative européenne renforce la <em>transparence scientifique</em> et soutient la qualité des produits utilisés dans la recherche médicale.</p>
<p style="color:#0070f3;">Une étape cruciale pour une recherche responsable et conforme aux normes internationales.</p>
$$
WHERE slug = 'directives-europeennes-peptides';

UPDATE public.news
SET content = $$
<p>Les autorités sanitaires renforcent les protocoles de contrôle autour des <strong>peptides destinés à la recherche</strong>. L’objectif est de garantir leur usage éthique et conforme aux standards scientifiques.</p>
<h2>Une surveillance accrue</h2>
<p>Ces nouvelles mesures concernent la traçabilité des lots, la conformité des substances et les conditions de stockage en laboratoire.</p>
<p style="color:#0070f3;">Un cadre de contrôle renforcé pour une science plus fiable.</p>
$$
WHERE slug = 'controle-peptides-recherche';

-- ============================================
-- 💪 USAGES & PERFORMANCES
-- ============================================

UPDATE public.news
SET content = $$
<p>Dans le domaine du sport, les <strong>peptides bioactifs</strong> suscitent un intérêt croissant pour leur rôle dans la <em>régénération musculaire</em> après l’effort. Ils accélèrent la réparation des fibres et réduisent la fatigue cellulaire.</p>
<h2>Un soutien métabolique naturel</h2>
<p>Ces peptides agissent en synergie avec le métabolisme énergétique pour <strong>optimiser la récupération</strong> et améliorer la performance globale des athlètes.</p>
<p style="color:#0070f3;">Une avancée majeure pour la santé et la performance sportive.</p>
$$
WHERE slug = 'peptides-recuperation-musculaire';

UPDATE public.news
SET content = $$
<p>Les <strong>peptides bioactifs</strong> jouent un rôle central dans la <em>performance physique</em> en stimulant la production d’énergie et la régénération musculaire. Ils représentent une alternative naturelle aux compléments classiques.</p>
<h2>Des résultats mesurables</h2>
<p>Des études récentes démontrent une amélioration de la <strong>force, de l’endurance et de la récupération</strong> chez les sportifs ayant intégré ces peptides à leur programme.</p>
<p style="color:#0070f3;">Une nouvelle ère pour la nutrition sportive intelligente.</p>
$$
WHERE slug = 'peptides-performance-physique';

UPDATE public.news
SET content = $$
<p>Les recherches explorent comment les <strong>peptides</strong> régulent l’<em>énergie cellulaire et le métabolisme musculaire</em>. Ces travaux ouvrent de nouvelles perspectives sur l’optimisation de la performance sportive.</p>
<h2>Une approche biochimique de pointe</h2>
<p>En agissant sur les voies métaboliques clés, les peptides pourraient améliorer la gestion de l’énergie et réduire la fatigue chronique chez les athlètes de haut niveau.</p>
<p style="color:#0070f3;">Vers une performance durable et respectueuse du corps.</p>
$$
WHERE slug = 'peptides-metabolisme-performance';

-- ============================================
-- 💎 BIEN-ÊTRE & COSMÉTIQUES
-- ============================================

UPDATE public.news
SET content = $$
<p>Les <strong>peptides cosmétiques</strong> s’imposent comme des actifs incontournables pour <em>stimuler la production naturelle de collagène</em> et restaurer l’élasticité de la peau.</p>
<h2>Une approche bioactive du soin</h2>
<p>Contrairement aux crèmes traditionnelles, ces formules à base de peptides interagissent directement avec les cellules cutanées, améliorant la <strong>fermeté et la luminosité</strong> du visage.</p>
<p style="color:#0070f3;">Vers une beauté régénérative, entre science et nature.</p>
$$
WHERE slug = 'peptides-cosmetique-regeneratrice';

UPDATE public.news
SET content = $$
<p>Les <strong>peptides</strong> deviennent un ingrédient clé des <em>crèmes anti-âge</em> de nouvelle génération. Leur action ciblée stimule la synthèse de collagène et aide à restaurer l’élasticité de la peau.</p>
<h2>Une efficacité prouvée</h2>
<p>Des études cliniques montrent une réduction visible des rides et un <strong>rajeunissement global du teint</strong> après plusieurs semaines d’utilisation.</p>
<p style="color:#0070f3;">Les peptides : la science au service d’une peau éclatante.</p>
$$
WHERE slug = 'peptides-soins-peau';

UPDATE public.news
SET content = $$
<p>Les innovations en <strong>biotechnologie cosmétique</strong> exploitent les peptides pour une peau plus saine et plus résistante aux agressions extérieures.</p>
<h2>Une alliance entre nature et science</h2>
<p>En associant des peptides naturels à des vecteurs biocompatibles, les laboratoires créent des formules qui <strong>renforcent la barrière cutanée</strong> et améliorent l’hydratation durable.</p>
<p style="color:#0070f3;">Une approche durable et efficace du soin de la peau.</p>
$$
WHERE slug = 'biotechnologie-bien-etre-cutane';

-- 🧩 Ajouts légers pour les filtres avancés
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- 🔎 Index pour les filtres par tags (performant)
CREATE INDEX IF NOT EXISTS idx_products_tags_gin ON public.products USING GIN (tags);

-- (Optionnel) quelques tags de démo pour tes seeds existants
UPDATE public.products
SET tags = ARRAY['nootropique','bien-etre','99%']
WHERE name IN ('Semax','Selank','DSIP');

UPDATE public.products
SET tags = ARRAY['performance','98%','hot']
WHERE name = 'IGF-1 LR3';

UPDATE public.products
SET tags = ARRAY['metabolisme','perte-de-poids','99%']
WHERE name = 'Retatrutide';

UPDATE public.products
SET tags = ARRAY['libido','bien-etre','99%']
WHERE name = 'PT-141';

-- ============================================================
-- 🧩 Ajout du champ avatar_url à la table profiles (si manquant)
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text;

COMMENT ON COLUMN public.profiles.avatar_url IS
  'Chemin relatif du fichier avatar stocké dans le bucket Supabase (ex: avatars/uuid-timestamp.png)';

DROP POLICY IF EXISTS "Update own profile" ON public.profiles;

CREATE POLICY "Update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

  -- ============================================================
-- 📦 BUCKET : avatars
-- ============================================================

-- ✅ Crée le bucket avatars s’il n’existe pas déjà
insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (select 1 from storage.buckets where id = 'avatars');

-- ============================================================
-- 🔐 POLICIES : gestion des avatars
-- ============================================================

-- 🗑 On nettoie au cas où
do $$
begin
  execute 'drop policy if exists "Users can upload avatars" on storage.objects';
  execute 'drop policy if exists "Public can view avatars" on storage.objects';
  execute 'drop policy if exists "Users can update own avatars" on storage.objects';
  execute 'drop policy if exists "Users can delete own avatars" on storage.objects';
end $$;

-- 👤 Autoriser les utilisateurs connectés à uploader dans le bucket avatars
create policy "Users can upload avatars"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars' and owner = auth.uid());

-- 👀 Autoriser la lecture publique (si le bucket est public)
create policy "Public can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- ✏️ Autoriser les utilisateurs à mettre à jour leur propre avatar
create policy "Users can update own avatars"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());

-- 🗑 Autoriser les utilisateurs à supprimer leur propre avatar
create policy "Users can delete own avatars"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());


ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male','female','other'));


-- ============================================================
-- 🧠 Ajout du champ ui_preferences à la table profiles
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ui_preferences jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.profiles.ui_preferences IS
  'Stocke les préférences d’interface utilisateur (ex: sections ouvertes du profil, thème, etc.) au format JSON.';

-- ============================================================
-- 🔒 Mise à jour des politiques RLS (Row Level Security)
-- ============================================================

-- Supprime l’ancienne policy si elle existe
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;

-- ✅ Politique permettant à chaque utilisateur de modifier uniquement son propre profil
CREATE POLICY "Update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ✅ Politique de lecture personnelle (utile si tu veux fetch depuis le client)
DROP POLICY IF EXISTS "Select own profile" ON public.profiles;
CREATE POLICY "Select own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Active RLS si ce n’est pas déjà fait
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 🧹 Vérification du champ et valeur par défaut
-- ============================================================

-- Initialise les préférences vides pour les profils existants (évite les erreurs de parsing)
UPDATE public.profiles
SET ui_preferences = '{}'::jsonb
WHERE ui_preferences IS NULL;

-- Index optionnel (si tu veux faire des requêtes JSON spécifiques)
-- CREATE INDEX IF NOT EXISTS profiles_ui_preferences_idx ON public.profiles USING gin (ui_preferences);
-- ============================================================
-- 🧩 EXTENSION DU PROFIL UTILISATEUR
-- Ajout des champs nécessaires pour ton site de retail
-- ============================================================

-- ✅ 1. Ajout des colonnes manquantes
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS ui_preferences jsonb DEFAULT '{}'::jsonb;

-- ✅ 2. Documentation des nouvelles colonnes
COMMENT ON COLUMN public.profiles.full_name IS
  'Nom complet de l’utilisateur (affiché dans le profil).';

COMMENT ON COLUMN public.profiles.phone IS
  'Numéro de téléphone de contact.';

COMMENT ON COLUMN public.profiles.address IS
  'Adresse principale de livraison ou de facturation.';

COMMENT ON COLUMN public.profiles.avatar_url IS
  'Chemin relatif du fichier avatar dans le bucket Supabase (ex: avatars/uuid-timestamp.png).';

COMMENT ON COLUMN public.profiles.ui_preferences IS
  'Stocke les préférences d’interface utilisateur au format JSON (ex: sections du profil, thème, etc.).';

-- ✅ 3. Initialisation pour les anciens utilisateurs
UPDATE public.profiles
SET ui_preferences = '{}'::jsonb
WHERE ui_preferences IS NULL;

-- ============================================================
-- 🔒 4. Politiques RLS (sécurité par utilisateur)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprime les anciennes policies pour éviter les doublons
DROP POLICY IF EXISTS "Select own profile" ON public.profiles;
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;

-- Lecture sécurisée
CREATE POLICY "Select own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Mise à jour sécurisée
CREATE POLICY "Update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, address, avatar_url, ui_preferences)
  VALUES (new.id, '', '', '', NULL, '{}'::jsonb);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
