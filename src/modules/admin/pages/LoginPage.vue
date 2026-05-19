<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginAdmin, useAdminAuth } from '@/modules/admin/state/admin-auth'

const router = useRouter()
const { state } = useAdminAuth()

const form = reactive({
  email: 'admin@pmr.local',
  password: 'admin123',
})

const errorMessage = ref('')
const isSubmitting = ref(false)

async function submit() {
  isSubmitting.value = true
  errorMessage.value = ''

  const result = loginAdmin(form.email.trim(), form.password)

  if (!result.ok) {
    errorMessage.value = result.error
    isSubmitting.value = false
    return
  }

  if (state.selectedSchoolSlug) {
    await router.push({ name: 'admin-school-dashboard', params: { slug: state.selectedSchoolSlug } })
  } else {
    await router.push({ name: 'admin-select-school' })
  }

  isSubmitting.value = false
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Вход в админку</h1>
      <p>Mock-авторизация для каркаса админки. После входа откроется выбор школы или кабинет школы.</p>

      <form class="auth-card__fields" @submit.prevent="submit">
        <input v-model="form.email" type="email" placeholder="Email" />
        <input v-model="form.password" type="password" placeholder="Пароль" />
        <button :disabled="isSubmitting">{{ isSubmitting ? 'Вход...' : 'Войти' }}</button>
      </form>

      <p v-if="errorMessage" class="auth-card__error">{{ errorMessage }}</p>

      <div class="auth-card__hint">
        <strong>Тестовые пользователи:</strong>
        <span>`admin@pmr.local / admin123`</span>
        <span>`school1@pmr.local / school123`</span>
        <span>`director2@pmr.local / director123`</span>
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

    &:disabled {
      opacity: .7;
      cursor: default;
    }
  }
}

.auth-card__error {
  color: #b42318;
  font-size: 14px;
}

.auth-card__hint {
  margin-top: 20px;
  padding: 14px;
  border-radius: 12px;
  background: $surface;
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 13px;
    color: $text-primary;
  }

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}
</style>
