<template>
  <div class="nurturing-optout">
    <!-- Loading State -->
    <div
      v-if="state === 'loading'"
      class="nurturing-optout__loading"
    >
      <div class="nurturing-optout__spinner">
        <BasicIconNext
          name="Loader2"
          :size="40"
        />
      </div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <!-- Confirm State -->
    <div
      v-else-if="state === 'confirm'"
      class="nurturing-optout__content"
    >
      <div class="nurturing-optout__icon">
        <BasicIconNext
          name="BookX"
          :size="64"
          color="text-200"
        />
      </div>

      <h1 class="nurturing-optout__title">{{ t('nurturing.optout.confirmTitle') }}</h1>
      <p class="nurturing-optout__subtitle">{{ t('nurturing.optout.confirmMessage') }}</p>

      <div class="nurturing-optout__email">
        <BasicIconNext
          name="Mail"
          :size="18"
        />
        {{ email }}
      </div>

      <!-- Info box -->
      <div class="nurturing-optout__info">
        <BasicIconNext
          name="Info"
          :size="18"
          color="info-500"
        />
        <p>{{ t('nurturing.optout.infoMessage') }}</p>
      </div>

      <div class="nurturing-optout__actions">
        <PremiumButton
          :label="t('nurturing.optout.ctaCancel')"
          type="secondary"
          variant="outline"
          size="lg"
          @click="$router.push('/')"
        />
        <PremiumButton
          :label="t('nurturing.optout.ctaConfirm')"
          type="danger"
          variant="solid"
          size="lg"
          :loading="isSubmitting"
          @click="handleOptout"
        />
      </div>
    </div>

    <!-- Success State -->
    <div
      v-else-if="state === 'success'"
      class="nurturing-optout__content"
    >
      <div class="nurturing-optout__icon nurturing-optout__icon--success">
        <BasicIconNext
          name="CheckCircle"
          :size="64"
          color="success-500"
        />
      </div>

      <h1 class="nurturing-optout__title">{{ t('nurturing.optout.successTitle') }}</h1>
      <p class="nurturing-optout__subtitle">{{ t('nurturing.optout.successMessage') }}</p>

      <div class="nurturing-optout__info nurturing-optout__info--success">
        <BasicIconNext
          name="Mail"
          :size="18"
          color="success-500"
        />
        <p>{{ t('nurturing.optout.stillSubscribed') }}</p>
      </div>

      <PremiumButton
        :label="t('nurturing.optout.ctaHome')"
        type="primary"
        variant="solid"
        size="lg"
        @click="$router.push('/')"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="state === 'error'"
      class="nurturing-optout__content"
    >
      <div class="nurturing-optout__icon nurturing-optout__icon--error">
        <BasicIconNext
          name="AlertTriangle"
          :size="64"
          color="danger-500"
        />
      </div>

      <h1 class="nurturing-optout__title">{{ t('nurturing.optout.errorTitle') }}</h1>
      <p class="nurturing-optout__subtitle nurturing-optout__subtitle--error">
        {{ errorMessage }}
      </p>

      <PremiumButton
        :label="t('nurturing.optout.ctaHome')"
        type="secondary"
        variant="outline"
        size="lg"
        icon-left="ArrowLeft"
        @click="$router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const { t } = useI18n()
  const route = useRoute()

  const state = ref<'loading' | 'confirm' | 'success' | 'error'>('loading')
  const email = ref('')
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  onMounted(() => {
    const emailParam = route.query.email as string

    if (!emailParam) {
      state.value = 'error'
      errorMessage.value = t('nurturing.optout.noEmail')
      return
    }

    email.value = decodeURIComponent(emailParam)
    state.value = 'confirm'
  })

  async function handleOptout() {
    if (isSubmitting.value) return

    isSubmitting.value = true

    try {
      const { data, error } = await supabase.rpc('optout_nurturing_sequence', {
        p_email: email.value,
      })

      if (error) {
        throw error
      }

      const result = data as { success?: boolean; message?: string } | null
      if (result?.success) {
        state.value = 'success'
      } else {
        state.value = 'error'
        errorMessage.value =
          result?.message === 'not_found'
            ? t('nurturing.optout.notFound')
            : t('nurturing.optout.errorGeneric')
      }
    } catch {
      state.value = 'error'
      errorMessage.value = t('nurturing.optout.errorGeneric')
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped lang="less">
  .nurturing-optout {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: @spacing-25;

    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: @spacing-15;
      color: var(--text-secondary);
    }

    &__spinner {
      animation: spin 1s linear infinite;
      color: var(--primary-500);
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    &__content {
      max-width: 480px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: @spacing-20;
    }

    &__icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface-tertiary);

      &--success {
        background: rgba(var(--success-500-rgb), 0.1);
      }

      &--error {
        background: rgba(var(--danger-500-rgb), 0.1);
      }
    }

    &__title {
      font-size: @font-size-h2;
      font-weight: @font-weight-bold;
      color: var(--text-primary);
      margin: 0;
    }

    &__subtitle {
      font-size: @font-size-body-l;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;

      &--error {
        color: var(--danger-500);
      }
    }

    &__email {
      display: flex;
      align-items: center;
      gap: @spacing-10;
      padding: @spacing-15 @spacing-20;
      background: var(--bg-surface-secondary);
      border-radius: 12px;
      font-size: @font-size-body-m;
      color: var(--text-primary);
      font-weight: @font-weight-semibold;
    }

    &__info {
      display: flex;
      align-items: flex-start;
      gap: @spacing-10;
      padding: @spacing-15;
      background: rgba(var(--info-500-rgb), 0.1);
      border-radius: 12px;
      text-align: left;

      p {
        margin: 0;
        font-size: @font-size-body-s;
        color: var(--info-600);
        line-height: 1.5;
      }

      &--success {
        background: rgba(var(--success-500-rgb), 0.1);

        p {
          color: var(--success-600);
        }
      }
    }

    &__actions {
      display: flex;
      gap: @spacing-15;
      width: 100%;

      > * {
        flex: 1;
      }
    }
  }
</style>
