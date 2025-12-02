<template>
  <ModalComponent
    v-model="visible"
    closable
  >
    <template #header>
      {{ headerTitle }}
    </template>
    <template #content>
      <div class="news-form">
        <WrapperInput
          v-model="form.title as InputModel"
          label="Titre"
          placeholder="Ex : Nouvelle étude sur le BPC-157"
          :readonly="readonly"
          required
        />
        <WrapperInput
          v-model="form.slug"
          label="Slug (URL)"
          placeholder="ex: nouvelle-etude-bpc157"
          :readonly="readonly"
        />
        <WrapperInput
          v-model="form.excerpt"
          label="Résumé court"
          placeholder="Ex : Une nouvelle recherche explore le potentiel du BPC-157..."
          :readonly="readonly"
        />
        <WrapperFormElements label="Contenu complet">
          <textarea
            v-model="form.content"
            rows="6"
            class="custom-textarea"
            placeholder="Contenu complet de l’article..."
            :readonly="readonly"
          />
        </WrapperFormElements>
        <WrapperDropdown
          v-model="form.topic_id!"
          :items="topicsOptions"
          placeholder="Choisir un topic existant"
          label="Catégorie (topic)"
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
            v-if="imagePreview || form.image"
            class="image-preview"
          >
            <img
              :src="imagePreview || form.image || undefined"
              alt="Aperçu image actualité"
            />
            <div
              class="image-actions"
              v-if="!readonly"
            >
              <BasicButton
                label="Supprimer l’image"
                type="secondary"
                variant="outlined"
                size="small"
                @click="handleRemoveImage"
              />
              <BasicButton
                label="Changer d’image"
                type="primary"
                variant="ghost"
                size="small"
                @click="openFilePicker"
              />
            </div>
          </div>
        </WrapperFormElements>
      </div>
    </template>
    <template #actions>
      <BasicButton
        v-if="!readonly"
        :label="isEditMode ? 'Mettre à jour' : 'Publier l’actualité'"
        type="primary"
        :disabled="loading"
        @click="handleSubmit"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { createNews, createTopic, fetchNewsById, fetchTopics, updateNews } from '@/api/supabase'
  import type { TablesInsert } from '@/supabase/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { InputModel } from '@designSystem/index'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useNewsImageHandler } from '../composables/useNewsImageHandler'

  const visible = defineModel<boolean>()
  const props = defineProps<{ newsId?: string | null; readonly?: boolean }>()
  const emit = defineEmits(['saved'])
  const toast = useToastStore()

  const loading = ref(false)
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

  const {
    fileInputRef,
    selectedFile,
    imagePreview,
    openFilePicker,
    handleFileChange,
    extractFileName,
    uploadImage,
    removeImage,
    reset: resetImageHandler,
  } = useNewsImageHandler(() => readonly.value)

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

  async function handleRemoveImage() {
    if (!form.value.image) return
    if (!confirm('Supprimer cette image définitivement ?')) return

    try {
      await removeImage(form.value.image)
      form.value.image = null
      imagePreview.value = null
      selectedFile.value = null
      toast.show('Image supprimée ✅', 'success')
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  async function loadNews() {
    if (!props.newsId) return
    try {
      const data = await fetchNewsById(props.newsId)
      if (!data) return toast.show('Actualité introuvable', 'warning')

      form.value = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        topic_id: data.topic_id,
        published_at: data.published_at,
        author_id: data.author_id,
      }

      imagePreview.value = data.image || null
    } catch (err) {
      toast.show('Erreur chargement actualité', 'danger')
    }
  }

  async function handleSubmit() {
    if (!form.value.title || !form.value.slug) {
      toast.show('Titre et slug obligatoires', 'warning')
      return
    }

    loading.value = true
    try {
      if (!form.value.topic_id && newTopicLabel.value) {
        const topicId = await createTopicIfNeeded()
        if (topicId) form.value.topic_id = topicId
      }

      if (selectedFile.value) {
        const uploadedUrl = await uploadImage(form.value.title)
        if (uploadedUrl) form.value.image = uploadedUrl
      }

      const payload = { ...form.value }
      delete (payload as any).topic

      if (isEditMode.value && props.newsId) {
        await updateNews(props.newsId, payload)
        toast.show('Actualité mise à jour ✅', 'success')
      } else {
        await createNews(payload)
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

  onMounted(async () => {
    await loadTopics()
    await loadNews()
  })

  watch(() => props.newsId, loadNews)

  watch(visible, (val) => {
    if (!val) {
      form.value = {
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: null,
        published_at: new Date().toISOString(),
        author_id: null,
        topic_id: '',
      }
      resetImageHandler()
      newTopicLabel.value = ''
    }
  })
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
    border: 1px solid @neutral-300;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
    width: 100%;
    resize: vertical;

    &:read-only {
      background: @neutral-50;
      color: @neutral-600;
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
    background-color: @white;
    border: 1px solid @neutral-200;

    img {
      max-width: 280px;
      width: 100%;
      height: auto;
      border-radius: 10px;
      object-fit: contain;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
      }
    }
  }

  .hidden-input {
    display: none;
  }
</style>
