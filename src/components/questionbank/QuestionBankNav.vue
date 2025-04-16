<template>
  <div class="secondary-nav-content">
    <div class="nav-items">
      <div
        :class="['nav-item', { active: !currentKnowledgePointId || currentKnowledgePointId === 'all' }]"
        @click="selectKnowledgePoint('all')"
      >
        <span class="nav-icon">●</span>
        所有知识点
      </div>
      <div
        v-for="kp in knowledgePoints"
        :key="kp.id"
        :class="['nav-item', { active: currentKnowledgePointId === kp.id }]"
        @click="selectKnowledgePoint(kp.id)"
      >
        <span class="nav-icon">{{ getStatusIcon(kp.status) }}</span>
        {{ kp.title }}
      </div>
      <div v-if="isLoading" class="nav-item loading-item">加载中...</div>
      <div v-if="!isLoading && knowledgePoints.length === 0" class="nav-item no-data-item">
        暂无知识点
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 知识点状态类型
type KnowledgePointStatus = 'high' | 'medium' | 'low' | 'default';

// 知识点接口
interface KnowledgePoint {
  id: string;
  title: string;
  status?: KnowledgePointStatus;
}

const route = useRoute();
const router = useRouter();

// 知识点列表
const knowledgePoints = ref<KnowledgePoint[]>([
  { id: 'kp-1', title: 'Git 基本概念', status: 'high' },
  { id: 'kp-2', title: '分布式版本控制', status: 'medium' },
  { id: 'kp-3', title: '工作区操作', status: 'high' },
  { id: 'kp-4', title: '暂存区操作', status: 'medium' },
  { id: 'kp-5', title: '本地仓库操作', status: 'high' },
  { id: 'kp-6', title: '远程仓库操作', status: 'low' },
  { id: 'kp-7', title: '提交记录管理', status: 'medium' },
  { id: 'kp-8', title: '分支管理', status: 'high' },
  { id: 'kp-9', title: '合并冲突处理', status: 'low' },
  { id: 'kp-10', title: '多仓协作管理', status: 'low' }
]);

const isLoading = ref(false);
const currentKnowledgePointId = ref<string | null>('all');

// 选择知识点
const selectKnowledgePoint = (id: string) => {
  currentKnowledgePointId.value = id;
  router.push({
    name: 'question-bank-detail',
    query: { knowledgePoint: id }
  });
};

// 获取状态图标
const getStatusIcon = (status?: KnowledgePointStatus): string => {
  switch (status) {
    case 'high': return '★'; // 高优先级/重要性
    case 'medium': return '⭐'; // 中等优先级/重要性
    case 'low': return '☆'; // 低优先级/重要性
    case 'default':
    default: return '○';
  }
};

// 从路由参数更新当前选中的知识点
const updateActiveFromRoute = () => {
  const pointIdFromRoute = route.query.knowledgePoint as string | undefined;
  currentKnowledgePointId.value = pointIdFromRoute || 'all';
};

// 监听路由变化
watch(() => route.query.knowledgePoint, () => {
  updateActiveFromRoute();
}, { immediate: true });

onMounted(() => {
  updateActiveFromRoute();
});
</script>

<style scoped>
/* 样式与LearningNav保持一致 */
.secondary-nav-content {
  padding: 16px 0;
  height: 100%;
  overflow-y: auto;
}

.nav-items {
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 24px;
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--on-surface-variant, #49454F);
}

.nav-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
  color: var(--on-surface-variant, #49454F);
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-item.active {
  background-color: var(--secondary-container, #E8DEF8);
  color: var(--on-secondary-container, #1D192B);
  font-weight: 500;
}

/* 状态图标颜色 */
.nav-item .nav-icon {
  color: var(--on-surface-variant, #49454F);
}

/* 高重要性知识点 */
[class*="status-high"] .nav-icon {
  color: #F44336; /* 红色表示高重要性 */
}

/* 中等重要性知识点 */
[class*="status-medium"] .nav-icon {
  color: #FF9800; /* 橙色表示中等重要性 */
}

/* 低重要性知识点 */
[class*="status-low"] .nav-icon {
  color: #4CAF50; /* 绿色表示低重要性 */
}

.loading-item,
.no-data-item {
  font-style: italic;
  cursor: default;
}
</style> 