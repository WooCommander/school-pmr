import type {
  BellItem,
  BellItemDTO,
  ScheduleLesson,
  ScheduleLessonDTO,
  ScheduleSnapshot,
  WeekSchedule,
  WeekScheduleDTO,
} from '../types'

function toScheduleLesson(dto: ScheduleLessonDTO): ScheduleLesson {
  return { ...dto }
}

function toWeekSchedule(dto: WeekScheduleDTO): WeekSchedule {
  return dto.map((day) => day.map((lesson) => (lesson ? toScheduleLesson(lesson) : null)))
}

export function toBellItem(dto: BellItemDTO): BellItem {
  return { ...dto }
}

export function toBellItemList(dtos: BellItemDTO[]): BellItem[] {
  return dtos.map(toBellItem)
}

export function toScheduleSnapshot(
  schoolSlug: string,
  bells: BellItemDTO[],
  weekDays: string[],
  classGroups: string[],
  schedules: Record<string, WeekScheduleDTO>,
): ScheduleSnapshot {
  return {
    schoolSlug,
    bells: toBellItemList(bells),
    weekDays: [...weekDays],
    classGroups: [...classGroups],
    schedules: Object.fromEntries(
      Object.entries(schedules).map(([className, schedule]) => [className, toWeekSchedule(schedule)]),
    ),
  }
}
