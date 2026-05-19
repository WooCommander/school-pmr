<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Главная страница"
    description="Управление hero-блоком, цифрами, быстрыми ссылками и контентом главной."
    :sections="[
      'Hero title и hero text',
      'Карточки статистики',
      'Быстрые ссылки',
      'CTA-кнопки'
    ]"
  />
</template>
