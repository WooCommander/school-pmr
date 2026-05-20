<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoryLabels } from '@/data/news'
import { getPublishedSchoolNewsItem } from '@/modules/admin/state/school-news'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const item = computed(() =>
  getPublishedSchoolNewsItem(schoolSlug.value, Number(route.params.id)),
)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="section">
    <div class="container">
      <button
        class="back-btn"
        @click="router.push({ name: 'school-news', params: { slug: route.params.slug } })"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Все новости
      </button>

      <div v-if="item" class="article">
        <span class="badge" :class="`badge--${item.category}`" style="margin-bottom:14px">
          {{ categoryLabels[item.category] }}
        </span>
        <h1 class="article__title">{{ item.title }}</h1>
        <time class="article__date">{{ formatDate(item.date) }}</time>
        <div class="article__divider"></div>
        <div class="article__body">
          <p v-for="(para, i) in item.content.split('\n').filter(Boolean)" :key="i">
            {{ para }}
          </p>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Новость не найдена.</p>
        <router-link
          :to="{ name: 'school-news', params: { slug: route.params.slug } }"
          class="btn btn--outline"
          style="margin-top:16px;display:inline-flex"
        >
          К списку новостей
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: $text-secondary;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 28px;
  transition: color $transition-fast;

  &:hover { color: $navy; }
}

.article {
  max-width: 720px;
}

.article__title {
  font-size: 28px;
  font-weight: 600;
  color: $navy;
  line-height: 1.3;
  margin-bottom: 12px;

  @media (max-width: $mobile-breakpoint) {
    font-size: 22px;
  }
}

.article__date {
  font-size: 13px;
  color: $text-muted;
}

.article__divider {
  height: 2px;
  background: $border;
  margin: 20px 0;
}

.article__body {
  p {
    font-size: 16px;
    color: $text-primary;
    line-height: 1.75;
    margin-bottom: 14px;

    &:last-child { margin-bottom: 0; }
  }
}
</style>
