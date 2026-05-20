import { computed, reactive } from 'vue'

const STORAGE_KEY = 'school-pmr-admin-school-navigation'

export type SchoolNavigationKey =
  | 'home'
  | 'news'
  | 'teachers'
  | 'schedule'
  | 'gallery'
  | 'documents'
  | 'contacts'

export interface SchoolNavigationItem {
  key: SchoolNavigationKey
  label: string
  routeName:
    | 'school-home'
    | 'school-news'
    | 'school-teachers'
    | 'school-schedule'
    | 'school-gallery'
    | 'school-documents'
    | 'school-contacts'
  mobileIcon: 'home' | 'news' | 'calendar' | 'image' | 'phone' | 'users' | 'file'
  visible: boolean
  order: number
}

export interface SchoolNavigationDraft {
  draftItems: SchoolNavigationItem[]
  publishedItems: SchoolNavigationItem[]
}

type SchoolNavigationMap = Record<string, SchoolNavigationDraft>

const state = reactive<{
  drafts: SchoolNavigationMap
}>({
  drafts: {},
})

function createDefaultItems(): SchoolNavigationItem[] {
  return [
    { key: 'home', label: 'Главная', routeName: 'school-home', mobileIcon: 'home', visible: true, order: 0 },
    { key: 'news', label: 'Новости', routeName: 'school-news', mobileIcon: 'news', visible: true, order: 1 },
    { key: 'teachers', label: 'Педагоги', routeName: 'school-teachers', mobileIcon: 'users', visible: true, order: 2 },
    { key: 'schedule', label: 'Расписание', routeName: 'school-schedule', mobileIcon: 'calendar', visible: true, order: 3 },
    { key: 'gallery', label: 'Галерея', routeName: 'school-gallery', mobileIcon: 'image', visible: true, order: 4 },
    { key: 'documents', label: 'Документы', routeName: 'school-documents', mobileIcon: 'file', visible: true, order: 5 },
    { key: 'contacts', label: 'Контакты', routeName: 'school-contacts', mobileIcon: 'phone', visible: true, order: 6 },
  ]
}

function cloneItems(items: SchoolNavigationItem[]) {
  return items.map((item) => ({ ...item }))
}

function normalizeItems(items: SchoolNavigationItem[]) {
  return cloneItems(items)
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      ...item,
      order: index,
    }))
}

function makeDefaultDraft(): SchoolNavigationDraft {
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
    const parsed = JSON.parse(raw) as SchoolNavigationMap
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

export function ensureSchoolNavigationDraft(schoolSlug: string) {
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft()
    persistState()
  }

  return state.drafts[schoolSlug]
}

export function updateSchoolNavigationDraft(schoolSlug: string, items: SchoolNavigationItem[]) {
  ensureSchoolNavigationDraft(schoolSlug)
  state.drafts[schoolSlug].draftItems = normalizeItems(items)
  persistState()
}

export function resetSchoolNavigationDraft(schoolSlug: string) {
  ensureSchoolNavigationDraft(schoolSlug)
  state.drafts[schoolSlug].draftItems = cloneItems(state.drafts[schoolSlug].publishedItems)
  persistState()
}

export function publishSchoolNavigationDraft(schoolSlug: string) {
  ensureSchoolNavigationDraft(schoolSlug)
  state.drafts[schoolSlug].publishedItems = cloneItems(state.drafts[schoolSlug].draftItems)
  persistState()
}

export function getPublishedSchoolNavigation(schoolSlug: string) {
  return normalizeItems(ensureSchoolNavigationDraft(schoolSlug).publishedItems)
}

export function useSchoolNavigationDraft(schoolSlug: string) {
  ensureSchoolNavigationDraft(schoolSlug)

  return {
    draftItems: computed(() =>
      normalizeItems(ensureSchoolNavigationDraft(schoolSlug).draftItems)
    ),
    publishedItems: computed(() =>
      normalizeItems(ensureSchoolNavigationDraft(schoolSlug).publishedItems)
    ),
  }
}
