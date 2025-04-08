<template>
  <div class="knowledge-point-list">
    <div class="list-header">
      <h3>知识点列表</h3>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索知识点"
        clearable
        size="small"
        @input="handleSearchInput"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="tree-container">
      <el-tree
        ref="treeRef"
        :data="points"
        :props="defaultProps"
        :highlight-current="true"
        :expand-on-click-node="false"
        node-key="id"
        default-expand-all
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        style="--el-tree-node-hover-bg-color: rgba(0, 0, 0, 0.05); --el-color-primary: transparent; --el-tree-node-background-color: transparent;"
      >
        <template #default="{ node, data }">
          <span 
            class="node-label" 
            :style="node.isCurrent ? 'font-weight: bold; color: #000;' : ''"
          >
            {{ node.label }}
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'

// 知识点类型定义
interface KnowledgePoint {
  id: string
  label: string
  children?: KnowledgePoint[]
  content?: string
  relatedIds?: string[]
}

// 定义props
const props = defineProps<{
  points: KnowledgePoint[]
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'select', point: KnowledgePoint): void
}>()

// 树组件相关
const treeRef = ref<InstanceType<typeof ElTree> | null>(null)
const searchKeyword = ref('')

// 配置树节点
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 过滤树节点
const filterNode = (value: string, data: KnowledgePoint) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

// 监听搜索输入
const handleSearchInput = () => {
  if (treeRef.value) {
    treeRef.value.filter(searchKeyword.value)
  }
}

// 监听搜索关键词变化
watch(searchKeyword, (val) => {
  if (treeRef.value) {
    treeRef.value.filter(val)
  }
})

// 处理节点点击
const handleNodeClick = (data: KnowledgePoint) => {
  // 只有带内容的节点才可选中
  if (data.content) {
    emit('select', data)
  }
}
</script>

<style scoped>
.knowledge-point-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.list-header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.list-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* 节点样式 */
.node-label {
  font-size: 14px;
  color: #333;
}

/* 禁用树节点的默认蓝色高亮 */
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.el-tree-node__content:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* 禁用所有主题颜色 */
:deep(.grok-theme) {
  --el-color-primary: transparent !important;
  background-color: transparent !important;
}

/* 强制当前选中节点使用黑色粗体 */
:deep(.is-current) .node-label {
  font-weight: bold !important;
  color: #000 !important;
}
</style> 