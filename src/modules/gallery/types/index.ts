export type GalleryCategory = 'all' | 'events' | 'study' | 'sport' | 'holidays'

export interface GalleryItemDTO {
  id: string
  title: string
  category: 'events' | 'study' | 'sport' | 'holidays'
  date: string
  imageUrl: string
  description: string
}

export interface GalleryItemUI {
  id: string
  title: string
  category: 'events' | 'study' | 'sport' | 'holidays'
  categoryLabel: string
  dateFormatted: string
  imageUrl: string
  description: string
}
