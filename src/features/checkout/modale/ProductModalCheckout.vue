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
        <div class="product-details">
          <!-- 🖼️ Image -->
          <div
            class="image-wrapper"
            v-if="product?.image"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="product-image"
            />
          </div>

          <!-- 🔹 Bloc infos -->
          <div class="info">
            <div class="title-line">
              <BasicText
                size="h5"
                weight="bold"
                class="name"
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

            <div class="badges">
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
              class="price"
            >
              {{ product?.price ? product.price.toFixed(2) + ' €' : '—' }}
            </BasicText>

            <div class="separator" />

            <div class="description">
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
        <div class="footer">
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
  import { supabase } from '@/supabase/supabaseClient'
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
  .product-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 20px;
  }

  /* === Image === */
  .image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;

    .product-image {
      max-width: 240px;
      width: 100%;
      border-radius: 12px;
      object-fit: contain;
      box-shadow: 0 4px 14px rgba(var(--neutral-400-rgb), 0.25);
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(1.03);
      }
    }
  }

  /* === Infos === */
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    gap: 12px;

    .title-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      .name {
        font-size: 18px;
        color: @neutral-900;
      }
    }

    .badges {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .price {
      margin-top: 4px;
      font-size: 22px;
    }

    .separator {
      width: 60%;
      height: 1px;
      background: rgba(var(--neutral-300-rgb), 0.60);
      margin: 10px 0;
    }

    .description {
      background: rgba(var(--neutral-100-rgb), 0.60);
      border-radius: 10px;
      padding: 12px 16px;
      max-width: 95%;
      line-height: 1.5;
    }
  }

  /* === Footer === */
  .footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }

  /* === Responsive === */
  @media (max-width: 600px) {
    .product-details {
      gap: 14px;
      padding: 12px;
    }

    .info .name {
      font-size: 16px;
    }

    .info .price {
      font-size: 18px;
    }

    .info .description {
      font-size: 13px;
    }
  }
</style>
