import {
  fetchDefaultSchoolSlugAPI,
  fetchSchoolBySlugAPI,
  fetchSchoolsAPI,
} from '../api/schools-api'
import { toSchoolProfile, toSchoolProfileList } from '../adapters/school-adapter'
import type { SchoolProfile } from '../types'

export function getSchoolsService(): SchoolProfile[] {
  return toSchoolProfileList(fetchSchoolsAPI())
}

export function getSchoolBySlugService(schoolSlug: string): SchoolProfile | null {
  const school = fetchSchoolBySlugAPI(schoolSlug)
  return school ? toSchoolProfile(school) : null
}

export function getDefaultSchoolSlugService(): string {
  return fetchDefaultSchoolSlugAPI()
}
