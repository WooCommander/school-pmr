import { computed, reactive } from 'vue'
import {
  categoryLabels,
  cloneSeedNews,
  statusLabels,
  type NewsCategory,
  type NewsItem,
  type NewsStatus,
} from '@/data/news'

const STORAGE_KEY = 'school-pmr-admin-news'

const state = reactive<{
  items: NewsItem[]
}>({
  items: [],
})

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    state.items = cloneSeedNews()
    persistState()
    return
  }

  try {
    const parsed = JSON.parse(raw) as NewsItem[]
    state.items = parsed
  } catch {
    state.items = cloneSeedNews()
    window.localStorage.removeItem(STORAGE_KEY)
    persistState()
  }
}

function persistState() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
}

function cloneNewsItem(item: NewsItem) {
  return { ...item }
}

function sortNews(items: NewsItem[]) {
  return items
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function nextNewsId() {
  return state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

loadState()

export function getSchoolNews(schoolSlug: string) {
  return sortNews(state.items.filter((item) => item.schoolSlug === schoolSlug))
}

export function getPublishedSchoolNews(schoolSlug: string) {
  return sortNews(
    state.items.filter(
      (item) => item.schoolSlug === schoolSlug && item.status === 'published',
    ),
  )
}

export function getSchoolNewsItem(schoolSlug: string, id: number) {
  return state.items.find((item) => item.schoolSlug === schoolSlug && item.id === id) ?? null
}

export function getPublishedSchoolNewsItem(schoolSlug: string, id: number) {
  return (
    state.items.find(
      (item) =>
        item.schoolSlug === schoolSlug && item.id === id && item.status === 'published',
    ) ?? null
  )
}

export function saveSchoolNews(item: NewsItem) {
  const index = state.items.findIndex((entry) => entry.id === item.id)

  if (index >= 0) {
    state.items[index] = cloneNewsItem(item)
  } else {
    state.items.push(cloneNewsItem(item))
  }

  persistState()
}

export function createSchoolNewsDraft(
  schoolSlug: string,
  overrides: Partial<NewsItem> = {},
): NewsItem {
  const now = new Date()
  const isoDate = now.toISOString().slice(0, 10)
  const isoDateTime = now.toISOString()

  return {
    id: nextNewsId(),
    schoolSlug,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'events',
    date: isoDate,
    status: 'draft',
    author: 'Администратор школы',
    updatedAt: isoDateTime,
    ...overrides,
  }
}

export function updateSchoolNewsStatus(id: number, status: NewsStatus) {
  const item = state.items.find((entry) => entry.id === id)
  if (!item) return

  item.status = status
  item.updatedAt = new Date().toISOString()
  persistState()
}

export function deleteSchoolNews(id: number) {
  state.items = state.items.filter((item) => item.id !== id)
  persistState()
}

export function useSchoolNews(schoolSlug: string) {
  return {
    newsItems: computed(() => getSchoolNews(schoolSlug)),
    publishedNewsItems: computed(() => getPublishedSchoolNews(schoolSlug)),
  }
}

export { categoryLabels, statusLabels }
export type { NewsCategory, NewsItem, NewsStatus }
