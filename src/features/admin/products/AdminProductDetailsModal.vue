<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <template #header>
      <BasicText
        size="h5"
        weight="bold"
      >
        Détails du produit
      </BasicText>
    </template>

    <template #content>
      <div
        class="product-detail--compact"
        v-if="product"
      >
        <!-- Bloc principal -->
        <div class="product-detail__info">
          <div class="product-detail__grid">
            <div>
              <p>
                <b>Nom :</b>
                {{ product.name }}
              </p>
              <p>
                <b>Catégorie :</b>
                {{ product.category }}
              </p>
              <p>
                <b>Prix :</b>
                {{ formatCurrency(product.price) }}
              </p>
              <p>
                <b>Pureté :</b>
                {{ product.purity ?? '—' }}
              </p>
            </div>

            <div>
              <p>
                <b>ID :</b>
                {{ product.id }}
              </p>
              <p>
                <b>Créé le :</b>
                {{ formatDate(product.created_at) }}
              </p>
              <p>
                <b>Stock :</b>
                <BasicBadge
                  :label="product.stock ? 'Disponible' : 'Rupture'"
                  :type="(product.stock ? 'success' : 'danger') as BadgeType"
                  size="small"
                />
              </p>
            </div>
          </div>

          <div
            class="product-detail__description"
            v-if="product.description"
          >
            <b>Description :</b>
            <p>{{ product.description }}</p>
          </div>

          <div
            class="product-detail__image"
            v-if="product.image"
          >
            <b>Image :</b>
            <img
              :src="product.image"
              alt="Image produit"
            />
          </div>
        </div>

        <!-- Bloc édition -->
        <div class="product-detail__edit">
          <h5>Modifier le produit</h5>
          <div class="product-edit-grid">
            <label>
              Nom :
              <input
                v-model="editForm.name"
                type="text"
              />
            </label>
            <label>
              Catégorie :
              <input
                v-model="editForm.category"
                type="text"
              />
            </label>
            <label>
              Prix (€) :
              <input
                v-model.number="editForm.price"
                type="number"
                min="0"
                step="0.01"
              />
            </label>
            <label>
              Pureté :
              <input
                v-model.number="editForm.purity"
                type="number"
                min="0"
                max="100"
              />
            </label>
            <label>
              En stock :
              <input
                v-model="editForm.stock"
                type="checkbox"
              />
            </label>
          </div>

          <label>Description :</label>
          <textarea
            v-model="editForm.description"
            rows="3"
          />

          <BasicButton
            label="Enregistrer les modifications"
            type="secondary"
            variant="outlined"
            @click="handleSave"
          />
        </div>
      </div>

      <div
        v-else
        class="product-detail__loading"
      >
        <BasicLoader />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { supabase } from '@/supabase/supabaseClient'
  import type { Tables } from '@/supabase/types/supabase'
  import { formatCurrency, formatDate } from '@/utils/index'
  import type { BadgeType } from '@designSystem/components/basic/badge/BasicBadge.types'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ productId: string }>()

  const toast = useToastStore()
  const product = ref<Tables<'products'> | null>(null)
  const editForm = ref({
    name: '',
    category: '',
    price: 0,
    purity: null as number | null,
    stock: false,
    description: '',
  })

  async function loadProduct() {
    if (!props.productId) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', props.productId)
      .single()
    if (error) return toast.show('Erreur de chargement du produit ⚠️', 'danger')
    product.value = data
    editForm.value = {
      name: data.name,
      category: data.category,
      price: data.price,
      purity: data.purity,
      stock: data.stock!,
      description: data.description || '',
    }
  }

  async function handleSave() {
    if (!product.value) return
    const { error } = await supabase
      .from('products')
      .update(editForm.value)
      .eq('id', product.value.id)
    if (error) toast.show('Erreur lors de la mise à jour', 'danger')
    else {
      toast.show('Produit mis à jour ✅', 'success')
      loadProduct()
    }
  }

  watch(() => props.productId, loadProduct)
  onMounted(loadProduct)
</script>

<style scoped lang="less">
  .product-detail--compact {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .product-detail__info {
    background-color: @neutral-100;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    padding: 16px 18px;
    font-size: 14px;
  }

  .product-detail__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 8px;
  }

  .product-detail__grid p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .product-detail__description {
    margin-top: 12px;
  }

  .product-detail__image {
    margin-top: 12px;
    img {
      margin-top: 6px;
      max-width: 100%;
      border-radius: 8px;
    }
  }

  .product-detail__edit {
    background-color: @neutral-50;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    font-size: 14px;
  }

  .product-edit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px 16px;
    margin-bottom: 10px;
  }

  .product-edit-grid label {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  textarea {
    width: 100%;
    resize: vertical;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 6px 8px;
  }

  .product-detail__loading {
    text-align: center;
    padding: 40px;
  }

  @media (max-width: 768px) {
    .product-detail__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
