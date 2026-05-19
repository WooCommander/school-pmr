<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Брендинг"
    description="Логотип, favicon, обложка школы и базовые визуальные медиа."
    :sections="[
      'Загрузка логотипа',
      'Favicon',
      'Hero/cover image',
      'Превью бренд-материалов'
    ]"
  />
</template>
