import { computed, reactive } from 'vue'

const STORAGE_KEY = 'school-pmr-admin-school-home-blocks'

export type SchoolHomeBlockKey = 'hero' | 'quick-links' | 'news' | 'about'

export interface SchoolHomeBlockItem {
  key: SchoolHomeBlockKey
  title: string
  description: string
  visible: boolean
  order: number
}

export interface SchoolHomeBlocksDraft {
  draftItems: SchoolHomeBlockItem[]
  publishedItems: SchoolHomeBlockItem[]
}

type SchoolHomeBlocksMap = Record<string, SchoolHomeBlocksDraft>

const state = reactive<{
  drafts: SchoolHomeBlocksMap
}>({
  drafts: {},
})

function createDefaultItems(): SchoolHomeBlockItem[] {
  return [
    {
      key: 'hero',
      title: 'Первый экран',
      description: 'Заголовок школы, подзаголовок, CTA-кнопки и карточка с основными данными.',
      visible: true,
      order: 0,
    },
    {
      key: 'quick-links',
      title: 'Быстрые ссылки',
      description: 'Карточки с переходами в ключевые разделы школы.',
      visible: true,
      order: 1,
    },
    {
      key: 'news',
      title: 'Последние новости',
      description: 'Лента последних опубликованных новостей школы на главной странице.',
      visible: true,
      order: 2,
    },
    {
      key: 'about',
      title: 'О школе',
      description: 'Краткое описание школы и блок преимуществ.',
      visible: true,
      order: 3,
    },
  ]
}

function cloneItems(items: SchoolHomeBlockItem[]) {
  return items.map((item) => ({ ...item }))
}

function normalizeItems(items: SchoolHomeBlockItem[]) {
  return cloneItems(items)
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      ...item,
      order: index,
    }))
}

function makeDefaultDraft(): SchoolHomeBlocksDraft {
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
    const parsed = JSON.parse(raw) as SchoolHomeBlocksMap
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

export function ensureSchoolHomeBlocksDraft(schoolSlug: string) {
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft()
    persistState()
  }

  return state.drafts[schoolSlug]
}

export function updateSchoolHomeBlocksDraft(schoolSlug: string, items: SchoolHomeBlockItem[]) {
  ensureSchoolHomeBlocksDraft(schoolSlug)
  state.drafts[schoolSlug].draftItems = normalizeItems(items)
  persistState()
}

export function resetSchoolHomeBlocksDraft(schoolSlug: string) {
  ensureSchoolHomeBlocksDraft(schoolSlug)
  state.drafts[schoolSlug].draftItems = cloneItems(state.drafts[schoolSlug].publishedItems)
  persistState()
}

export function publishSchoolHomeBlocksDraft(schoolSlug: string) {
  ensureSchoolHomeBlocksDraft(schoolSlug)
  state.drafts[schoolSlug].publishedItems = cloneItems(state.drafts[schoolSlug].draftItems)
  persistState()
}

export function getPublishedSchoolHomeBlocks(schoolSlug: string) {
  return normalizeItems(ensureSchoolHomeBlocksDraft(schoolSlug).publishedItems)
}

export function useSchoolHomeBlocksDraft(schoolSlug: string) {
  ensureSchoolHomeBlocksDraft(schoolSlug)

  return {
    draftItems: computed(() =>
      normalizeItems(ensureSchoolHomeBlocksDraft(schoolSlug).draftItems),
    ),
    publishedItems: computed(() =>
      normalizeItems(ensureSchoolHomeBlocksDraft(schoolSlug).publishedItems),
    ),
  }
}
