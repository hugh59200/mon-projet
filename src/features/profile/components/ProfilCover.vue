<template>
  <div class="profil-cover">
    <!-- Background cover image -->
    <img
      src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
      alt="Cover"
      class="profil-cover__bg"
    />

    <!-- Gradient overlay -->
    <div class="profil-cover__overlay"></div>

    <!-- Avatar block -->
    <div class="profil-cover__avatar-wrapper">
      <div class="profil-cover__avatar">
        <!-- Avatar image or placeholder -->
        <img
          v-if="avatar"
          :src="avatar"
          alt="Avatar"
          class="profil-cover__avatar-img"
        />

        <div
          v-else
          class="profil-cover__avatar-placeholder"
        >
          <BasicIconNext
            name="User"
            :size="44"
            color="neutral-400"
          />
        </div>

        <!-- File input -->
        <input
          type="file"
          accept="image/*"
          class="profil-cover__file-input"
          @change="onFileSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { defineEmits, defineProps } from 'vue'

  /* PROPS */
  defineProps<{
    avatar: string | null
  }>()

  /* EVENTS */
  const emit = defineEmits<{
    (e: 'select-avatar', file: File): void
  }>()

  /* FILE HANDLER */
  function onFileSelect(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    emit('select-avatar', file)
  }
</script>

<style scoped lang="less">
  .profil-cover {
    position: relative;
    height: 260px;
    width: 100%;
    overflow: hidden;
    background: var(--surface-0);

    /* background image */
    &__bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.7);
    }

    /* gradient */
    &__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(var(--neutral-900-rgb), 0.45), transparent 65%);
    }

    /* avatar block */
    &__avatar-wrapper {
      position: absolute;
      bottom: -60px; /* pushes avatar halfway into card */
      width: 100%;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }

    &__avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      pointer-events: auto;

      background: var(--surface-1);
      border: 2px solid rgba(var(--primary-400-rgb), 0.5);
      box-shadow: var(--shadow-300);

      position: relative;
      transition: var(--transition-medium);

      &:hover {
        transform: scale(1.03);
        box-shadow: 0 0 18px rgba(var(--primary-400-rgb), 0.5);
      }
    }

    &__avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__avatar-placeholder {
      width: 100%;
      height: 100%;
      background: var(--surface-2);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--neutral-400);
    }

    /* invisible file input */
    &__file-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>
