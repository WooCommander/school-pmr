<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { categoryLabels, statusLabels as newsStatusLabels } from '@/data/news'
import {
  documentCategoryLabels,
  documentStatusLabels,
} from '@/data/documents'
import { useAdminAuth } from '@/modules/admin/state/admin-auth'
import { getSchoolDocuments } from '@/modules/admin/state/school-documents'
import { getSchoolNews } from '@/modules/admin/state/school-news'
import { getSchoolInvites } from '@/modules/admin/state/school-users'
import { ensureSchoolDesignDraft } from '@/modules/admin/state/school-design'
import { ensureSchoolNavigationDraft } from '@/modules/admin/state/school-navigation'
import { ensureSchoolModulesDraft } from '@/modules/admin/state/school-modules'
import { ensureSchoolSettingsDraft } from '@/modules/admin/state/school-settings'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

type HistoryEntity = 'all' | 'news' | 'documents' | 'invites' | 'system'

interface HistoryItem {
  id: string
  entity: Exclude<HistoryEntity, 'all'>
  title: string
  description: string
  actor: string
  status: string
  createdAt: string
}

const route = useRoute()
const { currentUser } = useAdminAuth()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const school = computed(() => getManagedSchoolBySlug(schoolSlug.value))

const entityFilter = ref<HistoryEntity>('all')
const actorFilter = ref('all')

const newsItems = computed(() => getSchoolNews(schoolSlug.value))
const documentItems = computed(() => getSchoolDocuments(schoolSlug.value))
const invites = computed(() => getSchoolInvites(schoolSlug.value))

const settingsDraft = computed(() => ensureSchoolSettingsDraft(schoolSlug.value))
const designDraft = computed(() => ensureSchoolDesignDraft(schoolSlug.value))
const navigationDraft = computed(() => ensureSchoolNavigationDraft(schoolSlug.value))
const modulesDraft = computed(() => ensureSchoolModulesDraft(schoolSlug.value))

const systemDrafts = computed(() => {
  const baseSchool = school.value

  const generalDirty =
    settingsDraft.value.general.fullName !== (baseSchool?.fullName ?? '') ||
    settingsDraft.value.general.shortName !== (baseSchool?.shortName ?? '') ||
    settingsDraft.value.general.type !== (baseSchool?.type ?? '') ||
    settingsDraft.value.general.city !== (baseSchool?.city ?? '') ||
    settingsDraft.value.general.description !==
      (baseSchool
        ? `${baseSchool.fullName} - публичный сайт школы в единой системе управления.`
        : '')

  const contactsDirty =
    settingsDraft.value.contacts.address !== (baseSchool?.address ?? '') ||
    settingsDraft.value.contacts.phone !== (baseSchool?.phone ?? '') ||
    settingsDraft.value.contacts.email !== (baseSchool?.email ?? '') ||
    settingsDraft.value.contacts.hours !== (baseSchool?.hours ?? '') ||
    settingsDraft.value.contacts.mapLabel !==
      (baseSchool ? `${baseSchool.shortName}, ${baseSchool.city}` : '') ||
    settingsDraft.value.contacts.mapUrl !== ''

  const templateDirty =
    designDraft.value.draftTemplateKey !== designDraft.value.publishedTemplateKey
  const themeDirty =
    designDraft.value.draftThemeKey !== designDraft.value.publishedThemeKey
  const navigationDirty =
    JSON.stringify(navigationDraft.value.draftItems) !==
    JSON.stringify(navigationDraft.value.publishedItems)
  const modulesDirty =
    JSON.stringify(modulesDraft.value.draftItems) !==
    JSON.stringify(modulesDraft.value.publishedItems)

  return [
    { label: 'Общая информация', dirty: generalDirty },
    { label: 'Контакты', dirty: contactsDirty },
    { label: 'Шаблон', dirty: templateDirty },
    { label: 'Тема', dirty: themeDirty },
    { label: 'Меню', dirty: navigationDirty },
    { label: 'Модули', dirty: modulesDirty },
  ]
})

const historyItems = computed<HistoryItem[]>(() => {
  const items: HistoryItem[] = [
    ...newsItems.value.map((item) => ({
      id: `news-${item.id}`,
      entity: 'news' as const,
      title:
        item.status === 'published'
          ? 'Новость опубликована'
          : 'Черновик новости обновлен',
      description: `${item.title} · ${categoryLabels[item.category]}`,
      actor: item.author,
      status: newsStatusLabels[item.status],
      createdAt: item.updatedAt,
    })),
    ...documentItems.value.map((item) => ({
      id: `document-${item.id}`,
      entity: 'documents' as const,
      title:
        item.status === 'published'
          ? 'Документ опубликован'
          : 'Черновик документа обновлен',
      description: `${item.title} · ${documentCategoryLabels[item.category]}`,
      actor: currentUser.value?.name || 'Администратор школы',
      status: documentStatusLabels[item.status],
      createdAt: item.updatedAt,
    })),
    ...invites.value.map((invite) => ({
      id: `invite-${invite.id}`,
      entity: 'invites' as const,
      title: 'Создано приглашение в админку',
      description: `${invite.name} · ${invite.email}`,
      actor: currentUser.value?.name || 'Администратор школы',
      status: invite.status === 'pending' ? 'Ожидает принятия' : 'Отправлено',
      createdAt: invite.createdAt,
    })),
  ]

  if (systemDrafts.value.some((item) => item.dirty)) {
    items.push({
      id: 'system-drafts',
      entity: 'system',
      title: 'Есть неподтвержденные изменения конфигурации',
      description: systemDrafts.value
        .filter((item) => item.dirty)
        .map((item) => item.label)
        .join(', '),
      actor: currentUser.value?.name || 'Администратор школы',
      status: 'Требует публикации',
      createdAt: new Date().toISOString(),
    })
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
})

const actorOptions = computed(() => [
  'all',
  ...Array.from(new Set(historyItems.value.map((item) => item.actor))),
])

const filteredHistory = computed(() =>
  historyItems.value.filter((item) => {
    const matchesEntity =
      entityFilter.value === 'all' || item.entity === entityFilter.value
    const matchesActor =
      actorFilter.value === 'all' || item.actor === actorFilter.value

    return matchesEntity && matchesActor
  }),
)

const publishedContentCount = computed(
  () =>
    newsItems.value.filter((item) => item.status === 'published').length +
    documentItems.value.filter((item) => item.status === 'published').length,
)

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function entityLabel(value: HistoryEntity) {
  switch (value) {
    case 'news':
      return 'Новости'
    case 'documents':
      return 'Документы'
    case 'invites':
      return 'Приглашения'
    case 'system':
      return 'Система'
    default:
      return 'Все сущности'
  }
}
</script>

<template>
  <section class="history-page">
    <div class="history-page__header">
      <div>
        <h1>История изменений</h1>
        <p>
          Хронология действий по школе: контент, документы, приглашения и текущее состояние
          системных черновиков.
        </p>
      </div>
    </div>

    <div class="history-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ historyItems.length }}</span>
        <span class="stat-card__label">Событий в истории</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ publishedContentCount }}</span>
        <span class="stat-card__label">Опубликованных материалов</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ invites.length }}</span>
        <span class="stat-card__label">Активных приглашений</span>
      </article>
    </div>

    <div class="history-page__grid">
      <section class="history-card">
        <div class="history-card__header">
          <h2>Лента изменений</h2>
          <p>Отфильтруйте события по сущности и участнику.</p>
        </div>

        <div class="filters">
          <select v-model="entityFilter">
            <option value="all">Все сущности</option>
            <option value="news">Новости</option>
            <option value="documents">Документы</option>
            <option value="invites">Приглашения</option>
            <option value="system">Система</option>
          </select>

          <select v-model="actorFilter">
            <option
              v-for="actor in actorOptions"
              :key="actor"
              :value="actor"
            >
              {{ actor === 'all' ? 'Все участники' : actor }}
            </option>
          </select>
        </div>

        <div v-if="filteredHistory.length" class="timeline">
          <article v-for="item in filteredHistory" :key="item.id" class="timeline-item">
            <div class="timeline-item__dot"></div>
            <div class="timeline-item__content">
              <div class="timeline-item__top">
                <span class="timeline-item__entity">{{ entityLabel(item.entity) }}</span>
                <time>{{ formatDate(item.createdAt) }}</time>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="timeline-item__meta">
                <span>{{ item.actor }}</span>
                <span>{{ item.status }}</span>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <p>По текущим фильтрам события не найдены.</p>
        </div>
      </section>

      <aside class="history-side">
        <section class="history-card">
          <div class="history-card__header">
            <h2>Состояние системы</h2>
          </div>

          <div class="system-list">
            <div v-for="item in systemDrafts" :key="item.label" class="system-row">
              <span>{{ item.label }}</span>
              <strong :class="{ 'is-dirty': item.dirty }">
                {{ item.dirty ? 'Есть черновик' : 'Актуально' }}
              </strong>
            </div>
          </div>
        </section>

        <section class="history-card">
          <div class="history-card__header">
            <h2>Ограничения MVP</h2>
          </div>

          <ul class="history-notes">
            <li>История собирается из текущих данных news, documents и invites.</li>
            <li>Rollback и полноценный audit log пока не подключены.</li>
            <li>Следующий уровень развития: отдельный журнал действий с сохранением автора и типа операции.</li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-page__header {
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

.history-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.history-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, .85fr);
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
}

.history-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card,
.history-card {
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

.history-card {
  padding: 20px;
}

.history-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.history-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.filters {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }

  select {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    background: $white;
    color: $text-primary;
  }
}

.timeline {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 14px;
  align-items: flex-start;
}

.timeline-item__dot {
  width: 12px;
  height: 12px;
  margin-top: 5px;
  border-radius: 999px;
  background: linear-gradient(135deg, $gold, #f0cf79);
  box-shadow: 0 0 0 4px rgba($gold, .15);
}

.timeline-item__content {
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;

  h3 {
    margin-top: 10px;
    font-size: 17px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.timeline-item__top,
.timeline-item__meta,
.system-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.timeline-item__top {
  flex-wrap: wrap;

  time {
    font-size: 12px;
    color: $text-muted;
  }
}

.timeline-item__entity {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  background: rgba($navy, .08);
  color: $navy;
  font-size: 12px;
  font-weight: 700;
}

.timeline-item__meta {
  margin-top: 12px;
  flex-wrap: wrap;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.system-list {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.system-row {
  border: 1px solid $border;
  border-radius: 12px;
  padding: 13px 14px;

  span {
    color: $text-secondary;
  }

  strong {
    color: $navy;
    font-size: 13px;
  }

  .is-dirty {
    color: #8b5a10;
  }
}

.history-notes {
  margin-top: 16px;
  display: grid;
  gap: 8px;
  padding-left: 18px;

  li {
    color: $text-secondary;
    line-height: 1.5;
  }
}
</style>
