-- =========================================
-- 🌍 MIGRATION I18N - Ajout colonnes JSONB
-- =========================================
-- Structure JSONB : {"en": "...", "de": "..."}
-- Le français reste dans les colonnes originales (fallback)

-- ============================
-- 📦 PRODUCTS
-- ============================
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category_i18n JSONB DEFAULT '{}';

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_products_name_i18n ON public.products USING GIN (name_i18n);

-- ============================
-- 📰 NEWS
-- ============================
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS title_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS excerpt_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS content_i18n JSONB DEFAULT '{}';

-- ============================
-- 🏷️ NEWS_TOPICS
-- ============================
ALTER TABLE public.news_topics
  ADD COLUMN IF NOT EXISTS label_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}';

-- ============================
-- 📝 COMMENTAIRE
-- ============================
COMMENT ON COLUMN public.products.name_i18n IS 'Traductions du nom: {"en": "...", "de": "..."}';
COMMENT ON COLUMN public.products.description_i18n IS 'Traductions de la description: {"en": "...", "de": "..."}';
COMMENT ON COLUMN public.products.category_i18n IS 'Traductions de la catégorie: {"en": "...", "de": "..."}';
