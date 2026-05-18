<script setup lang="ts">
import type { GalleryItemUI } from '../types'

interface Props {
  item: GalleryItemUI
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', id: string): void
}>()
</script>

<template>
  <article class="gallery-card" @click="emit('click', props.item.id)" role="button" tabindex="0" @keydown.enter="emit('click', props.item.id)">
    <div class="gallery-card__img-wrapper">
      <img
        :src="props.item.imageUrl"
        :alt="props.item.title"
        class="gallery-card__img"
        loading="lazy"
      />
      <span class="gallery-card__badge" :class="`gallery-card__badge--${props.item.category}`">
        {{ props.item.categoryLabel }}
      </span>
      <div class="gallery-card__hover-overlay">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </div>
    </div>
    <div class="gallery-card__content">
      <time class="gallery-card__date" :datetime="props.item.dateFormatted">
        {{ props.item.dateFormatted }}
      </time>
      <h3 class="gallery-card__title">{{ props.item.title }}</h3>
    </div>
  </article>
</template>

<style scoped lang="scss">
.gallery-card {
  background: $white;
  border-radius: $radius-lg;
  border: 1px solid $border;
  overflow: hidden;
  cursor: pointer;
  transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;
  display: flex;
  flex-direction: column;

  &:hover, &:focus-visible {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba($navy, 0.08);
    border-color: rgba($navy, 0.3);
    outline: none;

    .gallery-card__img {
      transform: scale(1.05);
    }

    .gallery-card__hover-overlay {
      opacity: 1;
    }
  }
}

.gallery-card__img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: $surface;
}

.gallery-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  color: $white;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &--events { background: $gold; }
  &--study { background: #185FA5; }
  &--sport { background: #2D8A4E; }
  &--holidays { background: #7B3EA8; }
}

.gallery-card__hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba($navy, 0.35);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  opacity: 0;
  transition: opacity $transition-base;
  z-index: 3;
}

.gallery-card__content {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.gallery-card__date {
  font-size: 12px;
  color: $text-secondary;
}

.gallery-card__title {
  font-size: 16px;
  font-weight: 600;
  color: $navy;
  line-height: 1.3;
  margin: 0;
}
</style>
