<template>
  <nav v-if="breadcrumbs.length > 1" aria-label="breadcrumb" class="app-breadcrumbs">
    <ol class="breadcrumbs-list">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="crumb.path" 
        class="breadcrumb-item"
        :class="{ 'is-active': index === breadcrumbs.length - 1 }"
      >
        <RouterLink 
          v-if="index < breadcrumbs.length - 1" 
          :to="{ path: crumb.path, query: crumb.query }"
          class="breadcrumb-link"
        >
          {{ crumb.label }}
        </RouterLink>
        <BasicText v-else size="body-m" color="neutral-900" weight="semibold">
          {{ crumb.label }}
        </BasicText>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasicText from '@designSystem/components/basic/text/BasicText.vue';

interface BreadcrumbItem {
  path: string;
  label: string;
  query?: Record<string, any>;
}

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matchedRoutes = route.matched;
  const crumbs: BreadcrumbItem[] = [];

  matchedRoutes.forEach((match, index) => {
    const meta = match.meta;
    
    // 1. Détermine le libellé (Label)
    let label = '';
    if (meta.breadcrumbLabel) {
      // Cas 1: Fonction pour générer le libellé (ex: pour product-detail)
      if (typeof meta.breadcrumbLabel === 'function') {
        label = meta.breadcrumbLabel(route);
      } else {
        // Cas 2: Libellé statique
        label = meta.breadcrumbLabel as string;
      }
    } else if (meta.label) {
      // Fallback vers le label de navigation standard
      label = meta.label as string;
    } else {
      // Si aucun label n'est défini, on ignore souvent l'étape (ou on utilise le nom de la route)
      return; 
    }
    
    // 2. Détermine le chemin
    // S'assurer que le chemin est correct, surtout pour les routes dynamiques
    let path = match.path;
    
    // Si c'est le dernier élément (la page actuelle), utilise le chemin complet avec les paramètres.
    if (index === matchedRoutes.length - 1) {
        path = route.fullPath;
    } else {
        // Pour les parents, on utilise le chemin statique si possible.
        // Si la route est paramétrée (ex: /catalogue/:id), on ne peut pas simplement utiliser match.path.
        // On construit le chemin jusqu'à cette route, en utilisant les params accumulés.
        try {
            path = router.resolve({ name: match.name, params: route.params, query: route.query }).fullPath;
        } catch {
             // Fallback si la résolution échoue (route non finale)
             path = match.path;
        }
    }


    crumbs.push({
      path: path,
      label: label,
      query: index === matchedRoutes.length - 1 ? route.query : undefined,
    });
  });

  return crumbs.filter(crumb => crumb.label); // Filtre si le label est vide
});
</script>

<style scoped lang="less">
  .app-breadcrumbs {
    // Style de base pour le conteneur du fil d'Ariane
  }

  .breadcrumbs-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: @neutral-600; /* Couleur par défaut */
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;

    &:not(:last-child)::after {
      content: ' / '; /* Séparateur */
      margin: 0 8px;
      color: @neutral-300;
    }
  }
  
  .breadcrumb-link {
    text-decoration: none;
    color: @primary-600; /* Couleur des liens cliquables */
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: @primary-800;
      text-decoration: underline;
    }
  }

  .is-active .BasicText {
    color: @neutral-900 !important; /* Couleur de la page actuelle (non cliquable) */
    font-weight: 600;
  }
</style>