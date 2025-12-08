# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler avec ce dépôt.

## Documentation complémentaire

**IMPORTANT** : Lire le fichier `readme/README_2.md` pour le contexte complet du projet (fonctionnalités, roadmap, décisions techniques).

## Langue

Toujours répondre en français.

## Règles UI/UX strictes

- **JAMAIS d'effet de grossissement (scale) au hover** - Pas de `transform: scale()` sur les interactions hover
- **Pas de glow/halo décoratifs** - Éviter les `radial-gradient` décoratifs qui créent des halos visuels

## Gestion Supabase

### Modifications SQL

Quand une modification de schéma SQL est nécessaire :
1. **Mettre à jour le backup** : `supabase/script/back-up-tables-v6.sql`
   - Ajouter les DROP dans le bloc 1 (vues, tables, fonctions)
   - Ajouter les CREATE TABLE/VIEW/FUNCTION dans le corps du fichier
   - Incrémenter le numéro de version dans le header (ex: V6.2 → V6.3)
   - **NE PAS créer de fichier de migration séparé** - tout doit être dans le backup principal
2. **Mettre à jour le seed** : `supabase/script/seed-v6.sql` (si données de test nécessaires)
3. **Créer un script de migration incrémentale** : `supabase/script/migrate-vX.X-*.sql`
   - Ce script utilise `IF NOT EXISTS` et `DROP ... IF EXISTS` pour être idempotent
   - Il peut être exécuté sur une base existante sans tout recréer

### Exécution des scripts SQL

**Méthode recommandée** - Via connexion PostgreSQL directe :
```bash
# Le mot de passe est dans .env.local (DATABASE_PASSWORD)
DATABASE_PASSWORD="..." node scripts/exec-sql.cjs supabase/script/migrate-vX.X-xxx.sql
```

Le script `scripts/exec-sql.cjs` :
- Se connecte directement à PostgreSQL via le package `pg`
- Utilise l'host `db.<project-ref>.supabase.co` sur le port 5432
- Affiche le nombre de commandes exécutées
- Gère les erreurs avec indication de la ligne approximative

**Alternative** - Via Supabase Dashboard :
1. Aller sur https://supabase.com/dashboard/project/dwomsbawthlktapmtmqu/sql
2. Copier-coller le contenu du fichier SQL
3. Cliquer sur "Run"

### Edge Functions

Quand une Edge Function est créée ou modifiée :
- **Déployer automatiquement** avec `npm run deploy:functions`

### Types Supabase - Récursivité JSON

En cas d'erreur de récursivité liée aux types JSON générés par Supabase :
```typescript
// Surcharger le type problématique en `any`
type MyTable = Database['public']['Tables']['my_table']['Row'] & {
  json_column: any // Surcharge pour éviter la récursivité
}
```

## Maintenance de la documentation

**Mettre à jour régulièrement** les fichiers README quand :
- Nouvelle feature ajoutée
- Changement d'architecture
- Nouvelles conventions établies
- Scripts ou commandes ajoutés

## Commandes de Build & Développement

```bash
npm run dev           # Serveur de dev Vite (HTTPS sur le port 5278)
npm run build         # Vérification TypeScript + build Vite production
npm run preview       # Prévisualiser le build de production
npm run lint          # ESLint sur les fichiers .ts et .vue
npm run lint:fix      # Correction automatique du linting
npm run format        # Formatage avec Prettier
npm run deploy:functions  # Déployer les Edge Functions Supabase
npm run gen:types     # Générer les types TypeScript depuis le schéma Supabase
```

## Stack Technique

- **Frontend** : Vue 3 (Composition API) + TypeScript (mode strict) + Vite
- **État** : Pinia avec plugin de persistance
- **Styles** : Préprocesseur LESS avec tokens du design system
- **Backend** : Supabase (PostgreSQL, Auth, Edge Functions)
- **Emails** : API Resend
- **Livraison** : Intégration Mondial Relay

## Architecture

```
src/
├── api/                        # API centralisées
│   ├── supabase/               # Appels Supabase (products, orders, profiles, etc.)
│   ├── external/               # API externes (auth, shipping)
│   └── helpers/                # Utilitaires API (handleError)
│
├── config/                     # Configuration centralisée
│   └── seo.ts                  # Configuration SEO (APP_URL, SITE_NAME, helpers)
│
├── types/                      # Types centralisés
│   ├── utils/                  # Types utilitaires génériques
│   └── ui/                     # Types UI (dialog, chat)
│
├── features/                   # Modules par fonctionnalité (domain-driven)
│   ├── auth/                   # Authentification (email/password, OAuth, magic links)
│   ├── catalogue/              # Catalogue produits avec filtres et panier
│   ├── checkout/               # Tunnel de commande
│   ├── order/                  # Gestion et historique des commandes
│   ├── profile/                # Profil utilisateur et paramètres
│   ├── admin/                  # Dashboard admin (products, orders, users, stats)
│   ├── livraison/              # Livraison / intégration Mondial Relay
│   ├── chat/                   # Messagerie support
│   ├── actualités/             # News/articles
│   └── interface/              # Layout, sidebar, dialogs, modals
│
├── router/                     # Vue Router avec guards et types auto-générés
├── supabase/                   # Client Supabase et types auto-générés
├── directives/                 # Directives Vue personnalisées
├── plugin/                     # Plugins Vue (device-breakpoint, registration)
├── utils/                      # Fonctions utilitaires
└── pages/                      # Pages standalone (Contact, FAQ, Panier)

designSystem/src/
├── components/                 # Composants UI réutilisables (enregistrés globalement)
└── fondation/                  # Tokens de design (couleurs, typographie, espacements, icônes)

supabase/functions/             # Edge Functions basées sur Deno
├── order-confirmation/
├── send-shipping-email/
└── search-relay-points/
```

## Conventions d'Import

**API** : Utiliser les imports depuis `@/api`
```typescript
import { fetchProducts, createOrder } from '@/api'
// ou plus spécifique
import { fetchProducts } from '@/api/supabase/products'
```

**Types** : Utiliser les imports depuis `@/types`
```typescript
import type { DeepPartial, DialogResult } from '@/types'
```

**Configuration SEO** : Utiliser la configuration centralisée pour les URLs
```typescript
import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'

// Exemple dans useHead
useHead({
  meta: [
    { name: 'author', content: SEO_CONFIG.AUTHOR },
    { property: 'og:site_name', content: SEO_CONFIG.SITE_NAME },
  ],
  link: [
    { rel: 'canonical', href: getCanonicalUrl('/ma-page') }
  ]
})
```

## Patterns Clés

**Structure des Features** : Chaque feature peut contenir :
- `components/` - Composants Vue
- `stores/` - Stores Pinia
- `composables/` - Logique réactive réutilisable
- `services/` - Logique métier pure (sans Vue)
- `types/` - Types spécifiques à la feature
- `constants/` - Constantes

**Naming Conventions** :
- Stores : `use{Name}Store.ts` (ex: `useAuthStore.ts`)
- Composables : `use{Name}.ts` (ex: `useFilters.ts`)
- Services : `{name}Service.ts` ou `{name}Api.ts`
- Vues : `{Name}View.vue` (ex: `CheckoutView.vue`)

**Design System** : Les composants dans `designSystem/` sont enregistrés globalement. Utiliser les tokens LESS de `fondation/` pour la cohérence des styles.

**Alias de Chemins** :
- `@/*` → `./src/*`
- `@designSystem/*` → `./designSystem/src/*`

## Variables d'Environnement

Requises dans `.env` :
- `VITE_APP_URL` - **URL de base de l'application** (ex: `https://fast-peptides.com`) - Utilisée pour le SEO, canonical URLs, Open Graph
- `VITE_SUPABASE_URL` - URL du projet Supabase
- `SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `VITE_GOOGLE_CLIENT_ID` - Client ID Google OAuth
- `RESEND_API_KEY` - Service email (Edge Functions)
- `VITE_CLOUDFLARE_SITE_KEY` - Clé publique Cloudflare Turnstile (CAPTCHA)

**Variables de développement** (`.env.local`) :
- `VITE_DISABLE_CAPTCHA=true` - Désactive le CAPTCHA Turnstile (auto-désactivé en mode dev)
- `VITE_DISABLE_MFA=true` - Désactive le MFA admin (auto-désactivé en mode dev)

> **Note** : En mode `npm run dev`, le CAPTCHA et le MFA sont automatiquement désactivés. Pour forcer leur activation en dev, utilisez `VITE_DISABLE_CAPTCHA=false` et `VITE_DISABLE_MFA=false`.

## Supabase Storage (Assets statiques)

Les images statiques du site (personas, illustrations) sont stockées sur Supabase Storage pour de meilleures performances.

### Buckets disponibles

| Bucket | Usage | Public |
|--------|-------|--------|
| `site-assets` | Images statiques du site (personas, illustrations) | Oui |
| `product-images` | Images des produits | Oui |
| `news-images` | Images des actualités | Oui |
| `topic-images` | Images des topics | Oui |
| `email-assets` | Assets pour les emails transactionnels | Oui |

### Scripts d'upload

**Seed complet des assets** (recommandé) :
```bash
# Upload/vérifie tous les assets statiques du site
SUPABASE_SERVICE_ROLE_KEY="..." node scripts/seed-supabase-assets.cjs
```

Ce script :
1. Crée les buckets si nécessaire
2. Compresse et uploade les images (personas, etc.)
3. Génère les fichiers de config TypeScript avec les URLs
4. Si les images locales sont absentes, régénère la config depuis Supabase

**Assets email** :
```bash
# Upload les assets email (SVG → PNG)
SUPABASE_SERVICE_ROLE_KEY="..." node scripts/upload-email-assets.cjs
```

**Images produits** (migration manuelle) :
```bash
# Upload des images depuis source_images/ vers le bucket products
SUPABASE_SERVICE_ROLE_KEY="..." node scripts/upload-images.cjs
```

### Utilisation dans le code

```typescript
// Images persona (HomeScience)
import { PERSONA_ASSETS, getPersonaImageUrl } from '@/config/personaAssets'

// Accès direct
const imageUrl = PERSONA_ASSETS.rd

// Via helper
const imageUrl = getPersonaImageUrl('lab')
```

## Design System Tokens

**Typographie** : Police 'mont'. Tailles : `font-size-body-s` (10px) à `font-size-h1` (48px).

**Espacements** : Utiliser les tokens `spacing-5` (4px) à `spacing-35` (64px) pour les marges/paddings cohérents.

**Icônes** : Disponibles dans `designSystem/src/fondation/icons/` avec variantes bold et outline.

## Responsive Design

### Breakpoints

Les breakpoints sont définis dans `designSystem/src/fondation/breakpoints/breakpoints.less` et synchronisés avec `src/plugin/device-breakpoint/DeviceBreakpoint.types.ts` :

| Nom | LESS Variable | Valeur | Usage |
|-----|---------------|--------|-------|
| Mobile | `@breakpoint-mobile` | 720px | Smartphones |
| Tablet | `@breakpoint-tablet` | 1160px | Tablettes |
| Desktop | `@breakpoint-desktop` | 1400px | Grands écrans |

### Mixins LESS Responsive

Utiliser les mixins de `designSystem/src/fondation/breakpoints/responsive-mixins.less` :

```less
.my-component {
  padding: 24px;
  gap: 16px;

  // Tablet et moins (≤ 1160px)
  .respond-tablet({
    padding: 16px;
    gap: 12px;
  });

  // Mobile (≤ 720px)
  .respond-mobile({
    padding: 12px;
    gap: 8px;
  });
}
```

**Mixins disponibles** :
- `.respond-mobile(@rules)` - Styles pour ≤ 720px
- `.respond-tablet(@rules)` - Styles pour ≤ 1160px
- `.respond-tablet-only(@rules)` - Styles pour 721px à 1160px
- `.respond-desktop-only(@rules)` - Styles pour > 1160px
- `.respond-desktop-large(@rules)` - Styles pour ≥ 1400px

**Classes utilitaires** :
- `.hide-mobile` / `.hide-tablet` - Masquer sur mobile/tablet
- `.show-mobile-only` / `.show-tablet-only` / `.show-desktop-only`

**Helpers** :
- `.padding-responsive(@desktop, @tablet, @mobile)`
- `.gap-responsive(@desktop, @tablet, @mobile)`
- `.font-size-responsive(@desktop, @tablet, @mobile)`
- `.stack-mobile()` - Passe en flex-direction: column sur mobile
- `.full-width-mobile()` - 100% width sur mobile

### JavaScript : useDeviceBreakpoint

Pour la logique conditionnelle (v-if), utiliser le composable :

```typescript
import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'

const { isMobile, isTablet, isDesktop, currentBreakpoint } = useDeviceBreakpoint()
```

### Quand utiliser quoi ?

| Cas d'usage | Solution |
|-------------|----------|
| Ajuster padding, font-size, gap | Mixins LESS (`.respond-mobile()`) |
| Réorganiser un layout (grid/flex) | Mixins LESS |
| Masquer/afficher un élément complet | `v-if="isMobile"` ou classes `.hide-*` |
| Charger un composant différent | `v-if` avec `useDeviceBreakpoint()` |
| Grid responsive (colonnes) | Classes `.col-*`, `.col-md-*`, `.col-sm-*` |
