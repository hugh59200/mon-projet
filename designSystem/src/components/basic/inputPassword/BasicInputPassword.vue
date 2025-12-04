<template>
  <InputContainer
    v-model="modelValue"
    :size
    :validation-state="validationState"
    icon-state="iconRight"
    :readonly
    :disabled
    :deletable
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
        :autocomplete
      />
    </template>
    <template #icon-right>
      <BasicTooltip
        :label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
        position="top"
      >
        <BasicIconNext
          :name="iconToShow"
          :color="'success-600' as IconColor"
          :size="20"
          pointer
          :active="showPassword"
          @click="togglePassword"
        />
      </BasicTooltip>
    </template>
  </InputContainer>
</template>

<script setup lang="ts">
  import {
    useAutoId,
    type IconColor,
    type InputModel,
    type InputProps,
  } from '@designSystem/components'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicTooltip from '@designSystem/components/basic/tooltip/BasicTooltip.vue'
  import { computed, ref } from 'vue'

  const props = withDefaults(
    defineProps<
      InputProps & {
        autoValidate?: boolean
        touched?: boolean
      }
    >(),
    {
      size: 'medium',
      readonly: false,
      disabled: false,
      autoValidate: true,
      touched: false,
    },
  )

  const validationState = computed(() => {
    if (!props.touched) return undefined
    return !valid.value ? 'error' : undefined
  })

  const modelValue = defineModel<InputModel>()

  const id = useAutoId('input-password')

  const showPassword = ref(false)

  const valid = ref(false)

  const iconToShow = computed(() => (showPassword.value ? 'EyeOff' : 'Eye'))

  function togglePassword() {
    showPassword.value = !showPassword.value
  }
</script>

<style scoped lang="less">
  @import '../input/BasicInput.less';

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
      box-shadow: none;
    }

    &:active {
      transform: scale(0.95);
    }
  }
</style>
