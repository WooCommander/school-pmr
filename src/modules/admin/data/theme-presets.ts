export type ThemeKey =
  | 'blue'
  | 'navy'
  | 'emerald'
  | 'burgundy'
  | 'teal'
  | 'graphite'
  | 'terracotta'
  | 'sand'
  | 'violet'
  | 'slate'

export interface ThemePreset {
  key: ThemeKey
  name: string
  description: string
  contrastLabel: string
  colors: {
    primary: string
    secondary: string
    accent: string
    surface: string
    text: string
  }
}

export const themePresets: ThemePreset[] = [
  {
    key: 'blue',
    name: 'School Blue',
    description: 'Базовая синяя тема для официального школьного сайта.',
    contrastLabel: 'Высокая контрастность',
    colors: {
      primary: '#0F2A5E',
      secondary: '#1A3A7A',
      accent: '#C9A030',
      surface: '#F6F8FC',
      text: '#0F1E3C',
    },
  },
  {
    key: 'navy',
    name: 'Deep Navy',
    description: 'Более строгая и насыщенная тема с деловым характером.',
    contrastLabel: 'Высокая контрастность',
    colors: {
      primary: '#091D42',
      secondary: '#16376D',
      accent: '#E8C05A',
      surface: '#F4F7FB',
      text: '#10203E',
    },
  },
  {
    key: 'emerald',
    name: 'Emerald',
    description: 'Спокойная академическая тема с зеленым акцентом.',
    contrastLabel: 'Сбалансированная',
    colors: {
      primary: '#1E5C4A',
      secondary: '#2D8A4E',
      accent: '#D6B75D',
      surface: '#F5FAF7',
      text: '#15352F',
    },
  },
  {
    key: 'burgundy',
    name: 'Burgundy',
    description: 'Статусная тема для лицеев и школ с более строгим визуальным тоном.',
    contrastLabel: 'Сбалансированная',
    colors: {
      primary: '#6E2438',
      secondary: '#9A3853',
      accent: '#D7B36A',
      surface: '#FBF6F7',
      text: '#311720',
    },
  },
  {
    key: 'teal',
    name: 'Teal',
    description: 'Свежая тема с акцентом на современные образовательные проекты.',
    contrastLabel: 'Комфортная',
    colors: {
      primary: '#0F5F66',
      secondary: '#1B8A91',
      accent: '#F0BE54',
      surface: '#F4FBFB',
      text: '#15363A',
    },
  },
  {
    key: 'graphite',
    name: 'Graphite',
    description: 'Нейтральная тема с графитовым основанием и мягким акцентом.',
    contrastLabel: 'Высокая контрастность',
    colors: {
      primary: '#374151',
      secondary: '#4B5563',
      accent: '#D4A64B',
      surface: '#F8FAFC',
      text: '#111827',
    },
  },
  {
    key: 'terracotta',
    name: 'Terracotta',
    description: 'Теплая тема с живым акцентом для более дружелюбной подачи сайта.',
    contrastLabel: 'Комфортная',
    colors: {
      primary: '#A14E3B',
      secondary: '#C76B4C',
      accent: '#F1C56A',
      surface: '#FDF8F5',
      text: '#41261E',
    },
  },
  {
    key: 'sand',
    name: 'Sand',
    description: 'Светлая нейтральная тема с мягкими песочными оттенками.',
    contrastLabel: 'Мягкая',
    colors: {
      primary: '#8B6B3E',
      secondary: '#B58A4B',
      accent: '#2E6B9A',
      surface: '#FCF8F0',
      text: '#3F3426',
    },
  },
  {
    key: 'violet',
    name: 'Violet',
    description: 'Акцентная тема для школ, которым нужен более выразительный стиль.',
    contrastLabel: 'Сбалансированная',
    colors: {
      primary: '#5B3C88',
      secondary: '#7B56B2',
      accent: '#E7C15F',
      surface: '#F8F6FC',
      text: '#261A38',
    },
  },
  {
    key: 'slate',
    name: 'Slate',
    description: 'Холодная структурная тема с аккуратными серо-синими оттенками.',
    contrastLabel: 'Высокая контрастность',
    colors: {
      primary: '#334155',
      secondary: '#516277',
      accent: '#D6A84F',
      surface: '#F6F8FB',
      text: '#17212F',
    },
  },
]

export function getThemePresetByKey(key: ThemeKey) {
  return themePresets.find((preset) => preset.key === key)
}
