<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Приглашение пользователя"
    description="Создание приглашения новому пользователю и назначение роли внутри школы."
    :sections="[
      'Email',
      'Имя пользователя',
      'Роль',
      'Отправка приглашения'
    ]"
  />
</template>
