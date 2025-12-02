import { supabase } from '@/supabase/supabaseClient'
import type { Messages } from '@/supabase/types/supabase.types'
import { ref } from 'vue'

export interface AiSuggestionMessage {
  role: 'user' | 'admin'
  content: string
  created_at?: string
}

interface GenerateSuggestionResponse {
  success: boolean
  data?: {
    suggestion: string
    tokensUsed: number
  }
  error?: string
}

export function useAiSuggestion() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastSuggestion = ref<string | null>(null)

  /**
   * Convertit les messages Supabase en format pour l'API
   */
  function formatMessages(messages: Messages[]): AiSuggestionMessage[] {
    return messages.map((msg) => ({
      role: msg.sender_role as 'user' | 'admin',
      content: msg.content ?? '',
      created_at: msg.created_at ?? undefined,
    }))
  }

  /**
   * Génère une suggestion de réponse basée sur l'historique
   */
  async function generateSuggestion(
    messages: Messages[],
    clientEmail?: string,
  ): Promise<string | null> {
    if (messages.length === 0) {
      error.value = 'Aucun message dans la conversation'
      return null
    }

    isLoading.value = true
    error.value = null
    lastSuggestion.value = null

    try {
      const formattedMessages = formatMessages(messages)

      const { data, error: fnError } = await supabase.functions.invoke<GenerateSuggestionResponse>(
        'generate-chat-suggestion',
        {
          body: {
            messages: formattedMessages,
            clientEmail,
          },
        },
      )

      if (fnError) {
        throw new Error(fnError.message || 'Erreur lors de la génération')
      }

      if (!data?.success || !data?.data?.suggestion) {
        throw new Error(data?.error || 'Aucune suggestion générée')
      }

      lastSuggestion.value = data.data.suggestion
      return data.data.suggestion
    } catch (err) {
      console.error('[AI Suggestion] Erreur:', err)
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Réinitialise l'état
   */
  function reset() {
    isLoading.value = false
    error.value = null
    lastSuggestion.value = null
  }

  return {
    isLoading,
    error,
    lastSuggestion,
    generateSuggestion,
    reset,
  }
}
