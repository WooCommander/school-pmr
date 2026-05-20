<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAdminRoleLabel,
  logoutAdmin,
  selectAdminSchool,
  useAdminAuth,
} from '@/modules/admin/state/admin-auth'
import { getManagedSchools } from '@/modules/schools/state/school-directory'

const router = useRouter()
const { currentUser } = useAdminAuth()

const schools = computed(() => getManagedSchools())

const availableSchools = computed(() =>
  (currentUser.value?.accesses ?? [])
    .map((access) => {
      const school = schools.value.find((item) => item.slug === access.schoolSlug)
      return school
        ? {
            school,
            role: access.role,
            roleLabel: getAdminRoleLabel(access.role),
          }
        : null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null),
)

async function openSchool(schoolSlug: string) {
  const isSelected = selectAdminSchool(schoolSlug)
  if (!isSelected) {
    return
  }

  await router.push({ name: 'admin-school-dashboard', params: { slug: schoolSlug } })
}

async function signOut() {
  logoutAdmin()
  await router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="select-school-page">
    <div class="select-school-page__header">
      <div>
        <p class="select-school-page__eyebrow">Выбор кабинета</p>
        <h1>Выберите школу</h1>
        <p>
          {{ currentUser?.name }}, выберите кабинет школы, в котором хотите работать.
        </p>
      </div>

      <button class="select-school-page__logout" type="button" @click="signOut">
        Выйти
      </button>
    </div>

    <div v-if="availableSchools.length" class="select-school-page__grid">
      <button
        v-for="item in availableSchools"
        :key="item.school.slug"
        class="school-card"
        type="button"
        @click="openSchool(item.school.slug)"
      >
        <div class="school-card__top">
          <span class="school-card__badge">{{ item.school.shortName }}</span>
          <span class="school-card__role">{{ item.roleLabel }}</span>
        </div>

        <h2>{{ item.school.fullName }}</h2>
        <p class="school-card__city">{{ item.school.city }}</p>
        <p>{{ item.school.address }}</p>
        <span class="school-card__link">Открыть кабинет</span>
      </button>
    </div>

    <div v-else class="select-school-page__empty">
      <h2>Нет доступных школ</h2>
      <p>Для этого пользователя пока не назначены роли в школах.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-school-page {
  min-height: 100vh;
  padding: 40px 24px;
  background: $surface;
}

.select-school-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin: 0 auto 24px;
  max-width: 1180px;

  @media (max-width: 720px) {
    flex-direction: column;
  }

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

.select-school-page__eyebrow {
  margin-top: 0 !important;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: $navy;
}

.select-school-page__logout {
  padding: 11px 14px;
  border-radius: 12px;
  background: $white;
  border: 1px solid $border;
  color: $text-primary;
}

.select-school-page__grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.school-card {
  text-align: left;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
  transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba($navy, .22);
    box-shadow: 0 8px 24px rgba($navy, .08);
  }

  h2 {
    margin-top: 14px;
    font-size: 18px;
    color: $navy;
    line-height: 1.35;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    font-size: 14px;
    line-height: 1.6;
  }
}

.school-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.school-card__badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: $navy;
  color: $white;
  font-size: 12px;
  font-weight: 600;
}

.school-card__role {
  font-size: 12px;
  color: $text-muted;
  text-align: right;
}

.school-card__city {
  color: $text-primary !important;
  font-weight: 600;
}

.school-card__link {
  display: inline-flex;
  margin-top: 16px;
  color: $navy;
  font-size: 14px;
  font-weight: 600;
}

.select-school-page__empty {
  max-width: 640px;
  margin: 40px auto 0;
  padding: 24px;
  border-radius: $radius-lg;
  background: $white;
  border: 1px solid $border;

  h2 {
    font-size: 20px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
    line-height: 1.6;
  }
}
</style>
