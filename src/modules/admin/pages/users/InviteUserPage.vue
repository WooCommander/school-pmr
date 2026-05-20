<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AdminRole } from '@/modules/admin/data/mock-admin-users'
import { adminRoleLabels } from '@/modules/admin/state/admin-auth'
import {
  createSchoolInvite,
  getSchoolInvites,
  revokeSchoolInvite,
} from '@/modules/admin/state/school-users'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const form = reactive({
  email: '',
  name: '',
  role: 'content_manager' as AdminRole,
})

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')

const invites = computed(() => getSchoolInvites(schoolSlug.value))

const validationErrors = computed(() => {
  const errors: string[] = []

  if (!form.name.trim()) errors.push('Укажите имя пользователя.')
  if (!form.email.trim()) errors.push('Укажите email пользователя.')
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.push('Укажите корректный email.')
  }

  return errors
})

function submitInvite() {
  if (validationErrors.value.length) {
    statusTone.value = 'error'
    statusMessage.value = validationErrors.value[0]
    return
  }

  createSchoolInvite({
    schoolSlug: schoolSlug.value,
    email: form.email.trim(),
    name: form.name.trim(),
    role: form.role,
  })

  form.email = ''
  form.name = ''
  form.role = 'content_manager'
  statusTone.value = 'success'
  statusMessage.value = 'Приглашение создано.'
}

function removeInvite(id: number) {
  revokeSchoolInvite(id)
}

async function goBack() {
  await router.push({
    name: 'admin-school-users-list',
    params: { slug: schoolSlug.value },
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU')
}
</script>

<template>
  <section class="invite-page">
    <div class="invite-page__header">
      <div>
        <h1>Приглашение пользователя</h1>
        <p>Добавление нового участника команды школы с назначением роли в админке.</p>
      </div>

      <button class="btn btn--outline" @click="goBack">К пользователям</button>
    </div>

    <div
      v-if="statusMessage"
      class="invite-page__status"
      :class="`invite-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="invite-page__grid">
      <section class="invite-card">
        <h2>Новое приглашение</h2>

        <div class="form-grid">
          <label class="field">
            <span>Имя</span>
            <input v-model="form.name" type="text" />
          </label>

          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" />
          </label>

          <label class="field field--full">
            <span>Роль</span>
            <select v-model="form.role">
              <option
                v-for="(label, key) in adminRoleLabels"
                :key="key"
                :value="key"
              >
                {{ label }}
              </option>
            </select>
          </label>
        </div>

        <ul v-if="validationErrors.length" class="validation-list">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>

        <div class="invite-card__actions">
          <button class="btn btn--primary" @click="submitInvite">Создать приглашение</button>
        </div>
      </section>

      <aside class="invite-side">
        <section class="invite-card">
          <h2>Активные приглашения</h2>

          <div v-if="invites.length" class="invite-list">
            <article v-for="invite in invites" :key="invite.id" class="invite-row">
              <div>
                <strong>{{ invite.name }}</strong>
                <p>{{ invite.email }}</p>
                <small>{{ adminRoleLabels[invite.role] }} • {{ formatDate(invite.createdAt) }}</small>
              </div>
              <button class="btn btn--danger" @click="removeInvite(invite.id)">Отозвать</button>
            </article>
          </div>
          <div v-else class="empty-state">
            <p>Активных приглашений пока нет.</p>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.invite-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.invite-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.invite-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }

  &--error {
    background: rgba(180, 35, 24, .10);
    color: #912018;
  }
}

.invite-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, .9fr);
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
}

.invite-side {
  display: flex;
  flex-direction: column;
}

.invite-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.invite-card h2 {
  font-size: 18px;
  color: $text-primary;
}

.form-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &--full {
    grid-column: 1 / -1;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    color: $text-primary;
  }

  input,
  select {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    color: $text-primary;
    background: $white;
  }
}

.validation-list {
  margin-top: 16px;
  display: grid;
  gap: 8px;
  padding-left: 18px;

  li {
    color: #912018;
    line-height: 1.5;
  }
}

.invite-card__actions {
  margin-top: 16px;
}

.invite-list {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.invite-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 14px 16px;

  @media (max-width: 720px) {
    flex-direction: column;
  }

  strong {
    color: $text-primary;
  }

  p,
  small {
    margin-top: 6px;
    color: $text-secondary;
    line-height: 1.5;
  }
}

.btn--danger {
  background: rgba(180, 35, 24, .10);
  color: #912018;
}
</style>
