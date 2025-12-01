<template>
  <transition name="modal-fade-scale">
    <ModalComponent
      v-if="visible"
      v-model="visible"
      :closable="true"
      max-width="640px"
    >
      <!-- 🧠 HEADER -->
      <template #header>
        {{ product?.name || 'Produit' }}
      </template>

      <!-- 🧱 CONTENU -->
      <template #content>
        <div class="product-modal">
          <!-- 🖼️ Image -->
          <div
            class="product-modal__image-wrapper"
            v-if="product?.image"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="product-modal__image"
            />
          </div>

          <!-- 🔹 Bloc infos -->
          <div class="product-modal__info">
            <div class="product-modal__title-row">
              <BasicText
                size="h5"
                weight="bold"
                class="product-modal__name"
              >
                {{ product?.name }}
              </BasicText>

              <BasicBadge
                v-if="product?.category"
                :label="product.category"
                type="default"
                size="small"
              />
            </div>

            <div class="product-modal__badges">
              <BasicBadge
                v-if="product?.purity"
                :label="`Pureté ${product.purity}%`"
                type="info"
                size="small"
              />
              <BasicBadge
                :label="product?.stock ? 'En stock' : 'Rupture'"
                :type="product?.stock ? 'success' : 'error'"
                size="small"
              />
            </div>

            <BasicText
              size="h4"
              color="primary-600"
              weight="bold"
              class="product-modal__price"
            >
              {{ product?.price ? product.price.toFixed(2) + ' €' : '—' }}
            </BasicText>

            <div class="product-modal__separator" />

            <div class="product-modal__description">
              <BasicText
                size="body-s"
                color="neutral-700"
              >
                {{ product?.description || 'Aucune description disponible.' }}
              </BasicText>
            </div>
          </div>
        </div>
      </template>

      <!-- ✅ FOOTER -->
      <template #footer>
        <div class="product-modal__footer">
          <BasicButton
            label="Fermer"
            variant="outlined"
            size="medium"
            type="secondary"
            @click="visible = false"
          />
        </div>
      </template>
    </ModalComponent>
  </transition>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()

  const props = defineProps<{
    productId?: string | null
  }>()

  const product = ref<any>(null)
  const toast = useToastStore()

  /* 🔎 Chargement du produit */
  async function loadProduct() {
    if (!props.productId) return
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', props.productId)
        .single()
      if (error) throw error
      product.value = data
    } catch (err) {
      console.error('Erreur chargement produit:', err)
      toast.show('Erreur lors du chargement du produit', 'danger')
    }
  }

  onMounted(loadProduct)
  watch(() => props.productId, loadProduct)
</script>

<style scoped lang="less">
  /* === Animation === */
  .modal-fade-scale-enter-active,
  .modal-fade-scale-leave-active {
    transition: all 0.25s ease-out;
  }
  .modal-fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.96);
  }
  .modal-fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.96);
  }

  /* === Layout général === */
  .product-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 20px;

    &__image-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &__image {
      max-width: 240px;
      width: 100%;
      border-radius: 12px;
      object-fit: contain;
      box-shadow: 0 4px 14px color-mix(in srgb, @neutral-400 25%, transparent);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.03);
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
      gap: 12px;
    }

    &__title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    &__name {
      font-size: 18px;
      color: @neutral-900;
    }

    &__badges {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    &__price {
      margin-top: 4px;
      font-size: 22px;
    }

    &__separator {
      width: 60%;
      height: 1px;
      background: color-mix(in srgb, @neutral-300 60%, transparent);
      margin: 10px 0;
    }

    &__description {
      background: color-mix(in srgb, @neutral-100 60%, transparent);
      border-radius: 10px;
      padding: 12px 16px;
      max-width: 95%;
      line-height: 1.5;
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding-top: 10px;
    }
  }

  @media (max-width: 600px) {
    .product-modal {
      gap: 14px;
      padding: 12px;

      &__name {
        font-size: 16px;
      }

      &__price {
        font-size: 18px;
      }

      &__description {
        font-size: 13px;
      }
    }
  }
</style>
