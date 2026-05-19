<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Дашборд школы"
    description="Стартовый экран кабинета: статус сайта, активный шаблон, тема, быстрые действия и черновики."
    :sections="[
      'Карточка школы и текущей роли',
      'Активный шаблон и тема',
      'Статус публикации',
      'Последние изменения',
      'Быстрые действия'
    ]"
  />
</template>
