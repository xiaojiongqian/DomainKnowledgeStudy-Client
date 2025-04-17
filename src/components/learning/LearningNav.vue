<template>
  <div class="secondary-nav-content">
    <div class="nav-items">
      <div 
        v-for="point in knowledgePoints" 
        :key="point.id"
        :class="['nav-item', 
                 { active: activePointId === point.id }, 
                 `status-${point.status || 'default'}`]"
        @click="selectKnowledgePoint(point.id)"
      >
        <span class="nav-icon">
          <img v-if="point.status === 'learned'" src="@/assets/Icon_star_full.svg" alt="已学完" />
          <img v-else-if="point.status === 'active'" src="@/assets/Icon_star_half.svg" alt="学习中" />
          <img v-else src="@/assets/Icon_star_empty.svg" alt="未开始" />
        </span>
        {{ point.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
// Consider using Pinia for shared state management instead of local state

type KnowledgePointStatus = 'learned' | 'active' | 'default';

interface KnowledgePoint {
  id: string;
  title: string;
  status?: KnowledgePointStatus;
}

// Mock data - ideally, this list should come from a store or API
const knowledgePoints = ref<KnowledgePoint[]>([
  { id: '1', title: 'Git 版本控制', status: 'default' },
  { id: '2', title: '分布式', status: 'active' },
  { id: '3', title: '工作区', status: 'learned' },
  { id: '4', title: '暂存区', status: 'default' },
  { id: '5', title: '本地仓库', status: 'learned' },
  { id: '6', title: '远程仓库', status: 'default' },
  { id: '7', title: '提交记录', status: 'default' },
  { id: '8', title: '分支管理', status: 'default' },
  { id: '9', title: '合并冲突', status: 'default' },
  { id: '10', title: '多仓协作', status: 'default' }
]);

const route = useRoute();
const router = useRouter();

// Active state derived from route parameter (or a shared store)
const activePointId = ref<string | null>(null); 

// Update activePointId when route changes
watch(() => route.params.pointId, (newPointId) => {
  activePointId.value = Array.isArray(newPointId) ? newPointId[0] : newPointId || (knowledgePoints.value.length > 0 ? knowledgePoints.value[0].id : null);
  // Update status based on the new active ID (optional, might be handled elsewhere)
  knowledgePoints.value = knowledgePoints.value.map(p => ({
    ...p,
    status: p.id === activePointId.value ? (p.status === 'learned' ? 'learned' : 'active') : (p.status === 'active' ? 'default' : p.status)
  }));
}, { immediate: true }); // Run immediately on component mount

// Navigate when a point is selected
const selectKnowledgePoint = (id: string) => {
   // Update the route to reflect the selected knowledge point
   // This assumes your learning route is configured like '/learning/:pointId?'
   router.push({ name: 'learning-detail', params: { pointId: id } }); 
   // State update will happen via the route watcher
};
</script>

<style scoped>
/* Styles are similar to the ones removed from LearningView, adjusted for this component */
.secondary-nav-content {
  padding: 16px 0; 
}

.nav-items {
  padding: 0 8px; 
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 24px;
  margin-bottom: 3px;
  font-size: 14px;
  color: var(--on-surface-variant, #49454F);
}

.nav-icon {
  margin-right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon img {
  width: 20px;
  height: 20px;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Active state based on the reactive activePointId */
.nav-item.active {
  background-color: rgba(230, 230, 230, 0.35); /* 改为中性灰色，透明度减半 */
  color: rgba(50, 50, 50, 0.9); /* 调整文字颜色为深灰色 */
  font-weight: 500;
}

.nav-item.status-learned .nav-icon img {
  filter: none; /* 使用原始颜色 */
}

.nav-item.status-active .nav-icon img {
  filter: none; /* 使用原始颜色 */
}

.nav-item.status-default .nav-icon img {
  filter: opacity(0.7); /* 未开始状态稍微降低不透明度 */
}

.nav-item.active .nav-icon img {
  transform: scale(1.1); /* 当前选中项图标略微放大 */
}
</style>
