<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolNavigationDraft,
  publishSchoolNavigationDraft,
  resetSchoolNavigationDraft,
  updateSchoolNavigationDraft,
  type SchoolNavigationItem,
} from '@/modules/admin/state/school-navigation'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const navigationDraft = computed(() => ensureSchoolNavigationDraft(schoolSlug.value))
const draftItems = computed(() =>
  navigationDraft.value.draftItems.slice().sort((a, b) => a.order - b.order),
)
const publishedItems = computed(() =>
  navigationDraft.value.publishedItems.slice().sort((a, b) => a.order - b.order),
)
const hasUnpublishedChanges = computed(
  () => JSON.stringify(draftItems.value) !== JSON.stringify(publishedItems.value),
)

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

function saveItems(items: SchoolNavigationItem[]) {
  updateSchoolNavigationDraft(schoolSlug.value, items)
}

function updateLabel(itemKey: string, value: string) {
  const nextItems = draftItems.value.map((item) =>
    item.key === itemKey ? { ...item, label: value } : item,
  )
  saveItems(nextItems)
}

function toggleVisibility(itemKey: string) {
  const nextItems = draftItems.value.map((item) =>
    item.key === itemKey ? { ...item, visible: !item.visible } : item,
  )
  saveItems(nextItems)
}

function moveItem(itemKey: string, direction: 'up' | 'down') {
  const nextItems = draftItems.value.slice()
  const currentIndex = nextItems.findIndex((item) => item.key === itemKey)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= nextItems.length) return

  const [movedItem] = nextItems.splice(currentIndex, 1)
  nextItems.splice(targetIndex, 0, movedItem)
  saveItems(nextItems.map((item, index) => ({ ...item, order: index })))
}

function resetDraft() {
  resetSchoolNavigationDraft(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик меню возвращён к опубликованной версии.'
}

function publishDraft() {
  publishSchoolNavigationDraft(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Меню школы опубликовано.'
}

function publishedLabel(itemKey: string) {
  return publishedItems.value.find((item) => item.key === itemKey)?.label ?? '—'
}

function publishedVisibility(itemKey: string) {
  return publishedItems.value.find((item) => item.key === itemKey)?.visible ?? true
}
</script>

<template>
  <section class="navigation-page">
    <div class="navigation-page__header">
      <div>
        <h1>Меню и навигация</h1>
        <p>
          Управляйте названием, видимостью и порядком разделов школьного сайта.
          Публичный layout уже читает опубликованную версию этих настроек.
        </p>
      </div>

      <div class="navigation-page__actions">
        <button class="btn btn--outline" :disabled="!hasUnpublishedChanges" @click="resetDraft">
          Сбросить черновик
        </button>
        <button class="btn btn--primary" :disabled="!hasUnpublishedChanges" @click="publishDraft">
          Опубликовать меню
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="navigation-page__status"
      :class="`navigation-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="navigation-page__grid">
      <div class="navigation-page__main">
        <section class="navigation-card">
          <div class="navigation-card__header">
            <h2>Черновик меню</h2>
            <p>Порядок и видимость разделов для следующей публикации.</p>
          </div>

          <div class="navigation-list">
            <article
              v-for="(item, index) in draftItems"
              :key="item.key"
              class="navigation-item"
            >
              <div class="navigation-item__order">
                <span>{{ index + 1 }}</span>
              </div>

              <div class="navigation-item__content">
                <label class="field">
                  <span>Название пункта</span>
                  <input
                    :value="item.label"
                    type="text"
                    @input="updateLabel(item.key, ($event.target as HTMLInputElement).value)"
                  />
                </label>

                <div class="navigation-item__meta">
                  <span>Маршрут: {{ item.routeName }}</span>
                  <span>Опубликовано как: {{ publishedLabel(item.key) }}</span>
                  <span>
                    Публикация:
                    {{ publishedVisibility(item.key) ? 'видим' : 'скрыт' }}
                  </span>
                </div>
              </div>

              <div class="navigation-item__controls">
                <button class="icon-btn" :disabled="index === 0" @click="moveItem(item.key, 'up')">
                  ↑
                </button>
                <button
                  class="icon-btn"
                  :disabled="index === draftItems.length - 1"
                  @click="moveItem(item.key, 'down')"
                >
                  ↓
                </button>
                <label class="switch">
                  <input
                    :checked="item.visible"
                    type="checkbox"
                    @change="toggleVisibility(item.key)"
                  />
                  <span>{{ item.visible ? 'В меню' : 'Скрыт' }}</span>
                </label>
              </div>
            </article>
          </div>
        </section>
      </div>

      <aside class="navigation-page__side">
        <section class="navigation-card">
          <div class="navigation-card__header">
            <h2>Состояние</h2>
          </div>

          <dl class="summary-list">
            <div>
              <dt>Черновик отличается</dt>
              <dd>{{ hasUnpublishedChanges ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Видимых пунктов</dt>
              <dd>{{ draftItems.filter((item) => item.visible).length }}</dd>
            </div>
            <div>
              <dt>Опубликованных пунктов</dt>
              <dd>{{ publishedItems.filter((item) => item.visible).length }}</dd>
            </div>
          </dl>
        </section>

        <section class="navigation-card">
          <div class="navigation-card__header">
            <h2>Предпросмотр меню</h2>
            <p>Так сейчас выглядит опубликованная версия для школы.</p>
          </div>

          <div class="menu-preview">
            <span
              v-for="item in publishedItems.filter((entry) => entry.visible)"
              :key="item.key"
              class="menu-preview__chip"
            >
              {{ item.label }}
            </span>
          </div>
        </section>

        <section class="navigation-card">
          <div class="navigation-card__header">
            <h2>Что уже работает</h2>
          </div>

          <ul class="check-list">
            <li>видимость пунктов меню</li>
            <li>переименование разделов</li>
            <li>изменение порядка</li>
            <li>публикация в публичный сайт школы</li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.navigation-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.navigation-page__header {
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
    max-width: 760px;
    line-height: 1.6;
  }
}

.navigation-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.navigation-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.navigation-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, .85fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.navigation-page__main,
.navigation-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.navigation-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.navigation-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.navigation-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.navigation-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.navigation-item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 14px;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 14px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
}

.navigation-item__order {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: rgba($navy, .08);
    color: $navy;
    font-size: 13px;
    font-weight: 700;
  }
}

.navigation-item__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.navigation-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.navigation-item__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    font-size: 13px;
    font-weight: 500;
    color: $text-primary;
  }

  input {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    color: $text-primary;
    background: $white;
  }

  input:focus {
    outline: none;
    border-color: $navy;
  }
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid $border;
  background: $surface;
  color: $navy;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: .45;
    cursor: not-allowed;
  }
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 10px;
  background: $surface;
  color: $text-primary;
  font-size: 13px;
  font-weight: 500;
}

.summary-list {
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

.menu-preview {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: $mobile-breakpoint) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    max-width: 100%;
    padding: 0 0 6px;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.menu-preview__chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 9px 12px;
  background: rgba($navy, .08);
  color: $navy;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  flex: 0 0 auto;
}

.check-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 18px;

  li {
    color: $text-secondary;
    line-height: 1.5;
    font-size: 14px;
  }
}
</style>
