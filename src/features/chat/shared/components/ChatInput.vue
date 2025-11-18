<template>
  <form
    class="chat-input"
    @submit.prevent="send"
    aria-label="Zone de saisie du message"
  >
    <input
      ref="inputRef"
      v-model="message"
      type="text"
      placeholder="Écrire un message..."
      required
      aria-label="Champ de texte du message"
      @input="typing"
    />
    <BasicButton
      label="Envoyer"
      type="primary"
      size="small"
      :disabled="!message.trim() || !isOnline"
      @click="send"
    />
  </form>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'

  defineProps<{
    isOnline: boolean
  }>()

  const message = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    (e: 'send'): void
    (e: 'typing'): void
  }>()

  const send = () => emit('send')
  const typing = () => emit('typing')

  const inputRef = ref<HTMLInputElement | null>(null)

  onMounted(() => nextTick(() => inputRef.value?.focus()))
</script>

<style scoped lang="less">
  .chat-input {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 1px solid @neutral-200;
    padding: 10px 12px;
    background: white;

    input {
      flex: 1;
      border: 1px solid @neutral-200;
      border-radius: 8px;
      padding: 8px 12px;
      background: @neutral-50;
      font-size: 14px;

      &:focus {
        border-color: var(--primary-500);
        background: white;
      }
    }
  }
</style>
