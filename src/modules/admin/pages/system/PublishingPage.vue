<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Публикация"
    description="Единая публикация черновых изменений по школе."
    :sections="[
      'Список draft changes',
      'Сводка затронутых разделов',
      'Кнопка Publish all',
      'Кнопка Discard draft'
    ]"
  />
</template>
