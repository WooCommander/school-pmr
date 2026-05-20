import { computed } from 'vue'
import { getScheduleByClassService, getScheduleSnapshotService } from '../services/schedule-service'

export function getScheduleSnapshotState(schoolSlug: string) {
  return getScheduleSnapshotService(schoolSlug)
}

export function getScheduleByClassState(schoolSlug: string, className: string) {
  return getScheduleByClassService(schoolSlug, className)
}

export function useScheduleSnapshotState(schoolSlug: string) {
  return computed(() => getScheduleSnapshotState(schoolSlug))
}
