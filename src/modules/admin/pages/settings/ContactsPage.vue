<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolSettingsDraft,
  resetSchoolContactsDraft,
  updateSchoolContactsDraft,
} from '@/modules/admin/state/school-settings'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : ''
)

const contactsDraft = computed(() =>
  ensureSchoolSettingsDraft(schoolSlug.value).contacts
)

const form = reactive({
  address: '',
  phone: '',
  email: '',
  hours: '',
  mapLabel: '',
  mapUrl: '',
})

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

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

function save() {
  updateSchoolContactsDraft(schoolSlug.value, {
    address: form.address.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    hours: form.hours.trim(),
    mapLabel: form.mapLabel.trim(),
    mapUrl: form.mapUrl.trim(),
  })

  statusTone.value = 'success'
  statusMessage.value = 'Черновик контактов сохранен.'
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
          Адрес, телефоны, email и режим работы. Эти данные будут использоваться
          в публичном разделе контактов школы.
        </p>
      </div>

      <div class="contacts-page__actions">
        <button class="btn btn--outline" @click="reset">Сбросить</button>
        <button class="btn btn--primary" @click="save">Сохранить</button>
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
        <h2>Контактные данные</h2>

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
      </div>

      <div class="contacts-page__card">
        <h2>Быстрый предпросмотр</h2>

        <dl class="preview-list">
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

        <p class="contacts-page__note">
          На следующем шаге сюда можно будет добавить валидацию, встроенную карту
          и отдельный publish-flow.
        </p>
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
}

.contacts-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, .9fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.contacts-page__card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;

  h2 {
    font-size: 16px;
    color: $navy;
    margin-bottom: 14px;
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

.preview-list {
  display: grid;
  gap: 12px;

  div {
    border-bottom: 1px solid $border;
    padding-bottom: 12px;
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

.contacts-page__note {
  margin-top: 16px;
  color: $text-secondary;
  line-height: 1.6;
  font-size: 14px;
}
</style>
