<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { schools } from '@/data/schools'
import { selectAdminSchool, useAdminAuth } from '@/modules/admin/state/admin-auth'

const router = useRouter()
const { currentUser } = useAdminAuth()

const availableSchools = computed(() =>
  (currentUser.value?.accesses ?? []).map((access) => {
    const school = schools.find((item) => item.slug === access.schoolSlug)
    return school ? { school, role: access.role } : null
  }).filter(Boolean)
)

async function openSchool(schoolSlug: string) {
  selectAdminSchool(schoolSlug)
  await router.push({ name: 'admin-school-dashboard', params: { slug: schoolSlug } })
}
</script>

<template>
  <div class="select-school-page">
    <div class="select-school-page__header">
      <h1>Выбор школы</h1>
      <p>Выберите кабинет школы, в котором хотите работать.</p>
    </div>

    <div class="select-school-page__grid">
      <button
        v-for="item in availableSchools"
        :key="item!.school.slug"
        class="school-card"
        @click="openSchool(item!.school.slug)"
      >
        <div class="school-card__top">
          <span class="school-card__badge">{{ item!.school.shortName }}</span>
          <span class="school-card__role">{{ item!.role }}</span>
        </div>
        <h2>{{ item!.school.fullName }}</h2>
        <p>{{ item!.school.address }}</p>
        <span class="school-card__link">Открыть кабинет</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-school-page {
  padding: 40px 24px;
}

.select-school-page__header {
  margin-bottom: 20px;

  h1 {
    font-size: 28px;
    color: $text-primary;
  }

  p {
    margin-top: 10px;
    color: $text-secondary;
  }
}

.select-school-page__grid {
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
  transition: transform $transition-base, box-shadow $transition-base;

  &:hover {
    transform: translateY(-2px);
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
  align-items: center;
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
  text-transform: uppercase;
}

.school-card__link {
  display: inline-flex;
  margin-top: 16px;
  color: $navy;
  font-size: 14px;
  font-weight: 600;
}
</style>
