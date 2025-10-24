-- ============================================================
-- 💾 FULL BACKUP / RESTORE SCRIPT - SUPABASE
-- Includes: profiles, products, orders (+ data + RLS + functions)
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

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
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.jwt_custom_claims()
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object('role', role)
  FROM public.profiles
  WHERE id = auth.uid();
$$;

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

CREATE POLICY "Public can read products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

INSERT INTO public.products (id, name, category, price, purity, stock, image, created_at, description) VALUES
('055325fa-d4cf-4fff-99c9-6b2313efd21e', 'IGF-1 LR3', 'Performance', 59.90, 98.00, false, '/src/assets/products/igf-1-lr3/peptide-igf-1-lr3.png', '2025-10-23 11:03:43.922507', 'Facteur de croissance insulinomimétique, variante LR3.'),
('33139fef-a328-4f89-9586-29d7ee594cd7', 'Semax', 'Bien-être', 27.90, 99.00, true, '/src/assets/products/semax/peptide-semax.png', '2025-10-23 11:03:43.922507', 'Peptide neuroprotecteur / stimulant cognitif.'),
('36aa8192-5ff4-475f-8e8b-2ae9acd99750', 'Retatrutide', 'Métabolisme', 54.90, 99.00, true, '/src/assets/products/retatrutide/peptide-retatrutide.png', '2025-10-23 11:03:43.922507', 'Agoniste multiple étudié pour la perte de poids.'),
('480b7044-e72d-4616-b114-14b6ea7b7aad', 'TB-500', 'Récupération', 32.90, 99.00, true, '/src/assets/products/tb-500/peptide-tb-500.png', '2025-10-23 11:03:43.922507', 'Fragment synthétique du TB4 ; régénération tissulaire.'),
('4c9db888-2682-4fb0-9c78-9a14529c9916', 'Selank', 'Bien-être', 27.90, 99.00, true, '/src/assets/products/selank/peptide-selank.png', '2025-10-23 11:03:43.922507', 'Peptide anxiolytique et nootropique.'),
('4f5337fd-5b34-4e38-88b8-09d80f732c81', 'CJC-1295', 'Performance', 44.90, 98.00, false, '/src/assets/products/cjc-1295/peptide-cjc-1295.png', '2025-10-23 11:03:43.922507', 'Stimule la sécrétion naturelle de l’hormone de croissance (GH).'),
('4fa90261-496c-44e0-8dc8-dd81bd443d4a', 'Tesamorelin', 'Performance', 49.90, 98.00, false, '/src/assets/products/tesamorelin/peptide-tesamorelin.png', '2025-10-23 11:03:43.922507', 'GHRH analogue ; stimule la libération d’hormone de croissance.'),
('7979d686-c341-4606-944b-16f35097385c', 'Semaglutide', 'Métabolisme', 52.90, 99.00, true, '/src/assets/products/semaglutide/peptide-semaglutide.png', '2025-10-23 11:03:43.922507', 'Analogue du GLP-1 étudié pour le contrôle glycémique.'),
('8e30a5b8-cc7f-4e65-ba95-acd9bbcd4b8c', 'BPC-157', 'Récupération', 34.90, 99.00, true, '/src/assets/products/bpc-157/peptide-bpc-157.png', '2025-10-23 11:03:43.922507', 'Peptide pro-régénératif pour tendons et tissus.'),
('a5a75105-0731-4adc-8ea2-bc23caf68dca', 'MOTS-c', 'Recherche', 49.90, 99.00, true, '/src/assets/products/mots-c/peptide-mots-c.png', '2025-10-23 11:03:43.922507', 'Peptide mitochondrial étudié pour le métabolisme énergétique.'),
('c0e8f904-5cdc-4020-a41a-019e99c5b0a6', 'Melanothan-2', 'Recherche', 39.90, 99.00, true, '/src/assets/products/melanothan-2/peptide-melanothan-2.png', '2025-10-23 11:03:43.922507', 'Analogue de l’α-MSH ; stimule le bronzage et la libido.'),
('cb8034c6-f2e7-46b3-8169-7cb9731634ab', 'DSIP', 'Bien-être', 29.90, 99.00, true, '/src/assets/products/dsip/peptide-dsip.png', '2025-10-23 11:03:43.922507', 'Delta Sleep-Inducing Peptide, étudié pour le sommeil.'),
('d2c28d0b-8b14-4c12-b86b-44e075c0ba7b', 'PT-141', 'Bien-être', 42.90, 99.00, true, '/src/assets/products/pt-141/peptide-pt-141.png', '2025-10-23 11:03:43.922507', 'Bremelanotide ; applications libido / dysfonction sexuelle.');

-- ============================================================
-- 🧾 TABLE : ORDERS (FIXED + COMPLETE)
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

INSERT INTO public.orders (id, user_id, full_name, email, address, zip, city, country, payment_method, total_amount, items, status, internal_notes, carrier, tracking_number, shipped_at, created_at, payment_intent_id, stripe_session_id, updated_at) VALUES
('0d47fea6-fc86-4738-880b-7ae3e2c6c06e', 'a0dde032-184c-4770-8b9f-51d7a52f36b4', 'Hugo Bogrand', 'h.bogrand@gmail.com', '', '', '', 'France', 'stripe', 54.90, '[{"id":"36aa8192-5ff4-475f-8e8b-2ae9acd99750","name":"Retatrutide"}]', 'pending', '', NULL, NULL, NULL, '2025-10-23 12:48:27.273917+00', NULL, NULL, '2025-10-23 12:48:27.273917+00');

-- ============================================================
-- ✅ END OF FULL BACKUP
-- ============================================================
