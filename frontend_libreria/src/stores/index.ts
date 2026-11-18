import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: getTokenFromLocalStorage(),
    returnUrl: null as string | null,
  }),
  actions: {
    async login(email: string, clave: string) {
      const response = await http.post('auth/login', { email, clave })
      this.user = response.data.usuario
      this.token = response.data.access_token

      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('token', this.token || '')

      router.push(this.returnUrl || '/')
    },
    logout() {
      localStorage.clear()
      this.user = null
      this.token = null
      router.push('/login')
    },
  },
})
