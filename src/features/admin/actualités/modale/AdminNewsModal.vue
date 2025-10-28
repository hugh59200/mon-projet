<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <!-- 🧠 Header -->
    <template #header>
      {{ headerTitle }}
    </template>

    <!-- 🧱 Contenu principal -->
    <template #content>
      <div class="news-form">
        <!-- 🧾 Titre -->
        <WrapperInput
          v-model="form.title"
          label="Titre"
          placeholder="Ex : Nouvelle étude sur le BPC-157"
          :readonly="readonly"
          required
        />

        <!-- 🔗 Slug -->
        <WrapperInput
          v-model="form.slug"
          label="Slug (URL)"
          placeholder="ex: nouvelle-etude-bpc157"
          :readonly="readonly"
        />

        <!-- 📝 Extrait -->
        <WrapperInput
          v-model="form.excerpt"
          label="Résumé court"
          placeholder="Ex : Une nouvelle recherche explore le potentiel du BPC-157..."
          :readonly="readonly"
        />

        <!-- 🧩 Contenu -->
        <WrapperFormElements label="Contenu complet">
          <textarea
            v-model="form.content"
            rows="6"
            class="custom-textarea"
            placeholder="Contenu complet de l’article..."
            :readonly="readonly"
          />
        </WrapperFormElements>

        <!-- 🖼️ Image principale -->
        <WrapperFormElements label="Image principale">
          <BasicInput
            readonly
            placeholder="Sélectionner une image..."
            icon-name="Upload"
            @click="!readonly && openFilePicker()"
            :value="selectedFile?.name || extractFileName(form.image) || ''"
          />

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-input"
            :disabled="readonly"
            @change="handleFileChange"
          />

          <div
            v-if="imagePreview"
            class="image-preview"
          >
            <img
              :src="imagePreview"
              alt="Aperçu image actualité"
            />

            <BasicButton
              v-if="!readonly"
              label="Supprimer"
              type="secondary"
              variant="outlined"
              size="small"
              @click="removeImage"
            />
          </div>
        </WrapperFormElements>

        <!-- 🚀 Bouton action -->
        <BasicButton
          v-if="!readonly"
          :label="isEditMode ? 'Mettre à jour' : 'Publier l’actualité'"
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
  import { supabase } from '@/supabase/supabaseClient'
  import type { TablesInsert } from '@/supabase/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{
    newsId?: string | null
    readonly?: boolean
  }>()
  const emit = defineEmits(['saved'])
  const toast = useToastStore()

  /* État */
  const loading = ref(false)
  const uploadLoading = ref(false)
  const imagePreview = ref<string | null>(null)
  const selectedFile = ref<File | null>(null)
  const fileInputRef = ref<HTMLInputElement | null>(null)
  const oldImagePath = ref<string | null>(null)

  const form = ref<TablesInsert<'news'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: null,
    published_at: new Date().toISOString(),
    author_id: null,
  })

  const isEditMode = computed(() => !!props.newsId)
  const readonly = computed(() => !!props.readonly)
  const headerTitle = computed(() =>
    readonly.value
      ? 'Détails de l’actualité'
      : isEditMode.value
        ? 'Modifier une actualité'
        : 'Publier une actualité',
  )

  /* 🖱️ Sélecteur fichier */
  function openFilePicker() {
    if (!readonly.value) fileInputRef.value?.click()
  }

  /* 📤 Sélection fichier */
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

  /* 🔎 Extraire nom fichier */
  function extractFileName(url: string | null | undefined): string | null {
    if (!url) return null
    const parts = url.split('/')
    return parts[parts.length - 1] ?? null
  }

  /* 🧾 Charger actualité existante */
  async function loadNews() {
    if (!props.newsId) return
    const { data, error } = await supabase.from('news').select('*').eq('id', props.newsId).single()

    if (error) return toast.show('Erreur chargement actualité', 'danger')
    form.value = data
    imagePreview.value = data.image || null
    if (data.image) oldImagePath.value = data.image.split('/news-images/')[1] ?? null
  }

  /* ☁️ Upload image */
  async function uploadImage(): Promise<string | null> {
    if (!selectedFile.value || !form.value.slug) return null
    uploadLoading.value = true
    try {
      const folderPath = `news/${form.value.slug}`
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `news-${form.value.slug}.${fileExt}`
      const fullPath = `${folderPath}/${fileName}`

      if (oldImagePath.value) {
        await supabase.storage.from('news-images').remove([oldImagePath.value])
      }

      const { error } = await supabase.storage
        .from('news-images')
        .upload(fullPath, selectedFile.value, { cacheControl: '3600', upsert: true })

      if (error) throw error

      const { data: publicUrlData } = supabase.storage.from('news-images').getPublicUrl(fullPath)
      oldImagePath.value = fullPath
      return publicUrlData.publicUrl
    } catch (err: any) {
      toast.show(`Erreur upload : ${(err as Error).message}`, 'danger')
      return null
    } finally {
      uploadLoading.value = false
    }
  }

  /* ❌ Supprimer image */
  async function removeImage() {
    if (readonly.value) return
    try {
      if (form.value.image) {
        const path = form.value.image.split('/news-images/')[1]
        if (path) {
          await supabase.storage.from('news-images').remove([path])
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

  /* 💾 Enregistrement */
  async function handleSubmit() {
    if (!form.value.title || !form.value.slug) {
      toast.show('Titre et slug obligatoires', 'warning')
      return
    }

    loading.value = true
    try {
      if (selectedFile.value) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) form.value.image = uploadedUrl
      }

      let error
      if (isEditMode.value && props.newsId) {
        ;({ error } = await supabase.from('news').update(form.value).eq('id', props.newsId))
      } else {
        ;({ error } = await supabase.from('news').insert(form.value))
      }

      if (error) throw error
      toast.show(isEditMode.value ? 'Actualité mise à jour ✅' : 'Actualité publiée ✅', 'success')
      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadNews)
  watch(() => props.newsId, loadNews)
</script>

<style scoped lang="less">
  .news-form {
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

  .hidden-input {
    display: none;
  }
</style>
