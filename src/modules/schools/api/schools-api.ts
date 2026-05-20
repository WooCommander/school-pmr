import {
  defaultSchoolSlug as seedDefaultSchoolSlug,
  schools as schoolSeed,
} from '@/data/schools'
import type { SchoolProfileDTO } from '../types'

export function fetchSchoolsAPI(): SchoolProfileDTO[] {
  return schoolSeed.map((item) => ({
    ...item,
    stats: item.stats.map((stat) => ({ ...stat })),
  }))
}

export function fetchSchoolBySlugAPI(schoolSlug: string): SchoolProfileDTO | null {
  return fetchSchoolsAPI().find((item) => item.slug === schoolSlug) ?? null
}

export function fetchDefaultSchoolSlugAPI(): string {
  return seedDefaultSchoolSlug
}
