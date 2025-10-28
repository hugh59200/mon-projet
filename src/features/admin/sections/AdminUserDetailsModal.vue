<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <template #header>
      <BasicText
        size="h5"
        weight="bold"
      >
        Profil utilisateur
      </BasicText>
    </template>

    <template #content>
      <div
        class="user-detail--compact"
        v-if="user"
      >
        <div class="user-detail__info">
          <div class="user-detail__grid">
            <div>
              <p>
                <b>Nom :</b>
                {{ user.full_name || '—' }}
              </p>
              <p>
                <b>Email :</b>
                {{ user.email }}
              </p>
              <p>
                <b>Rôle :</b>
                {{ user.role || '—' }}
              </p>
            </div>
            <div>
              <p>
                <b>ID :</b>
                {{ user.id }}
              </p>
              <p>
                <b>Créé le :</b>
                {{ formatDate(user.created_at) }}
              </p>
              <p>
                <b>CGU :</b>
                {{ user.cgu_accepted ? '✅ Oui' : '❌ Non' }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="orders.length"
          class="user-detail__orders"
        >
          <h5>Commandes ({{ orders.length }})</h5>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="o in orders"
                :key="o.id"
              >
                <td>{{ formatDate(o.created_at) }}</td>
                <td>{{ formatCurrency(o.total_amount) }}</td>
                <td>{{ o.status || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-else
        class="user-detail__loading"
      >
        <BasicLoader />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { supabase } from '@/services/supabaseClient'
  import type { Tables } from '@/types/supabase'
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ userId: string }>()

  type UserRow = Tables<'profiles'>
  type OrderRow = Tables<'orders'>

  const user = ref<UserRow | null>(null)
  const orders = ref<OrderRow[]>([])

  async function loadUser() {
    const { data } = await supabase.from('profiles').select('*').eq('id', props.userId).single()
    user.value = data
  }

  async function loadOrders() {
    const { data } = await supabase.from('orders').select('*').eq('user_id', props.userId)
    orders.value = data || []
  }

  onMounted(() => {
    loadUser()
    loadOrders()
  })
  watch(
    () => props.userId,
    () => {
      loadUser()
      loadOrders()
    },
  )

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
  function formatCurrency(v: number | null) {
    return v == null ? '-' : v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  }
</script>

<style scoped lang="less">
  .user-detail--compact {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .user-detail__info,
  .user-detail__orders {
    background-color: @neutral-100;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    padding: 16px 18px;
    font-size: 14px;
  }
  .user-detail__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 24px;
  }
  .user-detail__grid p {
    margin: 0;
    display: flex;
    gap: 6px;
    line-height: 1.5;
  }
  .user-detail__orders table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .user-detail__orders th,
  .user-detail__orders td {
    border-bottom: 1px solid #eaecef;
    padding: 8px 10px;
  }
  .user-detail__loading {
    text-align: center;
    padding: 40px;
  }
  @media (max-width: 768px) {
    .user-detail__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
