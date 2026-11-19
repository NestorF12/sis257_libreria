import Axios, { type AxiosInstance } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores'

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT || 'http://localhost:3000/',
})

axios.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (config.headers) {
    config.headers['Content-Type'] = 'application/json'
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const requestUrl = String(error?.config?.url ?? '')
    const isAuthRequest = requestUrl.includes('auth/login') || requestUrl.endsWith('/login')
    const currentRoute = router.currentRoute.value
    const isPublicRoute = currentRoute.matched.some((record) => record.meta?.public === true)

    if (status === 401 && !isAuthRequest && !isPublicRoute) {
      const authStore = useAuthStore()
      authStore.logout()
      if (currentRoute.path !== '/login') {
        router.push('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default axios
