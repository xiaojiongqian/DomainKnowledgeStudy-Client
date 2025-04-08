import axios from 'axios'

// 是否使用模拟数据
const useMockData = true

// 知识点类型定义
export interface KnowledgePoint {
  id: string
  label: string
  content: string
  parentId?: string
  children?: KnowledgePoint[]
  level: number
  order: number
  isLeaf: boolean
}

// 知识点详情类型定义
export interface KnowledgePointDetail extends KnowledgePoint {
  overview: string
  content: string
  examples: string[]
  relatedPoints: {
    id: string
    label: string
  }[]
  lastUpdated: string
}

// 知识库学习模块服务
export const learningService = {
  /**
   * 获取知识点树
   * @returns 知识点树结构
   */
  async getKnowledgeTree(): Promise<KnowledgePoint[]> {
    if (useMockData) {
      // 返回模拟数据
      await new Promise(resolve => setTimeout(resolve, 500))
      return [
        {
          id: 'k1',
          label: '基础概念',
          content: '领域知识基本概念介绍',
          level: 0,
          order: 1,
          isLeaf: false,
          children: [
            {
              id: 'k1-1',
              label: '什么是领域知识',
              content: '领域知识定义与范围',
              parentId: 'k1',
              level: 1,
              order: 1,
              isLeaf: true
            },
            {
              id: 'k1-2',
              label: '领域知识特点',
              content: '领域知识的主要特征与表现形式',
              parentId: 'k1',
              level: 1,
              order: 2,
              isLeaf: true
            }
          ]
        },
        {
          id: 'k2',
          label: '知识表示方法',
          content: '领域知识的表示与组织方法',
          level: 0,
          order: 2,
          isLeaf: false,
          children: [
            {
              id: 'k2-1',
              label: '知识图谱',
              content: '知识图谱构建与应用',
              parentId: 'k2',
              level: 1,
              order: 1,
              isLeaf: true
            },
            {
              id: 'k2-2',
              label: '本体模型',
              content: '领域本体理论与实践',
              parentId: 'k2',
              level: 1,
              order: 2,
              isLeaf: true
            }
          ]
        },
        {
          id: 'k3',
          label: '知识获取技术',
          content: '领域知识提取与获取方法',
          level: 0,
          order: 3,
          isLeaf: false,
          children: [
            {
              id: 'k3-1',
              label: '自动文本分析',
              content: '基于NLP的知识提取',
              parentId: 'k3',
              level: 1,
              order: 1,
              isLeaf: true
            },
            {
              id: 'k3-2',
              label: '专家知识获取',
              content: '从专家经验中提取结构化知识',
              parentId: 'k3',
              level: 1,
              order: 2,
              isLeaf: true
            }
          ]
        }
      ]
    } else {
      const response = await axios.get<KnowledgePoint[]>('/api/knowledge/tree')
      return response.data
    }
  },

  /**
   * 获取知识点详情
   * @param id 知识点ID
   * @returns 知识点详细信息
   */
  async getKnowledgePointDetail(id: string): Promise<KnowledgePointDetail> {
    if (useMockData) {
      // 返回模拟数据
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 根据不同ID返回不同模拟数据
      const mockDetails: Record<string, KnowledgePointDetail> = {
        'k1-1': {
          id: 'k1-1',
          label: '什么是领域知识',
          overview: '领域知识是指特定专业领域内的专业知识与经验的集合，它是构建智能系统的重要基础。',
          content: `<h3>领域知识的定义</h3>
          <p>领域知识（Domain Knowledge）是指在特定专业或应用领域中，经过长期实践和理论研究积累形成的专业知识体系。它包括该领域的概念、原理、方法、规则、约束条件以及专家经验等。</p>
          
          <h3>领域知识的特点</h3>
          <p>领域知识具有以下特点：</p>
          <ul>
            <li><strong>专业性</strong>：需要相关领域的教育和实践经验才能掌握</li>
            <li><strong>结构化</strong>：具有内在的概念关系和组织结构</li>
            <li><strong>经验性</strong>：部分知识来自于实践经验，难以从教科书中获取</li>
            <li><strong>动态性</strong>：随着领域发展不断更新和扩展</li>
          </ul>
          
          <h3>领域知识在人工智能中的应用</h3>
          <p>在人工智能系统中，领域知识用于指导推理、决策和问题解决。相比于通用知识，领域知识能够使AI系统在特定领域内做出更专业、更准确的判断。</p>`,
          examples: [
            '医疗领域知识包括疾病诊断标准、治疗方案和药物相互作用等专业信息',
            '金融领域知识包括投资策略、风险评估模型和市场预测方法等'
          ],
          relatedPoints: [
            { id: 'k1-2', label: '领域知识特点' },
            { id: 'k2-1', label: '知识图谱' }
          ],
          lastUpdated: '2023-09-15',
          level: 1,
          order: 1,
          isLeaf: true,
          parentId: 'k1'
        },
        
        'k2-1': {
          id: 'k2-1',
          label: '知识图谱',
          overview: '知识图谱是一种结构化的知识表示方法，通过图形化方式展现实体之间的语义关系，是领域知识表示的重要工具。',
          content: `<h3>知识图谱概述</h3>
          <p>知识图谱（Knowledge Graph）是一种语义网络，它以图形化的方式表示知识。在知识图谱中，节点代表实体（Entity），边代表实体之间的关系（Relation）。通过"实体-关系-实体"的三元组结构，知识图谱可以表示复杂的领域知识。</p>
          
          <h3>知识图谱的构建流程</h3>
          <p>构建知识图谱通常包括以下步骤：</p>
          <ol>
            <li><strong>知识获取</strong>：从文本、数据库、网页等来源提取信息</li>
            <li><strong>实体识别</strong>：识别文本中的实体，并进行分类</li>
            <li><strong>关系抽取</strong>：识别实体间的语义关系</li>
            <li><strong>知识融合</strong>：合并重复信息，解决冲突</li>
            <li><strong>知识存储</strong>：将知识图谱存储到图数据库中</li>
          </ol>
          
          <h3>知识图谱在领域知识应用中的优势</h3>
          <p>知识图谱在领域知识表示中具有以下优势：</p>
          <ul>
            <li>能够直观表示复杂的关系网络</li>
            <li>支持基于图的高效查询和推理</li>
            <li>易于扩展和更新</li>
            <li>可以与深度学习技术结合，提升AI系统性能</li>
          </ul>`,
          examples: [
            'Google知识图谱用于增强搜索引擎结果，提供更直接的答案',
            '医疗知识图谱可用于辅助诊断系统，连接症状、疾病、治疗方案等信息'
          ],
          relatedPoints: [
            { id: 'k2-2', label: '本体模型' },
            { id: 'k3-1', label: '自动文本分析' }
          ],
          lastUpdated: '2023-10-05',
          level: 1,
          order: 1,
          isLeaf: true,
          parentId: 'k2'
        }
      }
      
      // 如果没有对应ID的数据，返回默认数据
      return mockDetails[id] || {
        id,
        label: '知识点详情',
        overview: '这是一个示例知识点概述，描述该知识点的主要内容和意义。',
        content: `<h3>知识点详情</h3><p>这是一个示例知识点内容，包含详细的解释和说明。</p><p>在实际应用中，这里会包含丰富的专业内容，可能包括文字、图表、公式等。</p>`,
        examples: ['示例1: 这是一个应用案例', '示例2: 这是另一个应用案例'],
        relatedPoints: [],
        lastUpdated: new Date().toISOString().split('T')[0],
        level: 1,
        order: 1,
        isLeaf: true
      }
    } else {
      const response = await axios.get<KnowledgePointDetail>(`/api/knowledge/detail/${id}`)
      return response.data
    }
  },

  /**
   * 获取学习进度
   * @param userId 用户ID
   * @returns 学习进度信息
   */
  async getLearningProgress(userId: string): Promise<{
    completedPoints: string[]
    totalPoints: number
    progress: number
  }> {
    if (useMockData) {
      // 返回模拟数据
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        completedPoints: ['k1-1', 'k1-2', 'k2-1'],
        totalPoints: 6,
        progress: 0.5 // 50%
      }
    } else {
      const response = await axios.get(`/api/learning/progress/${userId}`)
      return response.data
    }
  },

  /**
   * 更新知识点学习状态
   * @param params 学习状态参数
   */
  async updateLearningStatus(params: {
    userId: string
    knowledgePointId: string
    completed: boolean
    timeSpent?: number // 学习时间（秒）
  }): Promise<{ success: boolean }> {
    if (useMockData) {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 200))
      return { success: true }
    } else {
      const response = await axios.post('/api/learning/update-status', params)
      return response.data
    }
  },

  /**
   * 获取推荐学习路径
   * @param userId 用户ID
   * @returns 推荐的知识点ID列表
   */
  async getRecommendedPath(userId: string): Promise<string[]> {
    if (useMockData) {
      // 返回模拟数据
      await new Promise(resolve => setTimeout(resolve, 400))
      return ['k1-1', 'k1-2', 'k2-1', 'k2-2', 'k3-1', 'k3-2']
    } else {
      const response = await axios.get<string[]>(`/api/learning/recommended-path/${userId}`)
      return response.data
    }
  }
} 