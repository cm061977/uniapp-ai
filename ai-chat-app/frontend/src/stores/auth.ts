import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface User {
  _id: string
  username: string
  email: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(null)

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', token.value)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await axios.post('/api/auth/register', { username, email, password })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', token.value)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const loadUser = async () => {
    if (token.value) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        const res = await axios.get('/api/auth/me')
        user.value = res.data.user
      } catch (error) {
        logout()
      }
    }
  }

  return { token, user, login, register, logout, loadUser }
})
