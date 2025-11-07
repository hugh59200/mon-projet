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

-- ✅ Admin full read
CREATE POLICY "Admin can read all messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ✅ Admin can send messages
CREATE POLICY "Admin can insert messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- ✅ Admin can update any messages
CREATE POLICY "Admin can update messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ✅ User can read all messages of their conversation
CREATE POLICY "User can read own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ✅ User can send messages
CREATE POLICY "User can insert own messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ✅ User can mark admin messages as read
CREATE POLICY "User can update is_read on received messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND sender_role = 'admin'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND sender_role = 'admin'
  );


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
-- 🛍️ VIEW : USER_CART_VIEW (avec détails produits)
-- ============================================================

DROP VIEW IF EXISTS public.user_cart_view;

CREATE OR REPLACE VIEW public.user_cart_view AS
SELECT
  c.id AS cart_item_id,
  c.user_id,
  c.product_id,
  COALESCE(c.quantity, 1) AS quantity,
  c.updated_at,
  p.name AS product_name,
  COALESCE(p.price, 0)::numeric(10,2) AS product_price,
  COALESCE(p.image, '') AS product_image,
  p.category AS product_category,
  COALESCE(p.stock, true) AS product_stock
FROM public.user_cart_items c
JOIN public.products p ON p.id = c.product_id;

-- Activer la sécurité sur la vue
ALTER VIEW public.user_cart_view SET (security_invoker = true);

-- Politiques d'accès identiques au panier
ALTER VIEW public.user_cart_view OWNER TO postgres;

-- RLS sur la vue (hérite de user_cart_items)
GRANT SELECT ON public.user_cart_view TO authenticated;



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

-- ============================================================
-- 🌐 INSERT DES TOPICS (depuis version 2025-10-24)
-- ============================================================

INSERT INTO public.news_topics (id, slug, label, description, image, created_at)
VALUES 
('76bb3e2d-d0c7-41aa-a59c-32f4c77379e9', 'recherche', 'Recherche & Innovation', 'Les dernières avancées sur les peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/recherche-innovation/topic-recherche-innovation-de988705-a90a-4fd8-bf3a-5a09091b5c5b.png', NOW()),
('82334ce4-0fcd-4947-9aa8-1bb16da64d91', 'bien-etre', 'Bien-être & Cosmétiques', 'Les peptides dans les soins, la beauté et le bien-être.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/bien-etre-cosmetiques/topic-bien-etre-cosmetiques-1761754899574.png?v=1761754899574', NOW()),
('ac5e9b57-ff9b-43d6-a69d-498a136c799a', 'marche', 'Marché & Économie', 'Les tendances et la croissance du marché des peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/marche-economie/topic-marche-economie-1761754697638.png?v=1761754697638', NOW()),
('b24c81ab-d24d-4860-91f7-faabad0892f7', 'usages', 'Usages & Performances', 'Les applications sportives et les bénéfices sur la santé.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/usages-performances/topic-usages-performances-1761754829727.png?v=1761754829727', NOW()),
('f5401164-9929-413d-8a7b-6f1bfdabf9dc', 'reglementation', 'Réglementation & Conformité', 'Les évolutions légales et politiques du marché.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/reglementation-conformite/topic-reglementation-conformite-1761754763294.png?v=1761754763294', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 📰 INSERT DES ACTUALITÉS (depuis version 2025-10-24)
-- ============================================================

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
('1584153b-0144-484b-91a9-6abf00d53e35', 'biotechnologie-bien-etre-cutane', 'La biotechnologie au service du bien-être cutané', 'Les innovations en biotechnologie cosmétique exploitent les peptides pour une peau plus saine.', 'Ces avancées associent nature et science pour une approche durable et efficace du soin de la peau.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625/news-la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91')
ON CONFLICT (id) DO NOTHING;

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
DROP VIEW IF EXISTS public.conversation_overview;

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

-- ============================================================
-- 🌱 PRODUCTS SEED COMPLET (restauré de la version précédente)
-- ============================================================

INSERT INTO public.products (name, category, price, purity, stock, image, description, tags)
VALUES
('IGF-1 LR3', 'Performance', 59.90, 98.00, false,
 '/src/assets/products/igf-1-lr3/peptide-igf-1-lr3.png',
 'Facteur de croissance insulinomimétique, variante LR3.',
 '{"performance","croissance","98%"}'),

('Semax', 'Bien-être', 27.90, 99.00, true,
 '/src/assets/products/semax/peptide-semax.png',
 'Peptide neuroprotecteur et stimulant cognitif.',
 '{"nootropique","bien-etre","99%"}'),

('Retatrutide', 'Métabolisme', 54.90, 99.00, true,
 '/src/assets/products/retatrutide/peptide-retatrutide.png',
 'Agoniste multiple étudié pour la perte de poids.',
 '{"metabolisme","perte-de-poids","99%"}'),

('Selank', 'Bien-être', 27.90, 99.00, true,
 '/src/assets/products/selank/peptide-selank.png',
 'Peptide anxiolytique et nootropique.',
 '{"anti-stress","nootropique","bien-etre"}'),

('PT-141', 'Bien-être', 42.90, 99.00, true,
 '/src/assets/products/pt-141/peptide-pt-141.png',
 'Bremelanotide ; applications libido et vitalité.',
 '{"libido","vitalite","bien-etre"}'),

('DSIP', 'Bien-être', 29.90, 99.00, true,
 '/src/assets/products/dsip/peptide-dsip.png',
 'Delta Sleep-Inducing Peptide, aide au sommeil.',
 '{"nootropique","sommeil","bien-etre"}');


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


-- ============================================================
-- 📧 TABLE : EMAILS_SENT (Historique des e-mails envoyés)
-- ============================================================

-- =========================================================
-- 📨 TABLE : emails_sent
-- Historique complet des e-mails envoyés aux clients
-- =========================================================

CREATE TABLE IF NOT EXISTS public.emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Lié à une commande (facultatif)
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Métadonnées e-mail
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,

  -- Type d'e-mail envoyé (utile pour filtrer / analyser)
  type text CHECK (
    type IN (
      'confirmation',
      'status_update',
      'shipping',
      'cancelation',
      'payment',
      'custom'
    )
  ) NOT NULL DEFAULT 'custom',

  -- Statut d’envoi (succès ou erreur)
  status text CHECK (status IN ('sent', 'error')) DEFAULT 'sent',

  -- Réponse brute du provider (Resend, etc.)
  provider_response jsonb,

  -- Date d’envoi
  sent_at timestamptz DEFAULT now()
);

-- =========================================================
-- ⚡ Index pour recherches rapides
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_emails_sent_order_id ON public.emails_sent(order_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_to_email ON public.emails_sent(to_email);
CREATE INDEX IF NOT EXISTS idx_emails_sent_type ON public.emails_sent(type);
CREATE INDEX IF NOT EXISTS idx_emails_sent_status ON public.emails_sent(status);

-- =========================================================
-- 🔒 RLS & Politiques de sécurité
-- =========================================================
ALTER TABLE public.emails_sent ENABLE ROW LEVEL SECURITY;

-- Seuls les administrateurs peuvent lire
CREATE POLICY "Admins can read emails_sent"
ON public.emails_sent
FOR SELECT
TO authenticated
USING (auth.role() = 'admin');

-- Service Role (Edge Functions) peut insérer
CREATE POLICY "Service role can insert emails_sent"
ON public.emails_sent
FOR INSERT
TO service_role
WITH CHECK (true);

-- =========================================================
-- 📡 Publication Realtime (optionnelle)
-- =========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.emails_sent;


DROP VIEW IF EXISTS public.orders_detailed_view;

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
  -- 🔹 items enrichis
  jsonb_agg(
    jsonb_build_object(
      'product_id', p.id,
      'name', p.name,
      'category', p.category,
      'price', p.price,
      'purity', p.purity,
      'stock', p.stock,
      'image', p.image,
      'quantity', (item ->> 'quantity')::int,
      'subtotal', ((item ->> 'quantity')::numeric * p.price)
    )
  ) AS detailed_items
FROM public.orders o
LEFT JOIN LATERAL jsonb_array_elements(o.items) AS item ON TRUE
LEFT JOIN public.products p ON p.id::text = item->>'product_id'
GROUP BY o.id;


DROP VIEW IF EXISTS public.orders_full_view;

CREATE OR REPLACE VIEW public.orders_full_view AS
SELECT
  o.id AS order_id,
  o.user_id,
  p.email AS user_email,
  p.full_name AS user_full_name,
  p.address AS user_address,
  p.country AS user_country,
  o.full_name AS shipping_name,
  o.email AS shipping_email,
  o.address AS shipping_address,
  o.city AS shipping_city,
  o.zip AS shipping_zip,
  o.country AS shipping_country,
  o.status,
  o.payment_method,
  o.total_amount,
  o.carrier,
  o.tracking_number,
  o.created_at,
  o.shipped_at,
  o.updated_at,

  -- 📦 détail complet produits (json agrégé)
  odv.detailed_items,

  -- ✉️ nombre d’e-mails envoyés liés à cette commande
  (
    SELECT COUNT(*)
    FROM public.emails_sent e
    WHERE e.order_id = o.id
  ) AS emails_count,

  -- 📨 date du dernier e-mail
  (
    SELECT MAX(sent_at)
    FROM public.emails_sent e
    WHERE e.order_id = o.id
  ) AS last_email_sent_at,

  -- 🧾 types d’e-mails envoyés
  (
    SELECT jsonb_agg(DISTINCT e.type)
    FROM public.emails_sent e
    WHERE e.order_id = o.id
  ) AS email_types,

  -- 👤 infos du profil client
  jsonb_build_object(
    'id', p.id,
    'email', p.email,
    'full_name', p.full_name,
    'role', p.role,
    'created_at', p.created_at
  ) AS profile_info

FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
LEFT JOIN public.orders_detailed_view odv ON odv.order_id = o.id;

ALTER VIEW public.orders_full_view SET (security_invoker = true);

GRANT SELECT ON public.orders_full_view TO authenticated;

-- ============================================================
-- 🧾 VUE ADMIN : orders_overview_for_admin
-- ------------------------------------------------------------
-- Vue légère, performante et filtrable pour le dashboard admin.
-- Chaque ligne = 1 commande.
-- Données clés : client, total, statut, date, nombre d'e-mails, etc.
-- ============================================================

DROP VIEW IF EXISTS public.orders_overview_for_admin;

CREATE OR REPLACE VIEW public.orders_overview_for_admin AS
SELECT
  o.id AS order_id,
  o.user_id,
  p.full_name AS customer_name,
  p.email AS customer_email,
  o.full_name AS shipping_name,
  o.email AS shipping_email,
  o.status,
  o.total_amount,
  o.payment_method,
  o.created_at,
  o.updated_at,
  o.carrier,
  o.tracking_number,
  o.shipped_at,

  -- 💌 Nombre d’e-mails liés à la commande
  (
    SELECT COUNT(*)
    FROM public.emails_sent e
    WHERE e.order_id = o.id
  ) AS emails_count,

  -- 🕓 Date du dernier e-mail envoyé
  (
    SELECT MAX(e.sent_at)
    FROM public.emails_sent e
    WHERE e.order_id = o.id
  ) AS last_email_sent_at,

  -- 📬 Type du dernier e-mail
  (
    SELECT e.type
    FROM public.emails_sent e
    WHERE e.order_id = o.id
    ORDER BY e.sent_at DESC
    LIMIT 1
  ) AS last_email_type

FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id;

-- 🔒 Sécurité
ALTER VIEW public.orders_overview_for_admin SET (security_invoker = true);

-- 📜 Accès lecture admin
GRANT SELECT ON public.orders_overview_for_admin TO authenticated;

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
