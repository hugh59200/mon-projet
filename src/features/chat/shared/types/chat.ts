/* -------------------------------------------------------------------------- */
/* 🧠  Types centraux du module "Support Chat"                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* 🎭 Rôles et événements                                                     */
/* -------------------------------------------------------------------------- */

/** Rôles possibles dans le chat */
export type ChatRole = 'admin' | 'user'

/** Événements Realtime utilisés pour les statuts "typing" */
export type TypingEvent = 'user_typing' | 'admin_typing'

/** Mapping entre les rôles et les événements correspondants */
export const TypingEventMap: Record<ChatRole, TypingEvent> = {
  admin: 'admin_typing',
  user: 'user_typing',
}

/** Vue SQL : conversation_overview */
export type ConversationOverview = {
  user_id: string
  user_email: string | null
  full_name: string | null
  last_read_message_id: number | null
  last_read_at: string | null
  last_admin_message_id: number | null
  last_admin_read_at: string | null
  last_message: string | null
  last_message_at: string | null
  unread_count: number
}

/* -------------------------------------------------------------------------- */
/* 📡 Realtime / Broadcast payloads                                           */
/* -------------------------------------------------------------------------- */

/**
 * Payload typé pour les broadcasts "typing"
 */
export type BroadcastPayload<T extends TypingEvent> = {
  event: T
  type: 'broadcast'
  payload: {
    isTyping: boolean
  }
}

/* -------------------------------------------------------------------------- */
/* ⚙️ Types utilitaires                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Union stricte des événements Realtime utilisables dans ce module
 */
export type ChatRealtimeEvent = BroadcastPayload<TypingEvent>

/**
 * Permet d’associer facilement un rôle à un style CSS, une icône, etc.
 */
export const ChatRoleLabel: Record<ChatRole, string> = {
  admin: 'Support',
  user: 'Client',
}
