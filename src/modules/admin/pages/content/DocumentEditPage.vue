<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  documentCategoryLabels,
  type DocumentCategory,
  type DocumentItem,
  type DocumentStatus,
} from '@/data/documents'
import {
  createSchoolDocumentDraft,
  documentStatusLabels,
  getSchoolDocumentItem,
  saveSchoolDocument,
} from '@/modules/admin/state/school-documents'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const documentId = computed(() => Number(route.params.id))
const isCreateMode = computed(() => route.name === 'admin-school-content-documents-create')

const form = reactive<DocumentItem>(createSchoolDocumentDraft(''))
const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')

function syncForm() {
  const source = isCreateMode.value
    ? createSchoolDocumentDraft(schoolSlug.value)
    : getSchoolDocumentItem(schoolSlug.value, documentId.value)

  const item = source ?? createSchoolDocumentDraft(schoolSlug.value)

  form.id = item.id
  form.schoolSlug = item.schoolSlug
  form.title = item.title
  form.category = item.category
  form.description = item.description
  form.date = item.date
  form.size = item.size
  form.url = item.url
  form.status = item.status
  form.updatedAt = item.updatedAt
}

watch(
  () => [route.name, route.params.id, schoolSlug.value],
  () => {
    syncForm()
    statusMessage.value = ''
  },
  { immediate: true },
)

const validationErrors = computed(() => {
  const errors: string[] = []

  if (!form.title.trim()) errors.push('Укажите название документа.')
  if (!form.description.trim()) errors.push('Добавьте краткое описание документа.')
  if (!form.size.trim()) errors.push('Укажите размер файла или документа.')
  if (!form.url.trim()) errors.push('Укажите ссылку на документ.')

  return errors
})

function saveWithStatus(status: DocumentStatus) {
  if (validationErrors.value.length) {
    statusTone.value = 'error'
    statusMessage.value = validationErrors.value[0]
    return
  }

  const payload: DocumentItem = {
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    size: form.size.trim(),
    url: form.url.trim(),
    status,
    updatedAt: new Date().toISOString(),
  }

  saveSchoolDocument(payload)
  form.status = status
  form.updatedAt = payload.updatedAt
  statusTone.value = 'success'
  statusMessage.value =
    status === 'published'
      ? 'Документ опубликован.'
      : 'Черновик документа сохранен.'

  if (isCreateMode.value) {
    router.replace({
      name: 'admin-school-content-documents-edit',
      params: { slug: schoolSlug.value, id: payload.id },
    })
  }
}

async function goBack() {
  await router.push({
    name: 'admin-school-content-documents-list',
    params: { slug: schoolSlug.value },
  })
}
</script>

<template>
  <section class="document-edit-page">
    <div class="document-edit-page__header">
      <div>
        <h1>{{ isCreateMode ? 'Новый документ' : 'Редактирование документа' }}</h1>
        <p>Название, категория, описание, ссылка, размер файла и статус публикации.</p>
      </div>

      <div class="document-edit-page__actions">
        <button class="btn btn--outline" @click="goBack">К списку</button>
        <button class="btn btn--outline" @click="saveWithStatus('draft')">Сохранить черновик</button>
        <button class="btn btn--primary" @click="saveWithStatus('published')">Опубликовать</button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="document-edit-page__status"
      :class="`document-edit-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="document-edit-page__grid">
      <section class="document-card">
        <div class="form-grid">
          <label class="field field--full">
            <span>Название документа</span>
            <input v-model="form.title" type="text" />
          </label>

          <label class="field">
            <span>Категория</span>
            <select v-model="form.category">
              <option
                v-for="(label, key) in documentCategoryLabels"
                :key="key"
                :value="key as DocumentCategory"
              >
                {{ label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Дата</span>
            <input v-model="form.date" type="date" />
          </label>

          <label class="field">
            <span>Размер файла</span>
            <input v-model="form.size" type="text" placeholder="Например, 820 КБ" />
          </label>

          <label class="field">
            <span>Ссылка</span>
            <input v-model="form.url" type="text" placeholder="Например, /docs/charter.pdf или #" />
          </label>

          <label class="field field--full">
            <span>Описание</span>
            <textarea v-model="form.description" rows="6"></textarea>
          </label>
        </div>

        <ul v-if="validationErrors.length" class="validation-list">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </section>

      <aside class="document-side">
        <section class="document-card">
          <h2>Состояние</h2>
          <dl class="summary-list">
            <div>
              <dt>ID</dt>
              <dd>{{ form.id }}</dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>{{ documentStatusLabels[form.status] }}</dd>
            </div>
            <div>
              <dt>Категория</dt>
              <dd>{{ documentCategoryLabels[form.category] }}</dd>
            </div>
            <div>
              <dt>Обновлено</dt>
              <dd>{{ new Date(form.updatedAt).toLocaleString('ru-RU') }}</dd>
            </div>
          </dl>
        </section>

        <section class="document-card">
          <h2>Предпросмотр</h2>
          <div class="preview">
            <span class="badge badge--neutral">
              {{ documentCategoryLabels[form.category] }}
            </span>
            <h3>{{ form.title || 'Название документа' }}</h3>
            <p class="preview__description">
              {{ form.description || 'Краткое описание документа появится здесь.' }}
            </p>
            <dl class="preview__meta">
              <div>
                <dt>Дата</dt>
                <dd>{{ form.date || 'Не указана' }}</dd>
              </div>
              <div>
                <dt>Размер</dt>
                <dd>{{ form.size || 'Не указан' }}</dd>
              </div>
              <div>
                <dt>Ссылка</dt>
                <dd>{{ form.url || 'Не указана' }}</dd>
              </div>
            </dl>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.document-edit-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.document-edit-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.document-edit-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.document-edit-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }

  &--error {
    background: rgba(180, 35, 24, .10);
    color: #912018;
  }
}

.document-edit-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, .85fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.document-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.document-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.document-card h2 {
  font-size: 18px;
  color: $text-primary;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &--full {
    grid-column: 1 / -1;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    color: $text-primary;
  }

  input,
  textarea,
  select {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    color: $text-primary;
    background: $white;
  }
}

.validation-list {
  margin-top: 16px;
  display: grid;
  gap: 8px;
  padding-left: 18px;

  li {
    color: #912018;
    line-height: 1.5;
  }
}

.summary-list {
  margin-top: 14px;
  display: grid;
  gap: 10px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    border-top: 1px solid $border;
    padding-top: 10px;
  }

  dt {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: $text-secondary;
  }

  dd {
    margin: 0;
    color: $text-primary;
    font-weight: 500;
    text-align: right;
  }
}

.preview {
  margin-top: 14px;
}

.preview h3 {
  margin-top: 12px;
  font-size: 22px;
  line-height: 1.4;
  color: $navy;
}

.preview__description {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.preview__meta {
  margin-top: 16px;
  display: grid;
  gap: 10px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    border-top: 1px solid $border;
    padding-top: 10px;
  }

  dt {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: $text-secondary;
  }

  dd {
    margin: 0;
    text-align: right;
    color: $text-primary;
    line-height: 1.5;
  }
}

.badge--neutral {
  background: rgba($navy, .08);
  color: $navy;
}
</style>
