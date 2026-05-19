<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Цветовые темы"
    description="Выбор одной из готовых цветовых тем для школы."
    :sections="[
      '10 theme presets',
      'Preview палитры',
      'Выбор темы в draft',
      'Проверка контрастности'
    ]"
  />
</template>
