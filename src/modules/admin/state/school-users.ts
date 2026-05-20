import { computed, reactive } from 'vue'
import { mockAdminUsers, type AdminRole } from '@/modules/admin/data/mock-admin-users'
import { adminRoleLabels } from '@/modules/admin/state/admin-auth'

export type InviteStatus = 'pending' | 'sent'

export interface SchoolInvite {
  id: number
  schoolSlug: string
  email: string
  name: string
  role: AdminRole
  status: InviteStatus
  createdAt: string
}

export interface SchoolUserListItem {
  id: number
  schoolSlug: string
  name: string
  email: string
  role: AdminRole
}

const STORAGE_KEY = 'school-pmr-admin-invites'

const seedInvites: SchoolInvite[] = [
  {
    id: 1,
    schoolSlug: 'dnestrovsk-school-1',
    email: 'content@school.local',
    name: 'Контент-менеджер школы',
    role: 'content_manager',
    status: 'pending',
    createdAt: '2026-05-18T10:30:00',
  },
  {
    id: 2,
    schoolSlug: 'school-2',
    email: 'assistant@school2.local',
    name: 'Помощник директора',
    role: 'school_admin',
    status: 'sent',
    createdAt: '2026-05-17T14:10:00',
  },
]

const state = reactive<{
  invites: SchoolInvite[]
}>({
  invites: [],
})

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    state.invites = seedInvites.map((item) => ({ ...item }))
    persistState()
    return
  }

  try {
    state.invites = JSON.parse(raw) as SchoolInvite[]
  } catch {
    state.invites = seedInvites.map((item) => ({ ...item }))
    window.localStorage.removeItem(STORAGE_KEY)
    persistState()
  }
}

function persistState() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.invites))
}

function nextInviteId() {
  return state.invites.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

loadState()

export function getSchoolUsers(schoolSlug: string): SchoolUserListItem[] {
  return mockAdminUsers
    .flatMap((user) =>
      user.accesses
        .filter((access) => access.schoolSlug === schoolSlug)
        .map((access) => ({
          id: user.id,
          schoolSlug,
          name: user.name,
          email: user.email,
          role: access.role,
        })),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
}

export function getSchoolInvites(schoolSlug: string) {
  return state.invites
    .filter((invite) => invite.schoolSlug === schoolSlug)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export function createSchoolInvite(payload: Omit<SchoolInvite, 'id' | 'createdAt' | 'status'>) {
  const invite: SchoolInvite = {
    ...payload,
    id: nextInviteId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  state.invites.push(invite)
  persistState()
  return invite
}

export function revokeSchoolInvite(id: number) {
  state.invites = state.invites.filter((invite) => invite.id !== id)
  persistState()
}

export function useSchoolUsers(schoolSlug: string) {
  return {
    users: computed(() => getSchoolUsers(schoolSlug)),
    invites: computed(() => getSchoolInvites(schoolSlug)),
  }
}

export { adminRoleLabels }
