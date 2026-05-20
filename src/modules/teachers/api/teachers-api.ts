import { teachers as teacherSeed } from '@/data/teachers'
import type { TeacherDTO } from '../types'

export function fetchTeachersAPI(): TeacherDTO[] {
  return teacherSeed.map((item) => ({ ...item }))
}

export function fetchTeachersBySchoolAPI(schoolSlug: string): TeacherDTO[] {
  return fetchTeachersAPI().filter((item) => item.schoolSlug === schoolSlug)
}
