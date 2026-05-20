<script setup lang="ts">
import { computed, ref } from 'vue'
import { getTeachersBySchool } from '@/data/teachers'
import { useCurrentSchool } from '@/composables/useCurrentSchool'

const { school } = useCurrentSchool()
const search = ref('')

const schoolTeachers = computed(() => getTeachersBySchool(school.value.slug))

const filtered = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return schoolTeachers.value
  return schoolTeachers.value.filter((teacher) =>
    teacher.name.toLowerCase().includes(query) ||
    teacher.subject.toLowerCase().includes(query),
  )
})

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function avatarColor(id: number) {
  const colors = [
    'var(--school-primary)',
    'var(--school-secondary)',
    '#3B6D11',
    '#7B3EA8',
    '#C9A030',
    '#2D8A4E',
  ]

  return colors[id % colors.length]
}
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Педагогический коллектив</h1>
      <p class="page-subtitle">{{ schoolTeachers.length }} специалистов</p>

      <div class="search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="search-icon" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="search"
          type="search"
          placeholder="Поиск по имени или предмету..."
          class="search-input"
          aria-label="Поиск педагогов"
        />
      </div>

      <div class="teachers-grid">
        <div
          v-for="teacher in filtered"
          :key="teacher.id"
          class="teacher-card"
        >
          <div
            class="teacher-card__avatar"
            :style="{ background: avatarColor(teacher.id) }"
            aria-hidden="true"
          >
            {{ initials(teacher.name) }}
          </div>
          <div class="teacher-card__body">
            <p class="teacher-card__name">{{ teacher.name }}</p>
            <p class="teacher-card__position">{{ teacher.position }}</p>
            <div class="teacher-card__meta">
              <span class="teacher-card__subject">{{ teacher.subject }}</span>
              <span class="teacher-card__category">{{ teacher.category }} категория</span>
            </div>
            <p class="teacher-card__exp">Стаж: {{ teacher.experience }} лет</p>
            <a v-if="teacher.email" :href="`mailto:${teacher.email}`" class="teacher-card__email">
              {{ teacher.email }}
            </a>
          </div>
        </div>
        <p v-if="filtered.length === 0" class="empty-state">
          <span>Ничего не найдено по запросу «{{ search }}».</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-wrap {
  position: relative;
  max-width: 400px;
  margin-bottom: 28px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: $text-muted;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid var(--school-card-border);
  border-radius: $radius-md;
  font-size: 14px;
  font-family: inherit;
  background: $white;
  color: $text-primary;
  outline: none;
  transition: border-color $transition-fast;

  &:focus { border-color: var(--school-primary); }
  &::placeholder { color: $text-muted; }
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: 1fr;
  }
}

.teacher-card {
  display: flex;
  gap: 14px;
  background: $white;
  border: 1px solid var(--school-card-border);
  border-radius: var(--school-card-radius);
  padding: 18px;
  align-items: flex-start;
  transition: box-shadow $transition-base;

  &:hover { box-shadow: 0 4px 16px color-mix(in srgb, var(--school-primary) 8%, transparent); }
}

.teacher-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: $white;
  flex-shrink: 0;
}

.teacher-card__body {
  flex: 1;
  min-width: 0;
}

.teacher-card__name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.3;
  margin-bottom: 2px;
}

.teacher-card__position {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 8px;
  line-height: 1.35;
}

.teacher-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.teacher-card__subject {
  font-size: 11px;
  background: color-mix(in srgb, var(--school-primary) 8%, white);
  color: var(--school-primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.teacher-card__category {
  font-size: 11px;
  background: color-mix(in srgb, var(--school-accent) 16%, white);
  color: #7d5631;
  padding: 2px 8px;
  border-radius: 12px;
}

.teacher-card__exp {
  font-size: 12px;
  color: $text-muted;
  margin-bottom: 4px;
}

.teacher-card__email {
  font-size: 12px;
  color: var(--school-primary);
  text-decoration: none;
  word-break: break-all;

  &:hover { text-decoration: underline; }
}
</style>
