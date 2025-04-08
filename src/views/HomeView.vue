<template>
  <div class="home-container">
    <h1 class="welcome-title">欢迎使用领域知识学习系统</h1>
    
    <div class="card-container">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in functionCards" :key="index">
          <el-card class="function-card" @click="navigateTo(item.path)">
            <div class="card-content">
              <el-icon class="card-icon" :size="40">
                <component :is="item.icon" />
              </el-icon>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Reading, Edit, Collection, Setting, User } from '@element-plus/icons-vue'

const router = useRouter()

const functionCards = [
  {
    title: '知识学习',
    description: '浏览和掌握领域知识，通过交互式学习提升理解',
    icon: Reading,
    path: '/learning'
  },
  {
    title: '考试',
    description: '进行在线考试，检验学习成果',
    icon: Edit,
    path: '/exam'
  },
  {
    title: '题库管理',
    description: '管理考试题目，包括添加、修改和删除题目',
    icon: Collection,
    path: '/question-bank'
  },
  {
    title: '系统配置',
    description: '配置系统参数，管理用户权限',
    icon: Setting,
    path: '/configuration'
  },
  {
    title: '个人信息',
    description: '查看和修改个人信息，管理学习记录',
    icon: User,
    path: '/profile'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-title {
  text-align: center;
  margin-bottom: 40px;
  color: #303133;
  font-size: 24px;
}

.card-container {
  margin: 0 auto;
}

.function-card {
  height: 100%;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-content {
  text-align: center;
  padding: 30px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-icon {
  margin-bottom: 20px;
  color: #409EFF;
  font-size: 40px;
}

.card-content h3 {
  margin: 10px 0;
  color: #303133;
  font-size: 18px;
}

.card-content p {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

:deep(.el-row) {
  margin-left: -10px !important;
  margin-right: -10px !important;
}

:deep(.el-col) {
  padding-left: 10px !important;
  padding-right: 10px !important;
  margin-bottom: 20px;
  height: 220px;
}
</style> 