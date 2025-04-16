<template>
  <div class="secondary-nav-content">
    <div class="nav-items">
      <div
        v-for="spot in insightSpots"
        :key="spot.id"
        :class="['nav-item', { active: currentSpotId === spot.id }]"
        @click="selectSpot(spot.id)"
      >
        <span class="nav-icon">{{ getStatusIcon(spot.status) }}</span>
        {{ spot.title }}
      </div>
      <div v-if="isLoading" class="nav-item loading-item">加载中...</div>
      <div v-if="!isLoading && insightSpots.length === 0" class="nav-item no-data-item">
        暂无知识点
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 知识点状态类型
type SpotStatus = 'completed' | 'active' | 'default';

// 知识点接口
interface InsightSpot {
  id: string;
  title: string;
  status?: SpotStatus;
}

const route = useRoute();
const router = useRouter();

// 知识点列表
const insightSpots = ref<InsightSpot[]>([
  { id: 'spot-1', title: 'Git 基本概念', status: 'active' },
  { id: 'spot-2', title: '分布式版本控制', status: 'default' },
  { id: 'spot-3', title: '工作区', status: 'default' },
  { id: 'spot-4', title: '暂存区', status: 'default' },
  { id: 'spot-5', title: '本地仓库', status: 'completed' },
  { id: 'spot-6', title: '远程仓库', status: 'default' },
  { id: 'spot-7', title: '提交记录', status: 'completed' },
  { id: 'spot-8', title: '分支管理', status: 'default' },
  { id: 'spot-9', title: '合并冲突', status: 'default' },
  { id: 'spot-10', title: '多仓协作', status: 'default' }
]);

const isLoading = ref(false);
const currentSpotId = ref<string | null>(null);

// 选择知识点
const selectSpot = (id: string) => {
  currentSpotId.value = id;
  router.push({ 
    name: 'insight-spot-detail', 
    params: { spotId: id } 
  });
};

// 获取状态图标
const getStatusIcon = (status?: SpotStatus): string => {
  switch (status) {
    case 'completed': return '✓';
    case 'active': return '●'; 
    case 'default': 
    default: return '○';
  }
};

// 从路由参数更新当前选中的知识点
const updateActiveFromRoute = () => {
  const spotIdFromRoute = route.params.spotId;
  currentSpotId.value = Array.isArray(spotIdFromRoute) 
    ? spotIdFromRoute[0] 
    : spotIdFromRoute || (insightSpots.value.length > 0 ? insightSpots.value[0].id : null);
};

// 监听路由变化
watch(() => route.params.spotId, () => {
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

.nav-item.status-completed .nav-icon {
  color: #4CAF50;
}

.nav-item.status-active .nav-icon {
  color: #1976D2;
}

.loading-item,
.no-data-item {
  font-style: italic;
  cursor: default;
}
</style> 