-- ============================================
-- Table: reviews
-- Système d'avis produits premium/pro
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Informations de l'auteur
  author_name VARCHAR(100) NOT NULL,
  author_type VARCHAR(20) DEFAULT 'standard' CHECK (author_type IN ('standard', 'premium', 'pro', 'verified')),
  author_title VARCHAR(100), -- Ex: "PhD Researcher", "Lab Technician"
  author_institution VARCHAR(200), -- Ex: "University of Paris"

  -- Contenu de l'avis
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,

  -- Critères détaillés (optionnels)
  rating_quality INTEGER CHECK (rating_quality >= 1 AND rating_quality <= 5),
  rating_purity INTEGER CHECK (rating_purity >= 1 AND rating_purity <= 5),
  rating_shipping INTEGER CHECK (rating_shipping >= 1 AND rating_shipping <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),

  -- Métadonnées
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false, -- Modération admin
  is_featured BOOLEAN DEFAULT false, -- Mis en avant

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- Vue: product_reviews_summary
-- Agrégation des notes par produit
-- ============================================

CREATE OR REPLACE VIEW product_reviews_summary AS
SELECT
  product_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  ROUND(AVG(rating_quality)::numeric, 1) as avg_quality,
  ROUND(AVG(rating_purity)::numeric, 1) as avg_purity,
  ROUND(AVG(rating_shipping)::numeric, 1) as avg_shipping,
  ROUND(AVG(rating_value)::numeric, 1) as avg_value,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
  COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
  COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
  COUNT(*) FILTER (WHERE rating = 1) as one_star_count
FROM reviews
WHERE is_approved = true
GROUP BY product_id;

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Lecture: tout le monde peut voir les avis approuvés
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Création: utilisateurs connectés uniquement
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Modification: uniquement son propre avis non approuvé
CREATE POLICY "Users can update own pending reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_approved = false);

-- Suppression: uniquement son propre avis
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin: accès complet (via service role)

-- ============================================
-- Trigger: updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();
