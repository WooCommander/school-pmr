<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : 'demo-school',
)
const currentSchool = computed(() => getManagedSchoolBySlug(schoolSlug.value))

const sections = computed(() => [
  {
    title: 'Основное',
    items: [
      { label: 'Дашборд', icon: '◉', to: { name: 'admin-school-dashboard', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Сайт школы',
    items: [
      { label: 'Общая информация', icon: '▣', to: { name: 'admin-school-settings-general', params: { slug: schoolSlug.value } } },
      { label: 'Контакты', icon: '✆', to: { name: 'admin-school-settings-contacts', params: { slug: schoolSlug.value } } },
      { label: 'Брендинг', icon: '✦', to: { name: 'admin-school-settings-branding', params: { slug: schoolSlug.value } } },
      { label: 'Главная страница', icon: '⌂', to: { name: 'admin-school-settings-homepage', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Оформление',
    items: [
      { label: 'Шаблоны', icon: '▤', to: { name: 'admin-school-design-templates', params: { slug: schoolSlug.value } } },
      { label: 'Темы', icon: '◌', to: { name: 'admin-school-design-themes', params: { slug: schoolSlug.value } } },
      { label: 'Кастомизация', icon: '⚙', to: { name: 'admin-school-design-customize', params: { slug: schoolSlug.value } } },
      { label: 'Предпросмотр', icon: '↗', to: { name: 'admin-school-design-preview', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Структура',
    items: [
      { label: 'Модули', icon: '▦', to: { name: 'admin-school-structure-modules', params: { slug: schoolSlug.value } } },
      { label: 'Меню', icon: '☰', to: { name: 'admin-school-structure-navigation', params: { slug: schoolSlug.value } } },
      { label: 'Блоки главной', icon: '⊞', to: { name: 'admin-school-structure-home-blocks', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Контент',
    items: [
      { label: 'Новости', icon: '◈', to: { name: 'admin-school-content-news-list', params: { slug: schoolSlug.value } } },
      { label: 'Новая новость', icon: '+', to: { name: 'admin-school-content-news-create', params: { slug: schoolSlug.value } } },
      { label: 'Документы', icon: '▥', to: { name: 'admin-school-content-documents-list', params: { slug: schoolSlug.value } } },
      { label: 'Новый документ', icon: '+', to: { name: 'admin-school-content-documents-create', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Доступ',
    items: [
      { label: 'Пользователи', icon: '◍', to: { name: 'admin-school-users-list', params: { slug: schoolSlug.value } } },
      { label: 'Приглашения', icon: '✉', to: { name: 'admin-school-users-invite', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Система',
    items: [
      { label: 'Публикация', icon: '⇪', to: { name: 'admin-school-system-publishing', params: { slug: schoolSlug.value } } },
      { label: 'История', icon: '◷', to: { name: 'admin-school-system-history', params: { slug: schoolSlug.value } } },
    ],
  },
])
</script>

<template>
  <div class="admin-sidebar-shell" :class="{ 'is-open': props.open }">
    <button class="admin-sidebar__backdrop" type="button" @click="emit('close')"></button>

    <aside class="admin-sidebar">
      <div class="admin-sidebar__top">
        <router-link
          :to="{ name: 'admin-select-school' }"
          class="admin-sidebar__brand"
          @click="emit('close')"
        >
          <span class="admin-sidebar__brand-mark">A</span>
          <div>
            <strong>{{ currentSchool?.shortName || 'Admin' }}</strong>
            <p>{{ currentSchool?.city || 'School CMS' }}</p>
          </div>
        </router-link>

        <button class="admin-sidebar__close" type="button" aria-label="Закрыть меню" @click="emit('close')">
          ×
        </button>
      </div>

      <div class="admin-sidebar__scroll">
        <div class="admin-sidebar__school-card">
          <p class="admin-sidebar__school-label">Текущая школа</p>
          <strong>{{ currentSchool?.fullName || 'School CMS' }}</strong>
          <span>{{ currentSchool?.city || 'Рабочее пространство админки' }}</span>
        </div>

        <div v-for="section in sections" :key="section.title" class="admin-sidebar__section">
          <p class="admin-sidebar__section-title">{{ section.title }}</p>
          <nav class="admin-sidebar__nav">
            <router-link
              v-for="item in section.items"
              :key="item.label"
              :to="item.to"
              class="admin-sidebar__link"
              @click="emit('close')"
            >
              <span class="admin-sidebar__link-icon" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </div>
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.admin-sidebar-shell {
  @media (min-width: 1025px) {
    width: 304px;
    flex-shrink: 0;
  }
}

.admin-sidebar__backdrop {
  display: none;

  @media (max-width: 1024px) {
    position: fixed;
    inset: 0;
    z-index: 39;
    border: 0;
    background: rgba($navy-dark, .38);
    opacity: 0;
    pointer-events: none;
    transition: opacity $transition-base;
    display: block;
  }
}

.admin-sidebar {
  background:
    radial-gradient(circle at top, rgba($gold, .16), transparent 24%),
    linear-gradient(180deg, #08182f 0%, #0d2342 100%);
  color: $white;
  overflow: hidden;

  @media (min-width: 1025px) {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba($white, .06);
  }

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 40;
    width: min(320px, calc(100vw - 28px));
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform $transition-base;
    box-shadow: 0 20px 50px rgba(0, 0, 0, .28);
  }
}

.admin-sidebar-shell.is-open {
  .admin-sidebar {
    transform: translateX(0);
  }

  .admin-sidebar__backdrop {
    opacity: 1;
    pointer-events: auto;
  }
}

.admin-sidebar__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 18px 10px;
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: $white;

  strong {
    display: block;
    font-size: 15px;
    font-weight: 700;
  }

  p {
    font-size: 12px;
    color: rgba($white, .64);
  }
}

.admin-sidebar__brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, $gold, #f5d37a);
  color: $navy-dark;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba($gold, .16);
}

.admin-sidebar__close {
  display: none;

  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba($white, .08);
    color: $white;
    font-size: 24px;
    line-height: 1;
  }
}

.admin-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 8px 14px 18px;

  @media (min-width: 1025px) {
    padding-bottom: 24px;
  }
}

.admin-sidebar__school-card {
  padding: 14px;
  border-radius: 16px;
  background: rgba($white, .06);
  border: 1px solid rgba($white, .08);
  margin-bottom: 18px;
  display: grid;
  gap: 6px;

  strong {
    font-size: 14px;
    line-height: 1.45;
  }

  span {
    font-size: 12px;
    color: rgba($white, .68);
  }
}

.admin-sidebar__school-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgba($white, .54);
}

.admin-sidebar__section + .admin-sidebar__section {
  margin-top: 18px;
}

.admin-sidebar__section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgba($white, .46);
  margin: 0 0 8px 8px;
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.admin-sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 12px;
  color: rgba($white, .8);
  font-size: 14px;
  transition: background $transition-fast, color $transition-fast, transform $transition-fast;

  &:hover,
  &.router-link-active {
    background: linear-gradient(135deg, rgba($white, .10), rgba($white, .06));
    color: $white;
    transform: translateX(2px);
  }

  &.router-link-active {
    box-shadow: inset 0 0 0 1px rgba($gold, .22);
  }
}

.admin-sidebar__link-icon {
  width: 24px;
  text-align: center;
  color: rgba($gold, .9);
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}
</style>
