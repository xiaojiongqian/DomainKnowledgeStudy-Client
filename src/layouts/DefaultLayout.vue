<template>
  <div class="layout-container">
    <!-- 主容器（三栏布局） -->
    <div class="main-container">
      <!-- 左侧第一栏：全局导航 -->
      <aside class="global-sidebar" :class="{ 'collapsed': isNavCollapsed }">
        <!-- 添加Logo到导航栏顶部 -->
        <div class="sidebar-header">
          <router-link to="/" class="logo-link">
            <div class="logo">
              <img src="../assets/Icon_knowledgehub.svg" alt="KnowHub Logo" class="logo-icon" />
              <span class="logo-text" v-show="!isNavCollapsed">KnowHub</span>
            </div>
          </router-link>
          
          <!-- 切换按钮 -->
          <button @click="toggleNavCollapse" class="toggle-nav-btn">
            <img :src="isNavCollapsed ? '../assets/Icon_menu_open.svg' : '../assets/Icon_menu_close.svg'" 
                 alt="Toggle Menu" 
                 class="toggle-icon" 
                 v-if="false" />
            <span v-if="isNavCollapsed">❯</span>
            <span v-else>❮</span>
          </button>
        </div>
        
        <div class="global-nav-scrollable">
          <div class="nav-menu">
            <router-link to="/learning" class="nav-item" :class="{ active: isRouteActive('learning') }" :title="isNavCollapsed ? 'Learning' : ''">
              <img src="../assets/Icon_learning.svg" alt="Learning" class="nav-icon" />
              <span v-show="!isNavCollapsed">Learning</span>
            </router-link>
            <router-link to="/exam" class="nav-item" :class="{ active: isRouteActive('exam') }" :title="isNavCollapsed ? 'Exam' : ''">
              <img src="../assets/Icon_exam.svg" alt="Exam" class="nav-icon" />
              <span v-show="!isNavCollapsed">Exam</span>
            </router-link>
            <router-link to="/statistics" class="nav-item" :class="{ active: isRouteActive('statistics') }" :title="isNavCollapsed ? 'Statistics' : ''">
              <img src="../assets/Icon_statistics.svg" alt="Statistics" class="nav-icon" />
              <span v-show="!isNavCollapsed">Statistics</span>
            </router-link>
            <div class="nav-divider"></div>
            <router-link to="/insight-spot" class="nav-item" :class="{ active: isRouteActive('insight-spot') }" :title="isNavCollapsed ? 'Insight Spot' : ''">
              <img src="../assets/Icon_insightspot.svg" alt="Insight Spot" class="nav-icon" />
              <span v-show="!isNavCollapsed">Insight Spot</span>
            </router-link>
            <router-link to="/question-bank" class="nav-item" :class="{ active: isRouteActive('question-bank') }" :title="isNavCollapsed ? 'Question Bank' : ''">
              <img src="../assets/Icon_quiz.svg" alt="Question Bank" class="nav-icon" />
              <span v-show="!isNavCollapsed">Question Bank</span>
            </router-link>
            <router-link to="/sys-manage" class="nav-item" :class="{ active: isRouteActive('sys-manage') }" :title="isNavCollapsed ? 'Sys Manage' : ''">
              <img src="../assets/Icon_manage_accounts.svg" alt="Sys Manage" class="nav-icon" />
              <span v-show="!isNavCollapsed">Sys Manage</span>
            </router-link>
          </div>
        </div>
        <!-- 固定底部的用户信息与退出 -->
        <div class="global-sidebar-footer">
          <div class="footer-user-info" v-show="!isNavCollapsed">
            <el-avatar :size="40">{{ userInitial }}</el-avatar>
            <div class="user-details">
              <div class="user-name">{{ userName }}</div>
              <div class="user-email">{{ userEmail }}</div>
            </div>
          </div>
          <div class="footer-actions">
            <router-link to="/settings" class="footer-action-item" :class="{ active: isRouteActive('settings') }" :title="isNavCollapsed ? 'Settings' : ''">
              <img src="../assets/Icon_settings.svg" alt="Settings" class="action-icon" />
              <span v-show="!isNavCollapsed">Settings</span>
            </router-link>
            <div class="footer-action-item" @click="logout" :title="isNavCollapsed ? 'Log Out' : ''">
              <img src="../assets/Icon_logout.svg" alt="Log Out" class="action-icon" />
              <span v-show="!isNavCollapsed">Log Out</span>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 导航栏参数
const NAV_WIDTH = 220; // 导航栏完整宽度（非折叠）
const NAV_COLLAPSED_WIDTH = 84; // 导航栏折叠宽度

// 导航栏折叠状态
const isNavCollapsed = ref(false)
// 是否是手动控制折叠状态
const isManuallyCollapsed = ref(false)
// 窗口宽度
const windowWidth = ref(window.innerWidth)

// 根据窗口宽度计算是否应该自动折叠
const shouldAutoCollapse = computed(() => {
  // 当整体宽度小于左侧栏宽度的5倍时，应该折叠
  return windowWidth.value < NAV_WIDTH * 5;
})

// 根据窗口宽度计算是否应该自动展开
const shouldAutoExpand = computed(() => {
  // 当左侧栏宽度小于整体页面的1/6时，应该展开
  return windowWidth.value > NAV_WIDTH * 6;
})

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  
  // 只有在非手动控制的情况下，才自动调整折叠状态
  if (!isManuallyCollapsed.value) {
    if (shouldAutoCollapse.value) {
      isNavCollapsed.value = true;
    } else if (shouldAutoExpand.value) {
      isNavCollapsed.value = false;
    }
  }
}

// 切换导航栏折叠状态（手动控制）
const toggleNavCollapse = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
  isManuallyCollapsed.value = true; // 标记为手动控制
  
  // 2秒后重置手动控制标志，使自动响应重新生效
  setTimeout(() => {
    isManuallyCollapsed.value = false;
  }, 2000);
}

// 在组件挂载时添加窗口大小变化的监听器
onMounted(() => {
  // 初始检查是否应该折叠
  handleResize();
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
})

// 在组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
})

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

// 判断当前路由是否处于激活状态
const isRouteActive = (routeName: string) => {
  // 检查当前路由路径是否以指定的路由名称开头
  return route.path.startsWith('/' + routeName);
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
  transition: width 0.3s ease; /* 平滑过渡宽度变化 */
}

/* 折叠模式的导航栏样式 */
.global-sidebar.collapsed {
  width: 84px; /* 从56px增加50%到84px */
}

/* 添加侧边栏顶部Logo样式 */
.sidebar-header {
  padding: 16px 12px;
  border-bottom: 1px solid var(--outline-variant);
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start; /* 改为左对齐 */
  align-items: center;
  position: relative; /* 为绝对定位的子元素提供参考 */
}

/* 折叠状态下调整LOGO标题区域 */
.global-sidebar.collapsed .sidebar-header {
  justify-content: center; /* 居中显示 */
  padding: 16px 0; /* 移除水平内边距 */
}

/* 切换按钮样式 */
.toggle-nav-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #999; /* 修改为灰色，不那么醒目 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  padding: 0;
  font-size: 14px;
  margin-left: auto; /* 将按钮推到右侧 */
  margin-right: 0px; /* 添加右侧边距 */
  position: absolute; /* 使用绝对定位 */
  right: 0px; /* 距离右侧12px */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 确保完全垂直居中 */
  opacity: 0.6; /* 降低不透明度，使其更不醒目 */
}

.toggle-nav-btn:hover {
  color: var(--on-surface);
  opacity: 0.8; /* 悬停时略微提高不透明度，但仍保持低调 */
}

.toggle-icon {
  width: 16px;
  height: 16px;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 为折叠状态下的logo添加样式 */
.global-sidebar.collapsed .logo {
  justify-content: center;
}

.logo-icon {
  width: 24px;
  height: 24px;
  margin-left: 20px; /* 减少左侧边距，作为基准 */
}

/* 折叠状态下的logo图标样式 */
.global-sidebar.collapsed .logo-icon {
  margin-left: 0; /* 折叠状态下居中显示 */
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
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
  height: 48px; /* 减小高度与底部按钮一致 */
  padding: 0 16px; 
  margin-bottom: 2px; /* 减小底部间距 */
  border-radius: 24px; /* 调整圆角以匹配高度 */
  color: var(--on-surface-variant); 
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  font-size: 0.875rem; 
  line-height: 1.25rem; 
  letter-spacing: 0.1px;
  font-weight: 500;
}

/* 折叠状态下导航项居中显示 */
.global-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0;
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

/* 添加选中图标样式 */
.nav-item.active .nav-icon {
  /* 使用深紫色，符合Material Design的色彩规范 */
  filter: brightness(0.8) hue-rotate(250deg) saturate(2);
  /* 添加轻微的缩放效果，增强视觉反馈 */
  transform: scale(1.1);
}

.nav-icon {
  width: 24px; 
  height: 24px;
  margin-right: 12px; 
  margin-left: 20px; /* 与logo图标保持相同边距 */
  flex-shrink: 0;
  transition: filter 0.2s, transform 0.2s; /* 添加过渡效果 */
}

/* 折叠状态下移除图标右侧间距 */
.global-sidebar.collapsed .nav-icon {
  margin-right: 0;
  margin-left: 0; /* 折叠状态下移除左侧边距 */
}

.nav-divider {
  height: 1px;
  background-color: #BABAC0; /* 保持中灰色 */
  margin: 16px 8px; /* 保持水平边距 */
  opacity: 0.8; /* 保持不透明度 */
  border-radius: 0.5px; /* 减小圆角 */
}

.global-sidebar-footer {
  flex-shrink: 0; /* 不压缩 */
  padding: 12px 12px 24px 12px; /* 内边距 */
  border-top: 1px solid var(--outline-variant); /* 顶部加分隔线 */
}

/* 折叠状态下底部区域调整 */
.global-sidebar.collapsed .global-sidebar-footer {
  padding: 12px 6px 24px 6px;
}

.footer-user-info {
  display: flex;
  align-items: center;
  padding: 12px 4px; 
  margin-bottom: 8px;
  margin-left: 12px; /* 调整左侧边距，使头像与图标对齐 */
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
  height: 48px; /* 保持高度不变 */
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
  margin-bottom: 2px; /* 添加与导航项相同的底部间距 */
}

/* 折叠状态下底部操作项调整 */
.global-sidebar.collapsed .footer-action-item {
  justify-content: center;
  padding: 0;
}

.footer-action-item:hover {
  background-color: var(--md-sys-color-surface-tint-layer-2);
  color: var(--on-surface);
}

.action-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  margin-left: 20px; /* 与logo图标保持相同边距 */
  flex-shrink: 0;
}

/* 折叠状态下移除图标右侧间距 */
.global-sidebar.collapsed .action-icon {
  margin-right: 0;
  margin-left: 0; /* 折叠状态下居中 */
}

/* 调整用户信息区域的布局 */
.footer-user-info {
  display: flex;
  align-items: center;
  padding: 12px 4px; 
  margin-bottom: 8px;
  margin-left: 12px; /* 调整左侧边距，使头像与图标对齐 */
}

/* 折叠状态下用户信息居中 */
.global-sidebar.collapsed .footer-user-info {
  margin-left: 0; /* 折叠状态下居中 */
  justify-content: center;
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

/* 更特异的选择器和更明显的效果 */
.global-sidebar .nav-menu .nav-item.active .nav-icon {
  filter: brightness(0.7) hue-rotate(245deg) saturate(2.5);
  transform: scale(1.15);
}

.global-sidebar .nav-menu .nav-item.active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 700;
  /* 移除阴影效果 */
}

/* 底部功能按钮选中状态样式 */
.footer-action-item.active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 700;
}

/* 底部功能按钮图标选中状态样式 */
.footer-action-item.active .action-icon {
  filter: brightness(0.7) hue-rotate(245deg) saturate(2.5);
  transform: scale(1.15);
}
</style> 