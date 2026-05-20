<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { themePresets, type ThemePreset } from '@/modules/admin/data/theme-presets'
import {
  ensureSchoolDesignDraft,
  getDefaultSchoolDesignDraft,
  publishSchoolDraftTheme,
  resetSchoolDraftTheme,
  updateSchoolDraftTheme,
} from '@/modules/admin/state/school-design'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const designDraft = computed(() => ensureSchoolDesignDraft(schoolSlug.value))
const defaultDesignDraft = computed(() => getDefaultSchoolDesignDraft(schoolSlug.value))
const selectedThemeKey = computed(() => designDraft.value.draftThemeKey)
const publishedThemeKey = computed(() => designDraft.value.publishedThemeKey)
const hasUnpublishedChanges = computed(
  () => selectedThemeKey.value !== publishedThemeKey.value,
)
const differsFromDefault = computed(
  () => selectedThemeKey.value !== defaultDesignDraft.value.draftThemeKey,
)

const selectedTheme = computed(
  () => themePresets.find((preset) => preset.key === selectedThemeKey.value) ?? themePresets[0],
)
const publishedTheme = computed(
  () => themePresets.find((preset) => preset.key === publishedThemeKey.value) ?? themePresets[0],
)

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

function chooseTheme(preset: ThemePreset) {
  updateSchoolDraftTheme(schoolSlug.value, preset.key)
  statusTone.value = 'success'
  statusMessage.value = `Тема «${preset.name}» сохранена в черновик.`
}

function resetDraft() {
  resetSchoolDraftTheme(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик темы возвращён к опубликованной версии.'
}

function publishDraft() {
  publishSchoolDraftTheme(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = `Тема «${selectedTheme.value.name}» опубликована для школы.`
}

function isSelected(key: string) {
  return key === selectedThemeKey.value
}

function isPublished(key: string) {
  return key === publishedThemeKey.value
}
</script>

<template>
  <section class="themes-page">
    <div class="themes-page__header">
      <div>
        <h1>Цветовые темы</h1>
        <p>
          Выберите цветовую тему для школьного сайта. Тема управляет основными,
          вторичными и акцентными цветами, а также общим ощущением интерфейса.
        </p>
      </div>

      <div class="themes-page__actions">
        <button class="btn btn--outline" :disabled="!hasUnpublishedChanges" @click="resetDraft">
          Сбросить черновик
        </button>
        <button class="btn btn--primary" :disabled="!hasUnpublishedChanges" @click="publishDraft">
          Опубликовать тему
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="themes-page__status"
      :class="`themes-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="themes-page__grid">
      <div class="themes-page__catalog">
        <article
          v-for="preset in themePresets"
          :key="preset.key"
          class="theme-card"
          :class="{
            'theme-card--selected': isSelected(preset.key),
            'theme-card--published': isPublished(preset.key),
          }"
        >
          <div class="theme-card__palette">
            <div
              v-for="(color, index) in Object.values(preset.colors)"
              :key="`${preset.key}-${index}`"
              class="theme-card__color"
              :style="{ backgroundColor: color }"
            ></div>
          </div>

          <div class="theme-card__preview" :style="{ backgroundColor: preset.colors.surface }">
            <div class="theme-preview">
              <div class="theme-preview__top" :style="{ backgroundColor: preset.colors.primary }"></div>
              <div class="theme-preview__hero">
                <span
                  class="theme-preview__line theme-preview__line--main"
                  :style="{ backgroundColor: preset.colors.primary }"
                ></span>
                <span
                  class="theme-preview__line theme-preview__line--sub"
                  :style="{ backgroundColor: preset.colors.secondary }"
                ></span>
              </div>
              <div class="theme-preview__cards">
                <span :style="{ backgroundColor: preset.colors.secondary }"></span>
                <span :style="{ backgroundColor: preset.colors.accent }"></span>
                <span :style="{ backgroundColor: preset.colors.primary }"></span>
              </div>
            </div>
          </div>

          <div class="theme-card__meta">
            <div class="theme-card__title-row">
              <div>
                <h2>{{ preset.name }}</h2>
                <p>{{ preset.description }}</p>
              </div>
              <span v-if="isPublished(preset.key)" class="state-pill">Опубликована</span>
            </div>

            <div class="theme-card__meta-row">
              <span class="theme-card__contrast">{{ preset.contrastLabel }}</span>
              <span class="theme-card__hex">{{ preset.colors.primary }}</span>
            </div>

            <button
              class="btn"
              :class="isSelected(preset.key) ? 'btn--outline' : 'btn--primary'"
              @click="chooseTheme(preset)"
            >
              {{ isSelected(preset.key) ? 'Выбрана в черновике' : 'Выбрать тему' }}
            </button>
          </div>
        </article>
      </div>

      <aside class="themes-page__sidebar">
        <div class="themes-page__sidebar-card">
          <div class="themes-page__sidebar-header">
            <h2>Текущий выбор</h2>
            <span class="themes-page__state-pill" :class="{ 'is-dirty': hasUnpublishedChanges }">
              {{ hasUnpublishedChanges ? 'Есть черновик' : 'Без изменений' }}
            </span>
          </div>

          <p class="themes-page__selected-name">{{ selectedTheme.name }}</p>
          <p class="themes-page__selected-description">{{ selectedTheme.description }}</p>

          <dl class="summary-list">
            <div>
              <dt>Черновик</dt>
              <dd>{{ selectedTheme.name }}</dd>
            </div>
            <div>
              <dt>Опубликовано</dt>
              <dd>{{ publishedTheme.name }}</dd>
            </div>
            <div>
              <dt>Отличается от дефолта</dt>
              <dd>{{ differsFromDefault ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Акцент</dt>
              <dd>{{ selectedTheme.colors.accent }}</dd>
            </div>
          </dl>
        </div>

        <div class="themes-page__sidebar-card">
          <h2>Что меняет тема</h2>
          <ul class="theme-check-list">
            <li>цвет шапки, кнопок и активных элементов</li>
            <li>акцентные секции и бейджи</li>
            <li>фоновые поверхности и контраст блоков</li>
            <li>общее визуальное настроение сайта</li>
          </ul>
        </div>

        <div class="themes-page__sidebar-card">
          <h2>Сравнение</h2>
          <div class="compare-grid">
            <div>
              <span>Опубликована</span>
              <strong>{{ publishedTheme.name }}</strong>
              <small>{{ publishedTheme.colors.primary }}</small>
            </div>
            <div>
              <span>Черновик</span>
              <strong>{{ selectedTheme.name }}</strong>
              <small>{{ selectedTheme.colors.primary }}</small>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.themes-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.themes-page__header {
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

.themes-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.themes-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.themes-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, .8fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.themes-page__catalog {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.themes-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.themes-page__sidebar-card,
.theme-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
}

.theme-card {
  display: flex;
  flex-direction: column;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &--selected {
    border-color: rgba($navy, .35);
    box-shadow: 0 14px 28px rgba($navy-dark, .08);
  }

  &--published {
    .theme-card__palette {
      box-shadow: inset 0 0 0 1px rgba($gold, .45);
    }
  }
}

.theme-card__palette {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
}

.theme-card__color {
  height: 18px;
}

.theme-card__preview {
  padding: 18px;
}

.theme-preview {
  border-radius: 18px;
  background: rgba($white, .88);
  border: 1px solid rgba($white, .7);
  padding: 14px;
  min-height: 150px;
}

.theme-preview__top {
  height: 16px;
  border-radius: 999px;
  width: 58%;
}

.theme-preview__hero {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.theme-preview__line {
  display: block;
  border-radius: 999px;

  &--main {
    width: 74%;
    height: 14px;
  }

  &--sub {
    width: 52%;
    height: 10px;
    opacity: .8;
  }
}

.theme-preview__cards {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  span {
    display: block;
    height: 52px;
    border-radius: 12px;
    opacity: .92;
  }
}

.theme-card__meta,
.themes-page__sidebar-card {
  padding: 20px;
}

.themes-page__sidebar-header,
.theme-card__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.theme-card__meta h2,
.themes-page__sidebar-card h2 {
  font-size: 16px;
  color: $navy;
}

.theme-card__meta p,
.themes-page__selected-description {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.theme-card__meta-row {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.theme-card__contrast,
.theme-card__hex,
.themes-page__state-pill,
.state-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .03em;
}

.theme-card__contrast {
  padding: 6px 10px;
  color: $navy-dark;
  background: rgba($navy, .08);
}

.theme-card__hex {
  padding: 6px 10px;
  color: $text-secondary;
  background: $surface;
}

.themes-page__state-pill {
  padding: 6px 10px;
  background: rgba($navy, .08);
  color: $navy;

  &.is-dirty {
    background: rgba($gold, .22);
    color: $navy-dark;
  }
}

.state-pill {
  padding: 4px 8px;
  background: rgba($gold, .22);
  color: $navy-dark;
}

.theme-card__meta .btn {
  margin-top: 18px;
  width: 100%;
}

.summary-list {
  margin-top: 16px;
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
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    text-align: right;
  }
}

.themes-page__selected-name {
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
}

.theme-check-list {
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

.compare-grid {
  margin-top: 14px;
  display: grid;
  gap: 12px;

  div {
    border: 1px solid $border;
    border-radius: 12px;
    padding: 14px;
  }

  span {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: $text-secondary;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: $text-primary;
    font-size: 16px;
  }

  small {
    display: block;
    margin-top: 6px;
    color: $text-secondary;
  }
}
</style>
