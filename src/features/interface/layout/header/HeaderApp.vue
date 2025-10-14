<template>
  <header>
    <div class="left-content">
      <template v-if="true">
        <template v-if="headerText">
          <BasicText
            size="h3"
            weight="bold"
            color="white"
            wrapAll
          >
            {{ headerText?.titre }}
          </BasicText>
          <BasicText
            v-if="headerText?.sousTitre"
            size="body-xl"
            color="white"
            wrapAll
            style="margin-top: -6px"
          >
            {{ headerText?.sousTitre }}
          </BasicText>
        </template>
      </template>
      <img
        v-else
        src="@/assets/logo-akto-blanc.png"
        alt="Logo AKTO"
        class="logo"
      />
    </div>

    <div class="right-content">
      <template v-if="true">
        <div
          class="right-content__user-info"
          ref="menu"
        >
          <BasicTooltip
            label="Changer de compte"
            position="top"
          >
            <BasicText
              class="right-content__user-info--desktop userName"
              size="h5"
              weight="bold"
              color="white"
              @click="showMenu = !showMenu"
              focusable
              pointer
              nbMaxLines="2"
            >
              {{ fullName }}
            </BasicText>
            <BasicAvatar
              v-focusable="{
                onEnter: () => (showMenu = !showMenu),
              }"
              type="name"
              class="right-content__user-info--mobile userName"
              :name="fullName"
              avatarSize="medium"
              @click="showMenu = !showMenu"
              pointer
            />
          </BasicTooltip>
          <div
            class="menu"
            ref="menu"
            v-if="showMenu"
          >
            <div class="right-content__user-menu">
              <template v-if="false">
                <BasicLink
                  @link-click="$router.push({ name: 'Profil' })"
                  @click="closeMenu"
                  type="dark"
                  label="Accéder à mon profil"
                />
              </template>
              <BasicLink
                @link-click="null"
                type="dark"
                label="Se déconnecter"
              />
            </div>
          </div>
        </div>
      </template>
      <div
        v-else
        class="right-content__buttons"
      >
        <BasicButton
          label="Créer son compte"
          variant="outlined"
          size="large"
          @click="null"
          class="creation__button"
        />
        <BasicButton
          label="Se connecter"
          size="large"
          @click="null"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import { computed, ref } from 'vue'

  const menu = ref()

  const showMenu = ref(false)

  const headerText = computed<{ titre: string; sousTitre?: string } | undefined>(() => {
    return { titre: 'titre' }
  })

  const fullName = computed(() => {
    return 'mon nom'
  })

  const closeMenu = () => {
    showMenu.value = false
  }

  useHandleClickOutside(menu, () => {
    closeMenu()
  })
</script>

<style scoped lang="less">
  @import './HeaderApp.less';
</style>
