<template>
  <Teleport to="body">
    <Transition name="age-gate-fade">
      <div
        v-if="showGate"
        class="age-gate"
        @click.self="handleBackdropClick"
      >
        <div class="age-gate__modal">
          <!-- Logo / Header -->
          <div class="age-gate__header">
            <div class="age-gate__icon">
              <BasicIconNext name="ShieldAlert" :size="32" />
            </div>
            <h1 class="age-gate__title">{{ t('ageGate.title') }}</h1>
          </div>

          <!-- Content -->
          <div class="age-gate__content">
            <p class="age-gate__text">{{ t('ageGate.description') }}</p>

            <div class="age-gate__warning">
              <BasicIconNext name="AlertTriangle" :size="20" />
              <span>{{ t('ageGate.researchOnly') }}</span>
            </div>

            <ul class="age-gate__list">
              <li>
                <BasicIconNext name="Check" :size="16" />
                <span>{{ t('ageGate.condition1') }}</span>
              </li>
              <li>
                <BasicIconNext name="Check" :size="16" />
                <span>{{ t('ageGate.condition2') }}</span>
              </li>
              <li>
                <BasicIconNext name="Check" :size="16" />
                <span>{{ t('ageGate.condition3') }}</span>
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="age-gate__actions">
            <PremiumButton
              type="success"
              variant="solid"
              size="lg"
              :label="t('ageGate.confirm')"
              icon-left="Check"
              :shine="true"
              block
              @click="confirmAge"
            />
            <PremiumButton
              type="secondary"
              variant="outline"
              size="lg"
              :label="t('ageGate.decline')"
              icon-left="X"
              block
              @click="declineAge"
            />
          </div>

          <!-- Footer -->
          <p class="age-gate__footer">
            {{ t('ageGate.footer') }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const STORAGE_KEY = 'atlas_age_verified'
const showGate = ref(false)

onMounted(() => {
  // Vérifier si l'utilisateur a déjà confirmé son âge
  const verified = localStorage.getItem(STORAGE_KEY)
  if (verified !== 'true') {
    showGate.value = true
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden'
  }
})

function confirmAge() {
  localStorage.setItem(STORAGE_KEY, 'true')
  showGate.value = false
  document.body.style.overflow = ''
}

function declineAge() {
  // Rediriger vers Google
  window.location.href = 'https://www.google.com'
}

function handleBackdropClick() {
  // Ne rien faire - empêcher la fermeture par clic extérieur
}
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.age-gate {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);

  &__modal {
    width: 100%;
    max-width: 480px;
    background: @white;
    border-radius: 24px;
    padding: 40px;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    animation: modal-enter 0.4s @ease;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__icon {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, @danger-100 0%, @danger-50 100%);
    border: 2px solid @danger-200;
    border-radius: 20px;
    color: @danger-600;
  }

  &__title {
    font-family: @font-display;
    font-size: 24px;
    font-weight: 700;
    color: @neutral-900;
    text-align: center;
    margin: 0;
  }

  &__content {
    margin-bottom: 32px;
  }

  &__text {
    font-family: @font-body;
    font-size: 15px;
    line-height: 1.6;
    color: @neutral-600;
    text-align: center;
    margin: 0 0 20px;
  }

  &__warning {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 20px;
    background: linear-gradient(135deg, @warning-100 0%, @warning-50 100%);
    border: 1px solid @warning-200;
    border-radius: 12px;
    margin-bottom: 20px;

    svg {
      color: @warning-600;
      flex-shrink: 0;
    }

    span {
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: @warning-700;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: @neutral-50;
      border-radius: 10px;

      svg {
        color: @success-500;
        flex-shrink: 0;
        margin-top: 2px;
      }

      span {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-700;
        line-height: 1.4;
      }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__footer {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-400;
    text-align: center;
    margin: 0;
    line-height: 1.5;
  }
}

// Animations
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.age-gate-fade-enter-active {
  transition: opacity 0.3s @ease;

  .age-gate__modal {
    animation: modal-enter 0.4s @ease;
  }
}

.age-gate-fade-leave-active {
  transition: opacity 0.3s @ease;
}

.age-gate-fade-enter-from,
.age-gate-fade-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: 480px) {
  .age-gate {
    padding: 16px;

    &__modal {
      padding: 28px 24px;
      border-radius: 20px;
    }

    &__icon {
      width: 60px;
      height: 60px;
    }

    &__title {
      font-size: 20px;
    }

    &__text {
      font-size: 14px;
    }

    &__list li {
      padding: 10px 14px;

      span {
        font-size: 13px;
      }
    }

  }
}
</style>
