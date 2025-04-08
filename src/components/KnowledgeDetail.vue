<template>
  <div class="knowledge-detail">
    <div class="knowledge-header">
      <h1>{{ knowledge.title }}</h1>
      <p class="knowledge-content">{{ knowledge.content }}</p>
    </div>
    <div class="chat-container">
      <div class="chat-history" ref="chatHistoryRef">
        <!-- 系统初始消息 -->
        <div class="message system">
          <div class="message-content">
            <p>欢迎来到知识点学习！您可以：</p>
            <ul>
              <li>输入问题进行提问（解答模式）</li>
              <li>输入"练习"开始答题（提问练习模式）</li>
            </ul>
          </div>
        </div>
        <!-- 聊天记录 -->
        <div v-for="(message, index) in chatHistory" 
             :key="index" 
             :class="['message', message.type]">
          <div class="avatar">
            {{ message.type === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="message-content" v-html="formatMessage(message.text)"></div>
        </div>
        <!-- 输入状态提示 -->
        <div v-if="isTyping" class="message system typing">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div class="input-container">
        <textarea 
          v-model="userInput" 
          placeholder="输入问题或回答..."
          @keydown.enter.prevent="handleEnterPress"
          @input="adjustTextareaHeight"
          ref="inputRef"
          rows="1"
        ></textarea>
        <button @click="handleSubmit" :disabled="isTyping || !userInput.trim()">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { marked } from 'marked';

const knowledge = ref({ 
  id: '1',
  title: '机器学习基础概念', 
  content: '机器学习是人工智能的一个子领域，它使计算机系统能够通过经验自动改进。本章节将介绍机器学习的基本概念、类型以及应用场景。' 
});
const userInput = ref('');
const chatHistory = ref([]);
const isTyping = ref(false);
const chatHistoryRef = ref(null);
const inputRef = ref(null);
const currentMode = ref('answer'); // 'answer' 或 'practice'

// 格式化消息，支持Markdown
const formatMessage = (text) => {
  return marked(text);
};

// 处理回车键
const handleEnterPress = (e) => {
  if (e.shiftKey) return; // Shift+Enter 换行
  handleSubmit();
};

// 自动调整输入框高度
const adjustTextareaHeight = () => {
  const textarea = inputRef.value;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
  }
};

// 提交消息
const handleSubmit = async () => {
  if (!userInput.value.trim() || isTyping.value) return;
  
  const message = { 
    type: 'user', 
    text: userInput.value,
    timestamp: new Date().toISOString()
  };
  
  chatHistory.value.push(message);
  userInput.value = '';
  adjustTextareaHeight();
  await scrollToBottom();
  
  isTyping.value = true;
  
  try {
    // 模拟API响应
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
    
    let answer;
    if (message.text.trim().toLowerCase() === '练习') {
      currentMode.value = 'practice';
      answer = { 
        type: 'system', 
        text: '好的，让我们开始练习。\n\n请问：监督学习和无监督学习的主要区别是什么？',
        timestamp: new Date().toISOString()
      };
    } else if (currentMode.value === 'practice') {
      answer = { 
        type: 'system', 
        text: '很好的回答！让我补充一下：\n\n监督学习使用带标签的数据进行训练，而无监督学习使用未标记的数据。监督学习的目标是学习输入到输出的映射，而无监督学习的目标是发现数据中的模式和结构。\n\n你想继续练习吗？',
        timestamp: new Date().toISOString()
      };
    } else {
      answer = { 
        type: 'system', 
        text: `让我帮你解答这个问题。\n\n${message.text}\n\n这是一个很好的问题。根据当前的知识点，我可以这样解释：机器学习通过算法使计算机能够从数据中学习和改进，而不需要明确编程。这种学习过程主要依赖于数据的质量和数量，以及选择的算法类型。`,
        timestamp: new Date().toISOString()
      };
    }
    
    chatHistory.value.push(answer);
  } catch (error) {
    chatHistory.value.push({
      type: 'system',
      text: '抱歉，系统出现了一些问题，请稍后重试。',
      timestamp: new Date().toISOString()
    });
    console.error('Error submitting message:', error);
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};

// 监听聊天记录变化，自动滚动到底部
watch(chatHistory, () => {
  scrollToBottom();
});

onMounted(async () => {
  // 使用模拟数据，不需要调用API
  // try {
  //   const response = await axios.get('/api/knowledge');
  //   knowledge.value = response.data;
  // } catch (error) {
  //   console.error('Error fetching knowledge:', error);
  // }
});
</script>

<style scoped>
.knowledge-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.knowledge-header {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.knowledge-content {
  line-height: 1.6;
  color: #333;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.avatar {
  width: 30px;
  height: 30px;
  margin-right: 12px;
  font-size: 20px;
}

.message-content {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 1.5;
}

.user .message-content {
  background: #007bff;
  color: white;
}

.system .message-content {
  background: #f8f9fa;
  color: #333;
}

.typing {
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.input-container {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #fff;
  border-top: 1px solid #eee;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  max-height: 120px;
  font-family: inherit;
}

button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 自定义滚动条样式 */
.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-history::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 