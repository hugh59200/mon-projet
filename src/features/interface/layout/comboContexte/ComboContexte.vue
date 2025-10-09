<template>
  <div
    class="context-handler__container"
    ref="dropdown"
  >
    <div
      v-if="estAuthentifeAvecUnContexte"
      v-focusable="{
        onEnter: () => toggleShowOtherContext(),
      }"
      :class="[
        'context-handler',
        {
          'context-handler--selected': !isDropdownOpen,
          'context-handler--no-hover': !isMixed,
        },
      ]"
      @click="toggleShowOtherContext"
    >
      <BasicAvatar
        type="icon"
        :iconName="currentContextIconName"
        avatarSize="small"
      />

      <div class="context-handler__label">
        <BasicText
          size="body-m"
          color="neutral-500"
        >
          Profil
        </BasicText>
        <BasicText
          weight="bold"
          size="body-m"
          color="secondary-1000"
        >
          {{ currentContextLabel }}
        </BasicText>
      </div>

      <BasicIcon
        v-if="isMixed"
        name="arrow-up"
        active
        class="context-handler__icon"
      />
    </div>

    <div
      v-if="isDropdownOpen && isMixed"
      :class="['context-handler', 'context-handler--mixed']"
      @click="toggleContext"
    >
      <BasicAvatar
        type="icon"
        :iconName="otherContextIconName"
        avatarSize="small"
      />

      <div
        v-focusable="{ onEnter: () => toggleContext() }"
        class="context-handler__label"
      >
        <BasicText
          weight="bold"
          size="body-m"
          color="secondary-1000"
        >
          {{ otherContextLabel }}
        </BasicText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useAppStateStore } from '@/features/application'
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import {
    useAppContextStore,
    TypesContextesAutorisesEnum,
    TypesContextesAutorisesEnumLibelle,
  } from '@/features/auth/context-app'

  const appState = useAppStateStore()
  const appContexte = useAppContextStore()

  const estAuthentifeAvecUnContexte = computed(
    () => appState.estUtilisateurAuthentifie && appState.contextesAutorises !== TypesContextesAutorisesEnum.Aucun,
  )

  const isDropdownOpen = ref(false)
  const dropdown = ref<HTMLElement | null>(null)

  const isMixed = computed(() => appState.contextesAutorises === TypesContextesAutorisesEnum.Mixte)

  function toggleContext() {
    isDropdownOpen.value = false
    appContexte.toggleContext()
  }

  const otherContext = computed(() =>
    appState.contextCourant === TypesContextesAutorisesEnum.Adherent
      ? TypesContextesAutorisesEnum.Prestataire
      : TypesContextesAutorisesEnum.Adherent,
  )

  const currentContextLabel = computed(() => TypesContextesAutorisesEnum[appState.contextCourant])
  const otherContextLabel = computed(() => TypesContextesAutorisesEnumLibelle[otherContext.value])

  const currentContextIconName = computed(() =>
    appState.contextCourant === TypesContextesAutorisesEnum.Prestataire ? 'prestataire' : 'adherent',
  )

  const otherContextIconName = computed(() =>
    appState.contextCourant === TypesContextesAutorisesEnum.Prestataire ? 'adherent' : 'prestataire',
  )

  const toggleShowOtherContext = () => {
    if (isMixed.value) {
      isDropdownOpen.value = !isDropdownOpen.value
    }
  }

  useHandleClickOutside(dropdown, () => {
    if (isDropdownOpen.value) isDropdownOpen.value = false
  })
</script>

<style scoped lang="less">
  @import './ComboContexte.less';
</style>
