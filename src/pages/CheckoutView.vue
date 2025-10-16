<template>
  <div class="checkout">
    <BasicText
      size="h3"
      weight="bold"
      class="checkout__title"
    >
      Paiement & Livraison
    </BasicText>

    <!-- 🚫 Panier vide -->
    <div
      v-if="cart.items.length === 0"
      class="checkout__empty"
    >
      <BasicText>Votre panier est vide.</BasicText>
      <BasicButton
        label="Retour au catalogue"
        type="primary"
        variant="filled"
        size="medium"
        @click="$router.push('/catalogue')"
      />
    </div>

    <!-- 🧾 Formulaire + Résumé -->
    <div
      v-else-if="!success"
      class="checkout__content"
    >
      <!-- 🧍 Informations -->
      <form class="checkout__form">
        <BasicText
          size="h5"
          weight="bold"
        >
          Informations de livraison
        </BasicText>

        <BasicInput
          v-model="form.fullName"
          placeholder="Nom complet"
          input-type="form"
          size="medium"
          required
        />
        <BasicInput
          v-model="form.email"
          placeholder="Adresse e-mail"
          input-type="form"
          size="medium"
          type="email"
          required
        />
        <BasicInput
          v-model="form.address"
          placeholder="Adresse postale"
          input-type="form"
          size="medium"
          required
        />
        <BasicInput
          v-model="form.city"
          placeholder="Ville"
          input-type="form"
          size="medium"
          required
        />
        <BasicInput
          v-model="form.zip"
          placeholder="Code postal"
          input-type="form"
          size="medium"
          required
        />
        <BasicInput
          v-model="form.country"
          placeholder="Pays"
          input-type="form"
          size="medium"
          required
        />

        <BasicText
          size="h5"
          weight="bold"
          class="checkout__section"
        >
          Méthode de paiement (simulation)
        </BasicText>
        <select
          v-model="form.paymentMethod"
          required
        >
          <option
            disabled
            value=""
          >
            Choisissez une méthode
          </option>
          <option value="card">Carte bancaire (simulation)</option>
          <option value="paypal">PayPal (simulation)</option>
        </select>

        <BasicButton
          label="Valider la commande"
          type="primary"
          variant="filled"
          width="full"
          size="large"
          class="checkout__submit"
          :disabled="loading"
          @click="submitOrder"
        />
      </form>

      <!-- 🛒 Résumé -->
      <div class="checkout__summary">
        <BasicText
          size="h5"
          weight="bold"
        >
          Résumé du panier
        </BasicText>

        <div
          v-for="item in cart.items"
          :key="item.id"
          class="checkout__line"
        >
          <BasicText>{{ item.name }} × {{ item.quantity }}</BasicText>
          <BasicText weight="bold">{{ (item.price * item.quantity).toFixed(2) }} €</BasicText>
        </div>

        <div class="checkout__total">
          <BasicText weight="bold">Total :</BasicText>
          <BasicText
            weight="bold"
            color="primary-600"
          >
            {{ cart.totalPrice.toFixed(2) }} €
          </BasicText>
        </div>
      </div>
    </div>

    <!-- ✅ Confirmation -->
    <div
      v-else
      class="checkout__success"
    >
      <BasicIcon
        name="tick-circle"
        size="48"
        color="primary-600"
      />
      <BasicText
        size="h4"
        weight="bold"
      >
        Commande enregistrée ✅
      </BasicText>
      <BasicText
        size="body-m"
        color="neutral-500"
      >
        Merci {{ form.fullName }} ! Votre commande a bien été enregistrée.
        <br />
        Vous recevrez un e-mail de confirmation à
        <strong>{{ form.email }}</strong>
        .
      </BasicText>
      <BasicButton
        label="Retour au catalogue"
        type="primary"
        variant="filled"
        size="medium"
        @click="$router.push('/catalogue')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cart = useCartStore()
  const toast = useToastStore()

  const loading = ref(false)
  const success = ref(false)

  const form = ref({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    paymentMethod: '',
  })

  // ✅ Enregistrement dans Supabase
  async function submitOrder() {
    if (cart.items.length === 0) {
      toast.showToast('Votre panier est vide', 'warning')
      return
    }

    loading.value = true

    try {
      const { error } = await supabase.from('orders').insert([
        {
          full_name: form.value.fullName,
          email: form.value.email,
          address: form.value.address,
          city: form.value.city,
          zip: form.value.zip,
          country: form.value.country,
          payment_method: form.value.paymentMethod,
          total_amount: cart.totalPrice,
          items: cart.items.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      ])

      if (error) throw error

      // 💾 Succès
      toast.showToast('Commande enregistrée dans la base ✅', 'success')
      success.value = true
      cart.items = []
      localStorage.removeItem('cart')
    } catch (err: any) {
      console.error(err)
      toast.showToast('Erreur lors de l’enregistrement 😢', 'danger')
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="less">
  .checkout {
    max-width: 1000px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;

    &__title {
      text-align: center;
    }

    &__content {
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    &__form {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 14px;

      select {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid @neutral-300;
        background: white;
        cursor: pointer;
      }
    }

    &__summary {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      background: @neutral-50;
      padding: 20px;
    }

    &__line {
      display: flex;
      justify-content: space-between;
    }

    &__total {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      border-top: 1px solid @neutral-200;
      padding-top: 8px;
    }

    &__submit {
      margin-top: 20px;
    }

    &__success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      padding: 40px 20px;
    }

    &__empty {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
  }
</style>
