<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Контакты школы"
    description="Адрес, телефоны, email, часы работы и карта."
    :sections="[
      'Контактная форма',
      'Координаты и карта',
      'Публичное отображение контактов'
    ]"
  />
</template>
