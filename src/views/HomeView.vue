<template>
  <div class="home-container">
    <h1>领域知识学习系统</h1>
    <p class="subtitle">通过AI工具和领域知识库，提供高效的学习和考核平台，帮助您系统地掌握专业知识</p>
    
    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <img src="@/assets/Icon_learning.svg" alt="知识学习" />
        </div>
        <h3>知识学习</h3>
        <p>基于知识库生成学习大纲，在交互式问答界面中学习知识点</p>
        <router-link to="/learning" class="feature-link">开始学习</router-link>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <img src="@/assets/Icon_exam.svg" alt="知识测验" />
        </div>
        <h3>知识测验</h3>
        <p>从题库随机抽题，选择题自动批改，问答题由LLM批改</p>
        <router-link to="/exam" class="feature-link">开始测验</router-link>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <img src="@/assets/Icon_statistics.svg" alt="学习统计" />
        </div>
        <h3>学习统计</h3>
        <p>查看学习进展、考试结果分析，掌握学习薄弱环节</p>
        <router-link to="/statistics" class="feature-link">查看统计</router-link>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <img src="@/assets/Icon_insightspot.svg" alt="知识洞察" />
        </div>
        <h3>知识洞察</h3>
        <p>智能分析知识点关系，提供个性化学习建议</p>
        <router-link to="/insight-spot" class="feature-link">探索洞察</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页组件逻辑
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

h1 {
  font-size: 26px;
  color: var(--primary-color);
  margin-bottom: 12px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 48px;
  line-height: 1.5;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(224px, 1fr));
  gap: 24px;
}

.feature-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 51px;
  height: 51px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature-icon img {
  width: 100%;
  height: 100%;
  transition: filter 0.3s ease;
}

.feature-card:hover .feature-icon img {
  filter: brightness(0) saturate(100%) invert(35%) sepia(43%) saturate(1546%) hue-rotate(228deg) brightness(90%) contrast(85%);
}

.feature-card h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}

.feature-link {
  display: inline-block;
  padding: 6px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  transition: background-color 0.2s;
}

.feature-link:hover {
  background-color: #5641a5;
  text-decoration: none;
}
</style> 