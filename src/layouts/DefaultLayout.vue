<template>
  <div class="layout-container">
    <!-- 主容器（三栏布局） -->
    <div class="main-container">
      <!-- 左侧第一栏：全局导航 -->
      <aside class="global-sidebar">
        <!-- 添加Logo到导航栏顶部 -->
        <div class="sidebar-header">
          <div class="logo">
            <img src="../assets/Icon_knowledgehub.svg" alt="KnowledgeHub Logo" class="logo-icon" />
            <span class="logo-text">KnowledgeHub</span>
          </div>
        </div>
        
        <div class="global-nav-scrollable">
          <div class="nav-menu">
            <router-link to="/learning" class="nav-item" active-class="active">
              <img src="../assets/Icon_learning.svg" alt="Learning" class="nav-icon" />
              <span>Learning</span>
            </router-link>
            <router-link to="/exam" class="nav-item" active-class="active">
              <img src="../assets/Icon_exam.svg" alt="Exam" class="nav-icon" />
              <span>Exam</span>
            </router-link>
            <router-link to="/statistics" class="nav-item" active-class="active">
              <img src="../assets/Icon_statistics.svg" alt="Statistics" class="nav-icon" />
              <span>Statistics</span>
            </router-link>
            <div class="nav-divider"></div>
            <router-link to="/insight-spot" class="nav-item" active-class="active">
              <img src="../assets/Icon_insightspot.svg" alt="Insight Spot" class="nav-icon" />
              <span>Insight Spot</span>
            </router-link>
            <router-link to="/question-bank" class="nav-item" active-class="active">
              <img src="../assets/Icon_quiz.svg" alt="Question Bank" class="nav-icon" />
              <span>Question Bank</span>
            </router-link>
            <router-link to="/sys-manage" class="nav-item" active-class="active">
              <img src="../assets/Icon_manage_accounts.svg" alt="Sys Manage" class="nav-icon" />
              <span>Sys Manage</span>
            </router-link>
          </div>
        </div>
        <!-- 固定底部的用户信息与退出 -->
        <div class="global-sidebar-footer">
          <div class="footer-user-info">
            <el-avatar :size="40">{{ userInitial }}</el-avatar>
            <div class="user-details">
              <div class="user-name">{{ userName }}</div>
              <div class="user-email">{{ userEmail }}</div>
            </div>
          </div>
          <div class="footer-actions">
            <router-link to="/settings" class="footer-action-item">
              <img src="../assets/Icon_settings.svg" alt="Settings" class="action-icon" />
              <span>Settings</span>
            </router-link>
            <div class="footer-action-item" @click="logout">
              <img src="../assets/Icon_logout.svg" alt="Log Out" class="action-icon" />
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中间第二栏：二级导航 (内容由视图提供) -->
      <!-- Conditionally render secondary nav only if the route defines it -->
      <aside class="secondary-nav-container" v-if="hasSecondaryNav">
        <router-view name="secondaryNav"></router-view>
      </aside>

      <!-- 右侧第三栏：主内容区容器 -->
      <main class="main-content-area">
        <router-view name="mainContent"></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟用户信息，实际应从状态管理或API获取
const userName = ref('John Smith')
const userEmail = ref('johnsmith@email.ab')

// 计算用户名的首字母
const userInitial = computed(() => {
  return userName.value ? userName.value.charAt(0).toUpperCase() : 'U'
})

// Check if the current matched route has a secondaryNav component defined
const hasSecondaryNav = computed(() => {
  // Check the deepest matched route that has components defined
  for (let i = route.matched.length - 1; i >= 0; i--) {
    const record = route.matched[i];
    // Ensure the record and its components object exist before checking for secondaryNav
    if (record && record.components && record.components.secondaryNav) {
      return true;
    }
  }
  return false;
});

const logout = () => {
  console.log('User logged out')
  // 添加实际的退出登录逻辑，例如清除token，跳转到登录页
  // router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止根容器滚动 */
}

/* 主容器 - 三栏布局 */
.main-container {
  flex: 1; /* 占据剩余高度 */
  display: flex;
  overflow: hidden; /* 防止主容器自身滚动 */
  gap: 1px; /* Add a minimal gap for visual separation, adjust as needed */
  background-color: var(--outline-variant); /* Background color for the gap */
  height: 100vh; /* 设置全屏高度 */
}

/* 左侧第一栏：全局导航 */
.global-sidebar {
  width: 220px;
  background-color: var(--md-sys-color-surface-tint-layer-1); 
  border-right: 1px solid var(--outline-variant); /* 分隔线 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止被压缩 */
  height: 100%; /* 确保占满父容器高度 */
  overflow: hidden; /* 内部滚动，外部不滚动 */
}

/* 添加侧边栏顶部Logo样式 */
.sidebar-header {
  padding: 16px 12px;
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 32px; /* 调整 Logo 图标大小 */
  height: 32px;
  margin-right: 12px; /* 减少一些间距 */
}

.logo-text {
  font-size: 1.25rem; /* 20px, 稍微小一点 */
  font-weight: 500;
  color: var(--on-surface);
}

.global-nav-scrollable {
  flex-grow: 1; /* 占据可用空间 */
  overflow-y: auto; /* 内容超出时滚动 */
  padding: 12px; /* 内边距 */
}

.nav-menu {
  /* 移除 flex-grow: 1 */
}

.nav-item {
  display: flex;
  align-items: center;
  height: 56px; 
  padding: 0 16px; 
  margin-bottom: 4px; 
  border-radius: 28px; 
  color: var(--on-surface-variant); 
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  font-size: 0.875rem; 
  line-height: 1.25rem; 
  letter-spacing: 0.1px;
  font-weight: 500;
}

.nav-item:hover {
  background-color: var(--md-sys-color-surface-tint-layer-2);
  color: var(--on-surface);
}

.nav-item.active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 700; 
}

.nav-icon {
  width: 24px; 
  height: 24px;
  margin-right: 12px; 
  flex-shrink: 0;
}

.nav-divider {
  height: 1px;
  background-color: var(--outline-variant); 
  margin: 16px 0; 
}

.global-sidebar-footer {
  flex-shrink: 0; /* 不压缩 */
  padding: 12px 12px 24px 12px; /* 内边距 */
  border-top: 1px solid var(--outline-variant); /* 顶部加分隔线 */
}

.footer-user-info {
  display: flex;
  align-items: center;
  padding: 12px 4px; 
  margin-bottom: 8px;
}

.user-details {
  margin-left: 16px; 
}

.user-name {
  font-size: 0.875rem; 
  line-height: 1.25rem; 
  font-weight: 500;
  color: var(--on-surface);
}

.user-email {
  font-size: 0.75rem; 
  line-height: 1rem; 
  letter-spacing: 0.4px;
  color: var(--on-surface-variant);
}

.footer-actions {
  /* 样式保持不变 */
}

.footer-action-item {
  display: flex;
  align-items: center;
  height: 48px; 
  padding: 0 16px;
  border-radius: 24px; 
  color: var(--on-surface-variant);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 0.875rem; 
  line-height: 1.25rem; 
  letter-spacing: 0.1px;
  font-weight: 500;
}

.footer-action-item:hover {
  background-color: var(--md-sys-color-surface-tint-layer-2);
  color: var(--on-surface);
}

.action-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* 中间第二栏：二级导航容器 */
.secondary-nav-container {
  /* Width is determined by the child component (e.g., 240px) */
  flex-shrink: 0; /* Don't shrink */
  height: 100%; /* Fill parent height */
  overflow: hidden; /* Child component should handle its own scrolling */
  background-color: var(--surface); /* Match surface color */
}

/* 右侧第三栏：主内容区容器 */
.main-content-area {
  flex: 1; /* Take remaining width */
  height: 100%; /* Fill parent height */
  overflow-y: auto; /* Allow vertical scrolling for the main content */
  background-color: var(--background); /* Ensure background color */
  /* Padding is often handled inside the view component, like QuestionBankView */
  /* Example: add padding here if needed globally */
  /* padding: 24px; */
}

/* Element Plus Dropdown Anpassungen */
.el-dropdown-menu__item a {
  color: inherit; /* Make link inherit color */
  text-decoration: none;
  display: block; /* Ensure link fills item */
}
</style> 