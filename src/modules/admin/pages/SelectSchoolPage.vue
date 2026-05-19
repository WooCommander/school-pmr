<template>
  <div class="select-school-page">
    <div class="select-school-page__card">
      <h1>Выбор школы</h1>
      <p>Здесь пользователь будет выбирать школу, если у него доступ к нескольким кабинетам.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-school-page {
  padding: 40px 24px;
}

.select-school-page__card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 24px;

  h1 {
    font-size: 28px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
  }
}
</style>
