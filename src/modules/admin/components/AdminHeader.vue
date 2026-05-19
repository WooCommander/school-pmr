<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : null
)
</script>

<template>
  <header class="admin-header">
    <div>
      <p class="admin-header__eyebrow">Панель управления</p>
      <h1 class="admin-header__title">
        {{ schoolSlug ? `Школа: ${schoolSlug}` : 'Админка' }}
      </h1>
    </div>

    <div class="admin-header__actions">
      <button class="admin-header__btn">Предпросмотр</button>
      <button class="admin-header__btn admin-header__btn--primary">Опубликовать</button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid $border;
  background: $white;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.admin-header__eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: $text-muted;
}

.admin-header__title {
  margin-top: 4px;
  font-size: 22px;
  font-weight: 600;
  color: $text-primary;
}

.admin-header__actions {
  display: flex;
  gap: 10px;
}

.admin-header__btn {
  padding: 10px 14px;
  border-radius: 10px;
  background: $surface-2;
  color: $navy;
  font-weight: 500;

  &--primary {
    background: $navy;
    color: $white;
  }
}
</style>
