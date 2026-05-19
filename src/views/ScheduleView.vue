<script setup lang="ts">
import { ref, computed } from 'vue'
import { bells, sampleSchedule, classGroups, weekDays } from '@/data/schedule'
import { useCurrentSchool } from '@/composables/useCurrentSchool'

const { school } = useCurrentSchool()
const selectedClass = ref('5А')

const schedule = computed(() =>
  sampleSchedule[selectedClass.value] ?? null
)

function getLesson(dayIdx: number, lessonIdx: number) {
  return schedule.value?.[dayIdx]?.[lessonIdx] ?? null
}
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="page-title">Расписание</h1>
      <p class="page-subtitle">Актуальное расписание занятий для {{ school.fullName }}</p>

      <div class="class-selector">
        <label class="class-selector__label" for="class-select">Класс:</label>
        <div class="class-select-wrap">
          <select
            id="class-select"
            v-model="selectedClass"
            class="class-select"
          >
            <option v-for="cls in classGroups" :key="cls" :value="cls">{{ cls }}</option>
          </select>
        </div>
      </div>

      <div class="bells-card">
        <h2 class="bells-card__title">Расписание звонков</h2>
        <div class="bells-grid">
          <div v-for="bell in bells" :key="bell.number" class="bell-item">
            <span class="bell-item__num">{{ bell.number }}</span>
            <span class="bell-item__time">{{ bell.start }} – {{ bell.end }}</span>
            <span v-if="bell.note" class="bell-item__note">{{ bell.note }}</span>
          </div>
        </div>
      </div>

      <div v-if="schedule" class="schedule-wrap">
        <h2 class="schedule-title">Расписание {{ selectedClass }}</h2>
        <div class="schedule-table-scroll">
          <table class="schedule-table">
            <thead>
              <tr>
                <th class="schedule-table__th-num">№</th>
                <th
                  v-for="day in weekDays"
                  :key="day"
                  class="schedule-table__th-day"
                >
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bell, lessonIdx) in bells" :key="bell.number">
                <td class="schedule-table__num">
                  <span class="schedule-table__lesson-num">{{ bell.number }}</span>
                  <span class="schedule-table__lesson-time">{{ bell.start }}</span>
                </td>
                <td
                  v-for="(day, dayIdx) in weekDays"
                  :key="day"
                  class="schedule-table__cell"
                >
                  <template v-if="getLesson(dayIdx, lessonIdx)">
                    <p class="schedule-table__subject">{{ getLesson(dayIdx, lessonIdx)!.subject }}</p>
                    <p class="schedule-table__teacher">{{ getLesson(dayIdx, lessonIdx)!.teacher }}</p>
                    <span class="schedule-table__room">каб. {{ getLesson(dayIdx, lessonIdx)!.room }}</span>
                  </template>
                  <span v-else class="schedule-table__empty">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Расписание для {{ selectedClass }} пока не добавлено.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.class-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.class-selector__label {
  font-size: 14px;
  font-weight: 500;
  color: $text-secondary;
}

.class-select-wrap {
  position: relative;
}

.class-select {
  appearance: none;
  padding: 9px 36px 9px 14px;
  border: 1px solid $border;
  border-radius: $radius-md;
  font-size: 14px;
  font-family: inherit;
  background: $white;
  color: $text-primary;
  cursor: pointer;
  outline: none;
  transition: border-color $transition-fast;

  &:focus { border-color: $navy; }
}

.bells-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px 24px;
  margin-bottom: 28px;
}

.bells-card__title {
  font-size: 15px;
  font-weight: 600;
  color: $navy;
  margin-bottom: 14px;
}

.bells-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.bell-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: $surface;
  border-radius: $radius-sm;
}

.bell-item__num {
  width: 22px;
  height: 22px;
  background: $navy;
  color: $white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.bell-item__time {
  font-size: 13px;
  color: $text-primary;
}

.bell-item__note {
  font-size: 10px;
  color: $text-muted;
}

.schedule-title {
  font-size: 18px;
  font-weight: 600;
  color: $navy;
  margin-bottom: 16px;
}

.schedule-table-scroll {
  overflow-x: auto;
  border-radius: $radius-lg;
  border: 1px solid $border;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: $white;
  table-layout: fixed;
  min-width: 640px;
}

.schedule-table__th-num {
  width: 70px;
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 500;
  color: $text-secondary;
  text-align: left;
  background: $surface-2;
  border-bottom: 2px solid $navy;
}

.schedule-table__th-day {
  padding: 12px 10px;
  font-size: 13px;
  font-weight: 500;
  color: $navy;
  text-align: left;
  background: $surface-2;
  border-bottom: 2px solid $navy;
}

.schedule-table__num {
  padding: 12px 14px;
  vertical-align: top;
  border-bottom: 1px solid $border;
  background: $surface;
}

.schedule-table__lesson-num {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: $navy;
  line-height: 1;
}

.schedule-table__lesson-time {
  display: block;
  font-size: 10px;
  color: $text-muted;
  margin-top: 2px;
}

.schedule-table__cell {
  padding: 10px;
  vertical-align: top;
  border-bottom: 1px solid $border;
  border-left: 1px solid $border;
}

.schedule-table__subject {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2px;
}

.schedule-table__teacher {
  font-size: 11px;
  color: $text-secondary;
  margin-bottom: 4px;
}

.schedule-table__room {
  font-size: 10px;
  background: rgba($navy, .07);
  color: $navy;
  padding: 1px 6px;
  border-radius: 10px;
}

.schedule-table__empty {
  color: $text-muted;
  font-size: 14px;
}
</style>
