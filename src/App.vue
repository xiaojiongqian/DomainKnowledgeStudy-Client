<template>
  <router-view />
</template>

<script setup lang="ts">
// App组件逻辑
</script>

<style>
/* 全局样式 */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  /* 设置基础字号，方便使用rem单位 */
  font-size: 16px;
}

body {
  font-family: 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif; /* 优先使用Roboto */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--on-background); /* 使用M3规范的文字颜色 */
  background-color: var(--background); /* 使用M3规范的背景色 */
  line-height: 1.5; /* 设置默认行高 */
}

/* Material Design 3 Colors - Neutral Theme */
:root {
  /* Primary (Using a neutral dark gray, can be black too) */
  --md-sys-color-primary: #212121; /* Dark Gray/Near Black */
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #E0E0E0; /* Light Gray */
  --md-sys-color-on-primary-container: #121212; /* Dark Gray */
  /* Secondary (Using for active states, darker light gray) */
  --md-sys-color-secondary: #757575; /* Mid Gray */
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #EBEBEB; /* Slightly darker gray for active sidebar */
  --md-sys-color-on-secondary-container: #1C1B1F; /* Black/Dark Gray */
  /* Tertiary (Less used, keep neutral) */
  --md-sys-color-tertiary: #757575;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #F5F5F5;
  --md-sys-color-on-tertiary-container: #1C1B1F;
  /* Error (Keep standard error colors) */
  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #F9DEDC;
  --md-sys-color-on-error-container: #410E0B;
  /* Background (White) */
  --md-sys-color-background: #FFFFFF; /* Use pure white or #FFFBFE */
  --md-sys-color-on-background: #1C1B1F; /* Black/Dark Gray */
  /* Surface (White) */
  --md-sys-color-surface: #FFFFFF; /* Use pure white or #FFFBFE */
  --md-sys-color-on-surface: #1C1B1F; /* Black/Dark Gray */
  --md-sys-color-surface-variant: #EEEEEE; /* Lighter Gray */
  --md-sys-color-on-surface-variant: #424242; /* Mid-Dark Gray */
  /* Outline */
  --md-sys-color-outline: #BDBDBD; /* Mid-Light Gray */
  --md-sys-color-outline-variant: #E0E0E0; /* Light Gray */
  /* Inverse (Keep for potential dark mode) */
  --md-sys-color-inverse-surface: #313033;
  --md-sys-color-inverse-on-surface: #F4EFF4;
  --md-sys-color-inverse-primary: #D0BCFF; /* Needs adjustment for neutral */
  /* Shadow */
  --md-sys-color-shadow: #000000;
  /* Surface Tints (Neutralize or remove usage) - Base on Black with low opacity */
  --md-sys-color-surface-tint-layer-1: rgba(0, 0, 0, 0.02);
  --md-sys-color-surface-tint-layer-2: rgba(0, 0, 0, 0.03);
  --md-sys-color-surface-tint-layer-3: rgba(0, 0, 0, 0.04);
  --md-sys-color-surface-tint-layer-4: rgba(0, 0, 0, 0.05);
  --md-sys-color-surface-tint-layer-5: rgba(0, 0, 0, 0.06);

  /* Re-map to shorter names for convenience */
  --primary-color: var(--md-sys-color-primary);
  --primary-container: var(--md-sys-color-primary-container);
  --on-primary-container: var(--md-sys-color-on-primary-container);
  --secondary-color: var(--md-sys-color-secondary);
  --secondary-container: var(--md-sys-color-secondary-container);
  --on-secondary-container: var(--md-sys-color-on-secondary-container);
  --background-color: var(--md-sys-color-background);
  --surface-color: var(--md-sys-color-surface);
  --on-surface-color: var(--md-sys-color-on-surface);
  --surface-variant: var(--md-sys-color-surface-variant);
  --on-surface-variant: var(--md-sys-color-on-surface-variant);
  --outline-color: var(--md-sys-color-outline);
  --error-color: var(--md-sys-color-error);
  --on-background: var(--md-sys-color-on-background);
}

/* 移除 main.css 中可能冲突的容器定义 */
.app-container {
  /* height: 100vh; */ /* Let layout handle height */
  /* display: flex; */ /* Let layout handle display */
  /* flex-direction: column; */
}

img, svg {
  max-width: 100%;
  height: auto;
  display: block; /* 防止下方出现额外空白 */
}

a {
  color: var(--primary-color);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Element Plus 主题变量覆盖 (示例，可能需要根据实际需要调整) */
/* 如果使用 Element Plus 的 SCSS 变量系统会更方便 */
:root {
  /* --el-color-primary: var(--primary-color); */
  /* --el-border-radius-base: 4px; */ /* M3 small is 4px */
  /* Add more overrides as needed */
}

</style> 