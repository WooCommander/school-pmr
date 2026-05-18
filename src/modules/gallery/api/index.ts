import type { GalleryItemDTO } from '../types'

const MOCK_GALLERY: GalleryItemDTO[] = [
  {
    id: '1',
    title: 'День знаний и Торжественная линейка',
    category: 'events',
    date: '2025-09-01',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    description: 'Торжественная линейка, посвященная началу нового учебного года. Первоклассники впервые перешагнули порог родной школы.'
  },
  {
    id: '2',
    title: 'Открытый урок по физике',
    category: 'study',
    date: '2025-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    description: 'Учащиеся 10 класса проводят увлекательные лабораторные эксперименты по электродинамике на новом оборудовании.'
  },
  {
    id: '3',
    title: 'Городские соревнования по волейболу',
    category: 'sport',
    date: '2025-11-20',
    imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1000&q=80',
    description: 'Школьная сборная заняла первое место в осеннем турнире среди общеобразовательных учреждений города.'
  },
  {
    id: '4',
    title: 'Новогодний карнавал и концерт',
    category: 'holidays',
    date: '2025-12-28',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
    description: 'Праздничный концерт с театрализованным представлением, конкурсами и подарками от Деда Мороза.'
  },
  {
    id: '5',
    title: 'Урок информатики и программирования',
    category: 'study',
    date: '2026-02-10',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    description: 'Освоение современных цифровых технологий и создание первых веб-проектов в обновленном компьютерном классе.'
  },
  {
    id: '6',
    title: 'Весенняя эстафета на стадионе',
    category: 'sport',
    date: '2026-04-05',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1000&q=80',
    description: 'Ежегодные спортивные состязания «Веселые старты» для учащихся средних классов в поддержку здорового образа жизни.'
  },
  {
    id: '7',
    title: 'Неделя детской и юношеской книги',
    category: 'study',
    date: '2026-04-18',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    description: 'Литературные чтения и выставка редких книг в школьной библиотеке при активном участии педагогов-словесников.'
  },
  {
    id: '8',
    title: 'Школьный театральный фестиваль',
    category: 'events',
    date: '2026-05-02',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
    description: 'Премьера спектакля школьного драматического кружка, собравшая полный актовый зал восторженных зрителей.'
  }
]

export async function fetchGalleryItemsAPI(): Promise<GalleryItemDTO[]> {
  // Имитация сетевой задержки 300мс
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_GALLERY), 300)
  })
}
