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
              <PremiumButton
                label="Supprimer l'image"
                type="secondary"
                variant="outline"
                size="sm"
                @click="handleRemoveImage"
              />
              <PremiumButton
                label="Changer d'image"
                type="primary"
                variant="ghost"
                size="sm"
                @click="openFilePicker"
              />
            </div>
          </div>
        </WrapperFormElements>

        <!-- Section Traductions (i18n) -->
        <div class="translations-section" v-if="!readonly">
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
                v-model="titleFr"
                label="Titre (FR)"
                placeholder="Ex: Nouvelle découverte sur le BPC-157"
              />
              <WrapperInput
                v-model="excerptFr"
                label="Résumé (FR)"
                placeholder="Résumé en français..."
              />
              <WrapperFormElements label="Contenu (FR)">
                <textarea
                  v-model="contentFr"
                  rows="4"
                  class="custom-textarea"
                  placeholder="Contenu complet en français..."
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
                v-model="titleEn"
                label="Title (EN)"
                placeholder="Ex: New discovery about BPC-157"
              />
              <WrapperInput
                v-model="excerptEn"
                label="Excerpt (EN)"
                placeholder="Summary in English..."
              />
              <WrapperFormElements label="Content (EN)">
                <textarea
                  v-model="contentEn"
                  rows="4"
                  class="custom-textarea"
                  placeholder="Full content in English..."
                />
              </WrapperFormElements>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <PremiumButton
        v-if="!readonly"
        :label="isEditMode ? 'Mettre à jour' : 'Publier l\'actualité'"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      />
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { createNews, createTopic, fetchNewsById, fetchTopics, updateNews } from '@/api/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import type { InputModel } from '@designSystem/index'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useNewsImageHandler } from '../composables/useNewsImageHandler'

  interface NewsForm {
    title: string
    slug: string
    excerpt: string | null
    content: string | null
    image: string | null
    published_at: string | null
    author_id: string | null
    topic_id: string | null
    title_i18n: Record<string, string>
    excerpt_i18n: Record<string, string>
    content_i18n: Record<string, string>
  }

  const visible = defineModel<boolean>()
  const props = defineProps<{ newsId?: string | null; readonly?: boolean }>()
  const emit = defineEmits(['saved'])
  const toast = useToastStore()

  const loading = ref(false)
  const topicsOptions = ref<{ id: string; label: string }[]>([])
  const newTopicLabel = ref('')

  const form = ref<NewsForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: null,
    published_at: new Date().toISOString(),
    author_id: null,
    topic_id: '',
    title_i18n: {},
    excerpt_i18n: {},
    content_i18n: {},
  })

  // État pour les traductions
  const showTranslations = ref(false)
  const titleEn = ref('')
  const titleFr = ref('')
  const excerptEn = ref('')
  const excerptFr = ref('')
  const contentEn = ref('')
  const contentFr = ref('')

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
        title_i18n: (data.title_i18n as Record<string, string>) || {},
        excerpt_i18n: (data.excerpt_i18n as Record<string, string>) || {},
        content_i18n: (data.content_i18n as Record<string, string>) || {},
      }

      imagePreview.value = data.image || null

      // Extraction des traductions i18n
      const titleI18n = data.title_i18n as Record<string, string> | null
      const excerptI18n = data.excerpt_i18n as Record<string, string> | null
      const contentI18n = data.content_i18n as Record<string, string> | null

      titleFr.value = titleI18n?.fr || ''
      titleEn.value = titleI18n?.en || ''
      excerptFr.value = excerptI18n?.fr || ''
      excerptEn.value = excerptI18n?.en || ''
      contentFr.value = contentI18n?.fr || ''
      contentEn.value = contentI18n?.en || ''
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

      // Construction des objets i18n
      const titleI18n: Record<string, string> = {}
      const excerptI18n: Record<string, string> = {}
      const contentI18n: Record<string, string> = {}

      if (titleFr.value) titleI18n.fr = titleFr.value
      if (titleEn.value) titleI18n.en = titleEn.value
      if (excerptFr.value) excerptI18n.fr = excerptFr.value
      if (excerptEn.value) excerptI18n.en = excerptEn.value
      if (contentFr.value) contentI18n.fr = contentFr.value
      if (contentEn.value) contentI18n.en = contentEn.value

      const payload = { ...form.value }
      delete (payload as any).topic

      // Ajout des traductions i18n au payload
      payload.title_i18n = titleI18n
      payload.excerpt_i18n = excerptI18n
      payload.content_i18n = contentI18n

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
        title_i18n: {},
        excerpt_i18n: {},
        content_i18n: {},
      }
      resetImageHandler()
      newTopicLabel.value = ''
      // Reset i18n fields
      titleFr.value = ''
      titleEn.value = ''
      excerptFr.value = ''
      excerptEn.value = ''
      contentFr.value = ''
      contentEn.value = ''
    }
  })
</script>
<style scoped lang="less">
  .news-form {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 16px;
    overflow-x: hidden;
  }

  .custom-textarea {
    border: 2px solid @neutral-200;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 14px;
    width: 100%;
    resize: vertical;
    min-height: 120px;
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

    &:read-only {
      background: @neutral-50;
      color: @neutral-600;
      cursor: not-allowed;
    }

    &::placeholder {
      color: @neutral-400;
    }
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
      max-width: 320px;
      max-height: 220px;
      width: 100%;
      height: auto;
      border-radius: 12px;
      object-fit: contain;
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;

      &:hover {
        box-shadow:
          0 12px 32px rgba(0, 0, 0, 0.15),
          0 4px 8px rgba(0, 0, 0, 0.1);
      }

      &-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        z-index: 1;
        position: relative;

        button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          &:active {
            opacity: 0.9;
          }
        }
      }
    }
  }

  .hidden-input {
    display: none;
  }

  // Animation d'entrée
  .news-form > * {
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

      .respond-mobile({
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 16px;
      });
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

  // Responsive
  .respond-mobile({
    .news-form {
      gap: 20px;
      padding: 4px;
    }

    .custom-textarea {
      min-height: 100px;
      padding: 12px;
    }

    .image-preview img {
      max-width: 240px;
      max-height: 180px;
    }
  });
</style>
