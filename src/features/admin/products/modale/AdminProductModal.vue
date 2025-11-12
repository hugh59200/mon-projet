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
        <WrapperInput
          v-model="form.category"
          label="Catégorie"
          placeholder="Ex : Bien-être"
        />
        <WrapperInput
          :model-value="form.price?.toString()"
          @update:model-value="(v) => (form.price = parseFloat(v || '0'))"
          label="Prix (€)"
          placeholder="0.00"
          input-type="form"
        />
        <WrapperInput
          :model-value="form.purity?.toString()"
          @update:model-value="(v) => (form.purity = v ? parseFloat(v) : null)"
          label="Pureté (%)"
          placeholder="Ex : 99"
        />
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
        <WrapperCheckbox
          v-model="form.stock"
          label="Disponible en stock"
        />
        <BasicButton
          :label="isEditMode ? 'Mettre à jour le produit' : 'Créer le produit'"
          type="primary"
          :disabled="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useProductActions } from '@/supabase/actions/useProductActions'
  import { supabase } from '@/supabase/supabaseClient'
  import type { TablesInsert } from '@/supabase/types/supabase'
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

  const form = ref<TablesInsert<'products'>>({
    name: '',
    category: '',
    price: 0,
    purity: null,
    description: '',
    stock: true,
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
    if (!props.productId) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', props.productId)
      .single()

    if (error) return toast.show('Erreur chargement produit', 'danger')
    form.value = data
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
      const fileName = `peptide-${productSlug}.${fileExt}`
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

      if (isEditMode.value && props.productId) {
        await updateProduct(props.productId, form.value)
      } else {
        await createProduct(form.value)
      }

      visible.value = false
    } finally {
      loading.value = false
    }
  }

  onMounted(loadProduct)
  watch(() => props.productId, loadProduct)
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

  .custom-textarea {
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
    width: 100%;
    resize: vertical;

    &:read-only {
      background: #f8f8f8;
      color: #666;
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
      max-width: 280px;
      width: 100%;
      height: auto;
      border-radius: 10px;
      object-fit: contain;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  .inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: #fff;
    border: 1px solid #ddd;
    padding: 10px 12px;
    border-radius: 8px;
    input[type='checkbox'] {
      transform: scale(1.2);
      accent-color: @primary-600;
    }
  }

  .hidden-input {
    display: none;
  }

  :deep([readonly]) {
    background: #f9fafb !important;
    color: #555 !important;
    cursor: not-allowed;
  }
</style>
