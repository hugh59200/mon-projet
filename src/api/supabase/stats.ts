import { supabaseSilent as supabase } from '@/supabase/supabaseClient'

export async function fetchOrdersStats() {
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })

  const { data: revenueData } = await supabase.from('orders').select('total_amount')
  const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

  const { count: shipped } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'shipped')

  const { count: pending } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return {
    total_orders: totalOrders || 0,
    total_revenue: totalRevenue,
    shipped_orders: shipped || 0,
    pending_orders: pending || 0,
  }
}

export async function fetchWeeklyOrdersData() {
  const since = new Date()
  since.setDate(since.getDate() - 6)

  const { data, error } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', since.toISOString())

  if (error) throw error
  return data ?? []
}

export async function fetchTopClients() {
  const { data, error } = await supabase.from('orders').select(`
    user_id,
    total_amount,
    created_at,
    profiles!inner (
      full_name,
      email,
      avatar_url
    )
  `)

  if (error) throw error
  return data ?? []
}
