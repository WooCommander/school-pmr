import { fetchTeachersAPI, fetchTeachersBySchoolAPI } from '../api/teachers-api'
import { toTeacherProfileList } from '../adapters/teacher-adapter'
import type { TeacherProfile } from '../types'

export function getTeachersService(): TeacherProfile[] {
  return toTeacherProfileList(fetchTeachersAPI())
}

export function getTeachersBySchoolService(schoolSlug: string): TeacherProfile[] {
  return toTeacherProfileList(fetchTeachersBySchoolAPI(schoolSlug))
}
