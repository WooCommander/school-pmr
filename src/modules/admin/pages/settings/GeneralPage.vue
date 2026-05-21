<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ensureSchoolSettingsDraft,
  getDefaultSchoolSettingsDraft,
  resetSchoolGeneralDraft,
  updateSchoolGeneralDraft,
} from '@/modules/admin/state/school-settings'
import { getManagedSchoolBySlug } from '@/modules/schools/state/school-directory'

const route = useRoute()

const schoolSlug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
)
const currentSchool = computed(() => getManagedSchoolBySlug(schoolSlug.value))

const generalDraft = computed(() => ensureSchoolSettingsDraft(schoolSlug.value).general)
const defaultGeneral = computed(() => getDefaultSchoolSettingsDraft(schoolSlug.value).general)

const form = reactive({
  fullName: '',
  shortName: '',
  type: '',
  city: '',
  description: '',
  studentsCount: '',
  classesCount: '',
  foundedYear: '',
})

const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')

function syncForm() {
  const draft = ensureSchoolSettingsDraft(schoolSlug.value).general
  form.fullName = draft.fullName
  form.shortName = draft.shortName
  form.type = draft.type
  form.city = draft.city
  form.description = draft.description
  form.studentsCount = draft.studentsCount
  form.classesCount = draft.classesCount
  form.foundedYear = draft.foundedYear
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

const normalizedForm = computed(() => ({
  fullName: form.fullName.trim(),
  shortName: form.shortName.trim(),
  type: form.type.trim(),
  city: form.city.trim(),
  description: form.description.trim(),
  studentsCount: form.studentsCount.trim(),
  classesCount: form.classesCount.trim(),
  foundedYear: form.foundedYear.trim(),
}))

const validationErrors = computed(() => {
  const errors: string[] = []

  if (!normalizedForm.value.fullName) {
    errors.push('Укажите полное название школы.')
  }

  if (!normalizedForm.value.shortName) {
    errors.push('Укажите короткое название школы.')
  }

  if (!normalizedForm.value.type) {
    errors.push('Укажите тип школы.')
  }

  if (!normalizedForm.value.city) {
    errors.push('Укажите город.')
  }

  if (normalizedForm.value.description.length < 20) {
    errors.push('Описание должно быть не короче 20 символов.')
  }

  if (!normalizedForm.value.studentsCount || !/^\d+$/.test(normalizedForm.value.studentsCount)) {
    errors.push('Количество учеников должно быть указано числом.')
  }

  if (!normalizedForm.value.classesCount || !/^\d+$/.test(normalizedForm.value.classesCount)) {
    errors.push('Количество классов должно быть указано числом.')
  }

  if (!normalizedForm.value.foundedYear || !/^\d{4}$/.test(normalizedForm.value.foundedYear)) {
    errors.push('Год основания должен состоять из 4 цифр.')
  }

  return errors
})

const isDirty = computed(
  () => JSON.stringify(normalizedForm.value) !== JSON.stringify(generalDraft.value),
)
const hasChangesFromDefault = computed(
  () => JSON.stringify(generalDraft.value) !== JSON.stringify(defaultGeneral.value),
)

function save() {
  if (validationErrors.value.length) {
    statusTone.value = 'error'
    statusMessage.value = validationErrors.value[0]
    return
  }

  updateSchoolGeneralDraft(schoolSlug.value, normalizedForm.value)
  statusTone.value = 'success'
  statusMessage.value = 'Черновик профиля школы сохранен.'
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
        <p>
          Базовые данные школы, которые используются в админке, превью и на публичном сайте:
          название, тип, город, описание и hero-метрики.
        </p>
      </div>

      <div class="general-page__actions">
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
      class="general-page__status"
      :class="`general-page__status--${statusTone}`"
    >
      {{ statusMessage }}
    </div>

    <div class="general-page__grid">
      <div class="general-page__card">
        <div class="general-page__card-header">
          <h2>Профиль школы</h2>
          <span class="general-page__state-pill" :class="{ 'is-dirty': isDirty }">
            {{ isDirty ? 'Есть несохраненные изменения' : 'Черновик сохранен' }}
          </span>
        </div>

        <div class="form-grid">
          <label class="field field--full">
            <span>Полное название</span>
            <input v-model="form.fullName" type="text" />
          </label>

          <label class="field">
            <span>Короткое название</span>
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
            <span>Описание для hero</span>
            <textarea v-model="form.description" rows="6"></textarea>
          </label>
        </div>

        <div class="stats-grid">
          <label class="field">
            <span>Учеников</span>
            <input v-model="form.studentsCount" type="text" inputmode="numeric" />
          </label>

          <label class="field">
            <span>Классов</span>
            <input v-model="form.classesCount" type="text" inputmode="numeric" />
          </label>

          <label class="field">
            <span>Год основания</span>
            <input v-model="form.foundedYear" type="text" inputmode="numeric" />
          </label>

          <div class="stats-note">
            <strong>Педагогов</strong>
            <span>{{ currentSchool?.stats?.[1]?.value || '—' }}</span>
            <p>Считается автоматически из раздела педагогов и отдельно здесь не редактируется.</p>
          </div>
        </div>

        <ul v-if="validationErrors.length" class="validation-list">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <div class="general-page__side">
        <div class="general-page__card">
          <h2>Превью hero</h2>

          <div class="school-preview">
            <p class="school-preview__eyebrow">{{ form.type || 'Тип школы' }}</p>
            <h3>{{ form.shortName || 'Короткое название' }}</h3>
            <p class="school-preview__full">{{ form.fullName || 'Полное название школы' }}</p>
            <p class="school-preview__city">{{ form.city || 'Город' }}</p>
            <p class="school-preview__description">
              {{ form.description || 'Описание школы появится здесь.' }}
            </p>

            <div class="school-preview__stats">
              <div class="school-preview__stat">
                <strong>{{ form.studentsCount || '0' }}</strong>
                <span>учеников</span>
              </div>
              <div class="school-preview__stat">
                <strong>{{ currentSchool?.stats?.[1]?.value || '0' }}</strong>
                <span>педагогов</span>
              </div>
              <div class="school-preview__stat">
                <strong>{{ form.classesCount || '0' }}</strong>
                <span>классов</span>
              </div>
              <div class="school-preview__stat">
                <strong>{{ form.foundedYear || '—' }}</strong>
                <span>год основания</span>
              </div>
            </div>
          </div>
        </div>

        <div class="general-page__card">
          <h2>Текущее состояние</h2>
          <dl class="summary-list">
            <div>
              <dt>Slug</dt>
              <dd>{{ schoolSlug }}</dd>
            </div>
            <div>
              <dt>Исходное название</dt>
              <dd>{{ currentSchool?.shortName || '—' }}</dd>
            </div>
            <div>
              <dt>Черновик отличается</dt>
              <dd>{{ hasChangesFromDefault ? 'Да' : 'Нет' }}</dd>
            </div>
            <div>
              <dt>Символов в описании</dt>
              <dd>{{ normalizedForm.description.length }}</dd>
            </div>
          </dl>
        </div>
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

  &--error {
    background: rgba(180, 35, 24, .10);
    color: #912018;
  }
}

.general-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, .9fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.general-page__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.general-page__card {
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;

  h2 {
    font-size: 16px;
    color: $navy;
  }
}

.general-page__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.general-page__state-pill {
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

.form-grid,
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.stats-grid {
  margin-top: 14px;
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

.stats-note {
  grid-column: 1 / -1;
  padding: 16px;
  border-radius: 14px;
  background: rgba($navy, .04);
  border: 1px solid rgba($navy, .08);

  strong,
  span,
  p {
    display: block;
  }

  strong {
    font-size: 13px;
    color: $navy;
  }

  span {
    margin-top: 6px;
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
  }

  p {
    margin-top: 8px;
    color: $text-secondary;
    line-height: 1.5;
    font-size: 13px;
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

.school-preview {
  margin-top: 14px;
  padding: 18px;
  border-radius: 16px;
  background:
    radial-gradient(circle at top right, rgba($gold, .15), transparent 32%),
    linear-gradient(135deg, rgba($navy, .96), rgba($navy-light, .88));
  color: $white;
}

.school-preview__eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgba($white, .72);
}

.school-preview h3 {
  margin-top: 10px;
  font-size: 28px;
}

.school-preview__full,
.school-preview__city,
.school-preview__description {
  margin-top: 10px;
  line-height: 1.6;
  color: rgba($white, .88);
}

.school-preview__stats {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.school-preview__stat {
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .1);

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 20px;
    font-weight: 700;
    color: $white;
  }

  span {
    margin-top: 6px;
    color: rgba($white, .68);
    font-size: 12px;
  }
}

.summary-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    border-top: 1px solid $border;
    padding-top: 10px;
  }

  dt {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: $text-secondary;
  }

  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    text-align: right;
  }
}
</style>
