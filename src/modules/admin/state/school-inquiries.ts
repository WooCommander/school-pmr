import { computed, reactive } from 'vue'

const STORAGE_KEY = 'school-pmr-admin-school-inquiries'

export type SchoolInquiryStatus = 'new' | 'in_progress' | 'answered' | 'rejected'

export interface SchoolInquiryItem {
  id: number
  schoolSlug: string
  name: string
  contact: string
  topic: string
  message: string
  status: SchoolInquiryStatus
  createdAt: string
  updatedAt: string
}

type SchoolInquiryMap = Record<string, SchoolInquiryItem[]>

const state = reactive<{
  items: SchoolInquiryMap
  nextId: number
}>({
  items: {},
  nextId: 1,
})

export const schoolInquiryStatusLabels: Record<SchoolInquiryStatus, string> = {
  new: 'Новое',
  in_progress: 'В работе',
  answered: 'Отвечено',
  rejected: 'Отклонено',
}

function persistState() {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      items: state.items,
      nextId: state.nextId,
    }),
  )
}

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as {
      items?: SchoolInquiryMap
      nextId?: number
    }

    state.items = parsed.items ?? {}
    state.nextId = parsed.nextId ?? 1
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

loadState()

function ensureSchoolInquiries(schoolSlug: string) {
  if (!state.items[schoolSlug]) {
    state.items[schoolSlug] = []
    persistState()
  }

  return state.items[schoolSlug]
}

export function getSchoolInquiries(schoolSlug: string) {
  return ensureSchoolInquiries(schoolSlug)
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

export function getSchoolInquiryCount(schoolSlug: string) {
  return ensureSchoolInquiries(schoolSlug).length
}

export function createSchoolInquiry(
  schoolSlug: string,
  payload: Pick<SchoolInquiryItem, 'name' | 'contact' | 'topic' | 'message'>,
) {
  ensureSchoolInquiries(schoolSlug)

  const now = new Date().toISOString()
  const item: SchoolInquiryItem = {
    id: state.nextId++,
    schoolSlug,
    name: payload.name,
    contact: payload.contact,
    topic: payload.topic,
    message: payload.message,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  }

  state.items[schoolSlug].unshift(item)
  persistState()
  return item
}

export function updateSchoolInquiryStatus(
  schoolSlug: string,
  inquiryId: number,
  status: SchoolInquiryStatus,
) {
  const items = ensureSchoolInquiries(schoolSlug)
  const item = items.find((entry) => entry.id === inquiryId)
  if (!item) return

  item.status = status
  item.updatedAt = new Date().toISOString()
  persistState()
}

export function deleteSchoolInquiry(schoolSlug: string, inquiryId: number) {
  const items = ensureSchoolInquiries(schoolSlug)
  const nextItems = items.filter((item) => item.id !== inquiryId)
  state.items[schoolSlug] = nextItems
  persistState()
}

export function useSchoolInquiries(schoolSlug: string) {
  ensureSchoolInquiries(schoolSlug)

  return {
    inquiries: computed(() => getSchoolInquiries(schoolSlug)),
    count: computed(() => getSchoolInquiryCount(schoolSlug)),
  }
}
