import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores'
import { computed } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/main',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/MainView'),
          meta: { title: 'AutoPCR - 首页' }
        },
        {
          path: 'devedit',
          name: 'devedit',
          component: () => import('@/views/ConfigView'),
          meta: { title: 'AutoPCR - 任务' }
        },
        {
          path: ':acc',
          name: 'acc',
          component: () => import('@/views/ConfigView'),
          meta: { title: 'AutoPCR - 任务' }
        }
      ],
      meta: { title: 'AutoPCR' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../layouts/LoginLayout.vue'),
      meta: { title: 'AutoPCR - 登录' }
    },
    {}
  ]
})
router.beforeEach(async (to) => {
  // 检查是否登录
  const store = useStore()
  const ifLogin = computed(() => store.login)
  if (to.name !== 'login' && !ifLogin.value) {
    return { name: 'login' }
  }
  if (to.name === 'login' && ifLogin.value) {
    return { name: 'home' }
  }
  // 路由发生变化修改页面title
  if (to.meta['title']) {
    document.title = to.meta['title']
  } else {
    document.title = 'AutoPCR'
  }
})

export default router
