import { computed, reactive } from 'vue'
import {
  cloneSeedDocuments,
  documentCategoryLabels,
  documentStatusLabels,
  type DocumentCategory,
  type DocumentItem,
  type DocumentStatus,
} from '@/data/documents'

const STORAGE_KEY = 'school-pmr-admin-documents'

const state = reactive<{
  items: DocumentItem[]
}>({
  items: [],
})

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    state.items = cloneSeedDocuments()
    persistState()
    return
  }

  try {
    const parsed = JSON.parse(raw) as DocumentItem[]
    state.items = parsed
  } catch {
    state.items = cloneSeedDocuments()
    window.localStorage.removeItem(STORAGE_KEY)
    persistState()
  }
}

function persistState() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
}

function cloneDocumentItem(item: DocumentItem) {
  return { ...item }
}

function sortDocuments(items: DocumentItem[]) {
  return items
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function nextDocumentId() {
  return state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

loadState()

export function getSchoolDocuments(schoolSlug: string) {
  return sortDocuments(state.items.filter((item) => item.schoolSlug === schoolSlug))
}

export function getPublishedSchoolDocuments(schoolSlug: string) {
  return sortDocuments(
    state.items.filter(
      (item) => item.schoolSlug === schoolSlug && item.status === 'published',
    ),
  )
}

export function getSchoolDocumentItem(schoolSlug: string, id: number) {
  return state.items.find((item) => item.schoolSlug === schoolSlug && item.id === id) ?? null
}

export function saveSchoolDocument(item: DocumentItem) {
  const index = state.items.findIndex((entry) => entry.id === item.id)

  if (index >= 0) {
    state.items[index] = cloneDocumentItem(item)
  } else {
    state.items.push(cloneDocumentItem(item))
  }

  persistState()
}

export function createSchoolDocumentDraft(
  schoolSlug: string,
  overrides: Partial<DocumentItem> = {},
): DocumentItem {
  const now = new Date()
  const isoDate = now.toISOString().slice(0, 10)
  const isoDateTime = now.toISOString()

  return {
    id: nextDocumentId(),
    schoolSlug,
    title: '',
    category: 'charter',
    description: '',
    date: isoDate,
    size: '',
    url: '#',
    status: 'draft',
    updatedAt: isoDateTime,
    ...overrides,
  }
}

export function updateSchoolDocumentStatus(id: number, status: DocumentStatus) {
  const item = state.items.find((entry) => entry.id === id)
  if (!item) return

  item.status = status
  item.updatedAt = new Date().toISOString()
  persistState()
}

export function deleteSchoolDocument(id: number) {
  state.items = state.items.filter((item) => item.id !== id)
  persistState()
}

export function useSchoolDocuments(schoolSlug: string) {
  return {
    documentItems: computed(() => getSchoolDocuments(schoolSlug)),
    publishedDocumentItems: computed(() => getPublishedSchoolDocuments(schoolSlug)),
  }
}

export { documentCategoryLabels, documentStatusLabels }
export type { DocumentCategory, DocumentItem, DocumentStatus }
