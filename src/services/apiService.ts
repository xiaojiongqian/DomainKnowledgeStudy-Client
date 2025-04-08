import axios from 'axios'
import { 
  type KnowledgePoint,
  learningService
} from './learningService'

// 直接使用常量定义是否使用模拟数据（开发环境下默认使用模拟数据）
const useMockData = true

// 创建API实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // 在实际部署时会替换为真实API地址
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// =================== 知识点API ===================
export const knowledgeApi = {
  // 获取所有知识点
  async getAllKnowledgePoints(): Promise<KnowledgePoint[]> {
    if (useMockData) {
      // 使用模拟数据
      return learningService.getKnowledgeTree()
    } else {
      // 使用真实API
      const response = await api.get<KnowledgePoint[]>('/knowledge-points')
      return response.data
    }
  },

  // 获取所有展平的知识点
  async getFlattenedKnowledgePoints(): Promise<KnowledgePoint[]> {
    if (useMockData) {
      // 使用模拟数据
      const tree = await learningService.getKnowledgeTree()
      // 手动展平树结构
      const flattened: KnowledgePoint[] = []
      
      function flattenTree(points: KnowledgePoint[]) {
        for (const point of points) {
          const { children, ...pointWithoutChildren } = point
          flattened.push(pointWithoutChildren as KnowledgePoint)
          
          if (children && children.length > 0) {
            flattenTree(children)
          }
        }
      }
      
      flattenTree(tree)
      return flattened
    } else {
      // 使用真实API
      const response = await api.get<KnowledgePoint[]>('/knowledge-points/flattened')
      return response.data
    }
  },

  // 获取知识点详情
  async getKnowledgePoint(id: string): Promise<KnowledgePoint | null> {
    if (useMockData) {
      // 使用模拟数据
      try {
        const detail = await learningService.getKnowledgePointDetail(id)
        return detail
      } catch (error) {
        return null
      }
    } else {
      // 使用真实API
      try {
        const response = await api.get<KnowledgePoint>(`/knowledge-points/${id}`)
        return response.data
      } catch (error) {
        return null
      }
    }
  },

  // 获取相关知识点
  async getRelatedKnowledgePoints(id: string): Promise<KnowledgePoint[]> {
    if (useMockData) {
      // 使用模拟数据
      try {
        const detail = await learningService.getKnowledgePointDetail(id)
        if (!detail.relatedPoints || detail.relatedPoints.length === 0) {
          return []
        }
        
        const flattened = await this.getFlattenedKnowledgePoints()
        return flattened.filter(point => 
          detail.relatedPoints.some(related => related.id === point.id)
        )
      } catch (error) {
        return []
      }
    } else {
      // 使用真实API
      const response = await api.get<KnowledgePoint[]>(`/knowledge-points/${id}/related`)
      return response.data
    }
  },

  // 搜索知识点
  async searchKnowledgePoints(query: string): Promise<KnowledgePoint[]> {
    if (useMockData) {
      // 使用模拟数据
      if (!query.trim()) {
        return []
      }
      
      const flattened = await this.getFlattenedKnowledgePoints()
      return flattened.filter(point => 
        point.label.toLowerCase().includes(query.toLowerCase()) ||
        point.content.toLowerCase().includes(query.toLowerCase())
      )
    } else {
      // 使用真实API
      const response = await api.get<KnowledgePoint[]>('/knowledge-points/search', {
        params: { query }
      })
      return response.data
    }
  }
}

// =================== 问答系统API ===================
interface QAResponse {
  answer: string
  conversationId?: string
  suggestedQuestions?: string[]
  sourceReferences?: {
    title: string
    content: string
    source: string
    relevance: number
  }[]
}

export const qaApi = {
  // 发送问题获取回答
  async askQuestion(params: {
    question: string
    knowledgePointId?: string
    conversationId?: string
    useRAG?: boolean // 是否使用知识库增强
  }): Promise<QAResponse> {
    if (useMockData) {
      // 模拟数据 - 随机选择一个回答
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
      
      const mockAnswers = [
        '<p>这个知识点是领域知识库中的核心概念之一。它主要涉及到信息提取、知识组织和检索技术的结合应用。</p><p>从理论上讲，它基于语义网络和知识图谱技术，通过对领域知识的结构化表示，实现高效的知识检索和推理。</p>',
        '<p>在实际应用中，这个知识点通常与机器学习和自然语言处理技术相结合，用于构建智能问答系统、推荐系统或决策支持系统。</p><p>它的主要优势在于能够处理复杂的领域知识，并将这些知识转化为机器可理解的形式。</p>',
        '<p>这个知识点的难点主要在于如何确保知识的准确性和完整性，以及如何处理知识之间的复杂关系。</p><p>解决这些问题通常需要结合专家知识和自动化技术，建立严格的知识验证和更新机制。</p>'
      ]
      
      // 处理上下文对话 - 保持同一个会话ID
      const conversationId = params.conversationId || 'mock-conversation-' + Date.now()
      
      // 根据是否有上下文生成不同的回复
      let answer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)]
      if (params.conversationId) {
        // 如果是上下文对话，添加一些上下文相关的语句
        answer = `<p>基于我们之前的讨论，${answer.substring(3)}`
      }
      
      // 模拟知识库来源引用
      const sourceReferences = params.useRAG ? [
        {
          title: '领域知识结构化表示',
          content: '领域知识的结构化表示是知识图谱的核心，通过实体-关系-实体的三元组形式进行存储...',
          source: '知识工程手册 第三章',
          relevance: 0.92
        },
        {
          title: '知识检索技术',
          content: '现代知识检索技术结合了关键词匹配和语义理解，能够更准确地找到用户需要的信息...',
          source: '信息检索原理 第五章',
          relevance: 0.85
        }
      ] : undefined
      
      return {
        answer,
        conversationId,
        suggestedQuestions: [
          '这个知识点与哪些领域相关？',
          '如何在实际工作中应用这个知识？',
          '这个知识点的难点是什么？',
          '掌握这个知识点需要哪些前置知识？',
          '这个知识点有哪些实际应用案例？'
        ],
        sourceReferences
      }
    } else {
      // 使用真实API
      const response = await api.post<QAResponse>('/qa/ask', params)
      return response.data
    }
  },

  // 获取建议问题
  async getSuggestedQuestions(knowledgePointId: string): Promise<string[]> {
    if (useMockData) {
      // 模拟数据
      return Promise.resolve([
        '这个知识点与哪些领域相关？',
        '如何在实际工作中应用这个知识？',
        '这个知识点的难点是什么？',
        '学习这个知识点的前置条件是什么？',
        '这个知识点的应用案例有哪些？',
        '这个知识点与其他知识点有什么联系？',
        '掌握这个知识点需要注意哪些误区？'
      ])
    } else {
      // 使用真实API
      const response = await api.get<string[]>(`/qa/suggested-questions/${knowledgePointId}`)
      return response.data
    }
  },
  
  // 结束对话
  async endConversation(conversationId: string): Promise<{ success: boolean }> {
    if (useMockData) {
      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 300))
      return Promise.resolve({ success: true })
    } else {
      // 使用真实API
      const response = await api.post<{ success: boolean }>('/qa/end-conversation', { conversationId })
      return response.data
    }
  },
  
  // 获取知识库引用来源
  async getSourceReferences(params: {
    question: string,
    knowledgePointId?: string
  }): Promise<{
    title: string
    content: string
    source: string
    relevance: number
  }[]> {
    if (useMockData) {
      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 700))
      return [
        {
          title: '领域知识结构化表示',
          content: '领域知识的结构化表示是知识图谱的核心，通过实体-关系-实体的三元组形式进行存储...',
          source: '知识工程手册 第三章',
          relevance: 0.92
        },
        {
          title: '知识检索技术',
          content: '现代知识检索技术结合了关键词匹配和语义理解，能够更准确地找到用户需要的信息...',
          source: '信息检索原理 第五章',
          relevance: 0.85
        },
        {
          title: 'RAG系统工作原理',
          content: 'RAG系统通过检索增强生成，结合了大型语言模型的生成能力和知识库的专业准确性...',
          source: '人工智能应用指南 第九章',
          relevance: 0.78
        }
      ]
    } else {
      // 使用真实API
      const response = await api.get<any[]>('/qa/source-references', { params })
      return response.data
    }
  }
}

// =================== 用户API ===================
export const userApi = {
  // 收藏知识点
  async bookmarkKnowledgePoint(knowledgePointId: string): Promise<{ success: boolean }> {
    if (useMockData) {
      // 模拟数据
      return Promise.resolve({ success: true })
    } else {
      // 使用真实API
      const response = await api.post<{ success: boolean }>('/user/bookmarks', { knowledgePointId })
      return response.data
    }
  },

  // 获取学习记录
  async getLearningHistory(): Promise<any[]> {
    if (useMockData) {
      // 模拟数据
      return Promise.resolve([
        { 
          id: 1, 
          knowledgePointId: 'k1',
          knowledgePointTitle: '领域知识库概述',
          timestamp: new Date().toISOString(),
          duration: 300 // 秒
        },
        { 
          id: 2, 
          knowledgePointId: 'k2',
          knowledgePointTitle: 'LLM-RAG系统介绍',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 昨天
          duration: 450 // 秒
        }
      ])
    } else {
      // 使用真实API
      const response = await api.get<any[]>('/user/learning-history')
      return response.data
    }
  }
} 