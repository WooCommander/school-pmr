<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : 'demo-school'
)

const sections = computed(() => [
  {
    title: 'Основное',
    items: [
      { label: 'Дашборд', to: { name: 'admin-school-dashboard', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Сайт школы',
    items: [
      { label: 'Общая информация', to: { name: 'admin-school-settings-general', params: { slug: schoolSlug.value } } },
      { label: 'Контакты', to: { name: 'admin-school-settings-contacts', params: { slug: schoolSlug.value } } },
      { label: 'Брендинг', to: { name: 'admin-school-settings-branding', params: { slug: schoolSlug.value } } },
      { label: 'Главная страница', to: { name: 'admin-school-settings-homepage', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Оформление',
    items: [
      { label: 'Шаблоны', to: { name: 'admin-school-design-templates', params: { slug: schoolSlug.value } } },
      { label: 'Темы', to: { name: 'admin-school-design-themes', params: { slug: schoolSlug.value } } },
      { label: 'Кастомизация', to: { name: 'admin-school-design-customize', params: { slug: schoolSlug.value } } },
      { label: 'Предпросмотр', to: { name: 'admin-school-design-preview', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Структура',
    items: [
      { label: 'Модули', to: { name: 'admin-school-structure-modules', params: { slug: schoolSlug.value } } },
      { label: 'Меню', to: { name: 'admin-school-structure-navigation', params: { slug: schoolSlug.value } } },
      { label: 'Блоки главной', to: { name: 'admin-school-structure-home-blocks', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Контент',
    items: [
      { label: 'Новости', to: { name: 'admin-school-content-news-list', params: { slug: schoolSlug.value } } },
      { label: 'Новая новость', to: { name: 'admin-school-content-news-create', params: { slug: schoolSlug.value } } },
      { label: 'Документы', to: { name: 'admin-school-content-documents-list', params: { slug: schoolSlug.value } } },
      { label: 'Новый документ', to: { name: 'admin-school-content-documents-create', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Доступ',
    items: [
      { label: 'Пользователи', to: { name: 'admin-school-users-list', params: { slug: schoolSlug.value } } },
      { label: 'Приглашения', to: { name: 'admin-school-users-invite', params: { slug: schoolSlug.value } } },
    ],
  },
  {
    title: 'Система',
    items: [
      { label: 'Публикация', to: { name: 'admin-school-system-publishing', params: { slug: schoolSlug.value } } },
      { label: 'История', to: { name: 'admin-school-system-history', params: { slug: schoolSlug.value } } },
    ],
  },
])
</script>

<template>
  <aside class="admin-sidebar">
    <router-link :to="{ name: 'portal-home' }" class="admin-sidebar__brand">
      <span class="admin-sidebar__brand-mark">A</span>
      <div>
        <strong>Admin</strong>
        <p>School CMS</p>
      </div>
    </router-link>

    <div v-for="section in sections" :key="section.title" class="admin-sidebar__section">
      <p class="admin-sidebar__section-title">{{ section.title }}</p>
      <nav class="admin-sidebar__nav">
        <router-link
          v-for="item in section.items"
          :key="item.label"
          :to="item.to"
          class="admin-sidebar__link"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.admin-sidebar {
  width: 280px;
  padding: 20px 16px;
  background: $navy-dark;
  color: $white;
  overflow-y: auto;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 14px;
  }
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: $white;
  margin-bottom: 24px;

  strong {
    display: block;
    font-size: 15px;
  }

  p {
    font-size: 12px;
    color: rgba($white, .6);
  }
}

.admin-sidebar__brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: $gold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.admin-sidebar__section + .admin-sidebar__section {
  margin-top: 18px;
}

.admin-sidebar__section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgba($white, .5);
  margin-bottom: 8px;
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-sidebar__link {
  display: block;
  padding: 9px 12px;
  border-radius: 10px;
  color: rgba($white, .78);
  font-size: 14px;
  transition: background $transition-fast, color $transition-fast;

  &:hover,
  &.router-link-active {
    background: rgba($white, .08);
    color: $white;
  }
}
</style>
