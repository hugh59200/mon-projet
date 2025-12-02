# Configuration SEO

> **📅 Migration du domaine - 2025-12-02**
>
> Le domaine a été migré de `atlaslabsolutions.com` vers `fast-peptides.com`.
> Cette configuration centralisée permet de gérer le domaine via une variable d'environnement unique.
>
> **15 fichiers** ont été mis à jour lors de la migration initiale, et désormais tous les nouveaux fichiers
> utilisent cette configuration pour éviter le hardcoding des URLs.

## Variable d'environnement

La variable `VITE_APP_URL` doit être définie dans `.env` et `.env.local` :

```bash
VITE_APP_URL=https://fast-peptides.com
```

## Utilisation

### Import de la configuration

```typescript
import { SEO_CONFIG, getCanonicalUrl, getOgUrl } from '@/config/seo'
```

### Exemple dans un composant Vue

```vue
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'

useHead({
  title: 'Mon Titre - Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content: 'Ma description SEO...',
    },
    {
      name: 'author',
      content: SEO_CONFIG.AUTHOR, // "Atlas Lab Solutions LLC"
    },
    {
      property: 'og:site_name',
      content: SEO_CONFIG.SITE_NAME, // "Atlas Lab Solutions"
    },
    {
      property: 'og:image',
      content: SEO_CONFIG.DEFAULT_OG_IMAGE,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: getCanonicalUrl('/ma-page'), // https://fast-peptides.com/ma-page
    },
  ],
})
</script>
```

### Exemple avec computed pour URLs dynamiques

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { getCanonicalUrl } from '@/config/seo'

const route = useRoute()

useHead({
  title: 'Produit',
  link: [
    {
      rel: 'canonical',
      href: computed(() => getCanonicalUrl(`/catalogue/${route.params.id}`)),
    },
  ],
})
</script>
```

## Avantages

✅ **Centralisé** : Un seul endroit pour modifier l'URL de base
✅ **Type-safe** : Configuration typée avec TypeScript
✅ **Flexible** : Supporte les environnements dev/staging/prod
✅ **DRY** : Évite la duplication du domaine dans tous les fichiers
✅ **Maintenable** : Changement de domaine en un seul endroit (.env)

## Configuration

Toutes les constantes SEO sont définies dans `src/config/seo.ts` :

- `APP_URL` : URL de base de l'application
- `SITE_NAME` : Nom du site
- `AUTHOR` : Auteur (OPSEC compliant)
- `LANG` : Langue du site
- `DEFAULT_OG_IMAGE` : Image par défaut pour Open Graph

## Fonctions utilitaires

### `getCanonicalUrl(path: string): string`

Génère une URL canonique complète.

```typescript
getCanonicalUrl('/catalogue') // https://fast-peptides.com/catalogue
getCanonicalUrl('catalogue')  // https://fast-peptides.com/catalogue (auto-ajout du /)
```

### `getOgUrl(path: string): string`

Alias de `getCanonicalUrl` pour les URLs Open Graph.

```typescript
getOgUrl('/actualites/mon-article') // https://fast-peptides.com/actualites/mon-article
```
