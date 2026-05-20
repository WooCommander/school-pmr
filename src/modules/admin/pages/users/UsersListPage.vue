<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminRoleLabels } from '@/modules/admin/state/admin-auth'
import { getSchoolInvites, getSchoolUsers } from '@/modules/admin/state/school-users'

const route = useRoute()
const router = useRouter()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const users = computed(() => getSchoolUsers(schoolSlug.value))
const invites = computed(() => getSchoolInvites(schoolSlug.value))

const roleStats = computed(() => {
  const stats = new Map<string, number>()

  users.value.forEach((user) => {
    const label = adminRoleLabels[user.role]
    stats.set(label, (stats.get(label) ?? 0) + 1)
  })

  return Array.from(stats.entries()).map(([label, count]) => ({ label, count }))
})

async function openInvite() {
  await router.push({
    name: 'admin-school-users-invite',
    params: { slug: schoolSlug.value },
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <section class="users-page">
    <div class="users-page__header">
      <div>
        <h1>Пользователи школы</h1>
        <p>Роли, текущие доступы в админку и активные приглашения по выбранной школе.</p>
      </div>

      <button class="btn btn--primary" @click="openInvite">Пригласить пользователя</button>
    </div>

    <div class="users-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ users.length }}</span>
        <span class="stat-card__label">Пользователей с доступом</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ invites.length }}</span>
        <span class="stat-card__label">Активных приглашений</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ roleStats.length }}</span>
        <span class="stat-card__label">Типов ролей в школе</span>
      </article>
    </div>

    <div class="users-page__grid">
      <section class="users-card">
        <div class="users-card__header">
          <h2>Текущие пользователи</h2>
          <p>Реальные mock-доступы, которые уже существуют для этой школы.</p>
        </div>

        <div v-if="users.length" class="user-list">
          <article v-for="user in users" :key="`${user.id}-${user.role}`" class="user-row">
            <div>
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
            </div>
            <span class="role-pill">{{ adminRoleLabels[user.role] }}</span>
          </article>
        </div>
        <div v-else class="empty-state">
          <p>Для этой школы пока нет пользователей с доступом.</p>
        </div>
      </section>

      <aside class="users-side">
        <section class="users-card">
          <div class="users-card__header">
            <h2>Роли в школе</h2>
          </div>

          <div v-if="roleStats.length" class="role-list">
            <div v-for="item in roleStats" :key="item.label" class="role-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.count }}</strong>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Роли появятся после добавления пользователей.</p>
          </div>
        </section>

        <section class="users-card">
          <div class="users-card__header">
            <h2>Ожидают приглашения</h2>
          </div>

          <div v-if="invites.length" class="invite-list">
            <article v-for="invite in invites" :key="invite.id" class="invite-row">
              <strong>{{ invite.name }}</strong>
              <span>{{ invite.email }}</span>
              <small>{{ adminRoleLabels[invite.role] }} • {{ formatDate(invite.createdAt) }}</small>
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
.users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.users-page__header {
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

.users-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.users-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, .85fr);
  gap: 16px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
}

.users-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card,
.users-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

.stat-card {
  padding: 18px 20px;
}

.stat-card__value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: $navy;
}

.stat-card__label {
  display: block;
  margin-top: 8px;
  color: $text-secondary;
}

.users-card {
  padding: 20px;
}

.users-card__header h2 {
  font-size: 18px;
  color: $text-primary;
}

.users-card__header p {
  margin-top: 8px;
  color: $text-secondary;
  line-height: 1.6;
}

.user-list,
.invite-list,
.role-list {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.user-row,
.invite-row,
.role-row {
  border: 1px solid $border;
  border-radius: 14px;
  padding: 14px 16px;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }

  h3 {
    color: $text-primary;
    font-size: 16px;
  }

  p {
    margin-top: 6px;
    color: $text-secondary;
  }
}

.invite-row {
  display: grid;
  gap: 6px;

  strong {
    color: $text-primary;
  }

  span,
  small {
    color: $text-secondary;
    line-height: 1.5;
  }
}

.role-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  span {
    color: $text-secondary;
  }

  strong {
    color: $navy;
    font-size: 18px;
  }
}

.role-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba($navy, .08);
  color: $navy;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
</style>
