import type { Tables, TablesInsert, TablesUpdate } from './supabase'

// ==========================================
// 🔐 ROLES
// ==========================================
export type Role = 'admin' | 'user'

// ==========================================
// 👤 TABLES
// ==========================================

export type Profiles = Tables<'profiles'>
export type ProfilesInsert = TablesInsert<'profiles'>
export type ProfilesUpdate = TablesUpdate<'profiles'>

export type Orders = Tables<'orders'>
export type OrderInsert = TablesInsert<'orders'>
export type OrderUpdate = TablesUpdate<'orders'>

export type OrderItem = Tables<'order_items'>

export type EmailSent = Tables<'emails_sent'>
export type EmailSentInsert = TablesInsert<'emails_sent'>
export type EmailSentUpdate = TablesUpdate<'emails_sent'>

export type News = Tables<'news'>
export type NewsInsert = TablesInsert<'news'>
export type NewsUpdate = TablesUpdate<'news'>

export type Products = Tables<'products'>
export type ProductsInsert = TablesInsert<'products'>
export type ProductsUpdate = TablesUpdate<'products'>

export type NewsTopics = Tables<'news_topics'>
export type NewsTopicsInsert = TablesInsert<'news_topics'>
export type NewsTopicsUpdate = TablesUpdate<'news_topics'>

export type Resources = Tables<'resources'>
export type ResourcesInsert = TablesInsert<'resources'>
export type ResourcesUpdate = TablesUpdate<'resources'>

export type ResourceCategories = Tables<'resource_categories'>
export type ResourceCategoriesInsert = TablesInsert<'resource_categories'>
export type ResourceCategoriesUpdate = TablesUpdate<'resource_categories'>

export type Messages = Tables<'messages'>

export type Conversations = Tables<'conversations'>

export type CartItems = Tables<'user_cart_items'>

// ==========================================
// 👁️ VUES (VIEWS)
// ==========================================

export type CartView = Tables<'user_cart_view'>
export type OrdersOverviewForAdmin = Tables<'orders_overview_for_admin'>
export type OrdersFullView = Tables<'orders_full_view'>
export type ConversationOverview = Tables<'conversation_overview'>

// ==========================================
// 🛠️ TYPES MANUELS & COMPLEXES
// ==========================================

/**
 * ⚠️ IMPORTANT V2.2 :
 * Correspond à l'objet JSON construit dans 'orders_detailed_view'.
 */
export type OrderItemDetailed = {
  product_id: string
  product_name: string // Snapshot (ex: "Semax (5mg)") ou Nom actuel
  product_dosage?: string | null // ✅ AJOUT V2.2
  product_price: number
  product_image: string | null
  product_stock: number
  quantity: number
  total: number
}

/**
 * Version enrichie de la commande avec les items détaillés
 */
export type OrderDetailedView = Omit<Tables<'orders_detailed_view'>, 'detailed_items'> & {
  detailed_items: OrderItemDetailed[] | null
}