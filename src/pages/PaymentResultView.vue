<template>
  <div class="payment-result">
    <BasicText
      size="h4"
      weight="bold"
    >
      {{ message }}
    </BasicText>

    <BasicButton
      v-if="!loading"
      label="Retour à l'accueil"
      type="primary"
      variant="filled"
      @click="router.push('/')"
    />
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const message = ref('Vérification du paiement...')
  const loading = ref(true)

  onMounted(async () => {
    const sessionId = route.query.session_id as string
    const cancelled = route.query.cancelled === 'true'

    if (cancelled) {
      message.value = 'Le paiement a été annulé ❌'
      loading.value = false
      return
    }

    if (!sessionId) {
      message.value = 'Session Stripe introuvable.'
      loading.value = false
      return
    }

    // 🔍 Vérifie la commande liée à cette session Stripe
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount, full_name')
      .eq('stripe_session_id', sessionId)
      .single()

    if (error || !data) {
      message.value = 'Commande introuvable ❌'
      loading.value = false
      return
    }

    if (data.status === 'paid') {
      message.value = `Merci ${data.full_name} 🎉 Votre paiement de ${data.total_amount} € a bien été confirmé !`
      toast.showToast('Paiement réussi ✅', 'success')
    } else if (data.status === 'pending') {
      message.value = 'Votre paiement est en attente de confirmation...'
    } else {
      message.value = 'Le paiement a échoué ❌'
      toast.showToast('Échec du paiement', 'danger')
    }

    loading.value = false
  })
</script>

<style scoped lang="less">
  .payment-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 24px;
    text-align: center;
  }
</style>
