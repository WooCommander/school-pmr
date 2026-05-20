import type { SchoolProfile, SchoolProfileDTO } from '../types'

export function toSchoolProfile(dto: SchoolProfileDTO): SchoolProfile {
  return {
    ...dto,
    stats: dto.stats.map((item) => ({ ...item })),
  }
}

export function toSchoolProfileList(dtos: SchoolProfileDTO[]): SchoolProfile[] {
  return dtos.map(toSchoolProfile)
}
