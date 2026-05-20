<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolModulesDraft,
  publishSchoolModulesDraft,
  resetSchoolModulesDraft,
  updateSchoolModulesDraft,
} from '@/modules/admin/state/school-modules'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const modulesDraft = computed(() => ensureSchoolModulesDraft(schoolSlug.value))
const draftItems = computed(() => modulesDraft.value.draftItems)
const publishedItems = computed(() => modulesDraft.value.publishedItems)
const hasUnpublishedChanges = computed(
  () => JSON.stringify(draftItems.value) !== JSON.stringify(publishedItems.value),
)

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

function toggleModule(moduleKey: string) {
  const nextItems = draftItems.value.map((item) =>
    item.key === moduleKey ? { ...item, enabled: !item.enabled } : item,
  )
  updateSchoolModulesDraft(schoolSlug.value, nextItems)
}

function resetDraft() {
  resetSchoolModulesDraft(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик модулей возвращён к опубликованной версии.'
}

function publishDraft() {
  publishSchoolModulesDraft(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Состав системных разделов опубликован.'
}

function isPublishedEnabled(moduleKey: string) {
  return publishedItems.value.find((item) => item.key === moduleKey)?.enabled ?? true
}
</script>

<template>
  <section class="modules-page">
    <div class="modules-page__header">
      <div>
        <h1>Модули сайта</h1>
        <p>
          Управляйте системными разделами школы. Опубликованная версия влияет на
          публичное меню и на доступность соответствующих маршрутов сайта.
        </p>
      </div>

      <div class="modules-page__actions">
        <button class="btn btn--outline" :disabled="!hasUnpublishedChanges" @click="resetDraft">
          Сбросить черновик
        </button>
        <button class="btn btn--primary" :disabled="!hasUnpublishedChanges" @click="publishDraft">
          Опубликовать модули
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="modules-page__status"
      :class="`modules-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="modules-page__grid">
      <div class="modules-page__main">
        <section class="modules-card">
          <div class="modules-card__header">
            <h2>Черновик системных разделов</h2>
            <p>Включайте и отключайте разделы, которые должны быть доступны на сайте школы.</p>
          </div>

          <div class="module-list">
            <article
              v-for="item in draftItems"
              :key="item.key"
              class="module-item"
              :class="{ 'module-item--disabled': !item.enabled }"
            >
              <div class="module-item__content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="module-item__meta">
                  <span>
                    Опубликовано:
                    {{ isPublishedEnabled(item.key) ? 'включено' : 'отключено' }}
                  </span>
                  <span>
                    Черновик:
                    {{ item.enabled ? 'включен' : 'отключен' }}
                  </span>
                </div>
              </div>

              <label class="toggle-card">
                <input
                  :checked="item.enabled"
                  type="checkbox"
                  @change="toggleModule(item.key)"
                />
                <span>{{ item.enabled ? 'Включен' : 'Отключен' }}</span>
              </label>
            </article>
          </div>
        </section>
      </div>

      <aside class="modules-page__side">
        <section class="modules-card">
          <div class="modules-card__header">
            <h2>Состояние</h2>
          </div>

          <dl class="summary-list">
            <div>
              <dt>Черновик отличается</dt>
              <dd>{{ hasUnpublishedChanges ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Активно в черновике</dt>
              <dd>{{ draftItems.filter((item) => item.enabled).length }}</dd>
            </div>
            <div>
              <dt>Активно опубликовано</dt>
              <dd>{{ publishedItems.filter((item) => item.enabled).length }}</dd>
            </div>
          </dl>
        </section>

        <section class="modules-card">
          <div class="modules-card__header">
            <h2>Что происходит после публикации</h2>
          </div>

          <ul class="check-list">
            <li>раздел исчезает из публичного меню школы</li>
            <li>маршрут раздела становится недоступен и ведёт на главную школы</li>
            <li>админские данные при этом не удаляются</li>
            <li>модуль можно включить обратно в любой момент</li>
          </ul>
        </section>

        <section class="modules-card">
          <div class="modules-card__header">
            <h2>Опубликовано сейчас</h2>
          </div>

          <div class="published-list">
            <div
              v-for="item in publishedItems"
              :key="item.key"
              class="published-list__item"
            >
              <span>{{ item.title }}</span>
              <strong>{{ item.enabled ? 'Включен' : 'Отключен' }}</strong>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.modules-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modules-page__header {
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

.modules-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.modules-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.modules-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, .85fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.modules-page__main,
.modules-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modules-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.modules-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.modules-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.module-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &--disabled {
    background: rgba($surface, .9);
  }
}

.module-item__content h3 {
  font-size: 16px;
  color: $text-primary;
}

.module-item__content p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.module-item__meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.toggle-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: $surface;
  color: $text-primary;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
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

.published-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.published-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid $border;
  padding-top: 10px;

  span {
    color: $text-primary;
  }

  strong {
    font-size: 13px;
    color: $navy;
  }
}
</style>
