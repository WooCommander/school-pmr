<script setup lang="ts">
import { ref } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { news } from '@/data/news'

const latestNews = news.slice(0, 4)

const quickLinks = [
  { name: 'schedule',  label: 'Расписание',  icon: 'calendar' },
  { name: 'teachers',  label: 'Педагоги',    icon: 'users' },
  { name: 'documents', label: 'Документы',   icon: 'file' },
  { name: 'contacts',  label: 'Контакты',    icon: 'phone' },
]

const stats = [
  { value: '850', label: 'учеников' },
  { value: '56',  label: 'педагогов' },
  { value: '38',  label: 'классов' },
  { value: '1962', label: 'год основания' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          <p class="hero__eyebrow">г. Днестровск, ПМР</p>
          <h1 class="hero__title">
            МОУ Днестровская<br>средняя школа №1
          </h1>
          <p class="hero__sub">
            Качественное образование, развитие личности и подготовка к жизни
            в современном обществе с&nbsp;1962 года.
          </p>
          <div class="hero__actions">
            <router-link to="/news" class="btn btn--gold">Актуальные новости</router-link>
            <router-link to="/contacts" class="btn btn--outline" style="color:#fff;border-color:rgba(255,255,255,.5)">Связаться</router-link>
          </div>
        </div>
        <div class="hero__stats">
          <div v-for="s in stats" :key="s.label" class="hero__stat">
            <span class="hero__stat-val">{{ s.value }}</span>
            <span class="hero__stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick links -->
    <section class="quick section">
      <div class="container">
        <div class="quick__grid">
          <router-link
            v-for="link in quickLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="quick__item"
          >
            <div class="quick__icon">
              <svg v-if="link.icon === 'calendar'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <svg v-else-if="link.icon === 'users'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <svg v-else-if="link.icon === 'file'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <svg v-else-if="link.icon === 'phone'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.45 6.45l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <span class="quick__label">{{ link.label }}</span>
            <svg class="quick__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Latest news -->
    <section class="section" style="background: $surface; padding-top: 0;">
      <div class="container">
        <div class="section-header">
          <h2>Последние новости</h2>
          <router-link to="/news">Все новости →</router-link>
        </div>
        <div class="news-grid">
          <NewsCard v-for="item in latestNews" :key="item.id" :item="item" />
        </div>
      </div>
    </section>

    <!-- About band -->
    <section class="about-band">
      <div class="container about-band__inner">
        <div class="about-band__text">
          <h2>О школе</h2>
          <p>
            МОУ Днестровская средняя школа №1 — ведущее общеобразовательное учреждение
            города Днестровска. Мы предоставляем качественное образование с&nbsp;1962&nbsp;года,
            воспитывая всесторонне развитых личностей.
          </p>
          <p>
            В школе обучаются более 850 учеников под руководством 56 опытных педагогов.
            Мы гордимся результатами наших учеников на олимпиадах, спортивных
            соревнованиях и творческих конкурсах.
          </p>
          <router-link to="/contacts" class="btn btn--primary" style="margin-top:8px;display:inline-flex">
            Узнать больше
          </router-link>
        </div>
        <div class="about-band__features">
          <div class="about-band__feature">
            <div class="about-band__feature-icon">🏆</div>
            <div>
              <p class="about-band__feature-title">Олимпиады</p>
              <p class="about-band__feature-sub">Призёры районных и республиканских олимпиад</p>
            </div>
          </div>
          <div class="about-band__feature">
            <div class="about-band__feature-icon">📚</div>
            <div>
              <p class="about-band__feature-title">Программы</p>
              <p class="about-band__feature-sub">Углублённые курсы по математике, физике, химии</p>
            </div>
          </div>
          <div class="about-band__feature">
            <div class="about-band__feature-icon">🤝</div>
            <div>
              <p class="about-band__feature-title">Сообщество</p>
              <p class="about-band__feature-sub">Активная работа с родителями и выпускниками</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Hero
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

// Quick links
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

// News grid
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

// About band
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
