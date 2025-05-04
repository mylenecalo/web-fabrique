import { createRouter, createWebHistory } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView from '@/views/System/HomeView.vue'
import RentalConfirmationView from '@/views/System/RentalConfirmationView.vue'
import RentalHistoryView from '@/views/System/RentalHistoryView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/rental-confirmation',
      name: 'rental-confirmation',
      component: RentalConfirmationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/rental-history',
      name: 'rental-history',
      component: RentalHistoryView,
      meta: { requiresAuth: true },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { requiresAuth: false },
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    // Check if user is authenticated using the store's method
    const authStore = useAuthUserStore()
    const isAuthenticated = await authStore.isAuthenticated()

    if (isAuthenticated) {
      // User is authenticated, proceed
      next()
    } else {
      // User is not authenticated, redirect to forbidden page
      next({ name: 'forbidden' })
    }
  } else {
    // No authentication required, proceed
    next()
  }
})

export default router
