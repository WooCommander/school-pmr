export interface Document {
  id: number
  schoolSlug: string
  title: string
  category: string
  date: string
  size: string
  url: string
}

export const documentCategories = [
  'Все',
  'Устав и лицензии',
  'Учебные планы',
  'Локальные акты',
  'Отчеты',
]

export const documents: Document[] = [
  {
    id: 1,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Устав школы (редакция 2024)',
    category: 'Устав и лицензии',
    date: '2024-09-01',
    size: '1.2 МБ',
    url: '#',
  },
  {
    id: 2,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Лицензия на образовательную деятельность',
    category: 'Устав и лицензии',
    date: '2023-06-15',
    size: '0.8 МБ',
    url: '#',
  },
  {
    id: 3,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Учебный план 2025–2026 (1–4 кл.)',
    category: 'Учебные планы',
    date: '2025-08-28',
    size: '0.5 МБ',
    url: '#',
  },
  {
    id: 4,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Правила внутреннего распорядка учащихся',
    category: 'Локальные акты',
    date: '2025-09-01',
    size: '0.3 МБ',
    url: '#',
  },
  {
    id: 5,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Самообследование школы 2024–2025',
    category: 'Отчеты',
    date: '2025-05-30',
    size: '2.1 МБ',
    url: '#',
  },
  {
    id: 6,
    schoolSlug: 'school-2',
    title: 'Устав ТСШ №2',
    category: 'Устав и лицензии',
    date: '2024-09-05',
    size: '1.0 МБ',
    url: '#',
  },
  {
    id: 7,
    schoolSlug: 'school-2',
    title: 'Учебный план ТСШ №2 на 2025–2026 год',
    category: 'Учебные планы',
    date: '2025-08-29',
    size: '0.6 МБ',
    url: '#',
  },
  {
    id: 8,
    schoolSlug: 'school-3',
    title: 'Лицензия ТСШ №3',
    category: 'Устав и лицензии',
    date: '2024-06-12',
    size: '0.7 МБ',
    url: '#',
  },
  {
    id: 9,
    schoolSlug: 'school-3',
    title: 'Публичный отчет школы за 2024 год',
    category: 'Отчеты',
    date: '2025-03-01',
    size: '1.4 МБ',
    url: '#',
  },
  {
    id: 10,
    schoolSlug: 'school-4',
    title: 'Положение об использовании мобильных телефонов',
    category: 'Локальные акты',
    date: '2025-09-01',
    size: '0.2 МБ',
    url: '#',
  },
  {
    id: 11,
    schoolSlug: 'lyceum-1',
    title: 'Устав лицея №1',
    category: 'Устав и лицензии',
    date: '2024-10-01',
    size: '1.1 МБ',
    url: '#',
  },
  {
    id: 12,
    schoolSlug: 'lyceum-1',
    title: 'Учебный план лицея №1',
    category: 'Учебные планы',
    date: '2025-08-28',
    size: '0.7 МБ',
    url: '#',
  },
]

export function getDocumentsBySchool(schoolSlug: string) {
  const schoolDocuments = documents.filter((document) => document.schoolSlug === schoolSlug)
  return schoolDocuments.length ? schoolDocuments : documents.filter((document) => document.schoolSlug === 'dnestrovsk-school-1')
}
