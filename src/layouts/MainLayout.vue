<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import SchoolEmblem from '@/components/SchoolEmblem.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navLinks = [
  { name: 'home',      label: 'Главная' },
  { name: 'news',      label: 'Новости' },
  { name: 'teachers',  label: 'Педагоги' },
  { name: 'schedule',  label: 'Расписание' },
  { name: 'gallery',   label: 'Галерея' },
  { name: 'documents', label: 'Документы' },
  { name: 'contacts',  label: 'Контакты' },
]

const mobileNavLinks = [
  { name: 'home',      label: 'Главная',    icon: 'home' },
  { name: 'news',      label: 'Новости',    icon: 'news' },
  { name: 'schedule',  label: 'Расписание', icon: 'calendar' },
  { name: 'gallery',   label: 'Галерея',    icon: 'image' },
  { name: 'contacts',  label: 'Контакты',   icon: 'phone' },
]


const currentRouteName = computed(() => route.name)
</script>

<template>
  <!-- ====== DESKTOP HEADER ====== -->
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <!-- top info bar -->
    <div class="header__topbar">
      <div class="container header__topbar-inner">
        <a href="tel:+37355512345" class="header__topbar-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          +373 555 12-34
        </a>
        <span class="header__topbar-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          г. Днестровск, ул. Ленина, 1
        </span>
        <span class="header__topbar-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Пн–Пт: 8:00–17:00
        </span>
        <a href="mailto:info@school1-dnestrovsk.ru" class="header__topbar-item header__topbar-item--right">
          info@school1-dnestrovsk.ru
        </a>
      </div>
    </div>

    <!-- main header row -->
    <div class="header__main">
      <div class="container header__main-inner">
        <!-- logo -->
        <router-link to="/" class="header__logo" aria-label="На главную">
          <SchoolEmblem size="44" />
          <div class="header__logo-text">
            <span class="header__logo-name">ДнСШ №1</span>
            <span class="header__logo-sub">г. Днестровск, ПМР</span>
          </div>
        </router-link>

        <!-- desktop nav -->
        <nav class="header__nav" aria-label="Основная навигация">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="header__nav-link"
            :class="{ 'header__nav-link--active': currentRouteName === link.name }"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <!-- mobile menu toggle -->
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

  <!-- Mobile dropdown menu -->
  <Transition name="mobile-menu">
    <div v-if="mobileMenuOpen" class="mobile-drawer" role="dialog" aria-label="Мобильное меню">
      <nav>
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="mobile-drawer__link"
          :class="{ 'mobile-drawer__link--active': currentRouteName === link.name }"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </Transition>

  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="mobileMenuOpen"
      class="overlay"
      @click="mobileMenuOpen = false"
    />
  </Transition>

  <!-- ====== PAGE CONTENT ====== -->
  <main class="page-content">
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </main>

  <!-- ====== FOOTER (desktop) ====== -->
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <SchoolEmblem size="36" />
        <div>
          <p class="footer__name">МОУ Днестровская средняя школа №1</p>
          <p class="footer__sub">г. Днестровск, ПМР</p>
        </div>
      </div>
      <div class="footer__links">
        <router-link v-for="link in navLinks" :key="link.name" :to="{ name: link.name }">
          {{ link.label }}
        </router-link>
      </div>
      <p class="footer__copy">© {{ new Date().getFullYear() }} ДнСШ №1. Все права защищены.</p>
    </div>
  </footer>

  <!-- ====== MOBILE BOTTOM NAV ====== -->
  <nav class="bottom-nav" aria-label="Мобильная навигация">
    <router-link
      v-for="link in mobileNavLinks"
      :key="link.name"
      :to="{ name: link.name }"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': currentRouteName === link.name }"
    >
      <!-- icons inline SVG -->
      <svg v-if="link.icon === 'home'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <svg v-else-if="link.icon === 'news'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>
      <svg v-else-if="link.icon === 'calendar'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <svg v-else-if="link.icon === 'image'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <svg v-else-if="link.icon === 'phone'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span class="bottom-nav__label">{{ link.label }}</span>
    </router-link>
  </nav>
</template>

<style lang="scss" scoped>
// ===== HEADER =====
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $white;
  border-bottom: 3px solid $navy;
  transition: box-shadow $transition-base;

  &--scrolled {
    box-shadow: 0 2px 16px rgba($navy, .12);
  }
}

.header__topbar {
  background: $navy;

  @media (max-width: $mobile-breakpoint) { display: none; }
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

  &:hover { color: $white; }
  &--right { margin-left: auto; }

  svg { flex-shrink: 0; }
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
  color: $navy;
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

  @media (max-width: $mobile-breakpoint) { display: none; }
}

.header__nav-link {
  font-size: 14px;
  color: $navy;
  padding: 26px 14px;
  border-bottom: 3px solid transparent;
  margin-bottom: -3px;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color $transition-fast, color $transition-fast;
  font-weight: 400;

  &:hover { border-bottom-color: rgba($navy, .25); }

  &--active {
    border-bottom-color: $gold;
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
  color: $navy;
  background: none;
  border: none;
  cursor: pointer;
  transition: background $transition-fast;
  margin-left: auto;

  &:hover { background: rgba($navy, .06); }

  @media (max-width: $mobile-breakpoint) { display: flex; }
}

// ===== MOBILE DRAWER =====
.mobile-drawer {
  position: fixed;
  top: $header-height-mobile;
  left: 0;
  right: 0;
  background: $white;
  z-index: 99;
  border-bottom: 1px solid $border;
  padding: 8px 0;

  @media (min-width: calc(#{$mobile-breakpoint} + 1px)) { display: none; }
}

.mobile-drawer__link {
  display: block;
  padding: 13px 20px;
  font-size: 15px;
  color: $text-primary;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all $transition-fast;

  &:hover { background: $surface; }

  &--active {
    border-left-color: $gold;
    color: $navy;
    font-weight: 500;
    background: rgba($navy, .03);
  }
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba($navy, .3);
  z-index: 98;

  @media (min-width: calc(#{$mobile-breakpoint} + 1px)) { display: none; }
}

// ===== FOOTER =====
.footer {
  background: $navy;
  padding: 40px 0 32px;
  margin-top: 48px;

  @media (max-width: $mobile-breakpoint) {
    display: none; // hidden on mobile — use bottom nav
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

    &:hover { color: $white; }
  }
}

.footer__copy {
  font-size: 12px;
  color: rgba($white, .4);
  border-top: 1px solid rgba($white, .1);
  padding-top: 16px;
}

// ===== MOBILE BOTTOM NAV =====
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: $white;
  border-top: 1px solid $border;
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
    color: $navy;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 2px;
      background: $gold;
      border-radius: 0 0 2px 2px;
    }
  }

  svg { flex-shrink: 0; }
}

.bottom-nav__label {
  font-size: 9px;
  font-weight: 400;
  white-space: nowrap;
}

// ===== TRANSITIONS =====
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform $transition-base, opacity $transition-base;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active { transition: opacity $transition-base; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.page-enter-active, .page-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}
.page-enter-from { opacity: 0; transform: translateY(6px); }
.page-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
