import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const BasicLayout = () => import('@/layouts/BasicLayout.vue')
const VoiceChatLayout = () => import('@/layouts/VoiceChatLayout.vue')
const ApiSetting = () => import('@/views/ApiSetting.vue')
const RagManagementView = () => import('@/views/RagManagementView.vue')
const VoiceChatView = () => import('@/views/VoiceChatView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const AuthView = () => import('@/views/AuthView.vue')
const UserView = () => import('@/views/UserView.vue')

const routes = [
  {
    path: '/',
    component: BasicLayout,
    children: [],
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomeView,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
  },
  {
    path: '/voice-chat',
    component: VoiceChatLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'VoiceChat',
        component: VoiceChatView,
      },
      {
        path: 'api',
        name: 'ApiSetting',
        component: ApiSetting,
      },
      {
        path: 'rag',
        name: 'RagManagement',
        component: RagManagementView,
      },
      {
        path: 'user',
        name: 'User',
        component: UserView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/auth')
  } else if (to.path === '/auth' && userStore.isLoggedIn) {
    next('/voice-chat')
  } else {
    next()
  }
})

export default router
