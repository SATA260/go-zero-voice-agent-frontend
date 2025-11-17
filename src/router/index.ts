import { createRouter, createWebHistory } from 'vue-router'

const BasicLayout = () => import('@/layouts/BasicLayout.vue')

const routes = [
  {
    path: '/',
    component: BasicLayout,
    children: [],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
