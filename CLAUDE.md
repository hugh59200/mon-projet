# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler avec ce dépôt.

## Langue

Toujours répondre en français.

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
