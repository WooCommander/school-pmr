<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { GalleryItemUI } from '../types'

interface Props {
  item: GalleryItemUI | null
  hasNext: boolean
  hasPrev: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

function onKeyDown(e: KeyboardEvent): void {
  if (!props.item) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight' && props.hasNext) emit('next')
  if (e.key === 'ArrowLeft' && props.hasPrev) emit('prev')
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="props.item" class="gallery-modal" role="dialog" aria-modal="true" @click.self="emit('close')">
      <!-- Кнопка закрытия -->
      <button class="gallery-modal__close" aria-label="Закрыть просмотр" @click="emit('close')">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <!-- Кнопка назад -->
      <button
        v-if="props.hasPrev"
        class="gallery-modal__nav gallery-modal__nav--prev"
        aria-label="Предыдущее фото"
        @click="emit('prev')"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <!-- Контейнер фото и описания -->
      <div class="gallery-modal__content" @click.self="emit('close')">
        <div class="gallery-modal__img-box">
          <img :src="props.item.imageUrl" :alt="props.item.title" class="gallery-modal__img" />
        </div>
        <div class="gallery-modal__info">
          <div class="gallery-modal__meta">
            <span class="gallery-modal__badge" :class="`gallery-modal__badge--${props.item.category}`">
              {{ props.item.categoryLabel }}
            </span>
            <span class="gallery-modal__date">{{ props.item.dateFormatted }}</span>
          </div>
          <h2 class="gallery-modal__title">{{ props.item.title }}</h2>
          <p class="gallery-modal__desc">{{ props.item.description }}</p>
        </div>
      </div>

      <!-- Кнопка вперед -->
      <button
        v-if="props.hasNext"
        class="gallery-modal__nav gallery-modal__nav--next"
        aria-label="Следующее фото"
        @click="emit('next')"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.gallery-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(#050B18, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-modal__close {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1010;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background $transition-fast, transform $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }
}

.gallery-modal__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1010;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background $transition-fast, transform $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &--prev { left: 32px; }
  &--next { right: 32px; }

  @media (max-width: $mobile-breakpoint) {
    width: 44px;
    height: 44px;
    &--prev { left: 12px; }
    &--next { right: 12px; }
  }
}

.gallery-modal__content {
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.gallery-modal__img-box {
  width: 100%;
  max-height: 65vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery-modal__img {
  max-width: 100%;
  max-height: 65vh;
  object-fit: contain;
}

.gallery-modal__info {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: $mobile-breakpoint) {
    padding: 20px;
  }
}

.gallery-modal__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gallery-modal__badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  color: $white;

  &--events { background: $gold; }
  &--study { background: #185FA5; }
  &--sport { background: #2D8A4E; }
  &--holidays { background: #7B3EA8; }
}

.gallery-modal__date {
  font-size: 14px;
  color: $text-secondary;
}

.gallery-modal__title {
  font-size: 24px;
  font-weight: 700;
  color: $navy;
  margin: 0;
  line-height: 1.2;

  @media (max-width: $mobile-breakpoint) {
    font-size: 20px;
  }
}

.gallery-modal__desc {
  font-size: 15px;
  color: $text-secondary;
  margin: 0;
  line-height: 1.5;
}

/* Переход для модального окна */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
