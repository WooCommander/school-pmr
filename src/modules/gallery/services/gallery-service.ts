import { fetchGalleryItemsAPI } from '../api'
import { toGalleryItemsUIList } from '../adapters/gallery-adapter'
import type { GalleryItemUI } from '../types'

export async function getGalleryItemsService(): Promise<GalleryItemUI[]> {
  const dtos = await fetchGalleryItemsAPI()
  return toGalleryItemsUIList(dtos)
}
