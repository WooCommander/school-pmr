<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { documentCategoryLabels } from '@/data/documents'
import {
  deleteSchoolDocument,
  documentStatusLabels,
  getSchoolDocuments,
  updateSchoolDocumentStatus,
} from '@/modules/admin/state/school-documents'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const search = ref('')
const statusFilter = ref<'all' | 'draft' | 'published'>('all')
const categoryFilter = ref<'all' | keyof typeof documentCategoryLabels>('all')

const allDocuments = computed(() => getSchoolDocuments(schoolSlug.value))
const filteredDocuments = computed(() =>
  allDocuments.value.filter((item) => {
    const query = search.value.trim().toLowerCase()
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    const matchesStatus =
      statusFilter.value === 'all' || item.status === statusFilter.value
    const matchesCategory =
      categoryFilter.value === 'all' || item.category === categoryFilter.value

    return matchesSearch && matchesStatus && matchesCategory
  }),
)

const publishedCount = computed(
  () => allDocuments.value.filter((item) => item.status === 'published').length,
)
const draftCount = computed(
  () => allDocuments.value.filter((item) => item.status === 'draft').length,
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function openCreate() {
  await router.push({
    name: 'admin-school-content-documents-create',
    params: { slug: schoolSlug.value },
  })
}

async function openEdit(id: number) {
  await router.push({
    name: 'admin-school-content-documents-edit',
    params: { slug: schoolSlug.value, id },
  })
}

function toggleStatus(id: number, currentStatus: 'draft' | 'published') {
  updateSchoolDocumentStatus(id, currentStatus === 'published' ? 'draft' : 'published')
}

function removeDocument(id: number) {
  deleteSchoolDocument(id)
}
</script>

<template>
  <section class="documents-list-page">
    <div class="documents-list-page__header">
      <div>
        <h1>Документы</h1>
        <p>Реестр документов школы с фильтрами, статусами публикации и быстрыми действиями.</p>
      </div>

      <button class="btn btn--primary" @click="openCreate">Добавить документ</button>
    </div>

    <div class="documents-list-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ allDocuments.length }}</span>
        <span class="stat-card__label">Всего документов</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ publishedCount }}</span>
        <span class="stat-card__label">Опубликовано</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ draftCount }}</span>
        <span class="stat-card__label">Черновиков</span>
      </article>
    </div>

    <section class="documents-card">
      <div class="filters">
        <input v-model="search" type="search" placeholder="Поиск по названию или описанию" />

        <select v-model="statusFilter">
          <option value="all">Все статусы</option>
          <option value="published">Опубликовано</option>
          <option value="draft">Черновик</option>
        </select>

        <select v-model="categoryFilter">
          <option value="all">Все категории</option>
          <option
            v-for="(label, key) in documentCategoryLabels"
            :key="key"
            :value="key"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div v-if="filteredDocuments.length" class="documents-table">
        <article v-for="item in filteredDocuments" :key="item.id" class="document-row">
          <div class="document-row__main">
            <div class="document-row__title">
              <h2>{{ item.title }}</h2>
              <span class="badge badge--neutral">
                {{ documentCategoryLabels[item.category] }}
              </span>
            </div>
            <p>{{ item.description }}</p>
            <div class="document-row__meta">
              <span>{{ formatDate(item.date) }}</span>
              <span>{{ item.size || 'Размер не указан' }}</span>
              <span>{{ documentStatusLabels[item.status] }}</span>
            </div>
          </div>

          <div class="document-row__actions">
            <button class="btn btn--outline" @click="openEdit(item.id)">Редактировать</button>
            <button class="btn btn--outline" @click="toggleStatus(item.id, item.status)">
              {{ item.status === 'published' ? 'В черновик' : 'Опубликовать' }}
            </button>
            <button class="btn btn--danger" @click="removeDocument(item.id)">Удалить</button>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <p>По текущим фильтрам документы не найдены.</p>
      </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.documents-list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.documents-list-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
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

.documents-list-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.stat-card,
.documents-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

.stat-card {
  padding: 18px 20px;
}

.stat-card__value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: $navy;
}

.stat-card__label {
  display: block;
  margin-top: 8px;
  color: $text-secondary;
}

.documents-card {
  padding: 20px;
}

.filters {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 220px 220px;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  input,
  select {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    background: $white;
    color: $text-primary;
  }
}

.documents-table {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.document-row__title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  h2 {
    font-size: 18px;
    color: $text-primary;
  }
}

.document-row__main p {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.document-row__meta {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.document-row__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.btn--danger {
  background: rgba(180, 35, 24, .10);
  color: #912018;
}

.badge--neutral {
  background: rgba($navy, .08);
  color: $navy;
}
</style>
