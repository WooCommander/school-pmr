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

const demoAccounts = [
  {
    email: 'admin@pmr.local',
    password: 'admin123',
    label: 'Системный администратор',
  },
  {
    email: 'school1@pmr.local',
    password: 'school123',
    label: 'Администратор одной школы',
  },
  {
    email: 'director2@pmr.local',
    password: 'director123',
    label: 'Пользователь с несколькими ролями',
  },
]

function useDemoAccount(email: string, password: string) {
  form.email = email
  form.password = password
}

async function submit() {
  isSubmitting.value = true
  errorMessage.value = ''

  const result = loginAdmin(form.email, form.password)

  if (!result.ok) {
    errorMessage.value = result.error
    isSubmitting.value = false
    return
  }

  if (state.selectedSchoolSlug) {
    await router.push({
      name: 'admin-school-dashboard',
      params: { slug: state.selectedSchoolSlug },
    })
  } else {
    await router.push({ name: 'admin-select-school' })
  }

  isSubmitting.value = false
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <p class="auth-card__eyebrow">School PMR Admin</p>
      <h1>Вход в админку</h1>
      <p>
        Временная mock-авторизация для сценария админки. После входа откроется
        список доступных школ или сразу кабинет выбранной школы.
      </p>

      <form class="auth-card__fields" @submit.prevent="submit">
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="admin@pmr.local" />
        </label>

        <label>
          <span>Пароль</span>
          <input v-model="form.password" type="password" placeholder="Введите пароль" />
        </label>

        <button :disabled="isSubmitting">
          {{ isSubmitting ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <p v-if="errorMessage" class="auth-card__error">{{ errorMessage }}</p>

      <div class="auth-card__hint">
        <strong>Тестовые аккаунты</strong>

        <button
          v-for="account in demoAccounts"
          :key="account.email"
          type="button"
          class="demo-account"
          @click="useDemoAccount(account.email, account.password)"
        >
          <span class="demo-account__title">{{ account.label }}</span>
          <span class="demo-account__credentials">
            {{ account.email }} / {{ account.password }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba($gold, .16), transparent 26%),
    linear-gradient(180deg, $navy 0%, $navy-dark 100%);
}

.auth-card {
  width: min(520px, 100%);
  background: $white;
  border-radius: $radius-lg;
  padding: 32px;
  box-shadow: 0 24px 60px rgba($navy-dark, .18);

  h1 {
    font-size: 30px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.auth-card__eyebrow {
  margin-top: 0 !important;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: $navy;
}

.auth-card__fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 24px;

  label {
    display: grid;
    gap: 8px;
  }

  span {
    font-size: 13px;
    font-weight: 600;
    color: $text-primary;
  }

  input,
  button {
    width: 100%;
    border-radius: 12px;
    padding: 13px 14px;
    font: inherit;
  }

  input {
    border: 1px solid $border;
    background: $white;
  }

  button {
    margin-top: 6px;
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
  margin-top: 24px;
  padding: 16px;
  border-radius: 14px;
  background: $surface;
  display: grid;
  gap: 10px;

  strong {
    font-size: 13px;
    color: $text-primary;
  }
}

.demo-account {
  display: grid;
  gap: 4px;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid $border;
  border-radius: 12px;
  background: $white;
  transition: border-color $transition-fast, transform $transition-fast;

  &:hover {
    border-color: rgba($navy, .28);
    transform: translateY(-1px);
  }
}

.demo-account__title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.demo-account__credentials {
  font-size: 13px;
  color: $text-secondary;
}
</style>
