<template>
  <div class="learning-container">
    <h1>知识学习</h1>
    <p>知识学习页面正在开发中...</p>
    <router-link to="/insight-spot" class="insight-link">前往知识洞察页面</router-link>
  </div>
</template>

<script setup lang="ts">
// 学习视图组件逻辑
</script>

<style scoped>
.learning-container {
  padding: 20px;
}

.insight-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.insight-link:hover {
  background-color: #5641a5;
  text-decoration: none;
}
</style> 