import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  getManagedDefaultSchoolSlug,
  getManagedSchoolBySlug,
} from '@/modules/schools/state/school-directory'
import { getSchoolsService } from '@/modules/schools/services/school-service'

export function useCurrentSchool() {
  const route = useRoute()

  const school = computed(() => {
    const defaultSchoolSlug = getManagedDefaultSchoolSlug()
    const slug = typeof route.params.slug === 'string' ? route.params.slug : defaultSchoolSlug

    return (
      getManagedSchoolBySlug(slug) ??
      getManagedSchoolBySlug(defaultSchoolSlug) ??
      getSchoolsService()[0]
    )
  })

  return { school }
}
