import { computed, reactive } from 'vue'
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
import { getSchoolBySlugService } from '@/modules/schools/services/school-service'

const STORAGE_KEY = 'school-pmr-admin-school-design'

export type SchoolButtonStyle = 'solid' | 'soft' | 'outline'
export type SchoolRadiusStyle = 'compact' | 'balanced' | 'rounded'
export type SchoolDensityStyle = 'compact' | 'comfortable'
export type SchoolContrastStyle = 'normal' | 'high'

export interface SchoolDesignCustomization {
  buttonStyle: SchoolButtonStyle
  radiusStyle: SchoolRadiusStyle
  density: SchoolDensityStyle
  contrast: SchoolContrastStyle
}

export interface SchoolDesignDraft {
  publishedTemplateKey: TemplateKey
  draftTemplateKey: TemplateKey
  publishedThemeKey: ThemeKey
  draftThemeKey: ThemeKey
  publishedCustomization: SchoolDesignCustomization
  draftCustomization: SchoolDesignCustomization
}

type SchoolDesignMap = Record<string, SchoolDesignDraft>

const state = reactive<{
  drafts: SchoolDesignMap
}>({
  drafts: {},
})

function resolveDefaultTemplateKey(schoolSlug: string): TemplateKey {
  const school = getSchoolBySlugService(schoolSlug)

  if (!school) return 'classic'

  const index = school.id % templatePresets.length
  return templatePresets[index]?.key ?? 'classic'
}

function resolveDefaultThemeKey(schoolSlug: string): ThemeKey {
  const school = getSchoolBySlugService(schoolSlug)

  if (!school) return 'blue'

  const index = school.id % themePresets.length
  return themePresets[index]?.key ?? 'blue'
}

function createDefaultCustomization(): SchoolDesignCustomization {
  return {
    buttonStyle: 'solid',
    radiusStyle: 'balanced',
    density: 'comfortable',
    contrast: 'normal',
  }
}

function makeDefaultDraft(schoolSlug: string): SchoolDesignDraft {
  const defaultKey = resolveDefaultTemplateKey(schoolSlug)
  const defaultThemeKey = resolveDefaultThemeKey(schoolSlug)
  const defaultCustomization = createDefaultCustomization()

  return {
    publishedTemplateKey: defaultKey,
    draftTemplateKey: defaultKey,
    publishedThemeKey: defaultThemeKey,
    draftThemeKey: defaultThemeKey,
    publishedCustomization: { ...defaultCustomization },
    draftCustomization: { ...defaultCustomization },
  }
}

function normalizeDraft(
  schoolSlug: string,
  draft: Partial<SchoolDesignDraft> | undefined,
): SchoolDesignDraft {
  const defaults = makeDefaultDraft(schoolSlug)

  return {
    publishedTemplateKey: draft?.publishedTemplateKey ?? defaults.publishedTemplateKey,
    draftTemplateKey: draft?.draftTemplateKey ?? defaults.draftTemplateKey,
    publishedThemeKey: draft?.publishedThemeKey ?? defaults.publishedThemeKey,
    draftThemeKey: draft?.draftThemeKey ?? defaults.draftThemeKey,
    publishedCustomization: {
      ...defaults.publishedCustomization,
      ...draft?.publishedCustomization,
    },
    draftCustomization: {
      ...defaults.draftCustomization,
      ...draft?.draftCustomization,
    },
  }
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
  const normalized = normalizeDraft(schoolSlug, state.drafts[schoolSlug])
  const shouldPersist =
    !state.drafts[schoolSlug] ||
    JSON.stringify(state.drafts[schoolSlug]) !== JSON.stringify(normalized)

  state.drafts[schoolSlug] = normalized

  if (shouldPersist) {
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

export function updateSchoolDraftCustomization(
  schoolSlug: string,
  customization: SchoolDesignCustomization,
) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].draftCustomization = { ...customization }
  persistState()
}

export function resetSchoolDraftCustomization(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].draftCustomization = {
    ...state.drafts[schoolSlug].publishedCustomization,
  }
  persistState()
}

export function publishSchoolDraftCustomization(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)
  state.drafts[schoolSlug].publishedCustomization = {
    ...state.drafts[schoolSlug].draftCustomization,
  }
  persistState()
}

export function useSchoolDesignDraft(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)

  const draft = computed(() => ensureSchoolDesignDraft(schoolSlug))
  const publishedTemplate = computed(() =>
    getTemplatePresetByKey(draft.value.publishedTemplateKey),
  )
  const selectedTemplate = computed(() =>
    getTemplatePresetByKey(draft.value.draftTemplateKey),
  )
  const publishedTheme = computed(() =>
    getThemePresetByKey(draft.value.publishedThemeKey),
  )
  const selectedTheme = computed(() =>
    getThemePresetByKey(draft.value.draftThemeKey),
  )

  return {
    designDraft: draft,
    publishedTemplate,
    selectedTemplate,
    publishedTheme,
    selectedTheme,
  }
}
