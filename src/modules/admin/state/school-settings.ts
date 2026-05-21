import { computed, reactive } from 'vue'
import { getSchoolBySlugService } from '@/modules/schools/services/school-service'

const STORAGE_KEY = 'school-pmr-admin-school-settings'

export interface SchoolGeneralDraft {
  fullName: string
  shortName: string
  type: string
  city: string
  description: string
  studentsCount: string
  classesCount: string
  foundedYear: string
}

export interface SchoolContactsDraft {
  address: string
  phone: string
  email: string
  hours: string
  mapLabel: string
  mapUrl: string
}

export interface SchoolSettingsDraft {
  general: SchoolGeneralDraft
  contacts: SchoolContactsDraft
}

type SchoolSettingsMap = Record<string, SchoolSettingsDraft>

const state = reactive<{
  drafts: SchoolSettingsMap
}>({
  drafts: {},
})

function makeDefaultDraft(schoolSlug: string): SchoolSettingsDraft {
  const school = getSchoolBySlugService(schoolSlug)

  return {
    general: {
      fullName: school?.fullName ?? '',
      shortName: school?.shortName ?? '',
      type: school?.type ?? '',
      city: school?.city ?? '',
      description: school
        ? `${school.fullName} вЂ” РїСѓР±Р»РёС‡РЅС‹Р№ СЃР°Р№С‚ С€РєРѕР»С‹ РІ РµРґРёРЅРѕР№ СЃРёСЃС‚РµРјРµ СѓРїСЂР°РІР»РµРЅРёСЏ.`
        : '',
      studentsCount: school?.stats[0]?.value ?? '',
      classesCount: school?.stats[2]?.value ?? '',
      foundedYear: school?.stats[3]?.value ?? '',
    },
    contacts: {
      address: school?.address ?? '',
      phone: school?.phone ?? '',
      email: school?.email ?? '',
      hours: school?.hours ?? '',
      mapLabel: school ? `${school.shortName}, ${school.city}` : '',
      mapUrl: '',
    },
  }
}

function normalizeDraft(schoolSlug: string, draft?: Partial<SchoolSettingsDraft> | null): SchoolSettingsDraft {
  const defaults = makeDefaultDraft(schoolSlug)

  return {
    general: {
      ...defaults.general,
      ...draft?.general,
    },
    contacts: {
      ...defaults.contacts,
      ...draft?.contacts,
    },
  }
}

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<SchoolSettingsDraft>>
    state.drafts = Object.fromEntries(
      Object.entries(parsed).map(([schoolSlug, draft]) => [
        schoolSlug,
        normalizeDraft(schoolSlug, draft),
      ]),
    )
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

function persistState() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drafts))
}

loadState()

export function ensureSchoolSettingsDraft(schoolSlug: string) {
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft(schoolSlug)
    persistState()
  } else {
    const normalizedDraft = normalizeDraft(schoolSlug, state.drafts[schoolSlug])

    if (JSON.stringify(normalizedDraft) !== JSON.stringify(state.drafts[schoolSlug])) {
      state.drafts[schoolSlug] = normalizedDraft
      persistState()
    }
  }

  return state.drafts[schoolSlug]
}

export function peekSchoolSettingsDraft(schoolSlug: string) {
  return state.drafts[schoolSlug] ?? null
}

export function getDefaultSchoolSettingsDraft(schoolSlug: string) {
  return makeDefaultDraft(schoolSlug)
}

export function updateSchoolGeneralDraft(schoolSlug: string, payload: SchoolGeneralDraft) {
  ensureSchoolSettingsDraft(schoolSlug)
  state.drafts[schoolSlug].general = { ...payload }
  persistState()
}

export function resetSchoolGeneralDraft(schoolSlug: string) {
  const current = ensureSchoolSettingsDraft(schoolSlug)
  state.drafts[schoolSlug] = {
    ...current,
    general: makeDefaultDraft(schoolSlug).general,
  }
  persistState()
}

export function updateSchoolContactsDraft(schoolSlug: string, payload: SchoolContactsDraft) {
  ensureSchoolSettingsDraft(schoolSlug)
  state.drafts[schoolSlug].contacts = { ...payload }
  persistState()
}

export function resetSchoolContactsDraft(schoolSlug: string) {
  const current = ensureSchoolSettingsDraft(schoolSlug)
  state.drafts[schoolSlug] = {
    ...current,
    contacts: makeDefaultDraft(schoolSlug).contacts,
  }
  persistState()
}

export function resetAllSchoolSettingsDrafts(schoolSlug: string) {
  state.drafts[schoolSlug] = makeDefaultDraft(schoolSlug)
  persistState()
}

export function useSchoolSettingsDraft(schoolSlug: string) {
  ensureSchoolSettingsDraft(schoolSlug)

  return {
    generalDraft: computed(() => ensureSchoolSettingsDraft(schoolSlug).general),
    contactsDraft: computed(() => ensureSchoolSettingsDraft(schoolSlug).contacts),
  }
}
