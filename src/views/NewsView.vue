<script setup lang="ts">
import { ref, computed } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { news, categoryLabels, type NewsItem } from '@/data/news'

type Category = NewsItem['category'] | 'all'

const activeCategory = ref<Category>('all')

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'Все' },
  ...Object.entries(categoryLabels).map(([key, label]) => ({
    key: key as Category,
    label,
  })),
]

const filtered = computed(() =>
  activeCategory.value === 'all'
    ? news
    : news.filter(n => n.category === activeCategory.value)
)
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Новости</h1>
      <p class="page-subtitle">Актуальные события школьной жизни</p>

      <div class="filters" role="group" aria-label="Фильтр по категории">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="filter-btn"
          :class="{ 'filter-btn--active': activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
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
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }
  }
}

.filter-btn {
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 400;
  border: 1px solid $border;
  background: $white;
  color: $text-secondary;
  cursor: pointer;
  white-space: nowrap;
  transition: all $transition-fast;

  &:hover { border-color: $navy; color: $navy; }

  &--active {
    background: $navy;
    border-color: $navy;
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
