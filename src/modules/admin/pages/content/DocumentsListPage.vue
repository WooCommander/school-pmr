<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Документы"
    description="Список документов школы, категории, публикация и управление файлами."
    :sections="[
      'Список документов',
      'Категории',
      'Статусы публикации',
      'Переход к загрузке и редактированию'
    ]"
  />
</template>
