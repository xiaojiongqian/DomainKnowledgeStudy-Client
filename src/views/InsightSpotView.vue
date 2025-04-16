<template>
  <main class="main-content">
    <h1 class="content-title">Knowledge Insight Spot</h1>
    
    <!-- 配置面板 -->
    <div class="config-panel elevation-1">
      <div class="config-row">
        <div class="config-item">
          <span class="config-label body-medium">Knowledge spots total:</span>
          <select v-model="knowledgeSpotsTotal" class="config-select">
            <option value="auto">Auto</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        
        <div class="config-item">
          <span class="config-label body-medium">Questions per spot:</span>
          <select v-model="questionsPerSpot" class="config-select">
            <option value="auto">Auto</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
      
      <div class="config-actions">
        <button @click="generateSpots" class="config-btn generate-btn">
          Gen Knowledge Spots
        </button>
        <button @click="applyConfig" class="config-btn apply-btn">
          Apply
        </button>
      </div>
    </div>
    
    <div v-if="activeSpot">
      <!-- 内容标题 -->
      <h1 class="content-title">{{ activeSpot.title }}</h1>
      
      <!-- 主要内容展示区 -->
      <div class="knowledge-content-wrapper elevation-1">
        <div class="knowledge-text body-large" v-html="activeSpot.content"></div>
      </div>
      
      <!-- 问答表格 -->
      <div class="qa-table-wrapper elevation-1">
        <table class="qa-table">
          <thead>
            <tr>
              <th>问题</th>
              <th>答案</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(qa, index) in activeSpot.qaList" :key="index">
              <td class="question-cell">{{ qa.question }}</td>
              <td class="answer-cell">{{ qa.answer }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- AI 问答交互区 -->
      <div class="qa-interaction-area">
        <!-- 提示性问题按钮区 -->
        <div class="suggested-questions">
          <button
            v-for="(question, index) in suggestedQuestions"
            :key="index"
            class="question-pill"
            @click="askQuestion(question)"
          >
            {{ question }}
          </button>
        </div>
        
        <!-- 用户输入框 -->
        <div class="input-area">
          <input
            v-model="userQuestion"
            placeholder="输入您的问题..."
            class="question-input"
            @keyup.enter="submitQuestion"
          />
          <button @click="submitQuestion" class="submit-btn">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 没有选择知识点时显示的内容 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>请从左侧选择一个洞察点开始学习</h3>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router';

// 问答数据结构
interface QAItem {
  question: string;
  answer: string;
}

// 洞察点数据结构
interface InsightSpot {
  id: string;
  title: string;
  content: string;
  qaList: QAItem[];
}

// 配置数据
const knowledgeSpotsTotal = ref<number | 'auto'>('auto')
const questionsPerSpot = ref<number | 'auto'>('auto')

// 用户提问数据
const userQuestion = ref('');
const suggestedQuestions = ref<string[]>([]);

// Mock 数据存储
const allInsightSpots: Record<string, InsightSpot> = {
  'spot-1': {
    id: 'spot-1',
    title: 'Git 基本概念',
    content: `
      <p>Git 是一个开源的分布式版本控制系统 (Distributed Version Control System, DVCS)，由 Linus Torvalds 于 2005 年创建，最初用于管理 Linux 内核的开发。它的设计目标是高效、快速且可靠地处理代码版本控制，支持从小型个人项目到大型分布式团队协作，与传统的集中式版本控制系统（如 Subversion 或 CVS）不同，Git 的独特特性使其在灵活性、可离线操作和协作能力方面具有显著优势。</p>
      <h3>分布式版本控制的核心</h3>
      <p>Git 的"分布式"特性意味着每个开发者在本地都拥有一个完整的仓库副本，包括项目的全部历史记录和文件版本。这种设计有以下几个关键点：</p>
      <ul>
        <li><strong>独立性：</strong> 开发者可以在没有网络连接的情况下工作，执行提交、查看历史或创建分支等操作。</li>
        <li><strong>同步性：</strong> 当需要协作时，开发者可以通过推送（push）或拉取（pull）与远程仓库同步更改。</li>
        <li><strong>冗余性：</strong> 由于每个本地仓库都是完整的副本，即使远程服务器发生故障，数据也不会丢失，可以从任何开发者的本地仓库恢复。</li>
      </ul>
    `,
    qaList: [
      { question: 'git add 的作用是什么?', answer: '用于将工作目录中的文件更改添加到暂存区（Staging Area），这是Git的一个中间区域，用于准备文件以便提交。' },
      { question: '什么是 Git 中的暂存区（Staging Area）？', answer: '暂存区是 Git 的一个中间区域，用于存储将要包含在下一次提交中的更改。它允许开发者选择哪些更改包含在下一次提交中。' },
      { question: '如何将工作目录中的所有更改都添加到暂存区?', answer: '使用 git add . 命令，可以将当前目录及其所有更改添加到暂存区。' },
      { question: '能否只添加特定文件到暂存区?', answer: '是的，可以使用 git add <file1> <file2> ... 来指定要添加到暂存区的特定文件。' }
    ]
  },
  'spot-2': {
    id: 'spot-2',
    title: '分布式版本控制',
    content: `
      <p>分布式版本控制系统（DVCS）是Git的核心特性，与传统集中式版本控制系统相比，具有显著优势。在分布式模型中，每个开发者都拥有完整的代码仓库副本，包括完整的提交历史。</p>
      <h3>分布式模型的优势</h3>
      <p>与集中式系统（如SVN）相比，分布式版本控制提供以下关键优势：</p>
      <ul>
        <li><strong>离线工作：</strong> 开发者可以在完全没有网络连接的情况下执行几乎所有操作，包括提交、分支、查看历史等。</li>
        <li><strong>数据安全：</strong> 由于每个副本都是完整的仓库，系统具有内在的备份机制——任何克隆都可以作为备份恢复源。</li>
        <li><strong>工作流灵活性：</strong> 支持多种协作模式，从集中式工作流到完全分布式的贡献模型。</li>
        <li><strong>更快的操作：</strong> 大多数操作都是本地执行的，无需与服务器通信，这使得操作速度通常更快。</li>
      </ul>
    `,
    qaList: [
      { question: '分布式版本控制与集中式版本控制的主要区别是什么？', answer: '分布式系统中每个开发者拥有完整的仓库副本，而集中式系统中只有中央服务器有完整副本，开发者仅获取正在工作的文件。这使得分布式系统能够在无网络状态下工作，具有更好的容错性和灵活性。' },
      { question: 'Git如何实现多人协作？', answer: 'Git通过远程仓库实现协作。每个开发者从远程仓库克隆或拉取(pull)代码，在本地工作后再推送(push)回远程仓库。当出现冲突时，Git提供合并工具来解决。' },
      { question: '为什么说Git比SVN更安全？', answer: '由于Git中每个克隆都包含完整历史，即使中央服务器完全损坏，任何开发者的本地仓库都可以重建中央仓库。而在SVN中，如果中央服务器崩溃，将丢失未备份的历史和数据。' }
    ]
  },
  'spot-3': {
    id: 'spot-3',
    title: '工作区',
    content: `
      <p>在Git中，工作区（Working Directory）是项目文件的实际目录，也是你实际编辑和修改文件的地方。理解工作区在Git工作流中的位置和角色，对于有效使用Git至关重要。</p>
      <h3>工作区的特点</h3>
      <ul>
        <li><strong>可见性：</strong> 工作区中的文件直接可见和可编辑，这是你与代码交互的主要场所。</li>
        <li><strong>未跟踪状态：</strong> 对工作区文件的修改默认是未跟踪的，Git不会自动记录这些修改。</li>
        <li><strong>临时性：</strong> 工作区的修改在提交到仓库前是临时的，可以随时撤销。</li>
      </ul>
      <h3>工作区操作</h3>
      <p>常见的工作区操作包括：</p>
      <ul>
        <li><strong>检查状态：</strong> 使用<code>git status</code>查看哪些文件被修改但未暂存。</li>
        <li><strong>添加文件：</strong> 使用<code>git add</code>将工作区的修改添加到暂存区。</li>
        <li><strong>丢弃修改：</strong> 使用<code>git checkout -- [file]</code>撤销工作区的修改。</li>
        <li><strong>查看差异：</strong> 使用<code>git diff</code>查看工作区与暂存区之间的差异。</li>
      </ul>
    `,
    qaList: [
      { question: '如何查看工作区有哪些修改？', answer: '使用 git status 命令可以查看工作区的状态，它会显示已修改但未暂存的文件，以及未跟踪的新文件。' },
      { question: '如何撤销工作区的修改？', answer: '使用 git checkout -- [file] 或 git restore [file]（Git 2.23及以上版本）可以恢复工作区文件到上次提交的状态。' },
      { question: '工作区的文件被误删了如何恢复？', answer: '如果文件已被Git跟踪，可以使用 git checkout -- [deleted_file] 恢复；如果文件未被跟踪，则无法通过Git恢复。' }
    ]
  },
  'spot-4': {
    id: 'spot-4',
    title: '暂存区',
    content: `
      <p>暂存区（Staging Area 或 Index）是Git三区模型中的中间环节，位于工作区和本地仓库之间。它作为一个准备区域，让开发者可以精确控制哪些修改将包含在下一次提交中。</p>
      <h3>暂存区的重要性</h3>
      <ul>
        <li><strong>选择性提交：</strong> 允许开发者从一组修改中选择特定更改进行提交，而不是提交所有更改。</li>
        <li><strong>提交前预览：</strong> 提供了对即将提交内容的最终检查机会。</li>
        <li><strong>组织逻辑提交：</strong> 帮助开发者创建逻辑上独立、符合主题的提交，而不是大量混合的更改。</li>
      </ul>
      <h3>暂存区操作</h3>
      <p>关键的暂存区操作包括：</p>
      <ul>
        <li><strong>添加修改：</strong> 使用<code>git add</code>将文件的更改添加到暂存区。</li>
        <li><strong>查看差异：</strong> 使用<code>git diff --staged</code>查看暂存区与上次提交之间的差异。</li>
        <li><strong>移除文件：</strong> 使用<code>git rm</code>同时从工作区和暂存区删除文件。</li>
        <li><strong>取消暂存：</strong> 使用<code>git reset HEAD [file]</code>将已暂存的文件取消暂存。</li>
      </ul>
    `,
    qaList: [
      { question: '如何查看暂存区中的内容？', answer: '使用 git diff --staged 或 git diff --cached 命令可以查看暂存区中的更改（与最近一次提交相比）。' },
      { question: '如何取消已暂存的文件？', answer: '使用 git reset HEAD [file] 或 git restore --staged [file]（Git 2.23及以上版本）可以将文件从暂存区移回工作区。' },
      { question: '可以只暂存文件的部分更改吗？', answer: '是的，使用 git add -p 命令可以交互式地选择要暂存的特定代码块（hunks）。' }
    ]
  }
};

const route = useRoute();
const activeSpotId = ref<string | null>(null);

// 当前激活的洞察点对象
const activeSpot = computed<InsightSpot | undefined>(() => {
  return activeSpotId.value ? allInsightSpots[activeSpotId.value] : undefined;
});

// 加载对应知识点的建议问题
const loadSuggestedQuestions = (spotId: string | null) => {
  if (!spotId) {
    suggestedQuestions.value = [];
    return;
  }
  
  const spot = allInsightSpots[spotId];
  if (!spot) {
    suggestedQuestions.value = [];
    return;
  }
  
  // 根据当前知识点加载建议问题
  if (spotId === 'spot-1') {
    suggestedQuestions.value = [
      'Git的核心概念介绍一下？',
      '什么叫工作区？和远程托管仓库有什么关系？',
      'Git本地仓库和远程仓库是什么意思？'
    ];
  } else if (spotId === 'spot-2') {
    suggestedQuestions.value = [
      '分布式版本控制有什么好处？',
      'Git如何实现分布式？',
      '本地仓库和远程仓库如何同步？'
    ];
  } else {
    suggestedQuestions.value = [
      `关于${spot.title}有哪些常见问题？`,
      `如何应用${spot.title}解决实际问题？`
    ];
  }
};

// 监听路由参数变化来加载对应的知识点数据
watch(() => route.params.spotId, (newSpotId) => {
  const id = Array.isArray(newSpotId) ? newSpotId[0] : newSpotId;
  activeSpotId.value = id || null;
  if (id) {
    loadSuggestedQuestions(id);
  } else {
    loadSuggestedQuestions(null);
  }
}, { immediate: true });

// 提交问题
const submitQuestion = () => {
  if (!userQuestion.value.trim() || !activeSpotId.value) return;
  alert(`提交问题 (${activeSpotId.value}): ${userQuestion.value}`);
  userQuestion.value = '';
};

// 预设问题直接提问
const askQuestion = (question: string) => {
  userQuestion.value = question;
  // 可选：自动提交问题
  // submitQuestion();
};

// 生成知识点
const generateSpots = async () => {
  alert('正在生成知识点...');
};

// 应用配置
const applyConfig = () => {
  alert('配置已应用');
};

onMounted(() => {
  // 初始化逻辑
});
</script>

<style scoped>
/* 主内容区 */
.main-content {
  height: 100%;
  overflow-y: auto; 
  padding: 32px; 
  display: flex;
  flex-direction: column;
}

.content-title {
  font-size: 24px; 
  line-height: 32px;
  margin-bottom: 24px;
  font-weight: 500;
  color: var(--on-surface, #1C1B1F);
  flex-shrink: 0;
}

/* 配置面板 */
.config-panel {
  background-color: var(--surface-variant, #E7E0EC);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-label {
  font-size: 14px;
  color: var(--on-surface-variant, #49454F);
}

.config-select {
  height: 40px;
  padding: 0 12px;
  border-radius: 20px;
  border: 1px solid var(--outline, #79747E);
  background-color: var(--surface-color, #FFFBFE);
  font-size: 14px;
  color: var(--on-surface, #1C1B1F);
  min-width: 80px;
}

.config-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.config-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.generate-btn {
  background-color: var(--primary, #6750A4);
  color: var(--on-primary, #FFFFFF);
}

.generate-btn:hover {
  background-color: #5641a5;
}

.apply-btn {
  background-color: transparent;
  color: var(--primary, #6750A4);
  border: 1px solid var(--outline, #79747E);
}

.apply-btn:hover {
  background-color: rgba(103, 80, 164, 0.08);
}

/* 知识内容区域 */
.knowledge-content-wrapper {
  background-color: var(--surface-color, #FFFBFE);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px; 
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); 
  flex-shrink: 0;
}

.knowledge-text {
  color: var(--on-surface, #1C1B1F);
  font-size: 16px; 
  line-height: 1.6; 
}

.knowledge-text h3 {
  font-size: 18px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--on-surface, #1C1B1F);
}

.knowledge-text p {
  margin-bottom: 16px;
}

.knowledge-text ul {
  padding-left: 24px;
  margin-bottom: 16px;
}

.knowledge-text li {
  margin-bottom: 8px;
}

/* 问答表格 */
.qa-table-wrapper {
  background-color: var(--surface-color, #FFFBFE);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.qa-table {
  width: 100%;
  border-collapse: collapse;
}

.qa-table th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--outline-variant, #E0E0E0);
  color: var(--on-surface-variant, #49454F);
  font-weight: 500;
}

.qa-table td {
  padding: 16px;
  border-bottom: 1px solid var(--outline-variant, #E0E0E0);
  vertical-align: top;
}

.question-cell {
  font-weight: 500;
  color: var(--on-surface, #1C1B1F);
  width: 40%;
}

.answer-cell {
  color: var(--on-surface-variant, #49454F);
}

/* AI 问答交互区 */
.qa-interaction-area {
  margin-top: auto;
  padding-top: 24px;
  flex-shrink: 0;
}

/* 建议问题按钮 */
.suggested-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; 
  margin-bottom: 24px;
}

.question-pill {
  background-color: var(--surface-variant, #E7E0EC);
  color: var(--on-surface-variant, #49454F);
  padding: 8px 16px;
  border-radius: 20px; 
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.question-pill:hover {
  background-color: rgba(0, 0, 0, 0.08); 
}

/* 输入区域 */
.input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--surface-variant, #E7E0EC); 
  border-radius: 28px; 
  padding: 4px 4px 4px 20px; 
}

.question-input {
  flex: 1;
  border: none;
  background-color: transparent;
  padding: 12px 0; 
  font-size: 16px;
  color: var(--on-surface, #1C1B1F);
}

.question-input:focus {
  outline: none;
}

.submit-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%; 
  background-color: var(--primary, #6750A4);
  color: var(--on-primary, white);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.submit-btn:hover {
  background-color: #5641a5; 
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--on-surface-variant, #49454F);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

/* 辅助类 */
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .content-area {
    flex-direction: column;
  }
}
</style> 