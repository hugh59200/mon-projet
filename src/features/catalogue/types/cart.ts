import type { Tables } from '@/supabase/types/supabase'
import type { Product } from './product'

export type CartItem = Product & { quantity: number }

export type UserCartRow = Tables<'user_cart'> & { items: CartItem[] }
