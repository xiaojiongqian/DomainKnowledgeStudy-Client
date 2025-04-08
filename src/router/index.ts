import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LearningView from '@/views/LearningView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'learning',
          name: 'learning',
          component: LearningView
        },
        {
          path: 'exam',
          name: 'exam',
          component: () => import('@/views/ExamView.vue')
        },
        {
          path: 'question-bank',
          name: 'question-bank',
          component: () => import('@/views/QuestionBankView.vue')
        },
        {
          path: 'configuration',
          name: 'configuration',
          component: () => import('@/views/ConfigurationView.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue')
        }
      ]
    }
  ]
})

export default router 