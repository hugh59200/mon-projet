-- =============================
-- Table : orders
-- =============================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  zip text NOT NULL,
  country text NOT NULL,
  payment_method text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  items jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders (email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS status text DEFAULT 'En attente';

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS internal_notes text DEFAULT '';

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id),
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS zip text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS total_amount numeric,
ADD COLUMN IF NOT EXISTS items jsonb,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'En attente',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
