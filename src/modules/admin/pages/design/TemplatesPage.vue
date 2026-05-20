<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { templatePresets, type TemplatePreset } from '@/modules/admin/data/template-presets'
import {
  ensureSchoolDesignDraft,
  publishSchoolDraftTemplate,
  resetSchoolDraftTemplate,
  updateSchoolDraftTemplate,
} from '@/modules/admin/state/school-design'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const designDraft = computed(() => ensureSchoolDesignDraft(schoolSlug.value))
const selectedTemplateKey = computed(() => designDraft.value.draftTemplateKey)
const publishedTemplateKey = computed(() => designDraft.value.publishedTemplateKey)
const hasUnpublishedChanges = computed(
  () => selectedTemplateKey.value !== publishedTemplateKey.value,
)

const selectedTemplate = computed(
  () =>
    templatePresets.find((preset) => preset.key === selectedTemplateKey.value) ??
    templatePresets[0],
)
const publishedTemplate = computed(
  () =>
    templatePresets.find((preset) => preset.key === publishedTemplateKey.value) ??
    templatePresets[0],
)

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

function chooseTemplate(preset: TemplatePreset) {
  updateSchoolDraftTemplate(schoolSlug.value, preset.key)
  statusTone.value = 'success'
  statusMessage.value = `Шаблон «${preset.name}» сохранён в черновик.`
}

function resetDraft() {
  resetSchoolDraftTemplate(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик шаблона возвращён к опубликованной версии.'
}

function publishDraft() {
  publishSchoolDraftTemplate(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = `Шаблон «${selectedTemplate.value.name}» опубликован для школы.`
}

function isSelected(key: string) {
  return key === selectedTemplateKey.value
}

function isPublished(key: string) {
  return key === publishedTemplateKey.value
}
</script>

<template>
  <section class="templates-page">
    <div class="templates-page__header">
      <div>
        <h1>Шаблоны сайта</h1>
        <p>
          Выберите базовый шаблон школьного сайта. Выбор сохраняется в черновик,
          поэтому можно спокойно сравнить варианты и опубликовать только итоговое решение.
        </p>
      </div>

      <div class="templates-page__actions">
        <button class="btn btn--outline" :disabled="!hasUnpublishedChanges" @click="resetDraft">
          Сбросить черновик
        </button>
        <button class="btn btn--primary" :disabled="!hasUnpublishedChanges" @click="publishDraft">
          Опубликовать шаблон
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="templates-page__status"
      :class="`templates-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="templates-page__grid">
      <div class="templates-page__catalog">
        <article
          v-for="preset in templatePresets"
          :key="preset.key"
          class="template-card"
          :class="{
            'template-card--selected': isSelected(preset.key),
            'template-card--published': isPublished(preset.key),
          }"
        >
          <div class="template-card__preview" :data-template="preset.key">
            <span class="template-card__badge">{{ preset.badge }}</span>

            <div class="preview-shell">
              <div class="preview-shell__top"></div>
              <div class="preview-shell__hero" :class="`preview-shell__hero--${preset.heroStyle}`"></div>
              <div class="preview-shell__body" :class="`preview-shell__body--${preset.cardStyle}`">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div class="template-card__meta">
            <div class="template-card__title-row">
              <h2>{{ preset.name }}</h2>
              <span v-if="isPublished(preset.key)" class="state-pill">Опубликован</span>
            </div>

            <p>{{ preset.description }}</p>

            <ul class="template-card__features">
              <li v-for="feature in preset.blockSummary" :key="feature">{{ feature }}</li>
            </ul>

            <dl class="template-card__details">
              <div>
                <dt>Меню</dt>
                <dd>{{ preset.menuStyle }}</dd>
              </div>
              <div>
                <dt>Hero</dt>
                <dd>{{ preset.heroStyle }}</dd>
              </div>
              <div>
                <dt>Карточки</dt>
                <dd>{{ preset.cardStyle }}</dd>
              </div>
            </dl>

            <button
              class="btn"
              :class="isSelected(preset.key) ? 'btn--outline' : 'btn--primary'"
              @click="chooseTemplate(preset)"
            >
              {{ isSelected(preset.key) ? 'Выбран в черновике' : 'Выбрать шаблон' }}
            </button>
          </div>
        </article>
      </div>

      <aside class="templates-page__sidebar">
        <div class="templates-page__sidebar-card">
          <div class="templates-page__sidebar-header">
            <h2>Текущий выбор</h2>
            <span class="templates-page__state-pill" :class="{ 'is-dirty': hasUnpublishedChanges }">
              {{ hasUnpublishedChanges ? 'Есть черновик' : 'Без изменений' }}
            </span>
          </div>

          <p class="templates-page__selected-name">{{ selectedTemplate.name }}</p>
          <p class="templates-page__selected-description">
            {{ selectedTemplate.description }}
          </p>

          <dl class="summary-list">
            <div>
              <dt>Черновик</dt>
              <dd>{{ selectedTemplate.name }}</dd>
            </div>
            <div>
              <dt>Опубликовано</dt>
              <dd>{{ publishedTemplate.name }}</dd>
            </div>
            <div>
              <dt>Режим меню</dt>
              <dd>{{ selectedTemplate.menuStyle }}</dd>
            </div>
            <div>
              <dt>Стиль hero</dt>
              <dd>{{ selectedTemplate.heroStyle }}</dd>
            </div>
          </dl>
        </div>

        <div class="templates-page__sidebar-card">
          <h2>Что меняет шаблон</h2>
          <ul class="template-card__features">
            <li>структуру главной страницы</li>
            <li>подачу hero-блока</li>
            <li>стиль карточек разделов и новостей</li>
            <li>компоновку меню и акцентных блоков</li>
          </ul>
        </div>

        <div class="templates-page__sidebar-card">
          <h2>Сравнение</h2>
          <div class="compare-grid">
            <div>
              <span>Опубликован</span>
              <strong>{{ publishedTemplate.name }}</strong>
            </div>
            <div>
              <span>Черновик</span>
              <strong>{{ selectedTemplate.name }}</strong>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.templates-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.templates-page__header {
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

.templates-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.templates-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.templates-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, .8fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.templates-page__catalog {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.templates-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.templates-page__sidebar-card,
.template-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
}

.template-card {
  display: flex;
  flex-direction: column;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &--selected {
    border-color: rgba($navy, .35);
    box-shadow: 0 14px 28px rgba($navy-dark, .08);
  }

  &--published {
    .template-card__preview {
      box-shadow: inset 0 0 0 1px rgba($gold, .45);
    }
  }
}

.template-card__preview {
  position: relative;
  padding: 18px;
  background:
    radial-gradient(circle at top left, rgba($white, .5), transparent 42%),
    linear-gradient(135deg, rgba($navy, .10), rgba($navy-light, .18));
}

.template-card__badge,
.state-pill,
.templates-page__state-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .03em;
}

.template-card__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 6px 10px;
  color: $navy-dark;
  background: rgba($white, .88);
}

.state-pill {
  padding: 4px 8px;
  background: rgba($gold, .22);
  color: $navy-dark;
}

.templates-page__state-pill {
  padding: 6px 10px;
  background: rgba($navy, .08);
  color: $navy;

  &.is-dirty {
    background: rgba($gold, .22);
    color: $navy-dark;
  }
}

.preview-shell {
  border-radius: 18px;
  background: rgba($white, .86);
  border: 1px solid rgba($white, .65);
  padding: 14px;
  min-height: 180px;
}

.preview-shell__top {
  height: 14px;
  width: 56%;
  border-radius: 999px;
  background: rgba($navy, .18);
}

.preview-shell__hero {
  margin-top: 14px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba($navy, .82), rgba($navy-light, .65));

  &--large {
    height: 74px;
  }

  &--centered {
    height: 62px;
    width: 82%;
    margin-inline: auto;
  }

  &--minimal {
    height: 40px;
    width: 68%;
  }
}

.preview-shell__body {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  span {
    display: block;
    height: 48px;
    border-radius: 12px;
    background: rgba($navy, .10);
  }

  &--soft span {
    box-shadow: inset 0 0 0 1px rgba($navy, .06);
  }

  &--bordered span {
    box-shadow: inset 0 0 0 1px rgba($navy, .16);
    background: rgba($white, .72);
  }

  &--flat span {
    border-radius: 8px;
    background: rgba($navy, .07);
  }
}

.template-card__meta,
.templates-page__sidebar-card {
  padding: 20px;
}

.templates-page__sidebar-header,
.template-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.template-card__meta h2,
.templates-page__sidebar-card h2 {
  font-size: 16px;
  color: $navy;
}

.template-card__meta p,
.templates-page__selected-description {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.template-card__features {
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

.template-card__details,
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

.template-card__meta .btn {
  margin-top: 18px;
  width: 100%;
}

.templates-page__selected-name {
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
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
}
</style>
