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
          components: {
            mainContent: () => import('../views/HomeView.vue') 
          }
        },
        {
          path: 'learning',
          redirect: to => {
            const firstPointId = '1';
            return { name: 'learning-detail', params: { pointId: firstPointId } };
          },
          children: [
            {
              path: ':pointId?',
              name: 'learning-detail',
              components: {
                secondaryNav: () => import('@/components/learning/LearningNav.vue'),
                mainContent: () => import('@/views/LearningView.vue'),
              },
            }
          ]
        },
        {
          path: 'insight-spot',
          redirect: to => {
            const firstSpotId = 'spot-1';
            return { name: 'insight-spot-detail', params: { spotId: firstSpotId } };
          },
          children: [
            {
              path: ':spotId?',
              name: 'insight-spot-detail',
              components: {
                secondaryNav: () => import('@/components/insight/InsightSpotNav.vue'),
                mainContent: () => import('@/views/InsightSpotView.vue')
              },
            }
          ]
        },
        {
          path: 'exam',
          name: 'exam',
          components: {
             mainContent: () => import('@/views/ExamView.vue')
          }
        },
        {
          path: 'question-bank',
          redirect: to => {
            return { name: 'question-bank-detail', query: { knowledgePoint: 'all' } };
          },
          children: [
            {
              path: '',
              name: 'question-bank-detail',
              components: {
                secondaryNav: () => import('@/components/questionbank/QuestionBankNav.vue'),
                mainContent: () => import('@/views/QuestionBankView.vue')
              }
            }
          ]
        },
        {
          path: 'statistics',
          name: 'statistics',
          components: {
            mainContent: () => import('@/views/StatisticsView.vue')
          }
        },
        {
          path: 'profile',
          name: 'profile',
          components: {
             mainContent: () => import('@/views/ProfileView.vue')
          }
        },
        {
          path: 'settings',
          name: 'settings',
          components: {
             mainContent: () => import('@/views/SettingsView.vue')
          }
        },
        {
          path: 'sys-manage',
          name: 'sys-manage',
          components: {
             mainContent: () => import('@/views/SystemManagementView.vue')
          }
        }
      ]
    }
  ]
})

export default router 