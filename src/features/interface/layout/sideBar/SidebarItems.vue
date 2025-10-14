<template>
  <div :class="['sidebar__items', { reduced }]">
    <div
      v-for="item in items"
      :key="item.name"
    >
      <router-link
        :to="item"
        class="sidebar__items-item"
        activeClass="active"
        :class="{ disabled: getVisibility(item) === 'disabled' }"
        v-slot="{ isActive }"
      >
        <div class="sidebar__items-item-icon">
          <BasicIcon
            :name="item.meta.icon!"
            :active="isActive"
            color="secondary-800"
          />
        </div>
        <BasicText
          v-if="!reduced"
          class="sidebar__items-item-label"
          wrap
          nbMaxLines="2"
          color="secondary-900"
        >
          {{ item.meta.label }}
        </BasicText>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { RouteRecordNormalized } from 'vue-router'

  type SidebarItemsProps = {
    reduced?: boolean
    items?: RouteRecordNormalized[]
  }

  withDefaults(defineProps<SidebarItemsProps>(), {
    reduced: false,
    items: () => [] as RouteRecordNormalized[],
  })

  function getVisibility(item: RouteRecordNormalized) {
    let visibility = item.meta.visibility
    if (typeof visibility === 'function') {
      visibility = visibility(item)
    }
    return visibility ?? 'visible'
  }
</script>

<style lang="less">
  @import 'SidebarItems.less';
</style>
