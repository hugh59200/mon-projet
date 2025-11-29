<template>
  <div class="track">
    <!-- Background Premium -->
    <div class="track__bg">
      <div class="track__bg-gradient"></div>
      <div class="track__bg-pattern"></div>
      <div class="track__bg-orb track__bg-orb--1"></div>
      <div class="track__bg-orb track__bg-orb--2"></div>
      <div class="track__bg-orb track__bg-orb--3"></div>
    </div>

    <div class="track__container">
      <!-- Header -->
      <header class="track__header" :class="{ 'track__header--compact': !!order || loading }">
        <div class="track__header-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 8V21H3V8"/>
            <path d="M1 3H23V8H1V3Z"/>
            <path d="M10 12H14"/>
          </svg>
          <span>Suivi de commande</span>
        </div>
        <h1 class="track__title">
          Suivez votre <span class="track__title-highlight">livraison</span>
        </h1>
        <p v-if="!order && !loading" class="track__subtitle">
          Consultez l'état d'avancement de votre colis en temps réel
        </p>
      </header>

      <!-- Error Toast -->
      <transition name="slide-down">
        <div v-if="errorMessage" class="track__error">
          <div class="track__error-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="track__error-content">
            <strong>Une erreur est survenue</strong>
            <span>{{ errorMessage }}</span>
          </div>
          <button class="track__error-close" @click="errorMessage = ''">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </transition>

      <!-- Loading Skeleton -->
      <div v-if="loading && !order" class="track__skeleton">
        <div class="track__skeleton-nav">
          <div class="track__skeleton-btn"></div>
        </div>
        <div class="track__skeleton-grid">
          <!-- Main Column -->
          <div class="track__skeleton-main">
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
                  <div class="track__skeleton-step-content">
                    <div class="track__skeleton-step-label"></div>
                    <div class="track__skeleton-step-date"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="track__skeleton-details">
              <div class="track__skeleton-card track__skeleton-card--detail" v-for="i in 2" :key="i">
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
              <div class="track__skeleton-summary-header"></div>
              <div class="track__skeleton-items">
                <div class="track__skeleton-item" v-for="i in 3" :key="i"></div>
              </div>
              <div class="track__skeleton-totals">
                <div class="track__skeleton-total-row" v-for="i in 3" :key="i"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Form (when no order) -->
      <div v-if="!order && !loading" class="track__search-section">
        <div class="track__search-layout">
          <!-- Main Search Card -->
          <div class="track__search-card">
            <div class="track__search-header">
              <div class="track__search-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div>
                <h2 class="track__search-title">Localiser ma commande</h2>
                <p class="track__search-subtitle">Entrez vos informations pour accéder au suivi détaillé</p>
              </div>
            </div>

            <form @submit.prevent="handleSearch" class="track__form">
              <div class="track__form-row">
                <div class="track__form-group">
                  <label class="track__label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
                    </svg>
                    Numéro de commande
                  </label>
                  <div class="track__input-wrapper" :class="{ 'track__input-wrapper--error': !!errorMessage }">
                    <input
                      v-model="form.orderNumber"
                      type="text"
                      class="track__input"
                      placeholder="Ex: FP-2025-000123"
                      required
                      @input="errorMessage = ''"
                    />
                  </div>
                </div>

                <div class="track__form-group">
                  <label class="track__label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Adresse email
                  </label>
                  <div class="track__input-wrapper" :class="{ 'track__input-wrapper--error': !!errorMessage }">
                    <input
                      v-model="form.email"
                      type="email"
                      class="track__input"
                      placeholder="exemple@email.com"
                      required
                      @input="errorMessage = ''"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" class="track__submit" :disabled="loading">
                <span v-if="loading" class="track__submit-loader"></span>
                <template v-else>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  Localiser mon colis
                </template>
              </button>
            </form>

            <div class="track__search-footer">
              <div class="track__search-secure">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Connexion sécurisée SSL</span>
              </div>
            </div>
          </div>

          <!-- Help Sidebar -->
          <aside class="track__help">
            <h3 class="track__help-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Besoin d'aide ?
            </h3>
            
            <div class="track__help-items">
              <div class="track__help-item">
                <div class="track__help-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div class="track__help-content">
                  <strong>Email de confirmation</strong>
                  <span>Le numéro de commande se trouve dans votre email de confirmation de commande</span>
                </div>
              </div>

              <div class="track__help-item">
                <div class="track__help-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
                <div class="track__help-content">
                  <strong>Contacter le support</strong>
                  <span>Notre équipe est disponible 7j/7 et répond sous 24h maximum</span>
                </div>
              </div>

              <div class="track__help-item">
                <div class="track__help-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="track__help-content">
                  <strong>Délais de livraison</strong>
                  <span>France : 2-4 jours • Europe : 4-7 jours • International : 7-14 jours</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <!-- Results Section -->
      <div v-else-if="order" class="track__results">
        <!-- Navigation -->
        <nav class="track__nav">
          <button class="track__nav-back" @click="resetSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Nouvelle recherche</span>
          </button>
          <div class="track__nav-order">
            <span class="track__nav-label">Commande</span>
            <span class="track__nav-number">{{ order.order_number }}</span>
          </div>
        </nav>

        <!-- Main Grid -->
        <div class="track__grid">
          <!-- Left Column - Status & Timeline -->
          <div class="track__main">
            <!-- Status Hero Card -->
            <div class="track__status-card">
              <div class="track__status-header">
                <div class="track__status-info">
                  <div class="track__status-badge" :class="`track__status-badge--${order.status}`">
                    <span class="track__status-dot"></span>
                    {{ getLabelBadge(order.status) }}
                  </div>
                  <p class="track__status-message">{{ getStatusMessage(order.status ?? '') }}</p>
                </div>
                <div class="track__status-date" v-if="order.created_at">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>Commandé le {{ formatDate(order.created_at) }}</span>
                </div>
              </div>

              <!-- Visual Timeline -->
              <div class="track__timeline">
                <div class="track__timeline-progress">
                  <div 
                    class="track__timeline-progress-bar" 
                    :style="{ width: getProgressWidth() }"
                  ></div>
                </div>
                
                <div class="track__timeline-steps">
                  <div
                    v-for="(step, index) in TIMELINE_STEPS"
                    :key="step.key"
                    class="track__timeline-step"
                    :class="{ 
                      'track__timeline-step--active': isStepActive(step.statuses),
                      'track__timeline-step--current': isCurrentStep(step.statuses, index)
                    }"
                  >
                    <div class="track__timeline-icon">
                      <svg v-if="isStepActive(step.statuses)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <component v-else :is="getStepIcon(step.key)" />
                    </div>
                    <div class="track__timeline-content">
                      <span class="track__timeline-label">{{ step.label }}</span>
                      <span 
                        v-if="step.dateField && (order as Record<string, any>)[step.dateField]" 
                        class="track__timeline-date"
                      >
                        {{ formatDate((order as Record<string, any>)[step.dateField]) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="track__details">
              <!-- Shipping Address Card -->
              <div class="track__detail-card">
                <div class="track__detail-header">
                  <div class="track__detail-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <span class="track__detail-title">Adresse de livraison</span>
                </div>
                <div class="track__detail-body">
                  <strong class="track__detail-name">{{ order.shipping_name }}</strong>
                  <p class="track__detail-address">
                    {{ order.shipping_address }}<br/>
                    {{ order.shipping_zip }} {{ order.shipping_city }}
                  </p>
                </div>
              </div>

              <!-- Carrier Card -->
              <div class="track__detail-card" :class="{ 'track__detail-card--highlight': order.tracking_number }">
                <div class="track__detail-header">
                  <div class="track__detail-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="2"/>
                      <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <span class="track__detail-title">Transporteur</span>
                </div>
                <div class="track__detail-body">
                  <strong class="track__detail-name">{{ order.carrier || 'Colissimo' }}</strong>
                  <div v-if="order.tracking_number" class="track__tracking">
                    <span class="track__tracking-label">Numéro de suivi</span>
                    <button class="track__tracking-btn" @click="copyTracking">
                      <span class="track__tracking-number">{{ order.tracking_number }}</span>
                      <div class="track__tracking-copy">
                        <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                        </svg>
                        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <p v-else class="track__detail-pending">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Numéro de suivi disponible après expédition
                  </p>
                </div>
              </div>

              <!-- Payment Method Card -->
              <div class="track__detail-card">
                <div class="track__detail-header">
                  <div class="track__detail-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <span class="track__detail-title">Paiement</span>
                </div>
                <div class="track__detail-body">
                  <strong class="track__detail-name">Carte bancaire</strong>
                  <p class="track__detail-status track__detail-status--success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Paiement confirmé
                  </p>
                </div>
              </div>

              <!-- Contact Card -->
              <div class="track__detail-card">
                <div class="track__detail-header">
                  <div class="track__detail-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <span class="track__detail-title">Contact</span>
                </div>
                <div class="track__detail-body">
                  <strong class="track__detail-name">{{ order.shipping_email }}</strong>
                  <p class="track__detail-info" v-if="(order as any).shipping_phone">
                    {{ (order as any).shipping_phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Sidebar -->
          <aside class="track__sidebar">
            <!-- Order Summary -->
            <div class="track__summary">
              <div class="track__summary-header">
                <h3 class="track__summary-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Récapitulatif
                </h3>
                <span class="track__summary-count">
                  {{ detailedItemsCount }} article{{ detailedItemsCount > 1 ? 's' : '' }}
                </span>
              </div>

              <!-- Items List -->
              <div class="track__items">
                <div
                  v-for="item in (order as any)?.detailed_items"
                  :key="item.product_id"
                  class="track__item"
                >
                  <div class="track__item-image">
                    <img :src="item.product_image || defaultImage" :alt="item.product_name"/>
                  </div>
                  <div class="track__item-info">
                    <span class="track__item-name">{{ item.product_name }}</span>
                    <div class="track__item-meta">
                      <span class="track__item-qty">Qté: {{ item.quantity }}</span>
                      <span v-if="item.product_dosage" class="track__item-dosage">
                        {{ item.product_dosage }}
                      </span>
                    </div>
                  </div>
                  <span class="track__item-price">{{ formatPrice(item.total) }}</span>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    Réduction
                  </span>
                  <span>-{{ formatPrice(order.discount_amount) }}</span>
                </div>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </div>
                <div>
                  <strong>Créer mon compte</strong>
                  <span>Retrouvez facilement toutes vos commandes</span>
                </div>
              </div>

              <div class="track__register-form">
                <div class="track__register-email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{{ order.shipping_email }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="track__register-verified">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>

                <div class="track__register-input-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    v-model="newPassword"
                    type="password"
                    class="track__register-input"
                    placeholder="Choisissez un mot de passe (min. 6 car.)"
                  />
                </div>

                <button
                  class="track__register-btn"
                  :disabled="registerLoading"
                  @click="handleQuickRegister"
                >
                  <span v-if="registerLoading" class="track__register-loader"></span>
                  <template v-else>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <polyline points="17 11 19 13 23 9"/>
                    </svg>
                    Créer mon compte
                  </template>
                </button>
              </div>

              <div class="track__register-benefits">
                <div class="track__register-benefit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Historique des commandes</span>
                </div>
                <div class="track__register-benefit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Suivi simplifié</span>
                </div>
                <div class="track__register-benefit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Offres exclusives</span>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div v-else-if="registerSuccess" class="track__success">
              <div class="track__success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <strong class="track__success-title">Compte créé avec succès !</strong>
              <p class="track__success-text">
                Un email de confirmation vous a été envoyé à<br/>
                <span>{{ order.shipping_email }}</span>
              </p>
            </div>

            <!-- Trust Badges -->
            <div class="track__trust">
              <div class="track__trust-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Données sécurisées</span>
              </div>
              <div class="track__trust-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                <span>Support réactif</span>
              </div>
              <div class="track__trust-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2"/>
                  <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-1"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <span>Livraison suivie</span>
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

// ===========================
// COMPOSABLES
// ===========================
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

// ===========================
// STATE
// ===========================
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

// ===========================
// TIMELINE CONFIGURATION
// ===========================
const TIMELINE_STEPS = [
  {
    key: 'confirmed',
    label: 'Confirmée',
    statuses: ['paid', 'confirmed', 'processing', 'shipped', 'completed'],
    dateField: 'created_at',
  },
  {
    key: 'processing',
    label: 'En préparation',
    statuses: ['processing', 'shipped', 'completed'],
    dateField: null,
  },
  {
    key: 'shipped',
    label: 'Expédiée',
    statuses: ['shipped', 'completed'],
    dateField: 'shipped_at',
  },
  {
    key: 'completed',
    label: 'Livrée',
    statuses: ['completed'],
    dateField: null,
  },
]

// ===========================
// COMPUTED
// ===========================
const detailedItemsCount = computed(() => {
  const orderValue = order.value as any
  return orderValue && Array.isArray(orderValue.detailed_items)
    ? orderValue.detailed_items.length
    : 0
})

// ===========================
// HELPERS
// ===========================
function isStepActive(validStatuses: string[]) {
  if (!order.value?.status) return false
  return validStatuses.includes(order.value.status)
}

function isCurrentStep(validStatuses: string[], index: number) {
  if (!order.value?.status) return false
  const isActive = validStatuses.includes(order.value.status)
  const nextStep = TIMELINE_STEPS[index + 1]
  const nextIsActive = nextStep ? nextStep.statuses.includes(order.value.status) : false
  return isActive && !nextIsActive
}

function getProgressWidth() {
  if (!order.value?.status) return '0%'
  
  const statusOrder = ['paid', 'confirmed', 'processing', 'shipped', 'completed']
  const currentIndex = statusOrder.indexOf(order.value.status)
  
  if (currentIndex === -1) return '0%'
  if (order.value.status === 'canceled') return '0%'
  
  // Map to percentage
  const percentages: Record<string, string> = {
    'paid': '12%',
    'confirmed': '12%',
    'processing': '37%',
    'shipped': '62%',
    'completed': '100%',
  }
  
  return percentages[order.value.status] || '0%'
}

function getStatusMessage(status: string) {
  const messages: Record<string, string> = {
    'paid': 'Votre commande a été confirmée et sera bientôt préparée.',
    'confirmed': 'Votre commande a été confirmée et sera bientôt préparée.',
    'processing': 'Votre commande est en cours de préparation dans nos entrepôts.',
    'shipped': 'Votre colis est en route vers l\'adresse de livraison.',
    'completed': 'Votre commande a été livrée avec succès. Merci pour votre confiance !',
    'cancelled': 'Cette commande a été annulée.',
  }
  return messages[status] || 'Statut de commande en cours de mise à jour.'
}

function getStepIcon(key: string) {
  // Return a placeholder component - icons are handled inline
  return {
    template: `<span class="track__timeline-number">${TIMELINE_STEPS.findIndex(s => s.key === key) + 1}</span>`
  }
}

function formatDate(date: string | null | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatPrice(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(Number(value))
}

// ===========================
// ACTIONS
// ===========================
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
    errorMessage.value = err.message || 'Commande introuvable. Vérifiez vos informations.'
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

// ===========================
// LIFECYCLE
// ===========================
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
</script>
<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);
@bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

.track {
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;

  // ===========================
  // BACKGROUND PREMIUM
  // ===========================
  &__bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  &__bg-gradient {
    position: absolute;
    inset: 0;
  }

  &__bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(var(--primary-500-rgb), 0.04) 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 60%);
  }

  &__bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.6;

    &--1 {
      top: -5%;
      right: 15%;
      width: 500px;
      height: 500px;
      background: rgba(var(--primary-400-rgb), 0.12);
      animation: float-orb 25s ease-in-out infinite;
    }

    &--2 {
      bottom: 20%;
      left: -5%;
      width: 400px;
      height: 400px;
      background: rgba(var(--primary-300-rgb), 0.08);
      animation: float-orb 30s ease-in-out infinite reverse;
    }

    &--3 {
      top: 40%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: rgba(var(--primary-500-rgb), 0.06);
      animation: float-orb 20s ease-in-out infinite 5s;
    }
  }

  @keyframes float-orb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
  }

  // ===========================
  // CONTAINER - PLUS LARGE
  // ===========================
  &__container {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px 32px;
  }

  // ===========================
  // HEADER
  // ===========================
  &__header {
    text-align: center;
    margin-bottom: 48px;
    transition: all 0.4s @ease;

    &--compact {
      margin-bottom: 32px;

      .track__header-badge {
        margin-bottom: 12px;
      }

      .track__title {
        font-size: 32px;
      }

      .track__subtitle {
        display: none;
      }
    }
  }

  &__header-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.1) 0%,
      rgba(var(--primary-500-rgb), 0.05) 100%
    );
    border: 1px solid rgba(var(--primary-500-rgb), 0.15);
    border-radius: 50px;
    margin-bottom: 20px;

    svg {
      color: var(--primary-600);
    }

    span {
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-700);
      letter-spacing: 0.02em;
    }
  }

  &__title {
    font-family: @font-display;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    color: @neutral-900;
    line-height: 1.15;
    margin: 0 0 16px;
    transition: font-size 0.4s @ease;
  }

  &__title-highlight {
    background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__subtitle {
    font-family: @font-body;
    font-size: 18px;
    color: @neutral-500;
    margin: 0;
    max-width: 480px;
    margin: 0 auto;
  }

  // ===========================
  // ERROR TOAST
  // ===========================
  &__error {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: white;
    border-radius: 16px;
    border-left: 4px solid #ef4444;
    box-shadow: 0 4px 24px rgba(239, 68, 68, 0.15), 0 12px 48px rgba(0, 0, 0, 0.08);
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: shake 0.5s @ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  &__error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-radius: 12px;
    color: #ef4444;
    flex-shrink: 0;
  }

  &__error-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: #b91c1c;
    }

    span {
      font-family: @font-body;
      font-size: 14px;
      color: #dc2626;
    }
  }

  &__error-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: @neutral-400;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: #fef2f2;
      color: #ef4444;
    }
  }

  // ===========================
  // SEARCH SECTION - LAYOUT LARGE
  // ===========================
  &__search-section {
    max-width: 1000px;
    margin: 0 auto;
  }

  &__search-layout {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 32px;
    align-items: start;
  }

  &__search-card {
    background: white;
    border-radius: 28px;
    padding: 40px;
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 12px 48px rgba(0, 0, 0, 0.06);
    border: 1px solid @neutral-100;
  }

  &__search-header {
    display: flex;
    gap: 20px;
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid @neutral-100;
  }

  &__search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.12) 0%,
      rgba(var(--primary-500-rgb), 0.06) 100%
    );
    border-radius: 18px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__search-title {
    font-family: @font-display;
    font-size: 22px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 6px;
  }

  &__search-subtitle {
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-500;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-700;

    svg {
      color: @neutral-400;
    }
  }

  &__input-wrapper {
    display: flex;
    align-items: center;
    background: @neutral-50;
    border: 2px solid @neutral-200;
    border-radius: 14px;
    transition: all 0.25s @ease;

    &:focus-within {
      background: white;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
    }

    &--error {
      border-color: #fca5a5;
      background: #fef2f2;

      &:focus-within {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
      }
    }
  }

  &__input {
    flex: 1;
    padding: 16px 18px;
    background: transparent;
    border: none;
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-900;
    outline: none;

    &::placeholder {
      color: @neutral-400;
    }
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 18px 28px;
    margin-top: 8px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border: none;
    border-radius: 16px;
    font-family: @font-body;
    font-size: 16px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.3s @ease;
    box-shadow: 0 4px 20px rgba(var(--primary-500-rgb), 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(var(--primary-500-rgb), 0.45);
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__submit-loader {
    width: 22px;
    height: 22px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  &__search-footer {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid @neutral-100;
  }

  &__search-secure {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;

    svg {
      color: #10b981;
    }
  }

  // ===========================
  // HELP SIDEBAR
  // ===========================
  &__help {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid @neutral-100;
  }

  &__help-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0 0 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;

    svg {
      color: var(--primary-500);
    }
  }

  &__help-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__help-item {
    display: flex;
    gap: 16px;
  }

  &__help-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.1) 0%,
      rgba(var(--primary-500-rgb), 0.05) 100%
    );
    border-radius: 14px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__help-content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;
    }

    span {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      line-height: 1.5;
    }
  }

  // ===========================
  // SKELETON LOADER
  // ===========================
  &__skeleton {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__skeleton-nav {
    margin-bottom: 28px;
  }

  &__skeleton-btn {
    width: 200px;
    height: 48px;
    background: @neutral-200;
    border-radius: 14px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 32px;
    align-items: start;
  }

  &__skeleton-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__skeleton-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__skeleton-card {
    background: white;
    border-radius: 24px;
    border: 1px solid @neutral-100;
    overflow: hidden;

    &--status {
      padding: 32px;
    }

    &--detail {
      display: flex;
      gap: 20px;
      padding: 24px;
    }

    &--summary {
      padding: 28px;
    }
  }

  &__skeleton-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  &__skeleton-badge {
    width: 120px;
    height: 40px;
    background: @neutral-100;
    border-radius: 20px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-line {
    background: @neutral-200;
    border-radius: 6px;
    animation: shimmer 1.5s infinite;

    &--label {
      width: 100px;
      height: 14px;
      margin-bottom: 10px;
    }

    &--number {
      width: 220px;
      height: 32px;
    }

    &--small {
      width: 80px;
      height: 12px;
      margin-bottom: 8px;
    }

    &--medium {
      width: 160px;
      height: 18px;
      margin-bottom: 8px;
    }

    &--large {
      width: 100%;
      height: 16px;
    }
  }

  &__skeleton-timeline {
    display: flex;
    justify-content: space-between;
    padding: 28px;
    background: @neutral-50;
    border-radius: 20px;
  }

  &__skeleton-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    flex: 1;
  }

  &__skeleton-step-icon {
    width: 52px;
    height: 52px;
    background: @neutral-200;
    border-radius: 50%;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  &__skeleton-step-label {
    width: 80px;
    height: 16px;
    background: @neutral-200;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-step-date {
    width: 100px;
    height: 12px;
    background: @neutral-100;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__skeleton-detail-icon {
    width: 52px;
    height: 52px;
    background: @neutral-100;
    border-radius: 14px;
    flex-shrink: 0;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-detail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__skeleton-summary-header {
    width: 100%;
    height: 28px;
    background: @neutral-100;
    border-radius: 8px;
    margin-bottom: 24px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__skeleton-item {
    height: 72px;
    background: @neutral-50;
    border-radius: 14px;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid @neutral-100;
  }

  &__skeleton-total-row {
    height: 20px;
    background: @neutral-100;
    border-radius: 4px;
    animation: shimmer 1.5s infinite;

    &:last-child {
      height: 28px;
      margin-top: 8px;
      background: @neutral-200;
    }
  }

  @keyframes shimmer {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  // ===========================
  // RESULTS SECTION
  // ===========================
  &__results {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid @neutral-100;
  }

  &__nav-back {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-600;
    cursor: pointer;
    transition: all 0.25s @ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    svg {
      transition: transform 0.25s @ease;
    }

    &:hover {
      background: @neutral-50;
      border-color: var(--primary-300);
      color: var(--primary-700);
      transform: translateX(-4px);

      svg {
        transform: translateX(-3px);
      }
    }
  }

  &__nav-order {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__nav-label {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 500;
    color: @neutral-500;
  }

  &__nav-number {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: @neutral-900;
    padding: 8px 16px;
    background: @neutral-50;
    border-radius: 10px;
  }

  // ===========================
  // MAIN GRID - PLUS LARGE
  // ===========================
  &__grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 32px;
    align-items: start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  // ===========================
  // STATUS CARD
  // ===========================
  &__status-card {
    background: white;
    border-radius: 28px;
    padding: 36px;
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 12px 48px rgba(0, 0, 0, 0.06);
    border: 1px solid @neutral-100;
  }

  &__status-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
  }

  &__status-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__status-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 50px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 600;
    width: fit-content;

    &--paid,
    &--confirmed {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%);
      color: #059669;
      .track__status-dot { background: #10b981; }
    }

    &--processing {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%);
      color: #2563eb;
      .track__status-dot { background: #3b82f6; }
    }

    &--shipped {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%);
      color: #7c3aed;
      .track__status-dot { background: #8b5cf6; }
    }

    &--completed {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
      color: #047857;
      .track__status-dot { background: #10b981; }
    }

    &--cancelled {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
      color: #dc2626;
      .track__status-dot { background: #ef4444; }
    }
  }

  &__status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.85); }
  }

  &__status-message {
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-600;
    margin: 0;
    max-width: 400px;
    line-height: 1.5;
  }

  &__status-date {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-500;
    padding: 10px 16px;
    background: @neutral-50;
    border-radius: 10px;

    svg {
      color: @neutral-400;
    }
  }

  // ===========================
  // TIMELINE
  // ===========================
  &__timeline {
    position: relative;
    padding: 32px;
    background: @neutral-50;
    border-radius: 20px;
  }

  &__timeline-progress {
    position: absolute;
    top: 58px;
    left: 80px;
    right: 80px;
    height: 4px;
    background: @neutral-200;
    border-radius: 2px;
    overflow: hidden;
  }

  &__timeline-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
    border-radius: 2px;
    transition: width 0.8s @ease;
  }

  &__timeline-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  &__timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    flex: 1;
    text-align: center;

    &--active {
      .track__timeline-icon {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border-color: var(--primary-500);
        color: white;
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.35);
      }

      .track__timeline-label {
        color: @neutral-900;
        font-weight: 600;
      }
    }

    &--current {
      .track__timeline-icon {
        animation: pulse-icon 2s ease-in-out infinite;
      }
    }
  }

  @keyframes pulse-icon {
    0%, 100% { box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.35); }
    50% { box-shadow: 0 4px 24px rgba(var(--primary-500-rgb), 0.5); }
  }

  &__timeline-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: white;
    border: 2px solid @neutral-200;
    border-radius: 50%;
    color: @neutral-400;
    transition: all 0.4s @ease;
    font-family: @font-display;
    font-size: 16px;
    font-weight: 700;
  }

  &__timeline-number {
    color: inherit;
  }

  &__timeline-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__timeline-label {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-400;
    transition: all 0.3s @ease;
  }

  &__timeline-date {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-500;
  }

  // ===========================
  // DETAILS GRID
  // ===========================
  &__details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &__detail-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 4px 16px rgba(0, 0, 0, 0.03);
    border: 1px solid @neutral-100;
    transition: all 0.25s @ease;

    &:hover {
      border-color: rgba(var(--primary-500-rgb), 0.2);
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.06);
    }

    &--highlight {
      background: linear-gradient(135deg, white 0%, rgba(var(--primary-500-rgb), 0.03) 100%);
      border-color: rgba(var(--primary-500-rgb), 0.15);
    }
  }

  &__detail-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid @neutral-100;
  }

  &__detail-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-500-rgb), 0.1) 0%,
      rgba(var(--primary-500-rgb), 0.05) 100%
    );
    border-radius: 14px;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  &__detail-title {
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: @neutral-500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__detail-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__detail-name {
    font-family: @font-display;
    font-size: 17px;
    font-weight: 600;
    color: @neutral-900;
  }

  &__detail-address {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-600;
    line-height: 1.6;
    margin: 0;
  }

  &__detail-info {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-500;
    margin: 0;
  }

  &__detail-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 14px;
    margin: 0;

    &--success {
      color: #059669;
    }
  }

  &__detail-pending {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
    margin: 4px 0 0;
    font-style: italic;
  }

  &__tracking {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
  }

  &__tracking-label {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-500;
  }

  &__tracking-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s @ease;

    &:hover {
      background: @neutral-100;
      border-color: var(--primary-300);

      .track__tracking-copy {
        color: var(--primary-600);
      }
    }
  }

  &__tracking-number {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-800;
    flex: 1;
  }

  &__tracking-copy {
    color: @neutral-400;
    transition: color 0.25s @ease;
  }

  // ===========================
  // SIDEBAR
  // ===========================
  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 32px;
  }

  // ===========================
  // SUMMARY CARD
  // ===========================
  &__summary {
    background: white;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 12px 48px rgba(0, 0, 0, 0.06);
    border: 1px solid @neutral-100;
  }

  &__summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid @neutral-100;
  }

  &__summary-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: @font-display;
    font-size: 18px;
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
    font-weight: 500;
    color: @neutral-500;
    padding: 6px 14px;
    background: @neutral-100;
    border-radius: 20px;
  }

  // ===========================
  // ITEMS LIST
  // ===========================
  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 20px;
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
    align-items: center;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 1px solid @neutral-100;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__item-image {
    width: 56px;
    height: 56px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid @neutral-100;
    }
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
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

  &__item-meta {
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
    background: rgba(var(--primary-500-rgb), 0.08);
    padding: 3px 8px;
    border-radius: 6px;
  }

  &__item-price {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 700;
    color: @neutral-900;
    flex-shrink: 0;
  }

  // ===========================
  // TOTALS
  // ===========================
  &__totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
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
      padding-top: 16px;
      margin-top: 8px;
      border-top: 2px dashed @neutral-200;
      font-size: 16px;
      font-weight: 700;
      color: @neutral-900;

      span:last-child {
        font-family: @font-display;
        font-size: 22px;
        color: var(--primary-700);
      }
    }
  }

  &__totals-free {
    color: #10b981;
    font-weight: 600;
  }

  // ===========================
  // REGISTER CTA
  // ===========================
  &__register {
    background: linear-gradient(135deg, white 0%, rgba(var(--primary-500-rgb), 0.04) 100%);
    border: 1px solid rgba(var(--primary-500-rgb), 0.2);
    border-radius: 24px;
    padding: 28px;
  }

  &__register-header {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__register-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: white;
    border-radius: 16px;
    color: var(--primary-600);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  &__register-header > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      font-family: @font-display;
      font-size: 17px;
      font-weight: 600;
      color: @neutral-900;
    }

    span {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
    }
  }

  &__register-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }

  &__register-email {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid @neutral-200;
    border-radius: 14px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    color: @neutral-600;

    span {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    svg:first-child {
      color: @neutral-400;
      flex-shrink: 0;
    }
  }

  &__register-verified {
    color: #10b981;
    flex-shrink: 0;
  }

  &__register-input-wrapper {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: white;
    border: 2px solid @neutral-200;
    border-radius: 14px;
    transition: all 0.25s @ease;

    &:focus-within {
      border-color: var(--primary-500);
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
    font-size: 15px;
    color: @neutral-900;
    outline: none;

    &::placeholder {
      color: @neutral-400;
    }
  }

  &__register-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border: none;
    border-radius: 14px;
    font-family: @font-body;
    font-size: 15px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.3s @ease;
    box-shadow: 0 4px 20px rgba(var(--primary-500-rgb), 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(var(--primary-500-rgb), 0.45);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__register-loader {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__register-benefits {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid rgba(var(--primary-500-rgb), 0.1);
  }

  &__register-benefit {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-600;

    svg {
      color: #10b981;
      flex-shrink: 0;
    }
  }

  // ===========================
  // SUCCESS MESSAGE
  // ===========================
  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 28px;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border: 1px solid #a7f3d0;
    border-radius: 24px;
    text-align: center;
  }

  &__success-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: white;
    border-radius: 50%;
    color: #10b981;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
  }

  &__success-title {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 600;
    color: #065f46;
  }

  &__success-text {
    font-family: @font-body;
    font-size: 14px;
    color: #047857;
    margin: 0;
    line-height: 1.6;

    span {
      font-weight: 600;
      color: #065f46;
    }
  }

  // ===========================
  // TRUST BADGES
  // ===========================
  &__trust {
    display: flex;
    justify-content: center;
    gap: 28px;
    padding: 20px;
    background: white;
    border-radius: 16px;
    border: 1px solid @neutral-100;
  }

  &__trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;

    svg {
      color: #10b981;
    }
  }

  // ===========================
  // TRANSITIONS
  // ===========================
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.35s @ease;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  // ===========================
  // RESPONSIVE
  // ===========================
  @media (max-width: 1100px) {
    &__grid,
    &__skeleton-grid {
      grid-template-columns: 1fr 360px;
      gap: 28px;
    }
  }

  @media (max-width: 960px) {
    &__container {
      padding: 32px 24px;
    }

    &__search-layout {
      grid-template-columns: 1fr;
      max-width: 560px;
      margin: 0 auto;
    }

    &__help {
      order: 1;
    }

    &__grid,
    &__skeleton-grid {
      grid-template-columns: 1fr;
    }

    &__sidebar,
    &__skeleton-sidebar {
      position: static;
    }
  }

  @media (max-width: 768px) {
    &__container {
      padding: 24px 16px;
    }

    &__header {
      margin-bottom: 36px;
    }

    &__search-card {
      padding: 28px 24px;
      border-radius: 24px;
    }

    &__form-row {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &__details,
    &__skeleton-details {
      grid-template-columns: 1fr;
    }

    &__nav {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    &__nav-back {
      justify-content: center;
    }

    &__nav-order {
      justify-content: center;
    }

    &__status-header {
      flex-direction: column;
      gap: 20px;
    }

    &__timeline {
      padding: 24px 16px;
      overflow-x: auto;
    }

    &__timeline-progress {
      left: 60px;
      right: 60px;
    }

    &__timeline-step {
      min-width: 80px;
    }

    &__timeline-icon {
      width: 44px;
      height: 44px;
    }

    &__timeline-label {
      font-size: 12px;
    }

    &__trust {
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
  }

  @media (max-width: 480px) {
    &__title {
      font-size: 28px;
    }

    &__search-card {
      padding: 24px 20px;
    }

    &__submit {
      padding: 16px 24px;
    }

    &__status-card {
      padding: 24px;
      border-radius: 20px;
    }

    &__timeline-steps {
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }

    &__timeline-step {
      width: 45%;
    }

    &__timeline-progress {
      display: none;
    }

    &__detail-card {
      padding: 20px;
    }

    &__summary {
      padding: 24px 20px;
    }

    &__register {
      padding: 24px 20px;
    }
  }
}
</style>