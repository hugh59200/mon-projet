<template>
  <InputContainer
    v-model="modelValue"
    :size
    :validation-state="validationState"
    icon-state="iconRight"
    :deletable="false"
    :readonly
    :disabled
  >
    <!-- 🧾 Champ principal -->
    <template #default>
      <input
        :type="showPassword ? 'text' : 'password'"
        :id="id"
        v-model="modelValue"
        :placeholder
        :readonly
        :disabled
        :maxlength
        @input="onInput"
        @blur="onBlur"
      />
    </template>

    <!-- 👁️ Icônes à droite -->
    <template #icon-right>
      <div class="password-icons">
        <!-- 🔋 Indicateur de force -->
        <transition name="fade">
          <BasicTooltip
            v-if="showStrength && modelValue && strengthLevel !== 'weak'"
            :label="strengthLabel"
            position="top"
          >
            <BasicIconNext
              class="strength-icon"
              :name="strengthIcon"
              :color="strengthColor"
              :size="20"
            />
          </BasicTooltip>
        </transition>

        <!-- 👁️ Bouton show/hide -->
        <BasicTooltip
          :label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          position="top"
        >
          <BasicIconNext
            :name="iconToShow"
            color="neutral-600"
            :size="20"
            pointer
            :active="showPassword"
            @click="togglePassword"
          />
        </BasicTooltip>
      </div>
    </template>
  </InputContainer>
</template>

<script setup lang="ts">
  import { useAutoId, type InputModel, type InputProps } from '@designSystem/components'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicTooltip from '@designSystem/components/basic/tooltip/BasicTooltip.vue'
  import { computed, ref } from 'vue'

  /* --- Props --- */
  const props = withDefaults(
    defineProps<
      InputProps & {
        showStrength?: boolean
        minStrength?: 'weak' | 'medium' | 'strong'
        autoValidate?: boolean
        touched?: boolean // ✅ nouvelle prop
      }
    >(),
    {
      size: 'medium',
      readonly: false,
      disabled: false,
      showStrength: true,
      minStrength: 'weak',
      autoValidate: true,
      touched: false, // ✅ défaut
    },
  )

  const validationState = computed(() => {
    if (!props.touched) return undefined

    // ✅ On n’affiche l’erreur que si niveau = medium mais pas assez fort
    if (strengthLevel.value === 'weak') return undefined

    return !valid.value ? 'error' : undefined
  })

  /* --- v-model --- */
  const modelValue = defineModel<InputModel>()
  const id = useAutoId('input-password')

  /* --- État interne --- */
  const showPassword = ref(false)
  const strengthPercent = ref(0)
  const strengthLabel = ref('')
  const strengthLevel = ref<'weak' | 'medium' | 'strong'>('weak')
  const valid = ref(false)

  /* --- Icônes dynamiques --- */
  const iconToShow = computed(() => (showPassword.value ? 'EyeOff' : 'Eye'))

  /* --- Couleur dynamique de la pile --- */
  const strengthColor = computed(() => {
    if (!modelValue.value) return 'neutral-400'
    if (!valid.value) {
      switch (strengthLevel.value) {
        case 'medium':
          return 'warning-500'
        default:
          return 'danger-500'
      }
    }
    return 'success-600'
  })

  /* --- Icône de la pile --- */
  const strengthIcon = computed(() => {
    switch (strengthLevel.value) {
      case 'strong':
        return 'BatteryFull'
      case 'medium':
        return 'BatteryMedium'
      default:
        return 'BatteryLow'
    }
  })

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  /* --- Calcul de la force du mot de passe --- */
  function getPasswordStrength(password: string) {
    if (!password) {
      return { percent: 0, label: '', level: 'weak' as const }
    }

    // ✅ toujours calculer un pourcentage, mais sans message bloquant
    const percent = Math.min((password.length / 12) * 100, 100)

    let score = 0
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    let level: 'weak' | 'medium' | 'strong' = 'weak'
    let label = ''

    if (score >= 4 && password.length >= 10) {
      level = 'strong'
      label = 'Fort 💪'
    } else if (score >= 2 && password.length >= 8) {
      level = 'medium'
      label = 'Moyen ⚖️'
    }

    // ✅ si faible : label vide → aucune alerte bloquante
    return { percent, label, level }
  }

  /* --- Émission au parent --- */
  const emit = defineEmits<{
    (
      e: 'strength-change',
      payload: {
        level: 'weak' | 'medium' | 'strong'
        percent: number
        label: string
        valid: boolean
      },
    ): void
  }>()

  function onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value
    const strength = getPasswordStrength(value)
    strengthPercent.value = strength.percent
    strengthLabel.value = strength.label
    strengthLevel.value = strength.level
    validateStrength()
    emitStrengthChange()
  }

  function emitStrengthChange() {
    emit('strength-change', {
      level: strengthLevel.value,
      percent: strengthPercent.value,
      label: strengthLabel.value,
      valid: valid.value,
    })
  }

  function validateStrength() {
    // 🔒 minimum longueur
    if (!modelValue.value || modelValue.value.toString().length < 8) {
      valid.value = false
      return
    }

    const levels = ['weak', 'medium', 'strong']
    const requiredIndex = levels.indexOf(props.minStrength)
    const currentIndex = levels.indexOf(strengthLevel.value)
    valid.value = currentIndex >= requiredIndex
  }

  function onBlur() {
    if (props.autoValidate) validateStrength()
  }
</script>

<style scoped lang="less">
  @import '../input/BasicInput.less';

  /* 👁️ + 🔋 alignement horizontal */
  .password-icons {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    position: relative;
    top: 1px;
  }

  /* 🔋 Icône de force */
  .strength-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.25s ease;
  }

  /* Apparition douce */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
  .fade-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  /* 👁️ Bouton toggle */
  .password-toggle {
    background: none;
    border: none;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:focus {
      outline: none;
      box-shadow: none; /* ✅ plus d'encadré bleu */
    }

    &:active {
      transform: scale(0.95);
    }
  }
</style>
