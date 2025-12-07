<template>
  <Teleport to="body">
    <Transition name="dock-slide">
      <aside
        v-if="shouldShow"
        ref="dockRef"
        :class="[
          'catalogue-dock',
          {
            'catalogue-dock--expanded': isExpanded,
            'catalogue-dock--collapsed': !isExpanded,
          },
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @focusin="handleMouseEnter"
        @focusout="handleMouseLeave"
      >
        <!-- Barre rétractée -->
        <div class="catalogue-dock__trigger">
          <button
            class="catalogue-dock__toggle"
            :aria-expanded="isExpanded"
            aria-controls="catalogue-dock-panel"
            @click="toggleExpanded"
          >
            <span class="catalogue-dock__icon-wrapper">
              <BasicIconNext
                name="Package"
                :size="20"
                class="catalogue-dock__icon"
              />
            </span>
            <span class="catalogue-dock__label">Catalogue</span>
          </button>

          <!-- Badge panier -->
          <Transition name="badge-pop">
            <div
              v-if="cartItemCount > 0"
              class="catalogue-dock__cart-badge"
            >
              {{ cartItemCount > 99 ? '99+' : cartItemCount }}
            </div>
          </Transition>
        </div>

        <!-- Panel expandé -->
        <Transition name="panel-expand">
          <nav
            v-show="isExpanded"
            id="catalogue-dock-panel"
            class="catalogue-dock__panel"
            aria-label="Navigation catalogue rapide"
          >
            <div class="catalogue-dock__header">
              <span class="catalogue-dock__title">Accès rapide</span>
              <PremiumButton
                type="secondary"
                variant="ghost"
                size="sm"
                icon-left="ChevronLeft"
                class="catalogue-dock__close"
                @click="collapse"
              />
            </div>

            <ul class="catalogue-dock__categories">
              <li
                v-for="(category, index) in categories"
                :key="category.key"
                class="catalogue-dock__item"
                :style="{ '--item-delay': `${index * 0.05}s` }"
              >
                <RouterLink
                  :to="`/catalogue?categories=${encodeURIComponent(category.key)}`"
                  class="catalogue-dock__link"
                  :style="{ '--category-color': category.color }"
                  @click="handleNavigation"
                >
                  <span class="catalogue-dock__item-icon">
                    <span class="catalogue-dock__item-dot" />
                  </span>
                  <span class="catalogue-dock__item-label">{{ category.name }}</span>
                  <span
                    v-if="category.count"
                    class="catalogue-dock__item-count"
                  >
                    {{ category.count }}
                  </span>
                </RouterLink>
              </li>
            </ul>

            <div class="catalogue-dock__divider" />

            <div class="catalogue-dock__actions">
              <RouterLink
                to="/catalogue"
                class="catalogue-dock__action catalogue-dock__action--primary"
                @click="handleNavigation"
              >
                <BasicIconNext
                  name="LayoutGrid"
                  :size="18"
                />
                <span>Tout le catalogue</span>
              </RouterLink>

              <RouterLink
                to="/panier"
                class="catalogue-dock__action"
                @click="handleNavigation"
              >
                <BasicIconNext
                  name="ShoppingBag"
                  :size="18"
                />
                <span>Mon panier</span>
                <span
                  v-if="cartItemCount > 0"
                  class="catalogue-dock__action-badge"
                >
                  {{ cartItemCount }}
                </span>
              </RouterLink>

              <RouterLink
                to="/guide-reconstitution"
                class="catalogue-dock__action"
                @click="handleNavigation"
              >
                <BasicIconNext
                  name="FileText"
                  :size="18"
                />
                <span>Calculateur</span>
              </RouterLink>
            </div>

            <div class="catalogue-dock__gradient-deco" />
          </nav>
        </Transition>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { getTranslated } from '@/composables/useTranslated'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  interface Props {
    autoCollapseDelay?: number
    allowedRoutes?: string[] // Routes où le dock PEUT s'afficher
    headerSelector?: string // Sélecteur CSS du header à observer
    footerSelector?: string // Sélecteur CSS du footer à observer
  }

  const props = withDefaults(defineProps<Props>(), {
    autoCollapseDelay: 3000,
    // 🆕 Liste blanche : le dock n'apparaît QUE sur ces routes
    allowedRoutes: () => ['/', '/actualites', '/faq', '/cgu', '/guide-reconstitution'],
    headerSelector: '.navbar',
    footerSelector: '.footer',
  })

  // ═══════════════════════════════════════════════════════════════
  // STORES & COMPOSABLES
  // ═══════════════════════════════════════════════════════════════

  const route = useRoute()
  const cartStore = useCartStore()
  const productsStore = useProductsStore()
  const { isMobile } = useDeviceBreakpoint()
  const { locale } = useI18n()

  const { products } = storeToRefs(productsStore)

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════

  const dockRef = ref<HTMLElement | null>(null)
  const isExpanded = ref(false)
  const isHovering = ref(false)
  const collapseTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

  // 🆕 IntersectionObserver state
  const isHeaderVisible = ref(true)
  const isFooterVisible = ref(false)
  const headerObserver = ref<IntersectionObserver | null>(null)
  const footerObserver = ref<IntersectionObserver | null>(null)

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════

  const cartItemCount = computed(() => cartStore.items.length)

  const isRouteAllowed = computed(() => {
    // 🆕 Liste blanche : vérifier si la route actuelle est autorisée
    return props.allowedRoutes.some((r) => {
      // Match exact pour '/' ou prefix pour les autres
      if (r === '/') return route.path === '/'
      return route.path.startsWith(r)
    })
  })

  // 🆕 Condition finale d'affichage
  const shouldShow = computed(() => {
    // Ne pas afficher sur mobile
    if (isMobile.value) return false

    // Ne jamais afficher sur les pages auth (pleine page)
    if (route.path.startsWith('/auth')) return false

    // Ne pas afficher sur les routes exclues
    if (!isRouteAllowed.value) return false

    // 🆕 Ne pas afficher si le header est visible
    if (isHeaderVisible.value) return false

    // 🆕 Ne pas afficher si le footer est visible
    if (isFooterVisible.value) return false

    return true
  })

  // Catégories dynamiques basées sur les produits
  const categories = computed(() => {
    const categoryMap = new Map<string, { count: number; i18n: unknown }>()

    products.value.forEach((product) => {
      if (product.category) {
        const existing = categoryMap.get(product.category)
        if (existing) {
          existing.count++
        } else {
          categoryMap.set(product.category, { count: 1, i18n: product.category_i18n })
        }
      }
    })

    // Mapping des couleurs par catégorie (clés en français)
    const colorMap: Record<string, string> = {
      Récupération: '#10B981',
      'Perte de poids': '#F59E0B',
      Croissance: '#3B82F6',
      'Anti-âge': '#8B5CF6',
      Performance: '#EF4444',
      'Bien-être': '#EC4899',
      Hormonal: '#6366F1',
      Nootropique: '#14B8A6',
      Cosmétique: '#F472B6',
      Santé: '#22C55E',
    }

    return Array.from(categoryMap.entries())
      .map(([categoryKey, data]) => ({
        name: getTranslated(data.i18n as any, categoryKey, locale.value), // Nom traduit pour l'affichage
        key: categoryKey, // Clé originale (français) pour le filtrage
        color: colorMap[categoryKey] || '#a67c5b',
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
  })

  // ═══════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
    if (isExpanded.value) {
      startCollapseTimer()
    }
  }

  function collapse() {
    isExpanded.value = false
    cancelCollapseTimer()
  }

  function handleMouseEnter() {
    isHovering.value = true
    // 🆕 Ne plus expand au hover, seulement annuler le timer de collapse
    if (isExpanded.value) {
      cancelCollapseTimer()
    }
  }

  function handleMouseLeave() {
    isHovering.value = false
    // 🆕 Démarrer le timer de collapse seulement si expanded
    if (isExpanded.value) {
      startCollapseTimer()
    }
  }

  function startCollapseTimer() {
    cancelCollapseTimer()
    collapseTimeout.value = setTimeout(() => {
      if (!isHovering.value) {
        collapse()
      }
    }, props.autoCollapseDelay)
  }

  function cancelCollapseTimer() {
    if (collapseTimeout.value) {
      clearTimeout(collapseTimeout.value)
      collapseTimeout.value = null
    }
  }

  function handleNavigation() {
    collapse()
  }

  // 🆕 Setup IntersectionObserver pour le header
  function setupHeaderObserver() {
    // Ne pas observer sur les pages auth ou routes non autorisées
    if (route.path.startsWith('/auth') || !isRouteAllowed.value) {
      isHeaderVisible.value = true // Masque le dock
      return
    }

    const header = document.querySelector(props.headerSelector)

    if (!header) {
      // Log silencieux en dev uniquement
      if (import.meta.env.DEV) {
        console.debug(`[CatalogueDock] Header "${props.headerSelector}" non trouvé sur cette page`)
      }
      isHeaderVisible.value = false
      return
    }

    headerObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Le header est considéré "visible" si au moins 50% est dans le viewport
          isHeaderVisible.value = entry.isIntersecting
        })
      },
      {
        // Observer quand le header quitte le viewport par le haut
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.5, // 50% du header visible
      },
    )

    headerObserver.value.observe(header)
  }

  function cleanupHeaderObserver() {
    if (headerObserver.value) {
      headerObserver.value.disconnect()
      headerObserver.value = null
    }
  }

  // 🆕 Setup IntersectionObserver pour le footer
  function setupFooterObserver() {
    // Ne pas observer sur les pages auth ou routes non autorisées
    if (route.path.startsWith('/auth') || !isRouteAllowed.value) {
      isFooterVisible.value = false
      return
    }

    const footer = document.querySelector(props.footerSelector)

    if (!footer) {
      // Log silencieux en dev uniquement
      if (import.meta.env.DEV) {
        console.debug(`[CatalogueDock] Footer "${props.footerSelector}" non trouvé sur cette page`)
      }
      isFooterVisible.value = false
      return
    }

    footerObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Le footer est considéré "visible" si au moins un pixel est dans le viewport
          isFooterVisible.value = entry.isIntersecting
        })
      },
      {
        rootMargin: '0px 0px 0px 0px',
        threshold: 0, // Dès qu'un pixel est visible
      },
    )

    footerObserver.value.observe(footer)
  }

  function cleanupFooterObserver() {
    if (footerObserver.value) {
      footerObserver.value.disconnect()
      footerObserver.value = null
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

  onMounted(() => {
    // Charger les produits si pas encore fait
    if (products.value.length === 0) {
      productsStore.load()
    }

    // 🆕 Setup les observers après un petit délai (laisser le DOM se stabiliser)
    setTimeout(() => {
      setupHeaderObserver()
      setupFooterObserver()
    }, 100)
  })

  onUnmounted(() => {
    cancelCollapseTimer()
    cleanupHeaderObserver()
    cleanupFooterObserver()
  })

  // Reset on route change
  watch(
    () => route.path,
    () => {
      collapse()
      // Re-setup les observers en cas de changement de layout
      cleanupHeaderObserver()
      cleanupFooterObserver()
      setTimeout(() => {
        setupHeaderObserver()
        setupFooterObserver()
      }, 100)
    },
  )
</script>

<style scoped lang="less">
  // ═══════════════════════════════════════════════════════════════
  // VARIABLES
  // ═══════════════════════════════════════════════════════════════

  @dock-bg: rgba(30, 41, 59, 0.97);
  @dock-border: rgba(255, 255, 255, 0.08);
  @dock-accent: var(--primary-700);
  @dock-accent-light: var(--primary-500);
  @dock-text: @neutral-100;
  @dock-text-muted: @neutral-500;
  @dock-collapsed-width: 52px;
  @dock-expanded-width: 260px;
  @dock-transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  // ═══════════════════════════════════════════════════════════════
  // DOCK CONTAINER (BEM imbriqué)
  // ═══════════════════════════════════════════════════════════════

  .catalogue-dock {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1050;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background: @dock-bg;
    backdrop-filter: blur(20px) saturate(1.2);
    -webkit-backdrop-filter: blur(20px) saturate(1.2);
    border-radius: 0 16px 16px 0;
    border: 1px solid @dock-border;
    border-left: none;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition:
      width @dock-transition,
      box-shadow @dock-transition;
    overflow: hidden;

    // Modificateurs
    &--collapsed {
      width: @dock-collapsed-width;
    }

    &--expanded {
      width: @dock-expanded-width;
      box-shadow:
        0 12px 48px rgba(0, 0, 0, 0.4),
        0 4px 16px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    // ═══════════════════════════════════════════════════════════════
    // TRIGGER
    // ═══════════════════════════════════════════════════════════════

    &__trigger {
      position: relative;
      width: @dock-collapsed-width;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px 0;
      gap: 10px;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 20%;
        height: 60%;
        width: 1px;
        background: linear-gradient(
          180deg,
          transparent 0%,
          @dock-border 20%,
          @dock-accent 50%,
          @dock-border 80%,
          transparent 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;

        .catalogue-dock--expanded & {
          opacity: 1;
        }
      }
    }

    &__toggle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: @dock-text;
      transition: all 0.25s ease;
      border-radius: 8px;

      &:hover {
        background: rgba(255, 255, 255, 0.06);

        .catalogue-dock__icon-wrapper {
          border-color: @dock-accent;
        }
      }

      &:focus-visible {
        outline: 2px solid @dock-accent;
        outline-offset: 2px;
      }
    }

    &__icon-wrapper {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid @dock-border;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      transition: all 0.3s ease;
    }

    &__icon {
      width: 18px;
      height: 18px;
      color: @dock-accent;
    }

    &__label {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: @dock-text-muted;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
    }

    &__cart-badge {
      position: absolute;
      top: 8px;
      right: 6px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background: @dock-accent;
      color: white;
      font-size: 10px;
      font-weight: 700;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(@dock-accent, 0.4);
      animation: badge-pulse 2s ease-in-out infinite;
    }

    // ═══════════════════════════════════════════════════════════════
    // PANEL
    // ═══════════════════════════════════════════════════════════════

    &__panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px 16px 16px 8px;
      overflow: hidden;
      position: relative;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid @dock-border;
    }

    &__title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: @dock-accent-light;
    }

    &__close {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      color: @dock-text-muted;
      border-radius: 6px;
      transition: all 0.2s ease;

      svg {
        width: 14px;
        height: 14px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: @dock-text;
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // CATEGORIES
    // ═══════════════════════════════════════════════════════════════

    &__categories {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 280px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
      }
    }

    &__item {
      opacity: 0;
      transform: translateX(-10px);
      animation: item-appear 0.3s ease forwards;
      animation-delay: var(--item-delay, 0s);
    }

    &__link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      text-decoration: none;
      color: @dock-text;
      transition: all 0.2s ease;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%) scaleY(0);
        width: 3px;
        height: 60%;
        background: var(--category-color, @dock-accent);
        border-radius: 0 2px 2px 0;
        transition: transform 0.2s ease;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.06);

        &::before {
          transform: translateY(-50%) scaleY(1);
        }
      }

      &.router-link-active {
        background: rgba(255, 255, 255, 0.08);

        &::before {
          transform: translateY(-50%) scaleY(1);
        }
      }
    }

    &__item-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.04);
      transition: all 0.25s ease;
      flex-shrink: 0;
    }

    &__item-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--category-color, @dock-accent);
    }

    &__item-label {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__item-count {
      font-size: 11px;
      font-weight: 600;
      color: @dock-text-muted;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 10px;
    }

    // ═══════════════════════════════════════════════════════════════
    // DIVIDER & ACTIONS
    // ═══════════════════════════════════════════════════════════════

    &__divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, @dock-border 50%, transparent 100%);
      margin: 16px 0;
    }

    &__actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__action {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      text-decoration: none;
      color: @dock-text-muted;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;

      svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: @dock-text;
      }

      &--primary {
        background: rgba(@dock-accent, 0.12);
        color: @dock-accent-light;
        border: 1px solid rgba(@dock-accent, 0.2);

        &:hover {
          background: rgba(@dock-accent, 0.2);
          border-color: rgba(@dock-accent, 0.35);
        }
      }
    }

    &__action-badge {
      margin-left: auto;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background: @dock-accent;
      color: white;
      font-size: 11px;
      font-weight: 700;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // ═══════════════════════════════════════════════════════════════
    // GRADIENT DECO
    // ═══════════════════════════════════════════════════════════════

    &__gradient-deco {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: linear-gradient(180deg, transparent 0%, rgba(@dock-accent, 0.05) 100%);
      pointer-events: none;
      border-radius: 0 0 16px 0;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // KEYFRAMES
  // ═══════════════════════════════════════════════════════════════

  @keyframes badge-pulse {
    0%, 50%, 100% {
      transform: scale(1);
    }
  }

  @keyframes item-appear {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TRANSITIONS (Vue)
  // ═══════════════════════════════════════════════════════════════

  .dock-slide-enter-active,
  .dock-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dock-slide-enter-from,
  .dock-slide-leave-to {
    opacity: 0;
    transform: translateX(-100%) translateY(-50%);
  }

  .panel-expand-enter-active,
  .panel-expand-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .panel-expand-enter-from,
  .panel-expand-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }

  .badge-pop-enter-active,
  .badge-pop-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .badge-pop-enter-from,
  .badge-pop-leave-to {
    opacity: 0;
    transform: scale(0);
  }
</style>
