<template>
  <div class="recon">
    <!-- Background -->
    <div class="recon__bg">
      <div class="recon__bg-gradient"></div>
      <div class="recon__bg-pattern"></div>
      <div class="recon__bg-orb recon__bg-orb--1"></div>
      <div class="recon__bg-orb recon__bg-orb--2"></div>
    </div>

    <div class="recon__container">
      <!-- Header -->
      <header class="recon__header">
        <div class="recon__header-badge">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span>Outil de laboratoire</span>
        </div>

        <h1 class="recon__title">
          Calculateur de
          <span class="recon__title-highlight">Reconstitution</span>
        </h1>

        <p class="recon__subtitle">
          Calculez précisément le volume à prélever pour vos protocoles de recherche
        </p>
      </header>

      <!-- Calculator Section -->
      <section class="recon__calculator">
        <div class="recon__calc-card">
          <!-- Card Header -->
          <div class="recon__calc-header">
            <div class="recon__calc-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect
                  x="4"
                  y="2"
                  width="16"
                  height="20"
                  rx="2"
                />
                <line
                  x1="8"
                  y1="6"
                  x2="16"
                  y2="6"
                />
                <line
                  x1="8"
                  y1="10"
                  x2="10"
                  y2="10"
                />
                <line
                  x1="14"
                  y1="10"
                  x2="16"
                  y2="10"
                />
                <line
                  x1="8"
                  y1="14"
                  x2="10"
                  y2="14"
                />
                <line
                  x1="14"
                  y1="14"
                  x2="16"
                  y2="14"
                />
                <line
                  x1="8"
                  y1="18"
                  x2="10"
                  y2="18"
                />
                <line
                  x1="14"
                  y1="18"
                  x2="16"
                  y2="18"
                />
              </svg>
            </div>
            <div class="recon__calc-title">
              <h2>Calculateur de Dosage</h2>
              <p>Entrez vos paramètres pour obtenir le volume exact</p>
            </div>
          </div>

          <!-- Calculator Grid -->
          <div class="recon__calc-grid">
            <!-- Inputs Side -->
            <div class="recon__inputs">
              <!-- Peptide Amount -->
              <div class="recon__input-group">
                <label class="recon__label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Quantité de Peptide (Vial)
                </label>
                <div class="recon__input-wrapper">
                  <input
                    type="number"
                    v-model="vialMg"
                    min="1"
                    step="1"
                    class="recon__input"
                  />
                  <span class="recon__input-unit">mg</span>
                </div>
                <span class="recon__input-hint">Ex: 2mg, 5mg, 10mg...</span>
              </div>

              <!-- Water Amount -->
              <div class="recon__input-group">
                <label class="recon__label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                  Eau Bactériostatique Ajoutée
                </label>
                <div class="recon__input-wrapper">
                  <input
                    type="number"
                    v-model="waterMl"
                    min="0.5"
                    step="0.1"
                    class="recon__input"
                  />
                  <span class="recon__input-unit">ml</span>
                </div>
                <span class="recon__input-hint">Généralement 1ml ou 2ml</span>
              </div>

              <!-- Desired Dose -->
              <div class="recon__input-group">
                <label class="recon__label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"
                    />
                  </svg>
                  Dose de Recherche Désirée
                </label>
                <div class="recon__input-wrapper">
                  <input
                    type="number"
                    v-model="doseMcg"
                    min="10"
                    step="10"
                    class="recon__input"
                  />
                  <span class="recon__input-unit">mcg</span>
                </div>
                <span class="recon__input-hint">Ex: 100mcg, 250mcg...</span>
              </div>

              <!-- Quick Presets -->
              <div class="recon__presets">
                <span class="recon__presets-label">Presets rapides :</span>
                <div class="recon__presets-btns">
                  <button
                    class="recon__preset-btn"
                    @click="applyPreset(5, 2, 250)"
                    :class="{ 'recon__preset-btn--active': isPresetActive(5, 2, 250) }"
                  >
                    5mg / 2ml / 250mcg
                  </button>
                  <button
                    class="recon__preset-btn"
                    @click="applyPreset(10, 2, 500)"
                    :class="{ 'recon__preset-btn--active': isPresetActive(10, 2, 500) }"
                  >
                    10mg / 2ml / 500mcg
                  </button>
                  <button
                    class="recon__preset-btn"
                    @click="applyPreset(2, 1, 100)"
                    :class="{ 'recon__preset-btn--active': isPresetActive(2, 1, 100) }"
                  >
                    2mg / 1ml / 100mcg
                  </button>
                </div>
              </div>
            </div>

            <!-- Results Side -->
            <div class="recon__results">
              <div class="recon__results-card">
                <!-- Result Header -->
                <div class="recon__results-header">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <span>Volume à prélever</span>
                </div>

                <!-- Main Result -->
                <div class="recon__results-main">
                  <span class="recon__results-value">{{ resultUnits }}</span>
                  <span class="recon__results-unit">UI</span>
                </div>

                <p class="recon__results-sub">
                  soit
                  <strong>{{ resultMl }} ml</strong>
                  de solution
                </p>

                <!-- Syringe Visual -->
                <div class="recon__syringe">
                  <div class="recon__syringe-body">
                    <!-- Marks -->
                    <div class="recon__syringe-marks">
                      <div
                        v-for="i in 11"
                        :key="i"
                        class="recon__syringe-mark"
                      >
                        <span v-if="i === 1">100</span>
                        <span v-else-if="i === 6">50</span>
                        <span v-else-if="i === 11">0</span>
                      </div>
                    </div>
                    <!-- Liquid -->
                    <div class="recon__syringe-track">
                      <div
                        class="recon__syringe-liquid"
                        :style="{ height: `${Math.min(resultUnits, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                  <span class="recon__syringe-label">Seringue U100 (1ml = 100 UI)</span>
                </div>

                <!-- Concentration Info -->
                <div class="recon__concentration">
                  <div class="recon__concentration-item">
                    <span class="recon__concentration-label">Concentration</span>
                    <span class="recon__concentration-value">{{ concentration }} mg/ml</span>
                  </div>
                  <div class="recon__concentration-item">
                    <span class="recon__concentration-label">Doses disponibles</span>
                    <span class="recon__concentration-value">{{ totalDoses }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Protocol Section -->
      <section class="recon__protocol">
        <div class="recon__protocol-header">
          <div class="recon__protocol-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="recon__protocol-title">Protocole de Reconstitution</h2>
            <p class="recon__protocol-subtitle">Suivez ces étapes pour une préparation optimale</p>
          </div>
        </div>

        <div class="recon__steps">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="recon__step"
          >
            <div class="recon__step-number">{{ index + 1 }}</div>
            <div
              class="recon__step-connector"
              v-if="index < steps.length - 1"
            ></div>
            <div class="recon__step-content">
              <div class="recon__step-icon">
                <component :is="step.iconComponent" />
              </div>
              <h3 class="recon__step-title">{{ step.title }}</h3>
              <p class="recon__step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Info Cards Section -->
      <section class="recon__info">
        <!-- Storage Card -->
        <div class="recon__info-card recon__info-card--info">
          <div class="recon__info-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 4v10.54a4 4 0 11-4 0V4a2 2 0 014 0z" />
            </svg>
          </div>
          <div class="recon__info-content">
            <h3 class="recon__info-title">Stockage après reconstitution</h3>
            <p class="recon__info-text">
              Une fois mélangé, le peptide doit être conservé au
              <strong>réfrigérateur (2-8°C)</strong>
              . À l'abri de la lumière. Durée de vie moyenne : 4 à 8 semaines.
            </p>
          </div>
          <div class="recon__info-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Important
          </div>
        </div>

        <!-- Warning Card -->
        <div class="recon__info-card recon__info-card--warning">
          <div class="recon__info-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="13"
              />
              <line
                x1="12"
                y1="17"
                x2="12.01"
                y2="17"
              />
            </svg>
          </div>
          <div class="recon__info-content">
            <h3 class="recon__info-title">Usage Recherche Uniquement</h3>
            <p class="recon__info-text">
              Ces informations sont fournies à titre éducatif pour la manipulation en laboratoire.
              Ne jamais utiliser sur des humains ou animaux.
            </p>
          </div>
          <div class="recon__info-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            Attention
          </div>
        </div>
      </section>

      <!-- Footer Trust -->
      <footer class="recon__footer">
        <div class="recon__footer-item">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Calculs précis</span>
        </div>
        <div class="recon__footer-item">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Mise à jour instantanée</span>
        </div>
        <div class="recon__footer-item">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
          <span>Guide complet</span>
        </div>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, h, ref } from 'vue'

  // ============================================
  // STATE
  // ============================================
  const vialMg = ref(5) // mg dans le flacon
  const waterMl = ref(2) // ml d'eau ajouté
  const doseMcg = ref(250) // dose cible en mcg

  // ============================================
  // COMPUTED
  // ============================================
  const concentration = computed(() => {
    const conc = vialMg.value / waterMl.value
    return isNaN(conc) || !isFinite(conc) ? 0 : Number(conc.toFixed(2))
  })

  const resultMl = computed(() => {
    const concentrationMgPerMl = vialMg.value / waterMl.value
    const doseMg = doseMcg.value / 1000
    const volume = doseMg / concentrationMgPerMl
    return isNaN(volume) || !isFinite(volume) ? 0 : Number(volume.toFixed(3))
  })

  const resultUnits = computed(() => {
    const units = resultMl.value * 100
    return Number(units.toFixed(1))
  })

  const totalDoses = computed(() => {
    if (resultMl.value === 0) return 0
    const doses = waterMl.value / resultMl.value
    return isNaN(doses) || !isFinite(doses) ? 0 : Math.floor(doses)
  })

  // ============================================
  // METHODS
  // ============================================
  function applyPreset(vial: number, water: number, dose: number) {
    vialMg.value = vial
    waterMl.value = water
    doseMcg.value = dose
  }

  function isPresetActive(vial: number, water: number, dose: number) {
    return vialMg.value === vial && waterMl.value === water && doseMcg.value === dose
  }

  // ============================================
  // STEP ICONS (inline SVG components)
  // ============================================
  const SprayIcon = {
    render() {
      return h(
        'svg',
        {
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', {
            d: 'M3 3h.01M7 3h.01M11 3h.01M3 7h.01M7 7h.01M11 7h.01M3 11h.01M7 11h.01M11 11h.01',
          }),
          h('rect', { x: 15, y: 5, width: 4, height: 14, rx: 1 }),
          h('path', { d: 'M19 9h2M19 13h2' }),
        ],
      )
    },
  }

  const SyringeIcon = {
    render() {
      return h(
        'svg',
        {
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', { d: 'M18 2l4 4M7.5 20.5L19 9l-4-4L3.5 16.5 2 22z' }),
          h('path', { d: 'M15 5l4 4M11 9l4 4' }),
        ],
      )
    },
  }

  const InjectIcon = {
    render() {
      return h(
        'svg',
        {
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [h('path', { d: 'M12 5v14M19 12l-7 7-7-7' })],
      )
    },
  }

  const RotateIcon = {
    render() {
      return h(
        'svg',
        {
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        [
          h('path', { d: 'M21 2v6h-6' }),
          h('path', { d: 'M3 12a9 9 0 0115-6.7L21 8' }),
          h('path', { d: 'M3 22v-6h6' }),
          h('path', { d: 'M21 12a9 9 0 01-15 6.7L3 16' }),
        ],
      )
    },
  }

  // ============================================
  // STEPS DATA
  // ============================================
  const steps = [
    {
      title: 'Préparation',
      desc: "Désinfectez le bouchon du flacon de peptide et celui de l'eau bactériostatique avec un tampon d'alcool isopropylique 70%.",
      iconComponent: SprayIcon,
    },
    {
      title: "Prélèvement de l'eau",
      desc: "À l'aide d'une seringue stérile, prélevez la quantité d'eau bactériostatique souhaitée (ex: 1ml ou 2ml). Évitez les bulles d'air.",
      iconComponent: SyringeIcon,
    },
    {
      title: 'Injection douce',
      desc: "Injectez l'eau lentement contre la paroi interne du flacon de peptide pour éviter d'endommager la poudre lyophilisée.",
      iconComponent: InjectIcon,
    },
    {
      title: 'Dissolution',
      desc: "Ne secouez jamais ! Faites rouler doucement le flacon entre vos mains jusqu'à dissolution complète. Patientez si nécessaire.",
      iconComponent: RotateIcon,
    },
  ]
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

  .recon {
    position: relative;
    min-height: 100vh;
    padding: 40px 24px 80px;

    // ============================================
    // BACKGROUND
    // ============================================
    &__bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    &__bg-gradient {
      position: absolute;
      inset: 0;
      // background: linear-gradient(
      //   160deg,
      //   @neutral-50 0%,
      //   white 50%,
      //   rgba(var(--primary-500-rgb), 0.03) 100%
      // );
    }

    &__bg-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: linear-gradient(to bottom, black 0%, transparent 70%);
    }

    &__bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);

      &--1 {
        top: 10%;
        right: 10%;
        width: 400px;
        height: 400px;
        background: rgba(var(--primary-400-rgb), 0.12);
      }

      &--2 {
        bottom: 20%;
        left: 5%;
        width: 300px;
        height: 300px;
        background: rgba(var(--primary-300-rgb), 0.08);
      }
    }

    // ============================================
    // CONTAINER
    // ============================================
    &__container {
      position: relative;
      z-index: 1;
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 60px;
    }

    // ============================================
    // HEADER
    // ============================================
    &__header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    &__header-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.1) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 50px;
      margin-bottom: 20px;

      svg {
        color: var(--primary-600);
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 600;
        color: var(--primary-700);
      }
    }

    &__title {
      font-family: @font-display;
      font-size: 42px;
      font-weight: 700;
      color: @neutral-900;
      margin: 0 0 16px;
      line-height: 1.1;
    }

    &__title-highlight {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 18px;
      color: @neutral-500;
      margin: 0;
      line-height: 1.6;
    }

    // ============================================
    // CALCULATOR CARD
    // ============================================
    &__calculator {
      width: 100%;
    }

    &__calc-card {
      background: white;
      border-radius: 28px;
      padding: 40px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.06),
        0 24px 64px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -100px;
        right: -100px;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.06) 0%, transparent 70%);
        pointer-events: none;
      }
    }

    &__calc-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid @neutral-100;
    }

    &__calc-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      border-radius: 16px;
      color: var(--primary-600);
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.15);
    }

    &__calc-title {
      h2 {
        font-family: @font-display;
        font-size: 22px;
        font-weight: 700;
        color: @neutral-900;
        margin: 0 0 4px;
      }

      p {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-500;
        margin: 0;
      }
    }

    &__calc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }

    // ============================================
    // INPUTS
    // ============================================
    &__inputs {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__input-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-700;

      svg {
        color: var(--primary-500);
      }
    }

    &__input-wrapper {
      display: flex;
      align-items: center;
      background: @neutral-50;
      border: 2px solid @neutral-200;
      border-radius: 14px;
      padding: 0 18px;
      transition: all 0.2s @ease;

      &:focus-within {
        background: white;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
      }
    }

    &__input {
      flex: 1;
      padding: 16px 0;
      border: none;
      background: transparent;
      font-family: @font-body;
      font-size: 18px;
      font-weight: 600;
      color: @neutral-900;
      outline: none;
      width: 100%;
      -moz-appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &::placeholder {
        color: @neutral-400;
        font-weight: 400;
      }
    }

    &__input-unit {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-400;
      margin-left: 12px;
      padding: 8px 12px;
      background: @neutral-100;
      border-radius: 8px;
    }

    &__input-hint {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;
      padding-left: 4px;
    }

    // ============================================
    // PRESETS
    // ============================================
    &__presets {
      margin-top: 8px;
      padding-top: 24px;
      border-top: 1px dashed @neutral-200;
    }

    &__presets-label {
      display: block;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    &__presets-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    &__preset-btn {
      padding: 10px 14px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 500;
      color: @neutral-600;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: white;
        border-color: var(--primary-300);
        color: var(--primary-700);
      }

      &--active {
        background: linear-gradient(
          135deg,
          rgba(var(--primary-500-rgb), 0.1) 0%,
          rgba(var(--primary-500-rgb), 0.05) 100%
        );
        border-color: var(--primary-300);
        color: var(--primary-700);
      }
    }
    // ============================================
    // RESULTS
    // ============================================
    &__results {
      display: flex;
      align-items: stretch;
    }

    &__results-card {
      flex: 1;
      background: linear-gradient(160deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
      border-radius: 24px;
      padding: 32px;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 8px 32px rgba(var(--secondary-900-rgb), 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      }

      &::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.1) 0%, transparent 60%);
        pointer-events: none;
      }
    }

    &__results-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50px;
      margin-bottom: 24px;

      svg {
        color: var(--primary-400);
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    &__results-main {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 8px;
    }

    &__results-value {
      font-family: @font-display;
      font-size: 72px;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(180deg, white 0%, rgba(255, 255, 255, 0.8) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    }

    &__results-unit {
      font-family: @font-body;
      font-size: 24px;
      font-weight: 600;
      color: var(--primary-400);
    }

    &__results-sub {
      font-family: @font-body;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 32px;

      strong {
        color: white;
        font-weight: 700;
      }
    }

    // ============================================
    // SYRINGE VISUAL
    // ============================================
    &__syringe {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }

    &__syringe-body {
      display: flex;
      align-items: stretch;
      gap: 8px;
      height: 180px;
    }

    &__syringe-marks {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px 0;

      .recon__syringe-mark {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 2px;

        &::after {
          content: '';
          width: 8px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 1px;
        }

        span {
          font-family: @font-body;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          min-width: 20px;
          text-align: right;
        }
      }
    }

    &__syringe-track {
      width: 32px;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      position: relative;
      overflow: hidden;
    }

    &__syringe-liquid {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(180deg, var(--primary-400) 0%, var(--primary-500) 100%);
      border-radius: 0 0 12px 12px;
      transition: height 0.5s @bounce;
      box-shadow:
        0 0 20px rgba(var(--primary-400-rgb), 0.5),
        inset 0 2px 4px rgba(255, 255, 255, 0.3);

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 4px;
        right: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 2px;
      }
    }

    &__syringe-label {
      font-family: @font-body;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
    }

    // ============================================
    // CONCENTRATION INFO
    // ============================================
    &__concentration {
      display: flex;
      gap: 24px;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      width: 100%;
    }

    &__concentration-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: center;

      &:first-child {
        border-right: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    &__concentration-label {
      font-family: @font-body;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__concentration-value {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 700;
      color: white;
    }

    // ============================================
    // PROTOCOL SECTION
    // ============================================
    &__protocol {
      padding: 48px;
      background: white;
      border-radius: 28px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
    }

    &__protocol-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 40px;
    }

    &__protocol-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      border-radius: 16px;
      color: var(--primary-600);
    }

    &__protocol-title {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 700;
      color: @neutral-900;
      margin: 0 0 4px;
    }

    &__protocol-subtitle {
      font-family: @font-body;
      font-size: 15px;
      color: @neutral-500;
      margin: 0;
    }

    // ============================================
    // STEPS
    // ============================================
    &__steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    &__step {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    &__step-number {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 50%;
      font-family: @font-display;
      font-size: 16px;
      font-weight: 700;
      color: white;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);
      position: relative;
      z-index: 2;
    }

    &__step-connector {
      position: absolute;
      top: 18px;
      left: calc(50% + 24px);
      width: calc(100% - 48px);
      height: 2px;
      background: linear-gradient(90deg, var(--primary-300), @neutral-200);
      z-index: 1;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: -3px;
        width: 8px;
        height: 8px;
        border-top: 2px solid @neutral-300;
        border-right: 2px solid @neutral-300;
        transform: rotate(45deg);
      }
    }

    &__step-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    &__step-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 18px;
      color: var(--primary-600);
      transition: all 0.3s @ease;

      .recon__step:hover & {
        background: white;
        border-color: var(--primary-200);
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.15);
      }
    }

    &__step-title {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0;
    }

    &__step-desc {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      margin: 0;
      line-height: 1.6;
      max-width: 200px;
    }

    // ============================================
    // INFO CARDS
    // ============================================
    &__info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    &__info-card {
      position: relative;
      display: flex;
      gap: 20px;
      padding: 28px;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s @ease;

      &:hover {
        transform: translateY(-4px);
      }

      &--info {
        background: linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.08) 0%,
          rgba(59, 130, 246, 0.03) 100%
        );
        border: 1px solid rgba(59, 130, 246, 0.15);

        .recon__info-icon {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .recon__info-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        &:hover {
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
        }
      }

      &--warning {
        background: linear-gradient(
          135deg,
          rgba(245, 158, 11, 0.08) 0%,
          rgba(245, 158, 11, 0.03) 100%
        );
        border: 1px solid rgba(245, 158, 11, 0.2);

        .recon__info-icon {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .recon__info-badge {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        &:hover {
          box-shadow: 0 8px 32px rgba(245, 158, 11, 0.15);
        }
      }
    }

    &__info-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      flex-shrink: 0;
    }

    &__info-content {
      flex: 1;
    }

    &__info-title {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 8px;
    }

    &__info-text {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-600;
      margin: 0;
      line-height: 1.6;

      strong {
        color: @neutral-800;
        font-weight: 600;
      }
    }

    &__info-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 50px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
    }

    // ============================================
    // FOOTER
    // ============================================
    &__footer {
      display: flex;
      justify-content: center;
      gap: 40px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      border: 1px solid @neutral-100;
    }

    &__footer-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;

      svg {
        color: var(--primary-500);
      }
    }

    // ============================================
    // RESPONSIVE
    // ============================================
    @media (max-width: 1000px) {
      &__calc-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      &__steps {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
      }

      &__step-connector {
        display: none;
      }
    }

    @media (max-width: 768px) {
      padding: 24px 16px 60px;

      &__container {
        gap: 40px;
      }

      &__title {
        font-size: 32px;
      }

      &__subtitle {
        font-size: 16px;
      }

      &__calc-card {
        padding: 24px;
        border-radius: 20px;
      }

      &__calc-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      &__protocol {
        padding: 28px;
      }

      &__steps {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      &__step {
        flex-direction: row;
        text-align: left;
        gap: 20px;
        padding: 20px;
        background: @neutral-50;
        border-radius: 16px;
      }

      &__step-number {
        margin-bottom: 0;
        flex-shrink: 0;
      }

      &__step-content {
        align-items: flex-start;
        flex: 1;
      }

      &__step-icon {
        width: 48px;
        height: 48px;
      }

      &__step-desc {
        max-width: none;
      }

      &__info {
        grid-template-columns: 1fr;
      }

      &__info-card {
        flex-direction: column;
        text-align: center;
        padding: 24px;
      }

      &__info-icon {
        margin: 0 auto;
      }

      &__info-badge {
        position: static;
        align-self: center;
        margin-top: 16px;
      }

      &__footer {
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      &__results-value {
        font-size: 56px;
      }

      &__syringe-body {
        height: 150px;
      }
    }

    @media (max-width: 480px) {
      &__title {
        font-size: 28px;
      }

      &__presets-btns {
        flex-direction: column;
      }

      &__preset-btn {
        width: 100%;
        text-align: center;
      }

      &__concentration {
        flex-direction: column;
        gap: 16px;
      }

      &__concentration-item:first-child {
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 16px;
      }
    }
  }
</style>
