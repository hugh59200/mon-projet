# 🛡️ Project Atlas - Master Documentation & Strategy

**Nom Commercial :** `fast-peptides` (Domaine via Njalla)
**Entité Juridique :** `Atlas Lab Solutions LLC` (New Mexico, USA)
**Logistique :** France (Stock déporté / Drop-shipping local)
**Statut :** 🟡 **PRÉ-LANCEMENT** (Technique 100% OK / Attente EIN)

---

## 🚨 MANIFESTE OPSEC (SÉCURITÉ & ANONYMAT)

Ce projet repose sur une stratégie de "cloisonnement total" pour protéger l'identité du gérant et la pérennité de l'activité "High Risk" (Research Chemicals).

### 1. La Barrière Juridique (Le "Coquillage")

- **Structure :** LLC au **Nouveau-Mexique (USA)**.
  - _Raison :_ Anonymat du registre public (Pas de noms de membres listés).
- **Adresse Officielle :** Toujours utiliser l'adresse de l'agent (**Northwest Registered Agent**) à Albuquerque.
- **Règle d'Or :** L'adresse personnelle du gérant en France ne doit **JAMAIS** apparaître sur une facture, un colis, un whois ou le site web.

### 2. La Barrière Logistique (Le "Fantôme")

- **Flux Physique :** Stock en France (pour livrer en 48h sans douane).
- **Expédition :** Exclusivement via **Mondial Relay / Shop2Shop**.
  - _Mécanisme :_ Le système "Point Relais vers Point Relais" masque l'adresse d'expédition réelle.
- **Étiquetage :** Expéditeur générique ("Service Logistique" ou "Atlas Lab"). Adresse de retour = Le Point Relais de dépôt.

### 3. La Barrière Financière (Le "Firewall")

- **Banque :** Compte pro Fintech (Wise/Mercury) au nom de la LLC US (en attente EIN).
- **Encaissement :**
  - **Interdit :** Stripe et PayPal (Bannissement immédiat pour Peptides).
  - **Stratégie Actuelle :** Paiement **Crypto** (Wallet Non-Custodial). Virement bancaire désactivé temporairement.

### 4. La Barrière Numérique (Le "Masque")

- **Infrastructure :** Cloudflare (Masquage IP serveur) + Njalla (Anonymat Domaine).
- **Administration :**
  - 🔴 **VPN OBLIGATOIRE (Mullvad)** pour toute connexion aux dashboards (Supabase, Cloudflare, Banque, Email).
  - **Cloisonnement :** L'email Admin (Proton) ne doit jamais interagir avec l'email Perso (Gmail). Pas de transfert automatique.

### 5. Analytique "Fantôme" (Zero Tracking)

- **Solution :** **Cloudflare Web Analytics** uniquement (Privacy-first, sans cookies, côté serveur).
- 🔴 **INTERDIT :** Google Analytics (GA4), Facebook Pixel, Hotjar, ou tout tracker tiers.
- _Raison :_ Ces services créent un lien direct entre votre site et votre identité Google/Meta. Un subpoena suffit.

### 6. Kill Switch (Mode Urgence)

Dispositif de coupure instantanée en cas de mise en demeure, intrusion suspectée ou raid.

- **Déclencheur :** Variable `VITE_MAINTENANCE_MODE=true` sur Cloudflare Pages (Settings → Environment Variables).
- **Effet :**
  - Redirige 100% du trafic vers page statique "Maintenance technique"
  - Coupe l'accès DB, panier, auth
  - **SEO invisible** : `noindex, nofollow` automatique + suppression des schemas JSON-LD
- **Délai :** < 30 secondes (le temps de modifier la variable et redéployer).
- **Procédure :**
  1. Cloudflare Dashboard → Pages → mon-projet → Settings → Environment Variables
  2. Ajouter/Modifier `VITE_MAINTENANCE_MODE` = `true`
  3. Cliquer "Save" → Redéploiement automatique
  4. Vérifier que le site affiche la page maintenance

**Comportement SEO en maintenance :**
```html
<!-- Mode Maintenance -->
<title>Maintenance</title>
<meta name="robots" content="noindex, nofollow">
<!-- Pas de schema Organization/WebSite -->

<!-- Mode Normal -->
<title>Atlas Lab Solutions - Peptides de Recherche</title>
<meta name="robots" content="index, follow, max-image-preview:large...">
<script type="application/ld+json">...</script>
```

---

## 🏗️ Architecture Technique (JAMstack)

### Frontend (Vue 3 + TypeScript)

- **Framework :** Vue 3 (Composition API).
- **Build :** Vite.
- **Hébergement :** Cloudflare Pages.
- **State Management (Pinia) - Règle de Sécurité :**
  - _Panier/Préférences :_ `localStorage` (Confort).
  - _Données Sensibles (Nom, Adresse) :_ `sessionStorage` (Autodestruction à la fermeture de l'onglet).

### Backend (Supabase)

- **Auth :** Supabase Auth.
- **Database :** PostgreSQL avec RLS (Row Level Security) strictes.
- **Edge Functions :** `send-order-confirmation` (Envoi email transactionnel sécurisé via Resend).
- **Secrets :** Clés API (Resend, etc.) stockées exclusivement dans Supabase Vault, jamais dans le code client.

### Communication (Architecture Hybride)

- **Canal Transactionnel (Site) :**
  - **Service :** Resend API.
  - **Usage :** Confirmations de commande automatiques.
  - **Sécurité :** DKIM/SPF validés sur Cloudflare.
- **Canal Administratif (Humain) :**
  - **Service :** Proton Mail (Suisse).
  - **Adresse :** `contact@fast-peptides.com` (Identité "Atlas Lab").
  - **Sécurité :** Cryptage de bout en bout, cloisonné du personnel.

---

## 💳 Stratégie de Paiement (Launch & Upgrade)

Nous adoptons une approche évolutive pour contourner les délais administratifs (IRS) et sécuriser le lancement.

### PHASE 1 : Le Lancement Crypto (ACTUEL)

- **Objectif :** Premières ventes immédiates & Sécurité maximale.
- **Mécanisme :**
  1.  **Checkout :** Paiement Crypto uniquement (Virement affiché "Bientôt").
  2.  **Confirmation :** Affichage adresses Wallet (BTC / USDT-TRC20).
  3.  **Validation :** Admin vérifie la réception sur Exodus et valide la commande.
- **Avantage :** Incensurable, aucun risque de gel des fonds.

### PHASE 2 : L'Upgrade "High-Risk" (FUTUR - Post EIN)

- **Condition :** EIN obtenu + 3 mois d'historique bancaire.
- **Cible :** Gateway NMI ou Authorize.net avec Merchant Account "High Risk" dédié.
- **Technique :** Intégration via `Hosted Fields` (iFrame) pour la sécurité PCI.

---

## 📦 Parcours Client & Compliance

### 1. Le "Bouclier Légal" (Frontend)

- **Age Gate :** Modale +18 ans à l'entrée (Cookie/LocalStorage).
- **Disclaimer Checkout :** Checkbox obligatoire avant paiement : _"Je certifie être un chercheur qualifié... Usage laboratoire uniquement..."_.
- **Geo-blocking :** Formulaire d'adresse restreint (Pas d'Allemagne, Suisse, USA).
- **SEO/GEO :** Données structurées Schema.org "Research Chemical" injectées pour les IA.

### 2. Le Checkout Asynchrone

1.  **Panier :** Validation classique.
2.  **Paiement :** Crypto par défaut.
3.  **Validation :** Appel Edge Function -> Email confirmation.
4.  **Succès :** Page de confirmation avec instructions Wallet.

---

## 📝 Roadmap & Statut Actuel

_Mise à jour : 09/12/2025_

| Brique                |  Statut   | Notes                                                      |
| :-------------------- | :-------: | :--------------------------------------------------------- |
| **Structure LLC**     |  🟢 Fait  | Créée, OA signé & Archivé.                                 |
| **Site Web (Vue 3)**  |  🟢 Fait  | Déployé, Design "Labo" OK, Footer Clean.                   |
| **Base de Données**   |  🟢 Fait  | Supabase Configuré.                                        |
| **Textes Légaux**     |  🟢 Fait  | CGV/Privacy intégrées (Spécial NM Law + RUO).              |
| **Logistique**        |  🟢 Fait  | Widget Mondial Relay intégré.                              |
| **Paiement Crypto**   |  🟢 Fait  | Wallet Exodus configuré, Adresses injectées.               |
| **Qualité (QA)**      |  🟢 Fait  | Tests E2E Cypress validés.                                 |
| **Email Pro (OpSec)** |  🟢 Fait  | Proton (Admin) + Resend (Auto) + DNS Cloudflare Sécurisés. |
| **Newsletter**        |  🟢 Fait  | Double opt-in + Code promo -10% automatique.               |
| **Lab Notes**         |  🟢 Fait  | 5 guides techniques + Calculateur dilution intégré.        |
| **Session Tracking**  |  🟢 Fait  | Analytics interne privacy-first + Dashboard admin.         |
| **Kill Switch**       |  🟢 Fait  | Mode maintenance via env var Cloudflare.                   |
| **Glossaire SEO**     |  🟢 Fait  | 40 termes scientifiques pour SEO longue traîne.            |
| **Crypto Cockpit**    |  🟢 Fait  | Validation paiements crypto avec txid matching.            |
| **Email Nurturing**   |  🟢 Fait  | Séquence 3 emails éducatifs post-inscription.              |
| **Review Request**    |  🟢 Fait  | Demande d'avis automatique J+10 après expédition.          |
| **Cart Reminder**     |  🟢 Fait  | Rappel panier abandonné avec code promo.                   |
| **Compte Banque**     | 🔴 Bloqué | Attente EIN (Délai IRS important).                         |

---

## 📧 Système Newsletter (Double Opt-in)

### Flux d'inscription

```
1. Utilisateur s'inscrit (homepage ou footer)
   ↓
2. Email de confirmation envoyé automatiquement
   (via Edge Function newsletter-confirmation)
   ↓
3. Email contient : Code WELCOME10 + Lien de confirmation
   ↓
4. Clic sur le lien → /newsletter/confirm?token=xxx
   ↓
5. Status passe de 'pending' à 'active'
   ↓
6. Affichage du code promo avec bouton copier
```

### Composants Frontend

| Route | Fichier | Description |
|-------|---------|-------------|
| Homepage/Footer | `NewsletterSignup.vue` | Formulaire d'inscription (3 variantes) |
| `/newsletter/confirm` | `NewsletterConfirmView.vue` | Page de confirmation avec code promo |
| `/newsletter/unsubscribe` | `NewsletterUnsubscribeView.vue` | Page de désinscription |

### Edge Functions

| Fonction | Description |
|----------|-------------|
| `newsletter-confirmation` | Envoie l'email de confirmation avec code -10% |
| `send-newsletter` | Envoi de campagnes en masse (admin) |

### Tables Supabase

- `newsletter_subscribers` : Liste des abonnés avec préférences
- `newsletter_campaigns` : Campagnes d'envoi
- `newsletter_sends` : Tracking des envois individuels
- `newsletter_stats` (vue) : Statistiques en temps réel

### Code Promo

Le code `WELCOME10` est automatiquement affiché dans l'email de confirmation et sur la page de confirmation. Il offre -10% sur la première commande (usage unique par utilisateur).

---

## 🔍 SEO & Indexation

### Configuration Centralisée

Fichier : `src/config/seo.ts`

```typescript
import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'

// SEO_CONFIG.APP_URL → 'https://fast-peptides.com'
// SEO_CONFIG.SITE_NAME → 'Atlas Lab Solutions'
// getCanonicalUrl('/produit/bpc-157') → 'https://fast-peptides.com/produit/bpc-157'
```

### useHead (@vueuse/head)

Chaque page utilise `useHead` pour définir ses métadonnées :

```typescript
useHead({
  title: 'Titre de la page | Atlas Lab Solutions',
  meta: [
    { name: 'description', content: 'Description...' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Titre' },
    { property: 'og:description', content: 'Description' },
    { property: 'og:image', content: 'https://fast-peptides.com/og-image.jpg' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: getCanonicalUrl('/ma-page') }
  ],
  script: [
    { type: 'application/ld+json', children: JSON.stringify(schemaOrg) }
  ]
})
```

### Schema.org (JSON-LD) — Hybridation "Research Chemical"

Données structurées injectées par page avec **marquage scientifique** pour éviter les filtres médicaux Google :

| Page | Schema Type | Particularité |
|------|-------------|---------------|
| Produit | `Product` + `ChemicalSubstance` + `IndividualProduct` | `audience: Researcher`, `usageInfo: "Research Use Only"` |
| Article/Actualité | `BlogPosting` + `Article` | `author: Organization` |
| Lab Notes | `TechArticle` + `HowTo` | `proficiencyLevel`, `tool` |
| FAQ | `FAQPage` + `Question/Answer` | — |
| Homepage | `Organization` + `WebSite` | `areaServed`, `knowsAbout: peptides` |

⚠️ **Critique** : L'hybridation `ChemicalSubstance` + `audience: Researcher` signale aux crawlers que ce sont des produits de recherche, pas des médicaments ou compléments alimentaires. Sans cela, Google applique les filtres YMYL (Your Money Your Life).

### URLs SEO-Friendly (Slugs)

Les URLs des produits utilisent des slugs lisibles au lieu des UUIDs :

```
❌ Avant : /catalogue/30d23649-00f8-436f-9b99-f349ca8e411d
✅ Après : /catalogue/bpc-157-10mg
```

**Implémentation :**
- Colonne `slug` sur la table `products` (unique, auto-générée)
- Fonction `generate_product_slug(name, dosage)` → génère le slug
- Trigger `trigger_set_product_slug` → auto-génération à l'insertion
- Route `/catalogue/:slug` au lieu de `/catalogue/:id`
- Rétrocompatibilité : les anciens liens UUID fonctionnent toujours

**Migration :**
```bash
DATABASE_PASSWORD="..." node scripts/exec-sql.cjs supabase/script/migrate-v6.5-product-slugs.sql
```

### Sitemap

Génération automatique via `scripts/generate-sitemap.cjs` :

```bash
npm run build  # Génère sitemap.xml et sitemap-index.xml
```

Structure :
- `sitemap-index.xml` → Index principal
- `sitemap.xml` → Pages statiques + produits + articles

### Robots.txt

Fichier : `public/robots.txt`

**Autorisé** : Toutes les pages publiques
**Bloqué** : `/admin`, `/checkout`, `/profile`, `/auth`, `/api`, pages techniques

### Prérendu (SSR-like)

Script `scripts/prerender.cjs` pour pré-générer le HTML des pages critiques au build :
- Homepage
- Pages produits
- Articles/Actualités
- Lab Notes

### Checklist SEO par Page

- [ ] `title` unique (50-60 caractères)
- [ ] `meta description` unique (150-160 caractères)
- [ ] `canonical` URL absolue
- [ ] `og:*` tags complets
- [ ] `twitter:*` tags
- [ ] Schema.org JSON-LD
- [ ] `robots` meta (index/noindex)
- [ ] Heading hierarchy (h1 unique, h2, h3...)

---

## 📚 Lab Notes (Ressources Techniques)

Section documentation scientifique avec style "manuel de laboratoire" pour renforcer la crédibilité et le SEO.

### Architecture

| Route | Composant | Description |
|-------|-----------|-------------|
| `/ressources` | `ResourcesListView.vue` | Liste des guides avec carte outil en vedette |
| `/ressources/:slug` | `ResourceDetailView.vue` | Article avec TOC sidebar sticky |
| `/guide-reconstitution` | `ReconstitutionView.vue` | Calculateur de dilution interactif |

### Fonctionnalités

- **TOC Sidebar** : Table des matières auto-générée depuis les h2/h3, sticky au scroll
- **Callouts stylisés** : `.callout-success`, `.callout-warning`, `.callout-danger`
- **Featured Tool** : Carte en vedette vers le calculateur de dilution
- **Badges** : Difficulté (Débutant/Intermédiaire/Avancé) + Catégorie sur chaque article
- **Équipements** : Liste du matériel requis dans la sidebar

### Guides Techniques (5 articles)

| Titre | Catégorie | Difficulté |
|-------|-----------|------------|
| Reconstitution des Peptides Lyophilisés | Protocoles Lab | Débutant |
| Comprendre les Rapports HPLC | Analyse HPLC | Intermédiaire |
| Stockage Optimal des Peptides | Stockage & Conservation | Débutant |
| Structure Moléculaire des Peptides | Science Moléculaire | Avancé |
| Standards de Qualité (COA) | Standards Qualité | Intermédiaire |

### Calculateur de Dilution

Outil interactif accessible via Lab Notes (retiré de la navigation principale) :
- Calcul automatique des volumes de solvant
- Visualisation seringue avec graduations
- Lien depuis les articles pertinents via callout

### Tables Supabase

- `resources` : Articles avec contenu, images, métadonnées SEO
- `resource_categories` : Catégories avec icône et couleur

### Scripts

```bash
# Seed des articles Lab Notes
DATABASE_PASSWORD="..." node scripts/exec-sql.cjs supabase/script/seed-lab-notes-resources.sql

# Upload des images vers bucket news-images
node scripts/upload-lab-notes-images.cjs
```

---

## 📊 Session Tracking (Analytics Interne)

Système de tracking "privacy-first" entièrement interne, sans dépendance à des services tiers (GA4, Pixel, etc.).

### Philosophie

- **Zero tracking tiers** : Pas de GA4, Facebook Pixel, Hotjar (cf. section OPSEC)
- **Données first-party** : Stockées dans Supabase, sous notre contrôle
- **Privacy-first** : Pas de cookies persistants, session ID en `sessionStorage`
- **Funnel complet** : Du landing à la commande

### Architecture

```
src/features/tracking/
├── services/
│   └── sessionTracker.ts    # Service singleton de tracking
└── components/              # (Composants TrackOrder - suivi colis)

src/api/supabase/
└── sessions.ts              # API Supabase pour les sessions

src/features/admin/sessions/
├── AdminSessionsView.vue    # Dashboard admin complet
└── mobile/SessionCardMobile.vue
```

### Données Collectées

| Catégorie | Champs | Source |
|-----------|--------|--------|
| **Session** | `session_id`, `session_type`, `duration_seconds` | Auto-généré |
| **Utilisateur** | `user_id`, `profiles.*` | Supabase Auth |
| **Géolocalisation** | `country`, `city`, `region`, `country_code` | ipapi.co (gratuit) |
| **Device** | `device_type`, `browser`, `os`, `user_agent` | Navigator API |
| **Navigation** | `landing_page`, `referrer`, `pages_viewed` | Router |
| **Funnel** | `added_to_cart`, `started_checkout`, `completed_order` | Events manuels |

### Points de Tracking (Intégration)

| Event | Fichier | Moment |
|-------|---------|--------|
| **Session start** | `main.ts` | Au boot de l'app |
| **Page view** | `main.ts` | `router.afterEach()` |
| **Add to cart** | `useCartStore.ts` | `addItem()` |
| **Checkout start** | `CheckoutView.vue` | `onMounted()` |
| **Order complete** | `CheckoutView.vue` | Après création commande |
| **Session end** | Auto | `beforeunload` + `sendBeacon` |

### Dashboard Admin (`/admin` → Sessions)

**Métriques temps réel :**
- Sessions 24h / 7j / 30j
- Utilisateurs actifs
- En ligne maintenant (refresh 30s)
- Conversions (sessions avec commande)

**Visualisations :**
- Graphique bar chart (7 derniers jours)
- Liste des sessions avec filtres (Tous / Connectés / Anonymes)
- Top pays (30 derniers jours)
- Détail par session : user, device, localisation, durée, actions

### Tables Supabase

```sql
-- Table principale
user_sessions (
  id, session_id, user_id, session_type,
  device_type, browser, os, user_agent,
  country, city, region, country_code,
  landing_page, referrer, pages_viewed,
  added_to_cart, started_checkout, completed_order,
  started_at, last_activity_at, ended_at, duration_seconds
)

-- Vues agrégées
sessions_stats        -- Métriques globales
sessions_by_day       -- Agrégation par jour
sessions_by_country   -- Agrégation par pays

-- RPC Functions
track_session()              -- Créer/mettre à jour session
update_session_activity()    -- Mettre à jour activité
end_session()                -- Terminer session
```

### Usage dans le code

```typescript
import {
  initSessionTracking,
  trackPageView,
  trackAddToCart,
  trackCheckoutStart,
  trackOrderComplete,
  updateSessionUser,
} from '@/features/tracking/services/sessionTracker'

// Au login
updateSessionUser(user.id)

// Event custom
trackAddToCart()
```

---

## 📖 Glossaire SEO (Longue Traîne)

Section glossaire scientifique avec définitions courtes (~100 mots) pour capturer les recherches SEO longue traîne.

### Architecture

| Route | Composant | Description |
|-------|-----------|-------------|
| `/glossaire` | `GlossaireView.vue` | Liste alphabétique avec recherche |
| `/glossaire/:slug` | `GlossaireDetailView.vue` | Définition avec produits/ressources liés |
| `/admin/glossaire` | `AdminGlossaryView.vue` | CRUD admin complet |

### Fonctionnalités

- **Navigation alphabétique** : A-Z avec ancres
- **Recherche instantanée** : Filtrage en temps réel
- **Liens croisés** : Vers produits du catalogue ET articles Lab Notes
- **SEO complet** : Schema.org `DefinedTerm` + `DefinedTermSet`
- **i18n** : Support FR/EN avec colonnes `term_i18n`, `definition_i18n`

### Tables Supabase

```sql
glossary_terms (
  id, slug, term, definition,
  related_product_ids, related_resource_ids,
  meta_description, term_i18n, definition_i18n,
  status, created_at, updated_at
)
```

### Placement UX

- **Footer** : Lien dans la section "Liens rapides" (maillage interne SEO)
- **Pas dans le Header** : Focus conversion maintenu

---

## 💰 Cockpit Crypto Matching

Interface admin pour valider les paiements crypto avec vérification txid.

### Fonctionnalités

- **Liste des commandes crypto** : Filtrées par statut (pending, verified, failed)
- **Vérification txid** : Saisie manuelle du hash de transaction
- **Validation automatique** : Edge Function `verify-crypto-transaction`
- **Historique** : Colonnes `crypto_txid`, `crypto_verified_at`, `crypto_verified_amount`

### Architecture

```
src/features/admin/crypto-matching/
├── AdminCryptoMatchingView.vue  # Vue principale
└── components/
    └── CryptoOrderCard.vue      # Carte commande
```

### Colonnes Orders

```sql
crypto_txid VARCHAR(255),
crypto_type VARCHAR(20),     -- 'btc' | 'usdt'
crypto_verified_at TIMESTAMPTZ,
crypto_verified_amount DECIMAL
```

---

## 📧 Séquence Email Nurturing

Série de 3 emails éducatifs automatiques après inscription newsletter.

### Flux

```
Inscription Newsletter
   ↓ (J+2)
Email 1 : "Bienvenue dans la recherche"
   ↓ (J+5)
Email 2 : "Guide reconstitution"
   ↓ (J+9)
Email 3 : "Certificats d'analyse"
```

### Edge Functions

| Fonction | Description |
|----------|-------------|
| `send-nurturing-emails` | Envoi des emails de la séquence (cron quotidien) |

### Tables Supabase

```sql
email_nurturing_sequence (
  id, email, sequence_number,
  scheduled_at, sent_at, status,
  created_at
)
```

### Opt-out

- **Page dédiée** : `/newsletter/optout-nurturing?email=xxx`
- **Granulaire** : Arrête la séquence sans désabonner de la newsletter

---

## ⭐ Système de Review Request

Demande automatique d'avis J+10 après expédition.

### Flux

```
Commande expédiée (shipped_at)
   ↓ (J+10)
Email avec lien unique
   ↓
Page avis (token dans URL)
   ↓
Soumission (même sans compte)
```

### Edge Functions

| Fonction | Description |
|----------|-------------|
| `send-review-request` | Détecte les commandes J+10 et envoie les demandes |

### Token System

- **Génération** : Token unique par commande dans `reviews.review_token`
- **Lien** : `/avis?token=xxx&order=yyy`
- **Sécurité** : RLS policy permet soumission via token valide

### Tables modifiées

```sql
-- Ajouts sur reviews
order_id UUID REFERENCES orders(id),
review_token VARCHAR(64) UNIQUE

-- Ajouts sur emails_sent
type 'review_request'
```

---

## 🛒 Système Cart Reminder

Rappel doux pour paniers abandonnés (2h sans achat, pas de code promo utilisé).

### Conditions d'envoi

1. Panier non-vide depuis > 2h
2. Aucun code promo appliqué dans la session
3. Pas de commande récente
4. Max 1 reminder par utilisateur/48h

### Flux

```
Panier abandonné (2h)
   ↓
Edge Function check-cart-reminders (cron)
   ↓
Génération code promo -5%
   ↓
send-cart-reminder-email
```

### Edge Functions

| Fonction | Description |
|----------|-------------|
| `check-cart-reminders` | Détecte les paniers éligibles (cron) |
| `send-cart-reminder-email` | Envoie l'email avec code promo |

### Tables modifiées

```sql
-- Type ajouté dans user_promo_rewards
reward_type 'cart_reminder'

-- Config dans auto_promo_settings
code_type = 'cart_reminder'
discount_percent = 5
validity_days = 7
```

---

## 📊 Indicateurs de Statut (Footer)

Widget affichant l'état opérationnel du site en temps réel.

### Indicateurs

| ID | Label | Source |
|----|-------|--------|
| `orders` | Commandes | Toujours "Ouvertes" |
| `shipping` | Expéditions | Dernière commande expédiée |
| `support` | Support | Activité admin (messages 48h) |

### API

```typescript
import { fetchSystemStatus } from '@/api/supabase/status'

const status = await fetchSystemStatus()
// { orders, shipping, support, lastChecked }
```

### Niveaux de statut

- `operational` : Vert - Fonctionnement normal
- `degraded` : Orange - Retard possible (>5 jours sans expédition)
- `down` : Rouge - Indisponible

---

## 🎨 Système de Theming

Architecture à 2 couches indépendantes pour la personnalisation visuelle.

### Couche 1 : Mode Light/Dark

Gère l'apparence globale (clair/sombre).

**Fichiers clés :**
- `src/composables/useTheme.ts` — Composable principal
- `designSystem/src/fondation/colors/semantic-theme.less` — Variables CSS sémantiques

**Stockage :** `localStorage['theme-preference']` → `'light'` | `'dark'` | `'system'`

**Application :** Attribut `data-theme` sur `<html>`

```typescript
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme, setTheme } = useTheme()
setTheme('dark')     // Force dark
setTheme('system')   // Suit la préférence OS
toggleTheme()        // Bascule light ↔ dark
```

**Anti-flash :** Le thème est appliqué immédiatement au chargement du module (avant le rendu Vue) pour éviter le flash blanc.

### Couche 2 : Palette de couleurs (Primary/Secondary)

Gère les couleurs d'accent et de surface.

**Fichiers clés :**
- `src/composables/useCustomTheme.ts` — Gestion palettes
- `designSystem/src/fondation/colors/themes/theme-blue.less` — Palette bleue (défaut)
- `designSystem/src/fondation/colors/themes/theme-brown.less` — Palette marron
- `designSystem/src/fondation/colors/theme-variables.less` — Application des palettes

**Stockage :** `localStorage['custom-theme-config']` → `{ mode, preset?, customColor? }`

**Modes disponibles :**

| Mode | Primary (accents) | Secondary (surfaces) |
|------|-------------------|----------------------|
| Preset `blue` | Bleu (#2664ec) | Bleu-gris (#111727) |
| Preset `brown` | Beige (#c9a97a) | Brun (#4b3424) |
| Custom | Couleur choisie | **Fixe = blue** |

⚠️ **Important** : En mode custom, seule la palette `primary` change. La `secondary` reste bleue pour garantir l'accessibilité et la cohérence des surfaces.

```typescript
import { useCustomTheme } from '@/composables/useCustomTheme'

const { setPreset, setCustomColor } = useCustomTheme()
setPreset('blue')           // Palette complète blue
setPreset('brown')          // Palette complète brown
setCustomColor('#10b981')   // Custom : primary uniquement
```

### Initialisation (main.ts)

```typescript
import { initCustomTheme } from '@/composables/useCustomTheme'

// Appelé AVANT createApp() pour éviter le flash
initCustomTheme()
```

### Génération de palette custom

`generatePalette(baseColor)` dans `useCustomTheme.ts` :
1. Convertit hex → HSL
2. Garde la teinte (H) et saturation (S) fixes
3. Varie la luminosité (L) pour générer 12 nuances (50 → 950)
4. Injecte les variables `--primary-*` via style inline sur `<html>`

### Surface Elevation System

Système de niveaux pour gérer le contraste entre conteneurs imbriqués (dark mode).

```
Level 0 (--surface-0) : Page background    → secondary-950
  └─ Level 1 (--surface-1) : Cards, Modals → secondary-800
       └─ Level 2 (--surface-2) : Nested   → secondary-600
            └─ Level 3 (--surface-3) : Inputs → secondary-500
```

**Règle :** Chaque niveau est plus clair que son parent. Les inputs utilisent toujours `--surface-3` pour ressortir de n'importe quel conteneur.

### Composants UI

| Composant | Rôle |
|-----------|------|
| `Header.vue` | Bouton toggle light/dark |
| `CustomThemeSelector.vue` | Sélecteur preset/custom + color picker |
| `ContentBlock.vue` | Peut forcer un thème local (`theme="dark"`) |

### Variables sémantiques principales

```less
// Textes
--text-primary, --text-secondary, --text-muted

// Fonds
--bg-page, --bg-surface, --bg-elevated

// Inputs (toujours surface-3)
--input-bg, --input-border, --input-border-focus

// Chrome (header/footer - toujours sombre)
--chrome-bg, --chrome-text
```

---

## ⚠️ Rappels Quotidiens pour l'Admin

1.  **Active ton VPN (Mullvad)** avant de travailler.
2.  **Ne donne jamais** de conseils de dosage (Réponse type : "Produit pour recherche uniquement").
3.  **Vérifie l'expéditeur** avant de répondre : Toujours utiliser `contact@fast-peptides.com`, jamais l'adresse technique/perso.
4.  **Ne livre jamais** en Allemagne ou en Suisse (Risque saisie douane).
5.  **Hygiène Numérique :** Ne jamais transférer les emails Proton vers Gmail.
