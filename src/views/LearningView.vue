<template>
  <div class="learning-container">
    <!-- 聊天内容区域 - 占据整个页面 -->
    <div class="full-content">
      <KnowledgeContent
        :knowledgePoint="selectedPoint"
        :allPoints="knowledgePoints"
        @select="handlePointSelect"
        class="direct-content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KnowledgeContent from '@/components/learning/KnowledgeContent.vue'

// 知识点数据类型
interface KnowledgePoint {
  id: string
  label: string
  children?: KnowledgePoint[]
  content?: string
  relatedIds?: string[]
}

// 模拟知识点数据
const knowledgePoints = ref<KnowledgePoint[]>([])
const selectedPoint = ref<KnowledgePoint | null>(null)

// 处理知识点选择
function handlePointSelect(point: KnowledgePoint) {
  selectedPoint.value = point
}

// 加载知识点数据
async function loadKnowledgePoints() {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟知识点数据
  knowledgePoints.value = [
    {
      id: '1',
      label: '机器学习基础',
      children: [
        {
          id: '1-1',
          label: '监督学习',
          content: `<p>监督学习是机器学习的一种方法，它使用标记的训练数据来学习输入到输出的映射函数。</p>
          <p>在监督学习中，每个训练示例都由一个输入对象（通常是向量）和一个所需的输出值（也称为监督信号）组成。监督学习算法通过分析训练数据生成一个推断函数，该函数可用于映射新的示例。</p>
          <p>常见的监督学习算法包括：线性回归、逻辑回归、决策树、随机森林、支持向量机、朴素贝叶斯和神经网络等。</p>`,
          relatedIds: ['1-2', '1-3']
        },
        {
          id: '1-2',
          label: '无监督学习',
          content: `<p>无监督学习是机器学习的一种方法，它使用未标记的数据，并尝试从中找出隐藏的结构或模式。</p>
          <p>在无监督学习中，系统尝试学习如何表示输入数据的模式，以便发现数据中的规律、相似性或差异。由于训练数据是未标记的，因此没有错误或奖励信号可以评估潜在解决方案的质量。</p>
          <p>常见的无监督学习算法包括：聚类分析（如K-均值聚类）、关联规则学习、降维技术（如主成分分析）以及深度学习中的某些自编码器等。</p>`,
          relatedIds: ['1-1', '1-3']
        },
        {
          id: '1-3',
          label: '强化学习',
          content: `<p>强化学习是一种机器学习方法，它通过与环境的交互来学习如何采取行动以最大化累积奖励。</p>
          <p>在强化学习中，智能体通过尝试和错误来学习最佳策略，而不是被明确地告知采取什么行动。智能体通过探索环境并获得正面或负面的反馈来学习。</p>
          <p>常见的强化学习算法包括：Q-learning、策略梯度方法和深度强化学习等。</p>`,
          relatedIds: ['1-1', '1-2']
        }
      ]
    },
    {
      id: '2',
      label: '深度学习',
      children: [
        {
          id: '2-1',
          label: '神经网络基础',
          content: `<p>神经网络是一种受人脑结构和功能启发的计算模型，由大量相互连接的节点（或"神经元"）组成。</p>
          <p>基本的神经网络包含输入层、隐藏层和输出层。每个神经元接收多个输入，对它们应用权重，并通过激活函数生成输出。通过反向传播算法，网络可以学习调整权重以最小化预测错误。</p>
          <p>神经网络的强大之处在于它能够学习非线性关系，并在图像识别、自然语言处理等复杂任务中表现出色。</p>`,
          relatedIds: ['2-2', '2-3']
        },
        {
          id: '2-2',
          label: '卷积神经网络',
          content: `<p>卷积神经网络(CNN)是一种专门设计用于处理像素数据（如图像）的深度神经网络。</p>
          <p>CNN的主要特点是使用卷积层，它通过应用滤波器（卷积核）来提取图像的空间特征，如边缘、纹理等。CNN还通常包含池化层（用于减少空间维度）和全连接层（用于最终分类）。</p>
          <p>卷积神经网络在图像分类、目标检测、人脸识别等计算机视觉任务中取得了突破性的成果。</p>`,
          relatedIds: ['2-1', '2-3']
        },
        {
          id: '2-3',
          label: '循环神经网络',
          content: `<p>循环神经网络(RNN)是一种专门处理序列数据的神经网络，它能够捕捉数据中的时间依赖关系。</p>
          <p>不同于传统前馈神经网络，RNN具有内部状态（记忆），使其能够记住之前输入的信息。然而，简单RNN存在长期依赖问题，为此发展出了LSTM（长短期记忆）和GRU（门控循环单元）等变体。</p>
          <p>RNN在自然语言处理、语音识别、时间序列预测等任务中有广泛应用。</p>`,
          relatedIds: ['2-1', '2-2']
        }
      ]
    }
  ]
  
  // 初始化显示第一个知识点的内容
  if (knowledgePoints.value.length > 0 && knowledgePoints.value[0].children?.length > 0) {
    selectedPoint.value = knowledgePoints.value[0].children[0];
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadKnowledgePoints()
})
</script>

<style>
/* 全局样式调整 */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* 禁用Element Plus默认的主题颜色 */
:root {
  --el-color-primary: transparent !important;
}
</style>

<style scoped>
.learning-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: white;
}

/* 内容区域占据整个页面 */
.full-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 直接内容区样式 */
.direct-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style> 