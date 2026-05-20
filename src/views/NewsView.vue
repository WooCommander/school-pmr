<script setup lang="ts">
import { computed, ref } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { categoryLabels, type NewsItem } from '@/data/news'
import { getPublishedSchoolNews } from '@/modules/admin/state/school-news'
import { useRoute } from 'vue-router'

type Category = NewsItem['category'] | 'all'

const route = useRoute()
const activeCategory = ref<Category>('all')

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const schoolNews = computed(() => getPublishedSchoolNews(schoolSlug.value))

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'Все' },
  ...Object.entries(categoryLabels).map(([key, label]) => ({
    key: key as Category,
    label,
  })),
]

const filtered = computed(() =>
  activeCategory.value === 'all'
    ? schoolNews.value
    : schoolNews.value.filter((item) => item.category === activeCategory.value),
)
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Новости</h1>
      <p class="page-subtitle">Актуальные события школьной жизни</p>

      <div class="filters" role="group" aria-label="Фильтр по категории">
        <button
          v-for="category in categories"
          :key="category.key"
          class="filter-btn"
          :class="{ 'filter-btn--active': activeCategory === category.key }"
          @click="activeCategory = category.key"
        >
          {{ category.label }}
        </button>
      </div>

      <Transition name="fade" mode="out-in">
        <div :key="activeCategory" class="news-grid">
          <NewsCard v-for="item in filtered" :key="item.id" :item="item" />
          <div v-if="filtered.length === 0" class="empty-state">
            <p>Новостей в этой категории пока нет.</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;

  @media (max-width: $mobile-breakpoint) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    width: calc(100% + 32px);
    margin-inline: -16px;
    padding: 0 16px 6px;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }
  }
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 400;
  border: 1px solid var(--school-card-border);
  background: $white;
  color: $text-secondary;
  cursor: pointer;
  white-space: nowrap;
  transition: all $transition-fast;

  &:hover {
    border-color: var(--school-primary);
    color: var(--school-primary);
  }

  &--active {
    background: var(--school-primary);
    border-color: var(--school-primary);
    color: $white;
    font-weight: 500;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: 1fr;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
