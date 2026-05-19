<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Кастомизация"
    description="Простая настройка внешнего вида без кода: кнопки, плотность, радиусы, акценты."
    :sections="[
      'Стиль кнопок',
      'Скругления',
      'Плотность интерфейса',
      'Допустимые token overrides'
    ]"
  />
</template>
