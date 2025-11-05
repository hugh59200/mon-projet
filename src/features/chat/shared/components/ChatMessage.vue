<template>
  <div
    class="chat-message"
    :class="[{ mine: isMine, grouped: isGrouped }, { read: message.is_read }]"
  >
    <div class="bubble">
      <!-- 💬 Contenu du message -->
      <BasicText
        class="content"
        :label="message.content"
        size="body-m"
        :color="isMine ? 'white' : 'neutral-700'"
        :wrap="true"
      />

      <!-- ⏱️ Métadonnées -->
      <div class="meta">
        <BasicText
          class="time"
          :label="formattedTime"
          size="body-s"
          :color="isMine ? 'white' : 'neutral-500'"
        />

        <transition name="fade-scale">
          <span
            v-if="isMine"
            class="status"
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
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import type { IconColor } from '@designSystem/index'
  import { computed, watchEffect } from 'vue'
  import type { Message } from '../types/chat'

  /* ---------------------- Props ---------------------- */
  const props = defineProps<{
    message: Message
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

    &.mine {
      align-items: flex-end;
    }

    .bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 16px;
      word-break: break-word;
      transition: all 0.3s ease;
      background: @neutral-100;
      color: @neutral-800;
      box-shadow: 0 1px 2px fade(@neutral-800, 5%);

      .content {
        display: block;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .meta {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
        margin-top: 4px;
        font-size: 12px;
      }

      /* 💫 Survol doux */
      &:hover {
        background: fade(@neutral-200, 60%);
      }

      /* ✨ Animation "lu" (transition douce du fond) */
      &.read {
        background: fade(@primary-50, 80%);
        transition: background 0.5s ease;
      }
    }

    &.mine .bubble {
      background: @primary-600;
      color: white;
      border-bottom-right-radius: 4px;

      .meta {
        justify-content: flex-end;
      }

      /* 💫 Transition douce quand le message devient lu */
      &.read {
        background: @primary-500;
        box-shadow: 0 0 6px fade(@primary-600, 30%);
        transition: background 0.4s ease;
      }
    }

    /* 👥 Espacement entre messages groupés */
    &.grouped .bubble {
      margin-top: 2px;
    }

    /* ✨ Apparition des coches */
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
