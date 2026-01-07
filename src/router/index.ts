import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Favorites from '@/pages/Favorites.vue'
import History from '@/pages/History.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
  {
    path: '/dog/:id',
    name: 'DogDetail',
    component: () => import('@/pages/DogDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
