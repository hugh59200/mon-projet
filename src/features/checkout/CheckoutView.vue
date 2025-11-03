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
            :src="item.image || defaultImage"
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
        <BasicText
          weight="bold"
          class="checkout__item-price"
        >
          {{ (item.quantity * item.price).toFixed(2) }} €
        </BasicText>
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

    <!-- 🏠 Adresse de livraison -->
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

    <!-- 💳 Méthode de paiement -->
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
      :disabled="cart.items.length === 0"
      @click="submitOrder"
    />
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useManualSablier } from '@/features/interface/sablier/useManualSablier'
  import { type PaymentProvider } from '@/services/paymentService'
  import { supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { Bitcoin, CreditCard, TestTube } from 'lucide-vue-next'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const auth = useAuthStore()
  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()
  const { withSablier } = useManualSablier()

  // --- Champs adresse
  const fullName = ref(auth.profile?.full_name || '')
  const address = ref('')
  const zip = ref('')
  const city = ref('')
  const country = ref('France')

  // --- Méthodes de paiement
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

  async function submitOrder() {
    await withSablier(async () => {
      if (!auth.user) {
        toast.show('Veuillez vous connecter pour finaliser la commande.', 'danger')
        router.push('/auth/login')
        return
      }

      if (cart.items.length === 0) {
        toast.show('Votre panier est vide.', 'warning')
        return
      }

      try {
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
          status: 'pending',
        }

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({ user_id: auth.user.id, ...payload })
          .select()
          .single()

        if (orderError || !order) throw orderError

        if (selectedPayment.value === 'stripe') {
          const { data, error } = await supabase.functions.invoke('create-stripe-session', {
            body: {
              amount: cart.totalPrice,
              email: auth.user.email,
              orderId: order.id,
            },
          })

          if (error || !data?.url)
            throw new Error('Erreur lors de la création de la session Stripe.')
          window.location.href = data.url
        } else {
          toast.show('Paiement non-Stripe simulé.', 'success')
          cart.clearCart()
          router.push('/profil/commandes')
        }
      } catch (err: any) {
        console.error('❌ Erreur commande/paiement:', err)
        toast.show('Erreur lors du paiement ou de la commande ❌', 'danger')
      }
    })
  }
</script>

<style scoped lang="less">
  .checkout {
    max-width: 800px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 20px 100px;
    box-sizing: border-box;

    &__title {
      text-align: center;
    }

    &__cart,
    &__infos,
    &__payment {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    /* --- Items du panier --- */
    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid @neutral-100;
      padding: 10px 0;

      &-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      &-img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid @neutral-200;
      }

      &-price {
        margin-left: 16px; // espace entre le texte et le prix
        white-space: nowrap;
      }
    }

    &__total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
    }

    /* --- Formulaire adresse --- */
    &__form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__row {
      display: flex;
      gap: 12px;
    }

    /* --- Méthodes de paiement --- */
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

    @media (max-width: 700px) {
      &__row {
        flex-direction: column;
      }

      &__submit {
        padding: 12px 0;
        box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.05);
      }
    }
  }
</style>
