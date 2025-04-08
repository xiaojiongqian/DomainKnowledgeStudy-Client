import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 全局设置
config.global.plugins = []

// Mock路由
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useRoute: () => ({
    path: '/',
    name: 'home',
  }),
})) 