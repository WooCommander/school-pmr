export interface SchoolItem {
  id: number
  slug: string
  shortName: string
  fullName: string
  city: string
  address: string
  phone: string
  email: string
  hours: string
  heroTitle: string
  heroText: string
  stats: Array<{ value: string; label: string }>
  type: string
}

export const schools: SchoolItem[] = [
  {
    id: 1,
    slug: 'dnestrovsk-school-1',
    shortName: 'ДнСШ №1',
    fullName: 'МОУ Днестровская средняя школа №1',
    city: 'г. Днестровск, ПМР',
    address: 'г. Днестровск, ул. Ленина, 1',
    phone: '+373 555 12-34',
    email: 'info@school1-dnestrovsk.ru',
    hours: 'Пн–Пт: 8:00–17:00',
    heroTitle: 'МОУ Днестровская\nсредняя школа №1',
    heroText: 'Качественное образование, развитие личности и подготовка к жизни в современном обществе с 1962 года.',
    stats: [
      { value: '850', label: 'учеников' },
      { value: '56', label: 'педагогов' },
      { value: '38', label: 'классов' },
      { value: '1962', label: 'год основания' },
    ],
    type: 'Средняя школа',
  },
  {
    id: 2,
    slug: 'school-2',
    shortName: 'ТСШ №2',
    fullName: 'Тираспольская средняя школа №2',
    city: 'г. Тирасполь, ПМР',
    address: 'г. Тирасполь, ул. Котовского, 18',
    phone: '+373 533 7-22-10',
    email: 'school2@edu-pmr.org',
    hours: 'Пн–Пт: 8:00–17:00',
    heroTitle: 'Тираспольская\nсредняя школа №2',
    heroText: 'Школа с устойчивой академической базой, активной внеурочной жизнью и современной школьной средой.',
    stats: [
      { value: '780', label: 'учеников' },
      { value: '49', label: 'педагогов' },
      { value: '33', label: 'классов' },
      { value: '1968', label: 'год основания' },
    ],
    type: 'Средняя школа',
  },
  {
    id: 3,
    slug: 'school-3',
    shortName: 'ТСШ №3',
    fullName: 'Тираспольская средняя школа №3',
    city: 'г. Тирасполь, ПМР',
    address: 'г. Тирасполь, ул. Чапаева, 42',
    phone: '+373 533 7-22-11',
    email: 'school3@edu-pmr.org',
    hours: 'Пн–Пт: 8:00–17:00',
    heroTitle: 'Тираспольская\nсредняя школа №3',
    heroText: 'Публичный сайт школы с единым доступом к новостям, расписанию, документам и контактам.',
    stats: [
      { value: '690', label: 'учеников' },
      { value: '44', label: 'педагогов' },
      { value: '29', label: 'классов' },
      { value: '1974', label: 'год основания' },
    ],
    type: 'Средняя школа',
  },
  {
    id: 4,
    slug: 'school-4',
    shortName: 'ТСШ №4',
    fullName: 'Тираспольская средняя школа №4',
    city: 'г. Тирасполь, ПМР',
    address: 'г. Тирасполь, ул. Мира, 15',
    phone: '+373 533 7-22-12',
    email: 'school4@edu-pmr.org',
    hours: 'Пн–Пт: 8:00–17:00',
    heroTitle: 'Тираспольская\nсредняя школа №4',
    heroText: 'Современный школьный сайт с единым интерфейсом и возможностью развивать публичную часть каждой школы отдельно.',
    stats: [
      { value: '720', label: 'учеников' },
      { value: '47', label: 'педагогов' },
      { value: '31', label: 'классов' },
      { value: '1979', label: 'год основания' },
    ],
    type: 'Средняя школа',
  },
  {
    id: 5,
    slug: 'lyceum-1',
    shortName: 'ТОТЛ №1',
    fullName: 'Тираспольский общеобразовательный теоретический лицей №1',
    city: 'г. Тирасполь, ПМР',
    address: 'г. Тирасполь, ул. 25 Октября, 108',
    phone: '+373 533 7-22-19',
    email: 'lyceum1@edu-pmr.org',
    hours: 'Пн–Пт: 8:00–17:00',
    heroTitle: 'Теоретический\nлицей №1',
    heroText: 'Лицейская модель обучения с публичным сайтом в общей дизайн-системе.',
    stats: [
      { value: '910', label: 'учеников' },
      { value: '58', label: 'педагогов' },
      { value: '36', label: 'классов' },
      { value: '1992', label: 'год основания' },
    ],
    type: 'Лицей',
  },
]

export const defaultSchoolSlug = schools[0].slug

export function findSchoolBySlug(slug: string) {
  return schools.find((school) => school.slug === slug)
}
