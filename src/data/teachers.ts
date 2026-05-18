export interface Teacher {
  id: number
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
    name: 'Иванова Светлана Николаевна',
    position: 'Директор',
    subject: 'Математика',
    category: 'Высшая',
    experience: 28,
    email: 'director@school1-dnestrovsk.ru',
  },
  {
    id: 2,
    name: 'Петров Андрей Викторович',
    position: 'Заместитель директора по учебной работе',
    subject: 'Русский язык и литература',
    category: 'Первая',
    experience: 19,
    email: 'zavuch@school1-dnestrovsk.ru',
  },
  {
    id: 3,
    name: 'Сергеева Ольга Ивановна',
    position: 'Учитель',
    subject: 'Математика и информатика',
    category: 'Высшая',
    experience: 22,
  },
  {
    id: 4,
    name: 'Козлов Михаил Петрович',
    position: 'Учитель',
    subject: 'История и обществознание',
    category: 'Первая',
    experience: 15,
  },
  {
    id: 5,
    name: 'Морозова Татьяна Александровна',
    position: 'Учитель',
    subject: 'Английский язык',
    category: 'Высшая',
    experience: 17,
  },
  {
    id: 6,
    name: 'Алексеев Дмитрий Сергеевич',
    position: 'Учитель физической культуры',
    subject: 'Физическая культура',
    category: 'Вторая',
    experience: 9,
  },
  {
    id: 7,
    name: 'Захарова Наталья Юрьевна',
    position: 'Учитель',
    subject: 'Биология и химия',
    category: 'Первая',
    experience: 13,
  },
  {
    id: 8,
    name: 'Тимофеев Игорь Владимирович',
    position: 'Учитель',
    subject: 'Физика',
    category: 'Высшая',
    experience: 25,
  },
  {
    id: 9,
    name: 'Воронова Елена Геннадьевна',
    position: 'Учитель начальных классов',
    subject: 'Начальные классы',
    category: 'Высшая',
    experience: 20,
  },
  {
    id: 10,
    name: 'Белова Анна Константиновна',
    position: 'Учитель начальных классов',
    subject: 'Начальные классы',
    category: 'Первая',
    experience: 11,
  },
  {
    id: 11,
    name: 'Степанов Роман Евгеньевич',
    position: 'Учитель',
    subject: 'Технология',
    category: 'Вторая',
    experience: 7,
  },
  {
    id: 12,
    name: 'Фёдорова Людмила Борисовна',
    position: 'Педагог-психолог',
    subject: 'Психология',
    category: 'Первая',
    experience: 14,
  },
]
