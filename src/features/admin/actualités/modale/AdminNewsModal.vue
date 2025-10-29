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
          v-model="form.title as InputModel"
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

        <!-- 🧭 Catégorie (topic) -->
        <WrapperFormElements label="Catégorie (topic)">
          <WrapperDropdown
            v-model="form.topic_id!"
            :items="topicsOptions"
            placeholder="Choisir un topic existant"
            key-id="id"
            key-label="label"
            :disabled="readonly"
          />
          <WrapperInput
            v-if="!readonly"
            v-model="newTopicLabel"
            label="Ou créer un nouveau topic"
            placeholder="Ex : Innovation médicale"
            hint="Ce champ est optionnel — il créera un nouveau topic s’il n’existe pas encore."
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
  import type { TablesInsert } from '@/supabase/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { InputModel } from '@designSystem/index'
  import { computed, onMounted, ref, watch } from 'vue'
  import { createNews, fetchNewsById, updateNews, uploadNewsImage } from '../api'
  import { deleteTopicImage } from '../api/topicImages'
  import { createTopic, fetchTopics } from '../api/topics'

  /* 💾 Props / Events */
  const visible = defineModel<boolean>()
  const props = defineProps<{ newsId?: string | null; readonly?: boolean }>()
  const emit = defineEmits(['saved'])
  const toast = useToastStore()

  /* 🧱 State */
  const loading = ref(false)
  const imagePreview = ref<string | null>(null)
  const selectedFile = ref<File | null>(null)
  const fileInputRef = ref<HTMLInputElement | null>(null)
  const topicsOptions = ref<{ id: string; label: string }[]>([])
  const newTopicLabel = ref('')

  const form = ref<TablesInsert<'news'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: null,
    published_at: new Date().toISOString(),
    author_id: null,
    topic_id: '',
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

  /* 📂 Topics */
  async function loadTopics() {
    const topics = await fetchTopics()
    topicsOptions.value = topics.map((t) => ({ id: t.id, label: t.label }))
  }

  async function createTopicIfNeeded(): Promise<string | null> {
    if (!newTopicLabel.value.trim()) return null
    try {
      const topic = await createTopic({ label: newTopicLabel.value })
      await loadTopics()
      toast.show(`Topic "${topic.label}" créé ✅`, 'success')
      newTopicLabel.value = ''
      return topic.id
    } catch (err: any) {
      toast.show(`Erreur création topic : ${(err as Error).message}`, 'danger')
      return null
    }
  }

  /* 📤 Image Upload */
  function openFilePicker() {
    if (!readonly.value) fileInputRef.value?.click()
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

  async function removeImage() {
    if (readonly.value || !form.value.image) return
    try {
      await deleteTopicImage(form.value.image)
      form.value.image = null
      imagePreview.value = null
      toast.show('Image supprimée du serveur 🗑️', 'info')
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  /* 🧾 Chargement d’un article existant */
  async function loadNews() {
    if (!props.newsId) return
    try {
      const data = await fetchNewsById(props.newsId)
      if (!data) return toast.show('Actualité introuvable', 'warning')
      if (data.topic_id) {
        form.value.topic_id = data.topic_id
      }
      form.value = data
      console.log(form)
      imagePreview.value = data.image || null
    } catch {
      toast.show('Erreur chargement actualité', 'danger')
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
      // 🔹 Création du topic si besoin
      if (!form.value.topic_id && newTopicLabel.value) {
        const topicId = await createTopicIfNeeded()
        if (topicId) form.value.topic_id = topicId
      }

      // 🔹 Upload de l’image si sélectionnée
      if (selectedFile.value) {
        const uploadedUrl = await uploadNewsImage(form.value.slug, selectedFile.value)
        form.value.image = uploadedUrl
      }

      // 🔹 Enregistrement (create / update)
      if (isEditMode.value && props.newsId) {
        await updateNews(props.newsId, form.value)
        toast.show('Actualité mise à jour ✅', 'success')
      } else {
        await createNews(form.value)
        toast.show('Actualité publiée ✅', 'success')
      }

      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    } finally {
      loading.value = false
    }
  }

  /* 🔁 Init */
  onMounted(async () => {
    await loadTopics()
    await loadNews()
  })
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
