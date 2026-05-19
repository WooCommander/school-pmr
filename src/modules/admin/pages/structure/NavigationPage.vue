<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Меню и навигация"
    description="Управление структурой меню школы, видимостью и порядком пунктов."
    :sections="[
      'Drag and drop порядок пунктов',
      'Переименование пунктов',
      'Видимость в меню',
      'Preview desktop/mobile'
    ]"
  />
</template>
