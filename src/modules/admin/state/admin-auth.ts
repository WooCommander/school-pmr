import { computed, reactive } from 'vue'
import { mockAdminUsers, type AdminRole, type AdminSchoolAccess } from '@/modules/admin/data/mock-admin-users'

const STORAGE_KEY = 'school-pmr-admin-session'

interface AdminSessionUser {
  id: number
  email: string
  name: string
  accesses: AdminSchoolAccess[]
}

interface AdminSessionState {
  user: AdminSessionUser | null
  selectedSchoolSlug: string | null
}

export const adminRoleLabels: Record<AdminRole, string> = {
  superadmin: 'Системный администратор',
  school_admin: 'Администратор школы',
  director: 'Директор',
  content_manager: 'Контент-менеджер',
}

const state = reactive<AdminSessionState>({
  user: null,
  selectedSchoolSlug: null,
})

function getDefaultSchoolSlug(user: AdminSessionUser | null) {
  if (!user) {
    return null
  }

  return user.accesses.length === 1 ? user.accesses[0].schoolSlug : null
}

function normalizeSelectedSchool() {
  if (!state.user) {
    state.selectedSchoolSlug = null
    return
  }

  if (
    state.selectedSchoolSlug &&
    state.user.accesses.some((access) => access.schoolSlug === state.selectedSchoolSlug)
  ) {
    return
  }

  state.selectedSchoolSlug = getDefaultSchoolSlug(state.user)
}

function loadSession() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as AdminSessionState
    state.user = parsed.user
    state.selectedSchoolSlug = parsed.selectedSchoolSlug
    normalizeSelectedSchool()
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

function persistSession() {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      selectedSchoolSlug: state.selectedSchoolSlug,
    }),
  )
}

loadSession()

export function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = mockAdminUsers.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  )

  if (!user) {
    return { ok: false as const, error: 'Неверный email или пароль.' }
  }

  state.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    accesses: user.accesses,
  }
  state.selectedSchoolSlug = getDefaultSchoolSlug(state.user)
  persistSession()

  return { ok: true as const }
}

export function logoutAdmin() {
  state.user = null
  state.selectedSchoolSlug = null
  persistSession()
}

export function selectAdminSchool(schoolSlug: string) {
  if (!hasAdminAccessToSchool(schoolSlug)) {
    return false
  }

  state.selectedSchoolSlug = schoolSlug
  persistSession()
  return true
}

export function hasAdminAccessToSchool(schoolSlug: string) {
  return !!state.user?.accesses.some((access) => access.schoolSlug === schoolSlug)
}

export function getAdminRoleForSchool(schoolSlug: string): AdminRole | null {
  return state.user?.accesses.find((access) => access.schoolSlug === schoolSlug)?.role ?? null
}

export function getAdminRoleLabel(role: AdminRole | null) {
  return role ? adminRoleLabels[role] ?? role : null
}

export function useAdminAuth() {
  return {
    state,
    isAuthenticated: computed(() => !!state.user),
    currentUser: computed(() => state.user),
    selectedSchoolSlug: computed(() => state.selectedSchoolSlug),
    availableAccesses: computed(() => state.user?.accesses ?? []),
  }
}
