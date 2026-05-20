<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolHomeBlocksDraft,
  publishSchoolHomeBlocksDraft,
  resetSchoolHomeBlocksDraft,
  updateSchoolHomeBlocksDraft,
  type SchoolHomeBlockItem,
} from '@/modules/admin/state/school-home-blocks'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const blocksDraft = computed(() => ensureSchoolHomeBlocksDraft(schoolSlug.value))
const draftItems = computed(() => blocksDraft.value.draftItems)
const publishedItems = computed(() => blocksDraft.value.publishedItems)
const hasUnpublishedChanges = computed(
  () => JSON.stringify(draftItems.value) !== JSON.stringify(publishedItems.value),
)

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

function saveDraft(items: SchoolHomeBlockItem[]) {
  updateSchoolHomeBlocksDraft(schoolSlug.value, items)
}

function toggleBlock(blockKey: string) {
  saveDraft(
    draftItems.value.map((item) =>
      item.key === blockKey ? { ...item, visible: !item.visible } : item,
    ),
  )
}

function moveBlock(blockKey: string, direction: -1 | 1) {
  const items = [...draftItems.value]
  const index = items.findIndex((item) => item.key === blockKey)
  const targetIndex = index + direction

  if (index < 0 || targetIndex < 0 || targetIndex >= items.length) return

  ;[items[index], items[targetIndex]] = [items[targetIndex], items[index]]
  saveDraft(items)
}

function resetDraft() {
  resetSchoolHomeBlocksDraft(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик блоков главной страницы возвращен к опубликованной версии.'
}

function publishDraft() {
  publishSchoolHomeBlocksDraft(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Состав и порядок блоков главной страницы опубликованы.'
}
</script>

<template>
  <section class="home-blocks-page">
    <div class="home-blocks-page__header">
      <div>
        <h1>Блоки главной страницы</h1>
        <p>
          Управляйте составом и порядком блоков на главной странице школы. Можно скрыть
          необязательные секции, поменять их местами и затем опубликовать обновленную композицию.
        </p>
      </div>

      <div class="home-blocks-page__actions">
        <button class="btn btn--outline" :disabled="!hasUnpublishedChanges" @click="resetDraft">
          Сбросить черновик
        </button>
        <button class="btn btn--primary" :disabled="!hasUnpublishedChanges" @click="publishDraft">
          Опубликовать блоки
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="home-blocks-page__status"
      :class="`home-blocks-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="home-blocks-page__grid">
      <div class="home-blocks-page__main">
        <section class="blocks-card">
          <div class="blocks-card__header">
            <h2>Черновик главной страницы</h2>
            <p>Верхняя строка идет раньше на странице. Скрытые блоки не удаляются и могут быть возвращены в любой момент.</p>
          </div>

          <div class="block-list">
            <article
              v-for="(item, index) in draftItems"
              :key="item.key"
              class="block-item"
              :class="{ 'block-item--hidden': !item.visible }"
            >
              <div class="block-item__order">
                <span>{{ index + 1 }}</span>
              </div>

              <div class="block-item__content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="block-item__meta">
                  <span>Черновик: {{ item.visible ? 'виден' : 'скрыт' }}</span>
                  <span>
                    Опубликовано:
                    {{ publishedItems.find((published) => published.key === item.key)?.visible ? 'виден' : 'скрыт' }}
                  </span>
                </div>
              </div>

              <div class="block-item__controls">
                <button class="control-btn" :disabled="index === 0" @click="moveBlock(item.key, -1)">
                  Выше
                </button>
                <button
                  class="control-btn"
                  :disabled="index === draftItems.length - 1"
                  @click="moveBlock(item.key, 1)"
                >
                  Ниже
                </button>
                <button class="control-btn control-btn--toggle" @click="toggleBlock(item.key)">
                  {{ item.visible ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <aside class="home-blocks-page__side">
        <section class="blocks-card">
          <div class="blocks-card__header">
            <h2>Сводка</h2>
          </div>

          <dl class="summary-list">
            <div>
              <dt>Изменения в черновике</dt>
              <dd>{{ hasUnpublishedChanges ? 'Есть' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Видимых блоков</dt>
              <dd>{{ draftItems.filter((item) => item.visible).length }}</dd>
            </div>
            <div>
              <dt>Скрытых блоков</dt>
              <dd>{{ draftItems.filter((item) => !item.visible).length }}</dd>
            </div>
          </dl>
        </section>

        <section class="blocks-card">
          <div class="blocks-card__header">
            <h2>Опубликованный порядок</h2>
          </div>

          <div class="published-list">
            <div
              v-for="item in publishedItems"
              :key="item.key"
              class="published-list__item"
            >
              <span>{{ item.title }}</span>
              <strong>{{ item.visible ? 'Виден' : 'Скрыт' }}</strong>
            </div>
          </div>
        </section>

        <section class="blocks-card">
          <div class="blocks-card__header">
            <h2>Как это влияет на сайт</h2>
          </div>

          <ul class="check-list">
            <li>скрытый блок не рендерится на главной странице;</li>
            <li>порядок в списке совпадает с порядком секций на публичном сайте;</li>
            <li>новости и быстрые ссылки не удаляются из данных, меняется только композиция главной.</li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-blocks-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-blocks-page__header {
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

.home-blocks-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.home-blocks-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.home-blocks-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, .85fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.home-blocks-page__main,
.home-blocks-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blocks-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.blocks-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.blocks-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.block-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.block-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }

  &--hidden {
    background: rgba($surface, .92);
  }
}

.block-item__order {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba($navy, .08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $navy;
  font-weight: 700;
}

.block-item__content h3 {
  font-size: 16px;
  color: $text-primary;
}

.block-item__content p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.block-item__meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.block-item__controls {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 820px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.control-btn {
  border: 1px solid $border;
  background: $white;
  color: $text-primary;
  border-radius: 10px;
  padding: 9px 12px;
  font: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: .45;
  }

  &--toggle {
    background: rgba($navy, .06);
    color: $navy;
  }
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
