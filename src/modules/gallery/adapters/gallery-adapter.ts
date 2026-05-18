import type { GalleryItemDTO, GalleryItemUI } from '../types'

const CATEGORY_MAP: Record<'events' | 'study' | 'sport' | 'holidays', string> = {
  events: 'Мероприятия',
  study: 'Учебный процесс',
  sport: 'Спорт',
  holidays: 'Праздники'
}

export function toGalleryItemUI(dto: GalleryItemDTO): GalleryItemUI {
  let dateFormatted = dto.date
  try {
    const dateObj = new Date(dto.date)
    dateFormatted = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj)
  } catch (err) {
    console.error('Ошибка форматирования даты:', err)
  }

  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    categoryLabel: CATEGORY_MAP[dto.category] ?? 'Разное',
    dateFormatted,
    imageUrl: dto.imageUrl,
    description: dto.description
  }
}

export function toGalleryItemsUIList(dtos: GalleryItemDTO[]): GalleryItemUI[] {
  return dtos.map(toGalleryItemUI)
}
