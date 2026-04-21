import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface Friend {
  _id: string
  username: string
  avatar?: string
  status: 'online' | 'offline'
}

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<Friend[]>([])
  const pendingRequests = ref<Friend[]>([])

  const loadFriends = async () => {
    const res = await axios.get('/api/friends')
    friends.value = res.data.friends
  }

  const addFriend = async (username: string) => {
    await axios.post('/api/friends/request', { username })
  }

  const acceptRequest = async (friendId: string) => {
    await axios.post(`/api/friends/accept/${friendId}`)
    await loadFriends()
  }

  const rejectRequest = async (friendId: string) => {
    await axios.post(`/api/friends/reject/${friendId}`)
  }

  const loadPendingRequests = async () => {
    const res = await axios.get('/api/friends/requests')
    pendingRequests.value = res.data.requests
  }

  return { friends, pendingRequests, loadFriends, addFriend, acceptRequest, rejectRequest, loadPendingRequests }
})
