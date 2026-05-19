<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Модули сайта"
    description="Включение и отключение системных разделов школы."
    :sections="[
      'Новости',
      'Документы',
      'Педагоги',
      'Расписание',
      'Галерея',
      'Контакты'
    ]"
  />
</template>
