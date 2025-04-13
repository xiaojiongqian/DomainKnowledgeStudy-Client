<template>
  <div class="error-container" v-if="hasError">
    <div class="error-card">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">{{ title || '出错了' }}</h3>
      <p class="error-message">{{ message || '加载过程中出现错误，请刷新页面重试' }}</p>
      <button class="retry-button" @click="handleRetry">重试</button>
      <div class="error-details" v-if="details">
        <h4 class="details-title">错误详情：</h4>
        <pre class="details-content">{{ details }}</pre>
      </div>
    </div>
  </div>
  
  <div class="loading-container" v-else-if="isLoading">
    <div class="loading-spinner"></div>
    <p class="loading-text">{{ loadingText || '加载中...' }}</p>
  </div>
  
  <slot v-else></slot>
</template>

<script setup lang="ts">
defineProps({
  hasError: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  loadingText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['retry'])

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 20px;
}

.error-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  margin-bottom: 12px;
  color: #333;
}

.error-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.retry-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #5641a5;
}

.error-details {
  margin-top: 24px;
  text-align: left;
}

.details-title {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.details-content {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  overflow-x: auto;
  white-space: pre-wrap;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 