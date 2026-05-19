<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Общая информация"
    description="Базовые данные школы: полное и краткое название, тип школы, город и описание."
    :sections="[
      'Форма общих данных школы',
      'Сохранение draft-версии',
      'Валидация обязательных полей'
    ]"
  />
</template>
