import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/modules/admin/pages/LoginPage.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/admin',
    redirect: {
      name: 'admin-select-school',
    },
  },
  {
    path: '/admin/select-school',
    name: 'admin-select-school',
    component: () => import('@/modules/admin/pages/SelectSchoolPage.vue'),
    meta: {
      requiresAdminAuth: true,
    },
  },
  {
    path: '/admin/school/:slug',
    component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
    meta: {
      requiresAdminAuth: true,
      requiresSchoolAccess: true,
    },
    redirect: (to) => ({
      name: 'admin-school-dashboard',
      params: { slug: to.params.slug },
    }),
    children: [
      {
        path: 'dashboard',
        name: 'admin-school-dashboard',
        component: () => import('@/modules/admin/pages/DashboardPage.vue'),
      },
      {
        path: 'settings/general',
        name: 'admin-school-settings-general',
        component: () => import('@/modules/admin/pages/settings/GeneralPage.vue'),
      },
      {
        path: 'settings/contacts',
        name: 'admin-school-settings-contacts',
        component: () => import('@/modules/admin/pages/settings/ContactsPage.vue'),
      },
      {
        path: 'settings/branding',
        name: 'admin-school-settings-branding',
        component: () => import('@/modules/admin/pages/settings/BrandingPage.vue'),
      },
      {
        path: 'settings/homepage',
        name: 'admin-school-settings-homepage',
        component: () => import('@/modules/admin/pages/settings/HomepagePage.vue'),
      },
      {
        path: 'design/templates',
        name: 'admin-school-design-templates',
        component: () => import('@/modules/admin/pages/design/TemplatesPage.vue'),
      },
      {
        path: 'design/themes',
        name: 'admin-school-design-themes',
        component: () => import('@/modules/admin/pages/design/ThemesPage.vue'),
      },
      {
        path: 'design/customize',
        name: 'admin-school-design-customize',
        component: () => import('@/modules/admin/pages/design/CustomizePage.vue'),
      },
      {
        path: 'design/preview',
        name: 'admin-school-design-preview',
        component: () => import('@/modules/admin/pages/design/PreviewPage.vue'),
      },
      {
        path: 'structure/modules',
        name: 'admin-school-structure-modules',
        component: () => import('@/modules/admin/pages/structure/ModulesPage.vue'),
      },
      {
        path: 'structure/navigation',
        name: 'admin-school-structure-navigation',
        component: () => import('@/modules/admin/pages/structure/NavigationPage.vue'),
      },
      {
        path: 'structure/home-blocks',
        name: 'admin-school-structure-home-blocks',
        component: () => import('@/modules/admin/pages/structure/HomeBlocksPage.vue'),
      },
      {
        path: 'content/news',
        name: 'admin-school-content-news-list',
        component: () => import('@/modules/admin/pages/content/NewsListPage.vue'),
      },
      {
        path: 'content/news/new',
        name: 'admin-school-content-news-create',
        component: () => import('@/modules/admin/pages/content/NewsEditPage.vue'),
      },
      {
        path: 'content/news/:id',
        name: 'admin-school-content-news-edit',
        component: () => import('@/modules/admin/pages/content/NewsEditPage.vue'),
      },
      {
        path: 'content/documents',
        name: 'admin-school-content-documents-list',
        component: () => import('@/modules/admin/pages/content/DocumentsListPage.vue'),
      },
      {
        path: 'content/documents/new',
        name: 'admin-school-content-documents-create',
        component: () => import('@/modules/admin/pages/content/DocumentEditPage.vue'),
      },
      {
        path: 'content/documents/:id',
        name: 'admin-school-content-documents-edit',
        component: () => import('@/modules/admin/pages/content/DocumentEditPage.vue'),
      },
      {
        path: 'users',
        name: 'admin-school-users-list',
        component: () => import('@/modules/admin/pages/users/UsersListPage.vue'),
      },
      {
        path: 'users/invite',
        name: 'admin-school-users-invite',
        component: () => import('@/modules/admin/pages/users/InviteUserPage.vue'),
      },
      {
        path: 'system/publishing',
        name: 'admin-school-system-publishing',
        component: () => import('@/modules/admin/pages/system/PublishingPage.vue'),
      },
      {
        path: 'system/history',
        name: 'admin-school-system-history',
        component: () => import('@/modules/admin/pages/system/HistoryPage.vue'),
      },
    ],
  },
]
