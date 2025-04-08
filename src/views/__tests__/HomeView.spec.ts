import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import HomeView from '../HomeView.vue'
import ElementPlus from 'element-plus'

describe('HomeView', () => {
  it('renders welcome message', () => {
    render(HomeView, {
      global: {
        plugins: [ElementPlus]
      }
    })
    
    expect(screen.getByText('欢迎使用领域知识学习系统')).toBeInTheDocument()
  })

  it('renders all function cards', () => {
    render(HomeView, {
      global: {
        plugins: [ElementPlus]
      }
    })
    
    expect(screen.getByText('知识学习')).toBeInTheDocument()
    expect(screen.getByText('考试')).toBeInTheDocument()
    expect(screen.getByText('题库管理')).toBeInTheDocument()
    expect(screen.getByText('系统配置')).toBeInTheDocument()
    expect(screen.getByText('个人信息')).toBeInTheDocument()
  })
}) 