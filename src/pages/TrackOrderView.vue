<template>
  <div class="track">
    <!-- Background -->
    <div class="track__bg">
      <div class="track__bg-gradient"></div>
      <div class="track__bg-pattern"></div>
      <div class="track__bg-orb track__bg-orb--1"></div>
      <div class="track__bg-orb track__bg-orb--2"></div>
    </div>

    <div class="track__container">
      <!-- Header -->
      <header class="track__header" :class="{ 'track__header--compact': !!order || loading }">
        <div class="track__header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 8V21H3V8" />
            <path d="M1 3H23V8H1V3Z" />
            <path d="M10 12H14" />
          </svg>
        </div>
        <div class="track__header-text">
          <h1 class="track__title">Suivi de commande</h1>
          <p v-if="!order && !loading" class="track__subtitle">
            Consultez l'état d'avancement de votre livraison en temps réel
          </p>
        </div>
      </header>

      <!-- Error Toast -->
      <transition name="slide-down">
        <div v-if="errorMessage" class="track__error">
          <div class="track__error-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div class="track__error-content">
            <strong>Attention</strong>
            <span>{{ errorMessage }}</span>
          </div>
          <button class="track__error-close" @click="errorMessage = ''">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition>

      <!-- Loading Skeleton (quand on arrive avec un token) -->
      <div v-if="loading && !order" class="track__skeleton">
        <div class="track__skeleton-nav">
          <div class="track__skeleton-btn"></div>
        </div>
        <div class="track__skeleton-grid">
          <!-- Main Column -->
          <div class="track__skeleton-main">
            <!-- Status Card -->
            <div class="track__skeleton-card track__skeleton-card--status">
              <div class="track__skeleton-header">
                <div>
                  <div class="track__skeleton-line track__skeleton-line--label"></div>
                  <div class="track__skeleton-line track__skeleton-line--number"></div>
                </div>
                <div class="track__skeleton-badge"></div>
              </div>
              <div class="track__skeleton-timeline">
                <div class="track__skeleton-step" v-for="i in 4" :key="i">
                  <div class="track__skeleton-step-icon"></div>
                  <div class="track__skeleton-step-label"></div>
                </div>
              </div>
            </div>
            <!-- Details -->
            <div class="track__skeleton-details">
              <div class="track__skeleton-card track__skeleton-card--detail">
                <div class="track__skeleton-detail-icon"></div>
                <div class="track__skeleton-detail-content">
                  <div class="track__skeleton-line track__skeleton-line--small"></div>
                  <div class="track__skeleton-line track__skeleton-line--medium"></div>
                  <div class="track__skeleton-line track__skeleton-line--large"></div>
                </div>
              </div>
              <div class="track__skeleton-card track__skeleton-card--detail">
                <div class="track__skeleton-detail-icon"></div>
                <div class="track__skeleton-detail-content">
                  <div class="track__skeleton-line track__skeleton-line--small"></div>
                  <div class="track__skeleton-line track__skeleton-line--medium"></div>
                  <div class="track__skeleton-line track__skeleton-line--large"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- Sidebar -->
          <div class="track__skeleton-sidebar">
            <div class="track__skeleton-card track__skeleton-card--summary">
              <div class="track__skeleton-summary-header">
                <div class="track__skeleton-line track__skeleton-line--title"></div>
                <div class="track__skeleton-line track__skeleton-line--count"></div>
              </div>
              <div class="track__skeleton-items">
                <div class="track__skeleton-item" v-for="i in 2" :key="i">
                  <div class="track__skeleton-item-img"></div>
                  <div class="track__skeleton-item-info">
                    <div class="track__skeleton-line track__skeleton-line--name"></div>
                    <div class="track__skeleton-line track__skeleton-line--qty"></div>
                  </div>
                </div>
              </div>
              <div class="track__skeleton-totals">
                <div class="track__skeleton-total-row"></div>
                <div class="track__skeleton-total-row"></div>
                <div class="track__skeleton-total-row track__skeleton-total-row--main"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Search Form -->
      <div v-if="!order && !loading" class="track__search">
        <div class="track__search-card">
          <div class="track__search-header">
            <div class="track__search-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div>
              <h2 class="track__search-title">Localiser ma commande</h2>
              <p class="track__search-subtitle">Entrez vos informations pour accéder au suivi</p>
            </div>
          </div>

          <form @submit.prevent="handleSearch" class="track__form">
            <div class="track__form-group">
              <label class="track__label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                </svg>
                Numéro de commande
              </label>
              <input
                v-model="form.orderNumber"
                type="text"
                class="track__input"
                placeholder="Ex: FP-2025-000123"
                required
                :class="{ 'track__input--error': !!errorMessage }"
                @input="errorMessage = ''"
              />
            </div>

            <div class="track__form-group">
              <label class="track__label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Adresse email
              </label>
              <input
                v-model="form.email"
                type="email"
                class="track__input"
                placeholder="exemple@email.com"
                required
                :class="{ 'track__input--error': !!errorMessage }"
                @input="errorMessage = ''"
              />
            </div>

            <button type="submit" class="track__submit" :disabled="loading">
              <span v-if="loading" class="track__submit-loader"></span>
              <template v-else>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Localiser mon colis
              </template>
            </button>
          </form>

          <div class="track__search-footer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Vos données sont protégées et sécurisées</span>
          </div>
        </div>

        <!-- Help Section -->
        <div class="track__help">
          <h3 class="track__help-title">Besoin d'aide ?</h3>
          <div class="track__help-items">
            <div class="track__help-item">
              <div class="track__help-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <strong>Email de confirmation</strong>
                <span>Le numéro de commande se trouve dans votre email de confirmation</span>
              </div>
            </div>
            <div class="track__help-item">
              <div class="track__help-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <strong>Contacter le support</strong>
                <span>Notre équipe répond sous 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="order" class="track__results">
        <!-- Navigation -->
        <div class="track__nav">
          <button class="track__nav-back" @click="resetSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Nouvelle recherche
          </button>
        </div>

        <div class="track__grid">
          <!-- Left Column -->
          <div class="track__main">
            <!-- Status Card -->
            <div class="track__status-card">
              <div class="track__status-header">
                <div class="track__status-info">
                  <span class="track__status-label">Commande</span>
                  <span class="track__status-number">{{ order.order_number }}</span>
                </div>
                <div class="track__status-badge" :class="`track__status-badge--${order.status}`">
                  <span class="track__status-dot"></span>
                  {{ getLabelBadge(order.status) }}
                </div>
              </div>

              <!-- Timeline -->
              <div class="track__timeline">
                <div
                  v-for="(step, index) in TIMELINE_STEPS"
                  :key="step.key"
                  class="track__timeline-step"
                  :class="{ 'track__timeline-step--active': isStepActive(step.statuses) }"
                >
                  <div class="track__timeline-icon">
                    <svg v-if="isStepActive(step.statuses)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span v-else class="track__timeline-dot"></span>
                  </div>
                  <div class="track__timeline-content">
                    <span class="track__timeline-label">{{ step.label }}</span>
                    <span v-if="step.dateField && (order as Record<string, any>)[step.dateField]" class="track__timeline-date">
                      {{ formatDate((order as Record<string, any>)[step.dateField]) }}
                    </span>
                  </div>
                  <div
                    v-if="index < TIMELINE_STEPS.length - 1"
                    class="track__timeline-line"
                    :class="{ 'track__timeline-line--active': isLineActive(index) }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Details Cards -->
            <div class="track__details">
              <!-- Shipping Address -->
              <div class="track__detail-card">
                <div class="track__detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div class="track__detail-content">
                  <span class="track__detail-label">Adresse de livraison</span>
                  <strong class="track__detail-name">{{ order.shipping_name }}</strong>
                  <p class="track__detail-address">
                    {{ order.shipping_address }}<br />
                    {{ order.shipping_zip }} {{ order.shipping_city }}
                  </p>
                </div>
              </div>

              <!-- Carrier Info -->
              <div v-if="order.tracking_number" class="track__detail-card track__detail-card--carrier">
                <div class="track__detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div class="track__detail-content">
                  <span class="track__detail-label">Transporteur</span>
                  <strong class="track__detail-name">{{ order.carrier || 'Colissimo' }}</strong>
                  <button class="track__tracking-copy" @click="copyTracking">
                    <span class="track__tracking-number">{{ order.tracking_number }}</span>
                    <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Column -->
          <aside class="track__sidebar">
            <!-- Order Summary -->
            <div class="track__summary">
              <div class="track__summary-header">
                <h3 class="track__summary-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                  </svg>
                  Récapitulatif
                </h3>
                <span class="track__summary-count">{{ detailedItemsCount }} article{{ detailedItemsCount > 1 ? 's' : '' }}</span>
              </div>

              <!-- Items List -->
              <div class="track__items">
                <div
                  v-for="item in (order as any)?.detailed_items"
                  :key="item.product_id"
                  class="track__item"
                >
                  <div class="track__item-image">
                    <img :src="item.product_image || defaultImage" :alt="item.product_name" />
                  </div>
                  <div class="track__item-info">
                    <div class="track__item-top">
                      <span class="track__item-name">{{ item.product_name }}</span>
                      <span class="track__item-price">{{ formatPrice(item.total) }}</span>
                    </div>
                    <div class="track__item-bottom">
                      <span class="track__item-qty">Qté: {{ item.quantity }}</span>
                      <span v-if="item.product_dosage" class="track__item-dosage">
                        {{ item.product_dosage }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Totals -->
              <div class="track__totals">
                <div class="track__totals-row">
                  <span>Sous-total</span>
                  <span>{{ formatPrice(order.subtotal) }}</span>
                </div>
                <div class="track__totals-row">
                  <span>Livraison</span>
                  <span :class="{ 'track__totals-free': order.shipping_cost === 0 }">
                    {{ order.shipping_cost === 0 ? 'Offerte' : formatPrice(order.shipping_cost) }}
                  </span>
                </div>
                <div v-if="order.discount_amount" class="track__totals-row track__totals-row--discount">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    Réduction
                  </span>
                  <span>-{{ formatPrice(order.discount_amount) }}</span>
                </div>
                <div class="track__totals-divider"></div>
                <div class="track__totals-row track__totals-row--total">
                  <span>Total payé</span>
                  <span>{{ formatPrice(order.total_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Guest Registration CTA -->
            <div
              v-if="order.is_guest_order && !auth.user && !registerSuccess"
              class="track__register"
            >
              <div class="track__register-header">
                <div class="track__register-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <div class="track__register-text">
                  <strong>Créer mon compte</strong>
                  <span>Retrouvez facilement toutes vos commandes</span>
                </div>
              </div>

              <div class="track__register-form">
                <div class="track__register-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{{ order.shipping_email }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="track__register-check">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>

                <div class="track__register-input-wrapper">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    v-model="newPassword"
                    type="password"
                    class="track__register-input"
                    placeholder="Choisissez un mot de passe"
                  />
                </div>

                <button
                  class="track__register-btn"
                  :disabled="registerLoading"
                  @click="handleQuickRegister"
                >
                  <span v-if="registerLoading" class="track__register-loader"></span>
                  <template v-else>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <polyline points="17 11 19 13 23 9" />
                    </svg>
                    Créer mon compte
                  </template>
                </button>
              </div>
            </div>

            <!-- Success Message -->
            <div v-else-if="registerSuccess" class="track__success">
              <div class="track__success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <strong class="track__success-title">Compte créé avec succès !</strong>
              <p class="track__success-text">Un email de confirmation vous a été envoyé.</p>
            </div>

            <!-- Trust Badges -->
            <div class="track__trust">
              <div class="track__trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Données sécurisées</span>
              </div>
              <div class="track__trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <span>Support 24/7</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultImage from '@/assets/products/default/default-product-image.png'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { trackGuestOrderByEmail, trackGuestOrderByToken } from '@/supabase/api/ordersApi'
import { supabase } from '@/supabase/supabaseClient'
import type { OrdersFullView } from '@/supabase/types/supabase.types'
import { getLabelBadge } from '@/utils'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

// State
const loading = ref(false)
const order = ref<OrdersFullView | null>(null)
const errorMessage = ref('')
const copied = ref(false)
const newPassword = ref('')
const registerLoading = ref(false)
const registerSuccess = ref(false)

const form = ref({
  orderNumber: '',
  email: '',
})

// Computed
const detailedItemsCount = computed(() => {
  const orderValue = order.value as any
  return orderValue && Array.isArray(orderValue.detailed_items)
    ? orderValue.detailed_items.length
    : 0
})

// Timeline Configuration
const TIMELINE_STEPS = [
  {
    key: 'step1',
    label: 'Confirmée',
    icon: 'Check',
    statuses: ['paid', 'confirmed', 'processing', 'shipped', 'completed'],
    dateField: 'created_at',
  },
  {
    key: 'step2',
    label: 'En préparation',
    icon: 'Package',
    statuses: ['processing', 'shipped', 'completed'],
    dateField: null,
  },
  {
    key: 'step3',
    label: 'Expédiée',
    icon: 'Truck',
    statuses: ['shipped', 'completed'],
    dateField: 'shipped_at',
  },
  {
    key: 'step4',
    label: 'Livrée',
    icon: 'Home',
    statuses: ['completed'],
    dateField: null,
  },
]

// Helpers
function isStepActive(validStatuses: string[]) {
  if (!order.value?.status) return false
  return validStatuses.includes(order.value.status)
}

function isLineActive(index: number) {
  const nextStep = TIMELINE_STEPS[index + 1]
  if (!nextStep) return false
  return isStepActive(nextStep.statuses)
}

function formatDate(date: string | null | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPrice(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))
}

// Actions
onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    await handleTokenTracking(token)
    return
  }
  if (route.query.email && route.query.ref) {
    form.value.email = route.query.email as string
    form.value.orderNumber = route.query.ref as string
    await handleSearch()
  }
})

async function handleTokenTracking(token: string) {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await trackGuestOrderByToken(token)
    order.value = data
  } catch (err: any) {
    errorMessage.value = err.message || 'Lien invalide ou expiré.'
    order.value = null
  } finally {
    loading.value = false
  }
}

async function handleSearch() {
  errorMessage.value = ''
  if (!form.value.email || !form.value.orderNumber) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true
  try {
    const data = await trackGuestOrderByEmail(form.value.email, form.value.orderNumber)
    order.value = data

    await router.replace({
      query: {
        ...route.query,
        email: form.value.email,
        ref: form.value.orderNumber,
        token: undefined,
      },
    })
  } catch (err: any) {
    errorMessage.value = err.message || 'Commande introuvable.'
    order.value = null
  } finally {
    loading.value = false
  }
}

async function handleQuickRegister() {
  if (!newPassword.value || newPassword.value.length < 6) {
    toast.show('Le mot de passe doit contenir au moins 6 caractères', 'warning')
    return
  }
  if (!order.value?.shipping_email) return

  registerLoading.value = true
  try {
    const { error } = await supabase.auth.signUp({
      email: order.value.shipping_email,
      password: newPassword.value,
      options: {
        data: {
          full_name: order.value.shipping_name || '',
        },
      },
    })

    if (error) throw error

    registerSuccess.value = true
    toast.show('Compte créé avec succès !', 'success')
  } catch (err: any) {
    console.error(err)
    toast.show(err.message || 'Erreur lors de la création du compte', 'danger')
  } finally {
    registerLoading.value = false
  }
}

function resetSearch() {
  order.value = null
  errorMessage.value = ''
  form.value.orderNumber = ''
  form.value.email = ''
  newPassword.value = ''
  registerSuccess.value = false
  router.replace({ query: {} })
}

async function copyTracking() {
  if (!order.value?.tracking_number) return
  try {
    await navigator.clipboard.writeText(order.value.tracking_number)
    copied.value = true
    toast.show('Numéro de suivi copié !', 'success')
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    toast.show('Erreur lors de la copie', 'danger')
  }
}
</script>
<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.track {
  position: relative;
  min-height: 100vh;
  background: @neutral-50;
  padding: 40px 24px 80px;

  // ============================================
  // BACKGROUND
  // ============================================
  &__bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  &__bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 70%;
    height: 70%;
    background: radial-gradient(
      ellipse at top left,
      rgba(var(--primary-500-rgb), 0.08) 0%,
      transparent 60%
    );
  }

  &__bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 60%);
  }

  &__bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;

    &--1 {
      top: -100px;
      right: 10%;
      width: 400px;
      height: 400px;
      background: rgba(var(--primary-400-rgb), 0.3);
    }

    &--2 {
      bottom: 10%;
      left: -100px;
      width: 300px;
      height: 300px;
      background: rgba(var(--primary-300-rgb), 0.2);
    }
  }

  // ============================================
  // CONTAINER
  // ============================================
  &__container {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
  }

  // ============================================
  // HEADER
  // ============================================
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 40px;
    transition: all 0.3s @ease;

    &--compact {
      flex-direction: row;
      text-align: left;
      gap: 16px;
      margin-bottom: 24px;

      .track__header-icon {
        width: 56px;
        height: 56px;
      }

      .track__title {
        font-size: 24px;
      }

      .track__subtitle {
        display: none;
      }
    }
  }

  &__header-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 20px rgba(var(--primary-500-rgb), 0.15);
    color: var(--primary-600);
    transition: all 0.3s @ease;

    .track__header--compact & {
      margin-bottom: 0;
      border-radius: 16px;
    }
  }

  &__title {
    font-family: @font-display;
    font-size: 32px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 8px;
    transition: font-size 0.3s @ease;
  }

  &__subtitle {
    font-family: @font-body;
    font-size: 16px;
    color: @neutral-500;
    margin: 0;
    max-width: 400px;
  }

  // ============================================
  // SKELETON LOADER
  // ============================================
  &__skeleton {
    max-width: 1000px;
    margin: 0 auto;
  }

  &__skeleton-nav {
    margin-bottom: 24px;
  }

  &__skeleton-btn {
    width: 180px;
    height: 42px;
    background: @neutral-200;
    border-radius: 10px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    align-items: start;
  }

  &__skeleton-main {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__skeleton-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__skeleton-card {
    background: white;
    border-radius: 20px;
    border: 1px solid @neutral-100;
    overflow: hidden;

    &--status {
      padding: 28px;
    }

    &--detail {
      display: flex;
      gap: 16px;
      padding: 20px;
    }

    &--summary {
      padding: 24px;
    }
  }

  &__skeleton-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
  }

  &__skeleton-badge {
    width: 100px;
    height: 36px;
    background: @neutral-100;
    border-radius: 20px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-line {
    background: @neutral-200;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;

    &--label {
      width: 80px;
      height: 12px;
      margin-bottom: 8px;
    }

    &--number {
      width: 180px;
      height: 28px;
    }

    &--small {
      width: 60px;
      height: 10px;
      margin-bottom: 6px;
    }

    &--medium {
      width: 120px;
      height: 16px;
      margin-bottom: 6px;
    }

    &--large {
      width: 100%;
      height: 14px;
    }

    &--title {
      width: 120px;
      height: 18px;
    }

    &--count {
      width: 60px;
      height: 24px;
      border-radius: 12px;
    }

    &--name {
      width: 140px;
      height: 14px;
      margin-bottom: 6px;
    }

    &--qty {
      width: 60px;
      height: 12px;
    }
  }

  &__skeleton-timeline {
    display: flex;
    justify-content: space-between;
    padding: 24px;
    background: @neutral-50;
    border-radius: 16px;
  }

  &__skeleton-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  &__skeleton-step-icon {
    width: 40px;
    height: 40px;
    background: @neutral-200;
    border-radius: 50%;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-step-label {
    width: 70px;
    height: 14px;
    background: @neutral-200;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__skeleton-detail-icon {
    width: 44px;
    height: 44px;
    background: @neutral-100;
    border-radius: 12px;
    flex-shrink: 0;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-detail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__skeleton-summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid @neutral-100;
  }

  &__skeleton-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__skeleton-item {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid @neutral-100;

    &:last-child {
      border-bottom: none;
    }
  }

  &__skeleton-item-img {
    width: 48px;
    height: 48px;
    background: @neutral-100;
    border-radius: 10px;
    flex-shrink: 0;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__skeleton-totals {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid @neutral-100;
  }

  &__skeleton-total-row {
    height: 16px;
    background: @neutral-100;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;

    &--main {
      height: 24px;
      margin-top: 8px;
      background: @neutral-200;
    }
  }

  // ============================================
  // ERROR TOAST
  // ============================================
  &__error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: white;
    border-radius: 14px;
    border-left: 4px solid #ef4444;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  &__error-icon {
    flex-shrink: 0;
    color: #ef4444;
  }

  &__error-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-family: @font-body;
    font-size: 14px;

    strong {
      color: #b91c1c;
      font-weight: 600;
    }

    span {
      color: #dc2626;
    }
  }

  &__error-close {
    padding: 6px;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: @neutral-400;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @neutral-100;
      color: @neutral-600;
    }
  }
  // ============================================
  // SEARCH SECTION
  // ============================================
  &__search {
    max-width: 480px;
    margin: 0 auto;
  }

  &__search-card {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 40px rgba(0, 0, 0, 0.06);
    border: 1px solid @neutral-100;
  }

  &__search-header {
    display: flex;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;
  }

  &__search-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-radius: 14px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__search-title {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0 0 4px;
  }

  &__search-subtitle {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-500;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: @neutral-700;

    svg {
      color: @neutral-400;
    }
  }

  &__input {
    width: 100%;
    padding: 14px 16px;
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-900;
    transition: all 0.2s @ease;

    &::placeholder {
      color: @neutral-400;
    }

    &:focus {
      outline: none;
      background: white;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
    }

    &--error {
      border-color: #fca5a5;
      background: #fef2f2;

      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
      }
    }
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 24px;
    margin-top: 8px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border: none;
    border-radius: 14px;
    font-family: @font-body;
    font-size: 16px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.25s @ease;
    box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__submit-loader {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__search-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid @neutral-100;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;

    svg {
      color: #10b981;
    }
  }

  // ============================================
  // HELP SECTION
  // ============================================
  &__help {
    margin-top: 32px;
  }

  &__help-title {
    font-family: @font-body;
    font-size: 12px;
    font-weight: 600;
    color: @neutral-400;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 16px;
    text-align: center;
  }

  &__help-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__help-item {
    display: flex;
    gap: 14px;
    padding: 16px;
    background: white;
    border-radius: 14px;
    border: 1px solid @neutral-100;
    transition: all 0.2s @ease;

    &:hover {
      border-color: var(--primary-200);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    div:last-child {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong {
        font-family: @font-body;
        font-size: 14px;
        font-weight: 600;
        color: @neutral-900;
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        color: @neutral-500;
      }
    }
  }

  &__help-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @neutral-50;
    border-radius: 10px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  // ============================================
  // RESULTS SECTION
  // ============================================
  &__results {
    max-width: 1000px;
    margin: 0 auto;
  }

  &__nav {
    margin-bottom: 24px;
  }

  &__nav-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 10px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-600;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @neutral-50;
      border-color: var(--primary-300);
      color: var(--primary-700);
      transform: translateX(-4px);

      svg {
        transform: translateX(-2px);
      }
    }

    svg {
      transition: transform 0.2s @ease;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    align-items: start;
  }

  // ============================================
  // MAIN COLUMN
  // ============================================
  &__main {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  // ============================================
  // STATUS CARD
  // ============================================
  &__status-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__status-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
  }

  &__status-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__status-label {
    font-family: @font-body;
    font-size: 12px;
    font-weight: 600;
    color: @neutral-500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__status-number {
    font-family: @font-display;
    font-size: 24px;
    font-weight: 700;
    color: @neutral-900;
  }

  &__status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;

    &--paid,
    &--confirmed {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
      color: #059669;

      .track__status-dot {
        background: #10b981;
      }
    }

    &--processing {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
      color: #2563eb;

      .track__status-dot {
        background: #3b82f6;
      }
    }

    &--shipped {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
      color: #7c3aed;

      .track__status-dot {
        background: #8b5cf6;
      }
    }

    &--completed {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
      color: #047857;

      .track__status-dot {
        background: #10b981;
      }
    }

    &--cancelled {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
      color: #dc2626;

      .track__status-dot {
        background: #ef4444;
      }
    }
  }

  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  // ============================================
  // TIMELINE
  // ============================================
  &__timeline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px;
    background: @neutral-50;
    border-radius: 16px;
    position: relative;
  }

  &__timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
    position: relative;
    z-index: 2;
    text-align: center;

    &--active {
      .track__timeline-icon {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border-color: var(--primary-500);
        color: white;
        box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);
      }

      .track__timeline-label {
        color: @neutral-900;
        font-weight: 600;
      }
    }
  }

  &__timeline-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px solid @neutral-200;
    border-radius: 50%;
    color: @neutral-400;
    transition: all 0.3s @ease;
  }

  &__timeline-dot {
    width: 10px;
    height: 10px;
    background: @neutral-300;
    border-radius: 50%;
  }

  &__timeline-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__timeline-label {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-400;
    transition: all 0.3s @ease;
  }

  &__timeline-date {
    font-family: @font-body;
    font-size: 11px;
    color: @neutral-500;
  }

  &__timeline-line {
    position: absolute;
    top: 44px;
    left: calc(50% + 28px);
    width: calc(100% - 56px);
    height: 3px;
    background: @neutral-200;
    border-radius: 2px;
    overflow: hidden;
    z-index: 1;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
      transition: width 0.6s @ease;
    }

    &--active::after {
      width: 100%;
    }
  }

  // ============================================
  // DETAILS CARDS
  // ============================================
  &__details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__detail-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.03);
    border: 1px solid @neutral-100;
    transition: all 0.2s @ease;

    &:hover {
      border-color: var(--primary-200);
    }

    &--carrier {
      background: linear-gradient(135deg, white 0%, rgba(var(--primary-500-rgb), 0.02) 100%);
    }
  }

  &__detail-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-radius: 12px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__detail-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__detail-label {
    font-family: @font-body;
    font-size: 11px;
    font-weight: 600;
    color: @neutral-500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__detail-name {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 600;
    color: @neutral-900;
  }

  &__detail-address {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-600;
    line-height: 1.5;
    margin: 0;
  }

  &__tracking-copy {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    padding: 6px 12px;
    background: @neutral-100;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @neutral-200;

      svg {
        color: var(--primary-600);
      }
    }

    svg {
      color: @neutral-500;
      transition: color 0.2s @ease;
    }
  }

  &__tracking-number {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-700;
  }

  // ============================================
  // SIDEBAR
  // ============================================
  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: 24px;
  }

  // ============================================
  // SUMMARY CARD
  // ============================================
  &__summary {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid @neutral-100;
  }

  &__summary-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-display;
    font-size: 16px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0;

    svg {
      color: var(--primary-500);
    }
  }

  &__summary-count {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
    padding: 4px 10px;
    background: @neutral-100;
    border-radius: 12px;
  }

  // ============================================
  // ITEMS LIST
  // ============================================
  &__items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 240px;
    overflow-y: auto;
    margin-bottom: 16px;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: @neutral-100;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: @neutral-300;
      border-radius: 2px;
    }
  }

  &__item {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid @neutral-100;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__item-image {
    width: 48px;
    height: 48px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid @neutral-100;
    }
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  &__item-name {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-price {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 700;
    color: @neutral-900;
    flex-shrink: 0;
  }

  &__item-bottom {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__item-qty {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-500;
  }

  &__item-dosage {
    font-family: @font-body;
    font-size: 11px;
    font-weight: 500;
    color: var(--primary-700);
    background: var(--primary-50);
    padding: 2px 8px;
    border-radius: 6px;
  }

  // ============================================
  // TOTALS
  // ============================================
  &__totals {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid @neutral-100;
  }

  &__totals-row {
    display: flex;
    justify-content: space-between;
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-600;

    &--discount {
      color: #10b981;

      span:first-child {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    &--total {
      padding-top: 12px;
      margin-top: 4px;
      border-top: 1px dashed @neutral-200;
      font-size: 16px;
      font-weight: 700;
      color: @neutral-900;

      span:last-child {
        color: var(--primary-700);
        font-size: 20px;
      }
    }
  }

  &__totals-free {
    color: #10b981;
    font-weight: 600;
  }

  &__totals-divider {
    display: none;
  }

  // ============================================
  // REGISTER CTA
  // ============================================
  &__register {
    background: linear-gradient(135deg, white 0%, var(--primary-50) 100%);
    border: 1px solid var(--primary-200);
    border-radius: 20px;
    padding: 24px;
  }

  &__register-header {
    display: flex;
    gap: 14px;
    margin-bottom: 20px;
  }

  &__register-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 14px;
    color: var(--primary-600);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  &__register-text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-display;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;
    }

    span {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
    }
  }

  &__register-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__register-email {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid @neutral-200;
    border-radius: 12px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-600;

    span {
      flex: 1;
      font-family: 'SF Mono', 'Fira Code', monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    svg:first-child {
      color: @neutral-400;
    }
  }

  &__register-check {
    color: #10b981;
  }

  &__register-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    transition: all 0.2s @ease;

    &:focus-within {
      border-color: var(--primary-400);
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
    }

    svg {
      color: @neutral-400;
      flex-shrink: 0;
    }
  }

  &__register-input {
    flex: 1;
    border: none;
    background: transparent;
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-900;

    &::placeholder {
      color: @neutral-400;
    }

    &:focus {
      outline: none;
    }
  }

  &__register-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 20px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border: none;
    border-radius: 12px;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.25s @ease;
    box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(var(--primary-500-rgb), 0.4);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__register-loader {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  // ============================================
  // SUCCESS MESSAGE
  // ============================================
  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 24px;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border: 1px solid #a7f3d0;
    border-radius: 20px;
    text-align: center;
  }

  &__success-icon {
    color: #10b981;
  }

  &__success-title {
    font-family: @font-display;
    font-size: 16px;
    font-weight: 600;
    color: #065f46;
  }

  &__success-text {
    font-family: @font-body;
    font-size: 14px;
    color: #047857;
    margin: 0;
  }

  // ============================================
  // TRUST BADGES
  // ============================================
  &__trust {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding: 16px;
    background: white;
    border-radius: 14px;
    border: 1px solid @neutral-100;
  }

  &__trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-500;

    svg {
      color: #10b981;
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(0.9);
    }
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s @ease;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  @media (max-width: 900px) {
    &__grid,
    &__skeleton-grid {
      grid-template-columns: 1fr;
    }

    &__sidebar,
    &__skeleton-sidebar {
      position: static;
      order: -1;
    }
  }

  @media (max-width: 700px) {
    padding: 24px 16px 60px;

    &__header {
      margin-bottom: 28px;

      &--compact {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
    }

    &__header-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;

      .track__header--compact & {
        width: 56px;
        height: 56px;
        margin-bottom: 0;
      }
    }

    &__title {
      font-size: 26px;
    }

    &__search-card {
      padding: 24px 20px;
    }

    &__details,
    &__skeleton-details {
      grid-template-columns: 1fr;
    }

    &__timeline {
      padding: 20px 12px;
      overflow-x: auto;
    }

    &__timeline-step {
      min-width: 70px;
    }

    &__timeline-label {
      font-size: 11px;
    }

    &__timeline-line {
      left: calc(50% + 24px);
      width: calc(100% - 48px);
    }

    &__trust {
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    &__status-header {
      flex-direction: column;
      gap: 16px;
    }

    &__status-badge {
      align-self: flex-start;
    }

    &__timeline {
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
    }

    &__timeline-step {
      width: 45%;
    }

    &__timeline-line {
      display: none;
    }

    &__nav-back {
      width: 100%;
      justify-content: center;
    }

    &__skeleton-timeline {
      flex-wrap: wrap;
      gap: 16px;
    }

    &__skeleton-step {
      width: 45%;
    }
  }
}
</style>