export interface Document {
  id: number
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
  'Отчёты',
]

export const documents: Document[] = [
  {
    id: 1,
    title: 'Устав школы (редакция 2024)',
    category: 'Устав и лицензии',
    date: '2024-09-01',
    size: '1.2 МБ',
    url: '#',
  },
  {
    id: 2,
    title: 'Лицензия на образовательную деятельность',
    category: 'Устав и лицензии',
    date: '2023-06-15',
    size: '0.8 МБ',
    url: '#',
  },
  {
    id: 3,
    title: 'Учебный план 2025–2026 (1–4 кл.)',
    category: 'Учебные планы',
    date: '2025-08-28',
    size: '0.5 МБ',
    url: '#',
  },
  {
    id: 4,
    title: 'Учебный план 2025–2026 (5–9 кл.)',
    category: 'Учебные планы',
    date: '2025-08-28',
    size: '0.6 МБ',
    url: '#',
  },
  {
    id: 5,
    title: 'Учебный план 2025–2026 (10–11 кл.)',
    category: 'Учебные планы',
    date: '2025-08-28',
    size: '0.4 МБ',
    url: '#',
  },
  {
    id: 6,
    title: 'Правила внутреннего распорядка учащихся',
    category: 'Локальные акты',
    date: '2025-09-01',
    size: '0.3 МБ',
    url: '#',
  },
  {
    id: 7,
    title: 'Положение об использовании мобильных телефонов',
    category: 'Локальные акты',
    date: '2025-09-01',
    size: '0.2 МБ',
    url: '#',
  },
  {
    id: 8,
    title: 'Самообследование школы 2024–2025',
    category: 'Отчёты',
    date: '2025-05-30',
    size: '2.1 МБ',
    url: '#',
  },
  {
    id: 9,
    title: 'Финансово-хозяйственная деятельность 2024',
    category: 'Отчёты',
    date: '2025-03-01',
    size: '1.4 МБ',
    url: '#',
  },
]
