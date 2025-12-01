<template>
  <div class="relay-selector">
    <!-- Point sélectionné -->
    <div
      v-if="hasSelection && selectedPoint"
      class="relay-selector__selected"
    >
      <div class="relay-selector__badge">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div class="relay-selector__info">
        <span class="relay-selector__label">Point relais sélectionné</span>
        <h4 class="relay-selector__name">{{ selectedPoint.name }}</h4>
        <p class="relay-selector__address">
          {{ selectedPoint.address }}
          <br />
          {{ selectedPoint.zipCode }} {{ selectedPoint.city }}
        </p>
        <span
          v-if="selectedPoint.distance"
          class="relay-selector__distance"
        >
          <svg
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
            <path d="M12 6v6l4 2" />
          </svg>
          {{ (selectedPoint.distance / 1000).toFixed(1) }} km
        </span>
      </div>

      <div class="relay-selector__actions">
        <button
          type="button"
          class="relay-selector__btn relay-selector__btn--outline"
          @click="openModal"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Modifier
        </button>
        <button
          type="button"
          class="relay-selector__btn relay-selector__btn--ghost"
          @click="handleReset"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Bouton ouvrir -->
    <button
      v-else
      type="button"
      class="relay-selector__trigger"
      :disabled="isLoading"
      @click="openModal"
    >
      <div class="relay-selector__trigger-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle
            cx="12"
            cy="10"
            r="3"
          />
        </svg>
      </div>
      <div class="relay-selector__trigger-content">
        <span class="relay-selector__trigger-title">{{ buttonLabel }}</span>
        <span class="relay-selector__trigger-subtitle">Gratuit • Retrait en 48-72h</span>
      </div>
      <svg
        class="relay-selector__trigger-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="relay-modal">
        <div
          v-if="showModal"
          class="relay-modal-overlay"
          @click.self="closeModal"
        >
          <div class="relay-modal">
            <!-- Header compact -->
            <div class="relay-modal__header">
              <div class="relay-modal__header-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                  />
                </svg>
              </div>
              <div class="relay-modal__header-text">
                <h3 class="relay-modal__title">Choisir un point relais</h3>
                <p class="relay-modal__subtitle">Retrait gratuit sous 48-72h</p>
              </div>
              <button
                type="button"
                class="relay-modal__close"
                @click="closeModal"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Recherche -->
            <div class="relay-modal__search">
              <div class="relay-modal__search-field">
                <svg
                  class="relay-modal__search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  v-model="postcodeInput"
                  type="text"
                  placeholder="Entrez votre code postal..."
                  class="relay-modal__search-input"
                  @keyup.enter="handleSearch"
                />
                <button
                  v-if="postcodeInput"
                  type="button"
                  class="relay-modal__search-clear"
                  @click="postcodeInput = ''"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                class="relay-modal__search-btn"
                :disabled="postcodeInput.length < 4 || isLoading"
                @click="handleSearch"
              >
                <span
                  v-if="isLoading"
                  class="relay-modal__spinner"
                ></span>
                <span v-else>Rechercher</span>
              </button>
            </div>
            <!-- Corps -->
            <div class="relay-modal__body">
              <!-- Erreur -->
              <div
                v-if="error"
                class="relay-modal__error"
              >
                <svg
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
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>{{ error }}</span>
              </div>

              <!-- Loading -->
              <div
                v-else-if="isLoading"
                class="relay-modal__loading"
              >
                <div class="relay-modal__loading-spinner"></div>
                <p>Recherche des points relais...</p>
              </div>

              <!-- Résultats -->
              <div
                v-else-if="searchResults.length > 0"
                class="relay-modal__results"
              >
                <div class="relay-modal__results-header">
                  <span>{{ searchResults.length }} points relais trouvés</span>
                </div>
                <div class="relay-modal__results-list">
                  <button
                    v-for="(point, index) in searchResults"
                    :key="point.id"
                    type="button"
                    class="relay-point"
                    :style="{ '--delay': `${index * 50}ms` }"
                    @click="handleSelect(point)"
                  >
                    <div class="relay-point__marker">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div class="relay-point__info">
                      <span class="relay-point__name">{{ point.name }}</span>
                      <span class="relay-point__address">{{ point.address }}</span>
                      <span class="relay-point__city">{{ point.zipCode }} {{ point.city }}</span>
                    </div>
                    <div class="relay-point__meta">
                      <span
                        v-if="point.distance"
                        class="relay-point__distance"
                      >
                        {{ (point.distance / 1000).toFixed(1) }} km
                      </span>
                      <svg
                        class="relay-point__chevron"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- État vide -->
              <div
                v-else
                class="relay-modal__empty"
              >
                <div class="relay-modal__empty-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="3"
                    />
                  </svg>
                </div>
                <h4>Trouvez votre point relais</h4>
                <p>
                  Entrez votre code postal pour découvrir les points de retrait disponibles près de
                  chez vous.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="relay-modal__footer">
              <div class="relay-modal__footer-info">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                  />
                </svg>
                <span>Livraison offerte en point relais</span>
              </div>
              <button
                type="button"
                class="relay-selector__btn relay-selector__btn--secondary"
                @click="closeModal"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { type OrderRelayData, type RelayPoint, useRelayPoint } from './relay'

  // Props
  const props = withDefaults(
    defineProps<{
      defaultPostcode?: string
      buttonLabel?: string
    }>(),
    {
      defaultPostcode: '',
      buttonLabel: 'Choisir un point relais',
    },
  )

  // defineModel pour v-model natif (Vue 3.4+)
  const model = defineModel<RelayPoint | null>({ default: null })

  // Emits additionnels
  const emit = defineEmits<{
    (e: 'select', point: RelayPoint): void
    (e: 'order-data', data: OrderRelayData): void
    (e: 'error', message: string): void
  }>()

  // Composable
  const {
    selectedPoint,
    searchResults,
    isLoading,
    error,
    hasSelection,
    orderRelayData,
    searchByPostcode,
    selectPoint,
    clearSelection,
  } = useRelayPoint()

  // Local state
  const showModal = ref(false)
  const postcodeInput = ref(props.defaultPostcode)

  // Sync model -> composable
  watch(
    model,
    (newVal) => {
      if (newVal === null) {
        clearSelection()
      }
    },
    { immediate: true },
  )

  // Sync composable -> model
  watch(selectedPoint, (point) => {
    model.value = point
  })

  // Error forwarding
  watch(error, (newError) => {
    if (newError) emit('error', newError)
  })

  // Methods
  async function openModal() {
    showModal.value = true
    if (postcodeInput.value.length >= 4) {
      await searchByPostcode(postcodeInput.value)
    }
  }

  function closeModal() {
    showModal.value = false
  }

  async function handleSearch() {
    if (postcodeInput.value.length >= 4) {
      await searchByPostcode(postcodeInput.value)
    }
  }

  function handleSelect(point: RelayPoint) {
    selectPoint(point)
    emit('select', point)
    if (orderRelayData.value) {
      emit('order-data', orderRelayData.value)
    }
    closeModal()
  }

  function handleReset() {
    clearSelection()
    model.value = null
  }
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

  // ============================================
  // SELECTOR - État sélectionné
  // ============================================
  .relay-selector {
    &__selected {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(@success-500, 0.08) 0%, white 100%);
      border: 2px solid @success-500;
      border-radius: 16px;
    }

    &__badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: @success-500;
      border-radius: 50%;
      color: white;
      flex-shrink: 0;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    &__info {
      flex: 1;
      min-width: 0;
    }

    &__label {
      display: inline-block;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: @success-700;
      background: rgba(@success-500, 0.15);
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    &__name {
      margin: 0 0 4px;
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-900;
    }

    &__address {
      margin: 0;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
      line-height: 1.5;
    }

    &__distance {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      font-family: @font-body;
      font-size: 13px;
      color: @success-700;
      font-weight: 500;

      svg {
        width: 14px;
        height: 14px;
      }
    }

    &__actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    // ============================================
    // BUTTONS
    // ============================================
    &__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s @ease;

      svg {
        width: 16px;
        height: 16px;
      }

      &--outline {
        background: white;
        color: @neutral-700;
        border: 1px solid @neutral-200;

        &:hover {
          background: @neutral-50;
          border-color: @success-500;
          color: @success-700;
        }
      }

      &--ghost {
        background: transparent;
        color: @neutral-500;
        padding: 10px;

        &:hover {
          background: rgba(@danger-500, 0.1);
          color: @danger-500;
        }
      }

      &--secondary {
        background: @neutral-100;
        color: @neutral-700;

        &:hover {
          background: @neutral-200;
        }
      }
    }

    // ============================================
    // TRIGGER - État non sélectionné
    // ============================================
    &__trigger {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(@success-500, 0.08) 0%, white 100%);
      border: 2px dashed @success-500;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s @ease;
      text-align: left;

      &:hover {
        background: rgba(@success-500, 0.12);
        border-style: solid;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(@success-500, 0.15);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
        border-radius: 12px;
        color: white;
        flex-shrink: 0;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      &-content {
        flex: 1;
        min-width: 0;
      }

      &-title {
        display: block;
        font-family: @font-display;
        font-weight: 600;
        font-size: 15px;
        color: @neutral-900;
      }

      &-subtitle {
        display: block;
        font-family: @font-body;
        font-size: 13px;
        color: @success-700;
        margin-top: 2px;
      }

      &-arrow {
        width: 20px;
        height: 20px;
        color: @neutral-400;
        flex-shrink: 0;
        transition: transform 0.2s @ease;
      }

      &:hover &-arrow {
        transform: translateX(4px);
        color: @success-500;
      }
    }
  }

  // ============================================
  // MODAL OVERLAY
  // ============================================
  .relay-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 9999;
  }

  // ============================================
  // MODAL
  // ============================================
  .relay-modal {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

    // Header compact
    &__header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 24px;
      background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
      color: white;

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        flex-shrink: 0;

        svg {
          width: 22px;
          height: 22px;
        }
      }

      &-text {
        flex: 1;
        min-width: 0;
      }
    }

    &__title {
      margin: 0;
      font-family: @font-display;
      font-size: 17px;
      font-weight: 600;
    }

    &__subtitle {
      margin: 2px 0 0;
      font-family: @font-body;
      font-size: 13px;
      opacity: 0.9;
    }

    &__close {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      transition: all 0.2s @ease;
      flex-shrink: 0;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }
    }

    // Search
    &__search {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      background: @neutral-50;
      border-bottom: 1px solid @neutral-100;

      &-field {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 14px;
        background: white;
        border: 2px solid @neutral-200;
        border-radius: 10px;
        transition: all 0.2s @ease;

        &:focus-within {
          border-color: @success-500;
          box-shadow: 0 0 0 3px rgba(@success-500, 0.1);
        }
      }

      &-icon {
        width: 18px;
        height: 18px;
        color: @neutral-400;
        flex-shrink: 0;
      }

      &-input {
        flex: 1;
        padding: 12px 0;
        background: transparent;
        border: none;
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-900;
        min-width: 0;

        &::placeholder {
          color: @neutral-400;
        }

        &:focus {
          outline: none;
        }
      }

      &-clear {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: @neutral-200;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        color: @neutral-500;
        flex-shrink: 0;
        transition: all 0.15s @ease;

        svg {
          width: 12px;
          height: 12px;
        }

        &:hover {
          background: @neutral-300;
          color: @neutral-700;
        }
      }

      &-btn {
        padding: 12px 20px;
        background: @success-500;
        color: white;
        border: none;
        border-radius: 10px;
        font-family: @font-body;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s @ease;
        white-space: nowrap;
        flex-shrink: 0;

        &:hover:not(:disabled) {
          background: @success-600;
          transform: translateY(-1px);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    &__spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    &__spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // Body
    &__body {
      flex: 1;
      overflow-y: auto;
      min-height: 180px;
      max-height: 360px;
    }

    // Results
    &__results {
      &-header {
        padding: 10px 24px;
        background: rgba(@success-500, 0.08);
        border-bottom: 1px solid rgba(@success-500, 0.15);
        font-family: @font-body;
        font-size: 13px;
        font-weight: 600;
        color: @success-700;
      }

      &-list {
        padding: 12px;
      }
    }

    // Empty state
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 32px;
      text-align: center;

      &-icon {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(@success-500, 0.1);
        border-radius: 50%;
        color: @success-500;
        margin-bottom: 16px;

        svg {
          width: 32px;
          height: 32px;
        }
      }

      h4 {
        margin: 0 0 8px;
        font-family: @font-display;
        font-size: 16px;
        font-weight: 600;
        color: @neutral-800;
      }

      p {
        margin: 0;
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-500;
        max-width: 260px;
        line-height: 1.5;
      }
    }

    // Loading
    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 32px;
      color: @neutral-500;

      &-spinner {
        width: 36px;
        height: 36px;
        border: 3px solid rgba(@success-500, 0.2);
        border-top-color: @success-500;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }

      p {
        margin: 0;
        font-family: @font-body;
        font-size: 14px;
      }
    }

    // Error
    &__error {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px 24px;
      padding: 14px 16px;
      background: rgba(@danger-500, 0.08);
      border: 1px solid rgba(@danger-500, 0.2);
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @danger-500;

      svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
    }

    // Footer
    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 24px;
      border-top: 1px solid @neutral-100;
      background: @neutral-50;

      &-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: @font-body;
        font-size: 13px;
        color: @success-700;
        font-weight: 500;

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  // ============================================
  // RELAY POINT (résultat)
  // ============================================
  .relay-point {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px;
    background: white;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s @ease;
    animation: slideIn 0.3s @ease forwards;
    animation-delay: var(--delay, 0ms);
    opacity: 0;

    &:hover {
      background: rgba(@success-500, 0.06);
      border-color: @success-500;
      transform: translateX(4px);
    }

    &__marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: @success-500;
      flex-shrink: 0;

      svg {
        width: 26px;
        height: 26px;
      }
    }

    &__info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__name {
      font-family: @font-display;
      font-weight: 600;
      font-size: 14px;
      color: @neutral-900;
    }

    &__address,
    &__city {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
    }

    &__meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }

    &__distance {
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @success-700;
      background: rgba(@success-500, 0.12);
      padding: 4px 8px;
      border-radius: 6px;
    }

    &__chevron {
      width: 16px;
      height: 16px;
      color: @neutral-400;
      transition: transform 0.2s @ease;
    }

    &:hover &__chevron {
      transform: translateX(4px);
      color: @success-500;
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Modal transitions
  .relay-modal-enter-active {
    transition: opacity 0.25s @ease;

    .relay-modal {
      transition:
        transform 0.25s @ease,
        opacity 0.25s @ease;
    }
  }

  .relay-modal-leave-active {
    transition: opacity 0.2s @ease;

    .relay-modal {
      transition:
        transform 0.2s @ease,
        opacity 0.2s @ease;
    }
  }

  .relay-modal-enter-from,
  .relay-modal-leave-to {
    opacity: 0;

    .relay-modal {
      transform: scale(0.95) translateY(16px);
      opacity: 0;
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  @media (max-width: 480px) {
    .relay-modal-overlay {
      align-items: flex-end;
      padding: 0;
    }

    .relay-modal {
      max-height: 90vh;
      border-radius: 20px 20px 0 0;
    }

    .relay-modal__search {
      flex-direction: column;
    }

    .relay-modal__search-btn {
      width: 100%;
    }

    .relay-selector__selected {
      flex-direction: column;
    }

    .relay-selector__actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
