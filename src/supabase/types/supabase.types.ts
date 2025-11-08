import type { Tables, TablesInsert, TablesUpdate } from './supabase'

export type Role = 'admin' | 'user'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'canceled'

export type Profiles = Tables<'profiles'>
export type UserInsert = TablesInsert<'profiles'>
export type UserUpdate = TablesUpdate<'profiles'>

export type Orders = Tables<'orders'>
export type OrderInsert = TablesInsert<'orders'>
export type OrderUpdate = TablesUpdate<'orders'>

export type EmailSent = Tables<'emails_sent'>
export type EmailSentInsert = TablesInsert<'emails_sent'>
export type EmailSentUpdate = TablesUpdate<'emails_sent'>

export type News = Tables<'news'>
export type NewsInsert = TablesInsert<'news'>
export type NewsUpdate = TablesUpdate<'news'>

export type Products = Tables<'products'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>

export type NewsTopics = Tables<'news_topics'>
export type NewsTopicInsert = TablesInsert<'news_topics'>
export type NewsTopicUpdate = TablesUpdate<'news_topics'>

export type CartView = Tables<'user_cart_view'>
export type CartItems = Tables<'user_cart_items'>

export type OrdersOverviewForAdmin = Tables<'orders_overview_for_admin'>

export type Messages = Tables<'messages'>

export type Conversations = Tables<'conversations'>


