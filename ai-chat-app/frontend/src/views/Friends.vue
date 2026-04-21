<template>
  <div class="friends-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>AI Chat</h2>
        <button @click="logout" class="logout-btn">退出</button>
      </div>

      <nav class="nav">
        <router-link to="/chat" class="nav-item">
          <span>💬</span> AI 聊天
        </router-link>
        <router-link to="/friends" class="nav-item active">
          <span>👥</span> 好友
        </router-link>
        <router-link to="/ai-tools" class="nav-item">
          <span>🛠️</span> AI 工具
        </router-link>
      </nav>
    </aside>

    <main class="friends-main">
      <div class="friends-content">
        <h1>好友管理</h1>

        <!-- 添加好友 -->
        <div class="add-friend-section">
          <h3>添加好友</h3>
          <div class="add-friend-form">
            <input 
              v-model="friendUsername"
              type="text" 
              placeholder="输入好友用户名"
            />
            <button @click="addFriend" :disabled="!friendUsername.trim()">
              添加
            </button>
          </div>
        </div>

        <!-- 好友请求 -->
        <div v-if="friendStore.pendingRequests.length > 0" class="requests-section">
          <h3>好友请求</h3>
          <div 
            v-for="request in friendStore.pendingRequests" 
            :key="request._id"
            class="request-item"
          >
            <div class="request-info">
              <span class="request-avatar">👤</span>
              <span>{{ request.username }}</span>
            </div>
            <div class="request-actions">
              <button @click="acceptRequest(request._id)" class="accept-btn">接受</button>
              <button @click="rejectRequest(request._id)" class="reject-btn">拒绝</button>
            </div>
          </div>
        </div>

        <!-- 好友列表 -->
        <div class="friends-list-section">
          <h3>我的好友 ({{ friendStore.friends.length }})</h3>
          <div v-if="friendStore.friends.length === 0" class="no-friends">
            <p>暂无好友，快去添加吧！</p>
          </div>
          <div 
            v-else
            v-for="friend in friendStore.friends" 
            :key="friend._id"
            class="friend-item"
          >
            <div class="friend-avatar">👤</div>
            <div class="friend-info">
              <div class="friend-name">{{ friend.username }}</div>
              <div :class="['friend-status', friend.status]">
                {{ friend.status === 'online' ? '在线' : '离线' }}
              </div>
            </div>
            <button @click="startChat(friend._id)" class="chat-btn">
              发消息
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFriendStore } from '../stores/friend'

const router = useRouter()
const authStore = useAuthStore()
const friendStore = useFriendStore()

const friendUsername = ref('')

const addFriend = async () => {
  if (!friendUsername.value.trim()) return
  try {
    await friendStore.addFriend(friendUsername.value)
    friendUsername.value = ''
    alert('好友请求已发送')
  } catch (error) {
    alert('添加失败，请重试')
  }
}

const acceptRequest = async (friendId: string) => {
  try {
    await friendStore.acceptRequest(friendId)
    await loadAll()
  } catch (error) {
    alert('操作失败')
  }
}

const rejectRequest = async (friendId: string) => {
  try {
    await friendStore.rejectRequest(friendId)
    await loadAll()
  } catch (error) {
    alert('操作失败')
  }
}

const startChat = (friendId: string) => {
  // TODO: 创建或切换到与好友的聊天会话
  router.push('/chat')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const loadAll = async () => {
  await friendStore.loadFriends()
  await friendStore.loadPendingRequests()
}

onMounted(() => {
  loadAll()
})
</script>

<style scoped>
.friends-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
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
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem;
  text-align: left;
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

.friends-main {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
}

.friends-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h3 {
  color: #333;
  margin-bottom: 1rem;
}

.add-friend-section,
.requests-section,
.friends-list-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-friend-form {
  display: flex;
  gap: 1rem;
}

.add-friend-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.add-friend-form input:focus {
  outline: none;
  border-color: #667eea;
}

.add-friend-form button {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.add-friend-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.request-item,
.friend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.request-item:last-child,
.friend-item:last-child {
  border-bottom: none;
}

.request-info,
.friend-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.request-avatar,
.friend-avatar {
  font-size: 2rem;
}

.request-actions {
  display: flex;
  gap: 0.5rem;
}

.accept-btn {
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.reject-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.friend-name {
  font-weight: 500;
  color: #333;
}

.friend-status {
  font-size: 0.85rem;
  color: #999;
}

.friend-status.online {
  color: #4caf50;
}

.chat-btn {
  padding: 0.5rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.no-friends {
  text-align: center;
  color: #999;
  padding: 2rem 0;
}
</style>
