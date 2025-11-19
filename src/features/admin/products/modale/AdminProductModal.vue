<template>
  <ModalComponent
    v-model="visible"
    closable
  >
    <template #header>
      {{ headerTitle }}
    </template>
    <template #content>
      <div class="product-form">
        <WrapperInput
          v-model="form.name"
          label="Nom"
          placeholder="Ex : IGF-1 LR3"
          required
        />

        <div class="form-row">
          <WrapperInput
            v-model="form.category"
            label="Catégorie"
            placeholder="Ex : Bien-être"
            class="flex-1"
          />
          <WrapperInput
            :model-value="form.purity?.toString()"
            @update:model-value="(v) => (form.purity = v ? parseFloat(v) : null)"
            label="Pureté (%)"
            placeholder="Ex : 99"
            class="w-1/3"
          />
        </div>

        <div class="form-section">
          <BasicText
            size="body-s"
            weight="bold"
            color="neutral-500"
            class="mb-2"
          >
            Tarification
          </BasicText>
          <div class="form-row">
            <WrapperInput
              :model-value="form.price?.toString()"
              @update:model-value="(v) => (form.price = parseFloat(v || '0'))"
              label="Prix standard (€)"
              placeholder="0.00"
              input-type="form"
              class="flex-1"
            />

            <div class="promo-toggle">
              <WrapperCheckbox
                v-model="form.is_on_sale"
                label="En promotion"
              />
            </div>

            <WrapperInput
              v-if="form.is_on_sale"
              :model-value="form.sale_price?.toString()"
              @update:model-value="(v) => (form.sale_price = parseFloat(v || '0'))"
              label="Prix Promo (€)"
              placeholder="0.00"
              input-type="form"
              class="slide-in flex-1"
            />
          </div>
        </div>

        <div class="form-section">
          <BasicText
            size="body-s"
            weight="bold"
            color="neutral-500"
            class="mb-2"
          >
            Inventaire
          </BasicText>
          <WrapperInput
            :model-value="form.stock?.toString()"
            @update:model-value="(v) => (form.stock = parseInt(v || '0'))"
            label="Stock (Quantité)"
            placeholder="0"
            input-type="form"
            type="number"
          />
          <BasicText
            size="body-s"
            color="neutral-500"
            class="mt-1"
          >
            Mettre 0 pour afficher "Rupture de stock".
          </BasicText>
        </div>

        <WrapperFormElements label="Description">
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Description du produit..."
            class="custom-textarea"
          />
        </WrapperFormElements>

        <WrapperFormElements label="Image du produit">
          <BasicInput
            readonly
            placeholder="Sélectionner une image..."
            icon-name="Upload"
            @click="openFilePicker()"
            :value="selectedFile?.name || extractFileName(form.image) || ''"
          />
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleFileChange"
          />
          <div
            v-if="imagePreview"
            class="image-preview"
          >
            <img
              :src="imagePreview"
              alt="Aperçu produit"
            />
            <BasicButton
              label="Supprimer"
              type="secondary"
              variant="outlined"
              size="small"
              @click="removeImage"
            />
          </div>
        </WrapperFormElements>

        <BasicButton
          :label="isEditMode ? 'Mettre à jour le produit' : 'Créer le produit'"
          type="primary"
          :disabled="loading"
          @click="handleSubmit"
          class="mt-4"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useProductActions } from '@/supabase/actions/useProductActions'
  import { supabase } from '@/supabase/supabaseClient'
  import type { TablesInsert } from '@/supabase/types/supabase' // Type généré V2
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()

  const props = defineProps<{
    productId?: string | null
  }>()

  const emit = defineEmits(['saved'])
  const toast = useToastStore()
  const { createProduct, updateProduct } = useProductActions(() => emit('saved'))

  const loading = ref(false)
  const uploadLoading = ref(false)
  const imagePreview = ref<string | null>(null)
  const selectedFile = ref<File | null>(null)
  const fileInputRef = ref<HTMLInputElement | null>(null)
  const oldImagePath = ref<string | null>(null)

  // ✅ Initialisation compatible V2
  const form = ref<TablesInsert<'products'>>({
    name: '',
    category: '',
    price: 0,
    sale_price: null, // Nouveau
    is_on_sale: false, // Nouveau
    purity: null,
    description: '',
    stock: 0, // Nouveau : Integer (0 par défaut)
    image: null,
  })

  const isEditMode = computed(() => !!props.productId)
  const headerTitle = computed(() =>
    isEditMode.value ? 'Modifier le produit' : 'Ajouter un produit',
  )

  function openFilePicker() {
    fileInputRef.value?.click()
  }

  function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.show('Veuillez sélectionner une image valide', 'warning')
      return
    }
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }

  function extractFileName(url: string | null | undefined): string | null {
    if (!url) return null
    const parts = url.split('/')
    return parts[parts.length - 1] ?? null
  }

  async function loadProduct() {
    if (!props.productId) {
      // Reset form for creation mode
      form.value = {
        name: '',
        category: '',
        price: 0,
        sale_price: null,
        is_on_sale: false,
        purity: null,
        description: '',
        stock: 0,
        image: null,
      }
      imagePreview.value = null
      selectedFile.value = null
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', props.productId)
      .single()

    if (error) return toast.show('Erreur chargement produit', 'danger')

    form.value = { ...data } // Spread pour éviter les refs liées
    imagePreview.value = data.image || null
    if (data.image) oldImagePath.value = data.image.split('/product-images/')[1] ?? null
  }

  async function removeImage() {
    try {
      if (form.value.image) {
        const path = form.value.image.split('/product-images/')[1]
        if (path) {
          await supabase.storage.from('product-images').remove([path])
          toast.show('Image supprimée du serveur 🗑️', 'info')
        }
        form.value.image = null
      }
      selectedFile.value = null
      imagePreview.value = null
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  async function uploadImage(): Promise<string | null> {
    if (!selectedFile.value || !form.value.name) return null
    uploadLoading.value = true
    try {
      const productSlug = form.value.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      const folderPath = `products/${productSlug}`
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `peptide-${productSlug}-${Date.now()}.${fileExt}` // Ajout timestamp pour éviter cache
      const fullPath = `${folderPath}/${fileName}`

      if (oldImagePath.value) {
        await supabase.storage.from('product-images').remove([oldImagePath.value])
      }

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fullPath, selectedFile.value, { cacheControl: '3600', upsert: true })

      if (error) throw error

      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fullPath)
      oldImagePath.value = fullPath
      return publicUrlData.publicUrl
    } catch (err: any) {
      toast.show(`Erreur upload : ${(err as Error).message}`, 'danger')
      return null
    } finally {
      uploadLoading.value = false
    }
  }

  async function handleSubmit() {
    if (!form.value.name || !form.value.category || !form.value.price) {
      toast.show('Nom, catégorie et prix sont obligatoires', 'warning')
      return
    }

    loading.value = true
    try {
      if (selectedFile.value) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) form.value.image = uploadedUrl
      }

      // Nettoyage payload pour éviter d'envoyer sale_price null si pas en solde (optionnel mais propre)
      const payload = { ...form.value }
      if (!payload.is_on_sale) {
        payload.sale_price = null
      }

      if (isEditMode.value && props.productId) {
        await updateProduct(props.productId, payload)
      } else {
        await createProduct(payload)
      }

      visible.value = false
    } finally {
      loading.value = false
    }
  }

  onMounted(loadProduct)
  watch(() => props.productId, loadProduct)
  watch(visible, (val) => {
    if (val) loadProduct() // Recharger quand la modale s'ouvre
  })
</script>

<style scoped lang="less">
  .product-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px 20px;
    background: @neutral-50;
    border-radius: 8px;
  }

  .form-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .form-section {
    padding: 12px;
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background: #fff;
  }

  .promo-toggle {
    display: flex;
    align-items: center;
    height: 42px; /* Pour aligner avec les inputs */
    padding: 0 8px;
  }

  .custom-textarea {
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
    width: 100%;
    resize: vertical;
    font-family: inherit;

    &:focus {
      outline: 2px solid var(--primary-200);
      border-color: var(--primary-500);
    }
  }

  .image-preview {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #e5e7eb;

    img {
      max-width: 200px;
      width: 100%;
      height: auto;
      border-radius: 6px;
      object-fit: contain;
    }
  }

  .hidden-input {
    display: none;
  }

  .slide-in {
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
