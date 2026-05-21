import { computed } from 'vue'
import {
  type SchoolContactsDraft,
  type SchoolGeneralDraft,
  peekSchoolSettingsDraft,
} from '@/modules/admin/state/school-settings'
import { getTeacherCountBySchoolState } from '@/modules/teachers/state/teacher-directory'
import {
  getDefaultSchoolSlugService,
  getSchoolBySlugService,
  getSchoolsService,
} from '../services/school-service'
import type { SchoolProfile } from '../types'

function applyGeneralDraft(school: SchoolProfile, general?: SchoolGeneralDraft): SchoolProfile {
  if (!general) return school

  return {
    ...school,
    fullName: general.fullName || school.fullName,
    shortName: general.shortName || school.shortName,
    type: general.type || school.type,
    city: general.city || school.city,
  }
}

function applyContactsDraft(school: SchoolProfile, contacts?: SchoolContactsDraft): SchoolProfile {
  if (!contacts) return school

  return {
    ...school,
    address: contacts.address || school.address,
    phone: contacts.phone || school.phone,
    email: contacts.email || school.email,
    hours: contacts.hours || school.hours,
  }
}

function applyDerivedContent(school: SchoolProfile, general?: SchoolGeneralDraft): SchoolProfile {
  if (!general) return school

  const heroTitle = general.fullName ? general.fullName.replace(/ {2,}/g, ' ').trim() : school.heroTitle

  return {
    ...school,
    heroTitle,
    heroText: general.description || school.heroText,
  }
}

function applyDerivedStats(school: SchoolProfile): SchoolProfile {
  const teacherCount = getTeacherCountBySchoolState(school.slug)
  const general = peekSchoolSettingsDraft(school.slug)?.general

  return {
    ...school,
    stats: school.stats.map((item, index) => {
      if (index === 0) {
        return { ...item, value: general?.studentsCount || item.value }
      }

      if (index === 1) {
        return { ...item, value: String(teacherCount) }
      }

      if (index === 2) {
        return { ...item, value: general?.classesCount || item.value }
      }

      if (index === 3) {
        return { ...item, value: general?.foundedYear || item.value }
      }

      return item
    }),
  }
}

export function getManagedSchoolBySlug(schoolSlug: string): SchoolProfile | null {
  const school = getSchoolBySlugService(schoolSlug)
  if (!school) return null

  const settingsDraft = peekSchoolSettingsDraft(schoolSlug)
  const withGeneral = applyGeneralDraft(school, settingsDraft?.general)
  const withContacts = applyContactsDraft(withGeneral, settingsDraft?.contacts)
  const withDerivedContent = applyDerivedContent(withContacts, settingsDraft?.general)

  return applyDerivedStats(withDerivedContent)
}

export function getManagedSchools(): SchoolProfile[] {
  return getSchoolsService().map((item) => getManagedSchoolBySlug(item.slug) ?? item)
}

export function getManagedDefaultSchoolSlug(): string {
  return getDefaultSchoolSlugService()
}

export function useManagedSchool(schoolSlug: string) {
  return computed(() => getManagedSchoolBySlug(schoolSlug))
}

export function useManagedSchools() {
  return computed(() => getManagedSchools())
}
