<template>
  <el-dialog
    v-model="dialogVisible"
    title="知识点问答"
    width="70%"
    class="qa-dialog"
  >
    <div class="chat-container">
      <div class="chat-messages" ref="chatMessagesRef">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']"
        >
          <div class="avatar">
            <el-avatar
              :size="40"
              :src="message.role === 'user' ? userAvatar : aiAvatar"
            />
          </div>
          <div class="message-content">
            <div class="message-text" v-html="message.content"></div>
            <div class="message-time">{{ formatTime(message.time) }}</div>
          </div>
        </div>
        <div v-if="isLoading" class="loading-message">
          <div class="avatar">
            <el-avatar :size="40" :src="aiAvatar" />
          </div>
          <div class="message-content">
            <el-skeleton :rows="3" animated />
          </div>
        </div>
      </div>

      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          placeholder="输入您的问题..."
          :disabled="isLoading"
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button @click="sendMessage" :disabled="isLoading || !inputMessage.trim()">
              发送
            </el-button>
          </template>
        </el-input>
        <div class="suggested-questions" v-if="suggestedQuestions.length > 0">
          <span class="question-label">建议问题：</span>
          <el-tag
            v-for="(question, index) in suggestedQuestions"
            :key="index"
            class="suggested-question-tag"
            @click="askSuggestedQuestion(question)"
          >
            {{ question }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { qaApi } from '@/services/apiService'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time: Date
}

const props = defineProps<{
  visible: boolean
  initialQuestion?: string
  knowledgePointId?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}>()

// 定义变量
const dialogVisible = ref(props.visible)
const inputMessage = ref('')
const isLoading = ref(false)
const chatMessages = ref<ChatMessage[]>([])
const chatMessagesRef = ref<HTMLElement | null>(null)
const userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const aiAvatar = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'

// 建议问题
const suggestedQuestions = ref<string[]>([])

// 对话ID
const conversationId = ref<string | undefined>(undefined)

// 监听对话框可见性
watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue
  if (newValue && props.initialQuestion) {
    nextTick(() => {
      askQuestion(props.initialQuestion || '')
    })
  }
  
  // 加载建议问题
  if (newValue && props.knowledgePointId) {
    loadSuggestedQuestions()
  }
})

// 监听对话框状态
watch(dialogVisible, (newValue) => {
  emit('update:visible', newValue)
  if (!newValue) {
    emit('close')
  }
})

// 加载建议问题
const loadSuggestedQuestions = async () => {
  if (!props.knowledgePointId) return
  
  try {
    suggestedQuestions.value = await qaApi.getSuggestedQuestions(props.knowledgePointId)
  } catch (error) {
    console.error('获取建议问题失败', error)
    suggestedQuestions.value = []
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const question = inputMessage.value
  inputMessage.value = ''
  await askQuestion(question)
}

// 提问
const askQuestion = async (question: string) => {
  // 添加用户消息
  chatMessages.value.push({
    role: 'user',
    content: question,
    time: new Date()
  })
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 设置加载状态
  isLoading.value = true
  
  try {
    // 调用问答API
    const response = await qaApi.askQuestion({
      question,
      knowledgePointId: props.knowledgePointId,
      conversationId: conversationId.value
    })
    
    // 更新对话ID
    if (response.conversationId) {
      conversationId.value = response.conversationId
    }
    
    // 更新建议问题
    if (response.suggestedQuestions) {
      suggestedQuestions.value = response.suggestedQuestions
    }
    
    // 添加助手消息
    chatMessages.value.push({
      role: 'assistant',
      content: response.answer,
      time: new Date()
    })
    
    // 滚动到底部
    await nextTick()
    scrollToBottom()
  } catch (error) {
    ElMessage.error('获取回答失败，请稍后再试')
    console.error('问答API调用失败', error)
  } finally {
    isLoading.value = false
  }
}

// 使用预设问题
const askSuggestedQuestion = (question: string) => {
  if (!isLoading.value) {
    inputMessage.value = question
    sendMessage()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.qa-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 60vh;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.avatar {
  margin-right: 10px;
  flex-shrink: 0;
}

.message-content {
  background-color: white;
  padding: 12px 15px;
  border-radius: 8px;
  max-width: 80%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-message .message-content {
  background-color: #e6f7ff;
}

.message-text {
  line-height: 1.6;
}

.message-time {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.loading-message {
  display: flex;
  margin-bottom: 20px;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #ebeef5;
}

.suggested-questions {
  margin-top: 10px;
}

.question-label {
  font-size: 12px;
  color: #909399;
  margin-right: 8px;
}

.suggested-question-tag {
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style> 