import type { TeacherDTO, TeacherProfile } from '../types'

export function toTeacherProfile(dto: TeacherDTO): TeacherProfile {
  return { ...dto }
}

export function toTeacherProfileList(dtos: TeacherDTO[]): TeacherProfile[] {
  return dtos.map(toTeacherProfile)
}
