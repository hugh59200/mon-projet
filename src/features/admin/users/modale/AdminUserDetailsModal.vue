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
        {{ t('admin.userDetails.title') }}
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
              {{ t('admin.userDetails.generalInfo') }}
            </BasicText>
            <BasicBadge
              :label="getLabelBadge(user.role as Role)"
              :type="getTypeBadge(user.role as Role)"
            />
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">{{ t('admin.userDetails.fullName') }}</span>
              <span class="value">{{ user.full_name || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.userDetails.email') }}</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.userDetails.userId') }}</span>
              <span class="value font-mono text-xs">{{ user.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.userDetails.createdAt') }}</span>
              <span class="value">{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('admin.userDetails.cguAccepted') }}</span>
              <span class="value">
                {{ user.cgu_accepted ? `✅ ${t('common.yes')}` : `❌ ${t('common.no')}` }}
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
            {{ t('admin.userDetails.roleManagement') }}
          </BasicText>
          <div class="flex-gap-5 align-items-center flex">
            <BasicDropdown
              v-model="selectedRole"
              :items="ROLES_OPTIONS"
              size="small"
              class="w-40"
              :disabled="isUpdatingRole"
            />
            <PremiumButton
              :label="t('admin.userDetails.changeRole')"
              type="primary"
              size="sm"
              :loading="isUpdatingRole"
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
              {{ t('admin.userDetails.orderHistory') }} ({{ orders.length }})
            </BasicText>
          </div>

          <div
            v-if="orders.length"
            class="orders-table-wrapper"
          >
            <table class="orders-table">
              <thead>
                <tr>
                  <th>{{ t('orders.date') }}</th>
                  <th>{{ t('orders.orderNumber') }}</th>
                  <th>{{ t('orders.total') }}</th>
                  <th>{{ t('orders.status') }}</th>
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
              {{ t('admin.userDetails.noOrders') }}
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
            {{ t('admin.common.dangerZone') }}
          </BasicText>
          <BasicText
            size="body-s"
            class="mb-4"
            color="neutral-600"
          >
            {{ t('admin.common.deleteWarning') }}
          </BasicText>
          <PremiumButton
            :label="t('admin.userDetails.deleteUser')"
            type="danger"
            variant="outline"
            size="sm"
            icon-left="Trash2"
            :loading="isDeleting"
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
  import { useLanguage } from '@/composables/useLanguage'

  const { t } = useLanguage()

  const visible = defineModel<boolean>()
  const props = defineProps<{ userId: string }>()
  const emit = defineEmits(['refresh'])

  const { changeUserRole, deleteUser } = useUserActions()

  const user = ref<Profiles | null>(null)
  const orders = ref<Orders[]>([])
  const isLoading = ref(true)
  const isUpdatingRole = ref(false)
  const isDeleting = ref(false)
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

    isUpdatingRole.value = true
    try {
      await changeUserRole(user.value as any, selectedRole.value)
      await loadData()
      emit('refresh')
    } finally {
      isUpdatingRole.value = false
    }
  }

  const handleDelete = async () => {
    if (!user.value) return

    isDeleting.value = true
    try {
      await deleteUser(user.value as any)
      visible.value = false
      emit('refresh')
    } finally {
      isDeleting.value = false
    }
  }

  onMounted(loadData)
  watch(() => props.userId, loadData)
</script>

<style scoped lang="less">
  .user-detail {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
    overflow-x: hidden;
  }

  .info-card {
    position: relative;
    background: linear-gradient(135deg, @white 0%, @neutral-50 100%);
    padding: 24px;
    border-radius: 16px;
    border: 1px solid @neutral-200;
    display: flex;
    flex-direction: column;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 2px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
      border-radius: 16px 16px 0 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 2px 6px rgba(0, 0, 0, 0.06);
      border-color: var(--primary-300);
      background: @white;

      &::before {
        opacity: 1;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid @neutral-100;

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
    gap: 16px 24px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      background: @neutral-50;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.03);
      }

      .label {
        font-size: 11px;
        color: var(--primary-600);
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 700;
      }

      .value {
        font-size: 14px;
        color: @neutral-900;
        font-weight: 500;
      }
    }
  }

  .orders-table-wrapper {
    border: 2px solid @neutral-200;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 16px;
    background: @white;
  }

  .orders-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th {
      background: linear-gradient(135deg, var(--secondary-900) 0%, var(--secondary-800) 100%);
      text-align: left;
      padding: 12px 16px;
      color: @white;
      font-weight: 700;
      border-bottom: 1px solid @neutral-200;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 12px;
    }

    td {
      padding: 14px 16px;
      border-bottom: 1px solid @neutral-100;
      color: @neutral-800;
      transition: background 0.2s;

      &:last-child {
        border-bottom: none;
      }
    }

    tr:hover td {
      background: rgba(var(--primary-500-rgb), 0.02);
    }
  }

  .empty-orders {
    padding: 20px;
    text-align: center;
    background: linear-gradient(135deg,
      rgba(var(--primary-500-rgb), 0.03) 0%,
      rgba(var(--primary-300-rgb), 0.05) 100%);
    border-radius: 12px;
    border: 2px dashed var(--primary-200);
    color: @neutral-600;
    margin-top: 16px;
  }

  // Animation pour les cartes
  .info-card {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.15s; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Responsive
  .respond-mobile({
    .user-detail {
      gap: 20px;
      padding: 4px;
    }

    .info-card {
      padding: 18px;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .orders-table {
      font-size: 11px;

      th,
      td {
        padding: 10px 12px;
      }
    }
  });
</style>
