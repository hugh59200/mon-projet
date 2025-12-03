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
              inputmode="decimal"
              type="number"
              min="0"
              step="0.01"
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
                inputmode="decimal"
                type="number"
                min="0"
                step="0.01"
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
            <PremiumButton
              label="Supprimer l'image"
              type="danger"
              variant="ghost"
              size="sm"
              @click="removeImage"
            />
          </div>
        </WrapperFormElements>

        <!-- Section Traductions (i18n) -->
        <div class="translations-section">
          <div
            class="translations-header"
            @click="showTranslations = !showTranslations"
          >
            <BasicText
              size="body-l"
              weight="bold"
              color="primary-700"
            >
              🌐 Traductions (Multilingue)
            </BasicText>
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ showTranslations ? '▼' : '▶' }} Cliquez pour {{ showTranslations ? 'masquer' : 'afficher' }}
            </BasicText>
          </div>

          <div v-if="showTranslations" class="translations-content">
            <div class="language-group">
              <BasicText
                size="body-m"
                weight="bold"
                color="primary-600"
                class="language-title"
              >
                🇫🇷 Français
              </BasicText>
              <WrapperInput
                v-model="nameFr"
                label="Nom (FR)"
                placeholder="Ex: Peptide BPC-157"
              />
              <WrapperInput
                v-model="categoryFr"
                label="Catégorie (FR)"
                placeholder="Ex: Peptides"
              />
              <WrapperFormElements label="Description (FR)">
                <textarea
                  v-model="descriptionFr"
                  rows="3"
                  class="custom-textarea"
                  placeholder="Description en français..."
                />
              </WrapperFormElements>
            </div>

            <div class="language-group">
              <BasicText
                size="body-m"
                weight="bold"
                color="primary-600"
                class="language-title"
              >
                🇬🇧 English
              </BasicText>
              <WrapperInput
                v-model="nameEn"
                label="Name (EN)"
                placeholder="Ex: BPC-157 Peptide"
              />
              <WrapperInput
                v-model="categoryEn"
                label="Category (EN)"
                placeholder="Ex: Peptides"
              />
              <WrapperFormElements label="Description (EN)">
                <textarea
                  v-model="descriptionEn"
                  rows="3"
                  class="custom-textarea"
                  placeholder="Description in English..."
                />
              </WrapperFormElements>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <PremiumButton
        label="Annuler"
        type="secondary"
        variant="outline"
        :disabled="loading || uploadLoading"
        @click="visible = false"
      />
      <PremiumButton
        :label="isEditMode ? 'Enregistrer' : 'Créer le produit'"
        type="primary"
        :loading="loading || uploadLoading"
        @click="handleSubmit"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useProductActions } from '../composables/useProductActions'
  import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch } from 'vue'

  interface ProductForm {
    name: string
    dosage: string | null
    category: string
    price: number
    sale_price: number | null
    is_on_sale: boolean | null
    purity: number | null
    description: string | null
    stock: number
    image: string | null
    name_i18n: Record<string, string>
    description_i18n: Record<string, string>
    category_i18n: Record<string, string>
  }

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

  // ✅ Initialisation complète (avec Dosage + i18n)
  const form = ref<ProductForm>({
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
    name_i18n: {},
    description_i18n: {},
    category_i18n: {},
  })

  // État pour les traductions
  const showTranslations = ref(false)
  const nameEn = ref('')
  const nameFr = ref('')
  const descriptionEn = ref('')
  const descriptionFr = ref('')
  const categoryEn = ref('')
  const categoryFr = ref('')

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
        name_i18n: {},
        description_i18n: {},
        category_i18n: {},
      }
      imagePreview.value = null
      selectedFile.value = null
      // Reset i18n fields
      nameFr.value = ''
      nameEn.value = ''
      descriptionFr.value = ''
      descriptionEn.value = ''
      categoryFr.value = ''
      categoryEn.value = ''
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

    // Extraction des traductions i18n depuis les JSONB
    const nameI18n = (data.name_i18n as Record<string, string>) || {}
    const descI18n = (data.description_i18n as Record<string, string>) || {}
    const catI18n = (data.category_i18n as Record<string, string>) || {}

    form.value = {
      name: data.name,
      dosage: data.dosage,
      category: data.category,
      price: data.price,
      sale_price: data.sale_price,
      is_on_sale: data.is_on_sale,
      purity: data.purity,
      description: data.description,
      stock: data.stock,
      image: data.image,
      name_i18n: nameI18n,
      description_i18n: descI18n,
      category_i18n: catI18n,
    }
    imagePreview.value = data.image || null

    // Extraction du path pour suppression future éventuelle
    if (data.image && data.image.includes('/product-images/')) {
      oldImagePath.value = data.image.split('/product-images/')[1] ?? null
    }

    nameFr.value = nameI18n?.fr || ''
    nameEn.value = nameI18n?.en || ''
    descriptionFr.value = descI18n?.fr || ''
    descriptionEn.value = descI18n?.en || ''
    categoryFr.value = catI18n?.fr || ''
    categoryEn.value = catI18n?.en || ''
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

      // Construction des objets i18n depuis les champs individuels
      const nameI18n: Record<string, string> = {}
      const descriptionI18n: Record<string, string> = {}
      const categoryI18n: Record<string, string> = {}

      if (nameFr.value) nameI18n.fr = nameFr.value
      if (nameEn.value) nameI18n.en = nameEn.value
      if (descriptionFr.value) descriptionI18n.fr = descriptionFr.value
      if (descriptionEn.value) descriptionI18n.en = descriptionEn.value
      if (categoryFr.value) categoryI18n.fr = categoryFr.value
      if (categoryEn.value) categoryI18n.en = categoryEn.value

      // Nettoyage logique : Si pas en promo, on vide le prix promo
      const payload = { ...form.value }
      if (!payload.is_on_sale) {
        payload.sale_price = null
      }

      // Ajout des traductions i18n au payload
      payload.name_i18n = nameI18n
      payload.description_i18n = descriptionI18n
      payload.category_i18n = categoryI18n

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
    gap: 28px;
    padding: 16px;
    overflow-x: hidden; /* Empêche le scroll horizontal */
  }

  .form-section {
    position: relative;
    padding: 24px;
    border: 1px solid @neutral-200;
    border-radius: 16px;
    background: linear-gradient(135deg, @white 0%, @neutral-50 100%);
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 2px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    // Effet glassmorphism subtil
    backdrop-filter: blur(10px);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
      border-radius: 16px 16px 0 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.08),
        0 2px 6px rgba(0, 0, 0, 0.08);
      border-color: var(--primary-200);

      &::before {
        opacity: 1;
      }
    }
  }

  .section-title {
    margin-bottom: 8px;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    font-weight: 700;
    color: var(--primary-600);
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 4px;
      height: 16px;
      background: linear-gradient(180deg, var(--primary-500), var(--primary-300));
      border-radius: 2px;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 12px;
    border-bottom: 2px solid @neutral-100;
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
    position: relative;
  }

  .helper-text {
    margin-top: 8px;
    font-size: 0.8rem;
    color: @neutral-500;
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: 'ℹ';
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      background: var(--primary-100);
      color: var(--primary-600);
      border-radius: 50%;
      font-size: 0.7rem;
      font-weight: 700;
    }
  }

  .custom-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid @neutral-200;
    border-radius: 12px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    background: @white;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 120px;

    &:hover {
      border-color: var(--primary-300);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow:
        0 0 0 4px rgba(var(--primary-500-rgb), 0.1),
        0 2px 8px rgba(var(--primary-500-rgb), 0.15);
      background: @white;
    }

    &::placeholder {
      color: @neutral-400;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .hidden-input {
    display: none;
  }

  .image-preview {
    margin-top: 16px;
    padding: 20px;
    border: 2px dashed var(--primary-200);
    border-radius: 16px;
    background: linear-gradient(135deg,
      rgba(var(--primary-500-rgb), 0.03) 0%,
      rgba(var(--primary-300-rgb), 0.05) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: radial-gradient(circle at 50% 0%,
        rgba(var(--primary-500-rgb), 0.05) 0%,
        transparent 70%);
      pointer-events: none;
    }

    img {
      max-height: 220px;
      max-width: 100%;
      object-fit: contain;
      border-radius: 12px;
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;

      &:hover {
        transform: scale(1.02);
      }
    }
  }


  // Animation premium d'apparition du champ promo
  .slide-in {
    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  // Animation d'entrée pour les sections
  .form-section {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.15s; }
    &:nth-child(4) { animation-delay: 0.2s; }
    &:nth-child(5) { animation-delay: 0.25s; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Style premium pour les inputs
  :deep(.wrapper-input) {
    .input-wrapper {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-1px);
      }
    }
  }

  // Section traductions (i18n)
  .translations-section {
    margin-top: 8px;
    border: 2px dashed var(--primary-200);
    border-radius: 16px;
    background: linear-gradient(135deg,
      rgba(var(--primary-500-rgb), 0.02) 0%,
      rgba(var(--secondary-500-rgb), 0.02) 100%);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: var(--primary-300);
      box-shadow:
        0 4px 12px rgba(var(--primary-500-rgb), 0.08),
        0 2px 4px rgba(0, 0, 0, 0.04);
    }

    .translations-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg,
        rgba(var(--primary-500-rgb), 0.05) 0%,
        rgba(var(--primary-300-rgb), 0.03) 100%);
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;

      &:hover {
        background: linear-gradient(135deg,
          rgba(var(--primary-500-rgb), 0.08) 0%,
          rgba(var(--primary-300-rgb), 0.06) 100%);
      }

      &:active {
        transform: scale(0.99);
      }
    }

    .translations-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 24px;
      background: @white;
      animation: slideDown 0.3s ease-out;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 16px;
      }
    }

    .language-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, @white 0%, @neutral-50 100%);
      border-radius: 12px;
      border: 1px solid @neutral-200;
      box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.03),
        0 1px 2px rgba(0, 0, 0, 0.04);

      .language-title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--primary-100);
        margin-bottom: 4px;
      }

      .custom-textarea {
        border: 2px solid @neutral-200;
        border-radius: 12px;
        padding: 14px 16px;
        font-size: 14px;
        width: 100%;
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
        line-height: 1.6;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          border-color: var(--primary-300);
        }

        &:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow:
            0 0 0 4px rgba(var(--primary-500-rgb), 0.1),
            0 2px 8px rgba(var(--primary-500-rgb), 0.15);
          background: @white;
        }

        &::placeholder {
          color: @neutral-400;
        }
      }
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
  }

  // Responsive amélioré
  @media (max-width: 768px) {
    .product-form {
      gap: 20px;
      padding: 4px;
    }

    .form-section {
      padding: 18px;
    }

    .image-preview img {
      max-height: 180px;
    }
  }
</style>