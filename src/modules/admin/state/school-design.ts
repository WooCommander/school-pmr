import { computed, reactive } from 'vue'
import { findSchoolBySlug } from '@/data/schools'
import {
  type TemplateKey,
  getTemplatePresetByKey,
  templatePresets,
} from '@/modules/admin/data/template-presets'
import {
  type ThemeKey,
  getThemePresetByKey,
  themePresets,
} from '@/modules/admin/data/theme-presets'

const STORAGE_KEY = 'school-pmr-admin-school-design'

export interface SchoolDesignDraft {
  publishedTemplateKey: TemplateKey
  draftTemplateKey: TemplateKey
  publishedThemeKey: ThemeKey
  draftThemeKey: ThemeKey
}

type SchoolDesignMap = Record<string, SchoolDesignDraft>

const state = reactive<{
  drafts: SchoolDesignMap
}>({
  drafts: {},
})

function resolveDefaultTemplateKey(schoolSlug: string): TemplateKey {
  const school = findSchoolBySlug(schoolSlug)

  if (!school) return 'classic'

  const index = school.id % templatePresets.length
  return templatePresets[index]?.key ?? 'classic'
}

function makeDefaultDraft(schoolSlug: string): SchoolDesignDraft {
  const defaultKey = resolveDefaultTemplateKey(schoolSlug)
  const defaultThemeKey = resolveDefaultThemeKey(schoolSlug)

  return {
    publishedTemplateKey: defaultKey,
    draftTemplateKey: defaultKey,
    publishedThemeKey: defaultThemeKey,
    draftThemeKey: defaultThemeKey,
  }
}

function resolveDefaultThemeKey(schoolSlug: string): ThemeKey {
  const school = findSchoolBySlug(schoolSlug)

  if (!school) return 'blue'

  const index = school.id % themePresets.length
  return themePresets[index]?.key ?? 'blue'
}

function loadState() {
  if (typeof window === 'undefined') return

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as SchoolDesignMap
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

export function ensureSchoolDesignDraft(schoolSlug: string) {
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft(schoolSlug)
    persistState()
  }

  return state.drafts[schoolSlug]
}

export function getDefaultSchoolDesignDraft(schoolSlug: string) {
  return makeDefaultDraft(schoolSlug)
}

export function updateSchoolDraftTemplate(schoolSlug: string, templateKey: TemplateKey) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].draftTemplateKey = templateKey
  persistState()
}

export function resetSchoolDraftTemplate(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].draftTemplateKey = state.drafts[schoolSlug].publishedTemplateKey
  persistState()
}

export function publishSchoolDraftTemplate(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].publishedTemplateKey = state.drafts[schoolSlug].draftTemplateKey
  persistState()
}

export function updateSchoolDraftTheme(schoolSlug: string, themeKey: ThemeKey) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].draftThemeKey = themeKey
  persistState()
}

export function resetSchoolDraftTheme(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].draftThemeKey = state.drafts[schoolSlug].publishedThemeKey
  persistState()
}

export function publishSchoolDraftTheme(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].publishedThemeKey = state.drafts[schoolSlug].draftThemeKey
  persistState()
}

export function useSchoolDesignDraft(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)

  const draft = computed(() => ensureSchoolDesignDraft(schoolSlug))
  const publishedTemplate = computed(() =>
    getTemplatePresetByKey(draft.value.publishedTemplateKey)
  )
  const selectedTemplate = computed(() =>
    getTemplatePresetByKey(draft.value.draftTemplateKey)
  )
  const publishedTheme = computed(() =>
    getThemePresetByKey(draft.value.publishedThemeKey)
  )
  const selectedTheme = computed(() =>
    getThemePresetByKey(draft.value.draftThemeKey)
  )

  return {
    designDraft: draft,
    publishedTemplate,
    selectedTemplate,
    publishedTheme,
    selectedTheme,
  }
}
