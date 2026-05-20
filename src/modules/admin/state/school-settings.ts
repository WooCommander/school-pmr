import { computed, reactive } from 'vue'
import { findSchoolBySlug } from '@/data/schools'

const STORAGE_KEY = 'school-pmr-admin-school-settings'

export interface SchoolGeneralDraft {
  fullName: string
  shortName: string
  type: string
  city: string
  description: string
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
  const school = findSchoolBySlug(schoolSlug)

  return {
    general: {
      fullName: school?.fullName ?? '',
      shortName: school?.shortName ?? '',
      type: school?.type ?? '',
      city: school?.city ?? '',
      description: school
        ? `${school.fullName} — публичный сайт школы в единой системе управления.`
        : '',
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

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as SchoolSettingsMap
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

export function ensureSchoolSettingsDraft(schoolSlug: string) {
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft(schoolSlug)
    persistState()
  }

  return state.drafts[schoolSlug]
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
