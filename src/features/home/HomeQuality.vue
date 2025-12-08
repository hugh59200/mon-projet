<template>
  <div class="layout-section">
    <!-- Conteneur centré max-width 1200px -->
    <div class="layout-section__container">
      <div class="layout-section__inner layout-section__inner--two-cols">
        <div class="quality__content">
          <span class="quality__badge">{{ t('home.quality.badge') }}</span>
          <h2 class="quality__title">
            {{ t('home.quality.title.line1') }}
            <br />
            <span>{{ t('home.quality.title.accent') }}</span>
          </h2>
          <p class="quality__desc">
            {{ t('home.quality.description') }}
          </p>

          <div class="quality__features">
            <div
              v-for="f in features"
              :key="f.title"
              class="quality__feature"
              :class="`quality__feature--${f.variant}`"
            >
              <div class="quality__feature-icon">
                <component :is="f.icon" />
              </div>
              <div class="quality__feature-text">
                <h4>{{ f.title }}</h4>
                <p>{{ f.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="quality__visual">
          <div
            class="quality__coa-scroll"
            ref="scrollContainer"
          >
            <div class="quality__coa-track">
              <ContentBlock
                v-for="(coa, index) in displayedCoaList"
                :key="`${coa.id}-${index}`"
                variant="card"
                size="sm"
                class="coa-card"
              >
                <div class="coa-card__header">
                  <span class="coa-card__badge">COA</span>
                  <span class="coa-card__title">{{ coa.name }}</span>
                </div>
                <div class="coa-card__body">
                  <div class="coa-card__row">
                    <span>{{ t('home.quality.coa.hplc') }}</span>
                    <span>{{ coa.ref }}</span>
                  </div>
                  <div class="coa-card__row">
                    <span>{{ t('home.quality.coa.batch') }}</span>
                    <span>{{ coa.batch }}</span>
                  </div>
                  <div class="coa-card__row coa-card__row--highlight">
                    <span>{{ t('home.quality.coa.purity') }}</span>
                    <span>{{ coa.purity }}</span>
                  </div>
                  <div class="coa-card__row">
                    <span>{{ t('home.quality.coa.lcms') }}</span>
                    <span>{{ coa.mass }}</span>
                  </div>
                </div>
                <button
                  class="coa-card__footer"
                  @click="downloadCoa(coa)"
                >
                  <BasicIconNext
                    name="CheckCircle2"
                    :size="18"
                  />
                  <span>{{ t('home.quality.coa.download') }}</span>
                </button>
              </ContentBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import ContentBlock from '@designSystem/components/layout/ContentBlock.vue'
  import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { isMobile } = useDeviceBreakpoint()

  // Ref pour le scroll container
  const scrollContainer = ref<HTMLElement | null>(null)
  let autoScrollInterval: number | null = null
  let scrollDirection: 'right' | 'left' = 'right'
  const isDev = import.meta.env.DEV

  // Auto-scroll horizontal pour mobile
  const startAutoScroll = () => {
    if (isDev || !isMobile.value || !scrollContainer.value) return

    autoScrollInterval = window.setInterval(() => {
      const container = scrollContainer.value
      if (!container) return

      const maxScroll = container.scrollWidth - container.clientWidth
      const currentScroll = container.scrollLeft

      if (scrollDirection === 'right') {
        if (currentScroll >= maxScroll - 5) {
          scrollDirection = 'left'
        } else {
          container.scrollTo({
            left: currentScroll + 232, // largeur carte + gap
            behavior: 'smooth',
          })
        }
      } else {
        if (currentScroll <= 5) {
          scrollDirection = 'right'
        } else {
          container.scrollTo({
            left: currentScroll - 232,
            behavior: 'smooth',
          })
        }
      }
    }, 5000)
  }

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval)
      autoScrollInterval = null
    }
  }

  onMounted(() => {
    startAutoScroll()
  })

  onBeforeUnmount(() => {
    stopAutoScroll()
  })

  interface CoaItem {
    id: string
    name: string
    ref: string
    batch: string
    purity: string
    mass: string
    coaUrl: string
  }

  // Liste statique des COA avec les vraies URLs
  const coaList: CoaItem[] = [
    {
      id: '1',
      name: 'TB-500',
      ref: 'TB500-5MG',
      batch: '2025-1847',
      purity: '99.2%',
      mass: '5mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/tb-500-10mg.jpg',
    },
    {
      id: '2',
      name: 'Tirzepatide',
      ref: 'TIRZ-10MG',
      batch: '2025-2341',
      purity: '98.7%',
      mass: '10mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/tirzepatide-60mg.jpg',
    },
    {
      id: '3',
      name: 'Retatrutide',
      ref: 'RETA-10MG',
      batch: '2025-3892',
      purity: '99.1%',
      mass: '10mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/retatrutide-60mg.jpg',
    },
    {
      id: '4',
      name: 'CJC-1295 DAC',
      ref: 'CJC-5MG',
      batch: '2025-4521',
      purity: '98.9%',
      mass: '5mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/cjc-1295-5mg.jpg',
    },
    {
      id: '5',
      name: 'PT-141',
      ref: 'PT141-10MG',
      batch: '2025-5673',
      purity: '99.4%',
      mass: '10mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/pt-141-10mg.jpg',
    },
    {
      id: '6',
      name: 'Selank',
      ref: 'SEL-5MG',
      batch: '2025-6124',
      purity: '99.0%',
      mass: '5mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/selank-10mg.jpg',
    },
    {
      id: '7',
      name: 'Semax',
      ref: 'SMX-5MG',
      batch: '2025-7289',
      purity: '98.8%',
      mass: '5mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/semax-10mg.jpg',
    },
    {
      id: '8',
      name: 'GHK-Cu',
      ref: 'GHKCU-100MG',
      batch: '2025-8156',
      purity: '99.3%',
      mass: '100mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/ghk-cu-100mg.jpg',
    },
    {
      id: '9',
      name: 'NAD+',
      ref: 'NAD-500MG',
      batch: '2025-9034',
      purity: '99.5%',
      mass: '500mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/nad-500mg.jpg',
    },
    {
      id: '10',
      name: 'DSIP',
      ref: 'DSIP-5MG',
      batch: '2025-1023',
      purity: '98.6%',
      mass: '5mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/dsip-5mg.jpg',
    },
    {
      id: '11',
      name: 'BPC-157',
      ref: 'BPC-10MG',
      batch: '2025-1198',
      purity: '99.1%',
      mass: '10mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/bpc-157-5mg.jpg',
    },
    {
      id: '12',
      name: 'SS-31',
      ref: 'SS31-10MG',
      batch: '2025-1267',
      purity: '98.9%',
      mass: '10mg',
      coaUrl: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/ss-31-50mg.jpg',
    },
  ]

  // Télécharger le COA (comme dans ProductDetails)
  async function downloadCoa(coa: CoaItem) {
    try {
      const response = await fetch(coa.coaUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      // Déterminer l'extension depuis l'URL
      const ext = coa.coaUrl.match(/\.(pdf|png|jpg|jpeg|webp)$/i)?.[1]?.toLowerCase() || 'jpg'
      link.download = `${coa.name}_FreedomDiagnostics_Lot-${coa.batch}.${ext}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur téléchargement COA:', error)
      // Fallback: ouvrir dans un nouvel onglet
      window.open(coa.coaUrl, '_blank')
    }
  }

  // Liste dupliquée pour l'effet infini (desktop) ou simple (mobile)
  const infiniteCoaList = computed(() => [...coaList, ...coaList, ...coaList])
  const displayedCoaList = computed(() => (isMobile.value ? coaList : infiniteCoaList.value))

  // TODO: Réactiver les animations plus tard
  // const setupInfiniteScroll = () => {
  //   const container = scrollContainer.value
  //   if (!container) return
  //   const handleScroll = () => {
  //     const { scrollTop, scrollHeight } = container
  //     const singleSetHeight = scrollHeight / 3
  //     if (scrollTop >= singleSetHeight * 2) {
  //       container.scrollTop = scrollTop - singleSetHeight
  //     } else if (scrollTop <= 0) {
  //       container.scrollTop = scrollTop + singleSetHeight
  //     }
  //   }
  //   container.addEventListener('scroll', handleScroll)
  //   requestAnimationFrame(() => {
  //     const singleSetHeight = container.scrollHeight / 3
  //     container.scrollTop = singleSetHeight
  //   })
  // }

  const icon = (d: string) => () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d })],
    )

  const CheckIcon = icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')
  const BeakerIcon = icon(
    'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  )
  const GlobeIcon = icon(
    'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  )
  const LeafIcon = icon(
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  )

  const features = computed(() => [
    {
      title: t('home.quality.features.f1.title'),
      description: t('home.quality.features.f1.description'),
      variant: 'success',
      icon: CheckIcon,
    },
    {
      title: t('home.quality.features.f2.title'),
      description: t('home.quality.features.f2.description'),
      variant: 'primary',
      icon: BeakerIcon,
    },
    {
      title: t('home.quality.features.f3.title'),
      description: t('home.quality.features.f3.description'),
      variant: 'warning',
      icon: GlobeIcon,
    },
    {
      title: t('home.quality.features.f4.title'),
      description: t('home.quality.features.f4.description'),
      variant: 'info',
      icon: LeafIcon,
    },
  ])

  // TODO: Réactiver les animations plus tard (désactivées pour perf)
  // onMounted(() => {
  //   setupInfiniteScroll()
  // })
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

  .layout-section {
    width: 100%;

    // Conteneur centré
    &__container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 50px;
    }

    &__inner {
      &--two-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: center;
      }
    }

    // TODO: Réactiver les animations plus tard
    // &--quality {
    //   opacity: 0;
    //   transform: translateY(30px);
    //   transition: all 0.8s @ease;
    //   &.is-visible {
    //     opacity: 1;
    //     transform: translateY(0);
    //   }
    // }
  }

  .quality {
    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(@success-500, 0.15);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: @success-500;
      width: fit-content;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(36px, 4vw, 52px);
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.02em;
      span {
        background: linear-gradient(135deg, @success-500 0%, var(--primary-400) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__desc {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.7;
      color: var(--content-block-text-secondary);
      margin: 0;
    }
    &__features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 16px;
    }

    &__feature {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      &--success .quality__feature-icon {
        background: rgba(@success-500, 0.15);
        color: @success-500;
      }
      &--primary .quality__feature-icon {
        background: rgba(var(--primary-500-rgb), 0.15);
        color: var(--primary-400);
      }
      &--warning .quality__feature-icon {
        background: rgba(@warning-500, 0.15);
        color: @warning-500;
      }
      &--info .quality__feature-icon {
        background: rgba(@info-500, 0.15);
        color: @info-500;
      }

      &-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        svg {
          width: 22px;
          height: 22px;
        }
      }

      &-text {
        h4 {
          font-family: @font-display;
          font-size: 16px;
          font-weight: 600;
          color: var(--content-block-text);
          margin: 0 0 4px;
        }
        p {
          font-family: @font-body;
          font-size: 14px;
          color: var(--content-block-text-muted);
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    &__visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__coa-scroll {
      position: relative;
      width: 280px;
      height: 500px;
      border-radius: 20px;
      overflow-y: auto;
      overflow-x: hidden;

      // Scrollbar invisible
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE/Edge
      &::-webkit-scrollbar {
        display: none; // Chrome/Safari
      }

      // Masques de fondu en haut et en bas
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 12%,
        black 88%,
        transparent 100%
      );
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 12%,
        black 88%,
        transparent 100%
      );
    }

    &__coa-track {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 8px;
    }
  }

  .coa-card {
    flex-shrink: 0;
    width: 260px;
    margin: 0 auto;
    overflow: hidden;
    padding: 0 !important; // Override ContentBlock padding

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--content-block-bg-subtle);
      border-bottom: 1px solid var(--content-block-border);
    }

    &__badge {
      padding: 2px 6px;
      background: rgba(@success-500, 0.2);
      border-radius: 4px;
      font-family: @font-body;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: @success-500;
    }

    &__title {
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: var(--content-block-text);
    }

    &__body {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      font-family: @font-body;
      font-size: 11px;

      span:first-child {
        color: var(--content-block-text-muted);
      }

      span:last-child {
        color: var(--content-block-text);
        font-weight: 500;
      }

      &--highlight {
        padding: 8px;
        margin: 2px -6px;
        background: rgba(@success-500, 0.1);
        border-radius: 6px;

        span:last-child {
          color: @success-500;
          font-weight: 700;
          font-size: 12px;
        }
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 100%;
      padding: 8px 12px;
      background: rgba(@success-500, 0.08);
      border: none;
      border-top: 1px solid var(--content-block-border);
      font-family: @font-body;
      font-size: 11px;
      font-weight: 500;
      color: @success-500;
      cursor: pointer;
      transition: background 0.2s @ease;

      svg {
        width: 14px;
        height: 14px;
      }

      &:hover {
        background: rgba(@success-500, 0.15);
      }
    }
  }

  // Responsive - Tablet et Mobile (≤ 1160px) - même affichage
  .respond-tablet({
    .layout-section__container {
      padding: 0 16px;
    }
    .layout-section__inner--two-cols {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .quality__content {
      text-align: center;
      align-items: center;
    }
    .quality__desc {
      font-size: 14px;
    }
    .quality__features {
      display: none;
    }
    .quality__visual {
      order: 1;
      width: calc(100% + 32px);
      margin-left: -16px;
      margin-right: -16px;
    }
    .quality__coa-scroll {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      height: auto;
      overflow-x: auto;
      overflow-y: hidden;
      border-radius: 0;
      padding: 0 24px;
      // Masque horizontal avec fondu aux extrémités
      mask-image: linear-gradient(
        to right,
        transparent 0%,
        black 6%,
        black 94%,
        transparent 100%
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent 0%,
        black 6%,
        black 94%,
        transparent 100%
      );
    }
    .quality__coa-track {
      flex-direction: row;
      padding: 8px 0;
      gap: 12px;
      width: max-content;
    }
    .coa-card {
      width: 220px;
      flex-shrink: 0;
    }
  });
</style>
