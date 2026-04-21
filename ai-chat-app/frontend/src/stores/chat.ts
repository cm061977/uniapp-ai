import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'ai'
  createdAt: string
}

export interface ChatSession {
  _id: string
  friendId?: string
  isAI: boolean
  lastMessage?: Message
  unreadCount: number
}

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const currentSession = ref<ChatSession | null>(null)
  const messages = ref<Message[]>([])

  const loadSessions = async () => {
    const res = await axios.get('/api/chat/sessions')
    sessions.value = res.data.sessions
  }

  const createAISession = async () => {
    const res = await axios.post('/api/chat/ai')
    const session: ChatSession = res.data.session
    sessions.value.unshift(session)
    return session
  }

  const selectSession = async (sessionId: string) => {
    currentSession.value = sessions.value.find(s => s._id === sessionId) || null
    if (currentSession.value) {
      const res = await axios.get(`/api/chat/${sessionId}/messages`)
      messages.value = res.data.messages
    }
  }

  const sendMessage = async (content: string) => {
    if (!currentSession.value) return
    
    const res = await axios.post(`/api/chat/${currentSession.value._id}/messages`, {
      content,
      type: currentSession.value.isAI ? 'ai' : 'text'
    })
    
    messages.value.push(res.data.message)
    
    if (currentSession.value.isAI) {
      // AI 自动回复
      setTimeout(async () => {
        const aiRes = await axios.post(`/api/chat/${currentSession.value!._id}/ai-reply`, {
          message: content
        })
        messages.value.push(aiRes.data.message)
      }, 500)
    }
  }

  return { sessions, currentSession, messages, loadSessions, createAISession, selectSession, sendMessage }
})
