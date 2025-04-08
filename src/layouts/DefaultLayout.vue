<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="logo">领域知识学习系统</div>
      <el-menu
        mode="horizontal"
        :router="true"
        class="header-menu"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-sub-menu index="user">
          <template #title>
            <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <span class="username">用户名称</span>
          </template>
          <el-menu-item index="/profile">个人信息</el-menu-item>
          <el-menu-item index="/settings">系统设置</el-menu-item>
          <el-menu-item index="/logout">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>

    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          :router="true"
          :default-active="$route.path"
          class="side-menu"
        >
          <el-menu-item index="/learning">
            <el-icon><Reading /></el-icon>
            <span>知识学习</span>
          </el-menu-item>
          <el-menu-item index="/exam">
            <el-icon><Edit /></el-icon>
            <span>考试</span>
          </el-menu-item>
          <el-menu-item index="/question-bank">
            <el-icon><Collection /></el-icon>
            <span>题库管理</span>
          </el-menu-item>
          <el-menu-item index="/configuration">
            <el-icon><Setting /></el-icon>
            <span>系统配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { Reading, Edit, Collection, Setting } from '@element-plus/icons-vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

.header-menu {
  background-color: transparent;
  border-bottom: none;
}

.header-menu :deep(.el-menu-item),
.header-menu :deep(.el-sub-menu__title) {
  color: white !important;
  height: 60px;
  line-height: 60px;
}

.header-menu :deep(.el-menu-item.is-active),
.header-menu :deep(.el-menu-item:hover),
.header-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

.username {
  margin-left: 8px;
  color: white;
}

.aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
  height: calc(100vh - 60px);
}

.side-menu {
  border-right: none;
  height: 100%;
}

.side-menu :deep(.el-menu-item) {
  color: #333;
}

.side-menu :deep(.el-menu-item.is-active) {
  background-color: transparent !important;
  color: #000 !important;
  font-weight: bold !important;
}

.side-menu :deep(.el-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style> 