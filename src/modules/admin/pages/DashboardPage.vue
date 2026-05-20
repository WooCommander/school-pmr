<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  getAdminRoleForSchool,
  getAdminRoleLabel,
  useAdminAuth,
} from '@/modules/admin/state/admin-auth'
import { getSchoolDocuments } from '@/modules/admin/state/school-documents'
import { getSchoolNews } from '@/modules/admin/state/school-news'
import { getTemplatePresetByKey } from '@/modules/admin/data/template-presets'
import { getThemePresetByKey } from '@/modules/admin/data/theme-presets'
import { ensureSchoolDesignDraft } from '@/modules/admin/state/school-design'
import { ensureSchoolSettingsDraft } from '@/modules/admin/state/school-settings'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'
import { getTeacherCountBySchoolState } from '@/modules/teachers/state/teacher-directory'

const route = useRoute()
const { currentUser } = useAdminAuth()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const currentSchool = computed(() => getManagedSchoolBySlug(schoolSlug.value))
const currentRole = computed(() => getAdminRoleForSchool(schoolSlug.value))
const currentRoleLabel = computed(() => getAdminRoleLabel(currentRole.value))
const settingsDraft = computed(() => ensureSchoolSettingsDraft(schoolSlug.value))
const designDraft = computed(() => ensureSchoolDesignDraft(schoolSlug.value))

const selectedTemplate = computed(() =>
  getTemplatePresetByKey(designDraft.value.draftTemplateKey),
)
const publishedTemplate = computed(() =>
  getTemplatePresetByKey(designDraft.value.publishedTemplateKey),
)
const selectedTheme = computed(() =>
  getThemePresetByKey(designDraft.value.draftThemeKey),
)
const publishedTheme = computed(() =>
  getThemePresetByKey(designDraft.value.publishedThemeKey),
)

const publicationState = computed(() => ({
  templateDirty:
    designDraft.value.draftTemplateKey !== designDraft.value.publishedTemplateKey,
  themeDirty:
    designDraft.value.draftThemeKey !== designDraft.value.publishedThemeKey,
}))

const teacherCount = computed(() => getTeacherCountBySchoolState(schoolSlug.value))
const documentCount = computed(() => getSchoolDocuments(schoolSlug.value).length)
const newsCount = computed(() => getSchoolNews(schoolSlug.value).length)

const quickActions = computed(() => [
  {
    title: 'Общая информация',
    description: 'Название школы, тип, город и описание.',
    to: { name: 'admin-school-settings-general', params: { slug: schoolSlug.value } },
  },
  {
    title: 'Контакты',
    description: 'Адрес, телефон, email и режим работы.',
    to: { name: 'admin-school-settings-contacts', params: { slug: schoolSlug.value } },
  },
  {
    title: 'Шаблон',
    description: 'Выбрать структуру школьного сайта.',
    to: { name: 'admin-school-design-templates', params: { slug: schoolSlug.value } },
  },
  {
    title: 'Тема',
    description: 'Настроить цветовую схему школы.',
    to: { name: 'admin-school-design-themes', params: { slug: schoolSlug.value } },
  },
  {
    title: 'Новости',
    description: 'Открыть список новостей и перейти к публикациям.',
    to: { name: 'admin-school-content-news-list', params: { slug: schoolSlug.value } },
  },
  {
    title: 'Документы',
    description: 'Проверить обязательные документы школы.',
    to: { name: 'admin-school-content-documents-list', params: { slug: schoolSlug.value } },
  },
])
</script>

<template>
  <section class="dashboard-page">
    <div class="dashboard-page__hero">
      <div class="dashboard-page__hero-main">
        <p class="dashboard-page__eyebrow">Кабинет школы</p>
        <h1>{{ settingsDraft.general.shortName || currentSchool?.shortName || 'Школа' }}</h1>
        <p class="dashboard-page__lead">
          {{ settingsDraft.general.fullName || currentSchool?.fullName }}
        </p>

        <div class="dashboard-page__meta">
          <span>{{ currentSchool?.city }}</span>
          <span>{{ currentRoleLabel || 'Роль не задана' }}</span>
          <span>{{ currentUser?.name }}</span>
        </div>
      </div>

      <div class="dashboard-page__hero-side">
        <div class="dashboard-page__status-card">
          <h2>Статус изменений</h2>
          <p v-if="publicationState.templateDirty || publicationState.themeDirty">
            Есть неопубликованные изменения оформления.
          </p>
          <p v-else>Шаблон и тема совпадают с опубликованной версией.</p>

          <ul class="status-list">
            <li :class="{ 'status-list__item--dirty': publicationState.templateDirty }">
              Шаблон:
              {{ publicationState.templateDirty ? 'черновик отличается' : 'актуален' }}
            </li>
            <li :class="{ 'status-list__item--dirty': publicationState.themeDirty }">
              Тема:
              {{ publicationState.themeDirty ? 'черновик отличается' : 'актуальна' }}
            </li>
          </ul>

          <RouterLink
            class="btn btn--primary dashboard-page__status-link"
            :to="{ name: 'admin-school-system-publishing', params: { slug: schoolSlug } }"
          >
            Перейти к публикации
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="dashboard-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ teacherCount }}</span>
        <span class="stat-card__label">Педагогов в данных школы</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ documentCount }}</span>
        <span class="stat-card__label">Документов в публичном разделе</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ newsCount }}</span>
        <span class="stat-card__label">Новостей в текущем mock-наборе</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ currentSchool?.stats?.[0]?.value || '—' }}</span>
        <span class="stat-card__label">Учеников по профилю школы</span>
      </article>
    </div>

    <div class="dashboard-page__grid">
      <div class="dashboard-page__main">
        <section class="dashboard-card">
          <div class="dashboard-card__header">
            <h2>Быстрые действия</h2>
            <p>Основные переходы для настройки школы и наполнения сайта.</p>
          </div>

          <div class="quick-actions">
            <RouterLink
              v-for="action in quickActions"
              :key="action.title"
              :to="action.to"
              class="quick-action"
            >
              <strong>{{ action.title }}</strong>
              <span>{{ action.description }}</span>
            </RouterLink>
          </div>
        </section>

        <section class="dashboard-card">
          <div class="dashboard-card__header">
            <h2>Черновик контактов</h2>
            <p>То, что сейчас будет использоваться после публикации контактного раздела.</p>
          </div>

          <dl class="details-list">
            <div>
              <dt>Адрес</dt>
              <dd>{{ settingsDraft.contacts.address || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd>{{ settingsDraft.contacts.phone || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ settingsDraft.contacts.email || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Часы работы</dt>
              <dd>{{ settingsDraft.contacts.hours || 'Не заполнено' }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside class="dashboard-page__side">
        <section class="dashboard-card">
          <div class="dashboard-card__header">
            <h2>Оформление</h2>
            <p>Текущие шаблон и тема для этой школы.</p>
          </div>

          <div class="design-summary">
            <div class="design-summary__item">
              <span>Шаблон</span>
              <strong>{{ selectedTemplate?.name }}</strong>
              <small>Опубликован: {{ publishedTemplate?.name }}</small>
            </div>
            <div class="design-summary__item">
              <span>Тема</span>
              <strong>{{ selectedTheme?.name }}</strong>
              <small>Опубликована: {{ publishedTheme?.name }}</small>
            </div>
          </div>
        </section>

        <section class="dashboard-card">
          <div class="dashboard-card__header">
            <h2>Публичный сайт</h2>
            <p>Быстрый переход в текущую школу.</p>
          </div>

          <RouterLink
            class="btn btn--outline dashboard-page__public-link"
            :to="{ name: 'school-home', params: { slug: schoolSlug } }"
          >
            Открыть сайт школы
          </RouterLink>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, .8fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.dashboard-page__hero-main,
.dashboard-page__status-card,
.dashboard-card,
.stat-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

.dashboard-page__hero-main {
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba($gold, .16), transparent 26%),
    linear-gradient(135deg, rgba($navy, .96), rgba($navy-light, .88));
  color: $white;
  border: none;
}

.dashboard-page__eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgba($white, .7);
}

.dashboard-page__hero-main h1 {
  margin-top: 8px;
  font-size: 34px;
  font-weight: 700;
}

.dashboard-page__lead {
  margin-top: 10px;
  max-width: 760px;
  line-height: 1.6;
  color: rgba($white, .88);
}

.dashboard-page__meta {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  span {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 7px 12px;
    background: rgba($white, .12);
    color: $white;
    font-size: 13px;
  }
}

.dashboard-page__status-card {
  padding: 20px;

  h2 {
    font-size: 18px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.status-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 18px;

  li {
    color: $text-secondary;
    line-height: 1.5;
  }
}

.status-list__item--dirty {
  color: #8b5a10;
  font-weight: 600;
}

.dashboard-page__status-link {
  margin-top: 18px;
  width: 100%;
}

.dashboard-page__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 18px 20px;
}

.stat-card__value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: $navy;
}

.stat-card__label {
  display: block;
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.5;
}

.dashboard-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, .9fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.dashboard-page__main,
.dashboard-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-card {
  padding: 20px;
}

.dashboard-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.dashboard-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.quick-actions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.quick-action {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid $border;
  border-radius: 12px;
  padding: 16px;
  transition: border-color $transition-fast, transform $transition-fast;

  &:hover {
    border-color: rgba($navy, .28);
    transform: translateY(-1px);
  }

  strong {
    color: $text-primary;
    font-size: 15px;
  }

  span {
    color: $text-secondary;
    line-height: 1.5;
    font-size: 14px;
  }
}

.details-list {
  margin-top: 16px;
  display: grid;
  gap: 12px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid $border;
  }

  dt {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: $text-secondary;
  }

  dd {
    margin: 0;
    text-align: right;
    color: $text-primary;
    line-height: 1.5;
  }
}

.design-summary {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.design-summary__item {
  border: 1px solid $border;
  border-radius: 12px;
  padding: 14px 16px;

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
    color: $navy;
    font-size: 18px;
  }

  small {
    display: block;
    margin-top: 8px;
    color: $text-secondary;
    line-height: 1.5;
  }
}

.dashboard-page__public-link {
  margin-top: 16px;
  width: 100%;
}
</style>
