export type DocumentCategory =
  | 'charter'
  | 'curriculum'
  | 'local-act'
  | 'report'
  | 'admission'
export type DocumentStatus = 'draft' | 'published'

export interface DocumentItem {
  id: number
  schoolSlug: string
  title: string
  category: DocumentCategory
  description: string
  date: string
  size: string
  url: string
  status: DocumentStatus
  updatedAt: string
}

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  charter: 'Устав и лицензии',
  curriculum: 'Учебные планы',
  'local-act': 'Локальные акты',
  report: 'Отчеты',
  admission: 'Прием и заявления',
}

export const documentStatusLabels: Record<DocumentStatus, string> = {
  draft: 'Черновик',
  published: 'Опубликовано',
}

export const seedDocuments: DocumentItem[] = [
  {
    id: 1,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Устав школы, редакция 2026 года',
    category: 'charter',
    description: 'Актуальная редакция устава для родителей, сотрудников и проверяющих органов.',
    date: '2026-01-15',
    size: '1.2 МБ',
    url: '#',
    status: 'published',
    updatedAt: '2026-01-15T09:00:00',
  },
  {
    id: 2,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Лицензия на образовательную деятельность',
    category: 'charter',
    description: 'Скан лицензии с реквизитами и сроком действия.',
    date: '2025-09-01',
    size: '820 КБ',
    url: '#',
    status: 'published',
    updatedAt: '2025-09-01T11:20:00',
  },
  {
    id: 3,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Учебный план на 2026–2027 учебный год',
    category: 'curriculum',
    description: 'Нагрузка по уровням обучения и профилям классов.',
    date: '2026-05-10',
    size: '540 КБ',
    url: '#',
    status: 'published',
    updatedAt: '2026-05-10T08:45:00',
  },
  {
    id: 4,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Положение о школьном сайте',
    category: 'local-act',
    description: 'Правила публикации материалов и ответственности за контент.',
    date: '2026-04-18',
    size: '260 КБ',
    url: '#',
    status: 'draft',
    updatedAt: '2026-05-19T16:10:00',
  },
  {
    id: 5,
    schoolSlug: 'school-2',
    title: 'Публичный отчет школы за 2025 год',
    category: 'report',
    description: 'Основные показатели, достижения и результаты самооценки.',
    date: '2026-03-12',
    size: '1.4 МБ',
    url: '#',
    status: 'published',
    updatedAt: '2026-03-12T14:30:00',
  },
  {
    id: 6,
    schoolSlug: 'school-2',
    title: 'Заявление на прием в 1 класс',
    category: 'admission',
    description: 'Форма для родителей будущих первоклассников.',
    date: '2026-05-01',
    size: '190 КБ',
    url: '#',
    status: 'published',
    updatedAt: '2026-05-01T10:15:00',
  },
  {
    id: 7,
    schoolSlug: 'school-3',
    title: 'Правила внутреннего распорядка',
    category: 'local-act',
    description: 'Документ для учащихся и родителей по режиму школы.',
    date: '2026-02-20',
    size: '310 КБ',
    url: '#',
    status: 'published',
    updatedAt: '2026-02-20T09:40:00',
  },
  {
    id: 8,
    schoolSlug: 'lyceum-1',
    title: 'Пакет документов для поступления в профильные классы',
    category: 'admission',
    description: 'Перечень обязательных заявлений и справок.',
    date: '2026-05-11',
    size: '470 КБ',
    url: '#',
    status: 'published',
    updatedAt: '2026-05-11T12:25:00',
  },
]

export function cloneSeedDocuments() {
  return seedDocuments.map((item) => ({ ...item }))
}
