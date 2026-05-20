import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from '@/modules/admin/router/admin-routes'
import { hasAdminAccessToSchool, useAdminAuth } from '@/modules/admin/state/admin-auth'
import { isSchoolModuleEnabled, type SchoolModuleKey } from '@/modules/admin/state/school-modules'

const schoolRouteModuleMap: Partial<Record<string, SchoolModuleKey>> = {
  'school-news': 'news',
  'school-news-detail': 'news',
  'school-teachers': 'teachers',
  'school-schedule': 'schedule',
  'school-gallery': 'gallery',
  'school-documents': 'documents',
  'school-contacts': 'contacts',
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PortalLayout.vue'),
      children: [
        {
          path: '',
          name: 'portal-home',
          component: () => import('@/views/SchoolsView.vue'),
        },
      ],
    },
    {
      path: '/school/:slug',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'school-home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'news',
          name: 'school-news',
          component: () => import('@/views/NewsView.vue'),
        },
        {
          path: 'news/:id',
          name: 'school-news-detail',
          component: () => import('@/views/NewsDetailView.vue'),
        },
        {
          path: 'teachers',
          name: 'school-teachers',
          component: () => import('@/views/TeachersView.vue'),
        },
        {
          path: 'schedule',
          name: 'school-schedule',
          component: () => import('@/views/ScheduleView.vue'),
        },
        {
          path: 'documents',
          name: 'school-documents',
          component: () => import('@/views/DocumentsView.vue'),
        },
        {
          path: 'contacts',
          name: 'school-contacts',
          component: () => import('@/views/ContactsView.vue'),
        },
        {
          path: 'gallery',
          name: 'school-gallery',
          component: () => import('@/modules/gallery/ui/GalleryView.vue'),
        },
      ],
    },
    ...adminRoutes,
  ],
})

router.beforeEach((to) => {
  const { state, isAuthenticated } = useAdminAuth()
  const needsAuth = !!to.meta.requiresAdminAuth
  const guestOnly = !!to.meta.guestOnly
  const needsSchoolAccess = !!to.meta.requiresSchoolAccess
  const schoolSlug = typeof to.params.slug === 'string' ? to.params.slug : null
  const routeName = typeof to.name === 'string' ? to.name : null
  const schoolModule = routeName ? schoolRouteModuleMap[routeName] : null

  if (guestOnly && isAuthenticated.value) {
    if (state.selectedSchoolSlug) {
      return { name: 'admin-school-dashboard', params: { slug: state.selectedSchoolSlug } }
    }

    return { name: 'admin-select-school' }
  }

  if (needsAuth && !isAuthenticated.value) {
    return { name: 'admin-login' }
  }

  if (needsSchoolAccess && schoolSlug && !hasAdminAccessToSchool(schoolSlug)) {
    if (state.selectedSchoolSlug && hasAdminAccessToSchool(state.selectedSchoolSlug)) {
      return { name: 'admin-school-dashboard', params: { slug: state.selectedSchoolSlug } }
    }

    return { name: 'admin-select-school' }
  }

  if (schoolSlug && schoolModule && !isSchoolModuleEnabled(schoolSlug, schoolModule)) {
    return { name: 'school-home', params: { slug: schoolSlug } }
  }

  return true
})
