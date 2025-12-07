<template>
  <div class="track-search">
    <div class="track-search__layout">
      <!-- Main Search Card -->
      <ContentBlock variant="card" size="lg" class="track-search__card">
        <div class="track-search__header">
          <div class="track-search__icon">
            <BasicIconNext name="Search" :size="28" />
          </div>
          <div>
            <h2 class="track-search__title">Localiser ma commande</h2>
            <p class="track-search__subtitle">Entrez vos informations pour accéder au suivi détaillé</p>
          </div>
        </div>

        <form @submit.prevent="$emit('search')" class="track-search__form">
          <div class="track-search__row">
            <div class="track-search__group">
              <WrapperInput
                :model-value="orderNumber"
                label="Numéro de commande"
                :placeholder="t('tracking.placeholders.orderNumber')"
                :hint="t('tracking.hints.orderNumber')"
                icon-name="Type"
                icon-state="iconLeft"
                :alert-label="error || undefined"
                :alert-type="error ? 'danger' : undefined"
                @update:model-value="$emit('update:orderNumber', $event)"
                @input="$emit('clear-error')"
              />
            </div>

            <div class="track-search__group">
              <WrapperInput
                :model-value="email"
                label="Adresse email"
                :placeholder="t('tracking.placeholders.email')"
                :hint="t('tracking.hints.email')"
                icon-name="Mail"
                icon-state="iconLeft"
                autocomplete="email"
                :alert-label="error || undefined"
                :alert-type="error ? 'danger' : undefined"
                @update:model-value="$emit('update:email', $event)"
                @input="$emit('clear-error')"
              />
            </div>
          </div>

          <PremiumButton
            html-type="submit"
            type="primary"
            variant="solid"
            size="lg"
            width="full"
            label="Localiser mon colis"
            icon-left="Search"
            :loading="loading"
            loading-text="Recherche..."
            :shine="true"
            :glow="!loading"
          />
        </form>

        <div class="track-search__footer">
          <div class="track-search__secure">
            <BasicIconNext name="Shield" :size="16" />
            <span>Connexion sécurisée SSL</span>
          </div>
        </div>
      </ContentBlock>

      <!-- Help Sidebar -->
      <ContentBlock as="aside" variant="card" size="md" class="track-search__help">
        <h3 class="track-search__help-title">
          <BasicIconNext name="HelpCircle" :size="18" />
          Besoin d'aide ?
        </h3>

        <div class="track-search__help-items">
          <div class="track-search__help-item">
            <div class="track-search__help-icon">
              <BasicIconNext name="Mail" :size="20" />
            </div>
            <div class="track-search__help-content">
              <strong>Email de confirmation</strong>
              <span>Le numéro de commande se trouve dans votre email de confirmation de commande</span>
            </div>
          </div>

          <div class="track-search__help-item">
            <div class="track-search__help-icon">
              <BasicIconNext name="MessageSquare" :size="20" />
            </div>
            <div class="track-search__help-content">
              <strong>Contacter le support</strong>
              <span>Notre équipe est disponible 7j/7 et répond sous 24h maximum</span>
            </div>
          </div>

          <div class="track-search__help-item">
            <div class="track-search__help-icon">
              <BasicIconNext name="Calendar" :size="20" />
            </div>
            <div class="track-search__help-content">
              <strong>Délais de livraison</strong>
              <span>France : 2-4 jours • Europe : 4-7 jours • International : 7-14 jours</span>
            </div>
          </div>
        </div>
      </ContentBlock>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  orderNumber: string
  email: string
  loading: boolean
  error: string
}>()

defineEmits<{
  (e: 'update:orderNumber', value: string | undefined | null): void
  (e: 'update:email', value: string | undefined | null): void
  (e: 'search'): void
  (e: 'clear-error'): void
}>()

const { t } = useI18n()
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.track-search {
  max-width: 1000px;
  margin: 0 auto;

  &__layout {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 32px;
    align-items: start;
  }

  &__card {
    // Styles de base gérés par ContentBlock
  }

  &__header {
    display: flex;
    gap: 20px;
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid @neutral-100;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.12) 0%,
      rgba(var(--primary-500-rgb), 0.06) 100%
    );
    border-radius: 18px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__title {
    font-family: @font-display;
    font-size: 22px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 6px;
  }

  &__subtitle {
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-500;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid @neutral-100;
  }

  &__secure {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;

    svg {
      color: @success-500;
    }
  }

  // Help sidebar
  &__help {
    // Styles de base gérés par ContentBlock
  }

  &__help-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0 0 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;

    svg {
      color: var(--primary-500);
    }
  }

  &__help-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__help-item {
    display: flex;
    gap: 16px;
  }

  &__help-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.1) 0%,
      rgba(var(--primary-500-rgb), 0.05) 100%
    );
    border-radius: 14px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__help-content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;
    }

    span {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      line-height: 1.5;
    }
  }
}

// Responsive
.respond-tablet({
  .track-search {
    &__layout {
      grid-template-columns: 1fr;
      max-width: 560px;
      margin: 0 auto;
    }

    &__help {
      order: 1;
    }
  }
});

.respond-mobile({
  .track-search {
    &__card {
      padding: 24px 20px;
      border-radius: 20px;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
});
</style>
