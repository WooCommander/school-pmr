export interface Teacher {
  id: number
  schoolSlug: string
  name: string
  position: string
  subject: string
  category: string
  experience: number
  email?: string
  photo?: string
}

export const teachers: Teacher[] = [
  {
    id: 1,
    schoolSlug: 'dnestrovsk-school-1',
    name: 'Иванова Светлана Николаевна',
    position: 'Директор',
    subject: 'Математика',
    category: 'Высшая',
    experience: 28,
    email: 'director@school1-dnestrovsk.ru',
  },
  {
    id: 2,
    schoolSlug: 'dnestrovsk-school-1',
    name: 'Петров Андрей Викторович',
    position: 'Заместитель директора по учебной работе',
    subject: 'Русский язык и литература',
    category: 'Первая',
    experience: 19,
    email: 'zavuch@school1-dnestrovsk.ru',
  },
  {
    id: 3,
    schoolSlug: 'dnestrovsk-school-1',
    name: 'Сергеева Ольга Ивановна',
    position: 'Учитель',
    subject: 'Математика и информатика',
    category: 'Высшая',
    experience: 22,
  },
  {
    id: 4,
    schoolSlug: 'dnestrovsk-school-1',
    name: 'Козлов Михаил Петрович',
    position: 'Учитель',
    subject: 'История и обществознание',
    category: 'Первая',
    experience: 15,
  },
  {
    id: 5,
    schoolSlug: 'dnestrovsk-school-1',
    name: 'Морозова Татьяна Александровна',
    position: 'Учитель',
    subject: 'Английский язык',
    category: 'Высшая',
    experience: 17,
  },
  {
    id: 6,
    schoolSlug: 'dnestrovsk-school-1',
    name: 'Алексеев Дмитрий Сергеевич',
    position: 'Учитель физической культуры',
    subject: 'Физическая культура',
    category: 'Вторая',
    experience: 9,
  },
  {
    id: 7,
    schoolSlug: 'school-2',
    name: 'Бондаренко Марина Сергеевна',
    position: 'Директор',
    subject: 'Русский язык и литература',
    category: 'Высшая',
    experience: 24,
    email: 'director@school2.edu-pmr.org',
  },
  {
    id: 8,
    schoolSlug: 'school-2',
    name: 'Сидоров Павел Игоревич',
    position: 'Учитель',
    subject: 'Физика',
    category: 'Высшая',
    experience: 18,
  },
  {
    id: 9,
    schoolSlug: 'school-2',
    name: 'Коваленко Ирина Викторовна',
    position: 'Учитель',
    subject: 'Начальные классы',
    category: 'Первая',
    experience: 13,
  },
  {
    id: 10,
    schoolSlug: 'school-3',
    name: 'Филиппов Александр Николаевич',
    position: 'Директор',
    subject: 'История',
    category: 'Высшая',
    experience: 21,
    email: 'director@school3.edu-pmr.org',
  },
  {
    id: 11,
    schoolSlug: 'school-3',
    name: 'Ткаченко Елена Олеговна',
    position: 'Учитель',
    subject: 'Биология и химия',
    category: 'Первая',
    experience: 16,
  },
  {
    id: 12,
    schoolSlug: 'school-4',
    name: 'Мельник Ольга Романовна',
    position: 'Директор',
    subject: 'Математика',
    category: 'Высшая',
    experience: 26,
    email: 'director@school4.edu-pmr.org',
  },
  {
    id: 13,
    schoolSlug: 'school-4',
    name: 'Гончарук Виктор Петрович',
    position: 'Учитель',
    subject: 'Технология',
    category: 'Первая',
    experience: 11,
  },
  {
    id: 14,
    schoolSlug: 'lyceum-1',
    name: 'Захарова Наталья Юрьевна',
    position: 'Директор',
    subject: 'Биология',
    category: 'Высшая',
    experience: 23,
    email: 'director@lyceum1.edu-pmr.org',
  },
  {
    id: 15,
    schoolSlug: 'lyceum-1',
    name: 'Тимофеев Игорь Владимирович',
    position: 'Учитель',
    subject: 'Физика',
    category: 'Высшая',
    experience: 25,
  },
  {
    id: 16,
    schoolSlug: 'lyceum-1',
    name: 'Белова Анна Константиновна',
    position: 'Учитель',
    subject: 'Английский язык',
    category: 'Первая',
    experience: 12,
  },
]

export function getTeachersBySchool(schoolSlug: string) {
  const schoolTeachers = teachers.filter((teacher) => teacher.schoolSlug === schoolSlug)
  return schoolTeachers.length ? schoolTeachers : teachers.filter((teacher) => teacher.schoolSlug === 'dnestrovsk-school-1')
}
