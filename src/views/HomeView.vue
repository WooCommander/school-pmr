<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NewsCard from '@/components/NewsCard.vue'
import SchoolEmblem from '@/components/SchoolEmblem.vue'
import { useCurrentSchool } from '@/composables/useCurrentSchool'
import { getPublishedSchoolHomeBlocks } from '@/modules/admin/state/school-home-blocks'
import { getPublishedSchoolNews } from '@/modules/admin/state/school-news'

const route = useRoute()
const { school } = useCurrentSchool()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : school.value.slug,
)

const latestNews = computed(() => getPublishedSchoolNews(schoolSlug.value).slice(0, 4))
const homeBlocks = computed(() =>
  getPublishedSchoolHomeBlocks(schoolSlug.value).filter((item) => item.visible),
)

const quickLinks = [
  { name: 'school-news', label: 'Новости', icon: 'news' },
  { name: 'school-schedule', label: 'Расписание', icon: 'calendar' },
  { name: 'school-teachers', label: 'Педагоги', icon: 'users' },
  { name: 'school-documents', label: 'Документы', icon: 'file' },
]

const schoolHighlights = computed(() => [
  { label: 'Тип школы', value: school.value.type },
  { label: 'Адрес', value: school.value.address },
  { label: 'Режим работы', value: school.value.hours },
])

function routeFor(name: string) {
  return { name, params: { slug: route.params.slug } }
}

function featureIcon(icon: string) {
  switch (icon) {
    case 'book':
      return '▣'
    case 'chat':
      return '◌'
    case 'award':
      return '◆'
    case 'users':
      return '◍'
    default:
      return '★'
  }
}
</script>

<template>
  <div>
    <template v-for="block in homeBlocks" :key="block.key">
      <section v-if="block.key === 'hero'" class="hero">
        <div class="container hero__inner">
          <div class="hero__copy">
            <p class="hero__eyebrow">{{ school.city }}</p>

            <h1 class="hero__title">
              <template v-for="(line, index) in school.heroTitle.split('\n')" :key="index">
                <span>{{ line }}</span>
                <br v-if="index < school.heroTitle.split('\n').length - 1">
              </template>
            </h1>

            <p class="hero__sub">{{ school.heroText }}</p>

            <div class="hero__actions">
              <router-link :to="routeFor('school-news')" class="btn btn--gold">
                Актуальные новости
              </router-link>
              <router-link
                :to="routeFor('school-contacts')"
                class="btn btn--outline hero__btn-light"
              >
                Связаться
              </router-link>
            </div>
          </div>

          <div class="hero__panel">
            <div class="hero-card">
              <div class="hero-card__brand">
                <SchoolEmblem size="54" />

                <div>
                  <p class="hero-card__short">{{ school.shortName }}</p>
                  <p class="hero-card__full">{{ school.fullName }}</p>
                </div>
              </div>

              <div class="hero-card__highlights">
                <div
                  v-for="item in schoolHighlights"
                  :key="item.label"
                  class="hero-card__highlight"
                >
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>

              <router-link :to="routeFor('school-contacts')" class="hero-card__link">
                Контакты и администрация
              </router-link>
            </div>
          </div>

          <div class="hero__stats">
            <div v-for="s in school.stats" :key="s.label" class="hero__stat">
              <span class="hero__stat-val">{{ s.value }}</span>
              <span class="hero__stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="block.key === 'quick-links'" class="quick section">
        <div class="container">
          <div class="quick__grid">
            <router-link
              v-for="link in quickLinks"
              :key="link.name"
              :to="routeFor(link.name)"
              class="quick__item"
            >
              <div class="quick__icon">
                <svg
                  v-if="link.icon === 'news'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"
                  />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6z" />
                </svg>
                <svg
                  v-else-if="link.icon === 'calendar'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <svg
                  v-else-if="link.icon === 'users'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <svg
                  v-else-if="link.icon === 'file'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span class="quick__label">{{ link.label }}</span>
              <svg
                class="quick__arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </router-link>
          </div>
        </div>
      </section>

      <section v-else-if="block.key === 'news'" class="section section--tight">
        <div class="container">
          <div class="section-header">
            <h2>Последние новости</h2>
            <router-link :to="routeFor('school-news')">Все новости →</router-link>
          </div>
          <div class="news-grid">
            <NewsCard v-for="item in latestNews" :key="item.id" :item="item" />
          </div>
        </div>
      </section>

      <section v-else-if="block.key === 'about'" class="about-band">
        <div class="container about-band__inner">
          <div class="about-band__text">
            <h2>О школе</h2>
            <p>
              {{ school.fullName }} — {{ school.type.toLowerCase() }} в {{ school.city }}.
            </p>
            <p>
              Публичный раздел объединяет новости, документы, педагогический состав,
              расписание и контактную информацию.
            </p>
            <router-link
              :to="routeFor('school-contacts')"
              class="btn btn--primary about-band__cta"
            >
              Узнать больше
            </router-link>
          </div>

          <div class="about-band__features">
            <div class="about-band__feature">
              <div class="about-band__feature-icon">{{ featureIcon('award') }}</div>
              <div>
                <p class="about-band__feature-title">Достижения</p>
                <p class="about-band__feature-sub">
                  Новости, результаты олимпиад и ключевые события школьной жизни.
                </p>
              </div>
            </div>
            <div class="about-band__feature">
              <div class="about-band__feature-icon">{{ featureIcon('book') }}</div>
              <div>
                <p class="about-band__feature-title">Обучение</p>
                <p class="about-band__feature-sub">
                  Педагоги, расписание и документы в одном публичном контуре.
                </p>
              </div>
            </div>
            <div class="about-band__feature">
              <div class="about-band__feature-icon">{{ featureIcon('chat') }}</div>
              <div>
                <p class="about-band__feature-title">Коммуникация</p>
                <p class="about-band__feature-sub">
                  Понятная точка входа для родителей, учеников и гостей школы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 85% 18%, rgba(255, 255, 255, .09), transparent 24%),
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, .05), transparent 28%),
    var(--school-hero-bg);
  padding: 48px 0 34px;

  @media (max-width: $mobile-breakpoint) {
    padding: 28px 0 22px;
  }
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr);
  gap: 32px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}

.hero__copy {
  max-width: 620px;
}

.hero__eyebrow {
  font-size: 12px;
  color: rgba($white, .62);
  text-transform: uppercase;
  letter-spacing: .12em;
}

.hero__title {
  margin-top: 12px;
  font-size: clamp(34px, 3.6vw, 56px);
  font-weight: 700;
  line-height: .98;
  letter-spacing: -.03em;
  color: $white;

  @media (max-width: $mobile-breakpoint) {
    font-size: 30px;
    line-height: 1.04;
  }
}

.hero__sub {
  margin-top: 18px;
  max-width: 560px;
  font-size: 18px;
  line-height: 1.5;
  color: rgba($white, .78);

  @media (max-width: $mobile-breakpoint) {
    font-size: 15px;
  }
}

.hero__actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.hero__btn-light {
  color: $white;
  border-color: rgba($white, .42);
  background: rgba($white, .04);
}

.hero__panel {
  display: flex;
  justify-content: flex-end;

  @media (max-width: 980px) {
    justify-content: stretch;
  }
}

.hero-card {
  width: min(100%, 460px);
  padding: 24px;
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .1), rgba(255, 255, 255, .06));
  border: 1px solid rgba(255, 255, 255, .12);
  box-shadow: 0 24px 60px rgba(6, 16, 40, .18);
  backdrop-filter: blur(10px);
}

.hero-card__brand {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.hero-card__short {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: rgba($white, .72);
}

.hero-card__full {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  color: $white;
}

.hero-card__highlights {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.hero-card__highlight {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, .1);

  span,
  strong {
    display: block;
  }

  span {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: rgba($white, .56);
  }

  strong {
    margin-top: 6px;
    font-size: 15px;
    line-height: 1.45;
    color: rgba($white, .92);
  }
}

.hero-card__link {
  display: inline-flex;
  align-items: center;
  margin-top: 22px;
  color: $white;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: rgba($white, .78);
  }
}

.hero__stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.hero__stat {
  padding: 18px 16px;
  border-radius: 22px;
  text-align: center;
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .09);
}

.hero__stat-val {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: $white;
  line-height: 1;
}

.hero__stat-label {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.35;
  color: rgba($white, .62);
}

.quick__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.quick__item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: $white;
  border: 1px solid var(--school-card-border);
  border-radius: var(--school-card-radius);
  padding: 18px 16px;
  text-decoration: none;
  color: $text-primary;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: 0 4px 16px color-mix(in srgb, var(--school-primary) 10%, transparent);
    transform: translateY(-2px);
    color: var(--school-primary);
  }
}

.quick__icon {
  width: 48px;
  height: 48px;
  background: color-mix(in srgb, var(--school-primary) 8%, white);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--school-primary);
  flex-shrink: 0;
}

.quick__label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.quick__arrow {
  color: $text-muted;
  flex-shrink: 0;
}

.section--tight {
  padding-top: 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.about-band {
  background: var(--school-hero-subtle);
  padding: 56px 0;

  @media (max-width: $mobile-breakpoint) {
    padding: 32px 0;
  }
}

.about-band__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.about-band__text {
  h2 {
    font-size: 26px;
    font-weight: 600;
    color: var(--school-primary);
    margin-bottom: 16px;
  }

  p {
    font-size: 15px;
    color: $text-secondary;
    line-height: 1.7;
    margin-bottom: 12px;
  }
}

.about-band__cta {
  margin-top: 8px;
  display: inline-flex;
}

.about-band__features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-band__feature {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.about-band__feature-icon {
  font-size: 24px;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: $white;
  border-radius: var(--school-card-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--school-card-border);
  color: var(--school-primary);
}

.about-band__feature-title {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 2px;
}

.about-band__feature-sub {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.4;
}
</style>
