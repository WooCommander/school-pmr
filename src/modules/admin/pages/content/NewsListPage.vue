<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoryLabels } from '@/data/news'
import {
  deleteSchoolNews,
  getSchoolNews,
  statusLabels,
  updateSchoolNewsStatus,
} from '@/modules/admin/state/school-news'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const search = ref('')
const statusFilter = ref<'all' | 'draft' | 'published'>('all')
const categoryFilter = ref<'all' | keyof typeof categoryLabels>('all')

const allNews = computed(() => getSchoolNews(schoolSlug.value))
const filteredNews = computed(() =>
  allNews.value.filter((item) => {
    const matchesSearch =
      !search.value ||
      item.title.toLowerCase().includes(search.value.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus =
      statusFilter.value === 'all' || item.status === statusFilter.value
    const matchesCategory =
      categoryFilter.value === 'all' || item.category === categoryFilter.value

    return matchesSearch && matchesStatus && matchesCategory
  }),
)

const publishedCount = computed(
  () => allNews.value.filter((item) => item.status === 'published').length,
)
const draftCount = computed(
  () => allNews.value.filter((item) => item.status === 'draft').length,
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
    name: 'admin-school-content-news-create',
    params: { slug: schoolSlug.value },
  })
}

async function openEdit(id: number) {
  await router.push({
    name: 'admin-school-content-news-edit',
    params: { slug: schoolSlug.value, id },
  })
}

function toggleStatus(id: number, currentStatus: 'draft' | 'published') {
  updateSchoolNewsStatus(id, currentStatus === 'published' ? 'draft' : 'published')
}

function removeNews(id: number) {
  deleteSchoolNews(id)
}
</script>

<template>
  <section class="news-list-page">
    <div class="news-list-page__header">
      <div>
        <h1>Новости</h1>
        <p>Список новостей школы с фильтрами, статусами и быстрыми действиями.</p>
      </div>

      <button class="btn btn--primary" @click="openCreate">Создать новость</button>
    </div>

    <div class="news-list-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ allNews.length }}</span>
        <span class="stat-card__label">Всего новостей</span>
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

    <section class="news-card">
      <div class="filters">
        <input v-model="search" type="search" placeholder="Поиск по заголовку или анонсу" />

        <select v-model="statusFilter">
          <option value="all">Все статусы</option>
          <option value="published">Опубликовано</option>
          <option value="draft">Черновик</option>
        </select>

        <select v-model="categoryFilter">
          <option value="all">Все категории</option>
          <option
            v-for="(label, key) in categoryLabels"
            :key="key"
            :value="key"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div v-if="filteredNews.length" class="news-table">
        <article v-for="item in filteredNews" :key="item.id" class="news-row">
          <div class="news-row__main">
            <div class="news-row__title">
              <h2>{{ item.title }}</h2>
              <span class="badge" :class="`badge--${item.category}`">
                {{ categoryLabels[item.category] }}
              </span>
            </div>
            <p>{{ item.excerpt }}</p>
            <div class="news-row__meta">
              <span>{{ formatDate(item.date) }}</span>
              <span>{{ item.author }}</span>
              <span>{{ statusLabels[item.status] }}</span>
            </div>
          </div>

          <div class="news-row__actions">
            <button class="btn btn--outline" @click="openEdit(item.id)">Редактировать</button>
            <button class="btn btn--outline" @click="toggleStatus(item.id, item.status)">
              {{ item.status === 'published' ? 'В черновик' : 'Опубликовать' }}
            </button>
            <button class="btn btn--danger" @click="removeNews(item.id)">Удалить</button>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <p>По текущим фильтрам новости не найдены.</p>
      </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.news-list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-list-page__header {
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

.news-list-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.stat-card,
.news-card {
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

.news-card {
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

.news-table {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-row {
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

.news-row__title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  h2 {
    font-size: 18px;
    color: $text-primary;
  }
}

.news-row__main p {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.news-row__meta {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.news-row__actions {
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
</style>
