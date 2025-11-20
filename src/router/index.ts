import { createRouter, createWebHistory } from 'vue-router'

const BasicLayout = () => import('@/layouts/BasicLayout.vue')
const VoiceChatLayout = () => import('@/layouts/VoiceChatLayout.vue')
const ApiSetting = () => import('@/views/ApiSetting.vue')
const VoiceChatView = () => import('@/views/VoiceChatView.vue')

const routes = [
  {
    path: '/',
    component: BasicLayout,
    children: [],
  },
  {
    path: '/voice-chat',
    component: VoiceChatLayout,
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
