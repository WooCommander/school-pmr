<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  deleteSchoolInquiry,
  getSchoolInquiries,
  schoolInquiryStatusLabels,
  updateSchoolInquiryStatus,
  type SchoolInquiryStatus,
} from '@/modules/admin/state/school-inquiries'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)

const search = ref('')
const statusFilter = ref<'all' | SchoolInquiryStatus>('all')

const allInquiries = computed(() => getSchoolInquiries(schoolSlug.value))
const filteredInquiries = computed(() => {
  const query = search.value.trim().toLowerCase()

  return allInquiries.value.filter((item) => {
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.contact.toLowerCase().includes(query) ||
      item.topic.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query)

    const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const newCount = computed(() => allInquiries.value.filter((item) => item.status === 'new').length)
const inProgressCount = computed(
  () => allInquiries.value.filter((item) => item.status === 'in_progress').length,
)
const answeredCount = computed(
  () => allInquiries.value.filter((item) => item.status === 'answered').length,
)

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function setStatus(inquiryId: number, status: SchoolInquiryStatus) {
  updateSchoolInquiryStatus(schoolSlug.value, inquiryId, status)
}

function removeInquiry(inquiryId: number) {
  deleteSchoolInquiry(schoolSlug.value, inquiryId)
}
</script>

<template>
  <section class="inquiries-page">
    <div class="inquiries-page__header">
      <div>
        <h1>Обращения</h1>
        <p>
          Закрытые вопросы и сообщения с публичной формы. Ничего не публикуется на сайт автоматически:
          обращения проходят модерацию только внутри админки.
        </p>
      </div>
    </div>

    <div class="inquiries-page__stats">
      <article class="stat-card">
        <span class="stat-card__value">{{ allInquiries.length }}</span>
        <span class="stat-card__label">Всего обращений</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ newCount }}</span>
        <span class="stat-card__label">Новых</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ inProgressCount }}</span>
        <span class="stat-card__label">В работе</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">{{ answeredCount }}</span>
        <span class="stat-card__label">Отвечено</span>
      </article>
    </div>

    <section class="inquiries-card">
      <div class="filters">
        <input
          v-model="search"
          type="search"
          placeholder="Поиск по имени, контакту, теме или тексту"
        />

        <select v-model="statusFilter">
          <option value="all">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="answered">Отвечено</option>
          <option value="rejected">Отклонено</option>
        </select>
      </div>

      <div v-if="filteredInquiries.length" class="inquiries-table">
        <article v-for="item in filteredInquiries" :key="item.id" class="inquiry-row">
          <div class="inquiry-row__main">
            <div class="inquiry-row__title">
              <h2>{{ item.topic }}</h2>
              <span class="status-pill" :class="`status-pill--${item.status}`">
                {{ schoolInquiryStatusLabels[item.status] }}
              </span>
            </div>

            <div class="inquiry-row__meta">
              <span>{{ item.name }}</span>
              <span>{{ item.contact }}</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>

            <p class="inquiry-row__message">{{ item.message }}</p>
          </div>

          <div class="inquiry-row__actions">
            <select :value="item.status" @change="setStatus(item.id, ($event.target as HTMLSelectElement).value as SchoolInquiryStatus)">
              <option value="new">Новое</option>
              <option value="in_progress">В работе</option>
              <option value="answered">Отвечено</option>
              <option value="rejected">Отклонено</option>
            </select>

            <button class="btn btn--danger" @click="removeInquiry(item.id)">Удалить</button>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <p>По текущим фильтрам обращения не найдены.</p>
      </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.inquiries-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inquiries-page__header {
  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    max-width: 860px;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.inquiries-page__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card,
.inquiries-card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

.stat-card {
  padding: 18px 20px;
}

.stat-card__value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: $navy;
}

.stat-card__label {
  display: block;
  margin-top: 8px;
  color: $text-secondary;
}

.inquiries-card {
  padding: 20px;
}

.filters {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 220px;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  input,
  select {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    background: $white;
    color: $text-primary;
  }
}

.inquiries-table {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inquiry-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 16px;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.inquiry-row__title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  h2 {
    font-size: 18px;
    color: $text-primary;
  }
}

.inquiry-row__meta {
  margin-top: 10px;
  display: flex;
  gap: 8px 16px;
  flex-wrap: wrap;

  span {
    font-size: 13px;
    color: $text-secondary;
  }
}

.inquiry-row__message {
  margin-top: 12px;
  color: $text-primary;
  line-height: 1.6;
  white-space: pre-wrap;
}

.inquiry-row__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  select {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 11px 12px;
    font: inherit;
    background: $white;
    color: $text-primary;
  }
}

.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;

  &--new {
    background: rgba(15, 42, 94, .08);
    color: $navy;
  }

  &--in_progress {
    background: rgba($gold, .18);
    color: #7b5b14;
  }

  &--answered {
    background: rgba(45, 138, 78, .14);
    color: #20623a;
  }

  &--rejected {
    background: rgba(180, 35, 24, .12);
    color: #912018;
  }
}

.btn--danger {
  background: rgba(180, 35, 24, .10);
  color: #912018;
}
</style>
