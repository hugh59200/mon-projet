<template>
  <ModalComponent
    v-model="visible"
    closable
    :title="headerTitle"
  >
    <template #content>
      <div class="product-form">
        
        <div class="form-section">
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
            Identité du produit
          </BasicText>
          
          <div class="form-row">
            <WrapperInput
              v-model="form.name"
              label="Nom"
              placeholder="Ex : BPC-157"
              required
              class="flex-grow-2" 
            />
            <WrapperInput
              v-model="form.dosage"
              label="Dosage"
              placeholder="Ex : 10mg"
              required
              class="flex-grow-1"
            />
          </div>

          <div class="form-row">
            <WrapperInput
              v-model="form.category"
              label="Catégorie"
              placeholder="Ex : Récupération"
              class="flex-grow-1"
            />
            <WrapperInput
              :model-value="form.purity?.toString()"
              @update:model-value="(v) => (form.purity = v ? parseFloat(v) : null)"
              label="Pureté (%)"
              placeholder="Ex : 99"
              type="number"
              class="flex-grow-1"
            />
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <BasicText size="body-s" weight="bold" color="neutral-500">
              Tarification
            </BasicText>
            <WrapperCheckbox
              v-model="form.is_on_sale"
              label="Activer la promotion"
            />
          </div>

          <div class="form-row">
            <WrapperInput
              :model-value="form.price?.toString()"
              @update:model-value="(v) => (form.price = parseFloat(v || '0'))"
              label="Prix standard (€)"
              placeholder="0.00"
              input-type="form"
              class="flex-grow-1"
            />

            <div class="flex-grow-1 promo-container">
              <WrapperInput
                v-if="form.is_on_sale"
                :model-value="form.sale_price?.toString()"
                @update:model-value="(v) => (form.sale_price = parseFloat(v || '0'))"
                label="Prix Promo (€)"
                placeholder="0.00"
                input-type="form"
                class="slide-in"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <BasicText size="body-s" weight="bold" color="neutral-500" class="section-title">
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
            class="helper-text"
          >
            Mettre 0 pour afficher "Rupture de stock".
          </BasicText>
        </div>

        <WrapperFormElements label="Description détaillée">
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Description du produit (supporte HTML simple)..."
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
            class="cursor-pointer"
          />
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="handleFileChange"
          />
          
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Aperçu produit" />
            <BasicButton
              label="Supprimer l'image"
              type="danger"
              variant="ghost"
              size="small"
              @click="removeImage"
            />
          </div>
        </WrapperFormElements>

        <div class="form-actions">
          <BasicButton
            label="Annuler"
            type="secondary"
            variant="outlined"
            @click="visible = false"
          />
          <BasicButton
            :label="isEditMode ? 'Enregistrer' : 'Créer le produit'"
            type="primary"
            :disabled="loading || uploadLoading"
            @click="handleSubmit"
          />
        </div>

      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useProductActions } from '../composables/useProductActions'
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

  // ✅ Initialisation complète (avec Dosage)
  const form = ref<TablesInsert<'products'>>({
    name: '',
    dosage: '', // Nouveau champ V2
    category: '',
    price: 0,
    sale_price: null,
    is_on_sale: false,
    purity: null,
    description: '',
    stock: 0,
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
    // On extrait juste le nom du fichier de l'URL
    return url.split('/').pop() ?? null
  }

  async function loadProduct() {
    if (!props.productId) {
      // Reset pour création
      form.value = {
        name: '',
        dosage: '',
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

    if (error) {
      toast.show('Erreur chargement produit', 'danger')
      visible.value = false
      return
    }

    form.value = { ...data }
    imagePreview.value = data.image || null
    
    // Extraction du path pour suppression future éventuelle
    if (data.image && data.image.includes('/product-images/')) {
      oldImagePath.value = data.image.split('/product-images/')[1] ?? null
    }
  }

  async function removeImage() {
    // Note: On ne supprime pas physiquement l'image tout de suite pour éviter les erreurs si on annule
    // On le fait juste visuellement dans le formulaire
    form.value.image = null
    imagePreview.value = null
    selectedFile.value = null
  }

  async function uploadImage(): Promise<string | null> {
    if (!selectedFile.value || !form.value.name) return null
    
    uploadLoading.value = true
    try {
      // Création d'un nom de fichier unique : slug-dosage-timestamp.ext
      const slug = form.value.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const dosageSlug = form.value.dosage?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'u'
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `${slug}-${dosageSlug}-${Date.now()}.${fileExt}`
      
      const folderPath = `products`
      const fullPath = `${folderPath}/${fileName}`

      // Upload Supabase
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fullPath, selectedFile.value, { 
          cacheControl: '3600', 
          upsert: true 
        })

      if (error) throw error

      // Récupération URL publique
      const { data } = supabase.storage.from('product-images').getPublicUrl(fullPath)
      return data.publicUrl

    } catch (err: any) {
      toast.show(`Erreur upload : ${err.message}`, 'danger')
      return null
    } finally {
      uploadLoading.value = false
    }
  }

  async function handleSubmit() {
    // Validation basique
    if (!form.value.name || !form.value.price) {
      toast.show('Nom et Prix sont obligatoires', 'warning')
      return
    }
    if (!form.value.dosage) {
      toast.show('Le dosage est obligatoire (ex: 10mg)', 'warning')
      return
    }

    loading.value = true
    try {
      // Upload image si nouvelle sélectionnée
      if (selectedFile.value) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) form.value.image = uploadedUrl
      }

      // Nettoyage logique : Si pas en promo, on vide le prix promo
      const payload = { ...form.value }
      if (!payload.is_on_sale) {
        payload.sale_price = null
      }

      if (isEditMode.value && props.productId) {
        await updateProduct(props.productId, payload)
        toast.show('Produit mis à jour avec succès', 'success')
      } else {
        await createProduct(payload)
        toast.show('Produit créé avec succès', 'success')
      }

      visible.value = false
    } catch (err) {
      console.error(err)
      // Le toast d'erreur est généralement géré dans useProductActions, mais au cas où
      toast.show('Une erreur est survenue', 'danger')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadProduct)
  watch(() => props.productId, loadProduct)
  
  // Recharger les données quand on ouvre la modale (cas création -> fermeture -> réouverture)
  watch(visible, (val) => {
    if (val) loadProduct()
  })
</script>

<style scoped lang="less">
  .product-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 10px;
  }

  .form-section {
    padding: 20px;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    background: @white;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-title {
    margin-bottom: 4px;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .form-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 12px;
    }
  }

  // Classes utilitaires flex pour remplacer Tailwind
  .flex-grow-1 {
    flex: 1;
  }
  .flex-grow-2 {
    flex: 2;
  }

  .promo-container {
    position: relative; // Pour l'animation slide-in
  }

  .helper-text {
    margin-top: 4px;
    font-size: 0.8rem;
  }

  .custom-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid @neutral-300;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    background: @white;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .hidden-input {
    display: none;
  }

  .image-preview {
    margin-top: 12px;
    padding: 16px;
    border: 1px dashed @neutral-300;
    border-radius: 8px;
    background-color: @neutral-50;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    img {
      max-height: 180px;
      max-width: 100%;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid @neutral-100;
    margin-top: 8px;
  }

  // Animation simple d'apparition du champ promo
  .slide-in {
    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideInRight {
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