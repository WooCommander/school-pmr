<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Шаблоны"
    description="Выбор одного из готовых шаблонов сайта школы."
    :sections="[
      'Каталог из 5 шаблонов',
      'Карточки с preview',
      'Выбор active/draft шаблона',
      'Сравнение текущего и нового шаблона'
    ]"
  />
</template>
