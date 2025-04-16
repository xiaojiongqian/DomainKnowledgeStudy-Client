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
        <span class="nav-icon">{{ getStatusIcon(point.status) }}</span>
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
  { id: '2', title: '分布式', status: 'learned' },
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

// Get status icon logic
const getStatusIcon = (status?: KnowledgePointStatus): string => {
  switch (status) {
    case 'learned': return '★';
    case 'active': return '⭐'; 
    case 'default': return '☆';
    default: return '☆';
  }
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

/* Active state based on the reactive activePointId */
.nav-item.active {
  background-color: var(--secondary-container, #E8DEF8);
  color: var(--on-secondary-container, #1D192B);
  font-weight: 500;
}

.nav-item.status-learned .nav-icon,
.nav-item.status-active .nav-icon {
  color: #4CAF50; /* Or use theme color */
}
</style>
