<template>
  <div class="main-content">
    <h1 class="title-large">题库管理</h1>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="search-area">
        <div class="search-input-wrapper">
          <i class="search-icon">🔍</i>
          <input
            v-model="searchQuery"
            placeholder="搜索题目..."
            class="search-input"
          />
        </div>
        
        <div class="filter-dropdown">
          <select v-model="typeFilter" class="filter-select">
            <option value="">全部类型</option>
            <option value="choice">选择题</option>
            <option value="qa">问答题</option>
          </select>
        </div>
      </div>
      
      <div class="bulk-actions">
        <button @click="openBatchActions" class="batch-btn">
          批量操作 ▾
        </button>
        <div v-if="showBatchMenu" class="batch-menu elevation-2">
          <div class="menu-item" @click="batchGenerate">
            <i class="menu-icon">⚡</i> 批量生成题目
          </div>
          <div class="menu-item" @click="importQuestions">
            <i class="menu-icon">📥</i> 导入题目
          </div>
          <div class="menu-item" @click="exportQuestions">
            <i class="menu-icon">📤</i> 导出题目
          </div>
        </div>
      </div>
    </div>
    
    <!-- 题目列表 -->
    <div class="questions-table-container elevation-1">
      <table class="questions-table">
        <thead>
          <tr>
            <th class="checkbox-cell">
              <input type="checkbox" @change="toggleSelectAll" v-model="selectAll" />
            </th>
            <th>题目内容</th>
            <th>类型</th>
            <th>知识点</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="question in paginatedQuestions" :key="question.id">
            <td class="checkbox-cell">
              <input type="checkbox" v-model="question.selected" />
            </td>
            <td>{{ question.content }}</td>
            <td>{{ question.type === 'choice' ? '选择题' : '问答题' }}</td>
            <td>{{ question.knowledgePoint }}</td>
            <td>
              <span :class="['status-badge', question.status === '已审核' ? 'status-approved' : 'status-pending']">
                {{ question.status }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="editQuestion(question)" class="action-btn edit-btn">
                ✏️
              </button>
              <button @click="reviewQuestion(question)" class="action-btn review-btn">
                ✓
              </button>
              <button @click="deleteQuestion(question)" class="action-btn delete-btn">
                🗑️
              </button>
            </td>
          </tr>
          <tr v-if="paginatedQuestions.length === 0">
            <td colspan="6" class="no-data-cell">没有找到匹配的题目</td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分页控件 -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="prevPage" class="page-btn">
          &lt;
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage >= totalPages" @click="nextPage" class="page-btn">
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'; // Import useRoute

// 题目数据结构
interface Question {
  id: string;
  content: string;
  type: 'choice' | 'qa';
  knowledgePoint: string; // Keep the title for display
  knowledgePointId: string; // Add ID for filtering
  status: '已审核' | '待审核';
  selected: boolean;
}

// Mock 原始题目数据
const allQuestions = ref<Question[]>([
  { id: '1', content: 'Git的全称是什么？', type: 'choice', knowledgePoint: 'Git 基本概念', knowledgePointId: '1', status: '已审核', selected: false },
  { id: '2', content: '使用什么命令可以将文件添加到Git暂存区？', type: 'choice', knowledgePoint: 'Git 工作区与暂存区', knowledgePointId: '2', status: '已审核', selected: false },
  { id: '3', content: '请解释Git的分布式版本控制相比集中式版本控制的优势。', type: 'qa', knowledgePoint: 'Git 基本概念', knowledgePointId: '1', status: '待审核', selected: false },
  { id: '4', content: '如何创建一个新的Git分支并切换到该分支？', type: 'qa', knowledgePoint: 'Git 分支管理', knowledgePointId: '3', status: '待审核', selected: false },
  { id: '5', content: 'Git与SVN的主要区别是什么？', type: 'choice', knowledgePoint: 'Git 基本概念', knowledgePointId: '1', status: '已审核', selected: false },
  // Add more mock questions for pagination testing
  { id: '6', content: 'git commit -m 的作用是？', type: 'choice', knowledgePoint: 'Git 基本概念', knowledgePointId: '1', status: '已审核', selected: false },
  { id: '7', content: '如何查看 Git 提交历史？', type: 'qa', knowledgePoint: 'Git 基本概念', knowledgePointId: '1', status: '已审核', selected: false },
  { id: '8', content: '什么是 HEAD？', type: 'qa', knowledgePoint: 'Git 基本概念', knowledgePointId: '1', status: '待审核', selected: false },
  { id: '9', content: 'git pull 和 git fetch 的区别？', type: 'qa', knowledgePoint: '远程仓库', knowledgePointId: '4', status: '已审核', selected: false }, // Assuming ID 4 for '远程仓库'
  { id: '10', content: '如何解决合并冲突？', type: 'qa', knowledgePoint: '合并冲突', knowledgePointId: '5', status: '待审核', selected: false }, // Assuming ID 5 for '合并冲突'
  { id: '11', content: 'git reset 和 git revert 的区别？', type: 'qa', knowledgePoint: '提交记录', knowledgePointId: '6', status: '已审核', selected: false }, // Assuming ID 6 for '提交记录'
]);

// 筛选与分页状态
const route = useRoute();
const searchQuery = ref('');
const typeFilter = ref('');
const currentKnowledgePointId = ref<string | null>(null); // From route query
const currentPage = ref(1);
const pageSize = ref(10);
const selectAll = ref(false);
const showBatchMenu = ref(false);

// Watch route query for knowledge point filter
watch(() => route.query.knowledgePoint, (newPointId) => {
  const id = Array.isArray(newPointId) ? newPointId[0] : newPointId;
  currentKnowledgePointId.value = id || null;
  currentPage.value = 1; // Reset page when filter changes
}, { immediate: true });

// 筛选后的题目 (计算属性)
const filteredQuestions = computed(() => {
  let result = [...allQuestions.value];
  
  // 知识点筛选 (based on ID from route query)
  if (currentKnowledgePointId.value && currentKnowledgePointId.value !== 'all') { // Assuming 'all' means no filter
    result = result.filter(q => q.knowledgePointId === currentKnowledgePointId.value);
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(q => q.content.toLowerCase().includes(query));
  }
  
  // 类型筛选
  if (typeFilter.value) {
    result = result.filter(q => q.type === typeFilter.value);
  }
  
  return result;
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredQuestions.value.length / pageSize.value) || 1;
});

// 当前页显示的题目
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredQuestions.value.slice(start, end);
});

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 选择全部
const toggleSelectAll = () => {
  const isSelected = selectAll.value;
  // Select only items currently visible on the page
  paginatedQuestions.value.forEach(q => {
    q.selected = isSelected;
  });
  // Note: A true 'select all across pages' needs more complex state management
};

// 监视 paginatedQuestions 的选中状态以更新 selectAll 复选框
watch(paginatedQuestions, (newQuestions) => {
  if (newQuestions.length > 0 && newQuestions.every(q => q.selected)) {
    selectAll.value = true;
  } else if (newQuestions.some(q => !q.selected)) {
    selectAll.value = false;
  }
}, { deep: true });

// 批量操作
const openBatchActions = () => {
  showBatchMenu.value = !showBatchMenu.value;
};

const batchGenerate = () => {
  alert('批量生成题目功能开发中...');
  showBatchMenu.value = false;
};

const importQuestions = () => {
  alert('导入题目功能开发中...');
  showBatchMenu.value = false;
};

const exportQuestions = () => {
  alert('导出题目功能开发中...');
  showBatchMenu.value = false;
};

// 单个题目操作
const editQuestion = (question: Question) => {
  alert(`编辑题目：${question.content}`);
};

const reviewQuestion = (question: Question) => {
  question.status = '已审核';
  alert(`已审核题目：${question.content}`);
};

const deleteQuestion = (question: Question) => {
  if (confirm(`确定要删除题目：${question.content}吗？`)) {
    allQuestions.value = allQuestions.value.filter(q => q.id !== question.id);
    // Recalculate pages if needed, or let computed props handle it
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
    }
  }
};

onMounted(() => {
  // Fetch initial data here if needed
});
</script>

<style scoped>
/* Removed .question-bank-view and .secondary-nav styles */

/* 主内容区 */
.main-content {
  /* flex: 1; */
  padding: 24px;
  overflow-y: auto;
  height: 100%;
}

.title-large {
  font-size: 28px;
  line-height: 36px;
  margin-bottom: 24px;
  font-weight: 500;
  color: var(--on-surface, #1C1B1F);
}

/* Action Bar styles remain the same */
.action-bar { /* ... */ }
.search-area { /* ... */ }
.search-input-wrapper { /* ... */ }
.search-icon { /* ... */ }
.search-input { /* ... */ }
.search-input:focus { /* ... */ }
.filter-select { /* ... */ }
.filter-select:focus { /* ... */ }
.bulk-actions { /* ... */ }
.batch-btn { /* ... */ }
.batch-btn:hover { /* ... */ }
.batch-menu { /* ... */ }
.menu-item { /* ... */ }
.menu-item:hover { /* ... */ }
.menu-icon { /* ... */ }

/* Table styles remain the same */
.questions-table-container { /* ... */ }
.questions-table { /* ... */ }
.questions-table th, .questions-table td { /* ... */ }
.questions-table th { /* ... */ }
.questions-table td { /* ... */ }
.checkbox-cell { /* ... */ }
.actions-cell { /* ... */ }
.action-btn { /* ... */ }
.action-btn:hover { /* ... */ }
.status-badge { /* ... */ }
.status-approved { /* ... */ }
.status-pending { /* ... */ }
.no-data-cell {
    text-align: center;
    color: var(--on-surface-variant);
    padding: 32px;
}

/* Pagination styles remain the same */
.pagination { /* ... */ }
.page-btn { /* ... */ }
.page-btn:disabled { /* ... */ }
.page-btn:hover:not(:disabled) { /* ... */ }
.page-info { /* ... */ }

/* Elevation helpers remain the same */
.elevation-1 { /* ... */ }
.elevation-2 { /* ... */ }

/* Responsive styles might need adjustment */
@media (max-width: 768px) {
  /* Removed rules targeting .question-bank-view or .secondary-nav */
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .search-area {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
}
</style> 