<template>
  <div class="faq">
    <!-- Header via PageHeader -->
    <PageHeader>
      <template #stats>
        <div class="stat">
          <span class="stat__value">{{ faqs.length }}</span>
          <span class="stat__label">{{ t('faq.title') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat__value">{{ categories.length }}</span>
          <span class="stat__label">{{ t('faq.categories.all') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat__value">24h</span>
          <span class="stat__label">Support</span>
        </div>
      </template>
    </PageHeader>

    <PageContent size="lg">
      <!-- Main Layout -->
      <div class="faq__layout">
        <!-- Sidebar -->
        <aside class="faq__sidebar">
          <div class="faq__sidebar-card">
            <!-- Search -->
            <div class="faq__search">
              <div class="faq__search-icon">
                <BasicIconNext name="Search" :size="18" />
              </div>
              <input
                v-model="search"
                type="text"
                class="faq__search-input"
                :placeholder="t('faq.searchPlaceholder')"
                @input="onSearch"
              />
              <PremiumButton
                v-if="search"
                type="secondary"
                variant="ghost"
                size="xs"
                icon-left="X"
                class="faq__search-clear"
                @click="search = ''"
              />
            </div>

            <!-- Categories -->
            <div class="faq__categories">
              <span class="faq__categories-title">{{ t('faq.categories.all') }}</span>

              <button
                class="faq__category"
                :class="{ 'faq__category--active': selectedCategory === 'all' }"
                @click="selectedCategory = 'all'"
              >
                <div class="faq__category-icon">
                  <BasicIconNext name="LayoutGrid" :size="18" />
                </div>
                <span class="faq__category-label">{{ t('faq.categories.all') }}</span>
                <span class="faq__category-count">{{ faqs.length }}</span>
              </button>

              <button
                v-for="cat in categories"
                :key="cat.id"
                class="faq__category"
                :class="{ 'faq__category--active': selectedCategory === cat.id }"
                @click="selectedCategory = cat.id"
              >
                <div class="faq__category-icon">
                  <component :is="getCategoryIcon(cat.id)" />
                </div>
                <span class="faq__category-label">{{ cat.label }}</span>
                <span class="faq__category-count">{{ getCategoryCount(cat.id) }}</span>
              </button>
            </div>

            <!-- Reset Button -->
            <PremiumButton
              v-if="search || selectedCategory !== 'all'"
              type="secondary"
              variant="outline"
              size="sm"
              :label="t('catalogue.filters.resetAll')"
              icon-left="RotateCcw"
              block
              @click="resetSearch"
            />
          </div>

          <!-- Help Card -->
          <div class="faq__help-card">
            <div class="faq__help-icon">
              <BasicIconNext name="MessageSquare" :size="24" />
            </div>
            <h3 class="faq__help-title">{{ t('faq.needHelp') }}</h3>
            <p class="faq__help-text">{{ t('faq.responseTime') }}</p>
            <RouterLink
              to="/profil"
              class="faq__help-btn"
            >
              <BasicIconNext name="Mail" :size="16" />
              {{ t('faq.contactSupport') }}
            </RouterLink>
          </div>
        </aside>

        <!-- Content -->
        <main class="faq__content">
          <!-- Results Info -->
          <div
            v-if="search"
            class="faq__results-info"
          >
            <BasicIconNext name="Search" :size="18" />
            <span>
              <strong>{{ visibleFaqs.length }}</strong>
              résultat{{ visibleFaqs.length > 1 ? 's' : '' }} pour "
              <strong>{{ search }}</strong>
              "
            </span>
            <PremiumButton
              type="primary"
              variant="ghost"
              size="xs"
              :label="t('faq.reset')"
              @click="search = ''"
            />
          </div>

          <!-- Empty State -->
          <div
            v-if="groupedVisible.length === 0"
            class="faq__empty"
          >
            <div class="faq__empty-icon">
              <BasicIconNext name="SearchX" :size="48" />
            </div>
            <h3 class="faq__empty-title">{{ t('faq.noResults') }}</h3>
            <p class="faq__empty-text">{{ t('faq.noResultsText') }}</p>
            <PremiumButton
              type="primary"
              variant="solid"
              size="md"
              :label="t('faq.reset')"
              icon-left="RotateCcw"
              @click="resetSearch"
            />
          </div>

          <!-- FAQ Groups -->
          <div
            v-else
            class="faq__groups"
          >
            <div
              v-for="group in groupedVisible"
              :key="group.id"
              class="faq__group"
            >
              <!-- Group Header -->
              <div class="faq__group-header">
                <div class="faq__group-icon">
                  <component :is="getCategoryIcon(group.id)" />
                </div>
                <div class="faq__group-info">
                  <h2 class="faq__group-title">{{ group.label }}</h2>
                  <span class="faq__group-count">
                    {{ group.items.length }} question{{ group.items.length > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>

              <!-- Questions -->
              <div class="faq__questions">
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  :id="item.id"
                  class="faq__item"
                  :class="{
                    'faq__item--open': groupOpenState[item.id],
                    'faq__item--ruo': item.ruo,
                  }"
                >
                  <button
                    class="faq__item-header"
                    @click="toggleItem(item.id)"
                  >
                    <div class="faq__item-question">
                      <span class="faq__item-indicator">
                        <BasicIconNext name="HelpCircle" :size="16" />
                      </span>
                      <span class="faq__item-text">{{ item.q }}</span>
                    </div>
                    <span class="faq__item-toggle">
                      <BasicIconNext
                        :name="groupOpenState[item.id] ? 'Minus' : 'Plus'"
                        :size="18"
                      />
                    </span>
                  </button>

                  <transition name="accordion">
                    <div
                      v-show="groupOpenState[item.id]"
                      class="faq__item-body"
                    >
                      <div
                        class="faq__item-answer"
                        v-html="item.a"
                      ></div>

                      <!-- RUO Badge -->
                      <div
                        v-if="item.ruo"
                        class="faq__item-ruo"
                      >
                        <BasicIconNext name="Shield" :size="16" />
                        <span>Research Use Only – Usage recherche uniquement</span>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Footer CTA -->
      <footer class="faq__footer">
        <div class="faq__footer-content">
          <div class="faq__footer-icon">
            <BasicIconNext name="MessageSquare" :size="32" />
          </div>
          <div class="faq__footer-text">
            <h3>{{ t('faq.needHelp') }}</h3>
            <p>{{ t('faq.responseTime') }}</p>
          </div>
          <RouterLink
            to="/profil"
            class="faq__footer-btn"
          >
            <BasicIconNext name="Mail" :size="18" />
            {{ t('faq.contactSupport') }}
          </RouterLink>
        </div>

        <!-- Trust Items -->
        <div class="faq__trust">
          <div class="faq__trust-item">
            <BasicIconNext name="Clock" :size="18" />
            <span>{{ t('faq.responseTime') }}</span>
          </div>
          <div class="faq__trust-item">
            <BasicIconNext name="Shield" :size="18" />
            <span>{{ t('product.trustBadges.support') }}</span>
          </div>
          <div class="faq__trust-item">
            <BasicIconNext name="CheckCircle2" :size="18" />
            <span>{{ t('checkout.payment.satisfaction') }}</span>
          </div>
        </div>
      </footer>
    </PageContent>
  </div>
</template>
<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import PageContent from '@/features/shared/components/PageContent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  // Configuration SEO pour la page FAQ
  useHead({
    title: 'FAQ - Questions Fréquentes | Atlas Lab Solutions',
    meta: [
      {
        name: 'description',
        content:
          'Trouvez les réponses à vos questions sur nos peptides de recherche : commande, livraison, pureté, reconstitution. Support disponible 24h/24.',
      },
      {
        property: 'og:title',
        content: 'FAQ - Questions Fréquentes | Atlas Lab Solutions',
      },
      {
        property: 'og:description',
        content: 'Toutes les réponses à vos questions sur nos produits et services.',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://fast-peptides.com/faq',
      },
    ],
  })

  const { t } = useI18n()

  // ============================================
  // TYPES
  // ============================================
  type CatId = 'qualite' | 'stockage' | 'commande' | 'shipping' | 'conformite' | 'retour'

  type FaqItem = {
    id: string
    cat: CatId
    q: string
    a: string
    ruo?: boolean
    kw?: string[]
  }

  // ============================================
  // DATA
  // ============================================
  const categories = computed((): { id: CatId; label: string; icon: string }[] => [
    { id: 'qualite', label: t('faq.categories.products'), icon: 'FlaskRound' },
    { id: 'stockage', label: t('faq.categories.storage'), icon: 'Boxes' },
    { id: 'commande', label: t('faq.categories.orders'), icon: 'CreditCard' },
    { id: 'shipping', label: t('faq.categories.shipping'), icon: 'PackageSearch' },
    { id: 'conformite', label: t('faq.categories.compliance'), icon: 'ShieldCheck' },
    { id: 'retour', label: t('faq.categories.returns'), icon: 'Undo2' },
  ])

  // FAQ items mapping with category and RUO flag
  const faqConfig: { id: string; cat: CatId; ruo?: boolean }[] = [
    { id: 'q1', cat: 'qualite' },
    { id: 'q2', cat: 'qualite' },
    { id: 'q3', cat: 'qualite', ruo: true },
    { id: 'q4', cat: 'stockage' },
    { id: 'q5', cat: 'stockage' },
    { id: 'q6', cat: 'stockage' },
    { id: 'q7', cat: 'commande' },
    { id: 'q8', cat: 'commande' },
    { id: 'q9', cat: 'commande' },
    { id: 'q10', cat: 'shipping' },
    { id: 'q11', cat: 'shipping' },
    { id: 'q12', cat: 'shipping' },
    { id: 'q13', cat: 'shipping' },
    { id: 'q14', cat: 'conformite', ruo: true },
    { id: 'q15', cat: 'conformite', ruo: true },
    { id: 'q16', cat: 'conformite' },
    { id: 'q17', cat: 'retour' },
    { id: 'q18', cat: 'retour' },
  ]

  const faqs = computed((): FaqItem[] =>
    faqConfig.map((item) => ({
      id: item.id,
      cat: item.cat,
      q: t(`faq.items.${item.id}.q`),
      a: t(`faq.items.${item.id}.a`),
      ruo: item.ruo,
    })),
  )

  // ============================================
  // STATE
  // ============================================
  const search = ref('')
  const selectedCategory = ref<'all' | CatId>('all')
  const groupOpenState = ref<Record<string, boolean>>({})

  // ============================================
  // ICONS
  // ============================================
  const FlaskIcon = {
    render() {
      return h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', {
            d: 'M9 3h6M10 9V3M14 9V3M18 21H6a2 2 0 01-1.68-3.08L10 9h4l5.68 8.92A2 2 0 0118 21z',
          }),
        ],
      )
    },
  }

  const BoxesIcon = {
    render() {
      return h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', {
            d: 'M2.97 12.92A2 2 0 002 14.63v3.24a2 2 0 001.03 1.75l4 2.31a2 2 0 002 0l4-2.31a2 2 0 001.03-1.75v-3.24a2 2 0 00-.97-1.71l-4-2.3a2 2 0 00-2 0l-4 2.3z',
          }),
          h('path', {
            d: 'M7 16.5V22M2 14l5 3M12 14l-5 3M14.97 7.92a2 2 0 00-.97 1.71v3.24a2 2 0 001.03 1.75l4 2.31a2 2 0 002 0l4-2.31A2 2 0 0026 12.87v-3.24a2 2 0 00-.97-1.71l-4-2.3a2 2 0 00-2 0l-4 2.3z'.replace(
              '26',
              '24',
            ),
          }),
          h('path', { d: 'M19 11.5V17M14 9l5 3M24 9l-5 3'.replace('24', '22') }),
        ],
      )
    },
  }

  const CreditCardIcon = {
    render() {
      return h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('rect', { x: 1, y: 4, width: 22, height: 16, rx: 2 }),
          h('line', { x1: 1, y1: 10, x2: 23, y2: 10 }),
        ],
      )
    },
  }

  const PackageIcon = {
    render() {
      return h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' }),
          h('circle', { cx: 12, cy: 10, r: 3 }),
        ],
      )
    },
  }

  const ShieldIcon = {
    render() {
      return h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
          h('path', { d: 'M9 12l2 2 4-4' }),
        ],
      )
    },
  }

  const UndoIcon = {
    render() {
      return h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', { d: 'M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8' }),
          h('path', { d: 'M3 3v5h5' }),
        ],
      )
    },
  }

  const iconMap: Record<string, any> = {
    qualite: FlaskIcon,
    stockage: BoxesIcon,
    commande: CreditCardIcon,
    shipping: PackageIcon,
    conformite: ShieldIcon,
    retour: UndoIcon,
  }

  function getCategoryIcon(catId: string) {
    return iconMap[catId] || FlaskIcon
  }

  // ============================================
  // COMPUTED
  // ============================================
  const visibleFaqs = computed(() => {
    const q = search.value.trim().toLowerCase()
    return faqs.value.filter((f) => {
      const catOk = selectedCategory.value === 'all' || f.cat === selectedCategory.value
      if (!q) return catOk
      const hay = (
        f.q +
        ' ' +
        f.a.replace(/<[^>]+>/g, '') +
        ' ' +
        (f.kw?.join(' ') ?? '')
      ).toLowerCase()
      return catOk && hay.includes(q)
    })
  })

  const groupedVisible = computed(() => {
    return categories.value
      .map((c) => ({
        ...c,
        items: visibleFaqs.value.filter((f) => f.cat === c.id),
      }))
      .filter((g) => g.items.length > 0)
  })

  // ============================================
  // METHODS
  // ============================================
  function getCategoryCount(catId: CatId) {
    return faqs.value.filter((f) => f.cat === catId).length
  }

  function resetSearch() {
    search.value = ''
    selectedCategory.value = 'all'
  }

  function onSearch() {
    // Could add debounce here if needed
  }

  function toggleItem(id: string) {
    groupOpenState.value[id] = !groupOpenState.value[id]
  }

  // ============================================
  // WATCHERS
  // ============================================
  watch(
    () => groupedVisible.value,
    (groups) => {
      groups.forEach((g) => {
        g.items.forEach((item) => {
          if (groupOpenState.value[item.id] === undefined) {
            groupOpenState.value[item.id] = false
          }
        })
      })
    },
    { immediate: true },
  )

  // ============================================
  // HASH NAVIGATION
  // ============================================
  async function openFromHash() {
    const raw = window.location.hash?.slice(1)
    if (!raw) return
    const id = decodeURIComponent(raw)
    const target = faqs.value.find((f) => f.id === id)
    if (!target) return

    selectedCategory.value = target.cat
    await nextTick()
    groupOpenState.value[id] = true
    await nextTick()

    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.classList.add('faq__item--flash')
    setTimeout(() => el.classList.remove('faq__item--flash'), 1200)
  }

  // ============================================
  // SEO - JSON-LD
  // ============================================
  function injectFaqJsonLd() {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.value.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a.replace(/\n/g, ' '),
        },
      })),
    }
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.text = JSON.stringify(data)
    document.head.appendChild(s)
  }

  // ============================================
  // LIFECYCLE
  // ============================================
  onMounted(() => {
    injectFaqJsonLd()
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', openFromHash)
  })
</script>
<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  .faq {
    position: relative;
    min-height: 100vh;

    // ============================================
    // LAYOUT
    // ============================================
    &__layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      align-items: start;
    }

    // ============================================
    // SIDEBAR
    // ============================================
    &__sidebar {
      position: sticky;
      top: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__sidebar-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    // ============================================
    // SEARCH
    // ============================================
    &__search {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: @neutral-50;
      border: 2px solid @neutral-200;
      border-radius: 14px;
      transition: all 0.2s @ease;

      &:focus-within {
        background: white;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
      }
    }

    &__search-icon {
      color: @neutral-400;
      flex-shrink: 0;
    }

    &__search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-900;
      outline: none;

      &::placeholder {
        color: @neutral-400;
      }
    }

    &__search-clear {
      padding: 4px;
      background: @neutral-200;
      border: none;
      border-radius: 6px;
      color: @neutral-500;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: @neutral-300;
        color: @neutral-700;
      }
    }

    // ============================================
    // CATEGORIES
    // ============================================
    &__categories {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__categories-title {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      color: @neutral-400;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 12px;
      margin-bottom: 8px;
    }

    &__category {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s @ease;
      text-align: left;

      &:hover {
        background: @neutral-50;
      }

      &--active {
        background: linear-gradient(
          135deg,
          rgba(var(--primary-500-rgb), 0.08) 0%,
          rgba(var(--primary-500-rgb), 0.04) 100%
        );
        border-color: rgba(var(--primary-500-rgb), 0.15);

        .faq__category-icon {
          background: var(--primary-500);
          color: white;
        }

        .faq__category-label {
          color: var(--primary-700);
          font-weight: 600;
        }

        .faq__category-count {
          background: var(--primary-500);
          color: white;
        }
      }
    }

    &__category-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @neutral-100;
      border-radius: 10px;
      color: @neutral-500;
      transition: all 0.2s @ease;
      flex-shrink: 0;
    }

    &__category-label {
      flex: 1;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-700;
      transition: all 0.2s @ease;
    }

    &__category-count {
      padding: 4px 10px;
      background: @neutral-100;
      border-radius: 20px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-500;
      transition: all 0.2s @ease;
    }

    // ============================================
    // RESET BUTTON
    // ============================================
    &__reset {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-600;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: white;
        border-color: var(--primary-300);
        color: var(--primary-700);
      }
    }

    // ============================================
    // HELP CARD
    // ============================================
    &__help-card {
      background: linear-gradient(135deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
      border-radius: 20px;
      padding: 24px;
      text-align: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      }
    }

    &__help-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: var(--primary-400);
      margin: 0 auto 16px;
    }

    &__help-title {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin: 0 0 8px;
    }

    &__help-text {
      font-family: @font-body;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 20px;
    }

    &__help-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: auto;
      padding: 14px 20px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: white;
      text-decoration: none;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(var(--primary-500-rgb), 0.4);
      }
    }

    // ============================================
    // CONTENT
    // ============================================
    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    // ============================================
    // RESULTS INFO
    // ============================================
    &__results-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.08) 0%,
        rgba(var(--primary-500-rgb), 0.04) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 14px;

      svg {
        color: var(--primary-600);
        flex-shrink: 0;
      }

      span {
        flex: 1;
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-600;

        strong {
          color: var(--primary-700);
        }
      }

      button {
        padding: 6px 14px;
        background: white;
        border: 1px solid @neutral-200;
        border-radius: 8px;
        font-family: @font-body;
        font-size: 13px;
        font-weight: 500;
        color: @neutral-600;
        cursor: pointer;
        transition: all 0.2s @ease;

        &:hover {
          border-color: var(--primary-300);
          color: var(--primary-700);
        }
      }
    }

    // ============================================
    // EMPTY STATE
    // ============================================
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 40px;
      background: white;
      border-radius: 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
      text-align: center;
    }

    &__empty-icon {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @neutral-50;
      border-radius: 50%;
      color: @neutral-400;
      margin-bottom: 24px;
    }

    &__empty-title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 8px;
    }

    &__empty-text {
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-500;
      margin: 0 0 24px;
      max-width: 300px;
    }

    &__empty-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: @neutral-900;
      border: none;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.25s @ease;

      &:hover {
        background: @neutral-800;
        transform: translateY(-2px);
      }
    } // ============================================
    // GROUPS
    // ============================================
    &__groups {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    &__group {
      background: white;
      border-radius: 24px;
      padding: 28px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
    }

    &__group-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid @neutral-100;
    }

    &__group-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      border-radius: 14px;
      color: var(--primary-600);
      flex-shrink: 0;
    }

    &__group-info {
      flex: 1;
    }

    &__group-title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 700;
      color: @neutral-900;
      margin: 0 0 4px;
    }

    &__group-count {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
    }

    // ============================================
    // QUESTIONS
    // ============================================
    &__questions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    // ============================================
    // ITEM (Accordion)
    // ============================================
    &__item {
      background: @neutral-50;
      border: 1px solid @neutral-100;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s @ease;

      &:hover {
        border-color: @neutral-200;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      }

      &--open {
        background: white;
        border-color: rgba(var(--primary-500-rgb), 0.2);
        box-shadow: 0 4px 20px rgba(var(--primary-500-rgb), 0.08);

        .faq__item-header {
          border-bottom: 1px solid @neutral-100;
        }

        .faq__item-indicator {
          background: var(--primary-500);
          color: white;
        }

        .faq__item-toggle {
          background: var(--primary-500);
          color: white;
          transform: rotate(180deg);
        }
      }

      &--ruo {
        border-left: 3px solid @warning-500;
      }

      &--flash {
        animation: faq-flash 1.2s ease-out;
      }
    }

    &__item-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: transparent;
      border: none;
      width: 100%;
      cursor: pointer;
      transition: all 0.2s @ease;
      text-align: left;

      &:hover {
        .faq__item-toggle {
          background: @neutral-200;
        }
      }
    }

    &__item-question {
      flex: 1;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    &__item-indicator {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @neutral-100;
      border-radius: 10px;
      color: @neutral-500;
      flex-shrink: 0;
      transition: all 0.3s @ease;
    }

    &__item-text {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-800;
      line-height: 1.5;
      padding-top: 4px;
    }

    &__item-toggle {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @neutral-100;
      border-radius: 10px;
      color: @neutral-500;
      flex-shrink: 0;
      transition: all 0.3s @ease;
    }

    &__item-body {
      padding: 0 20px 24px;
      overflow: hidden;
    }

    &__item-answer {
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-600;
      line-height: 1.7;
      padding-left: 46px;

      :deep(strong) {
        color: @neutral-800;
        font-weight: 600;
      }

      :deep(em) {
        color: var(--primary-700);
        font-style: normal;
        background: rgba(var(--primary-500-rgb), 0.08);
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    &__item-ruo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 16px;
      margin-left: 46px;
      padding: 12px 16px;
      background: linear-gradient(
        135deg,
        rgba(var(--warning-500-rgb), 0.1) 0%,
        rgba(var(--warning-500-rgb), 0.05) 100%
      );
      border: 1px solid rgba(var(--warning-500-rgb), 0.2);
      border-radius: 10px;

      svg {
        color: @warning-500;
        flex-shrink: 0;
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 500;
        color: @warning-700;
      }
    }

    // ============================================
    // FOOTER
    // ============================================
    &__footer {
      background: white;
      border-radius: 28px;
      padding: 40px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid @neutral-100;
    }

    &__footer-content {
      display: flex;
      align-items: center;
      gap: 24px;
      padding-bottom: 32px;
      margin-bottom: 24px;
      border-bottom: 1px solid @neutral-100;
    }

    &__footer-icon {
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      border-radius: 20px;
      color: var(--primary-600);
      flex-shrink: 0;
    }

    &__footer-text {
      flex: 1;

      h3 {
        font-family: @font-display;
        font-size: 20px;
        font-weight: 700;
        color: @neutral-900;
        margin: 0 0 8px;
      }

      p {
        font-family: @font-body;
        font-size: 15px;
        color: @neutral-500;
        margin: 0;
      }
    }

    &__footer-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 28px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 14px;
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: white;
      text-decoration: none;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);
      flex-shrink: 0;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
      }
    }

    // ============================================
    // TRUST
    // ============================================
    &__trust {
      display: flex;
      justify-content: center;
      gap: 40px;
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;

      svg {
        color: @success-500;
      }
    }

    // ============================================
    // ANIMATIONS
    // ============================================
    @keyframes faq-flash {
      0% {
        background: rgba(var(--primary-500-rgb), 0.15);
        box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.2);
      }
      60% {
        background: rgba(var(--primary-500-rgb), 0.05);
        box-shadow: 0 0 0 0 rgba(var(--primary-500-rgb), 0);
      }
      100% {
        background: white;
      }
    }

    .accordion-enter-active,
    .accordion-leave-active {
      transition: all 0.3s @ease;
      max-height: 500px;
      opacity: 1;
    }

    .accordion-enter-from,
    .accordion-leave-to {
      max-height: 0;
      opacity: 0;
      padding-top: 0;
      padding-bottom: 0;
    }

    // ============================================
    // RESPONSIVE
    // ============================================
    @media (max-width: 1000px) {
      &__layout {
        grid-template-columns: 260px 1fr;
        gap: 24px;
      }
    }

    @media (max-width: 900px) {
      &__layout {
        grid-template-columns: 1fr;
      }

      &__sidebar {
        position: static;
        flex-direction: column; // ← Garder en colonne
        gap: 16px;
      }

      &__sidebar-card {
        width: auto;
      }

      &__help-card {
        width: auto;
      }

      &__footer-content {
        flex-direction: column;
        text-align: center;
      }

      &__footer-text {
        h3 {
          font-size: 18px;
        }
      }

      &__trust {
        flex-wrap: wrap;
        gap: 24px;
      }
    }

    @media (max-width: 768px) {
      &__title {
        font-size: 36px;
      }

      &__subtitle {
        font-size: 16px;
      }

      &__stats {
        flex-direction: column;
        gap: 16px;
        padding: 20px;
      }

      &__stat-divider {
        width: 40px;
        height: 1px;
      }

      &__sidebar {
        flex-direction: column;
      }

      &__categories {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      &__categories-title {
        grid-column: 1 / -1;
      }

      &__category {
        padding: 10px 12px;
      }

      &__category-label {
        font-size: 12px;
      }

      &__category-count {
        display: none;
      }

      &__group {
        padding: 20px;
        border-radius: 20px;
      }

      &__group-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &__item-header {
        padding: 16px;
      }

      &__item-question {
        gap: 12px;
      }

      &__item-indicator {
        width: 28px;
        height: 28px;

        svg {
          width: 14px;
          height: 14px;
        }
      }

      &__item-text {
        font-size: 14px;
      }

      &__item-body {
        padding: 0 16px 20px;
      }

      &__item-answer {
        padding-left: 40px;
        font-size: 14px;
      }

      &__item-ruo {
        margin-left: 40px;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      &__footer {
        padding: 28px 20px;
        border-radius: 20px;
      }

      &__footer-icon {
        width: 56px;
        height: 56px;
      }

      &__footer-btn {
        justify-content: center;
      }

      &__trust {
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
    }

    @media (max-width: 480px) {
      &__title {
        font-size: 28px;
      }

      &__header-badge {
        padding: 6px 12px;

        span {
          font-size: 12px;
        }
      }

      &__categories {
        grid-template-columns: 1fr;
      }

      &__item-indicator {
        display: none;
      }

      &__item-answer {
        padding-left: 0;
      }

      &__item-ruo {
        margin-left: 0;
      }
    }
  }
</style>
