<template>
  <router-view />
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style>
/* 全局样式 */
:root {
  /* 重置Element Plus的主色 - 但这不应影响选中项的样式 */
  --el-color-primary: #409EFF;
}

/* 顶级选择器 - 确保最左侧的节点样式正确 */
.el-tree > .el-tree-node.is-current > .el-tree-node__content {
  background-color: transparent !important;
}

.el-tree > .el-tree-node.is-current .node-label {
  color: #000 !important;
  font-weight: bold !important;
}

/* 树组件内的任何被选中节点 */
.el-tree .is-current .node-label {
  color: #000 !important;
  font-weight: bold !important;
}

.el-tree .is-current > .el-tree-node__content {
  background-color: transparent !important;
}

/* 菜单组件的选中状态 */
.el-menu-item.is-active,
.el-menu-item.is-active .el-icon,
.el-menu-item.is-active span {
  color: #000 !important;
  font-weight: bold !important;
  background-color: transparent !important;
}

/* 白色背景菜单的选中状态 */
.aside .el-menu-item.is-active,
.aside .el-menu-item.is-active .el-icon,
.aside .el-menu-item.is-active span {
  color: #000 !important;
  font-weight: bold !important;
  background-color: transparent !important;
}
</style> 