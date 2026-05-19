<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Предпросмотр"
    description="Живой preview черновой версии сайта школы перед публикацией."
    :sections="[
      'Desktop/mobile preview',
      'Draft vs published',
      'Переключение страниц preview',
      'Публикация изменений'
    ]"
  />
</template>
