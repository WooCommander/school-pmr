<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="История изменений"
    description="Логи действий, история правок и откаты поддерживаемых сущностей."
    :sections="[
      'Timeline изменений',
      'Фильтр по пользователю',
      'Фильтр по сущности',
      'Rollback поддерживаемых конфигураций'
    ]"
  />
</template>
