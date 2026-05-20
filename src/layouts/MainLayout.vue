<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SchoolEmblem from '@/components/SchoolEmblem.vue'
import { useCurrentSchool } from '@/composables/useCurrentSchool'
import { useSchoolDesignDraft } from '@/modules/admin/state/school-design'
import { isSchoolModuleEnabled } from '@/modules/admin/state/school-modules'
import { getPublishedSchoolNavigation } from '@/modules/admin/state/school-navigation'

const route = useRoute()
const { school } = useCurrentSchool()
const { publishedTemplate, publishedTheme } = useSchoolDesignDraft(school.value.slug)
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navLinks = computed(() =>
  getPublishedSchoolNavigation(school.value.slug)
    .filter((item) => item.visible)
    .filter((item) => item.key === 'home' || isSchoolModuleEnabled(school.value.slug, item.key))
    .map((item) => ({
      name: item.routeName,
      label: item.label,
    })),
)

const mobileNavLinks = computed(() =>
  getPublishedSchoolNavigation(school.value.slug)
    .filter((item) => item.visible)
    .filter((item) => item.key === 'home' || isSchoolModuleEnabled(school.value.slug, item.key))
    .slice(0, 5)
    .map((item) => ({
      name: item.routeName,
      label: item.label,
      icon: item.mobileIcon,
    })),
)

const currentRouteName = computed(() => route.name)

const layoutClass = computed(() => ({
  [`school-template--${publishedTemplate.value?.key ?? 'classic'}`]: true,
  [`school-menu--${publishedTemplate.value?.menuStyle ?? 'top'}`]: true,
  [`school-hero--${publishedTemplate.value?.heroStyle ?? 'large'}`]: true,
  [`school-card--${publishedTemplate.value?.cardStyle ?? 'soft'}`]: true,
}))

const layoutStyle = computed(() => {
  const theme = publishedTheme.value?.colors
  const template = publishedTemplate.value

  return {
    '--school-primary': theme?.primary ?? '#0F2A5E',
    '--school-secondary': theme?.secondary ?? '#1A3A7A',
    '--school-accent': theme?.accent ?? '#C9A030',
    '--school-surface': theme?.surface ?? '#F6F8FC',
    '--school-text': theme?.text ?? '#0F1E3C',
    '--school-hero-bg': `linear-gradient(135deg, ${theme?.primary ?? '#0F2A5E'}, ${theme?.secondary ?? '#1A3A7A'})`,
    '--school-hero-subtle': theme?.surface ?? '#F6F8FC',
    '--school-card-radius':
      template?.cardStyle === 'flat'
        ? '12px'
        : template?.cardStyle === 'bordered'
          ? '20px'
          : '18px',
    '--school-card-border':
      template?.cardStyle === 'bordered'
        ? `${theme?.primary ?? '#0F2A5E'}26`
        : `${theme?.primary ?? '#0F2A5E'}18`,
    '--school-hero-align': template?.heroStyle === 'centered' ? 'center' : 'left',
    '--school-hero-max': template?.heroStyle === 'minimal' ? '640px' : '520px',
  } as Record<string, string>
})

function routeFor(name: string) {
  return { name, params: { slug: school.value.slug } }
}
</script>

<template>
  <div class="school-layout" :class="layoutClass" :style="layoutStyle">
    <header class="header" :class="{ 'header--scrolled': scrolled }">
      <div class="header__topbar">
        <div class="container header__topbar-inner">
          <a :href="`tel:${school.phone.replace(/[^\d+]/g, '')}`" class="header__topbar-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {{ school.phone }}
          </a>
          <span class="header__topbar-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ school.address }}
          </span>
          <span class="header__topbar-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ school.hours }}
          </span>
          <a :href="`mailto:${school.email}`" class="header__topbar-item header__topbar-item--right">
            {{ school.email }}
          </a>
        </div>
      </div>

      <div class="header__main">
        <div class="container header__main-inner">
          <router-link :to="routeFor('school-home')" class="header__logo" aria-label="На главную">
            <SchoolEmblem size="44" />
            <div class="header__logo-text">
              <span class="header__logo-name">{{ school.shortName }}</span>
              <span class="header__logo-sub">{{ school.city }}</span>
            </div>
          </router-link>

          <nav class="header__nav" aria-label="Основная навигация">
            <router-link
              v-for="link in navLinks"
              :key="link.name"
              :to="routeFor(link.name)"
              class="header__nav-link"
              :class="{ 'header__nav-link--active': currentRouteName === link.name }"
            >
              {{ link.label }}
            </router-link>
          </nav>

          <button
            class="header__burger"
            :aria-expanded="mobileMenuOpen"
            aria-label="Открыть меню"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span v-if="!mobileMenuOpen">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </span>
            <span v-else>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
          </button>
        </div>
      </div>
    </header>

    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="mobile-drawer" role="dialog" aria-label="Мобильное меню">
        <nav>
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="routeFor(link.name)"
            class="mobile-drawer__link"
            :class="{ 'mobile-drawer__link--active': currentRouteName === link.name }"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="overlay" @click="mobileMenuOpen = false" />
    </Transition>

    <main class="page-content">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <SchoolEmblem size="36" />
          <div>
            <p class="footer__name">{{ school.fullName }}</p>
            <p class="footer__sub">{{ school.city }}</p>
          </div>
        </div>
        <div class="footer__links">
          <router-link v-for="link in navLinks" :key="link.name" :to="routeFor(link.name)">
            {{ link.label }}
          </router-link>
        </div>
        <p class="footer__copy">© {{ new Date().getFullYear() }} {{ school.shortName }}. Все права защищены.</p>
      </div>
    </footer>

    <nav class="bottom-nav" aria-label="Мобильная навигация">
      <router-link
        v-for="link in mobileNavLinks"
        :key="link.name"
        :to="routeFor(link.name)"
        class="bottom-nav__item"
        :class="{ 'bottom-nav__item--active': currentRouteName === link.name }"
      >
        <svg v-if="link.icon === 'home'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <svg v-else-if="link.icon === 'news'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>
        <svg v-else-if="link.icon === 'calendar'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <svg v-else-if="link.icon === 'image'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <svg v-else-if="link.icon === 'phone'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <svg v-else-if="link.icon === 'users'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <svg v-else-if="link.icon === 'file'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <span class="bottom-nav__label">{{ link.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.school-layout {
  min-height: 100vh;
  background: var(--school-surface);
  color: var(--school-text);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $white;
  border-bottom: 3px solid var(--school-primary);
  transition: box-shadow $transition-base;

  &--scrolled {
    box-shadow: 0 2px 16px color-mix(in srgb, var(--school-primary) 14%, transparent);
  }
}

.header__topbar {
  background: var(--school-primary);

  @media (max-width: $mobile-breakpoint) {
    display: none;
  }
}

.header__topbar-inner {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 32px;
}

.header__topbar-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba($white, .75);
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $white;
  }

  &--right {
    margin-left: auto;
  }

  svg {
    flex-shrink: 0;
  }
}

.header__main {
  @media (max-width: $mobile-breakpoint) {
    height: $header-height-mobile;
  }
}

.header__main-inner {
  display: flex;
  align-items: center;
  height: 76px;
  gap: 0;

  @media (max-width: $mobile-breakpoint) {
    height: $header-height-mobile;
  }
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  text-decoration: none;
  flex-shrink: 0;

  @media (max-width: $mobile-breakpoint) {
    min-width: 0;
    flex: 1;
  }
}

.header__logo-text {
  display: flex;
  flex-direction: column;
}

.header__logo-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--school-primary);
  line-height: 1.2;
}

.header__logo-sub {
  font-size: 11px;
  color: $text-secondary;
}

.header__nav {
  display: flex;
  flex: 1;
  justify-content: center;
  gap: 0;

  @media (max-width: $mobile-breakpoint) {
    display: none;
  }
}

.header__nav-link {
  font-size: 14px;
  color: var(--school-primary);
  padding: 26px 14px;
  border-bottom: 3px solid transparent;
  margin-bottom: -3px;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color $transition-fast, color $transition-fast;
  font-weight: 400;

  &:hover {
    border-bottom-color: color-mix(in srgb, var(--school-primary) 25%, transparent);
  }

  &--active {
    border-bottom-color: var(--school-accent);
    font-weight: 500;
  }
}

.header__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  color: var(--school-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: background $transition-fast;
  margin-left: auto;

  &:hover {
    background: color-mix(in srgb, var(--school-primary) 6%, transparent);
  }

  @media (max-width: $mobile-breakpoint) {
    display: flex;
  }
}

.mobile-drawer {
  position: fixed;
  top: $header-height-mobile;
  left: 0;
  right: 0;
  background: $white;
  z-index: 99;
  border-bottom: 1px solid var(--school-card-border);
  padding: 8px 0;

  @media (min-width: calc(#{$mobile-breakpoint} + 1px)) {
    display: none;
  }
}

.mobile-drawer__link {
  display: block;
  padding: 13px 20px;
  font-size: 15px;
  color: $text-primary;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all $transition-fast;

  &:hover {
    background: var(--school-surface);
  }

  &--active {
    border-left-color: var(--school-accent);
    color: var(--school-primary);
    font-weight: 500;
    background: color-mix(in srgb, var(--school-primary) 4%, white);
  }
}

.overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--school-primary) 30%, transparent);
  z-index: 98;

  @media (min-width: calc(#{$mobile-breakpoint} + 1px)) {
    display: none;
  }
}

.footer {
  background: var(--school-primary);
  padding: 40px 0 32px;
  margin-top: 48px;

  @media (max-width: $mobile-breakpoint) {
    display: none;
  }
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer__name {
  font-size: 15px;
  font-weight: 500;
  color: $white;
}

.footer__sub {
  font-size: 12px;
  color: rgba($white, .6);
  margin-top: 2px;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;

  a {
    font-size: 13px;
    color: rgba($white, .7);
    text-decoration: none;
    transition: color $transition-fast;

    &:hover {
      color: $white;
    }
  }
}

.footer__copy {
  font-size: 12px;
  color: rgba($white, .4);
  border-top: 1px solid rgba($white, .1);
  padding-top: 16px;
}

.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: $white;
  border-top: 1px solid var(--school-card-border);
  z-index: 100;

  @media (max-width: $mobile-breakpoint) {
    display: flex;
  }
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: $text-muted;
  padding-top: 4px;
  transition: color $transition-fast;
  position: relative;

  &--active {
    color: var(--school-primary);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 2px;
      background: var(--school-accent);
      border-radius: 0 0 2px 2px;
    }
  }

  svg {
    flex-shrink: 0;
  }
}

.bottom-nav__label {
  font-size: 9px;
  font-weight: 400;
  white-space: nowrap;
}

.school-menu--compact {
  .header__nav {
    gap: 4px;
  }

  .header__nav-link {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.school-menu--split {
  .header__main-inner {
    gap: 20px;
  }

  .header__nav {
    justify-content: flex-end;
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform $transition-base, opacity $transition-base;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
