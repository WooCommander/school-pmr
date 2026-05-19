<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentSchool } from '@/composables/useCurrentSchool'

const { school } = useCurrentSchool()

const contacts = computed(() => [
  { icon: 'phone', label: 'Телефон', value: school.value.phone, href: `tel:${school.value.phone.replace(/[^+\d]/g, '')}` },
  { icon: 'mail', label: 'Электронная почта', value: school.value.email, href: `mailto:${school.value.email}` },
  { icon: 'map-pin', label: 'Адрес', value: school.value.address, href: null },
  { icon: 'clock', label: 'Режим работы', value: school.value.hours, href: null },
])

const administration = [
  { role: 'Директор', name: 'Иванова Светлана Николаевна', email: 'director@school1-dnestrovsk.ru' },
  { role: 'Зам. директора по учебной работе', name: 'Петров Андрей Викторович', email: 'zavuch@school1-dnestrovsk.ru' },
  { role: 'Зам. директора по воспитательной работе', name: 'Фёдорова Людмила Борисовна', email: null },
]
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Контакты</h1>
      <p class="page-subtitle">Контактная информация и администрация {{ school.fullName }}</p>

      <div class="contacts-layout">
        <div class="contact-cards">
          <a
            v-for="c in contacts"
            :key="c.label"
            :href="c.href ?? undefined"
            class="contact-card"
            :class="{ 'contact-card--link': !!c.href }"
          >
            <div class="contact-card__icon">
              <svg v-if="c.icon === 'phone'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <svg v-else-if="c.icon === 'mail'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <svg v-else-if="c.icon === 'map-pin'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <svg v-else-if="c.icon === 'clock'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <p class="contact-card__label">{{ c.label }}</p>
              <p class="contact-card__value">{{ c.value }}</p>
            </div>
          </a>
        </div>

        <div class="map-placeholder">
          <div class="map-placeholder__inner">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #0F2A5E; opacity:.4" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p>{{ school.address }}</p>
            <p style="font-size:12px;opacity:.6">Карта откроется при интеграции с Яндекс.Картами</p>
          </div>
        </div>
      </div>

      <h2 class="admin-title">Администрация</h2>
      <div class="admin-grid">
        <div v-for="a in administration" :key="a.name" class="admin-card">
          <div class="admin-card__role">{{ a.role }}</div>
          <div class="admin-card__name">{{ a.name }}</div>
          <a v-if="a.email" :href="`mailto:${a.email}`" class="admin-card__email">{{ a.email }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contacts-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: 1fr;
  }
}

.contact-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 16px 18px;
  text-decoration: none;
  color: $text-primary;
  transition: box-shadow $transition-fast;

  &--link:hover {
    box-shadow: 0 2px 12px rgba($navy, .08);
    color: $navy;
  }
}

.contact-card__icon {
  width: 44px;
  height: 44px;
  background: rgba($navy, .07);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $navy;
  flex-shrink: 0;
}

.contact-card__label {
  font-size: 12px;
  color: $text-muted;
  margin-bottom: 2px;
}

.contact-card__value {
  font-size: 15px;
  font-weight: 500;
}

.map-placeholder {
  background: $surface-2;
  border: 1px solid $border;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
}

.map-placeholder__inner {
  text-align: center;
  color: $text-secondary;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  p { font-size: 14px; }
}

.admin-title {
  font-size: 20px;
  font-weight: 600;
  color: $navy;
  margin-bottom: 16px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.admin-card {
  background: $white;
  border: 1px solid $border;
  border-left: 3px solid $gold;
  border-radius: 0 $radius-lg $radius-lg 0;
  padding: 16px 18px;
}

.admin-card__role {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 4px;
}

.admin-card__name {
  font-size: 15px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 6px;
}

.admin-card__email {
  font-size: 13px;
  color: $navy;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}
</style>
