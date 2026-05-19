<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ensureSchoolSettingsDraft, resetSchoolGeneralDraft, updateSchoolGeneralDraft } from '@/modules/admin/state/school-settings'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : ''
)

const generalDraft = computed(() =>
  ensureSchoolSettingsDraft(schoolSlug.value).general
)

const form = reactive({
  fullName: '',
  shortName: '',
  type: '',
  city: '',
  description: '',
})

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success'>('idle')

function syncForm() {
  const draft = ensureSchoolSettingsDraft(schoolSlug.value).general
  form.fullName = draft.fullName
  form.shortName = draft.shortName
  form.type = draft.type
  form.city = draft.city
  form.description = draft.description
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
  () => generalDraft.value,
  () => {
    syncForm()
  },
)

function save() {
  updateSchoolGeneralDraft(schoolSlug.value, {
    fullName: form.fullName.trim(),
    shortName: form.shortName.trim(),
    type: form.type.trim(),
    city: form.city.trim(),
    description: form.description.trim(),
  })

  statusTone.value = 'success'
  statusMessage.value = 'Черновик общей информации сохранен.'
}

function reset() {
  resetSchoolGeneralDraft(schoolSlug.value)
  syncForm()
  statusTone.value = 'success'
  statusMessage.value = 'Черновик сброшен к базовым данным школы.'
}
</script>

<template>
  <section class="general-page">
    <div class="general-page__header">
      <div>
        <h1>Общая информация</h1>
        <p>Базовые данные школы: полное и краткое название, тип школы, город и описание.</p>
      </div>

      <div class="general-page__actions">
        <button class="btn btn--outline" @click="reset">Сбросить</button>
        <button class="btn btn--primary" @click="save">Сохранить</button>
      </div>
    </div>

    <div v-if="statusMessage" class="general-page__status" :class="`general-page__status--${statusTone}`">
      {{ statusMessage }}
    </div>

    <div class="general-page__grid">
      <div class="general-page__card">
        <h2>Основные данные</h2>

        <div class="form-grid">
          <label class="field field--full">
            <span>Полное название</span>
            <input v-model="form.fullName" type="text" />
          </label>

          <label class="field">
            <span>Краткое название</span>
            <input v-model="form.shortName" type="text" />
          </label>

          <label class="field">
            <span>Тип школы</span>
            <input v-model="form.type" type="text" />
          </label>

          <label class="field field--full">
            <span>Город</span>
            <input v-model="form.city" type="text" />
          </label>

          <label class="field field--full">
            <span>Описание</span>
            <textarea v-model="form.description" rows="6"></textarea>
          </label>
        </div>
      </div>

      <div class="general-page__card">
        <h2>Что дальше будет на этом экране</h2>
        <ul class="check-list">
          <li>Публикация draft-версии в публичный сайт</li>
          <li>Проверка обязательных полей и ошибок</li>
          <li>История изменений по общей информации</li>
          <li>Связка с настройками контактов и брендинга</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.general-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.general-page__header {
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

.general-page__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.general-page__status {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;

  &--success {
    background: rgba(45, 138, 78, .12);
    color: #20623a;
  }
}

.general-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, .9fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.general-page__card {
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

  input,
  textarea {
    width: 100%;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 12px 14px;
    font: inherit;
    color: $text-primary;
    background: $white;
    resize: vertical;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: $navy;
  }
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 18px;

  li {
    color: $text-secondary;
    line-height: 1.6;
    font-size: 14px;
  }
}
</style>
