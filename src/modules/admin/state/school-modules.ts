import { computed, reactive } from 'vue'

const STORAGE_KEY = 'school-pmr-admin-school-modules'

export type SchoolModuleKey =
  | 'news'
  | 'teachers'
  | 'schedule'
  | 'gallery'
  | 'documents'
  | 'contacts'

export interface SchoolModuleItem {
  key: SchoolModuleKey
  title: string
  description: string
  enabled: boolean
}

export interface SchoolModulesDraft {
  draftItems: SchoolModuleItem[]
  publishedItems: SchoolModuleItem[]
}

type SchoolModulesMap = Record<string, SchoolModulesDraft>

const state = reactive<{
  drafts: SchoolModulesMap
}>({
  drafts: {},
})

function createDefaultItems(): SchoolModuleItem[] {
  return [
    {
      key: 'news',
      title: 'Новости',
      description: 'Новостная лента и детальные публикации школы.',
      enabled: true,
    },
    {
      key: 'teachers',
      title: 'Педагоги',
      description: 'Список педагогов и административной команды.',
      enabled: true,
    },
    {
      key: 'schedule',
      title: 'Расписание',
      description: 'Учебное расписание и режим звонков.',
      enabled: true,
    },
    {
      key: 'gallery',
      title: 'Галерея',
      description: 'Фотографии мероприятий и школьной жизни.',
      enabled: true,
    },
    {
      key: 'documents',
      title: 'Документы',
      description: 'Публичные документы, локальные акты и отчёты.',
      enabled: true,
    },
    {
      key: 'contacts',
      title: 'Контакты',
      description: 'Адрес, телефон, email и карта школы.',
      enabled: true,
    },
  ]
}

function cloneItems(items: SchoolModuleItem[]) {
  return items.map((item) => ({ ...item }))
}

function makeDefaultDraft(): SchoolModulesDraft {
  const items = createDefaultItems()

  return {
    draftItems: cloneItems(items),
    publishedItems: cloneItems(items),
  }
}

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as SchoolModulesMap
    state.drafts = parsed
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

function persistState() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drafts))
}

loadState()

export function ensureSchoolModulesDraft(schoolSlug: string) {
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft()
    persistState()
  }

  return state.drafts[schoolSlug]
}

export function getDefaultSchoolModulesDraft() {
  return makeDefaultDraft()
}

export function updateSchoolModulesDraft(schoolSlug: string, items: SchoolModuleItem[]) {
  ensureSchoolModulesDraft(schoolSlug)
  state.drafts[schoolSlug].draftItems = cloneItems(items)
  persistState()
}

export function resetSchoolModulesDraft(schoolSlug: string) {
  ensureSchoolModulesDraft(schoolSlug)
  state.drafts[schoolSlug].draftItems = cloneItems(state.drafts[schoolSlug].publishedItems)
  persistState()
}

export function publishSchoolModulesDraft(schoolSlug: string) {
  ensureSchoolModulesDraft(schoolSlug)
  state.drafts[schoolSlug].publishedItems = cloneItems(state.drafts[schoolSlug].draftItems)
  persistState()
}

export function isSchoolModuleEnabled(schoolSlug: string, moduleKey: SchoolModuleKey) {
  return (
    ensureSchoolModulesDraft(schoolSlug).publishedItems.find((item) => item.key === moduleKey)
      ?.enabled ?? true
  )
}

export function useSchoolModulesDraft(schoolSlug: string) {
  ensureSchoolModulesDraft(schoolSlug)

  return {
    draftItems: computed(() => cloneItems(ensureSchoolModulesDraft(schoolSlug).draftItems)),
    publishedItems: computed(() => cloneItems(ensureSchoolModulesDraft(schoolSlug).publishedItems)),
  }
}
