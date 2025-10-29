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
      <div class="justify-content-space-evenly flex">
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
  import { createNews, fetchNewsById, updateNews } from '../../api'
  import { createTopic, fetchTopics } from '../../api/topics'
  import { useNewsImageHandler } from '../composables/useNewsImageHandler'

  /* 💾 Props / Events */
  const visible = defineModel<boolean>()
  const props = defineProps<{ newsId?: string | null; readonly?: boolean }>()
  const emit = defineEmits(['saved'])
  const toast = useToastStore()

  /* 🧱 State */
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

  /* 📸 Image handler (upload/suppression) */
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

  /* 🧾 Chargement d’un article existant */
  async function loadNews() {
    if (!props.newsId) return
    try {
      const data = await fetchNewsById(props.newsId)
      if (!data) return toast.show('Actualité introuvable', 'warning')

      // 🔹 On ne garde que les champs existants dans la table "news"
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
        const uploadedUrl = await uploadImage(form.value.title)
        if (uploadedUrl) form.value.image = uploadedUrl
      }

      // 🧹 Nettoyage avant envoi à Supabase (évite le bug "topic" field)
      const payload = { ...form.value }
      delete (payload as any).topic

      // 🔹 Enregistrement (update / create)
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

  /* 🔁 Init */
  onMounted(async () => {
    await loadTopics()
    await loadNews()
  })

  watch(() => props.newsId, loadNews)

  /* 🧹 Reset complet quand on ferme la modal */
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
