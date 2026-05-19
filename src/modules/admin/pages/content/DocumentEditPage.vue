<script setup lang="ts">
import { useRoute } from 'vue-router'
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'

const route = useRoute()
const mode = route.name === 'admin-school-content-documents-create' ? 'загрузки документа' : 'редактирования документа'
</script>

<template>
  <AdminPageStub
    :title="mode"
    description="Файл, название, категория, описание, метаданные и публикация."
    :sections="[
      'Upload файла',
      'Название и категория',
      'Размер и метаданные',
      'Сохранение / публикация'
    ]"
  />
</template>
