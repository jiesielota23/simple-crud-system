export const routes = [
  { path: '/', redirect: '/users' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    meta: {
        requiresAuth: true,
    },
    children: [
        {
            path: 'users',
            component: () => import('@/pages/users/index.vue'),
            name: 'users'
        },
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },

  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
        name: 'login',
        meta: {
            guestOnly: true,
        },
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
        meta: {
            guestOnly: true,
        },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
