-- ============================================================
-- 💾 FULL SUPABASE BACKUP / RESTORE SCRIPT (FINAL - NO RECURSION)
-- ============================================================

-- =============================
-- 🧹 CLEANUP EXISTING TABLES
-- =============================
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
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
  created_at timestamptz DEFAULT now()
);

-- =============================
-- 🔐 RLS & POLICIES (SAFE, NO RECURSION)
-- =============================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprime les anciennes policies
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Read own profile" ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Update own profile" ON public.profiles';
  EXECUTE 'DROP POLICY IF EXISTS "Admin full access" ON public.profiles';
END $$;

-- 👁️ Lecture : utilisateur → son propre profil
CREATE POLICY "Read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- ✏️ Mise à jour : utilisateur → son propre profil
CREATE POLICY "Update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 🧑‍💼 Admins : accès complet (utilise un SELECT isolé pour éviter toute récursion)
CREATE POLICY "Admin full access"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- =============================
-- ⚙️ TRIGGER : handle_new_user()
-- =============================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
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
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================
-- ⚙️ JWT Custom Claims (NO recursion)
-- =============================
CREATE OR REPLACE FUNCTION public.jwt_custom_claims()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object('role', (SELECT role FROM public.profiles WHERE id = auth.uid()));
$$;

-- =============================
-- 👥 SEED : Profiles
-- =============================
INSERT INTO public.profiles (id, email, role, created_at, full_name, avatar_url) VALUES
('04fd0dc1-601e-4e3d-91ca-f7c7f7062dd9', 'lucas.martin@example.com', 'user', '2025-10-23 11:06:16.614868+00', 'Lucas Martin', NULL),
('53b4ae6b-8339-4a20-8947-84b77f5ae5a4', 'maxime.riviere@example.com', 'admin', '2025-10-23 11:06:16.614868+00', 'Maxime Rivière', NULL),
('a0dde032-184c-4770-8b9f-51d7a52f36b4', 'h.bogrand@gmail.com', 'admin', '2025-10-23 00:03:44.82892+00', 'Hugo Bogrand', NULL),
('f60d71db-f34d-4610-821e-c5a679d13ee5', 'emma.dupont@example.com', 'user', '2025-10-23 11:06:16.61868+00', 'Emma Dupont', NULL);

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

-- Supprime anciennes policies
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Public can read products" ON public.products';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage products" ON public.products';
END $$;

CREATE POLICY "Public can read products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 🌱 SEED : Products
INSERT INTO public.products (id, name, category, price, purity, stock, image, created_at, description) VALUES
('055325fa-d4cf-4fff-99c9-6b2313efd21e', 'IGF-1 LR3', 'Performance', 59.90, 98.00, false, '/src/assets/products/igf-1-lr3/peptide-igf-1-lr3.png', '2025-10-23 11:03:43.922507', 'Facteur de croissance insulinomimétique, variante LR3.'),
('33139fef-a328-4f89-9586-29d7ee594cd7', 'Semax', 'Bien-être', 27.90, 99.00, true, '/src/assets/products/semax/peptide-semax.png', '2025-10-23 11:03:43.922507', 'Peptide neuroprotecteur / stimulant cognitif.'),
('36aa8192-5ff4-475f-8e8b-2ae9acd99750', 'Retatrutide', 'Métabolisme', 54.90, 99.00, true, '/src/assets/products/retatrutide/peptide-retatrutide.png', '2025-10-23 11:03:43.922507', 'Agoniste multiple étudié pour la perte de poids.'),
('4c9db888-2682-4fb0-9c78-9a14529c9916', 'Selank', 'Bien-être', 27.90, 99.00, true, '/src/assets/products/selank/peptide-selank.png', '2025-10-23 11:03:43.922507', 'Peptide anxiolytique et nootropique.');

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
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 🌱 SEED : Orders
INSERT INTO public.orders (id, user_id, full_name, email, address, zip, city, country, payment_method, total_amount, items, status, created_at)
VALUES
('0d47fea6-fc86-4738-880b-7ae3e2c6c06e', 'a0dde032-184c-4770-8b9f-51d7a52f36b4', 'Hugo Bogrand', 'h.bogrand@gmail.com', '', '', '', 'France', 'stripe', 54.90, '[{"id":"36aa8192-5ff4-475f-8e8b-2ae9acd99750","name":"Retatrutide"}]', 'pending', '2025-10-23 12:48:27.273917+00');

-- ============================================================
-- ✅ END OF SCRIPT
-- ============================================================
