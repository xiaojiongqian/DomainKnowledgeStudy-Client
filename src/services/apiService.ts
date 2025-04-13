import axios from 'axios'

// 创建API实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 定义知识点类型
export interface KnowledgePoint {
  id: string
  label: string
  content?: string
  children?: KnowledgePoint[]
}

// 定义问答数据类型
export interface QAItem {
  question: string
  answer: string
}

// 洞察点相关API
export const insightSpotApi = {
  // 获取知识洞察点
  async generateKnowledgeSpots(params: {
    total?: number | 'auto'
    questionsPerSpot?: number | 'auto'
  }): Promise<KnowledgePoint[]> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟数据
      return [
        {
          id: '1',
          label: 'Git 基本概念',
          content: `Git 是一个开源的分布式版本控制系统（Distributed Version Control System, DVCS），由 Linus Torvalds 于 2005 年创建，最初用于管理 Linux 内核的开发。它的设计目标是高效、快速且可靠地处理代码版本控制，支持从小型个人项目到大型分布式团队协作。与传统的集中式版本控制系统（如 Subversion 或 CVS）不同，Git 的分布式特性使其在灵活性、可离线操作和协作能力上具有显著优势。`
        },
        {
          id: '2',
          label: '工作区与暂存区',
          content: `Git的工作区是你当前看到的目录，暂存区是Git中的一个临时存储区域，用于保存下一次提交要更新的文件列表信息。当你使用git add命令时，文件会被添加到暂存区；当你使用git commit命令时，暂存区的文件会被提交到本地仓库。`
        }
      ]
    } catch (error) {
      console.error('获取知识洞察失败:', error)
      throw error
    }
  },
  
  // 获取知识点相关问答
  async getKnowledgeQuestions(knowledgeId: string): Promise<QAItem[]> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 根据不同知识点返回不同问答
      if (knowledgeId === '1') {
        return [
          {
            question: 'git add 的作用是什么?',
            answer: 'git add 用于将工作目录中的文件更改添加到暂存区（Staging Area），这是一个中间步骤，用于准备文件以便提交。'
          },
          {
            question: '什么是 Git 的暂存区（Staging Area）?',
            answer: '暂存区是 Git 的一个中间区域，用于存储将要提交的文件更改。它允许开发者选择哪些更改要包含在下一次提交中。'
          },
          {
            question: '如何将工作目录中的所有更改都添加到暂存区?',
            answer: '使用 git add . 命令，可以将当前目录及其所有子目录中的所有更改添加到暂存区。'
          },
          {
            question: '能否只添加特定文件到暂存区?',
            answer: '是的，可以使用 git add <file1> <file2> ... 来指定要添加到暂存区的特定文件。'
          }
        ]
      } else {
        return [
          {
            question: '如何查看工作区和暂存区的状态?',
            answer: '使用 git status 命令可以查看工作区和暂存区的状态，包括哪些文件被修改但尚未添加到暂存区，哪些文件已经添加到暂存区但尚未提交。'
          },
          {
            question: '如何撤销工作区的修改?',
            answer: '使用 git checkout -- <file> 或 git restore <file>（Git 2.23+）命令可以撤销工作区的修改。'
          }
        ]
      }
    } catch (error) {
      console.error('获取知识点问答失败:', error)
      throw error
    }
  },
  
  // 获取建议问题
  async getSuggestedQuestions(knowledgeId: string): Promise<string[]> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return [
        'git add 的基本概念是什么？',
        '如何应用版本控制解决实际问题？',
        '分布式版本控制的最佳实践有哪些？'
      ]
    } catch (error) {
      console.error('获取建议问题失败:', error)
      throw error
    }
  }
}

export default api 