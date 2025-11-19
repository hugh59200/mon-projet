<template>
  <div
    class="catalogue"
    v-responsive-animate.fade.once
  >
    <header
      class="catalogue__header"
      v-responsive-animate.slide.once
    >
      <div
        class="catalogue__title-wrapper"
        v-motion="{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, delay: 100 } },
        }"
      >
        <BasicText
          size="h1"
          weight="bold"
          class="catalogue__title"
        >
          Notre
          <span>catalogue</span>
        </BasicText>

        <div class="catalogue__subtitle">
          Découvrez l’ensemble de nos peptides & produits disponibles ⚗️
        </div>
      </div>

      <div
        v-if="isMobile"
        class="catalogue__mobile-controls"
      >
        <WrapperInput
          v-model="searchTerm"
          placeholder="Rechercher..."
          icon-left="search"
          size="small"
          class="catalogue__search-input"
        />
        <WrapperButton
          button-label="Filtres"
          type="primary"
          variant="outlined"
          size="small"
          icon-left="SlidersHorizontal"
          @click="showFilters = true"
          aria-controls="mobile-filter-modal"
        />
      </div>
    </header>

    <div class="catalogue__body">
      <aside
        v-if="!isMobile"
        class="catalogue__filters"
        aria-label="Panneau de filtres du catalogue"
      >
        <FilterPanel
          :all-open="allOpen"
          v-model:filterOpen="filterOpen"
          v-model:priceRange="priceRange"
          v-model:selectedCategories="selectedCategories"
          v-model:inStockOnly="inStockOnly"
          v-model:selectedTags="selectedTags"
          :categoryItems="categoryItemsWithCounts"
          :stockCount="stockCount"
          :tagItems="tagItemsWithCounts"
          :tags="allTags"
          @toggleAll="toggleAll"
          @resetAll="resetAll"
          @toggleTag="toggleTag"
        />
      </aside>

      <section
        class="catalogue__list"
        aria-live="polite"
      >
        <div class="catalogue__list-controls">
          <WrapperInput
            v-if="!isMobile"
            v-model="searchTerm"
            placeholder="Rechercher..."
            icon-left="search"
            size="small"
            class="catalogue__search-input-desktop"
          />
          <WrapperDropdown
            v-model="sortBy"
            :items="sortItems"
            force-value
            size="small"
            aria-label="Trier les produits par"
            class="catalogue__sort-dropdown"
          />
        </div>
        <BasicText
          v-if="hasLoaded"
          color="neutral-100"
        >
          {{ filteredProducts.length }} résultat{{ filteredProducts.length > 1 ? 's' : '' }}
        </BasicText>

        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && filteredProducts.length === 0"
          message="Chargement du catalogue..."
          empty-message="Aucun produit trouvé avec ces filtres. Essayez de réinitialiser ou d'ajuster vos critères."
        >
          <div
            v-if="filteredProducts.length"
            class="catalogue__grid"
            v-responsive-animate.zoom.scroll.stagger="{ delay: 90, speed: 600 }"
          >
            <ProductCart
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              @view="viewProduct"
              @add="addToCart"
            />
          </div>

          <div
            v-if="nbPages > 1"
            class="catalogue__pagination-bottom"
            aria-label="Navigation entre les pages du catalogue"
          >
            <BasicPagination
              :current-page="page"
              :nb-pages="nbPages"
              :nb-pages-max="7"
              @change="(p: number) => (page = p)"
            />
          </div>
        </WrapperLoader>
      </section>
    </div>

    <ModalComponent
      id="mobile-filter-modal"
      v-model="showFilters"
      closable
      size="small"
      title="Filtres"
    >
      <template #content>
        <FilterPanel
          :all-open="allOpen"
          v-model:filterOpen="filterOpen"
          v-model:priceRange="priceRange"
          v-model:selectedCategories="selectedCategories"
          v-model:inStockOnly="inStockOnly"
          v-model:selectedTags="selectedTags"
          :categoryItems="categoryItemsWithCounts"
          :stockCount="stockCount"
          :tagItems="tagItemsWithCounts"
          :tags="allTags"
          @toggleAll="toggleAll"
          @resetAll="resetAll"
          @toggleTag="toggleTag"
        />
      </template>
      <template #actions>
        <div
          class="justify-content-center flex"
          style="width: 100%"
        >
          <BasicButton
            label="Réinitialiser les Filtres"
            type="secondary"
            variant="outlined"
            @click="resetAll"
            style="margin-right: 10px"
          />
          <BasicButton
            label="Voir les produits (Fermer)"
            type="primary"
            block
            @click="showFilters = false"
          />
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
  import ProductCart from '@/features/catalogue/cart/ProductCart.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useFilters } from '@/features/catalogue/composables/useFilters'
  import { useFilterSections } from '@/features/catalogue/composables/useFilterSections'
  import { usePagination } from '@/features/catalogue/composables/usePagination'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import type { Products } from '@/supabase/types/supabase.types'
  import { BasicButton } from '@designSystem/components/basic/button' // Import manquant
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, watch } from 'vue' // Ajout de watch
  import { useRoute, useRouter } from 'vue-router'
  import { useProductsStore } from './composables/useProducts'
  import FilterPanel from './FilterPanel.vue'

  // --- Stores et Composables ---
  const productsStore = useProductsStore()
  const { products, priceRange, hasLoaded, loading } = storeToRefs(productsStore)
  const { load } = productsStore
  const route = useRoute()
  const { isMobile } = useDeviceBreakpoint()
  const router = useRouter()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast()

  const catalogueListRef = ref<HTMLElement | null>(null) // Référence pour le défilement

  // --- Logique des Filtres ---
  const {
    selectedCategories,
    inStockOnly,
    selectedTags,
    allTags,
    tagItemsWithCounts,
    categoryItemsWithCounts,
    stockCount,
    filteredProducts,
    toggleTag,
  } = useFilters(products, priceRange)

  // --- Logique de Pagination et Tri ---
  const { searchTerm, sortBy, sortItems, page, paginatedProducts, nbPages } =
    usePagination(filteredProducts)

  // --- Logique d'affichage des sections de filtres ---
  const { filterOpen, allOpen, toggleAll } = useFilterSections()

  // --- État Local ---
  const showFilters = ref(false) // Pour la modale de filtres mobile

  // --- Fonctions Utilitaires ---

  /**
   * Réinitialise tous les filtres à leur état par défaut.
   */
  function resetAll() {
    selectedCategories.value = []
    inStockOnly.value = false
    selectedTags.value = []

    // Réinitialisation de la plage de prix à min/max
    priceRange.value = {
      ...priceRange.value,
      from: priceRange.value.min,
      to: priceRange.value.max,
    }

    // Réinitialisation de la page et du tri
    page.value = 1
    sortBy.value = 'default'
    searchTerm.value = '' // Ajout pour réinitialiser la recherche
  }

  /**
   * Redirige vers la page de détail du produit.
   */
  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }

  /**
   * Ajoute un produit au panier et affiche une notification.
   */
  function addToCart(p: Products) {
    cart.addToCart(p)
    showAddToCartToast(p)
  }

  /**
   * Fait défiler jusqu'au haut de la liste de produits.
   * Utile après un changement de page ou l'application de filtres.
   */
  function scrollToProductList() {
    const listElement = document.querySelector('.catalogue__list')
    if (listElement) {
      // Utiliser la fonction scrollIntoView pour un défilement doux
      listElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // --- Lifecycle Hooks et Watchers ---

  onMounted(async () => {
    load()

    // Gestion du tag initial depuis l'URL (si présent)
    const initialTag = typeof route.query.tag === 'string' ? route.query.tag : null
    if (initialTag) {
      selectedTags.value = [initialTag]
    }

    // Mise à jour du titre pour le SEO
    document.title = 'Catalogue de Peptides – Fast Peptides'
  })

  // 💡 UX Amélioration : Réinitialiser la page et remonter lors du changement de filtre/tri/recherche.
  watch(
    [selectedCategories, inStockOnly, selectedTags, priceRange, sortBy, searchTerm],
    () => {
      // Si la modification vient d'un filtre/tri/recherche, revenir à la première page
      page.value = 1
      // Après un filtrage, on peut remonter l'utilisateur au début de la liste
      scrollToProductList()
    },
    { deep: true }, // Utilisation de deep pour les objets (priceRange) et tableaux
  )

  // 💡 UX Amélioration : Remonter l'utilisateur au début de la liste lors du changement de page.
  watch(page, () => {
    scrollToProductList()
  })

  // 💡 SEO/Partage : Optionnel - mettre à jour l'URL avec les filtres sélectionnés (décommenter si nécessaire)
  /*
watch([selectedCategories, inStockOnly, selectedTags, sortBy, searchTerm, page], () => {
  router.replace({
    query: {
      ...route.query,
      categories: selectedCategories.value.join(','),
      inStock: inStockOnly.value || undefined,
      tags: selectedTags.value.join(','),
      sort: sortBy.value !== 'default' ? sortBy.value : undefined,
      search: searchTerm.value || undefined,
      page: page.value > 1 ? page.value : undefined,
    }
  }).catch(() => {}) // Catch pour éviter les erreurs de navigation redondante
}, { deep: true, immediate: false })
*/
</script>
<style scoped lang="less">
  .catalogue {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 26px 0;
    opacity: 0;
    animation: fadeInPage 0.8s ease forwards;

    // Animation de chargement initial (conservée)
    @keyframes fadeInPage {
      to {
        opacity: 1;
      }
    }

    // --- Titre et En-tête ---
    &__title-wrapper {
      text-align: center;
      margin-bottom: 10px;
    }

    &__title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: @neutral-100;
      margin-bottom: 6px;

      span {
        background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-300;
      opacity: 0.85;
    }

    &__header {
      border-radius: 16px;
      padding: 20px 26px;
      display: flex;
      flex-direction: column;
      gap: 18px;

      background: rgba(var(--secondary-900-rgb), 0.85);
      border: 1px solid color-mix(in srgb, @neutral-300 25%, transparent);

      box-shadow:
        0 8px 28px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 12%);
      transition: all 0.25s ease;
    }

    // Contrôles mobiles de recherche/filtres
    &__mobile-controls {
      display: none; // Caché par défaut (Desktop)
    }

    &__search-input {
      flex-grow: 1;
      min-width: 120px;
    }

    // --- Corps (Filtres + Liste) ---
    &__body {
      display: flex;
      width: 100%;
      gap: 28px;
      justify-content: center;
    }

    &__filters {
      width: 260px;
      flex-shrink: 0;

      background: rgba(var(--secondary-900-rgb), 0.9);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      padding: 22px 18px;
      border-radius: 16px;
      border: 1px solid color-mix(in srgb, @neutral-300 26%, transparent);
      box-shadow:
        0 10px 30px fade(#000, 40%),
        inset 0 0 0 1px fade(@white, 10%);
      overflow-y: auto;
      transition: background 0.25s ease;

      :deep(.FilterPanel__head .BasicText) {
        color: @neutral-50 !important;
      }

      :deep(.FilterSection__content .BasicText) {
        color: @neutral-100 !important;
      }
    }

    &__list {
      flex: 1;
      min-height: 500px;

      background: rgba(var(--secondary-900-rgb), 0.9);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid color-mix(in srgb, @neutral-300 25%, transparent);
      padding: 26px;
      border-radius: 16px;
      box-shadow:
        0 12px 30px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 15%);

      display: flex;
      flex-direction: column;
      gap: 22px;

      .BasicText {
        color: @neutral-100 !important;
      }
    }

    // CONTROLE DE LISTE (Desktop) : Recherche à gauche, Tri à droite
    &__list-controls {
      display: flex;
      justify-content: space-between; // Aligner les deux extrémités
      align-items: center;
      gap: 18px;
      margin-bottom: 4px;

      .catalogue__search-input-desktop {
        flex-grow: 1; // Prend un maximum d'espace
        max-width: 450px; // Limite maximale pour la recherche
      }

      .catalogue__sort-dropdown {
        width: 200px; // Taille définie (plus petit que la recherche)
        flex-shrink: 0;
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 38px 26px;
      justify-items: stretch;
      align-items: stretch;
      padding-bottom: 20px;
    }

    &__pagination-bottom {
      display: flex;
      justify-content: center;

      .BasicPagination {
        background: fade(@white, 12%);
        backdrop-filter: blur(10px);
        padding: 10px 18px;
        border-radius: 12px;

        border: 1px solid color-mix(in srgb, @neutral-300 25%, transparent);
        box-shadow: 0 6px 18px fade(#000, 35%);
      }
    }

    // --- Media Queries ---
    @media (max-width: 1100px) {
      .catalogue__grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 30px 20px;
      }
    }

    @media (max-width: 900px) {
      .catalogue__body {
        flex-direction: column;
        gap: 20px;
      }

      .catalogue__filters {
        display: none; // Les filtres desktop sont cachés
      }

      .catalogue__list {
        order: 1;
      }

      // Contrôles sur mobile : Recherche et Tri sont alignés verticalement
      .catalogue__list-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;

        .catalogue__sort-dropdown,
        .catalogue__search-input-desktop {
          width: 100%; // Pleine largeur
          max-width: unset; // Annuler la limite desktop
        }
      }

      .catalogue__search-input-desktop {
        display: none; // Cache la recherche Desktop pour ne laisser que la version mobile dans le header
      }

      .catalogue__mobile-controls {
        display: flex; // Affiché uniquement sur mobile (recherche + bouton filtre)
        gap: 12px;
      }

      .catalogue__title {
        font-size: 32px;
      }
    }

    @media (max-width: 600px) {
      .catalogue__header {
        padding: 16px;
      }

      .catalogue__mobile-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .catalogue__list-controls {
        // Sur mobile, l'ordre est déjà géré par le flex-direction: column
        // Mais s'assurer que le tri et la recherche suivent les mêmes règles de largeur.
      }

      .catalogue__grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        justify-content: center;
      }
    }
  }
</style>
