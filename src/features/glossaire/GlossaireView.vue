<template>
  <div class="glossaire">
    <!-- Header -->
    <PageHeader />

    <PageContent size="xl">
      <!-- Loading State -->
      <ContentBlock v-if="loading" variant="card" size="lg" class="glossaire__loading">
        <BasicLoader size="medium" />
        <p class="glossaire__loading-text">Chargement du glossaire...</p>
      </ContentBlock>

      <template v-else>
        <!-- Search & Alphabet Navigation -->
        <section class="glossaire__header">
          <div class="glossaire__search-wrapper">
            <div class="glossaire__search">
              <BasicIconNext name="Search" :size="18" class="glossaire__search-icon" />
              <input
                v-model="searchInput"
                type="text"
                class="glossaire__search-input"
                :placeholder="$t('glossary.searchPlaceholder')"
                @input="onSearchInput"
              />
              <button
                v-if="searchInput"
                class="glossaire__search-clear"
                @click="clearSearch"
              >
                <BasicIconNext name="X" :size="16" />
              </button>
            </div>
            <p class="glossaire__count">
              {{ filteredCount }} {{ filteredCount > 1 ? 'termes' : 'terme' }}
              <span v-if="searchQuery">(sur {{ totalCount }})</span>
            </p>
          </div>

          <!-- Alphabet Navigation -->
          <nav v-if="alphabet.length > 0" class="glossaire__alphabet">
            <a
              v-for="letter in alphabet"
              :key="letter"
              :href="`#letter-${letter}`"
              class="glossaire__alphabet-letter"
              @click.prevent="scrollToLetter(letter)"
            >
              {{ letter }}
            </a>
          </nav>
        </section>

        <!-- Empty State -->
        <ContentBlock
          v-if="filteredCount === 0"
          variant="card"
          size="lg"
          class="glossaire__empty"
        >
          <div class="glossaire__empty-icon">
            <BasicIconNext name="BookX" :size="48" />
          </div>
          <h2 class="glossaire__empty-title">{{ $t('glossary.noResults') }}</h2>
          <p class="glossaire__empty-text">
            Aucun terme ne correspond à votre recherche "{{ searchQuery }}".
          </p>
          <PremiumButton
            type="secondary"
            variant="outline"
            icon-left="X"
            @click="clearSearch"
          >
            Effacer la recherche
          </PremiumButton>
        </ContentBlock>

        <!-- Terms List grouped by letter -->
        <section v-else class="glossaire__content">
          <div
            v-for="letter in alphabet"
            :key="letter"
            :id="`letter-${letter}`"
            class="glossaire__group"
          >
            <div class="glossaire__group-header">
              <span class="glossaire__group-letter">{{ letter }}</span>
              <span class="glossaire__group-count">
                {{ groupedTerms[letter]?.length || 0 }} {{ (groupedTerms[letter]?.length || 0) > 1 ? 'termes' : 'terme' }}
              </span>
            </div>

            <div class="glossaire__terms">
              <RouterLink
                v-for="term in groupedTerms[letter]"
                :key="term.id"
                :to="`/glossaire/${term.slug}`"
                class="glossaire__term"
              >
                <div class="glossaire__term-content">
                  <h3 class="glossaire__term-title">{{ term.term }}</h3>
                  <p v-if="term.meta_description" class="glossaire__term-description">
                    {{ term.meta_description }}
                  </p>
                </div>
                <div class="glossaire__term-arrow">
                  <BasicIconNext name="ChevronRight" :size="18" />
                </div>
              </RouterLink>
            </div>
          </div>
        </section>
      </template>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import PageContent from '@/features/shared/components/PageContent.vue'
import PageHeader from '@/features/shared/components/PageHeader.vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useGlossaryStore } from './store/useGlossaryStore'
import { getCanonicalUrl } from '@/config/seo'

// SEO Configuration
useHead({
  title: 'Glossaire des peptides - Atlas Lab Solutions',
  meta: [
    {
      name: 'description',
      content:
        'Glossaire scientifique des termes techniques liés aux peptides de recherche. Définitions de lyophilisation, eau bactériostatique, demi-vie, biodisponibilité et plus.',
    },
    {
      name: 'keywords',
      content:
        'glossaire peptides, définitions scientifiques, lyophilisation, eau bactériostatique, demi-vie, biodisponibilité, secrétagogue, termes laboratoire',
    },
    {
      property: 'og:title',
      content: 'Glossaire des peptides - Atlas Lab Solutions',
    },
    {
      property: 'og:description',
      content: 'Glossaire scientifique des termes techniques liés aux peptides de recherche.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: getCanonicalUrl('/glossaire'),
    },
  ],
})

// Store
const glossaryStore = useGlossaryStore()
const { loadTerms, setSearch, clearSearch: storeClearSearch } = glossaryStore
const {
  loading,
  searchQuery,
  groupedTerms,
  alphabet,
  totalCount,
  filteredCount,
} = storeToRefs(glossaryStore)

// Local state
const searchInput = ref('')

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    setSearch(searchInput.value)
  }, 300)
}

const clearSearch = () => {
  searchInput.value = ''
  storeClearSearch()
}

// Schema.org DefinedTermSet
const definedTermSetSchema = computed(() => {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glossaire des peptides de recherche',
    description:
      'Glossaire scientifique des termes techniques liés aux peptides de recherche et à la biochimie.',
    url: getCanonicalUrl('/glossaire'),
  }
})

// Scroll to letter anchor
const scrollToLetter = (letter: string) => {
  const element = document.getElementById(`letter-${letter}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Lifecycle
onMounted(async () => {
  await loadTerms()
})

// Add schema to head
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(definedTermSetSchema.value)),
    },
  ],
})
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

.glossaire {
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;

  // ===========================
  // LOADING STATE
  // ===========================
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 300px;
  }

  &__loading-text {
    font-size: 15px;
    color: var(--text-muted);
    margin: 0;
  }

  // ===========================
  // HEADER (Search + Alphabet)
  // ===========================
  &__header {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  &__search-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__search {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 0 16px;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
    }
  }

  &__search-icon {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  &__search-input {
    flex: 1;
    padding: 14px 12px;
    border: none;
    background: transparent;
    font-size: 15px;
    color: var(--text-primary);
    outline: none;

    &::placeholder {
      color: var(--text-muted);
    }
  }

  &__search-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: var(--bg-subtle);
    border-radius: 6px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }

  &__count {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;

    span {
      color: var(--text-secondary);
    }
  }

  // ===========================
  // ALPHABET NAVIGATION
  // ===========================
  &__alphabet {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 12px;
  }

  &__alphabet-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      background: var(--bg-hover);
      color: var(--primary-600);
    }

    .respond-mobile({
      width: 32px;
      height: 32px;
      font-size: 13px;
    });
  }

  // ===========================
  // EMPTY STATE
  // ===========================
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 48px 24px;
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 20px;
    color: var(--primary-500);
  }

  &__empty-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  &__empty-text {
    font-size: 15px;
    color: var(--text-muted);
    margin: 0;
    max-width: 400px;
  }

  // ===========================
  // CONTENT (Terms grouped by letter)
  // ===========================
  &__content {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__group {
    scroll-margin-top: 100px;
  }

  &__group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border-default);
  }

  &__group-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-600);
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 10px;
  }

  &__group-count {
    font-size: 14px;
    color: var(--text-muted);
  }

  // ===========================
  // TERMS LIST
  // ===========================
  &__terms {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__term {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-500);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  &__term-content {
    flex: 1;
    min-width: 0;
  }

  &__term-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
  }

  &__term-description {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__term-arrow {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--bg-subtle);
    border-radius: 8px;
    color: var(--text-muted);
    transition: all 0.2s ease;

    .glossaire__term:hover & {
      background: var(--primary-500);
      color: white;
    }
  }

  // ===========================
  // RESPONSIVE
  // ===========================
  .respond-tablet({
    &__header {
      gap: 20px;
    }

    &__group-header {
      gap: 10px;
    }

    &__group-letter {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }
  });

  .respond-mobile({
    &__term {
      padding: 14px 16px;
    }

    &__term-title {
      font-size: 15px;
    }

    &__term-arrow {
      width: 32px;
      height: 32px;
    }
  });
}
</style>
