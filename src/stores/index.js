// store.js
import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    username: localStorage.getItem('username') || null,
    login: JSON.parse(localStorage.getItem('login')) || false,
    doing_task: false
  }),
  actions: {
    setUsername(username = null) {
      this.username = username
      localStorage.setItem('username', username)
    },
    setLogin(login = false) {
      this.login = login
      localStorage.setItem('login', JSON.stringify(login))
    },
    setDoingTask(doing_task = false) {
      this.doing_task = doing_task
    }
  }
})
