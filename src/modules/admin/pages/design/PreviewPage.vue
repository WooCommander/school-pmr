<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolDesignDraft } from '@/modules/admin/state/school-design'
import { useSchoolHomeBlocksDraft } from '@/modules/admin/state/school-home-blocks'
import { useSchoolModulesDraft } from '@/modules/admin/state/school-modules'
import { useSchoolNavigationDraft } from '@/modules/admin/state/school-navigation'
import { getSchoolDocuments, getPublishedSchoolDocuments } from '@/modules/admin/state/school-documents'
import { getSchoolNews, getPublishedSchoolNews } from '@/modules/admin/state/school-news'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

type PreviewMode = 'draft' | 'published'
type PreviewDevice = 'desktop' | 'mobile'
type PreviewPageKey = 'home' | 'news' | 'documents' | 'contacts'

interface PreviewToggle<T extends string> {
  value: T
  label: string
}

const route = useRoute()

const mode = ref<PreviewMode>('draft')
const device = ref<PreviewDevice>('desktop')
const page = ref<PreviewPageKey>('home')

const modeOptions: Array<PreviewToggle<PreviewMode>> = [
  { value: 'draft', label: 'Черновик' },
  { value: 'published', label: 'Публикация' },
]

const deviceOptions: Array<PreviewToggle<PreviewDevice>> = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
]

const pageOptions: Array<PreviewToggle<PreviewPageKey>> = [
  { value: 'home', label: 'Главная' },
  { value: 'news', label: 'Новости' },
  { value: 'documents', label: 'Документы' },
  { value: 'contacts', label: 'Контакты' },
]

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const school = computed(() => getManagedSchoolBySlug(schoolSlug.value))
const schoolName = computed(() => school.value?.fullName ?? 'Школа')
const schoolCity = computed(() => school.value?.city ?? 'Город')
const schoolAddress = computed(() => school.value?.address ?? 'Адрес не указан')
const schoolPhone = computed(() => school.value?.phone ?? 'Телефон не указан')
const schoolEmail = computed(() => school.value?.email ?? 'Email не указан')
const schoolHours = computed(() => school.value?.hours ?? 'Режим работы не указан')
const schoolHeroTitle = computed(() => school.value?.heroTitle.replace(/\n/g, ' ') ?? schoolName.value)
const schoolHeroText = computed(() => school.value?.heroText ?? 'Краткое описание школы появится здесь.')
const schoolStats = computed(() => school.value?.stats ?? [])

const { designDraft, selectedTemplate, publishedTemplate, selectedTheme, publishedTheme } =
  useSchoolDesignDraft(schoolSlug.value)
const { draftItems: draftHomeBlocks, publishedItems: publishedHomeBlocks } =
  useSchoolHomeBlocksDraft(schoolSlug.value)
const { draftItems: draftNavigation, publishedItems: publishedNavigation } =
  useSchoolNavigationDraft(schoolSlug.value)
const { draftItems: draftModules, publishedItems: publishedModules } =
  useSchoolModulesDraft(schoolSlug.value)

const activeTheme = computed(() =>
  mode.value === 'draft' ? selectedTheme.value : publishedTheme.value,
)
const activeTemplate = computed(() =>
  mode.value === 'draft' ? selectedTemplate.value : publishedTemplate.value,
)
const activeCustomization = computed(() =>
  mode.value === 'draft'
    ? designDraft.value.draftCustomization
    : designDraft.value.publishedCustomization,
)

const activeHomeBlocks = computed(() =>
  (mode.value === 'draft' ? draftHomeBlocks.value : publishedHomeBlocks.value)
    .filter((item) => item.visible)
    .sort((left, right) => left.order - right.order),
)

const activeNavigation = computed(() =>
  (mode.value === 'draft' ? draftNavigation.value : publishedNavigation.value)
    .filter((item) => item.visible)
    .sort((left, right) => left.order - right.order),
)

const activeModules = computed(() =>
  (mode.value === 'draft' ? draftModules.value : publishedModules.value).filter(
    (item) => item.enabled,
  ),
)

const newsItems = computed(() =>
  mode.value === 'draft'
    ? getSchoolNews(schoolSlug.value).slice(0, 3)
    : getPublishedSchoolNews(schoolSlug.value).slice(0, 3),
)

const documentItems = computed(() =>
  mode.value === 'draft'
    ? getSchoolDocuments(schoolSlug.value).slice(0, 4)
    : getPublishedSchoolDocuments(schoolSlug.value).slice(0, 4),
)

const draftDiff = computed(() => {
  const changes: string[] = []

  if (designDraft.value.draftTemplateKey !== designDraft.value.publishedTemplateKey) {
    changes.push('Шаблон отличается от опубликованного')
  }

  if (designDraft.value.draftThemeKey !== designDraft.value.publishedThemeKey) {
    changes.push('Тема отличается от опубликованной')
  }

  if (
    JSON.stringify(designDraft.value.draftCustomization) !==
    JSON.stringify(designDraft.value.publishedCustomization)
  ) {
    changes.push('Есть неопубликованные настройки кастомизации')
  }

  if (JSON.stringify(draftHomeBlocks.value) !== JSON.stringify(publishedHomeBlocks.value)) {
    changes.push('Изменен состав или порядок блоков главной')
  }

  if (JSON.stringify(draftNavigation.value) !== JSON.stringify(publishedNavigation.value)) {
    changes.push('Изменено меню сайта')
  }

  if (JSON.stringify(draftModules.value) !== JSON.stringify(publishedModules.value)) {
    changes.push('Изменены активные модули')
  }

  return changes
})

const previewStyle = computed(() => {
  const theme = activeTheme.value
  const customization = activeCustomization.value

  const cardRadius =
    customization.radiusStyle === 'compact'
      ? '16px'
      : customization.radiusStyle === 'rounded'
        ? '28px'
        : activeTemplate.value?.cardStyle === 'flat'
          ? '14px'
          : activeTemplate.value?.cardStyle === 'bordered'
            ? '18px'
            : '24px'

  const controlRadius =
    customization.radiusStyle === 'compact'
      ? '12px'
      : customization.radiusStyle === 'rounded'
        ? '999px'
        : '16px'

  return {
    '--preview-primary': theme?.colors.primary ?? '#0F2A5E',
    '--preview-secondary': theme?.colors.secondary ?? '#1A3A7A',
    '--preview-accent': theme?.colors.accent ?? '#C9A030',
    '--preview-surface': theme?.colors.surface ?? '#F6F8FC',
    '--preview-text': theme?.colors.text ?? '#0F1E3C',
    '--preview-card-radius': cardRadius,
    '--preview-control-radius': controlRadius,
    '--preview-section-space': customization.density === 'compact' ? '18px' : '28px',
    '--preview-border-width': customization.contrast === 'high' ? '2px' : '1px',
    '--preview-button-shadow':
      customization.buttonStyle === 'soft' ? '0 12px 28px rgba(15, 42, 94, 0.18)' : 'none',
  }
})

const previewClass = computed(() => [
  `preview-frame--${device.value}`,
  `preview-frame--button-${activeCustomization.value.buttonStyle}`,
  `preview-frame--density-${activeCustomization.value.density}`,
  `preview-frame--contrast-${activeCustomization.value.contrast}`,
  `preview-frame--hero-${activeTemplate.value?.heroStyle ?? 'large'}`,
  `preview-frame--menu-${activeTemplate.value?.menuStyle ?? 'top'}`,
  `preview-frame--cards-${activeTemplate.value?.cardStyle ?? 'soft'}`,
])

function labelForHomeBlock(key: string) {
  switch (key) {
    case 'hero':
      return 'Hero'
    case 'quick-links':
      return 'Быстрые ссылки'
    case 'news':
      return 'Новости'
    case 'about':
      return 'О школе'
    default:
      return key
  }
}

function sectionTitle() {
  switch (page.value) {
    case 'news':
      return 'Лента новостей'
    case 'documents':
      return 'Документы школы'
    case 'contacts':
      return 'Контакты и приемная'
    default:
      return 'Главная страница'
  }
}
</script>

<template>
  <section class="preview-page">
    <div class="preview-page__header">
      <div>
        <h1>Предпросмотр</h1>
        <p>
          Проверка того, как будет выглядеть публичный сайт школы до публикации: тема,
          шаблон, кастомизация, меню и состав блоков.
        </p>
      </div>

      <div class="preview-page__badges">
        <span class="preview-badge">{{ activeTheme?.name ?? 'Theme' }}</span>
        <span class="preview-badge">{{ activeTemplate?.name ?? 'Template' }}</span>
        <span class="preview-badge">{{ mode === 'draft' ? 'Черновик' : 'Публикация' }}</span>
      </div>
    </div>

    <div class="preview-page__layout">
      <aside class="preview-sidebar">
        <section class="preview-card">
          <div class="preview-card__header">
            <h2>Режим</h2>
          </div>
          <div class="toggle-row">
            <button
              v-for="item in modeOptions"
              :key="item.value"
              class="toggle-chip"
              :class="{ 'toggle-chip--active': mode === item.value }"
              @click="mode = item.value"
            >
              {{ item.label }}
            </button>
          </div>
        </section>

        <section class="preview-card">
          <div class="preview-card__header">
            <h2>Устройство</h2>
          </div>
          <div class="toggle-row">
            <button
              v-for="item in deviceOptions"
              :key="item.value"
              class="toggle-chip"
              :class="{ 'toggle-chip--active': device === item.value }"
              @click="device = item.value"
            >
              {{ item.label }}
            </button>
          </div>
        </section>

        <section class="preview-card">
          <div class="preview-card__header">
            <h2>Страница</h2>
          </div>
          <div class="toggle-grid">
            <button
              v-for="item in pageOptions"
              :key="item.value"
              class="toggle-chip"
              :class="{ 'toggle-chip--active': page === item.value }"
              @click="page = item.value"
            >
              {{ item.label }}
            </button>
          </div>
        </section>

        <section class="preview-card">
          <div class="preview-card__header">
            <h2>Сводка</h2>
          </div>
          <dl class="summary-list">
            <div>
              <dt>Школа</dt>
              <dd>{{ schoolName }}</dd>
            </div>
            <div>
              <dt>Меню</dt>
              <dd>{{ activeNavigation.length }} пунктов</dd>
            </div>
            <div>
              <dt>Модули</dt>
              <dd>{{ activeModules.length }} активных</dd>
            </div>
            <div>
              <dt>Блоки главной</dt>
              <dd>{{ activeHomeBlocks.length }}</dd>
            </div>
            <div>
              <dt>Новости</dt>
              <dd>{{ newsItems.length }} в превью</dd>
            </div>
            <div>
              <dt>Документы</dt>
              <dd>{{ documentItems.length }} в превью</dd>
            </div>
          </dl>
        </section>

        <section class="preview-card">
          <div class="preview-card__header">
            <h2>Непубликованные изменения</h2>
          </div>
          <ul class="change-list">
            <li v-if="draftDiff.length === 0">Сейчас черновик совпадает с опубликованной версией.</li>
            <li v-for="item in draftDiff" v-else :key="item">{{ item }}</li>
          </ul>
        </section>
      </aside>

      <div class="preview-stage">
        <div class="preview-toolbar">
          <strong>{{ sectionTitle() }}</strong>
          <span>{{ device === 'mobile' ? 'Мобильный экран' : 'Десктопный экран' }}</span>
        </div>

        <div class="preview-frame-wrap">
          <div class="preview-frame" :class="previewClass" :style="previewStyle">
            <div class="preview-frame__topline">
              <span>{{ schoolPhone }}</span>
              <span>{{ schoolAddress }}</span>
              <span>{{ schoolEmail }}</span>
            </div>

            <div class="preview-frame__nav">
              <div class="preview-frame__brand">
                <div class="preview-frame__logo">Ш</div>
                <div>
                  <strong>{{ schoolName }}</strong>
                  <small>{{ schoolCity }}</small>
                </div>
              </div>

              <div class="preview-frame__menu">
                <span v-for="item in activeNavigation.slice(0, device === 'mobile' ? 4 : 7)" :key="item.key">
                  {{ item.label }}
                </span>
              </div>
            </div>

            <div class="preview-frame__content">
              <template v-if="page === 'home'">
                <section
                  v-for="block in activeHomeBlocks"
                  :key="block.key"
                  class="preview-section"
                >
                  <template v-if="block.key === 'hero'">
                    <div class="hero-preview">
                      <div class="hero-preview__copy">
                        <p class="hero-preview__eyebrow">{{ schoolCity }}</p>
                        <h2>{{ schoolHeroTitle }}</h2>
                        <p>{{ schoolHeroText }}</p>
                        <div class="hero-preview__actions">
                          <button class="preview-btn preview-btn--primary">Новости</button>
                          <button class="preview-btn preview-btn--secondary">Контакты</button>
                        </div>
                      </div>

                      <div class="hero-preview__meta">
                        <div class="hero-preview__meta-card">
                          <small>Режим работы</small>
                          <strong>{{ schoolHours }}</strong>
                        </div>
                        <div class="hero-preview__meta-card">
                          <small>Активные модули</small>
                          <strong>{{ activeModules.map((item) => item.title).slice(0, 3).join(' · ') }}</strong>
                        </div>
                      </div>
                    </div>

                    <div class="hero-preview__stats">
                      <div v-for="item in schoolStats.slice(0, 4)" :key="item.label" class="mini-stat">
                        <strong>{{ item.value }}</strong>
                        <span>{{ item.label }}</span>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="block.key === 'quick-links'">
                    <div class="section-heading">
                      <h3>{{ labelForHomeBlock(block.key) }}</h3>
                    </div>
                    <div class="tile-grid">
                      <article
                        v-for="item in activeModules.slice(0, 4)"
                        :key="item.key"
                        class="preview-tile"
                      >
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.description }}</p>
                      </article>
                    </div>
                  </template>

                  <template v-else-if="block.key === 'news'">
                    <div class="section-heading">
                      <h3>{{ labelForHomeBlock(block.key) }}</h3>
                    </div>
                    <div class="tile-grid">
                      <article v-for="item in newsItems" :key="item.id" class="preview-tile">
                        <span class="preview-tag">{{ item.status === 'published' ? 'Опубликовано' : 'Черновик' }}</span>
                        <strong>{{ item.title || 'Новая публикация' }}</strong>
                        <p>{{ item.excerpt || 'Короткий анонс новости появится здесь.' }}</p>
                      </article>
                    </div>
                  </template>

                  <template v-else-if="block.key === 'about'">
                    <div class="section-heading">
                      <h3>{{ labelForHomeBlock(block.key) }}</h3>
                    </div>
                    <div class="about-preview">
                      <div class="about-preview__text">
                        <p>
                          {{ schoolName }}. Публичный сайт собирает ключевую информацию школы:
                          новости, документы, контакты и основные разделы.
                        </p>
                      </div>
                      <div class="about-preview__list">
                        <span v-for="item in activeModules.slice(0, 4)" :key="item.key">
                          {{ item.title }}
                        </span>
                      </div>
                    </div>
                  </template>
                </section>
              </template>

              <template v-else-if="page === 'news'">
                <section class="preview-section">
                  <div class="section-heading">
                    <h3>Новости школы</h3>
                    <span>{{ newsItems.length }} материалов</span>
                  </div>
                  <div class="list-stack">
                    <article v-for="item in newsItems" :key="item.id" class="list-card">
                      <div class="list-card__top">
                        <span class="preview-tag">{{ item.category }}</span>
                        <span>{{ item.date }}</span>
                      </div>
                      <strong>{{ item.title || 'Новая публикация' }}</strong>
                      <p>{{ item.excerpt || 'Короткое описание новости для превью.' }}</p>
                    </article>
                  </div>
                </section>
              </template>

              <template v-else-if="page === 'documents'">
                <section class="preview-section">
                  <div class="section-heading">
                    <h3>Документы школы</h3>
                    <span>{{ documentItems.length }} файлов</span>
                  </div>
                  <div class="list-stack">
                    <article v-for="item in documentItems" :key="item.id" class="list-card">
                      <div class="list-card__top">
                        <span class="preview-tag">{{ item.category }}</span>
                        <span>{{ item.size || 'PDF' }}</span>
                      </div>
                      <strong>{{ item.title || 'Новый документ' }}</strong>
                      <p>{{ item.description || 'Описание документа для публичной страницы.' }}</p>
                    </article>
                  </div>
                </section>
              </template>

              <template v-else>
                <section class="preview-section">
                  <div class="section-heading">
                    <h3>Контакты</h3>
                    <span>Контактная информация школы</span>
                  </div>
                  <div class="contacts-grid">
                    <article class="preview-tile">
                      <strong>Адрес</strong>
                      <p>{{ schoolAddress }}</p>
                    </article>
                    <article class="preview-tile">
                      <strong>Телефон</strong>
                      <p>{{ schoolPhone }}</p>
                    </article>
                    <article class="preview-tile">
                      <strong>Email</strong>
                      <p>{{ schoolEmail }}</p>
                    </article>
                    <article class="preview-tile">
                      <strong>Часы работы</strong>
                      <p>{{ schoolHours }}</p>
                    </article>
                  </div>
                </section>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.preview-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    max-width: 760px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.preview-page__badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba($navy, .06);
  color: $navy;
  font-size: 13px;
  font-weight: 600;
}

.preview-page__layout {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
}

.preview-sidebar,
.preview-stage {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.preview-card__header h2 {
  font-size: 17px;
  color: $text-primary;
}

.toggle-row,
.toggle-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.toggle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.toggle-chip {
  border: 1px solid $border;
  background: $white;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  color: $text-secondary;
  transition: border-color $transition-fast, background $transition-fast, color $transition-fast;

  &--active {
    border-color: rgba($navy, .26);
    background: rgba($navy, .06);
    color: $navy;
  }
}

.summary-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 10px;
    border-top: 1px solid $border;
  }

  dt {
    font-size: 12px;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: $text-secondary;
  }

  dd {
    margin: 0;
    text-align: right;
    color: $text-primary;
    font-weight: 500;
  }
}

.change-list {
  margin-top: 14px;
  padding-left: 18px;
  display: grid;
  gap: 8px;

  li {
    color: $text-secondary;
    line-height: 1.5;
  }
}

.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: $radius-lg;
  border: 1px solid $border;
  background: $white;

  strong {
    color: $text-primary;
  }

  span {
    color: $text-secondary;
    font-size: 14px;
  }
}

.preview-frame-wrap {
  padding: 18px;
  border-radius: 28px;
  background: linear-gradient(180deg, #f8faff 0%, #edf2fb 100%);
  border: 1px solid rgba($navy, .08);
  overflow: auto;
}

.preview-frame {
  width: 100%;
  margin: 0 auto;
  background: var(--preview-surface);
  color: var(--preview-text);
  border-radius: 30px;
  border: 1px solid rgba($navy, .08);
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(11, 26, 58, .08);

  &--desktop {
    max-width: 1100px;
  }

  &--mobile {
    max-width: 390px;
  }

  &--menu-compact {
    .preview-frame__menu {
      gap: 10px;
      font-size: 12px;
    }
  }

  &--hero-centered {
    .hero-preview {
      text-align: center;
      grid-template-columns: 1fr;
    }

    .hero-preview__actions,
    .hero-preview__stats {
      justify-content: center;
    }
  }

  &--hero-minimal {
    .hero-preview {
      padding: 24px;
    }

    .hero-preview h2 {
      font-size: 28px;
    }
  }

  &--cards-flat {
    .preview-tile,
    .list-card,
    .hero-preview__meta-card,
    .mini-stat {
      box-shadow: none;
      background: rgba(255, 255, 255, .78);
    }
  }

  &--button-soft {
    .preview-btn--primary {
      box-shadow: var(--preview-button-shadow);
    }
  }

  &--button-outline {
    .preview-btn--primary,
    .preview-btn--secondary {
      background: transparent;
      color: var(--preview-primary);
      border: var(--preview-border-width) solid currentColor;
    }
  }

  &--density-compact {
    .preview-frame__content {
      gap: 14px;
    }
  }

  &--contrast-high {
    .preview-tile,
    .list-card,
    .mini-stat,
    .hero-preview__meta-card {
      border-width: 2px;
    }
  }
}

.preview-frame__topline {
  display: flex;
  gap: 18px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 12px 20px;
  background: var(--preview-primary);
  color: rgba(255, 255, 255, .86);
  font-size: 12px;
}

.preview-frame__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  background: $white;
  border-bottom: 1px solid rgba($navy, .08);
}

.preview-frame__brand {
  display: flex;
  align-items: center;
  gap: 12px;

  strong,
  small {
    display: block;
  }

  strong {
    color: $text-primary;
    font-size: 14px;
  }

  small {
    margin-top: 4px;
    color: $text-secondary;
    font-size: 12px;
  }
}

.preview-frame__logo {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--preview-primary);
  color: $white;
  font-weight: 700;
}

.preview-frame__menu {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  color: $text-secondary;
  font-size: 13px;
}

.preview-frame__content {
  display: grid;
  gap: var(--preview-section-space);
  padding: 20px;
}

.preview-section {
  display: grid;
  gap: 16px;
}

.hero-preview {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, .8fr);
  gap: 18px;
  padding: 28px;
  border-radius: var(--preview-card-radius);
  background: linear-gradient(135deg, var(--preview-primary), var(--preview-secondary));
  color: $white;
}

.hero-preview__eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: rgba(255, 255, 255, .65);
}

.hero-preview h2 {
  margin-top: 10px;
  font-size: 34px;
  line-height: 1.02;
}

.hero-preview p {
  margin-top: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, .82);
}

.hero-preview__actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.hero-preview__meta {
  display: grid;
  gap: 12px;
}

.hero-preview__meta-card,
.mini-stat,
.preview-tile,
.list-card {
  border-radius: var(--preview-card-radius);
  border: var(--preview-border-width) solid rgba(15, 42, 94, .08);
  background: $white;
}

.hero-preview__meta-card {
  padding: 16px;
  background: rgba(255, 255, 255, .12);
  border-color: rgba(255, 255, 255, .14);

  small,
  strong {
    display: block;
  }

  small {
    color: rgba(255, 255, 255, .64);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: .08em;
  }

  strong {
    margin-top: 8px;
    color: $white;
    line-height: 1.5;
  }
}

.hero-preview__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.mini-stat {
  padding: 16px;
  text-align: center;
  background: rgba(255, 255, 255, .07);
  border-color: rgba(255, 255, 255, .12);

  strong,
  span {
    display: block;
  }

  strong {
    color: $white;
    font-size: 20px;
  }

  span {
    margin-top: 8px;
    color: rgba(255, 255, 255, .68);
    font-size: 12px;
  }
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h3 {
    font-size: 20px;
    color: var(--preview-primary);
  }

  span {
    color: $text-secondary;
    font-size: 13px;
  }
}

.tile-grid,
.contacts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.preview-frame--mobile {
  .preview-frame__topline {
    display: none;
  }

  .preview-frame__nav,
  .hero-preview,
  .tile-grid,
  .contacts-grid,
  .hero-preview__stats {
    grid-template-columns: 1fr;
  }

  .preview-frame__nav {
    align-items: flex-start;
    flex-direction: column;
  }
}

.preview-tile,
.list-card {
  padding: 16px;

  strong,
  p {
    display: block;
  }

  strong {
    color: $text-primary;
    line-height: 1.4;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    line-height: 1.55;
    font-size: 14px;
  }
}

.preview-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba($navy, .08);
  color: var(--preview-primary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.list-stack {
  display: grid;
  gap: 12px;
}

.list-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: $text-secondary;
}

.about-preview {
  display: grid;
  gap: 14px;
}

.about-preview__text p {
  color: $text-secondary;
  line-height: 1.7;
}

.about-preview__list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba($navy, .06);
    color: var(--preview-primary);
    font-size: 13px;
    font-weight: 600;
  }
}

.preview-btn {
  border: none;
  cursor: default;
  border-radius: var(--preview-control-radius);
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  transition: none;

  &--primary {
    background: var(--preview-accent);
    color: #1f2430;
  }

  &--secondary {
    background: rgba(255, 255, 255, .08);
    color: $white;
    border: 1px solid rgba(255, 255, 255, .2);
  }
}
</style>
