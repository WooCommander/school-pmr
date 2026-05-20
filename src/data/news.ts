export type NewsCategory = 'events' | 'announce' | 'sport' | 'olympiad' | 'other'
export type NewsStatus = 'draft' | 'published'

export interface NewsItem {
  id: number
  schoolSlug: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: NewsCategory
  date: string
  status: NewsStatus
  author: string
  updatedAt: string
  image?: string
}

export const categoryLabels: Record<NewsCategory, string> = {
  events: 'Мероприятия',
  announce: 'Объявления',
  sport: 'Спорт',
  olympiad: 'Олимпиады',
  other: 'Прочее',
}

export const statusLabels: Record<NewsStatus, string> = {
  draft: 'Черновик',
  published: 'Опубликовано',
}

export const seedNews: NewsItem[] = [
  {
    id: 1,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'День открытых дверей для будущих первоклассников',
    slug: 'den-otkrytyh-dverej-dlya-budushchih-pervoklassnikov',
    excerpt:
      '22 мая школа проводит день открытых дверей для родителей будущих первоклассников.',
    content:
      '22 мая с 10:00 до 13:00 школа проводит день открытых дверей для родителей будущих первоклассников.\n\nВ программе: экскурсия по школе, встреча с учителями начальных классов, знакомство с администрацией и ответы на вопросы о приёме.\n\nЗапись доступна по телефону приёмной и через школьный сайт.',
    category: 'events',
    date: '2026-05-18',
    status: 'published',
    author: 'Администратор школы',
    updatedAt: '2026-05-18T09:00:00',
  },
  {
    id: 2,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Изменение расписания звонков с 20 мая',
    slug: 'izmenenie-raspisaniya-zvonkov-s-20-maya',
    excerpt:
      'С 20 мая вводится летнее расписание звонков. Первый урок начинается в 8:00.',
    content:
      'С 20 мая вводится летнее расписание звонков.\n\n1 урок: 8:00-8:45\n2 урок: 8:55-9:40\n3 урок: 9:50-10:35\n4 урок: 10:55-11:40\n5 урок: 11:50-12:35\n\nБольшая перемена сохраняется после третьего урока.',
    category: 'announce',
    date: '2026-05-17',
    status: 'published',
    author: 'Заместитель директора',
    updatedAt: '2026-05-17T13:30:00',
  },
  {
    id: 3,
    schoolSlug: 'dnestrovsk-school-1',
    title: 'Подготовка к последнему звонку',
    slug: 'podgotovka-k-poslednemu-zvonku',
    excerpt:
      'Школа готовит программу последнего звонка. Репетиции для выпускников стартуют на этой неделе.',
    content:
      'Школа начала подготовку к последнему звонку.\n\nВ программу войдут выступления выпускников, награждение активистов и благодарности педагогам.\n\nРепетиции стартуют на этой неделе, финальное расписание будет опубликовано после согласования.',
    category: 'events',
    date: '2026-05-20',
    status: 'draft',
    author: 'Контент-менеджер',
    updatedAt: '2026-05-20T08:00:00',
  },
  {
    id: 4,
    schoolSlug: 'school-2',
    title: 'Победа команды школы на городской олимпиаде по математике',
    slug: 'pobeda-komandy-shkoly-na-gorodskoj-olimpiade-po-matematike',
    excerpt:
      'Ученики 9 и 11 классов заняли призовые места на городском этапе олимпиады по математике.',
    content:
      'Команда школы успешно выступила на городском этапе олимпиады по математике.\n\nУчащиеся 9 и 11 классов заняли призовые места, а школа получила благодарность за высокий уровень подготовки участников.\n\nТоржественное награждение состоится в актовом зале в пятницу.',
    category: 'olympiad',
    date: '2026-05-15',
    status: 'published',
    author: 'Директор',
    updatedAt: '2026-05-15T12:10:00',
  },
  {
    id: 5,
    schoolSlug: 'school-2',
    title: 'Финал школьного шахматного турнира',
    slug: 'final-shkolnogo-shahmatnogo-turnira',
    excerpt:
      'Завершился ежегодный школьный турнир по шахматам среди учащихся 5-11 классов.',
    content:
      'Завершился ежегодный школьный турнир по шахматам.\n\nВ этом году в соревнованиях приняли участие 42 школьника. Победители и призёры будут награждены на общешкольной линейке.\n\nФотографии и результаты будут опубликованы в галерее и новостной ленте.',
    category: 'sport',
    date: '2026-05-12',
    status: 'published',
    author: 'Педагог-организатор',
    updatedAt: '2026-05-12T17:20:00',
  },
  {
    id: 6,
    schoolSlug: 'lyceum-1',
    title: 'Старт приёма документов в профильные классы',
    slug: 'start-priema-dokumentov-v-profilnye-klassy',
    excerpt:
      'Лицей открыл приём документов в профильные классы на новый учебный год.',
    content:
      'Стартовал приём документов в профильные классы.\n\nПодать заявление можно через канцелярию лицея и электронную форму на сайте.\n\nРасписание консультаций и перечень необходимых документов доступны в разделе для поступающих.',
    category: 'announce',
    date: '2026-05-19',
    status: 'published',
    author: 'Секретарь приёмной комиссии',
    updatedAt: '2026-05-19T11:45:00',
  },
]

export function cloneSeedNews() {
  return seedNews.map((item) => ({ ...item }))
}
