<template>
  <div class="checkout">
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

    <!-- 💳 Bouton de validation -->
    <BasicButton
      label="Valider la commande"
      type="primary"
      variant="filled"
      width="full"
      size="large"
      class="checkout__submit"
      :disabled="loading || cart.items.length === 0"
      @click="submitOrder"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { createFullOrder } from '@/services/orderService'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const auth = useAuthStore()
  const toast = useToastStore()
  const cart = useCartStore()
  const router = useRouter()

  const loading = ref(false)

  // 📦 Champs adresse
  const fullName = ref(auth.profile?.full_name || '')
  const address = ref('')
  const zip = ref('')
  const city = ref('')
  const country = ref('France')

  async function submitOrder() {
    if (!auth.user) {
      toast.showToast('Veuillez vous connecter pour finaliser la commande.', 'danger')
      router.push('/login')
      return
    }

    if (cart.items.length === 0) {
      toast.showToast('Votre panier est vide.', 'warning')
      return
    }

    loading.value = true

    const payload = {
      email: auth.user.email,
      full_name: fullName.value,
      address: address.value,
      zip: zip.value,
      city: city.value,
      country: country.value,
      payment_method: 'card',
      total_amount: cart.totalPrice,
      items: cart.items,
    }

    try {
      const order = await createFullOrder(payload)

      toast.showToast('Commande validée ✅', 'success')
      toast.showToast('Email de confirmation envoyé 📧', 'success')
      cart.clearCart()
      router.push(`/confirmation/${order.id}`)
    } catch (err: any) {
      console.error(err)
      toast.showToast('Erreur lors de la création de la commande ❌', 'danger')
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="less">
  .checkout {
    max-width: 800px;
    margin: 50px auto;
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

    &__infos {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__row {
      display: flex;
      gap: 12px;
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
