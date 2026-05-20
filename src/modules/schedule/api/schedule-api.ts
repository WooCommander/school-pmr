import {
  bells as bellSeed,
  classGroups as classGroupSeed,
  sampleSchedule as scheduleSeed,
  weekDays as weekDaySeed,
} from '@/data/schedule'
import type { BellItemDTO, WeekScheduleDTO } from '../types'

function cloneSchedule(schedule: WeekScheduleDTO): WeekScheduleDTO {
  return schedule.map((day) => day.map((lesson) => (lesson ? { ...lesson } : null)))
}

export function fetchBellsAPI(): BellItemDTO[] {
  return bellSeed.map((item) => ({ ...item }))
}

export function fetchWeekDaysAPI(): string[] {
  return [...weekDaySeed]
}

export function fetchClassGroupsAPI(_schoolSlug: string): string[] {
  return [...classGroupSeed]
}

export function fetchSchedulesAPI(_schoolSlug: string): Record<string, WeekScheduleDTO> {
  return Object.fromEntries(
    Object.entries(scheduleSeed).map(([className, schedule]) => [className, cloneSchedule(schedule)]),
  )
}
