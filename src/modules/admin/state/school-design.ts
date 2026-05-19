import { computed, reactive } from 'vue'
import { findSchoolBySlug } from '@/data/schools'
import {
  type TemplateKey,
  getTemplatePresetByKey,
  templatePresets,
} from '@/modules/admin/data/template-presets'

const STORAGE_KEY = 'school-pmr-admin-school-design'

export interface SchoolDesignDraft {
  publishedTemplateKey: TemplateKey
  draftTemplateKey: TemplateKey
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

  return {
    publishedTemplateKey: defaultKey,
    draftTemplateKey: defaultKey,
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
  if (!state.drafts[schoolSlug]) {
    state.drafts[schoolSlug] = makeDefaultDraft(schoolSlug)
    persistState()
  }

  return state.drafts[schoolSlug]
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

export function useSchoolDesignDraft(schoolSlug: string) {
  ensureSchoolDesignDraft(schoolSlug)

  const draft = computed(() => ensureSchoolDesignDraft(schoolSlug))
  const publishedTemplate = computed(() =>
    getTemplatePresetByKey(draft.value.publishedTemplateKey)
  )
  const selectedTemplate = computed(() =>
    getTemplatePresetByKey(draft.value.draftTemplateKey)
  )

  return {
    designDraft: draft,
    publishedTemplate,
    selectedTemplate,
  }
}
