<script setup lang="ts">
import { computed } from 'vue'
import { getManagedSchools } from '@/modules/schools/state/school-directory'

const schools = computed(() => getManagedSchools())
</script>

<template>
  <div class="portal">
    <div class="portal__hero">
      <div class="container portal__hero-inner">
        <p class="portal__eyebrow">Портал выбора школы</p>
        <h1 class="portal__title">Школы Приднестровья</h1>
        <p class="portal__subtitle">
          Выберите учебное заведение и перейдите на его публичный сайт
          с новостями, расписанием, документами и контактной информацией.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="schools-grid">
          <router-link
            v-for="school in schools"
            :key="school.id"
            :to="{ name: 'school-home', params: { slug: school.slug } }"
            class="school-card"
          >
            <div class="school-card__preview">
              <div class="school-card__badge">{{ school.shortName }}</div>
              <div class="school-card__shape" aria-hidden="true">
                <span v-for="index in 10" :key="index"></span>
              </div>
            </div>
            <div class="school-card__body">
              <p class="school-card__type">{{ school.type }}</p>
              <h2 class="school-card__title">{{ school.fullName }}</h2>
              <p class="school-card__address">{{ school.address }}</p>
              <span class="school-card__link">Перейти на сайт школы</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.portal__hero {
  background: linear-gradient(180deg, $navy 0%, $navy-dark 100%);
  padding: 72px 0 64px;

  @media (max-width: $mobile-breakpoint) {
    padding: 48px 0 40px;
  }
}

.portal__hero-inner {
  text-align: center;
}

.portal__eyebrow {
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba($white, .65);
}

.portal__title {
  font-size: 42px;
  font-weight: 600;
  color: $white;
  margin-top: 12px;

  @media (max-width: $mobile-breakpoint) {
    font-size: 30px;
  }
}

.portal__subtitle {
  max-width: 720px;
  margin: 16px auto 0;
  color: rgba($white, .76);
  font-size: 16px;
  line-height: 1.7;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.school-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform $transition-base, box-shadow $transition-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($navy, .1);
  }
}

.school-card__preview {
  padding: 18px;
  background: linear-gradient(135deg, rgba($navy, .06), rgba($navy, .14));
  border-bottom: 1px solid $border;
}

.school-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  height: 30px;
  padding: 0 12px;
  background: $navy;
  color: $white;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.school-card__shape {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 18px;

  span {
    height: 24px;
    border-radius: 6px;
    background: rgba($white, .95);
    border: 1px solid rgba($navy, .08);
  }
}

.school-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  flex: 1;
}

.school-card__type {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: $text-muted;
}

.school-card__title {
  font-size: 16px;
  line-height: 1.35;
  color: $navy;
}

.school-card__address {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
  flex: 1;
}

.school-card__link {
  font-size: 13px;
  font-weight: 500;
  color: $navy;
}
</style>
