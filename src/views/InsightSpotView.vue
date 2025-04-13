<template>
  <div class="insight-spot-container">
    <h1 class="page-title">Knowledge Insight Spot</h1>
    
    <div class="config-panel elevation-1">
      <div class="config-row">
        <div class="config-item">
          <span class="config-label">Knowledge spots total:</span>
          <el-select v-model="knowledgeSpotsTotal" placeholder="Auto" class="config-select">
            <el-option
              v-for="item in autoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        
        <div class="config-item">
          <span class="config-label">Questions per spot:</span>
          <el-select v-model="questionsPerSpot" placeholder="Auto" class="config-select">
            <el-option
              v-for="item in autoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      
      <div class="config-row buttons">
        <el-button type="primary" @click="generateSpots" class="generate-btn m3-button filled">Gen Knowledge Spots</el-button>
        <el-button @click="applyConfig" class="apply-btn m3-button outlined">Apply</el-button>
      </div>
    </div>
    
    <div class="spot-input">
      <span class="spot-label">Spot 1:</span>
      <el-input v-model="spotTitle" placeholder="Enter knowledge spot title" class="m3-input outlined" />
    </div>
    
    <error-handler 
      :has-error="hasError" 
      :is-loading="loading" 
      :message="errorMessage"
      loading-text="Generating insights..."
      @retry="generateSpots"
    >
      <div class="content-area">
        <div class="knowledge-content elevation-1">
          <div class="knowledge-text">
            <p class="body-large">Git 是一个开源的分布式版本控制系统（Distributed Version Control System, DVCS），由 Linus Torvalds 于 2005 年创建，最初用于管理 Linux 内核的开发。它的设计目标是高效、快速且可靠地处理代码版本控制，支持从小型个人项目到大型分布式团队协作。与传统的集中式版本控制系统（如 Subversion 或 CVS）不同，Git 的分布式特性使其在灵活性、可离线操作和协作能力上具有显著优势。</p>
            
            <h3 class="title-medium">分布式版本控制的核心</h3>
            <p class="body-medium">Git 的"分布式"特性意味着每个开发者在本地都拥有一个完整的代码库副本（包括完整的历史记录和分支），这与集中式版本控制系统（如 Subversion 或 CVS）不同。Git 允许开发者在没有网络连接的情况下进行代码提交、分支切换和历史查看等操作，只有在需要与团队共享代码时才需要连接到远程仓库。</p>
            
            <ul>
              <li class="body-medium"><strong>独立性：</strong> 开发者可以在没有网络连接的情况下工作，执行提交、查看历史或创建分支等操作。</li>
              <li class="body-medium"><strong>同步性：</strong> 当需要协作时，开发者可以通过推送（push）或拉取（pull）与远程仓库同步更改。</li>
              <li class="body-medium"><strong>完整性：</strong> 由于每个本地仓库都是完整的副本，即使远程服务器发生故障，数据也不会丢失，可以从任何开发者的本地仓库恢复。</li>
            </ul>
          </div>
        </div>
        
        <div class="qa-table-container elevation-1">
          <el-table :data="qaData" stripe style="width: 100%" class="m3-table">
            <el-table-column prop="question" label="问题" min-width="180" />
            <el-table-column prop="answer" label="答案" min-width="250" />
          </el-table>
        </div>
      </div>
      
      <div class="action-panel">
        <div class="suggested-questions">
          <el-tag
            v-for="(question, index) in suggestedQuestions"
            :key="index"
            class="question-tag"
            type="info"
            effect="plain"
          >
            {{ question }}
          </el-tag>
        </div>
      </div>
    </error-handler>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { default as ErrorHandler } from '../components/common/ErrorHandler.vue' // Reverting this attempt
import ErrorHandler from '../components/common/ErrorHandler.vue' // Back to standard import
import { insightSpotApi, type QAItem } from '../services/apiService'

// 配置数据
const knowledgeSpotsTotal = ref('auto')
const questionsPerSpot = ref('auto')
const autoOptions = [
  { value: 'auto', label: 'Auto' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' }
]

// 知识点数据
const spotTitle = ref('Git 基本概念')
const loading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

// 问答数据
const qaData = ref<QAItem[]>([])

// 建议问题
const suggestedQuestions = ref<string[]>([])

// 方法
const generateSpots = async () => {
  loading.value = true
  hasError.value = false
  errorMessage.value = ''
  qaData.value = []
  suggestedQuestions.value = []
  
  try {
    // const spots = await insightSpotApi.generateKnowledgeSpots({
    //   total: knowledgeSpotsTotal.value === 'auto' ? 'auto' : Number(knowledgeSpotsTotal.value),
    //   questionsPerSpot: questionsPerSpot.value === 'auto' ? 'auto' : Number(questionsPerSpot.value)
    // })
    
    // 暂时使用静态数据，不调用API，保证前端界面能正常显示
    const spots = [
      {
        id: '1',
        label: 'Git 基本概念',
        content: `Git 是一个开源的分布式版本控制系统，由 Linus Torvalds 于 2005 年创建，最初用于管理 Linux 内核的开发。`
      }
    ]
    
    if (spots.length > 0) {
      spotTitle.value = spots[0].label
      await loadQuestionsForSpot(spots[0].id)
    } else {
      spotTitle.value = ''
    }
  } catch (error) {
    console.error('生成知识点失败:', error)
    hasError.value = true
    errorMessage.value = '生成知识点失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const applyConfig = () => {
  // 应用配置逻辑
  console.log('Applied configuration')
}

const loadQuestionsForSpot = async (spotId: string) => {
  loading.value = true
  hasError.value = false
  
  try {
    // 获取问答数据 - 暂不调用实际API
    // qaData.value = await insightSpotApi.getKnowledgeQuestions(spotId)
    
    // 使用静态数据
    qaData.value = [
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
    
    // 获取建议问题 - 暂不调用实际API
    // suggestedQuestions.value = await insightSpotApi.getSuggestedQuestions(spotId)
    
    // 使用静态数据
    suggestedQuestions.value = [
      'git add 的基本概念是什么？',
      '如何应用版本控制解决实际问题？',
      '分布式版本控制的最佳实践有哪些？'
    ]
  } catch (error) {
    console.error('加载知识点问答失败:', error)
    hasError.value = true
    errorMessage.value = '加载知识点问答失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 初始化时不自动加载，避免API错误
  // generateSpots()
})
</script>

<style scoped>
.insight-spot-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  line-height: 2.5rem;
  letter-spacing: 0px;
  font-weight: 400;
  color: var(--on-surface-color);
  margin-bottom: 24px;
}

.config-panel {
  background-color: var(--md-sys-color-surface-tint-layer-1);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-row.buttons {
  justify-content: flex-start;
  margin-top: 8px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.1px;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.config-select {
  width: 150px;
}

.generate-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.spot-input {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.spot-label {
  font-size: 1rem;
  line-height: 1.5rem;
  letter-spacing: 0.15px;
  font-weight: 500;
  color: var(--on-surface-color);
  flex-shrink: 0;
}

.m3-input.outlined {
  flex-grow: 1;
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.knowledge-content {
  background-color: var(--surface-color);
  border-radius: 12px;
  padding: 24px;
}

.knowledge-text {
  font-size: 14px;
  line-height: 1.6;
}

.knowledge-text h3 {
  margin: 16px 0 8px;
  font-size: 16px;
}

.knowledge-text p {
  margin-bottom: 12px;
}

.knowledge-text ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

.qa-table-container {
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
}

.m3-table .el-table__header-wrapper th {
  background-color: var(--md-sys-color-surface-tint-layer-1);
  color: var(--on-surface);
  font-size: 0.875rem;
  font-weight: 500;
}

.m3-table .el-table__row td {
  font-size: 1rem;
  color: var(--on-surface);
  padding: 16px 12px;
}

.m3-table .el-table__row--striped td {
  background-color: var(--md-sys-color-surface-tint-layer-1) !important;
}

.action-panel {
  margin-top: 20px;
}

.suggested-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.question-tag {
  cursor: pointer;
  font-size: 13px;
  padding: 8px 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .config-item {
    margin-bottom: 10px;
    min-width: auto;
  }
}
</style> 