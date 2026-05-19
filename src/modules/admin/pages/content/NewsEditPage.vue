<script setup lang="ts">
import { useRoute } from 'vue-router'
import AdminPageStub from '@/modules/admin/components/AdminPageStub.vue'

const route = useRoute()
const mode = route.name === 'admin-school-content-news-create' ? 'создания' : 'редактирования'
</script>

<template>
  <AdminPageStub
    :title="`Экран ${mode} новости`"
    description="Редактор заголовка, анонса, текста, категории, обложки и статуса публикации."
    :sections="[
      'Title и slug',
      'Excerpt',
      'Rich text editor',
      'Категория',
      'Cover image',
      'Сохранить черновик / опубликовать'
    ]"
  />
</template>
