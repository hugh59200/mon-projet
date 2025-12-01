<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
    :loading="isLoading"
    size="medium"
  >
    <template #header>
      <BasicText
        size="h4"
        weight="bold"
      >
        Détails utilisateur
      </BasicText>
    </template>

    <template #content>
      <div
        class="user-detail"
        v-if="user"
      >
        <div class="info-card">
          <div class="card-header">
            <BasicText
              size="h5"
              weight="bold"
            >
              Informations générales
            </BasicText>
            <BasicBadge
              :label="getLabelBadge(user.role as Role)"
              :type="getTypeBadge(user.role as Role)"
            />
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nom complet</span>
              <span class="value">{{ user.full_name || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">ID Utilisateur</span>
              <span class="value font-mono text-xs">{{ user.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date création</span>
              <span class="value">{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">CGU Acceptées</span>
              <span class="value">
                {{ user.cgu_accepted ? '✅ Oui' : '❌ Non' }}
              </span>
            </div>
          </div>
        </div>

        <div class="info-card border-blue-100 bg-blue-50">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-3"
            color="primary-800"
          >
            Gestion du rôle
          </BasicText>
          <div class="flex-gap-5 align-items-center flex">
            <BasicDropdown
              v-model="selectedRole"
              :items="ROLES_OPTIONS"
              size="small"
              class="w-40"
            />
            <BasicButton
              label="Modifier le rôle"
              type="primary"
              size="small"
              @click="handleRoleChange"
            />
          </div>
        </div>

        <div class="info-card">
          <div class="card-header border-none pb-0">
            <BasicText
              size="h5"
              weight="bold"
            >
              Historique Commandes ({{ orders.length }})
            </BasicText>
          </div>

          <div
            v-if="orders.length"
            class="orders-table-wrapper"
          >
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Référence</th>
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
                  <td class="font-mono text-xs text-neutral-500">
                    {{ o.order_number || o.id.slice(0, 8) }}
                  </td>
                  <td class="font-bold text-neutral-700">
                    {{ formatCurrency(o.total_amount) }}
                  </td>
                  <td>
                    <BasicBadge
                      :label="getLabelBadge(o.status)"
                      :type="getTypeBadge(o.status)"
                      size="small"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-else
            class="empty-orders"
          >
            <BasicText
              color="neutral-500"
              size="body-s"
            >
              Aucune commande passée.
            </BasicText>
          </div>
        </div>

        <div class="info-card border-red-100 bg-red-50">
          <BasicText
            size="h5"
            weight="bold"
            class="mb-2"
            color="danger-700"
          >
            Zone de danger
          </BasicText>
          <BasicText
            size="body-s"
            class="mb-4"
            color="neutral-600"
          >
            Cette action est irréversible. Toutes les données seront supprimées.
          </BasicText>
          <BasicButton
            label="Supprimer l'utilisateur"
            type="danger"
            variant="outlined"
            size="small"
            icon-name="Trash2"
            @click="handleDelete"
          />
        </div>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { ROLES } from '@/features/admin/constants/users'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useUserActions } from '../composables/useUserActions'
  import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
  import type { Orders, Profiles, Role } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate, getLabelBadge, getTypeBadge } from '@/utils/index'
  import { onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ userId: string }>()
  const emit = defineEmits(['refresh'])

  const { changeUserRole, deleteUser } = useUserActions()

  const user = ref<Profiles | null>(null)
  const orders = ref<Orders[]>([])
  const isLoading = ref(true)
  const selectedRole = ref<Role>('user')

  // ✅ Correction 1 : On mappe vers 'id' pour satisfaire le type DropdownItem
  // 'r' vient de ROLES qui a { id, label }
  const ROLES_OPTIONS = ROLES.map((r) => ({ label: r.label, id: r.id }))

  async function loadData() {
    isLoading.value = true
    try {
      // Load User
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', props.userId)
        .single()
      user.value = userData
      if (userData) selectedRole.value = (userData.role as Role) || 'user'

      // Load Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', props.userId)
        .order('created_at', { ascending: false })
      orders.value = ordersData || []
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const handleRoleChange = async () => {
    if (!user.value) return
    // ✅ Correction 2 : 'as any' pour éviter l'erreur "excessively deep type instantiation"
    // Cela arrive car le type Profiles est très complexe (champs JSON, nullables)
    await changeUserRole(user.value as any, selectedRole.value)

    await loadData() // Reload local
    emit('refresh') // Refresh parent table
  }

  const handleDelete = async () => {
    if (!user.value) return
    // ✅ Correction 2 bis : même chose ici par sécurité pour deleteUser
    await deleteUser(user.value as any)
    visible.value = false // Close modal on delete
    emit('refresh')
  }

  onMounted(loadData)
  watch(() => props.userId, loadData)
</script>

<style scoped lang="less">
  .user-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .info-card {
    background: @white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid @neutral-100;

      &.border-none {
        border-bottom: none;
        margin-bottom: 8px;
        padding-bottom: 0;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 11px;
        color: @neutral-500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      .value {
        font-size: 14px;
        color: @neutral-900;
      }
    }
  }

  .orders-table-wrapper {
    border: 1px solid @neutral-200;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 12px;
  }

  .orders-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th {
      background: @neutral-50;
      text-align: left;
      padding: 10px 12px;
      color: @neutral-600;
      font-weight: 600;
      border-bottom: 1px solid @neutral-200;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid @neutral-100;
      color: @neutral-800;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .empty-orders {
    padding: 16px;
    text-align: center;
    background: @neutral-50;
    border-radius: 8px;
    border: 1px dashed @neutral-300;
  }
</style>
