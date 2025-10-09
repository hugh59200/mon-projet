<template>
  <header>
    <div class="left-content">
      <template v-if="appState.estUtilisateurAuthentifie">
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
      <HeaderComboContexte />
      <template v-if="appState.estUtilisateurAuthentifie">
        <NotificationsComponent
          v-if="!appState.estAuthentificationEnCours"
          class="right-content__notification"
        />
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
              nb-max-lines="2"
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
              <template v-if="appState.estUtilisateurImpersonnalise">
                <div class="name-interne">
                  <BasicIcon
                    name="profile"
                    class="icon"
                    active
                  />
                  <BasicText
                    color="secondary-600"
                    size="body-xl"
                    weight="bold"
                  >
                    {{ fullNameInterne }}
                  </BasicText>
                </div>
                <BasicText
                  class="link"
                  color="secondary-600"
                  @click="changerUtilisateur"
                  pointer
                >
                  Changer d’utilisateur externe
                </BasicText>
                <hr />
              </template>
              <template v-if="!appState.estAuthentificationEnCours">
                <BasicLink
                  @link-click="$router.push({ name: 'Profil' })"
                  @click="closeMenu"
                  type="dark"
                  label="Accéder à mon profil"
                />
                <BasicLink
                  @link-click="demanderRattachement"
                  type="dark"
                  label="Me rattacher à une entreprise"
                />
              </template>
              <BasicLink
                @link-click="appState.deconnexionAsync"
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
          @click="appState.inscriptionAsync"
          class="creation__button"
        />
        <BasicButton
          label="Se connecter"
          size="large"
          @click="appState.connexionAsync"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import router from '@/router'
  import { useRoute } from 'vue-router'
  import { useAppStateStore } from '@/features/application'
  import HeaderComboContexte from '@/features/interface/layout/comboContexte/ComboContexte.vue'
  import NotificationsComponent from './composants/NotificationsComponent/NotificationsComponent.vue'
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import { ROUTE_RESET_IMPERSO } from '@/features/auth/impersonnalisation'
  import { Utilisateur } from '@/features/auth'
  import { useDemandeRattachement } from '../../profil-utilisateur/sections/rattachements/demande'

  const menu = ref()
  const showMenu = ref(false)
  const route = useRoute()
  const appState = useAppStateStore()

  const headerText = computed<{ titre: string; sousTitre?: string } | undefined>(() => {
    let result: string | [string, string] | undefined
    if (typeof route.meta.label === 'function') result = route.meta.label(route)
    else result = route.meta.label ?? ''

    if (!result) return
    else if (typeof result === 'string') return { titre: result }
    else return { titre: result[0], sousTitre: result[1] }
  })

  const fullName = computed(() => {
    return appState.utilisateur?.prenomNomAffichage
  })

  const fullNameInterne = computed(() => {
    if (appState.utilisateur instanceof Utilisateur) return appState.utilisateur?.prenomNomInterne
    else return ''
  })

  const closeMenu = () => {
    showMenu.value = false
  }

  const changerUtilisateur = () => {
    router.push({ name: ROUTE_RESET_IMPERSO })
    closeMenu()
  }

  const demanderRattachement = () => {
    const demandeRattachement = useDemandeRattachement()
    demandeRattachement.showDialog()
    closeMenu()
  }

  useHandleClickOutside(menu, () => {
    closeMenu()
  })
</script>

<style scoped lang="less">
  @import './HeaderApp.less';
</style>
