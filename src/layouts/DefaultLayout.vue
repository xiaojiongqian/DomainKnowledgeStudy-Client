<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <img src="../assets/Icon_knowledgehub.svg" alt="KnowledgeHub Logo" class="logo-icon" />
        <span class="logo-text">KnowledgeHub</span>
      </div>
      <div class="header-menu">
        <!-- 暂时移除首页链接，根据设计图侧边栏为主导航 -->
        <!-- <router-link to="/" class="menu-item">首页</router-link> -->
        <div class="user-menu">
          <el-dropdown trigger="click">
            <div class="user-info">
              <!-- 使用占位头像，或替换为真实头像逻辑 -->
              <el-avatar :size="32">U</el-avatar>
              <span class="username">{{ userName }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/profile">个人信息</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/settings">设置</router-link>
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
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
        </div>

        <!-- 用户信息与退出 -->
        <div class="sidebar-footer">
           <div class="footer-user-info">
             <el-avatar :size="40">JS</el-avatar> <!-- 调整头像大小 -->
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
               <img src="../assets/Icon_logout.svg" alt="Log Out" class="action-icon" /> <!-- Changed icon to logout -->
               <span>Log Out</span> <!-- Changed text from Sign Out -->
             </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
// import { useRouter } from 'vue-router' // 如果需要路由跳转

// const router = useRouter() // 如果需要路由跳转

// 模拟用户信息，实际应从状态管理或API获取
const userName = ref('John Smith')
const userEmail = ref('johnsmith@email.ab')

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
  background-color: var(--background-color); /* 使用 M3 背景色 */
}

/* 顶部导航栏 */
.header {
  height: 64px; /* M3 Top App Bar 高度通常为 64px */
  background-color: var(--surface-color); /* 使用 M3 Surface 颜色 */
  color: var(--on-surface-color); /* 使用 M3 Surface 上的文字颜色 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px; /* M3 边距 */
  /* M3 Elevation Level 2 for Top App Bar */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15),
              0px 1px 2px rgba(0, 0, 0, 0.30);
  z-index: 10; /* 确保在内容之上 */
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 32px; /* 调整 Logo 图标大小 */
  height: 32px;
  margin-right: 16px; /* M3 medium spacing */
}

.logo-text {
  font-size: 1.375rem; /* 22px, M3 Title Large */
  font-weight: 400;
  color: var(--on-surface-color);
}

.header-menu {
  display: flex;
  align-items: center;
}

.user-menu .user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 16px; /* M3 shape medium */
  transition: background-color 0.2s;
}

.user-menu .user-info:hover {
  background-color: var(--md-sys-color-surface-tint-layer-1);
}

.username {
  margin: 0 8px;
  /* M3 Body Large */
  font-size: 1rem; /* 16px */
  line-height: 1.5rem; /* 24px */
  letter-spacing: 0.5px;
  font-weight: 500; /* Medium weight for names often looks good */
  color: var(--on-surface-variant); /* M3 On Surface Variant for less emphasis */
}

.el-icon--right {
  color: var(--on-surface-variant);
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden; /* 防止内容溢出导致滚动条 */
}

/* 侧边栏 */
.sidebar {
  width: 256px; /* M3 Navigation Rail/Drawer width */
  background-color: var(--md-sys-color-surface-tint-layer-1); /* M3 Surface + 5% Primary Tint */
  /* border-right: 1px solid var(--outline-color); */ /* M3 uses elevation or distinct background */
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px 12px; /* M3 padding */
}

.nav-menu {
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 56px; /* M3 Navigation Drawer Item Height */
  padding: 0 16px 0 16px; /* M3 padding: horizontal 16px */
  margin-bottom: 4px; /* Spacing between items */
  border-radius: 28px; /* M3 Full Shape for active indicator */
  color: var(--on-surface-variant); /* M3 On Surface Variant */
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  /* M3 Label Large */
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
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
  font-weight: 700; /* Bold for active state */
}

.nav-icon {
  width: 24px; /* M3 Standard Icon Size */
  height: 24px;
  margin-right: 12px; /* Space between icon and text */
  flex-shrink: 0;
}

/* Active state icon color */
.nav-item.active .nav-icon {
  /* Icons should ideally adapt color via currentColor if they are monochrome SVGs */
  /* If using multi-color icons, this won't work directly */
  /* filter: brightness(0) saturate(100%) invert(13%) sepia(67%) saturate(5936%) hue-rotate(260deg) brightness(68%) contrast(105%); */ /* Example to colorize icon to --on-secondary-container */
  /* Better approach: Use CSS masks or separate active icons if needed */
}

.nav-divider {
  height: 1px;
  background-color: var(--outline-variant); /* M3 Outline Variant */
  margin: 16px 0; /* M3 spacing */
}

/* 侧边栏底部 */
.sidebar-footer {
  /* border-top: 1px solid var(--outline-variant); M3 Footer has no top border */
  /* padding-top: 16px; */
}

.footer-user-info {
  display: flex;
  align-items: center;
  padding: 12px 4px; /* Adjust padding */
  margin-bottom: 8px;
}

.user-details {
  margin-left: 16px; /* M3 medium spacing */
}

.user-name {
  /* M3 Title Small */
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
  font-weight: 500;
  color: var(--on-surface);
}

.user-email {
  /* M3 Body Small */
  font-size: 0.75rem; /* 12px */
  line-height: 1rem; /* 16px */
  letter-spacing: 0.4px;
  color: var(--on-surface-variant);
}

.footer-actions {
  /* No flex needed if items are block */
}

.footer-action-item {
  display: flex;
  align-items: center;
  height: 48px; /* Reduced height for footer actions */
  padding: 0 16px;
  border-radius: 24px; /* Adjust shape */
  color: var(--on-surface-variant);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  /* M3 Label Large - same as nav items */
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
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


/* 主内容区 */
.main-content {
  flex: 1;
  overflow-y: auto; /* Allow content to scroll */
  padding: 24px; /* M3 padding */
  background-color: var(--background-color);
}

/* Element Plus Dropdown Anpassungen */
.el-dropdown-menu__item a {
  color: inherit; /* Make link inherit color */
  text-decoration: none;
  display: block; /* Ensure link fills item */
}

</style> 