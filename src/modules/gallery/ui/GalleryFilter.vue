<script setup lang="ts">
import type { GalleryCategory } from '../types'

interface CategoryOption {
  value: GalleryCategory
  label: string
}

interface Props {
  modelValue: GalleryCategory
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: GalleryCategory): void
}>()

const options: CategoryOption[] = [
  { value: 'all', label: 'Все альбомы' },
  { value: 'events', label: 'Мероприятия' },
  { value: 'study', label: 'Учебный процесс' },
  { value: 'sport', label: 'Спорт' },
  { value: 'holidays', label: 'Праздники' }
]

function onSelect(value: GalleryCategory): void {
  emit('update:modelValue', value)
}
</script>

<template>
  <nav class="gallery-filter" aria-label="Фильтр фотографий">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="gallery-filter__btn"
      :class="{ 'gallery-filter__btn--active': props.modelValue === opt.value }"
      @click="onSelect(opt.value)"
    >
      {{ opt.label }}
    </button>
  </nav>
</template>

<style scoped lang="scss">
.gallery-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;
}

.gallery-filter__btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: $text-secondary;
  background: $surface;
  border: 1px solid $border;
  border-radius: 30px;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: $navy;
    background: $surface-2;
    border-color: rgba($navy, 0.2);
  }

  &--active {
    color: $white;
    background: $navy;
    border-color: $navy;
    box-shadow: 0 4px 12px rgba($navy, 0.2);

    &:hover {
      color: $white;
      background: $navy-light;
    }
  }
}
</style>
