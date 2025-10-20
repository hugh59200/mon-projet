<template>
  <component
    v-if="appState.estUtilisateurAuthentifie"
    :is="isMobile ? Teleport : 'div'"
    :to="isMobile ? 'body' : undefined"
  >
    <aside
      ref="sideBarLeftRef"
      :class="[
        'left-sidebar',
        {
          'left-sidebar--mobile': isMobile && isOpenMobileSidebarLeft,
          'left-sidebar--reduced': !isMobile && isSidebarReduced,
        },
      ]"
    >
      <div
        v-show="!isMobile"
        class="left-sidebar__top"
      >
        <div class="left-sidebar__top--icon">
          <BasicIcon
            :name="isSidebarReduced ? 'menu-grid-reduced' : 'menu-grid'"
            active
            pointer
            :class="[{ reduced: isSidebarReduced }]"
            @click="toggleSidebar"
          />
        </div>
        <div class="left-sidebar__top--logo">
          <img
            src="@/assets/logo-monespace-vert.png"
            alt="Logo AKTO"
          />
        </div>
      </div>
      <div class="left-sidebar__items">
        <router-link
          v-for="item in sidebarItems"
          :key="item.name"
          class="left-sidebar__item"
          :to="item"
          active-class="active"
          v-slot="{ isActive }"
        >
          <div class="left-sidebar__item--icon">
            <BasicIcon
              :name="item.meta.icon!"
              :active="isActive"
              color="secondary-800"
            />
          </div>
          <div
            v-if="!isSidebarReduced"
            class="left-sidebar__item__link"
          >
            <BasicText
              wrap
              nb-max-lines="2"
              color="secondary-900"
            >
              {{ item.meta.label }}
            </BasicText>
          </div>
        </router-link>
      </div>
      <div
        v-if="favoris?.length"
        class="left-sidebar__items"
      >
        <BasicText
          v-if="!isSidebarReduced"
          weight="bold"
          color="secondary-1000"
        >
          Accès rapides
        </BasicText>
        <div
          v-for="favori in favoris"
          :key="favori.key"
          class="left-sidebar__item"
        >
          <span
            class="left-sidebar__chip"
            :class="`color-${favori.routeName}`"
            :title="favori.title"
            @click="navigateToFavori(favori.key)"
          >
            <BasicIcon
              v-if="isSidebarReduced"
              name="close"
              focusable
              color="secondary-800"
              pointer
              class="left-sidebar__chip--delete"
              @click="deleteFavoriteConfirmation(favori.key)"
            />
          </span>

          <div
            v-if="!isSidebarReduced"
            class="left-sidebar__item__link"
          >
            <BasicLink
              :label="favori.title"
              type="dark"
              @link-click="navigateToFavori(favori.key)"
              wrapLink
              nb-max-lines="2"
            />
            <BasicIcon
              name="close"
              focusable
              color="secondary-800"
              pointer
              @click="deleteFavoriteConfirmation(favori.key)"
            />
          </div>
        </div>
      </div>
    </aside>
  </component>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { DEVICE_BREAKPOINT } from '@/plugin/device-breakpoint'
  import { inject, onMounted, ref, Teleport } from 'vue'
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'
  import { useSidebarStateStore } from '@/features/interface/layout/sideBar/useSideBarStore'
  import { useAppStateStore } from '@/features/application'
  import { useFavorisStore } from '@/features/interface/favoris/favorisStore'

  const sideBarLeftRef = ref<HTMLElement | null>(null)
  const appHeader = ref<HTMLElement | null>(null)

  const { isMobile } = inject(DEVICE_BREAKPOINT)!

  const appState = useAppStateStore()

  const sidebarStateStore = useSidebarStateStore()
  const { toggleSidebar, onClickOutside } = sidebarStateStore
  const { isSidebarReduced, isOpenMobileSidebarLeft, sidebarItems } = storeToRefs(sidebarStateStore)

  const storeFavoris = useFavorisStore()
  const { navigateToFavori, deleteFavoriteConfirmation } = storeFavoris
  const { favoris } = storeToRefs(storeFavoris)

  onMounted(() => {
    appHeader.value = document.getElementById('app-header')
  })

  useHandleClickOutside([sideBarLeftRef, appHeader], onClickOutside)
</script>

<style scoped lang="less">
  @import './SideBarLeft.less';
</style>

