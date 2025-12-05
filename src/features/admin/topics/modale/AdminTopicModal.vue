<template>
  <ModalComponent
    v-model="visible"
    :closable="true"
  >
    <!-- 🧠 En-tête -->
    <template #header>
      {{ headerTitle }}
    </template>

    <!-- 🧱 Contenu -->
    <template #content>
      <div class="topic-form">
        <!-- 🏷️ Nom -->
        <WrapperInput
          v-model="form.label"
          label="Nom du topic"
          placeholder="Ex : Santé publique"
          required
        />

        <!-- 🖼️ Image -->
        <WrapperFormElements label="Image du topic (optionnelle)">
          <BasicInput
            readonly
            placeholder="Sélectionner une image..."
            icon-name="Upload"
            @click="openFilePicker"
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
            v-if="imagePreview || form.image"
            class="image-preview"
          >
            <img
              :src="imagePreview || form.image || undefined"
              alt="Aperçu du topic"
            />
            <div class="image-actions">
              <PremiumButton
                v-if="form.image"
                label="Supprimer l'image"
                type="secondary"
                size="sm"
                variant="outline"
                @click="handleRemoveImage"
              />
              <PremiumButton
                label="Changer d'image"
                type="primary"
                size="sm"
                variant="ghost"
                @click="openFilePicker"
              />
            </div>
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
                v-model="labelFr"
                label="Nom du topic (FR)"
                placeholder="Ex: Santé publique"
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
                v-model="labelEn"
                label="Topic name (EN)"
                placeholder="Ex: Public Health"
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

    <!-- 🧭 Actions -->
    <template #actions>
      <div class="justify-content-space-evenly flex">
        <PremiumButton
          label="Enregistrer"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
  import { useTopicImageHandler } from '@/features/admin/topics/composables/useTopicImageHandler'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { createTopic, fetchTopicById, updateTopic } from '@/api/supabase/topics'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import WrapperFormElements from '@designSystem/components/wrapper/formElements/WrapperFormElements.vue'
  import WrapperInput from '@designSystem/components/wrapper/input/WrapperInput.vue'
  import { computed, onMounted, ref } from 'vue'

  const visible = defineModel<boolean>()
  const props = defineProps<{ topicId?: string | null }>()
  const emit = defineEmits<{ (e: 'saved'): void }>()

  interface TopicForm {
    label: string
    image: string | null
    label_i18n: Record<string, string>
    description_i18n: Record<string, string>
  }

  const toast = useToastStore()
  const loading = ref(false)

  const form = ref<TopicForm>({
    label: '',
    image: null,
    label_i18n: {},
    description_i18n: {},
  })

  // État pour les traductions
  const showTranslations = ref(false)
  const labelEn = ref('')
  const labelFr = ref('')
  const descriptionEn = ref('')
  const descriptionFr = ref('')

  // 🧩 Gestion d'image via le composable
  const {
    fileInputRef,
    selectedFile,
    imagePreview,
    openFilePicker,
    handleFileChange,
    extractFileName,
    uploadImage,
    removeImage,
  } = useTopicImageHandler(() => false)

  const headerTitle = computed(() => (props.topicId ? 'Modifier un topic' : 'Créer un topic'))

  async function handleSubmit() {
    if (!form.value.label.trim()) {
      toast.show('Le nom du topic est obligatoire', 'warning')
      return
    }

    loading.value = true
    try {
      let uploadedUrl: string | null = null

      // 🔹 Upload avec suppression de l'ancienne image + timestamp unique
      if (selectedFile.value) {
        uploadedUrl = await uploadImage(form.value.label, form.value.image ?? undefined)
        form.value.image = uploadedUrl
        imagePreview.value = uploadedUrl
      }

      // Construction des objets i18n
      const labelI18n: Record<string, string> = {}
      const descriptionI18n: Record<string, string> = {}

      if (labelFr.value) labelI18n.fr = labelFr.value
      if (labelEn.value) labelI18n.en = labelEn.value
      if (descriptionFr.value) descriptionI18n.fr = descriptionFr.value
      if (descriptionEn.value) descriptionI18n.en = descriptionEn.value

      // 🔹 Création ou mise à jour
      if (props.topicId) {
        // ✅ Mise à jour du topic avec la nouvelle image et traductions
        const updated = await updateTopic(props.topicId, {
          label: form.value.label,
          image: uploadedUrl ?? form.value.image ?? null,
          label_i18n: labelI18n,
          description_i18n: descriptionI18n,
        })

        // 🔁 Rafraîchir localement l'image avec cache-bust
        if (updated?.image) {
          form.value.image = `${updated.image}?v=${Date.now()}`
          imagePreview.value = form.value.image
        }

        toast.show('Topic mis à jour ✅', 'success')
      } else {
        // Ajout des traductions i18n au payload de création
        await createTopic({
          ...form.value,
          label_i18n: labelI18n,
          description_i18n: descriptionI18n,
        })
        toast.show('Topic créé ✅', 'success')
      }

      // ✅ Fermeture & rafraîchissement
      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    } finally {
      loading.value = false
    }
  }

  // 🗑️ Suppression manuelle de l’image
  async function handleRemoveImage() {
    if (!form.value.image) return
    if (!confirm('Supprimer cette image définitivement ?')) return

    try {
      await removeImage(form.value.image)

      // ✅ MAJ côté front
      form.value.image = null
      imagePreview.value = null
      selectedFile.value = null

      // ✅ MAJ côté base Supabase
      if (props.topicId) {
        await updateTopic(props.topicId, { image: null })
      }

      toast.show('Image supprimée ✅', 'success')

      // 🧭 Fermeture de la modale + rafraîchissement parent
      emit('saved')
      visible.value = false
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  // 📦 Chargement du topic existant
  onMounted(async () => {
    if (props.topicId) {
      const data = await fetchTopicById(props.topicId)
      if (data) {
        // Extraction des traductions i18n
        const labelI18n = (data.label_i18n as Record<string, string>) || {}
        const descI18n = (data.description_i18n as Record<string, string>) || {}

        form.value.label = data.label
        form.value.image = data.image
        form.value.label_i18n = labelI18n
        form.value.description_i18n = descI18n

        labelFr.value = labelI18n?.fr || ''
        labelEn.value = labelI18n?.en || ''
        descriptionFr.value = descI18n?.fr || ''
        descriptionEn.value = descI18n?.en || ''
      }
    }
  })
</script>

<style scoped lang="less">
  .topic-form {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 16px;
    overflow-x: hidden;
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
      max-width: 280px;
      max-height: 220px;
      object-fit: contain;
      border-radius: 12px;
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
    }

    .image-actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
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

  // Animation d'entrée
  .topic-form > * {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.15s; }
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

  // Responsive
  .respond-mobile({
    .topic-form {
      gap: 20px;
      padding: 4px;
    }

    .image-preview img {
      max-width: 220px;
      max-height: 180px;
    }
  });
</style>
