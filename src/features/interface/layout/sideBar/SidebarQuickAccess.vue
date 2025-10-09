<template>
  <div
    v-if="favoris?.length"
    class="quick-access"
  >
    <BasicText
      v-if="!reduced"
      weight="bold"
      color="secondary-800"
      class="quick-access--label"
    >
      Accès rapides
    </BasicText>
    <div class="quick-access-items">
      <div
        v-for="(item, index) in favoris"
        :key="index"
        class="quick-access-item"
      >
        <div
          class="color-chip"
          :class="`color-${item.routeName}`"
          @click="$emit('navigateToFavori', item.key)"
          :title="item.title"
        />
        <div
          v-if="!reduced"
          class="quick-access-item--action"
        >
          <BasicLink
            :label="item.title"
            type="dark"
            @link-click="$emit('navigateToFavori', item.key)"
            class="quick-access-item--action-link"
            wrapLink
            nb-max-lines="2"
          />
          <BasicIcon
            name="close"
            focusable
            color="secondary-800"
            @click="$emit('deleteFavorite', item.key)"
            pointer
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  type Favori = {
    key: string
    title: string
    routeName: string
  }

  interface SidebarQuickAccessProps {
    reduced?: boolean
    favoris?: Favori[]
  }

  withDefaults(defineProps<SidebarQuickAccessProps>(), {
    reduced: false,
    favoris: () => [],
  })
</script>

<style scoped lang="less">
  @import 'SidebarQuickAccess.less';
</style>
