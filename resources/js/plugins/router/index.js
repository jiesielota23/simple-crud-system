
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { getAuthenticatedUser } from '@/services/authService'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach(async to => {
  const requiresAuth = to.matched.some(
    record => record.meta.requiresAuth
  )

  const guestOnly = to.matched.some(
    record => record.meta.guestOnly
  )

  if (!requiresAuth && !guestOnly) {
    return true
  }

  try {
    await getAuthenticatedUser()

    // Already authenticated
    if (guestOnly) {
      return { path: '/users' }
    }

    return true
  } catch (error) {
    console.log('Authentication status:', error.response?.status)

    if (error.response?.status === 401) {
      if (requiresAuth) {
        return {
          path: '/login',
          query: {
            redirect: to.fullPath,
          },
        }
      }

      return true
    }

    throw error
  }
})

export default function (app) {
  app.use(router)
}

export { router }
