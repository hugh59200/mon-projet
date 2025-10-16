<template>
  <div class="confirmation">
    <!-- ✅ Icône et titre -->
    <BasicIcon
      name="tick-circle"
      class="confirmation__icon"
    />
    <BasicText
      size="h3"
      weight="bold"
      class="confirmation__title"
    >
      Merci pour votre commande 🎉
    </BasicText>

    <BasicText
      size="body-l"
      color="neutral-500"
    >
      Votre commande a bien été enregistrée sous la référence :
    </BasicText>

    <BasicText
      size="h5"
      weight="bold"
      class="confirmation__id"
    >
      {{ order?.id }}
    </BasicText>

    <!-- 🕓 États de chargement et d’erreur -->
    <div
      v-if="loading"
      class="confirmation__loading"
    >
      <BasicText>Chargement des détails...</BasicText>
    </div>

    <div
      v-else-if="!order"
      class="confirmation__error"
    >
      <BasicText color="red">Commande introuvable ❌</BasicText>
    </div>

    <!-- 🧾 Résumé commande -->
    <div
      v-else
      class="confirmation__details"
    >
      <BasicText
        size="h5"
        weight="bold"
      >
        Résumé de la commande
      </BasicText>

      <div class="confirmation__section">
        <BasicText>Total : {{ order.total_amount.toFixed(2) }} €</BasicText>
        <BasicText>Méthode : {{ order.payment_method }}</BasicText>
        <BasicText>Date : {{ formatDate(order.created_at) }}</BasicText>
      </div>

      <div class="confirmation__section">
        <BasicText
          size="h5"
          weight="bold"
        >
          Produits
        </BasicText>
        <table class="confirmation__table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Qté</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in order.items"
              :key="item.id"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ (item.price * item.quantity).toFixed(2) }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 📧 Spinner visible uniquement pendant l’envoi -->
    <transition name="fade">
      <div
        v-if="emailStatus === 'sending'"
        class="confirmation__banner confirmation__banner--sending"
      >
        <div class="confirmation__sending">
          <span class="confirmation__spinner" />
          <BasicText color="neutral-700">Envoi de l’email de confirmation...</BasicText>
        </div>
      </div>
    </transition>

    <!-- 🔘 Actions -->
    <div class="confirmation__actions">
      <BasicButton
        label="Voir mes commandes"
        type="primary"
        variant="filled"
        size="large"
        class="confirmation__btn"
        @click="$router.push('/profil/commandes')"
      />
      <BasicButton
        label="Retour au catalogue"
        type="secondary"
        variant="outlined"
        size="large"
        class="confirmation__btn"
        @click="$router.push('/catalogue')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  type Order = {
    id: string
    total_amount: number
    payment_method: string
    created_at: string
    full_name?: string
    email?: string
    items: { id: string; name: string; quantity: number; price: number }[]
  }

  const route = useRoute()
  const toast = useToastStore()
  const order = ref<Order | null>(null)
  const loading = ref(true)
  const emailStatus = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

  // 📦 Charge la commande
  async function loadOrder() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) {
      console.error(error)
      toast.showToast('Erreur lors du chargement de la commande', 'danger')
    } else {
      order.value = data as Order
      sendConfirmationEmail()
    }

    loading.value = false
  }

  // 📧 Envoie l’email via Edge Function
  async function sendConfirmationEmail() {
    if (!order.value) return

    emailStatus.value = 'sending'

    const payload = {
      order_id: order.value.id,
      email: order.value.email,
      full_name: order.value.full_name,
      total_amount: order.value.total_amount,
      items: order.value.items,
      created_at: order.value.created_at,
    }

    try {
      const res = await fetch(
        'https://dwomsbawthlktapmtmqu.supabase.co/functions/v1/order-confirmation',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )

      const data = await res.json()

      if (res.ok && data.success) {
        emailStatus.value = 'success'
        toast.showToast('Email de confirmation envoyé ✅', 'success')
      } else {
        emailStatus.value = 'error'
        toast.showToast('Erreur lors de l’envoi de l’email ⚠️', 'danger')
      }
    } catch (err) {
      console.error('Erreur réseau ou Edge Function:', err)
      emailStatus.value = 'error'
      toast.showToast('Erreur réseau lors de l’envoi de l’email', 'danger')
    } finally {
      // ⏱️ Masque le spinner après un petit délai
      setTimeout(() => (emailStatus.value = 'idle'), 2000)
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  onMounted(loadOrder)
</script>

<style scoped lang="less">
  .confirmation {
    max-width: 700px;
    margin: 60px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    padding: 0 20px;

    &__icon {
      font-size: 80px;
      color: @primary-600;
      animation: pop 0.4s ease-out;
    }

    @keyframes pop {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    &__id {
      color: @primary-700;
    }

    &__details {
      width: 100%;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 20px;
      text-align: left;
    }

    &__section {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;

      th,
      td {
        padding: 8px;
        border-bottom: 1px solid @neutral-200;
      }

      th {
        background: @neutral-50;
        text-align: left;
      }
    }

    /* 🔄 Bannière statut */
    &__banner {
      margin-top: 12px;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      &--sending {
        background: fade(@primary-100, 60%);
        border: 1px solid @primary-300;
      }
    }

    /* 🌀 Animation spinner */
    &__sending {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__spinner {
      width: 18px;
      height: 18px;
      border: 3px solid @neutral-300;
      border-top-color: @primary-600;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    &__actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }

    &__btn {
      min-width: 220px;

      @media (max-width: 600px) {
        width: 100%;
      }
    }
  }

  /* 🔄 Animation fade douce */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
