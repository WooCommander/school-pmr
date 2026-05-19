export type TemplateKey =
  | 'classic'
  | 'modern'
  | 'academic'
  | 'media'
  | 'compact'

export interface TemplatePreset {
  key: TemplateKey
  name: string
  description: string
  badge: string
  menuStyle: 'top' | 'split' | 'compact'
  heroStyle: 'large' | 'centered' | 'minimal'
  cardStyle: 'soft' | 'bordered' | 'flat'
  blockSummary: string[]
}

export const templatePresets: TemplatePreset[] = [
  {
    key: 'classic',
    name: 'Классический',
    description: 'Спокойная школьная подача с привычной структурой и акцентом на официальные разделы.',
    badge: 'Универсальный',
    menuStyle: 'top',
    heroStyle: 'large',
    cardStyle: 'soft',
    blockSummary: ['Большой hero', 'Новости и документы', 'Сдержанные карточки'],
  },
  {
    key: 'modern',
    name: 'Современный',
    description: 'Более динамичная главная страница с акцентом на быстрый доступ и визуальные блоки.',
    badge: 'Рекомендуем',
    menuStyle: 'split',
    heroStyle: 'centered',
    cardStyle: 'bordered',
    blockSummary: ['Центральный hero', 'Быстрые ссылки', 'Контрастные секции'],
  },
  {
    key: 'academic',
    name: 'Академический',
    description: 'Строгий вариант для лицеев и школ, где важны программа, достижения и официальный тон.',
    badge: 'Строгий',
    menuStyle: 'top',
    heroStyle: 'minimal',
    cardStyle: 'bordered',
    blockSummary: ['Минималистичный hero', 'Фокус на тексте', 'Строгая сетка'],
  },
  {
    key: 'media',
    name: 'Медиа-акцент',
    description: 'Шаблон с более живой главной страницей, галереей и активным новостным блоком.',
    badge: 'Для активности',
    menuStyle: 'split',
    heroStyle: 'large',
    cardStyle: 'soft',
    blockSummary: ['Галерея на первом экране', 'Новостной акцент', 'Визуальные карточки'],
  },
  {
    key: 'compact',
    name: 'Компактный',
    description: 'Плотная и практичная структура для школ, которым нужен короткий путь к разделам.',
    badge: 'Компактный',
    menuStyle: 'compact',
    heroStyle: 'minimal',
    cardStyle: 'flat',
    blockSummary: ['Сжатый hero', 'Плотное меню', 'Минимум декоративности'],
  },
]

export function getTemplatePresetByKey(key: TemplateKey) {
  return templatePresets.find((preset) => preset.key === key)
}
