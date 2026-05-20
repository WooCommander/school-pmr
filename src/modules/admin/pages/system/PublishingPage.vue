<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolDesignDraft,
  publishSchoolDraftTemplate,
  publishSchoolDraftTheme,
  resetSchoolDraftTemplate,
  resetSchoolDraftTheme,
} from '@/modules/admin/state/school-design'
import {
  ensureSchoolNavigationDraft,
  publishSchoolNavigationDraft,
  resetSchoolNavigationDraft,
} from '@/modules/admin/state/school-navigation'
import {
  ensureSchoolModulesDraft,
  publishSchoolModulesDraft,
  resetSchoolModulesDraft,
} from '@/modules/admin/state/school-modules'
import {
  ensureSchoolSettingsDraft,
  resetAllSchoolSettingsDrafts,
} from '@/modules/admin/state/school-settings'
import { getTemplatePresetByKey } from '@/modules/admin/data/template-presets'
import { getThemePresetByKey } from '@/modules/admin/data/theme-presets'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const school = computed(() => getManagedSchoolBySlug(schoolSlug.value))
const settingsDraft = computed(() => ensureSchoolSettingsDraft(schoolSlug.value))
const designDraft = computed(() => ensureSchoolDesignDraft(schoolSlug.value))
const navigationDraft = computed(() => ensureSchoolNavigationDraft(schoolSlug.value))
const modulesDraft = computed(() => ensureSchoolModulesDraft(schoolSlug.value))

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

const generalDirty = computed(() => {
  const baseSchool = school.value
  const draft = settingsDraft.value.general

  return (
    draft.fullName !== (baseSchool?.fullName ?? '') ||
    draft.shortName !== (baseSchool?.shortName ?? '') ||
    draft.type !== (baseSchool?.type ?? '') ||
    draft.city !== (baseSchool?.city ?? '') ||
    draft.description !==
      (baseSchool
        ? `${baseSchool.fullName} - публичный сайт школы в единой системе управления.`
        : '')
  )
})

const contactsDirty = computed(() => {
  const baseSchool = school.value
  const draft = settingsDraft.value.contacts

  return (
    draft.address !== (baseSchool?.address ?? '') ||
    draft.phone !== (baseSchool?.phone ?? '') ||
    draft.email !== (baseSchool?.email ?? '') ||
    draft.hours !== (baseSchool?.hours ?? '') ||
    draft.mapLabel !== (baseSchool ? `${baseSchool.shortName}, ${baseSchool.city}` : '') ||
    draft.mapUrl !== ''
  )
})

const templateDirty = computed(
  () => designDraft.value.draftTemplateKey !== designDraft.value.publishedTemplateKey,
)
const themeDirty = computed(
  () => designDraft.value.draftThemeKey !== designDraft.value.publishedThemeKey,
)
const navigationDirty = computed(
  () =>
    JSON.stringify(navigationDraft.value.draftItems) !==
    JSON.stringify(navigationDraft.value.publishedItems),
)
const modulesDirty = computed(
  () =>
    JSON.stringify(modulesDraft.value.draftItems) !==
    JSON.stringify(modulesDraft.value.publishedItems),
)

const changeItems = computed(() => [
  {
    key: 'general',
    title: 'Общая информация',
    status: generalDirty.value ? 'Есть черновик' : 'Без изменений',
    description: 'Название школы, тип, город и описание.',
    dirty: generalDirty.value,
    publishable: false,
  },
  {
    key: 'contacts',
    title: 'Контакты',
    status: contactsDirty.value ? 'Есть черновик' : 'Без изменений',
    description: 'Адрес, телефон, email и режим работы.',
    dirty: contactsDirty.value,
    publishable: false,
  },
  {
    key: 'template',
    title: 'Шаблон',
    status: templateDirty.value ? 'Готов к публикации' : 'Актуален',
    description: `${getTemplatePresetByKey(designDraft.value.draftTemplateKey)?.name ?? '—'} / опубликован: ${
      getTemplatePresetByKey(designDraft.value.publishedTemplateKey)?.name ?? '—'
    }`,
    dirty: templateDirty.value,
    publishable: true,
  },
  {
    key: 'theme',
    title: 'Тема',
    status: themeDirty.value ? 'Готова к публикации' : 'Актуальна',
    description: `${getThemePresetByKey(designDraft.value.draftThemeKey)?.name ?? '—'} / опубликована: ${
      getThemePresetByKey(designDraft.value.publishedThemeKey)?.name ?? '—'
    }`,
    dirty: themeDirty.value,
    publishable: true,
  },
  {
    key: 'navigation',
    title: 'Меню',
    status: navigationDirty.value ? 'Готово к публикации' : 'Актуально',
    description: 'Названия, порядок и видимость пунктов меню школы.',
    dirty: navigationDirty.value,
    publishable: true,
  },
  {
    key: 'modules',
    title: 'Модули сайта',
    status: modulesDirty.value ? 'Готовы к публикации' : 'Актуальны',
    description: 'Системные разделы школы: новости, документы, галерея и другие.',
    dirty: modulesDirty.value,
    publishable: true,
  },
])

const dirtyCount = computed(() => changeItems.value.filter((item) => item.dirty).length)
const publishableDirtyCount = computed(() =>
  changeItems.value.filter((item) => item.dirty && item.publishable).length,
)

function publishAllAvailable() {
  const hadChanges = publishableDirtyCount.value > 0

  if (templateDirty.value) publishSchoolDraftTemplate(schoolSlug.value)
  if (themeDirty.value) publishSchoolDraftTheme(schoolSlug.value)
  if (navigationDirty.value) publishSchoolNavigationDraft(schoolSlug.value)
  if (modulesDirty.value) publishSchoolModulesDraft(schoolSlug.value)

  statusTone.value = 'success'
  statusMessage.value = hadChanges
    ? 'Все доступные изменения опубликованы.'
    : 'Публиковать нечего: опубликованная версия уже актуальна.'
}

function discardAllDrafts() {
  resetSchoolDraftTemplate(schoolSlug.value)
  resetSchoolDraftTheme(schoolSlug.value)
  resetSchoolNavigationDraft(schoolSlug.value)
  resetSchoolModulesDraft(schoolSlug.value)
  resetAllSchoolSettingsDrafts(schoolSlug.value)

  statusTone.value = 'success'
  statusMessage.value = 'Все черновики школы сброшены.'
}
</script>

<template>
  <section class="publishing-page">
    <div class="publishing-page__header">
      <div>
        <h1>Публикация</h1>
        <p>
          Единая точка контроля изменений по школе. Здесь видно, какие разделы имеют черновики,
          а какие уже синхронизированы с опубликованной версией.
        </p>
      </div>

      <div class="publishing-page__actions">
        <button class="btn btn--outline" @click="discardAllDrafts">Сбросить все черновики</button>
        <button class="btn btn--primary" @click="publishAllAvailable">Опубликовать доступное</button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="publishing-page__status"
      :class="`publishing-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="publishing-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ dirtyCount }}</span>
        <span class="stat-card__label">Разделов с изменениями</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ publishableDirtyCount }}</span>
        <span class="stat-card__label">Из них можно опубликовать уже сейчас</span>
      </article>
    </div>

    <div class="publishing-page__grid">
      <div class="publishing-page__main">
        <section class="publishing-card">
          <div class="publishing-card__header">
            <h2>Сводка изменений</h2>
            <p>Текущее состояние по каждому блоку управления школой.</p>
          </div>

          <div class="change-list">
            <article
              v-for="item in changeItems"
              :key="item.key"
              class="change-item"
              :class="{ 'change-item--dirty': item.dirty }"
            >
              <div class="change-item__main">
                <div class="change-item__title-row">
                  <h3>{{ item.title }}</h3>
                  <span class="state-pill" :class="{ 'state-pill--dirty': item.dirty }">
                    {{ item.status }}
                  </span>
                </div>
                <p>{{ item.description }}</p>
              </div>

              <div class="change-item__side">
                <span v-if="item.publishable" class="change-item__flag">Публикуется сейчас</span>
                <span v-else class="change-item__flag change-item__flag--muted">Пока только draft</span>
              </div>
            </article>
          </div>
        </section>
      </div>

      <aside class="publishing-page__side">
        <section class="publishing-card">
          <div class="publishing-card__header">
            <h2>Что публикуется уже сейчас</h2>
          </div>

          <ul class="check-list">
            <li>Шаблон сайта</li>
            <li>Цветовая тема</li>
            <li>Меню школы</li>
            <li>Состав системных модулей</li>
          </ul>
        </section>

        <section class="publishing-card">
          <div class="publishing-card__header">
            <h2>Что еще в режиме MVP</h2>
          </div>

          <ul class="check-list">
            <li>Общая информация школы пока хранится как draft в админке.</li>
            <li>Контакты школы тоже пока доступны как draft-данные.</li>
            <li>Следующий шаг — подключить и эти блоки к полноценной публикации.</li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.publishing-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.publishing-page__header {
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

.publishing-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.publishing-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.publishing-page__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.stat-card,
.publishing-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
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

.publishing-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, .85fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.publishing-page__main,
.publishing-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.publishing-card {
  padding: 20px;
}

.publishing-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.publishing-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.change-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.change-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;

  @media (max-width: 820px) {
    flex-direction: column;
  }

  &--dirty {
    border-color: rgba($gold, .4);
    background: rgba($gold, .04);
  }
}

.change-item__main {
  flex: 1;
}

.change-item__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: flex-start;
  }

  h3 {
    font-size: 16px;
    color: $text-primary;
  }
}

.change-item__main p {
  margin-top: 10px;
  color: $text-secondary;
  line-height: 1.6;
}

.change-item__flag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba($navy, .08);
  color: $navy;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  &--muted {
    background: $surface;
    color: $text-secondary;
  }
}

.state-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .03em;
  background: $surface;
  color: $text-secondary;

  &--dirty {
    background: rgba($gold, .22);
    color: $navy-dark;
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
