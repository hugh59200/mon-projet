<template>
  <div
    class="chat-message"
    :class="{
      'chat-message--mine': isMine,
      'chat-message--grouped': isGrouped,
    }"
  >
    <div
      class="chat-message__bubble"
      :class="{ 'chat-message__bubble--read': message.is_read }"
    >
      <!-- 💬 Contenu du message -->
      <BasicText
        class="chat-message__content"
        :label="message.content"
        size="body-m"
        :color="isMine ? 'white' : 'neutral-700'"
        :wrap="true"
      />

      <!-- ⏱️ Métadonnées -->
      <div class="chat-message__meta">
        <BasicText
          class="chat-message__time"
          :label="formattedTime"
          size="body-s"
          :color="isMine ? 'white' : 'neutral-500'"
        />

        <transition name="fade-scale">
          <span
            v-if="isMine"
            class="chat-message__status"
          >
            <BasicIconNext
              :name="message.is_read ? 'CheckCheck' : 'Check'"
              :size="14"
              :color="statusColor"
              :stroke-width="3"
            />
            <!-- ✅ Affiche "Vu à 14:30" si read_at existe -->
            <BasicText
              v-if="message.read_at"
              :label="`Vu à ${new Date(message.read_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`"
              size="body-s"
              color="neutral-400"
            />
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Messages } from '@/supabase/types/supabase.types'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import type { IconColor } from '@designSystem/index'
  import { computed, watchEffect } from 'vue'

  /* ---------------------- Props ---------------------- */
  const props = defineProps<{
    message: Messages
    isMine: boolean
    isGrouped?: boolean
  }>()

  /* ---------------------- Formatage heure ---------------------- */
  const formattedTime = computed(() => {
    const date = props.message.created_at
    if (!date) return ''
    try {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  })

  /* ---------------------- Couleur des coches ---------------------- */
  const statusColor = computed<IconColor>(() => {
    if (!props.isMine) return 'neutral-400'
    return props.message.is_read ? 'secondary-400' : 'neutral-400'
  })

  /* ---------------------- Réactivité instantanée ---------------------- */
  // 🔥 Important : Vue ne "voit" pas un simple champ booléen mis à jour par Supabase,
  // mais comme `message` est un objet réactif (via reactive(msg)), cette watch force le refresh visuel.
  watchEffect(() => {
    if (props.message.is_read) {
      // peut être utilisé pour animations visuelles, logs, etc.
      // console.log(`✅ Message ${props.message.id} lu`)
    }
  })
</script>

<style scoped lang="less">
  .chat-message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    animation: fade-in 0.2s ease;

    &--mine {
      align-items: flex-end;
    }

    &__bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 16px;
      word-break: break-word;
      transition: all 0.3s ease;
      background: @neutral-100;
      color: @neutral-800;
      box-shadow: 0 1px 2px color-mix(in srgb, @neutral-800 5%, transparent);

      &:hover {
        background: color-mix(in srgb, @neutral-200 60%, transparent);
      }
    }

    &__bubble--read {
      background: rgba(var(--primary-50-rgb), 0.8);
      transition: background 0.5s ease;
    }

    &--mine &__bubble {
      background: var(--primary-600);
      color: white;
      border-bottom-right-radius: 4px;
    }

    &--mine &__bubble--read {
      background: var(--primary-500);
      box-shadow: 0 0 6px rgba(var(--primary-600-rgb), 0.3);
      transition: background 0.4s ease;
    }

    &__content {
      display: block;
      white-space: pre-wrap;
      word-break: break-word;
    }

    &__meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 4px;
      font-size: 12px;
    }

    &--grouped &__bubble {
      margin-top: 2px;
    }

    &__status {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    &__time {
      display: inline-flex;
      align-items: center;
    }

    .fade-scale-enter-active,
    .fade-scale-leave-active {
      transition: all 0.25s ease;
    }
    .fade-scale-enter-from,
    .fade-scale-leave-to {
      opacity: 0;
      transform: scale(0.7);
    }
  }

  /* 💨 Apparition globale du message */
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
