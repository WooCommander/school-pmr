<script setup lang="ts">
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'
</script>

<template>
  <AdminPageStub
    title="Блоки главной"
    description="Настройка состава и порядка блоков главной страницы школьного сайта."
    :sections="[
      'Hero block',
      'Quick links',
      'News block',
      'Documents block',
      'Contacts block'
    ]"
  />
</template>
