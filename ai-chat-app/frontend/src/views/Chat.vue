<template>
  <div class="chat-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>AI Chat</h2>
        <button @click="logout" class="logout-btn">退出</button>
      </div>

      <nav class="nav">
        <router-link to="/chat" class="nav-item active">
          <span>💬</span> AI 聊天
        </router-link>
        <router-link to="/friends" class="nav-item">
          <span>👥</span> 好友
        </router-link>
        <router-link to="/ai-tools" class="nav-item">
          <span>🛠️</span> AI 工具
        </router-link>
      </nav>

      <div class="sessions">
        <h3>会话列表</h3>
        <button @click="createAISession" class="new-chat-btn">
          + 新建 AI 对话
        </button>
        <div 
          v-for="session in chatStore.sessions" 
          :key="session._id"
          :class="['session-item', { active: chatStore.currentSession?._id === session._id }]"
          @click="selectSession(session._id)"
        >
          <div class="session-avatar">
            {{ session.isAI ? '🤖' : '👤' }}
          </div>
          <div class="session-info">
            <div class="session-name">
              {{ session.isAI ? 'AI 助手' : '好友对话' }}
            </div>
            <div v-if="session.lastMessage" class="last-message">
              {{ session.lastMessage.content.slice(0, 20) }}...
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 聊天主区域 -->
    <main class="chat-main">
      <div v-if="!chatStore.currentSession" class="no-session">
        <p>请选择或创建一个会话开始聊天</p>
      </div>

      <div v-else class="chat-content">
        <div class="chat-header">
          <h3>{{ chatStore.currentSession.isAI ? '🤖 AI 助手' : '👤 好友对话' }}</h3>
        </div>

        <div class="messages" ref="messagesContainer">
          <div 
            v-for="message in chatStore.messages" 
            :key="message._id"
            :class="['message', message.senderId === userId ? 'own' : 'other']"
          >
            <div class="message-avatar">
              {{ message.senderId === userId ? '🧑' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-bubble">
                {{ message.content }}
              </div>
              <div class="message-time">
                {{ formatTime(message.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <input 
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="输入消息..."
          />
          <button @click="sendMessage" :disabled="!inputMessage.trim()">
            发送
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const userId = authStore.user?._id || ''
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const createAISession = async () => {
  await chatStore.createAISession()
}

const selectSession = async (sessionId: string) => {
  await chatStore.selectSession(sessionId)
  await nextTick()
  scrollToBottom()
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  await chatStore.sendMessage(inputMessage.value)
  inputMessage.value = ''
  
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  await chatStore.loadSessions()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  color: #333;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.nav {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  flex: 1;
  padding: 0.75rem;
  text-align: center;
  text-decoration: none;
  color: #666;
  background: #f5f5f5;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.nav-item.active,
.nav-item:hover {
  background: #667eea;
  color: white;
}

.sessions {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.sessions h3 {
  margin-bottom: 1rem;
  color: #333;
}

.new-chat-btn {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

.session-item:hover {
  background: #f5f5f5;
}

.session-item.active {
  background: #e8eaff;
}

.session-avatar {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.session-info {
  flex: 1;
  overflow: hidden;
}

.session-name {
  font-weight: 500;
  color: #333;
}

.last-message {
  font-size: 0.85rem;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.no-session {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.chat-header h3 {
  margin: 0;
  color: #333;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
}

.message.own {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 2rem;
}

.message-content {
  max-width: 60%;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: #fff;
  color: #333;
}

.message.own .message-bubble {
  background: #667eea;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
  text-align: right;
}

.input-area {
  padding: 1.5rem;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
}

.input-area input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 2rem;
  font-size: 1rem;
}

.input-area input:focus {
  outline: none;
  border-color: #667eea;
}

.input-area button {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 1rem;
}

.input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
