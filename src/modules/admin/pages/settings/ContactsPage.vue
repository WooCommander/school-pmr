<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolSettingsDraft,
  getDefaultSchoolSettingsDraft,
  resetSchoolContactsDraft,
  updateSchoolContactsDraft,
} from '@/modules/admin/state/school-settings'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const currentSchool = computed(() => getManagedSchoolBySlug(schoolSlug.value))

const contactsDraft = computed(() => ensureSchoolSettingsDraft(schoolSlug.value).contacts)
const defaultContacts = computed(() => getDefaultSchoolSettingsDraft(schoolSlug.value).contacts)

const form = reactive({
  address: '',
  phone: '',
  email: '',
  hours: '',
  mapLabel: '',
  mapUrl: '',
})

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')

function syncForm() {
  const draft = ensureSchoolSettingsDraft(schoolSlug.value).contacts
  form.address = draft.address
  form.phone = draft.phone
  form.email = draft.email
  form.hours = draft.hours
  form.mapLabel = draft.mapLabel
  form.mapUrl = draft.mapUrl
}

watch(
  () => schoolSlug.value,
  () => {
    syncForm()
    statusMessage.value = ''
  },
  { immediate: true },
)

watch(
  () => contactsDraft.value,
  () => {
    syncForm()
  },
)

const normalizedForm = computed(() => ({
  address: form.address.trim(),
  phone: form.phone.trim(),
  email: form.email.trim(),
  hours: form.hours.trim(),
  mapLabel: form.mapLabel.trim(),
  mapUrl: form.mapUrl.trim(),
}))

const validationErrors = computed(() => {
  const errors: string[] = []

  if (!normalizedForm.value.address) {
    errors.push('Укажите адрес школы.')
  }

  if (!normalizedForm.value.phone) {
    errors.push('Укажите контактный телефон.')
  }

  if (!normalizedForm.value.email) {
    errors.push('Укажите email школы.')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedForm.value.email)) {
    errors.push('Укажите корректный email.')
  }

  if (!normalizedForm.value.hours) {
    errors.push('Укажите часы работы.')
  }

  if (normalizedForm.value.mapUrl && !/^https?:\/\//i.test(normalizedForm.value.mapUrl)) {
    errors.push('Ссылка на карту должна начинаться с http:// или https://.')
  }

  return errors
})

const isDirty = computed(
  () => JSON.stringify(normalizedForm.value) !== JSON.stringify(contactsDraft.value),
)
const hasChangesFromDefault = computed(
  () => JSON.stringify(contactsDraft.value) !== JSON.stringify(defaultContacts.value),
)

function save() {
  if (validationErrors.value.length) {
    statusTone.value = 'error'
    statusMessage.value = validationErrors.value[0]
    return
  }

  updateSchoolContactsDraft(schoolSlug.value, normalizedForm.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик контактов сохранён.'
}

function reset() {
  resetSchoolContactsDraft(schoolSlug.value)
  syncForm()
  statusTone.value = 'success'
  statusMessage.value = 'Контакты сброшены к данным школы по умолчанию.'
}
</script>

<template>
  <section class="contacts-page">
    <div class="contacts-page__header">
      <div>
        <h1>Контакты школы</h1>
        <p>
          Адрес, телефоны, email и режим работы. Эти данные используются
          в публичном разделе контактов и в карточке школы.
        </p>
      </div>

      <div class="contacts-page__actions">
        <button class="btn btn--outline" :disabled="!hasChangesFromDefault" @click="reset">
          Сбросить
        </button>
        <button class="btn btn--primary" :disabled="!isDirty" @click="save">
          Сохранить
        </button>
      </div>
    </div>

    <div
      v-if="statusMessage"
      class="contacts-page__status"
      :class="`contacts-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="contacts-page__grid">
      <div class="contacts-page__card">
        <div class="contacts-page__card-header">
          <h2>Контактные данные</h2>
          <span class="contacts-page__state-pill" :class="{ 'is-dirty': isDirty }">
            {{ isDirty ? 'Есть несохранённые изменения' : 'Черновик сохранён' }}
          </span>
        </div>

        <div class="form-grid">
          <label class="field field--full">
            <span>Адрес</span>
            <input v-model="form.address" type="text" />
          </label>

          <label class="field">
            <span>Телефон</span>
            <input v-model="form.phone" type="text" />
          </label>

          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" />
          </label>

          <label class="field field--full">
            <span>Часы работы</span>
            <input v-model="form.hours" type="text" />
          </label>

          <label class="field">
            <span>Подпись для карты</span>
            <input v-model="form.mapLabel" type="text" />
          </label>

          <label class="field">
            <span>Ссылка на карту</span>
            <input
              v-model="form.mapUrl"
              type="url"
              placeholder="https://maps.example/school"
            />
          </label>
        </div>

        <ul v-if="validationErrors.length" class="validation-list">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <div class="contacts-page__side">
        <div class="contacts-page__card">
          <h2>Быстрый предпросмотр</h2>

          <dl class="preview-list">
            <div>
              <dt>Школа</dt>
              <dd>{{ currentSchool?.shortName || '—' }}</dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>{{ form.address || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd>{{ form.phone || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ form.email || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Часы работы</dt>
              <dd>{{ form.hours || 'Не заполнено' }}</dd>
            </div>
            <div>
              <dt>Карта</dt>
              <dd>{{ form.mapLabel || 'Подпись для карты не задана' }}</dd>
            </div>
          </dl>
        </div>

        <div class="contacts-page__card">
          <h2>Состояние</h2>

          <dl class="summary-list">
            <div>
              <dt>Slug</dt>
              <dd>{{ schoolSlug }}</dd>
            </div>
            <div>
              <dt>Дефолтный email</dt>
              <dd>{{ currentSchool?.email || '—' }}</dd>
            </div>
            <div>
              <dt>Есть ссылка на карту</dt>
              <dd>{{ normalizedForm.mapUrl ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Отличается от дефолта</dt>
              <dd>{{ hasChangesFromDefault ? 'Да' : 'Нет' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contacts-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contacts-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    max-width: 760px;
    line-height: 1.6;
  }
}

.contacts-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.contacts-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }

  &--error {
    background: rgba(180, 35, 24, .10);
    color: #912018;
  }
}

.contacts-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, .9fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.contacts-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contacts-page__card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;

  h2 {
    font-size: 16px;
    color: $navy;
  }
}

.contacts-page__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.contacts-page__state-pill {
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba($navy, .08);
  color: $navy;
  font-size: 12px;
  font-weight: 600;

  &.is-dirty {
    background: rgba($gold, .20);
    color: $navy-dark;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &--full {
    grid-column: 1 / -1;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    color: $text-primary;
  }

  input {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    color: $text-primary;
    background: $white;
  }

  input:focus {
    outline: none;
    border-color: $navy;
  }
}

.validation-list {
  margin-top: 16px;
  display: grid;
  gap: 8px;
  padding-left: 18px;

  li {
    color: #912018;
    line-height: 1.5;
    font-size: 14px;
  }
}

.preview-list,
.summary-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;

  div {
    border-top: 1px solid $border;
    padding-top: 12px;
  }

  dt {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .04em;
    color: $text-secondary;
    margin-bottom: 6px;
  }

  dd {
    margin: 0;
    color: $text-primary;
    line-height: 1.5;
  }
}
</style>
