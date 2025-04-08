<template>
  <div class="chat-interface">
    <!-- 知识点标题 -->
    <div class="content-header" v-if="knowledgePoint">
      <h2>{{ knowledgePoint.label }}</h2>
    </div>
    
    <!-- 主要滚动区域 -->
    <div class="chat-messages" ref="chatMessagesRef">
      <!-- 初始知识点内容 -->
      <div class="chat-message system" v-if="knowledgePoint">
        <div class="message-text" v-html="knowledgePoint.content"></div>
      </div>
      
      <!-- 欢迎消息 -->
      <div class="chat-message system" v-if="knowledgePoint && chatHistory.length === 0">
        <div class="message-text">
          <p>您正在学习 <strong>{{ knowledgePoint.label }}</strong>。有任何问题都可以向我提问！</p>
        </div>
      </div>
      
      <!-- 对话历史 -->
      <div v-for="(msg, index) in chatHistory" :key="index" class="chat-message" :class="msg.role">
        <div class="message-text" v-html="formatMessage(msg.content)"></div>
      </div>
      
      <!-- 正在输入提示 -->
      <div v-if="loading" class="chat-message system is-loading">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area" v-if="knowledgePoint">
      <div class="input-bar">
        <textarea 
          v-model="userQuestion" 
          :placeholder="inputPlaceholder"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.stop
          @input="autoResizeTextarea"
          ref="questionInputRef"
          rows="1"
          class="chat-input"
        ></textarea>
        <button 
          class="send-button" 
          @click="sendMessage" 
          :disabled="!userQuestion.trim() || loading"
          :class="{ 'is-disabled': !userQuestion.trim() || loading }"
        >
          发送
        </button>
      </div>
      
      <!-- 模式切换按钮 -->
      <div class="mode-switcher">
        <button 
          class="mode-button" 
          :class="{ active: dialogMode === 'answer' }"
          @click="dialogMode = 'answer'"
        >
          解答模式
        </button>
        <button 
          class="mode-button" 
          :class="{ active: dialogMode === 'question' }"
          @click="switchToPracticeMode"
        >
          练习模式
        </button>
      </div>
    </div>
    
    <el-empty v-if="!knowledgePoint" description="正在加载知识点..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

// 定义知识点类型接口
interface KnowledgePoint {
  id: string
  label: string
  children?: KnowledgePoint[]
  content?: string
  relatedIds?: string[]
}

const props = defineProps<{
  knowledgePoint: KnowledgePoint | null
  allPoints?: KnowledgePoint[]
}>()

const emit = defineEmits<{
  (e: 'select', point: KnowledgePoint): void
}>()

// 对话相关
const dialogMode = ref<'answer' | 'question'>('answer') // 对话模式：解答或提问
const chatHistory = ref<{ role: 'user' | 'system', content: string }[]>([])
const userQuestion = ref('')
const loading = ref(false)
const chatMessagesRef = ref<HTMLElement | null>(null)
const questionInputRef = ref<HTMLTextAreaElement | null>(null)

// 格式化消息，支持Markdown
function formatMessage(content: string) {
  return content;
}

// 自动调整输入框高度
function autoResizeTextarea() {
  const textarea = questionInputRef.value;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

// 计算输入框占位符
const inputPlaceholder = computed(() => {
  return dialogMode.value === 'answer' 
    ? '输入问题...(输入"练习"切换到练习模式)' 
    : '输入你的答案...';
});

// 监听聊天历史变化，自动滚动
const scrollToBottom = async () => {
  await nextTick();
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }
};

watch(chatHistory, () => {
  scrollToBottom();
});

// 发送消息
async function sendMessage() {
  if (!userQuestion.value.trim() || loading.value) return;
  
  const userInput = userQuestion.value.trim();
  userQuestion.value = '';
  autoResizeTextarea();
  
  // 检查是否是切换到练习模式的命令
  if (userInput.toLowerCase() === '练习' && dialogMode.value === 'answer') {
    // 添加用户消息
    chatHistory.value.push({ role: 'user', content: userInput });
    
    // 切换到练习模式
    dialogMode.value = 'question';
    
    // 添加系统消息，开始练习
    chatHistory.value.push({ 
      role: 'system', 
      content: `已切换到<strong>练习模式</strong>。我将根据"${props.knowledgePoint?.label}"的内容，提出相关问题帮助你巩固学习。` 
    });
    
    await nextTick();
    scrollToBottom();
    generateNewSystemQuestion();
    return;
  }
  
  // 添加用户消息到聊天历史
  chatHistory.value.push({ role: 'user', content: userInput });
  loading.value = true;
  
  try {
    await nextTick();
    scrollToBottom();
    
    // 根据不同模式处理用户输入
    if (dialogMode.value === 'answer') {
      // 解答模式 - 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      chatHistory.value.push({ 
        role: 'system', 
        content: `关于"${userInput}"的解答：\n\n这是一个关于${props.knowledgePoint?.label}的问题。根据知识库内容，${userInput.length > 30 ? userInput.substring(0, 30) + '...' : userInput} 的答案是...\n\n这里是详细解释，基于知识点内容生成的回答。`
      });
    } else {
      // 练习模式 - 评估用户回答
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      chatHistory.value.push({ 
        role: 'system', 
        content: `你的回答分析：\n\n非常好！你的回答涵盖了关键点。\n\n补充说明：${props.knowledgePoint?.label}的这个概念还包含了一些其他重要方面...\n\n你想继续练习下一个问题吗？`
      });
      
      // 在评估后，准备下一个问题
      setTimeout(() => {
        generateNewSystemQuestion();
      }, 2000);
    }
    
  } catch (error) {
    console.error('处理消息失败', error);
    chatHistory.value.push({ 
      role: 'system', 
      content: '<p class="error-message">抱歉，处理您的消息时出现了问题。请稍后再试。</p>' 
    });
  } finally {
    loading.value = false;
    await nextTick();
    scrollToBottom();
    // 聚焦输入框
    if (questionInputRef.value) {
      questionInputRef.value.focus();
    }
  }
}

// 切换到练习模式
function switchToPracticeMode() {
  if (dialogMode.value === 'question') return;
  
  // 切换到练习模式
  dialogMode.value = 'question';
  
  // 添加系统消息，开始练习
  chatHistory.value.push({ 
    role: 'system', 
    content: `已切换到<strong>练习模式</strong>。我将根据"${props.knowledgePoint?.label}"的内容，提出相关问题帮助你巩固学习。` 
  });
  
  // 生成第一个练习题
  nextTick().then(() => {
    scrollToBottom();
    generateNewSystemQuestion();
  });
}

// 生成系统提问
const generateNewSystemQuestion = async () => {
  if (!props.knowledgePoint) return;
  
  try {
    // 模拟生成问题
    const questions = [
      `${props.knowledgePoint.label}主要解决了什么问题？`,
      `${props.knowledgePoint.label}的应用场景有哪些？`,
      `${props.knowledgePoint.label}的核心概念是什么？`,
      `为什么${props.knowledgePoint.label}在领域知识中很重要？`,
      `${props.knowledgePoint.label}与其他相关知识点有什么区别？`
    ];
    
    // 添加问题到聊天历史
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    chatHistory.value.push({
      role: 'system',
      content: `<p>请回答以下问题：</p><p><strong>${questions[Math.floor(Math.random() * questions.length)]}</strong></p>`
    });
    
    scrollToBottom();
  } catch (error) {
    console.error('生成问题失败', error);
  }
};

// 监听知识点变化，重置对话
watch(() => props.knowledgePoint, () => {
  chatHistory.value = [];
  userQuestion.value = '';
  dialogMode.value = 'answer';
});
</script>

<style>
/* 全局样式覆盖 - 确保没有嵌套滚动条 */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.chat-interface,
.el-scrollbar, .el-scrollbar__wrap, .el-scrollbar__view, .el-card, .el-card__body {
  overflow: visible !important;
  height: auto !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<style scoped>
/* 主容器 */
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;
  max-width: 1200px;
  margin: 0 auto;
}

/* 标题区域 */
.content-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e6e6e6;
  flex-shrink: 0;
  background-color: white;
}

.content-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

/* 唯一的滚动区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;
}

/* 消息样式 */
.chat-message {
  margin-bottom: 8px;
  max-width: 80%;
}

.chat-message.system {
  align-self: flex-start;
}

.chat-message.user {
  align-self: flex-end;
}

.message-text {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.system .message-text {
  background-color: #f5f5f5;
  color: #333;
  border-top-left-radius: 0;
}

.user .message-text {
  background-color: #e1f5fe;
  color: #0288d1;
  border-top-right-radius: 0;
}

.message-text p:first-child {
  margin-top: 0;
}

.message-text p:last-child {
  margin-bottom: 0;
}

/* 输入区域 */
.input-area {
  padding: 16px 20px;
  border-top: 1px solid #e6e6e6;
  flex-shrink: 0;
  background-color: white;
}

.input-bar {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.chat-input {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  color: #333;
}

.send-button {
  padding: 8px 16px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.send-button:hover:not(.is-disabled) {
  background-color: #66b1ff;
}

.send-button.is-disabled {
  background-color: #bfbfbf;
  cursor: not-allowed;
}

/* 模式切换样式 */
.mode-switcher {
  display: flex;
  gap: 8px;
}

.mode-button {
  flex: 1;
  padding: 8px 16px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  color: #606266;
}

.mode-button.active {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.mode-button:hover:not(.active) {
  background-color: #f0f2f5;
}

/* 加载动画 */
.is-loading {
  min-height: 36px;
  align-self: flex-start;
}

.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.3s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

/* 错误消息 */
.error-message {
  color: #f5222d;
}
</style> 