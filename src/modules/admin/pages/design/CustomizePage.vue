<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolDesignDraft,
  getDefaultSchoolDesignDraft,
  publishSchoolDraftCustomization,
  resetSchoolDraftCustomization,
  updateSchoolDraftCustomization,
  type SchoolButtonStyle,
  type SchoolContrastStyle,
  type SchoolDensityStyle,
  type SchoolRadiusStyle,
} from '@/modules/admin/state/school-design'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const designDraft = computed(() => ensureSchoolDesignDraft(schoolSlug.value))
const defaultDesignDraft = computed(() => getDefaultSchoolDesignDraft(schoolSlug.value))
const draftCustomization = computed(() => designDraft.value.draftCustomization)
const publishedCustomization = computed(() => designDraft.value.publishedCustomization)

const hasUnpublishedChanges = computed(
  () => JSON.stringify(draftCustomization.value) !== JSON.stringify(publishedCustomization.value),
)
const differsFromDefault = computed(
  () => JSON.stringify(draftCustomization.value) !== JSON.stringify(defaultDesignDraft.value.draftCustomization),
)

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

const buttonOptions: Array<{ value: SchoolButtonStyle; label: string; description: string }> = [
  { value: 'solid', label: 'Плотные кнопки', description: 'Насыщенные акцентные кнопки без лишнего декора.' },
  { value: 'soft', label: 'Мягкие кнопки', description: 'Акцент с тенью и более заметной глубиной.' },
  { value: 'outline', label: 'Контурные кнопки', description: 'Более спокойная, строгая подача CTA.' },
]

const radiusOptions: Array<{ value: SchoolRadiusStyle; label: string; description: string }> = [
  { value: 'compact', label: 'Компактные углы', description: 'Более собранная и строгая геометрия.' },
  { value: 'balanced', label: 'Сбалансированные', description: 'Нейтральный вариант для большинства школ.' },
  { value: 'rounded', label: 'Скругленные', description: 'Более мягкий и дружелюбный характер интерфейса.' },
]

const densityOptions: Array<{ value: SchoolDensityStyle; label: string; description: string }> = [
  { value: 'comfortable', label: 'Свободная плотность', description: 'Больше воздуха между секциями и элементами.' },
  { value: 'compact', label: 'Компактная плотность', description: 'Более плотная и деловая посадка блоков.' },
]

const contrastOptions: Array<{ value: SchoolContrastStyle; label: string; description: string }> = [
  { value: 'normal', label: 'Стандартный контраст', description: 'Спокойный визуальный ритм без усиления.' },
  { value: 'high', label: 'Повышенный контраст', description: 'Более выраженные границы и акценты.' },
]

function setButtonStyle(value: SchoolButtonStyle) {
  updateSchoolDraftCustomization(schoolSlug.value, {
    ...draftCustomization.value,
    buttonStyle: value,
  })
}

function setRadiusStyle(value: SchoolRadiusStyle) {
  updateSchoolDraftCustomization(schoolSlug.value, {
    ...draftCustomization.value,
    radiusStyle: value,
  })
}

function setDensityStyle(value: SchoolDensityStyle) {
  updateSchoolDraftCustomization(schoolSlug.value, {
    ...draftCustomization.value,
    density: value,
  })
}

function setContrastStyle(value: SchoolContrastStyle) {
  updateSchoolDraftCustomization(schoolSlug.value, {
    ...draftCustomization.value,
    contrast: value,
  })
}

function resetDraft() {
  resetSchoolDraftCustomization(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик простой кастомизации возвращен к опубликованной версии.'
}

function publishDraft() {
  publishSchoolDraftCustomization(schoolSlug.value)
  statusTone.value = 'success'
  statusMessage.value = 'Настройки внешнего вида опубликованы для публичного сайта.'
}

function isSelected<T extends string>(current: T, expected: T) {
  return current === expected
}
</script>

<template>
  <section class="customize-page">
    <div class="customize-page__header">
      <div>
        <h1>Простая кастомизация</h1>
        <p>
          Настройка базовой подачи без кода: стиль кнопок, радиусы, плотность секций и
          уровень контраста. Эти параметры работают поверх выбранных шаблона и темы.
        </p>
      </div>

      <div class="customize-page__actions">
        <button class="btn btn--outline" :disabled="!hasUnpublishedChanges" @click="resetDraft">
          Сбросить черновик
        </button>
        <button class="btn btn--primary" :disabled="!hasUnpublishedChanges" @click="publishDraft">
          Опубликовать настройки
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="customize-page__status"
      :class="`customize-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="customize-page__grid">
      <div class="customize-page__main">
        <section class="customize-card">
          <div class="customize-card__header">
            <h2>Стиль кнопок</h2>
            <p>Меняет характер основных CTA и action-кнопок на публичном сайте.</p>
          </div>

          <div class="option-grid">
            <button
              v-for="option in buttonOptions"
              :key="option.value"
              class="option-card"
              :class="{ 'option-card--selected': isSelected(draftCustomization.buttonStyle, option.value) }"
              @click="setButtonStyle(option.value)"
            >
              <strong>{{ option.label }}</strong>
              <span>{{ option.description }}</span>
            </button>
          </div>
        </section>

        <section class="customize-card">
          <div class="customize-card__header">
            <h2>Радиусы и плотность</h2>
            <p>Определяет общую мягкость формы карточек и вертикальный ритм страниц.</p>
          </div>

          <div class="split-grid">
            <div>
              <h3>Радиусы</h3>
              <div class="option-grid option-grid--stacked">
                <button
                  v-for="option in radiusOptions"
                  :key="option.value"
                  class="option-card"
                  :class="{ 'option-card--selected': isSelected(draftCustomization.radiusStyle, option.value) }"
                  @click="setRadiusStyle(option.value)"
                >
                  <strong>{{ option.label }}</strong>
                  <span>{{ option.description }}</span>
                </button>
              </div>
            </div>

            <div>
              <h3>Плотность</h3>
              <div class="option-grid option-grid--stacked">
                <button
                  v-for="option in densityOptions"
                  :key="option.value"
                  class="option-card"
                  :class="{ 'option-card--selected': isSelected(draftCustomization.density, option.value) }"
                  @click="setDensityStyle(option.value)"
                >
                  <strong>{{ option.label }}</strong>
                  <span>{{ option.description }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="customize-card">
          <div class="customize-card__header">
            <h2>Контраст</h2>
            <p>Усиливает границы и акценты, если сайт должен выглядеть строже и заметнее.</p>
          </div>

          <div class="option-grid">
            <button
              v-for="option in contrastOptions"
              :key="option.value"
              class="option-card"
              :class="{ 'option-card--selected': isSelected(draftCustomization.contrast, option.value) }"
              @click="setContrastStyle(option.value)"
            >
              <strong>{{ option.label }}</strong>
              <span>{{ option.description }}</span>
            </button>
          </div>
        </section>
      </div>

      <aside class="customize-page__side">
        <section class="customize-card">
          <div class="customize-card__header">
            <h2>Текущее состояние</h2>
          </div>

          <dl class="summary-list">
            <div>
              <dt>Черновик отличается</dt>
              <dd>{{ hasUnpublishedChanges ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Отличается от дефолта</dt>
              <dd>{{ differsFromDefault ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Кнопки</dt>
              <dd>{{ buttonOptions.find((item) => item.value === draftCustomization.buttonStyle)?.label }}</dd>
            </div>
            <div>
              <dt>Радиусы</dt>
              <dd>{{ radiusOptions.find((item) => item.value === draftCustomization.radiusStyle)?.label }}</dd>
            </div>
            <div>
              <dt>Плотность</dt>
              <dd>{{ densityOptions.find((item) => item.value === draftCustomization.density)?.label }}</dd>
            </div>
            <div>
              <dt>Контраст</dt>
              <dd>{{ contrastOptions.find((item) => item.value === draftCustomization.contrast)?.label }}</dd>
            </div>
          </dl>
        </section>

        <section class="customize-card">
          <div class="customize-card__header">
            <h2>Что изменится на сайте</h2>
          </div>

          <div class="preview-shell" :class="[
            `preview-shell--${draftCustomization.buttonStyle}`,
            `preview-shell--${draftCustomization.radiusStyle}`,
            `preview-shell--${draftCustomization.density}`,
            `preview-shell--${draftCustomization.contrast}`,
          ]">
            <div class="preview-shell__row">
              <span class="preview-shell__badge">Hero</span>
              <button class="btn btn--primary">Основная CTA</button>
            </div>
            <div class="preview-shell__row">
              <div class="preview-shell__card">
                <strong>Карточка раздела</strong>
                <small>Показывает выбранный радиус и контраст границ.</small>
              </div>
            </div>
            <div class="preview-shell__row">
              <button class="btn btn--outline">Вторичная кнопка</button>
              <button class="btn btn--gold">Акцент</button>
            </div>
          </div>
        </section>

        <section class="customize-card">
          <div class="customize-card__header">
            <h2>Опубликовано сейчас</h2>
          </div>

          <ul class="state-list">
            <li>Кнопки: {{ buttonOptions.find((item) => item.value === publishedCustomization.buttonStyle)?.label }}</li>
            <li>Радиусы: {{ radiusOptions.find((item) => item.value === publishedCustomization.radiusStyle)?.label }}</li>
            <li>Плотность: {{ densityOptions.find((item) => item.value === publishedCustomization.density)?.label }}</li>
            <li>Контраст: {{ contrastOptions.find((item) => item.value === publishedCustomization.contrast)?.label }}</li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.customize-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customize-page__header {
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

.customize-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.customize-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.customize-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, .85fr);
  gap: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
}

.customize-page__main,
.customize-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customize-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.customize-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.customize-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.split-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }

  h3 {
    font-size: 14px;
    color: $navy;
    margin-bottom: 10px;
  }
}

.option-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }

  &--stacked {
    margin-top: 0;
    grid-template-columns: 1fr;
  }
}

.option-card {
  text-align: left;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;
  background: $white;
  transition: border-color $transition-fast, box-shadow $transition-fast, transform $transition-fast;

  &:hover {
    border-color: rgba($navy, .2);
    transform: translateY(-1px);
  }

  &--selected {
    border-color: rgba($navy, .38);
    box-shadow: 0 14px 28px rgba($navy-dark, .06);
  }

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 15px;
    color: $text-primary;
  }

  span {
    margin-top: 8px;
    color: $text-secondary;
    line-height: 1.55;
    font-size: 14px;
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

.preview-shell {
  margin-top: 16px;
  border-radius: 20px;
  border: 1px solid $border;
  background: linear-gradient(180deg, rgba($navy, .05), rgba($surface, .92));
  padding: 18px;
  display: grid;
  gap: 14px;

  &--compact {
    gap: 10px;
  }

  &--rounded {
    .preview-shell__card {
      border-radius: 22px;
    }
  }

  &--compact.preview-shell--compact {
    padding: 14px;
  }

  &--high {
    .preview-shell__card {
      border-width: 2px;
    }
  }

  &--soft {
    .btn--primary,
    .btn--gold {
      box-shadow: 0 10px 22px rgba($navy, .16);
    }
  }

  &--outline {
    .btn--primary,
    .btn--gold {
      background: transparent;
      color: $navy;
      border: 1.5px solid currentColor;
    }
  }
}

.preview-shell__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.preview-shell__badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba($navy, .08);
  color: $navy;
  font-size: 12px;
  font-weight: 700;
}

.preview-shell__card {
  width: 100%;
  border: 1px solid rgba($navy, .16);
  border-radius: 16px;
  background: $white;
  padding: 14px;

  strong,
  small {
    display: block;
  }

  strong {
    color: $text-primary;
  }

  small {
    margin-top: 6px;
    color: $text-secondary;
    line-height: 1.5;
  }
}

.state-list {
  margin-top: 14px;
  display: grid;
  gap: 8px;
  padding-left: 18px;

  li {
    color: $text-secondary;
    line-height: 1.5;
    font-size: 14px;
  }
}
</style>
