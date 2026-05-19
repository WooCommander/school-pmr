<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Вход в админку</h1>
      <p>Заготовка экрана входа. Здесь будет авторизация пользователей системы.</p>
      <div class="auth-card__fields">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Пароль" />
        <button>Войти</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, $navy 0%, $navy-dark 100%);
  padding: 24px;
}

.auth-card {
  width: min(460px, 100%);
  background: $white;
  border-radius: $radius-lg;
  padding: 28px;

  h1 {
    font-size: 28px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
  }
}

.auth-card__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;

  input,
  button {
    width: 100%;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
  }

  input {
    border: 1px solid $border;
  }

  button {
    background: $navy;
    color: $white;
    font-weight: 600;
  }
}
</style>
