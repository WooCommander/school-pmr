<script setup lang="ts">
defineProps<{
  title: string
  description: string
  sections?: string[]
}>()
</script>

<template>
  <section class="admin-page">
    <div class="admin-page__header">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>

    <div class="admin-page__body">
      <div class="admin-page__card">
        <h2>Заготовка экрана</h2>
        <p>Страница создана как часть каркаса админки. Здесь дальше будет реальная логика модуля.</p>
      </div>

      <div v-if="sections?.length" class="admin-page__card">
        <h2>План наполнения</h2>
        <ul>
          <li v-for="section in sections" :key="section">{{ section }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-page__header {
  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    max-width: 760px;
  }
}

.admin-page__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.admin-page__card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;

  h2 {
    font-size: 16px;
    color: $navy;
    margin-bottom: 10px;
  }

  p,
  li {
    font-size: 14px;
    color: $text-secondary;
    line-height: 1.6;
  }

  ul {
    padding-left: 18px;
  }
}
</style>
