<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoryLabels, type NewsCategory, type NewsItem, type NewsStatus } from '@/data/news'
import {
  createSchoolNewsDraft,
  getSchoolNewsItem,
  saveSchoolNews,
  statusLabels,
} from '@/modules/admin/state/school-news'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const newsId = computed(() => Number(route.params.id))
const isCreateMode = computed(() => route.name === 'admin-school-content-news-create')

const form = reactive<NewsItem>(createSchoolNewsDraft(''))
const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function syncForm() {
  const source = isCreateMode.value
    ? createSchoolNewsDraft(schoolSlug.value)
    : getSchoolNewsItem(schoolSlug.value, newsId.value)

  const item = source ?? createSchoolNewsDraft(schoolSlug.value)

  form.id = item.id
  form.schoolSlug = item.schoolSlug
  form.title = item.title
  form.slug = item.slug
  form.excerpt = item.excerpt
  form.content = item.content
  form.category = item.category
  form.date = item.date
  form.status = item.status
  form.author = item.author
  form.updatedAt = item.updatedAt
  form.image = item.image
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

  if (!form.title.trim()) errors.push('Укажите заголовок новости.')
  if (!form.slug.trim()) errors.push('Укажите slug новости.')
  if (!form.excerpt.trim()) errors.push('Укажите анонс новости.')
  if (!form.content.trim()) errors.push('Укажите текст новости.')
  if (!form.author.trim()) errors.push('Укажите автора.')

  return errors
})

const previewParagraphs = computed(() =>
  form.content.split('\n').map((item) => item.trim()).filter(Boolean),
)

function saveWithStatus(status: NewsStatus) {
  if (validationErrors.value.length) {
    statusTone.value = 'error'
    statusMessage.value = validationErrors.value[0]
    return
  }

  const payload: NewsItem = {
    ...form,
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    author: form.author.trim(),
    status,
    updatedAt: new Date().toISOString(),
  }

  saveSchoolNews(payload)
  form.status = status
  form.updatedAt = payload.updatedAt
  statusTone.value = 'success'
  statusMessage.value =
    status === 'published' ? 'Новость опубликована.' : 'Черновик новости сохранён.'

  if (isCreateMode.value) {
    router.replace({
      name: 'admin-school-content-news-edit',
      params: { slug: schoolSlug.value, id: payload.id },
    })
  }
}

async function goBack() {
  await router.push({
    name: 'admin-school-content-news-list',
    params: { slug: schoolSlug.value },
  })
}

function regenerateSlug() {
  form.slug = slugify(form.title)
}
</script>

<template>
  <section class="news-edit-page">
    <div class="news-edit-page__header">
      <div>
        <h1>{{ isCreateMode ? 'Создание новости' : 'Редактирование новости' }}</h1>
        <p>Редактор заголовка, анонса, текста, категории и статуса публикации.</p>
      </div>

      <div class="news-edit-page__actions">
        <button class="btn btn--outline" @click="goBack">К списку</button>
        <button class="btn btn--outline" @click="saveWithStatus('draft')">Сохранить черновик</button>
        <button class="btn btn--primary" @click="saveWithStatus('published')">Опубликовать</button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="news-edit-page__status"
      :class="`news-edit-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="news-edit-page__grid">
      <section class="news-card">
        <div class="form-grid">
          <label class="field field--full">
            <span>Заголовок</span>
            <input v-model="form.title" type="text" @blur="!form.slug && regenerateSlug()" />
          </label>

          <label class="field">
            <span>Slug</span>
            <input v-model="form.slug" type="text" />
          </label>

          <div class="field field--action">
            <span>&nbsp;</span>
            <button class="btn btn--outline" @click="regenerateSlug">Сгенерировать slug</button>
          </div>

          <label class="field field--full">
            <span>Анонс</span>
            <textarea v-model="form.excerpt" rows="3"></textarea>
          </label>

          <label class="field">
            <span>Категория</span>
            <select v-model="form.category">
              <option
                v-for="(label, key) in categoryLabels"
                :key="key"
                :value="key as NewsCategory"
              >
                {{ label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Дата</span>
            <input v-model="form.date" type="date" />
          </label>

          <label class="field field--full">
            <span>Автор</span>
            <input v-model="form.author" type="text" />
          </label>

          <label class="field field--full">
            <span>Текст</span>
            <textarea v-model="form.content" rows="12"></textarea>
          </label>
        </div>

        <ul v-if="validationErrors.length" class="validation-list">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </section>

      <aside class="news-side">
        <section class="news-card">
          <h2>Состояние</h2>
          <dl class="summary-list">
            <div>
              <dt>ID</dt>
              <dd>{{ form.id }}</dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>{{ statusLabels[form.status] }}</dd>
            </div>
            <div>
              <dt>Категория</dt>
              <dd>{{ categoryLabels[form.category] }}</dd>
            </div>
            <div>
              <dt>Обновлено</dt>
              <dd>{{ new Date(form.updatedAt).toLocaleString('ru-RU') }}</dd>
            </div>
          </dl>
        </section>

        <section class="news-card">
          <h2>Предпросмотр</h2>
          <div class="preview">
            <span class="badge" :class="`badge--${form.category}`">
              {{ categoryLabels[form.category] }}
            </span>
            <h3>{{ form.title || 'Заголовок новости' }}</h3>
            <p class="preview__excerpt">{{ form.excerpt || 'Анонс новости появится здесь.' }}</p>
            <div class="preview__body">
              <p v-for="(paragraph, index) in previewParagraphs" :key="index">{{ paragraph }}</p>
              <p v-if="previewParagraphs.length === 0">Текст новости появится здесь.</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.news-edit-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-edit-page__header {
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

.news-edit-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.news-edit-page__status {
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

.news-edit-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, .85fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.news-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.news-card h2 {
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

.field--action {
  justify-content: flex-end;
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

.preview__excerpt {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.preview__body {
  margin-top: 16px;
  display: grid;
  gap: 10px;

  p {
    color: $text-primary;
    line-height: 1.7;
  }
}
</style>
