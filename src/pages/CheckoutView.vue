<template>
  <div class="checkout">
    <!-- 🔹 Titre -->
    <BasicText
      size="h4"
      weight="bold"
      class="checkout__title"
    >
      Paiement de votre commande
    </BasicText>

    <!-- 🧾 Résumé du panier -->
    <div class="checkout__cart">
      <BasicText
        size="h5"
        weight="bold"
      >
        Résumé du panier
      </BasicText>

      <div
        v-for="item in cart.items"
        :key="item.id"
        class="checkout__item"
      >
        <div class="checkout__item-left">
          <img
            :src="item.image"
            :alt="item.name"
            class="checkout__item-img"
          />
          <div>
            <BasicText weight="bold">{{ item.name }}</BasicText>
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ item.quantity }} × {{ item.price.toFixed(2) }} €
            </BasicText>
          </div>
        </div>
        <BasicText weight="bold">{{ (item.quantity * item.price).toFixed(2) }} €</BasicText>
      </div>

      <div class="checkout__total">
        <BasicText
          size="h5"
          weight="bold"
        >
          Total :
        </BasicText>
        <BasicText
          size="h5"
          weight="bold"
          color="primary-600"
        >
          {{ cart.totalPrice.toFixed(2) }} €
        </BasicText>
      </div>
    </div>

    <!-- 🏠 Informations client -->
    <div class="checkout__infos">
      <BasicText
        size="h5"
        weight="bold"
      >
        Adresse de livraison
      </BasicText>

      <div class="checkout__form">
        <BasicInput
          v-model="fullName"
          label="Nom complet"
          input-type="form"
          placeholder="Votre nom complet"
        />
        <BasicInput
          v-model="address"
          label="Adresse"
          input-type="form"
          placeholder="Adresse complète"
        />
        <div class="checkout__row">
          <BasicInput
            v-model="zip"
            label="Code postal"
            input-type="form"
            placeholder="59000"
          />
          <BasicInput
            v-model="city"
            label="Ville"
            input-type="form"
            placeholder="Lille"
          />
        </div>
        <BasicInput
          v-model="country"
          label="Pays"
          input-type="form"
          placeholder="France"
        />
      </div>
    </div>

    <!-- 💳 Choix du paiement -->
    <div class="checkout__payment">
      <BasicText
        size="h5"
        weight="bold"
      >
        Méthode de paiement
      </BasicText>

      <div class="checkout__methods">
        <div
          v-for="method in paymentMethods"
          :key="method.value"
          class="checkout__method"
          :class="{ active: selectedPayment === method.value }"
          @click="selectedPayment = method.value as PaymentProvider"
        >
          <div class="checkout__method-icon">
            <component :is="method.icon" />
          </div>
          <div class="checkout__method-info">
            <BasicText weight="bold">{{ method.label }}</BasicText>
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ method.desc }}
            </BasicText>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Bouton final -->
    <BasicButton
      label="Valider la commande"
      type="primary"
      variant="filled"
      width="full"
      size="large"
      class="checkout__submit"
      :disabled="loading || cart.items.length === 0"
      :loading="loading"
      @click="submitOrder"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { createFullOrder } from '@/services/orderService'
  import { processPayment, type PaymentProvider } from '@/services/paymentService'
  import { Bitcoin, CreditCard, TestTube } from 'lucide-vue-next'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  // --- Stores
  const auth = useAuthStore()
  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()

  const loading = ref(false)

  // --- Champs adresse
  const fullName = ref(auth.profile?.full_name || '')
  const address = ref('')
  const zip = ref('')
  const city = ref('')
  const country = ref('France')

  // --- Modes de paiement

  const paymentMethods = [
    {
      label: 'Carte bancaire (Stripe)',
      value: 'stripe',
      desc: 'Paiement sécurisé par carte via Stripe',
      icon: CreditCard,
    },
    {
      label: 'Crypto-monnaie',
      value: 'crypto',
      desc: 'Payer avec Bitcoin, Ethereum ou USDT',
      icon: Bitcoin,
    },
    {
      label: 'Paiement simulé (test)',
      value: 'simulation',
      desc: 'Aucun paiement réel, pour test uniquement',
      icon: TestTube,
    },
  ]

  const selectedPayment = ref<PaymentProvider>('simulation')

  // --- Validation finale
  async function submitOrder() {
    if (!auth.user) {
      toast.showToast('Veuillez vous connecter pour finaliser la commande.', 'danger')
      router.push('/auth/login')
      return
    }

    if (cart.items.length === 0) {
      toast.showToast('Votre panier est vide.', 'warning')
      return
    }

    loading.value = true

    try {
      // 💳 1️⃣ Paiement selon le mode choisi
      const payment = await processPayment(cart.totalPrice, selectedPayment.value)

      // 🚀 Si Stripe → redirection externe immédiate
      if (payment.provider === 'stripe' && payment.checkout_url) {
        window.location.href = payment.checkout_url
        return // ✅ Stop ici (ne pas tester succeeded)
      }

      // 💰 Si simulation → vérifie le statut
      if (payment.provider === 'simulation' && payment.status !== 'succeeded') {
        toast.showToast('Paiement simulé échoué ❌', 'danger')
        return
      }

      // 📦 2️⃣ Création commande (cas test / crypto)
      const payload = {
        email: auth.user.email,
        full_name: fullName.value,
        address: address.value,
        zip: zip.value,
        city: city.value,
        country: country.value,
        payment_method: selectedPayment.value,
        total_amount: cart.totalPrice,
        items: cart.items,
      }

      const order = await createFullOrder(payload)

      // 🎉 3️⃣ Confirmation
      toast.showToast('Commande validée ✅', 'success')
      cart.clearCart()
      router.push(`/confirmation/${order.id}`)
    } catch (err: any) {
      console.error(err)
      toast.showToast('Erreur lors du paiement ou de la commande ❌', 'danger')
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="less">
  .checkout {
    max-width: 800px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 20px;

    &__title {
      text-align: center;
    }

    &__cart {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid @neutral-100;
      padding-bottom: 8px;

      &-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      &-img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid @neutral-200;
      }
    }

    &__total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
    }

    &__infos,
    &__payment {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__methods {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__method {
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      padding: 10px 14px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: @primary-400;
        background: @primary-50;
      }

      &.active {
        border-color: @primary-600;
        background: @primary-100;
      }

      &-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: @neutral-100;
        border-radius: 8px;

        svg {
          width: 18px;
          height: 18px;
          color: @primary-700;
        }
      }

      &-info {
        display: flex;
        flex-direction: column;
      }
    }

    &__submit {
      margin-top: 8px;
    }

    @media (max-width: 700px) {
      &__row {
        flex-direction: column;
      }
    }
  }
</style>
