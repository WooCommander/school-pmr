<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Новости"
    description="Список новостей школы, фильтры, статусы и массовые действия."
    :sections="[
      'Список новостей',
      'Поиск и фильтры',
      'Draft/published status',
      'Переход к созданию и редактированию'
    ]"
  />
</template>
