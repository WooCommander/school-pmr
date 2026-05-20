export interface BellItemDTO {
  number: number
  start: string
  end: string
  note?: string
}

export interface BellItem {
  number: number
  start: string
  end: string
  note?: string
}

export interface ScheduleLessonDTO {
  subject: string
  teacher: string
  room: string
}

export interface ScheduleLesson {
  subject: string
  teacher: string
  room: string
}

export type DayScheduleDTO = (ScheduleLessonDTO | null)[]
export type WeekScheduleDTO = DayScheduleDTO[]
export type DaySchedule = (ScheduleLesson | null)[]
export type WeekSchedule = DaySchedule[]

export interface ScheduleSnapshot {
  schoolSlug: string
  bells: BellItem[]
  weekDays: string[]
  classGroups: string[]
  schedules: Record<string, WeekSchedule>
}
