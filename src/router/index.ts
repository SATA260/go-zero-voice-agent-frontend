import { createRouter, createWebHistory } from 'vue-router'

const BasicLayout = () => import('@/layouts/BasicLayout.vue')
const LoginView = () => import('@/views/LoginView/LoginView.vue')
const routes = [
  {
    path: '/',
    component: BasicLayout,
    children: [],
  },
  {
    path:'/login',
    component:LoginView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
