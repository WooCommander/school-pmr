import type { GalleryItemDTO } from '../types'

const MOCK_GALLERY: Record<string, GalleryItemDTO[]> = {
  'dnestrovsk-school-1': [
    {
      id: 'school1-1',
      schoolSlug: 'dnestrovsk-school-1',
      title: 'День знаний и торжественная линейка',
      category: 'events',
      date: '2025-09-01',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
      description: 'Торжественная линейка, посвященная началу нового учебного года. Первоклассники впервые переступили порог родной школы.',
    },
    {
      id: 'school1-2',
      schoolSlug: 'dnestrovsk-school-1',
      title: 'Открытый урок по физике',
      category: 'study',
      date: '2025-10-15',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      description: 'Учащиеся старших классов провели серию лабораторных опытов на обновленном оборудовании кабинета физики.',
    },
    {
      id: 'school1-3',
      schoolSlug: 'dnestrovsk-school-1',
      title: 'Городские соревнования по волейболу',
      category: 'sport',
      date: '2025-11-20',
      imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1000&q=80',
      description: 'Школьная сборная заняла первое место в осеннем турнире среди образовательных учреждений города.',
    },
    {
      id: 'school1-4',
      schoolSlug: 'dnestrovsk-school-1',
      title: 'Новогодний карнавал и концерт',
      category: 'holidays',
      date: '2025-12-28',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
      description: 'Праздничный концерт с театрализованным представлением, конкурсами и подарками для учеников начальной школы.',
    },
  ],
  'school-2': [
    {
      id: 'school2-1',
      schoolSlug: 'school-2',
      title: 'Фестиваль семейного чтения',
      category: 'events',
      date: '2026-02-12',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      description: 'Учителя и родители провели литературную встречу с выставкой любимых книг и семейных историй.',
    },
    {
      id: 'school2-2',
      schoolSlug: 'school-2',
      title: 'Практикум по робототехнике',
      category: 'study',
      date: '2026-03-04',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
      description: 'Команды учеников собрали первые модели и протестировали их на мини-полигоне инженерного кружка.',
    },
    {
      id: 'school2-3',
      schoolSlug: 'school-2',
      title: 'Весенний легкоатлетический кросс',
      category: 'sport',
      date: '2026-04-09',
      imageUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1000&q=80',
      description: 'Школьный стадион принял общий спортивный день с эстафетами и личным первенством по бегу.',
    },
  ],
  'school-3': [
    {
      id: 'school3-1',
      schoolSlug: 'school-3',
      title: 'Неделя естественных наук',
      category: 'study',
      date: '2026-03-18',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
      description: 'В кабинетах химии и биологии прошли эксперименты, мини-лекции и командные задания для учеников средней школы.',
    },
    {
      id: 'school3-2',
      schoolSlug: 'school-3',
      title: 'Праздник последнего звонка',
      category: 'holidays',
      date: '2026-05-25',
      imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1000&q=80',
      description: 'Выпускники подготовили творческую программу, а школа провела церемонию награждения отличившихся учеников.',
    },
  ],
  'school-4': [
    {
      id: 'school4-1',
      schoolSlug: 'school-4',
      title: 'Мастерская по технологии',
      category: 'study',
      date: '2026-01-23',
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=80',
      description: 'Ученики представили проекты по деревообработке и моделированию в школьной мастерской.',
    },
    {
      id: 'school4-2',
      schoolSlug: 'school-4',
      title: 'Осенний благотворительный ярмарок',
      category: 'events',
      date: '2025-10-07',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
      description: 'Классы оформили стенды с поделками и выпечкой, а вырученные средства направили на школьные инициативы.',
    },
  ],
  'lyceum-1': [
    {
      id: 'lyceum1-1',
      schoolSlug: 'lyceum-1',
      title: 'Научная конференция лицеистов',
      category: 'study',
      date: '2026-02-27',
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
      description: 'Лицеисты представили исследовательские проекты по физике, биологии и истории на открытой конференции.',
    },
    {
      id: 'lyceum1-2',
      schoolSlug: 'lyceum-1',
      title: 'Турнир по мини-футболу',
      category: 'sport',
      date: '2026-04-14',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
      description: 'Команды параллелей сыграли финальные матчи школьного турнира перед весенними каникулами.',
    },
    {
      id: 'lyceum1-3',
      schoolSlug: 'lyceum-1',
      title: 'Театральный вечер иностранных языков',
      category: 'holidays',
      date: '2026-05-08',
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80',
      description: 'Сцена актового зала собрала постановки и музыкальные номера на английском и французском языках.',
    },
  ],
}

export async function fetchGalleryItemsAPI(schoolSlug: string): Promise<GalleryItemDTO[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve((MOCK_GALLERY[schoolSlug] ?? []).map((item) => ({ ...item }))), 300)
  })
}
