<template>
  <div class="session-card-mobile">
    <div class="session-card-mobile__header">
      <div class="user-info">
        <div class="avatar">
          <img
            v-if="session.profiles?.avatar_url"
            :src="session.profiles.avatar_url"
            alt="avatar"
          />
          <BasicIconNext
            v-else
            :name="session.session_type === 'authenticated' ? 'User' : 'UserX'"
            :size="18"
            color="neutral-400"
          />
        </div>
        <div class="details">
          <span class="name">
            {{ session.profiles?.full_name || session.profiles?.email || 'Visiteur anonyme' }}
          </span>
          <span class="meta">
            {{ getCountryFlag(session.country_code) }}
            {{ session.city || session.country || 'Localisation inconnue' }}
          </span>
        </div>
      </div>
      <BasicBadge
        :label="getSessionTypeLabel(session.session_type)"
        :type="getSessionTypeBadge(session.session_type)"
        size="small"
      />
    </div>

    <div class="session-card-mobile__body">
      <div class="info-row">
        <span class="label">
          <BasicIconNext
            :name="getDeviceIcon(session.device_type)"
            :size="14"
            color="neutral-500"
          />
          Appareil
        </span>
        <span class="value">{{ session.browser || '—' }} / {{ session.os || '—' }}</span>
      </div>

      <div class="info-row">
        <span class="label">
          <BasicIconNext
            name="Clock"
            :size="14"
            color="neutral-500"
          />
          Date
        </span>
        <span class="value">{{ formatDateTime(session.started_at) }}</span>
      </div>

      <div class="info-row">
        <span class="label">
          <BasicIconNext
            name="Timer"
            :size="14"
            color="neutral-500"
          />
          Durée
        </span>
        <span class="value">{{ formatDuration(session.duration_seconds) }}</span>
      </div>

      <div class="info-row">
        <span class="label">
          <BasicIconNext
            name="FileText"
            :size="14"
            color="neutral-500"
          />
          Pages vues
        </span>
        <span class="value">{{ session.pages_viewed }}</span>
      </div>
    </div>

    <div
      v-if="session.added_to_cart || session.started_checkout || session.completed_order"
      class="session-card-mobile__footer"
    >
      <BasicBadge
        v-if="session.completed_order"
        label="Commande effectuée"
        type="success"
        size="small"
      />
      <BasicBadge
        v-else-if="session.started_checkout"
        label="Checkout démarré"
        type="warning"
        size="small"
      />
      <BasicBadge
        v-else-if="session.added_to_cart"
        label="Ajout au panier"
        type="info"
        size="small"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { UserSession } from '@/api/supabase/sessions'

  defineProps<{
    session: UserSession
    formatDateTime: (date: string) => string
    formatDuration: (seconds: number | null) => string
    getCountryFlag: (code: string | null) => string
    getSessionTypeLabel: (type: string) => string
    getSessionTypeBadge: (type: string) => 'success' | 'secondary' | 'warning'
  }>()

  function getDeviceIcon(device: string | null): 'Monitor' | 'Tablet' | 'Smartphone' | 'HelpCircle' {
    switch (device) {
      case 'desktop':
        return 'Monitor'
      case 'tablet':
        return 'Tablet'
      case 'mobile':
        return 'Smartphone'
      default:
        return 'HelpCircle'
    }
  }
</script>

<style scoped lang="less">
  .session-card-mobile {
    background: var(--admin-bg-surface);
    border: 1px solid var(--admin-border-subtle);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 8px;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;

      .user-info {
        display: flex;
        gap: 10px;
        align-items: center;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--admin-bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .details {
          display: flex;
          flex-direction: column;

          .name {
            font-weight: 600;
            color: var(--admin-text-primary);
            font-size: 14px;
          }

          .meta {
            font-size: 12px;
            color: var(--admin-text-muted);
          }
        }
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 0;
      border-top: 1px solid var(--admin-border-subtle);
      border-bottom: 1px solid var(--admin-border-subtle);

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--admin-text-muted);
        }

        .value {
          font-size: 13px;
          color: var(--admin-text-primary);
          font-weight: 500;
        }
      }
    }

    &__footer {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      flex-wrap: wrap;
    }
  }
</style>
