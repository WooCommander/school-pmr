import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { defaultSchoolSlug, findSchoolBySlug } from '@/data/schools'

export function useCurrentSchool() {
  const route = useRoute()

  const school = computed(() => {
    const slug = typeof route.params.slug === 'string' ? route.params.slug : defaultSchoolSlug
    return findSchoolBySlug(slug) ?? findSchoolBySlug(defaultSchoolSlug)!
  })

  return { school }
}
