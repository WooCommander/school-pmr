<script setup lang="ts">
import { useRoute } from 'vue-router'
import NewsCard from '@/components/NewsCard.vue'
import { news } from '@/data/news'
import { useCurrentSchool } from '@/composables/useCurrentSchool'

const route = useRoute()
const { school } = useCurrentSchool()
const latestNews = news.slice(0, 4)

const quickLinks = [
  { name: 'school-news', label: 'Новости', icon: 'news' },
  { name: 'school-schedule', label: 'Расписание', icon: 'calendar' },
  { name: 'school-teachers', label: 'Педагоги', icon: 'users' },
  { name: 'school-documents', label: 'Документы', icon: 'file' },
]

function routeFor(name: string) {
  return { name, params: { slug: route.params.slug } }
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          <p class="hero__eyebrow">{{ school.city }}</p>
          <h1 class="hero__title">
            <template v-for="(line, index) in school.heroTitle.split('\n')" :key="index">
              <span>{{ line }}</span>
              <br v-if="index < school.heroTitle.split('\n').length - 1">
            </template>
          </h1>
          <p class="hero__sub">{{ school.heroText }}</p>
          <div class="hero__actions">
            <router-link :to="routeFor('school-news')" class="btn btn--gold">Актуальные новости</router-link>
            <router-link :to="routeFor('school-contacts')" class="btn btn--outline hero__btn-light">Связаться</router-link>
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

    <section class="quick section">
      <div class="container">
        <div class="quick__grid">
          <router-link
            v-for="link in quickLinks"
            :key="link.name"
            :to="routeFor(link.name)"
            class="quick__item"
          >
            <div class="quick__icon">
              <svg v-if="link.icon === 'news'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>
              <svg v-else-if="link.icon === 'calendar'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <svg v-else-if="link.icon === 'users'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <svg v-else-if="link.icon === 'file'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <span class="quick__label">{{ link.label }}</span>
            <svg class="quick__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <section class="section section--tight">
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

    <section class="about-band">
      <div class="container about-band__inner">
        <div class="about-band__text">
          <h2>О школе</h2>
          <p>
            {{ school.fullName }} — {{ school.type.toLowerCase() }} в {{ school.city }}.
            Публичный раздел объединяет новости, документы, педагогический состав,
            расписание и контактную информацию.
          </p>
          <p>
            Такой формат позволяет использовать единый современный дизайн для разных школ,
            сохраняя отдельный вход и отдельную навигацию для каждой из них.
          </p>
          <router-link :to="routeFor('school-contacts')" class="btn btn--primary" style="margin-top:8px;display:inline-flex">
            Узнать больше
          </router-link>
        </div>
        <div class="about-band__features">
          <div class="about-band__feature">
            <div class="about-band__feature-icon">🏆</div>
            <div>
              <p class="about-band__feature-title">Достижения</p>
              <p class="about-band__feature-sub">Новости, результаты олимпиад и ключевые события школьной жизни.</p>
            </div>
          </div>
          <div class="about-band__feature">
            <div class="about-band__feature-icon">📚</div>
            <div>
              <p class="about-band__feature-title">Обучение</p>
              <p class="about-band__feature-sub">Педагоги, расписание и документы в одном публичном контуре.</p>
            </div>
          </div>
          <div class="about-band__feature">
            <div class="about-band__feature-icon">🤝</div>
            <div>
              <p class="about-band__feature-title">Коммуникация</p>
              <p class="about-band__feature-sub">У родителей и учеников есть отдельная входная точка для каждой школы.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  background: $navy;
  padding: 64px 0 56px;

  @media (max-width: $mobile-breakpoint) {
    padding: 32px 0 28px;
  }
}

.hero__inner {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.hero__eyebrow {
  font-size: 12px;
  color: rgba($white, .6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.hero__title {
  font-size: 36px;
  font-weight: 600;
  color: $white;
  line-height: 1.25;

  span {
    display: inline;
  }

  @media (max-width: $mobile-breakpoint) {
    font-size: 24px;
  }
}

.hero__sub {
  font-size: 16px;
  color: rgba($white, .75);
  line-height: 1.65;
  max-width: 520px;
  margin-top: 12px;

  @media (max-width: $mobile-breakpoint) {
    font-size: 14px;
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
  border-color: rgba($white, .5);
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.hero__stat {
  background: rgba($white, .08);
  border: 1px solid rgba($white, .12);
  border-radius: $radius-md;
  padding: 16px;
  text-align: center;
}

.hero__stat-val {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: $white;
  line-height: 1;

  @media (max-width: $mobile-breakpoint) {
    font-size: 22px;
  }
}

.hero__stat-label {
  display: block;
  font-size: 12px;
  color: rgba($white, .6);
  margin-top: 4px;
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
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 18px 16px;
  text-decoration: none;
  color: $text-primary;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: 0 4px 16px rgba($navy, .1);
    transform: translateY(-2px);
    color: $navy;
  }
}

.quick__icon {
  width: 48px;
  height: 48px;
  background: rgba($navy, .07);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $navy;
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
  background: $surface-2;
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
    color: $navy;
    margin-bottom: 16px;
  }

  p {
    font-size: 15px;
    color: $text-secondary;
    line-height: 1.7;
    margin-bottom: 12px;
  }
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
  font-size: 28px;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: $white;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $border;
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
