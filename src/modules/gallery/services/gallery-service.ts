import { fetchGalleryItemsAPI } from '../api'
import { toGalleryItemsUIList } from '../adapters/gallery-adapter'
import type { GalleryItemUI } from '../types'

export async function getGalleryItemsService(schoolSlug: string): Promise<GalleryItemUI[]> {
  const dtos = await fetchGalleryItemsAPI(schoolSlug)
  return toGalleryItemsUIList(dtos)
}
