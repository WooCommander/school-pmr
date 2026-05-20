<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentSchool } from '@/composables/useCurrentSchool'
import { getAdministrationBySchoolState } from '@/modules/teachers/state/teacher-directory'

const { school } = useCurrentSchool()

const contacts = computed(() => [
  {
    icon: 'phone',
    label: 'Телефон',
    value: school.value.phone,
    href: `tel:${school.value.phone.replace(/[^+\d]/g, '')}`,
  },
  {
    icon: 'mail',
    label: 'Электронная почта',
    value: school.value.email,
    href: `mailto:${school.value.email}`,
  },
  {
    icon: 'map-pin',
    label: 'Адрес',
    value: school.value.address,
    href: null,
  },
  {
    icon: 'clock',
    label: 'Режим работы',
    value: school.value.hours,
    href: null,
  },
])

const administration = computed(() => getAdministrationBySchoolState(school.value.slug))
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Контакты</h1>
      <p class="page-subtitle">Контактная информация и администрация {{ school.fullName }}</p>

      <div class="contacts-layout">
        <div class="contact-cards">
          <a
            v-for="contact in contacts"
            :key="contact.label"
            :href="contact.href ?? undefined"
            class="contact-card"
            :class="{ 'contact-card--link': !!contact.href }"
          >
            <div class="contact-card__icon">
              <svg
                v-if="contact.icon === 'phone'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <svg
                v-else-if="contact.icon === 'mail'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <svg
                v-else-if="contact.icon === 'map-pin'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <svg
                v-else-if="contact.icon === 'clock'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p class="contact-card__label">{{ contact.label }}</p>
              <p class="contact-card__value">{{ contact.value }}</p>
            </div>
          </a>
        </div>

        <div class="map-placeholder">
          <div class="map-placeholder__inner">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p>{{ school.address }}</p>
            <p class="map-placeholder__hint">Карта появится после подключения реального map-embed.</p>
          </div>
        </div>
      </div>

      <h2 class="admin-title">Администрация</h2>
      <div class="admin-grid">
        <div v-for="item in administration" :key="item.name" class="admin-card">
          <div class="admin-card__role">{{ item.role }}</div>
          <div class="admin-card__name">{{ item.name }}</div>
          <a v-if="item.email" :href="`mailto:${item.email}`" class="admin-card__email">{{ item.email }}</a>
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
  border: 1px solid var(--school-card-border);
  border-radius: var(--school-card-radius);
  padding: 16px 18px;
  text-decoration: none;
  color: $text-primary;
  transition: box-shadow $transition-fast, color $transition-fast;

  &--link:hover {
    box-shadow: 0 2px 12px color-mix(in srgb, var(--school-primary) 8%, transparent);
    color: var(--school-primary);
  }
}

.contact-card__icon {
  width: 44px;
  height: 44px;
  background: color-mix(in srgb, var(--school-primary) 8%, white);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--school-primary);
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
  background: var(--school-hero-subtle);
  border: 1px solid var(--school-card-border);
  border-radius: var(--school-card-radius);
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

  svg {
    color: var(--school-primary);
    opacity: .45;
  }

  p {
    font-size: 14px;
  }
}

.map-placeholder__hint {
  font-size: 12px !important;
  opacity: .7;
}

.admin-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--school-primary);
  margin-bottom: 16px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.admin-card {
  background: $white;
  border: 1px solid var(--school-card-border);
  border-left: 3px solid var(--school-accent);
  border-radius: 0 var(--school-card-radius) var(--school-card-radius) 0;
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
  color: var(--school-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
