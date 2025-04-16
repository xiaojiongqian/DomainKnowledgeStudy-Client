<template>
  <main class="main-content">
    <div v-if="currentPoint">
      <!-- 内容标题 -->
      <h1 class="content-title">{{ currentPoint.title }}</h1>
      
      <!-- 主要内容展示区 -->
      <div class="knowledge-content-wrapper elevation-1">
        <div class="knowledge-text body-large" v-html="currentPoint.content"></div>
        <!-- 如果需要展示图片/视频 -->
        <div v-if="currentPoint.mediaUrl" class="media-container">
           <img :src="currentPoint.mediaUrl" alt="Knowledge Media" class="knowledge-media"/>
        </div>
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
      <h3>请从左侧选择一个知识点开始学习</h3>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'; // Import useRoute

// 定义知识点状态类型
type KnowledgePointStatus = 'learned' | 'active' | 'default';

// 知识点数据结构
interface KnowledgePoint {
  id: string;
  title: string;
  content: string;
  progress: number;
  status?: KnowledgePointStatus;
  mediaUrl?: string;
}

// Mock data - This should ideally come from an API or store based on the route param
const allKnowledgePoints: Record<string, KnowledgePoint> = {
  '1': {
    id: '1',
    title: 'Git 版本控制',
    content: `<p>Git 是一个开源的分布式版本控制系统... </p>`,
    progress: 0,
    status: 'default',
    mediaUrl: 'https://via.placeholder.com/600x300/EADDFF/21005E?text=Git+Concept+Image'
  },
  '2': {
    id: '2',
    title: '分布式',
    content: `<p>Git 的"分布式"特性意味着...</p><ul>...</ul>`,
    progress: 100,
    status: 'learned'
  },
   '3': {
    id: '3',
    title: '工作区',
    content: `<p>在Git中，工作区...</p>`,
    progress: 100,
    status: 'learned'
  },
  '4': {
    id: '4',
    title: '暂存区',
    content: `<p>暂存区...</p>`,
    progress: 0,
    status: 'default'
  },
  '5': {
    id: '5',
    title: '本地仓库',
    content: `<p>本地仓库...</p>`,
    progress: 100,
    status: 'learned'
  },
   '6': {
    id: '6',
    title: '远程仓库',
    content: `<p>远程仓库...</p>`,
    progress: 0,
    status: 'default'
  },
  '7': {
    id: '7',
    title: '提交记录',
    content: `<p>每次使用 <code>git commit</code>...</p>`,
    progress: 0,
    status: 'default'
  },
  '8': {
    id: '8',
    title: '分支管理',
    content: `<p>分支是Git最强大的功能之一...</p>`,
    progress: 0,
    status: 'default'
  },
  '9': {
    id: '9',
    title: '合并冲突',
    content: `<p>当两个不同的分支修改了...</p>`,
    progress: 0,
    status: 'default'
  },
  '10': {
    id: '10',
    title: '多仓协作',
    content: `<p>Git 的分布式特性天然支持...</p>`,
    progress: 0,
    status: 'default'
  }
};

const route = useRoute();
const currentPointId = ref<string | null>(null);

// 建议问题
const suggestedQuestions = ref<string[]>([]);

// 加载对应知识点的建议问题 (模拟)
const loadSuggestedQuestions = (pointId: string | null) => {
  if (!pointId) {
     suggestedQuestions.value = [];
     return;
  }
  const pointTitle = allKnowledgePoints[pointId]?.title || '当前知识点';
  if (pointId === '1') {
     suggestedQuestions.value = [
       'Git的核心概念介绍一下？',
       '什么叫工作区？和远程托管仓库有什么关系？',
       'Git本地仓库和远程仓库是什么意思？'
     ]
  } else if (pointId === '2') {
     suggestedQuestions.value = [
      '分布式版本控制有什么好处？',
      'Git如何实现分布式？',
      '本地仓库和远程仓库如何同步？'
    ]
  } else {
     suggestedQuestions.value = [
      `关于 ${pointTitle} 有哪些常见问题？`,
      `如何应用 ${pointTitle} 解决实际问题？`,
     ]
  }
};

// 当前活跃的知识点对象 - fetched based on route param
const currentPoint = computed<KnowledgePoint | undefined>(() => {
  return currentPointId.value ? allKnowledgePoints[currentPointId.value] : undefined;
});

// 监听路由参数变化来加载对应的知识点数据
watch(() => route.params.pointId, (newPointId) => {
  const id = Array.isArray(newPointId) ? newPointId[0] : newPointId;
  currentPointId.value = id || null; // Set to null if no ID
  if (id) {
    loadSuggestedQuestions(id); // Now safe to call
    // Fetch full content for 'id' from API here if not preloaded
  } else {
    // Handle case where no knowledge point is selected
     loadSuggestedQuestions(null); // Clear suggestions
  }
}, { immediate: true });


// 用户输入的问题
const userQuestion = ref('');

// 提交问题
const submitQuestion = () => {
  if (!userQuestion.value.trim() || !currentPointId.value) return
  alert(`提交问题 (${currentPointId.value}): ${userQuestion.value}`) 
  userQuestion.value = ''
};

// 预设问题直接提问
const askQuestion = (question: string) => {
  userQuestion.value = question;
  // Optionally submit immediately: submitQuestion();
};

// Removed getStatusIcon - it belongs to the Nav component

// 组件挂载时，路由监听器会自动运行
onMounted(() => { });
</script>

<style scoped>
/* Removed .learning-view and .secondary-nav styles */

/* 主内容区 */
.main-content {
  /* Removed flex:1 - it's now the root element in this view */
  height: 100%; /* Ensure it fills the allocated space in DefaultLayout */
  overflow-y: auto; /* Allow scrolling within this view if needed */
  padding: 32px; 
  display: flex; /* Use flex to push interaction area down */
  flex-direction: column;
}

.content-title {
  font-size: 24px; 
  line-height: 32px;
  margin-bottom: 24px;
  font-weight: 500;
  color: var(--on-surface, #1C1B1F);
  flex-shrink: 0; /* Prevent title from shrinking */
}

.knowledge-content-wrapper {
  background-color: var(--surface-color, #FFFBFE);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px; 
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); 
  flex-shrink: 0; /* Prevent content card from shrinking */
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

.media-container {
  margin-top: 24px;
  text-align: center; 
}

.knowledge-media {
  max-width: 100%;
  height: auto;
  border-radius: 8px; 
}

/* AI 问答交互区 */
.qa-interaction-area {
  margin-top: auto; /* Pushes this section to the bottom */
  padding-top: 24px; /* Add some space above */
  flex-shrink: 0; /* Prevent interaction area from shrinking */
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
  height: 100%; /* Fill the content area */
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

/* Removed responsive adjustments specific to the old two-column layout */
</style> 