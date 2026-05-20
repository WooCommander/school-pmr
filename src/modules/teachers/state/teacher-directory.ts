import { computed } from 'vue'
import { getTeachersBySchoolService, getTeachersService } from '../services/teacher-service'
import type { AdministrationContact, TeacherProfile } from '../types'

function isManagementTeacher(teacher: TeacherProfile): boolean {
  return /директор|заместител/i.test(teacher.position) || Boolean(teacher.email)
}

export function getTeachersState(): TeacherProfile[] {
  return getTeachersService()
}

export function getTeachersBySchoolState(schoolSlug: string): TeacherProfile[] {
  return getTeachersBySchoolService(schoolSlug)
}

export function getTeacherCountBySchoolState(schoolSlug: string): number {
  return getTeachersBySchoolState(schoolSlug).length
}

export function getAdministrationBySchoolState(schoolSlug: string): AdministrationContact[] {
  const teachers = getTeachersBySchoolState(schoolSlug)
  const management = teachers.filter(isManagementTeacher)

  return (management.length ? management : teachers.slice(0, 3)).map((teacher) => ({
    role: teacher.position,
    name: teacher.name,
    email: teacher.email ?? null,
  }))
}

export function useTeachersBySchoolState(schoolSlug: string) {
  return computed(() => getTeachersBySchoolState(schoolSlug))
}
