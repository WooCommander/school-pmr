export interface BellItem {
  number: number
  start: string
  end: string
  note?: string
}

export interface ScheduleLesson {
  subject: string
  teacher: string
  room: string
}

export type DaySchedule = (ScheduleLesson | null)[]

export const bells: BellItem[] = [
  { number: 1, start: '8:00', end: '8:45' },
  { number: 2, start: '8:55', end: '9:40' },
  { number: 3, start: '9:50', end: '10:35' },
  { number: 4, start: '10:55', end: '11:40', note: 'После большой перемены' },
  { number: 5, start: '11:50', end: '12:35' },
  { number: 6, start: '12:45', end: '13:30' },
  { number: 7, start: '13:40', end: '14:25' },
]

export const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']

export const sampleSchedule: Record<string, DaySchedule> = {
  '5А': [
    [
      { subject: 'Математика', teacher: 'Сергеева О.И.', room: '201' },
      { subject: 'Русский язык', teacher: 'Петров А.В.', room: '105' },
      { subject: 'Физкультура', teacher: 'Алексеев Д.С.', room: 'Спортзал' },
      { subject: 'История', teacher: 'Козлов М.П.', room: '304' },
      { subject: 'Английский', teacher: 'Морозова Т.А.', room: '208' },
      null,
      null,
    ],
    [
      { subject: 'Английский', teacher: 'Морозова Т.А.', room: '208' },
      { subject: 'Математика', teacher: 'Сергеева О.И.', room: '201' },
      { subject: 'Биология', teacher: 'Захарова Н.Ю.', room: '306' },
      { subject: 'Русский язык', teacher: 'Петров А.В.', room: '105' },
      { subject: 'Физкультура', teacher: 'Алексеев Д.С.', room: 'Спортзал' },
      null,
      null,
    ],
    [
      { subject: 'История', teacher: 'Козлов М.П.', room: '304' },
      { subject: 'Математика', teacher: 'Сергеева О.И.', room: '201' },
      { subject: 'Русский язык', teacher: 'Петров А.В.', room: '105' },
      { subject: 'Английский', teacher: 'Морозова Т.А.', room: '208' },
      { subject: 'Технология', teacher: 'Степанов Р.Е.', room: '405' },
      null,
      null,
    ],
    [
      { subject: 'Биология', teacher: 'Захарова Н.Ю.', room: '306' },
      { subject: 'Физкультура', teacher: 'Алексеев Д.С.', room: 'Спортзал' },
      { subject: 'История', teacher: 'Козлов М.П.', room: '304' },
      { subject: 'Математика', teacher: 'Сергеева О.И.', room: '201' },
      { subject: 'Русский язык', teacher: 'Петров А.В.', room: '105' },
      null,
      null,
    ],
    [
      { subject: 'Русский язык', teacher: 'Петров А.В.', room: '105' },
      { subject: 'Биология', teacher: 'Захарова Н.Ю.', room: '306' },
      { subject: 'Математика', teacher: 'Сергеева О.И.', room: '201' },
      { subject: 'Английский', teacher: 'Морозова Т.А.', room: '208' },
      null,
      null,
      null,
    ],
  ],
}

export const classGroups = ['5А', '5Б', '6А', '6Б', '7А', '7Б', '8А', '8Б', '9А', '9Б', '10', '11']
