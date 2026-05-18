<script setup lang="ts">
import { type NewsItem, categoryLabels } from '@/data/news'

defineProps<{
  item: NewsItem
  horizontal?: boolean
}>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <router-link
    :to="{ name: 'news-detail', params: { id: item.id } }"
    class="news-card"
    :class="{ 'news-card--horizontal': horizontal }"
  >
    <div class="news-card__accent" :class="`news-card__accent--${item.category}`"></div>
    <div class="news-card__body">
      <span class="badge" :class="`badge--${item.category}`">
        {{ categoryLabels[item.category] }}
      </span>
      <h3 class="news-card__title">{{ item.title }}</h3>
      <p class="news-card__excerpt">{{ item.excerpt }}</p>
      <time class="news-card__date">{{ formatDate(item.date) }}</time>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.news-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: $radius-lg;
  border: 1px solid $border;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: 0 4px 20px rgba($navy, .1);
    transform: translateY(-2px);
  }

  &--horizontal {
    flex-direction: row;

    .news-card__accent {
      width: 4px;
      height: auto;
    }

    .news-card__body {
      padding: 14px 16px;
    }
  }
}

.news-card__accent {
  height: 4px;
  flex-shrink: 0;

  &--events   { background: $cat-events; }
  &--announce { background: $cat-announce; }
  &--sport    { background: $cat-sport; }
  &--olympiad { background: $cat-olympiad; }
  &--other    { background: $cat-other; }
}

.news-card__body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.news-card__title {
  font-size: 15px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
  transition: color $transition-fast;

  .news-card:hover & { color: $navy; }
}

.news-card__excerpt {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.55;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__date {
  font-size: 12px;
  color: $text-muted;
  margin-top: 4px;
}
</style>
