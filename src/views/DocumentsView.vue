<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  documentCategoryLabels,
  type DocumentCategory,
} from '@/data/documents'
import { useCurrentSchool } from '@/composables/useCurrentSchool'
import { getPublishedSchoolDocuments } from '@/modules/admin/state/school-documents'

const { school } = useCurrentSchool()
const activeCategory = ref<'all' | DocumentCategory>('all')

const schoolDocuments = computed(() => getPublishedSchoolDocuments(school.value.slug))
const categories = computed(() => [
  { key: 'all' as const, label: 'Все' },
  ...Object.entries(documentCategoryLabels).map(([key, label]) => ({
    key: key as DocumentCategory,
    label,
  })),
])

const filtered = computed(() =>
  activeCategory.value === 'all'
    ? schoolDocuments.value
    : schoolDocuments.value.filter((document) => document.category === activeCategory.value),
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Документы</h1>
      <p class="page-subtitle">Нормативные и локальные акты школы, доступные для скачивания</p>

      <div class="tabs" role="tablist">
        <button
          v-for="category in categories"
          :key="category.key"
          class="tab"
          :class="{ 'tab--active': activeCategory === category.key }"
          role="tab"
          :aria-selected="activeCategory === category.key"
          @click="activeCategory = category.key"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="doc-list">
        <div
          v-for="doc in filtered"
          :key="doc.id"
          class="doc-item"
        >
          <div class="doc-item__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="doc-item__body">
            <p class="doc-item__title">{{ doc.title }}</p>
            <p class="doc-item__description">{{ doc.description }}</p>
            <div class="doc-item__meta">
              <span class="doc-item__category">{{ documentCategoryLabels[doc.category] }}</span>
              <span class="doc-item__date">{{ formatDate(doc.date) }}</span>
              <span class="doc-item__size">{{ doc.size }}</span>
            </div>
          </div>
          <a :href="doc.url" class="doc-item__download" aria-label="Скачать документ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Скачать
          </a>
        </div>
        <div v-if="filtered.length === 0" class="empty-state">
          <p>В этой категории пока нет опубликованных документов.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 2px solid $border;
  padding-bottom: 0;

  @media (max-width: $mobile-breakpoint) {
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tab {
  padding: 9px 16px;
  font-size: 14px;
  color: $text-secondary;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  white-space: nowrap;
  transition: all $transition-fast;

  &:hover {
    color: $navy;
  }

  &--active {
    color: $navy;
    border-bottom-color: $gold;
    font-weight: 500;
  }
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 16px 18px;
  transition: box-shadow $transition-base;

  &:hover {
    box-shadow: 0 2px 12px rgba($navy, .07);
  }

  @media (max-width: $mobile-breakpoint) {
    flex-wrap: wrap;
  }
}

.doc-item__icon {
  width: 44px;
  height: 44px;
  background: rgba($navy, .07);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $navy;
  flex-shrink: 0;
}

.doc-item__body {
  flex: 1;
  min-width: 0;
}

.doc-item__title {
  font-size: 15px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 6px;
}

.doc-item__description {
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: 8px;
}

.doc-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.doc-item__category {
  font-size: 11px;
  background: $surface-2;
  color: $text-secondary;
  padding: 2px 8px;
  border-radius: 12px;
}

.doc-item__date,
.doc-item__size {
  font-size: 12px;
  color: $text-muted;
}

.doc-item__download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: $navy;
  border: 1px solid $navy;
  border-radius: $radius-md;
  text-decoration: none;
  white-space: nowrap;
  transition: all $transition-fast;
  flex-shrink: 0;

  &:hover {
    background: $navy;
    color: $white;
  }
}
</style>
