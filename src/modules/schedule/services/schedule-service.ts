import {
  fetchBellsAPI,
  fetchClassGroupsAPI,
  fetchSchedulesAPI,
  fetchWeekDaysAPI,
} from '../api/schedule-api'
import { toScheduleSnapshot } from '../adapters/schedule-adapter'
import type { ScheduleSnapshot, WeekSchedule } from '../types'

export function getScheduleSnapshotService(schoolSlug: string): ScheduleSnapshot {
  return toScheduleSnapshot(
    schoolSlug,
    fetchBellsAPI(),
    fetchWeekDaysAPI(),
    fetchClassGroupsAPI(schoolSlug),
    fetchSchedulesAPI(schoolSlug),
  )
}

export function getScheduleByClassService(schoolSlug: string, className: string): WeekSchedule | null {
  const snapshot = getScheduleSnapshotService(schoolSlug)
  return snapshot.schedules[className] ?? null
}
