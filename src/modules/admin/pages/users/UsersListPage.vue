<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Пользователи школы"
    description="Список пользователей, роли, статусы доступа и управление кабинетами."
    :sections="[
      'Таблица пользователей',
      'Роли',
      'Статус доступа',
      'Быстрые действия'
    ]"
  />
</template>
