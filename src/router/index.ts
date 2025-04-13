import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

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
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'learning',
          name: 'learning',
          component: () => import('../views/LearningView.vue')
        },
        {
          path: 'insight-spot',
          name: 'insight-spot',
          component: () => import('../views/InsightSpotView.vue')
        },
        {
          path: 'exam',
          name: 'exam',
          component: () => import('../views/ExamView.vue')
        },
        {
          path: 'question-bank',
          name: 'question-bank',
          component: () => import('../views/QuestionBankView.vue')
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('../views/StatisticsView.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue')
        }
      ]
    }
  ]
})

export default router 