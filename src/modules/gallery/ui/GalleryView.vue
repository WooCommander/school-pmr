<script setup lang="ts">
import { onMounted } from 'vue'
import { useGalleryState } from '../state/gallery-state'
import GalleryFilter from './GalleryFilter.vue'
import GalleryCard from './GalleryCard.vue'
import GalleryModal from './GalleryModal.vue'

const {
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
  prevPhoto
} = useGalleryState()

onMounted(() => {
  loadItems()
})
</script>

<template>
  <div class="gallery-page">
    <div class="container gallery-page__inner">
      <header class="gallery-page__header">
        <h1 class="gallery-page__title">Фотогалерея школы</h1>
        <p class="gallery-page__subtitle">
          Яркие моменты из жизни учеников и учителей Днестровской средней школы №1
        </p>
      </header>

      <!-- Фильтр категорий -->
      <GalleryFilter
        :model-value="selectedCategory"
        @update:model-value="setCategory"
      />

      <!-- Состояние загрузки -->
      <div v-if="loading" class="gallery-page__state">
        <div class="gallery-page__loader" role="status" aria-label="Загрузка фотографий"></div>
      </div>

      <!-- Состояние ошибки -->
      <div v-else-if="error" class="gallery-page__state gallery-page__state--error">
        <p>{{ error }}</p>
        <button class="gallery-page__retry" @click="loadItems">Повторить загрузку</button>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="filteredItems.length === 0" class="gallery-page__state">
        <p>В данной категории пока нет фотографий.</p>
      </div>

      <!-- Сетка фотоальбомов -->
      <TransitionGroup v-else tag="div" name="grid-anim" class="gallery-page__grid">
        <GalleryCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @click="openModal"
        />
      </TransitionGroup>
    </div>

    <!-- Модальное окно просмотра -->
    <GalleryModal
      :item="activeItem"
      :has-next="hasNext"
      :has-prev="hasPrev"
      @close="closeModal"
      @next="nextPhoto"
      @prev="prevPhoto"
    />
  </div>
</template>

<style scoped lang="scss">
.gallery-page {
  padding: 64px 0 96px;

  @media (max-width: $mobile-breakpoint) {
    padding: 32px 0 64px;
  }
}

.gallery-page__inner {
  display: flex;
  flex-direction: column;
}

.gallery-page__header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 40px;
}

.gallery-page__title {
  font-size: 38px;
  font-weight: 800;
  color: $navy;
  margin-bottom: 12px;
  letter-spacing: -0.5px;

  @media (max-width: $mobile-breakpoint) {
    font-size: 28px;
  }
}

.gallery-page__subtitle {
  font-size: 18px;
  color: $text-secondary;
  line-height: 1.5;

  @media (max-width: $mobile-breakpoint) {
    font-size: 16px;
  }
}

.gallery-page__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  font-size: 16px;
  color: $text-secondary;
  text-align: center;
  gap: 16px;

  &--error {
    color: #D32F2F;
  }
}

.gallery-page__loader {
  width: 48px;
  height: 48px;
  border: 4px solid rgba($navy, 0.1);
  border-left-color: $gold;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.gallery-page__retry {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: $white;
  background: $navy;
  border: none;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: background $transition-fast;

  &:hover { background: $navy-light; }
}

.gallery-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Анимация элементов сетки */
.grid-anim-move,
.grid-anim-enter-active,
.grid-anim-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.grid-anim-enter-from,
.grid-anim-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.grid-anim-leave-active {
  position: absolute;
}
</style>
