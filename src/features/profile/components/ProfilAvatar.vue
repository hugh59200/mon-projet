<template>
  <div class="avatar">
    <input
      type="file"
      accept="image/*"
      class="avatar__input"
      @change="onSelect"
    />

    <div class="avatar__frame">
      <img
        v-if="modelValue"
        :src="modelValue"
        class="avatar__img"
        alt="Avatar"
      />

      <div
        v-else
        class="avatar__placeholder"
      >
        <BasicIconNext
          name="User"
          :size="44"
          color="neutral-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const modelValue = defineModel<string | null>()
  const emit = defineEmits(['change'])

  function onSelect(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      modelValue.value = reader.result as string
      emit('change', file)
    }
    reader.readAsDataURL(file)
  }
</script>

<style scoped lang="less">
  .avatar {
    position: relative;
    width: 120px;
    height: 120px;

    .avatar__input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 5;
    }

    .avatar__frame {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;
      border: 2px solid rgba(var(--primary-400-rgb), 0.5);
      background: var(--surface-2);
      backdrop-filter: blur(6px);

      display: flex;
      align-items: center;
      justify-content: center;

      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

      &:hover {
        transform: scale(1.04);
        box-shadow: 0 0 24px rgba(var(--primary-400-rgb), 0.45);
      }
    }

    .avatar__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--neutral-500);
    }
  }
</style>
