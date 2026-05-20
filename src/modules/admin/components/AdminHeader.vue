<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAdminRoleForSchool,
  getAdminRoleLabel,
  logoutAdmin,
  useAdminAuth,
} from '@/modules/admin/state/admin-auth'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

defineProps<{
  menuOpen?: boolean
}>()

defineEmits<{
  (e: 'toggle-menu'): void
}>()

const route = useRoute()
const router = useRouter()
const { currentUser, availableAccesses } = useAdminAuth()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : null,
)
const currentSchool = computed(() =>
  schoolSlug.value ? getManagedSchoolBySlug(schoolSlug.value) : null,
)
const role = computed(() =>
  schoolSlug.value ? getAdminRoleForSchool(schoolSlug.value) : null,
)
const roleLabel = computed(() => getAdminRoleLabel(role.value))
const hasMultipleSchools = computed(() => availableAccesses.value.length > 1)

async function goToSchoolSelector() {
  await router.push({ name: 'admin-select-school' })
}

async function openPublicSite() {
  if (!schoolSlug.value) return
  await router.push({ name: 'school-home', params: { slug: schoolSlug.value } })
}

async function signOut() {
  logoutAdmin()
  await router.push({ name: 'admin-login' })
}
</script>

<template>
  <header class="admin-header">
    <div class="admin-header__left">
      <button
        class="admin-header__menu-btn"
        type="button"
        aria-label="Открыть меню"
        @click="$emit('toggle-menu')"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="admin-header__school">
        <p class="admin-header__eyebrow">Панель школы</p>
        <h1 class="admin-header__title">
          {{ currentSchool?.shortName || 'Админка' }}
        </h1>
        <p v-if="currentUser" class="admin-header__meta">
          {{ currentUser.name }}
          <span v-if="roleLabel">• {{ roleLabel }}</span>
          <span v-if="currentSchool">• {{ currentSchool.fullName }}</span>
        </p>
      </div>
    </div>

    <div class="admin-header__actions">
      <button
        v-if="schoolSlug"
        class="admin-header__btn admin-header__btn--ghost"
        type="button"
        @click="openPublicSite"
      >
        Открыть сайт
      </button>
      <button
        v-if="hasMultipleSchools"
        class="admin-header__btn"
        type="button"
        @click="goToSchoolSelector"
      >
        Сменить школу
      </button>
      <button class="admin-header__btn admin-header__btn--danger" type="button" @click="signOut">
        Выйти
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.admin-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid rgba($navy, .08);
  background: rgba($white, .88);
  backdrop-filter: blur(14px);

  @media (max-width: 768px) {
    padding: 14px 16px;
    align-items: flex-start;
    flex-direction: column;
  }
}

.admin-header__left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 0;
}

.admin-header__school {
  min-width: 0;
}

.admin-header__menu-btn {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: $white;
  border: 1px solid rgba($navy, .12);
  color: $navy;
  flex-shrink: 0;

  span {
    display: block;
    width: 18px;
    height: 2px;
    margin: 3px auto;
    border-radius: 999px;
    background: currentColor;
  }

  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}

.admin-header__eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: $text-muted;
}

.admin-header__title {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
  color: $text-primary;
}

.admin-header__meta {
  margin-top: 6px;
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}

.admin-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-header__btn {
  padding: 10px 14px;
  border-radius: 12px;
  background: $white;
  color: $navy;
  font-weight: 600;
  border: 1px solid rgba($navy, .12);
  transition: transform $transition-fast, border-color $transition-fast, background $transition-fast;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba($navy, .24);
  }
}

.admin-header__btn--ghost {
  background: rgba($navy, .04);
}

.admin-header__btn--danger {
  color: #8f1f1f;
  background: rgba(180, 35, 24, .06);
  border-color: rgba(180, 35, 24, .14);
}
</style>
