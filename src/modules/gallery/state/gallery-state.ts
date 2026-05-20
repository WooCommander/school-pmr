import { ref, computed } from 'vue'
import { getGalleryItemsService } from '../services/gallery-service'
import type { GalleryItemUI, GalleryCategory } from '../types'

export function useGalleryState() {
  const items = ref<GalleryItemUI[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<GalleryCategory>('all')
  const activeItemId = ref<string | null>(null)

  const filteredItems = computed<GalleryItemUI[]>(() => {
    if (selectedCategory.value === 'all') {
      return items.value
    }

    return items.value.filter((item) => item.category === selectedCategory.value)
  })

  const activeItem = computed<GalleryItemUI | null>(() => {
    if (!activeItemId.value) return null
    return items.value.find((item) => item.id === activeItemId.value) ?? null
  })

  const activeIndex = computed<number>(() => {
    if (!activeItemId.value) return -1
    return filteredItems.value.findIndex((item) => item.id === activeItemId.value)
  })

  const hasNext = computed<boolean>(() => activeIndex.value >= 0 && activeIndex.value < filteredItems.value.length - 1)
  const hasPrev = computed<boolean>(() => activeIndex.value > 0)

  async function loadItems(schoolSlug: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      items.value = await getGalleryItemsService(schoolSlug)
    } catch (err) {
      error.value = 'Не удалось загрузить фотографии. Пожалуйста, повторите попытку.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  function setCategory(category: GalleryCategory): void {
    selectedCategory.value = category
    activeItemId.value = null
  }

  function openModal(id: string): void {
    activeItemId.value = id
    document.body.style.overflow = 'hidden'
  }

  function closeModal(): void {
    activeItemId.value = null
    document.body.style.overflow = ''
  }

  function nextPhoto(): void {
    if (hasNext.value) {
      const nextItem = filteredItems.value[activeIndex.value + 1]
      if (nextItem) activeItemId.value = nextItem.id
    }
  }

  function prevPhoto(): void {
    if (hasPrev.value) {
      const prevItem = filteredItems.value[activeIndex.value - 1]
      if (prevItem) activeItemId.value = prevItem.id
    }
  }

  return {
    items,
    loading,
    error,
    selectedCategory,
    filteredItems,
    activeItem,
    hasNext,
    hasPrev,
    loadItems,
    setCategory,
    openModal,
    closeModal,
    nextPhoto,
    prevPhoto,
  }
}
