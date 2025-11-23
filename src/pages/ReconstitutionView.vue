<template>
  <div class="reconstitution-page">
    <PageHeader />
    <div class="reconstitution-layout">
      <section
        class="calculator-section"
        v-motion="{
          initial: { opacity: 0, y: 30 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.1, type: 'spring' } },
        }"
      >
        <div class="calculator-card">
          <div class="calculator-header">
            <div class="calculator-icon">
              <BasicIconNext
                name="Calculator"
                :size="24"
                color="primary-600"
              />
            </div>
            <BasicText
              size="h4"
              weight="bold"
              color="neutral-900"
            >
              Calculateur de Dosage
            </BasicText>
          </div>
          <div class="calculator-grid">
            <div class="calculator-inputs">
              <div class="input-group">
                <label>Quantité de Peptide (Vial)</label>
                <div class="input-wrapper">
                  <input
                    type="number"
                    v-model="vialMg"
                    min="1"
                    step="1"
                  />
                  <span class="unit">mg</span>
                </div>
                <small>Ex: 2mg, 5mg, 10mg...</small>
              </div>
              <div class="input-group">
                <label>Eau Bactériostatique Ajoutée</label>
                <div class="input-wrapper">
                  <input
                    type="number"
                    v-model="waterMl"
                    min="0.5"
                    step="0.1"
                  />
                  <span class="unit">ml</span>
                </div>
                <small>Généralement 1ml ou 2ml</small>
              </div>
              <div class="input-group">
                <label>Dose de Recherche Désirée</label>
                <div class="input-wrapper">
                  <input
                    type="number"
                    v-model="doseMcg"
                    min="10"
                    step="10"
                  />
                  <span class="unit">mcg</span>
                </div>
                <small>Ex: 100mcg, 250mcg...</small>
              </div>
            </div>
            <div class="calculator-results">
              <div class="result-display">
                <BasicText
                  size="body-s"
                  color="neutral-500"
                  align="center"
                >
                  Volume à prélever sur une seringue U100
                </BasicText>

                <div class="result-main">
                  <span class="result-value">{{ resultUnits }}</span>
                  <span class="result-unit">Unités (UI)</span>
                </div>
                <div class="result-sub">
                  soit
                  <strong>{{ resultMl }} ml</strong>
                  de solution
                </div>
                <div class="syringe-gauge">
                  <div class="syringe-track">
                    <div class="syringe-marks">
                      <div
                        v-for="i in 11"
                        :key="i"
                        class="mark"
                      ></div>
                    </div>
                    <div
                      class="syringe-liquid"
                      :style="{ height: `${Math.min(resultUnits, 100)}%` }"
                    ></div>
                  </div>
                  <div class="syringe-label">100 UI (1ml)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        class="protocol-section"
        v-motion="{
          initial: { opacity: 0, y: 30 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.3, type: 'spring' } },
        }"
      >
        <BasicText
          size="h3"
          weight="bold"
          class="mb-6"
        >
          Protocole de Reconstitution
        </BasicText>
        <div class="steps-grid">
          <div
            class="step-card"
            v-for="(step, index) in steps"
            :key="index"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon">
              <BasicIconNext
                :name="step.icon"
                :size="28"
                color="primary-600"
              />
            </div>
            <div class="step-content">
              <BasicText
                size="h5"
                weight="bold"
              >
                {{ step.title }}
              </BasicText>
              <BasicText
                size="body-s"
                color="neutral-600"
              >
                {{ step.desc }}
              </BasicText>
            </div>
          </div>
        </div>
      </section>
      <section class="storage-section">
        <div class="storage-card info">
          <BasicIconNext
            name="ThermometerSnowflake"
            :size="32"
            color="info-600"
          />
          <div>
            <BasicText weight="bold">Stockage après reconstitution</BasicText>
            <BasicText
              size="body-s"
              color="neutral-600"
            >
              Une fois mélangé, le peptide doit être conservé au
              <strong>réfrigérateur (2-8°C)</strong>
              . À l'abri de la lumière. Durée de vie moyenne : 4 à 8 semaines.
            </BasicText>
          </div>
        </div>
        <div class="storage-card warning">
          <BasicIconNext
            name="AlertTriangle"
            :size="32"
            color="warning-600"
          />
          <div>
            <BasicText weight="bold">Usage Recherche Uniquement</BasicText>
            <BasicText
              size="body-s"
              color="neutral-600"
            >
              Ces informations sont données à titre éducatif pour la manipulation en laboratoire. Ne
              jamais utiliser sur des humains ou animaux.
            </BasicText>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed, ref } from 'vue'

  // --- STATE CALCULATOR ---
  const vialMg = ref(5) // mg dans le flacon
  const waterMl = ref(2) // ml d'eau ajouté
  const doseMcg = ref(250) // dose cible en mcg

  // --- LOGIC ---
  const resultMl = computed(() => {
    // Formule : (Dose Désirée (mcg) / 1000) / (Vial (mg) / Eau (ml))
    const concentrationMgPerMl = vialMg.value / waterMl.value
    const doseMg = doseMcg.value / 1000
    const volume = doseMg / concentrationMgPerMl

    // Arrondi à 4 décimales, max 1ml (la seringue standard)
    return isNaN(volume) || !isFinite(volume) ? 0 : Number(volume.toFixed(3))
  })

  const resultUnits = computed(() => {
    // 1ml = 100 UI (Unités Internationales sur seringue insuline standard)
    const units = resultMl.value * 100
    return Number(units.toFixed(1))
  })

  // --- DATA STEPS ---
  const steps: { title: string; desc: string; icon: IconNameNext }[] = [
    {
      title: 'Préparation',
      desc: "Désinfectez le bouchon du flacon de peptide et celui de l'eau bactériostatique avec un tampon d'alcool.",
      icon: 'SprayCan', // ou 'Droplets' selon tes icones dispos
    },
    {
      title: "Prélèvement de l'eau",
      desc: "À l'aide d'une seringue stérile, prélevez la quantité d'eau bactériostatique souhaitée (ex: 1ml ou 2ml).",
      icon: 'Syringe',
    },
    {
      title: 'Injection douce',
      desc: "Injectez l'eau lentement contre la paroi interne du flacon de peptide pour éviter d'abîmer la poudre (lyophilisat).",
      icon: 'ArrowDownToLine',
    },
    {
      title: 'Dissolution',
      desc: "Ne secouez pas ! Faites rouler doucement le flacon entre vos mains jusqu'à dissolution complète.",
      icon: 'RotateCw',
    },
  ]
</script>

<style scoped lang="less">
  .reconstitution-page {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 30px 20px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .reconstitution-layout {
    display: flex;
    flex-direction: column;
    gap: 60px;
  }

  // --- 1. CALCULATOR CARD (THE HERO) ---
  .calculator-card {
    background: white;
    border-radius: 24px;
    border: 1px solid @neutral-200;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); // Grosse ombre pour le relief
    padding: 40px;
    position: relative;
    overflow: hidden;

    // Effet décoratif en fond
    &::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.1), transparent 70%);
      border-radius: 50%;
    }
  }

  .calculator-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;

    .calculator-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-50);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .calculator-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  // INPUTS STYLING
  .input-group {
    margin-bottom: 24px;

    label {
      display: block;
      font-weight: 600;
      color: @neutral-700;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 0 16px;
      transition: all 0.2s;

      &:focus-within {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
        background: white;
      }

      input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 14px 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: @neutral-900;
        outline: none;
        width: 100%;
      }

      .unit {
        color: @neutral-400;
        font-weight: 500;
        font-size: 0.9rem;
        margin-left: 8px;
      }
    }

    small {
      display: block;
      margin-top: 6px;
      color: @neutral-400;
      font-size: 0.8rem;
    }
  }

  // RESULTS STYLING
  .calculator-results {
    background: linear-gradient(135deg, var(--primary-600), var(--secondary-700));
    border-radius: 20px;
    padding: 30px;
    color: white;
    box-shadow: 0 10px 30px rgba(var(--primary-600-rgb), 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .result-display {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .result-main {
    margin: 20px 0 5px;
    display: flex;
    align-items: baseline;
    gap: 8px;

    .result-value {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .result-unit {
      font-size: 1.2rem;
      font-weight: 500;
      opacity: 0.9;
    }
  }

  .result-sub {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 30px;

    strong {
      color: white;
      font-weight: 700;
    }
  }

  // SYRINGE GAUGE
  .syringe-gauge {
    width: 60px;
    height: 200px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .syringe-track {
    width: 24px;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .syringe-liquid {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white; // Le liquide est blanc pour contraster avec le fond bleu
    transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); // Effet rebond fluide
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .syringe-marks {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;
    pointer-events: none; // Clic through
    z-index: 2;

    .mark {
      width: 8px;
      height: 1px;
      background: rgba(255, 255, 255, 0.5);
      align-self: flex-end;
      margin-right: 4px;
    }
  }

  .syringe-label {
    margin-top: 8px;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  // --- 2. STEPS PROTOCOL ---
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }

  .step-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid @neutral-200;
    border-radius: 16px;
    padding: 24px;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      background: white;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }

    .step-number {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 3rem;
      font-weight: 900;
      color: @neutral-600;
      line-height: 1;
      z-index: 0;
    }

    .step-icon {
      width: 50px;
      height: 50px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      position: relative;
      z-index: 1;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    }

    .step-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  // --- 3. STORAGE & WARNING ---
  .storage-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    @media (max-width: 700px) {
      grid-template-columns: 1fr;
    }
  }

  .storage-card {
    padding: 24px;
    border-radius: 16px;
    display: flex;
    gap: 20px;
    align-items: flex-start;

    &.info {
      background: rgba(var(--info-50-rgb), 0.5);
      border: 1px solid var(--info-200);
    }

    &.warning {
      background: rgba(var(--warning-50-rgb), 0.5);
      border: 1px solid var(--warning-200);
    }
  }
</style>
