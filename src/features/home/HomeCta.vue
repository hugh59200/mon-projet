<template>
  <section class="cta-section">
    <div class="cta" ref="sectionRef">
      <div class="cta__bg">
        <div class="cta__glow cta__glow--1"></div>
        <div class="cta__glow cta__glow--2"></div>
        <div class="cta__grid"></div>
      </div>
      
      <div class="cta__inner">
        <div class="cta__content">
          <h2>{{ t('home.cta.title.line1') }}<br><span>{{ t('home.cta.title.accent') }}</span></h2>
          <p>
            {{ t('home.cta.description') }}
          </p>
          <div class="cta__actions">
            <BaseButton variant="white" arrow @click="$router.push('/catalogue')">
              {{ t('home.cta.buttons.catalogue') }}
            </BaseButton>
            <BaseButton variant="outline" @click="$router.push('/contact')">
              {{ t('home.cta.buttons.contact') }}
            </BaseButton>
          </div>
        </div>
        
        <div class="cta__visual">
          <BasicIconNext name="moleculeCta" class="cta__molecule" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from './shared/BaseButton.vue'

const { t } = useI18n()
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if ('IntersectionObserver' in window && sectionRef.value) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    obs.observe(sectionRef.value)
  }
})
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.cta-section {
  padding: 60px 40px;
  display: flex;
  justify-content: center;
}

.cta {
  position: relative;
  width: 100%;
  max-width: 1200px;
  border-radius: 32px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s @ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &__bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--secondary-800) 0%, var(--secondary-900) 50%, var(--secondary-950) 100%);
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);

    &--1 {
      width: 400px;
      height: 400px;
      background: rgba(var(--primary-600-rgb), 0.25);
      top: -100px;
      left: -100px;
    }

    &--2 {
      width: 300px;
      height: 300px;
      background: rgba(var(--primary-400-rgb), 0.2);
      bottom: -80px;
      right: 20%;
    }
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 30% 50%, black 0%, transparent 70%);
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding: 60px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 60px;
    align-items: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    h2 {
      font-family: @font-display;
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0;
      line-height: 1.15;
      letter-spacing: -0.02em;

      span {
        background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-300) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    p {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.7;
      color: @neutral-300;
      margin: 0;
      max-width: 520px;
    }
  }

  &__actions {
    display: flex;
    gap: 16px;
    margin-top: 8px;
  }

  &__visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__molecule {
    width: 180px;
    height: 180px;
    animation: rotateSlow 20s linear infinite;

    :deep(.molecule-cta__center) { fill: rgba(255, 255, 255, 0.9); }
    :deep(.molecule-cta__line) { stroke: rgba(255, 255, 255, 0.3); stroke-width: 1.5; }
    :deep(.molecule-cta__dot--1) { fill: rgba(@success-500, 0.8); }
    :deep(.molecule-cta__dot--2) { fill: rgba(var(--primary-400-rgb), 0.8); }
    :deep(.molecule-cta__dot--3) { fill: rgba(@warning-500, 0.8); }
    :deep(.molecule-cta__dot--4) { fill: rgba(@info-500, 0.8); }
  }

  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

// Responsive - Tablet (≤ 1160px)
.respond-tablet({
  .cta__inner { grid-template-columns: 1fr; text-align: center; }
  .cta__content { align-items: center; }
  .cta__actions { justify-content: center; }
  .cta__visual { display: none; }
});

// Responsive - Mobile (≤ 720px)
.respond-mobile({
  .cta-section { padding: 40px 20px; }
  .cta__inner { padding: 48px 24px; }
  .cta__actions { flex-direction: column; width: 100%; }
});
</style>