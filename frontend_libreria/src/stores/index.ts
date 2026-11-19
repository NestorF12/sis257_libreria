import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import { getTokenFromLocalStorage } from '@/helpers/index'
import http from '@/plugins/axios'
import router from '@/router'

export interface AuthUser {
  id?: number | string
  usuario?: string
  email?: string
  nombre?: string
  rol?: string
  role?: string
  [key: string]: unknown
}

interface JwtPayload {
  sub?: number | string
  id?: number | string
  usuario?: string
  username?: string
  email?: string
  nombre?: string
  rol?: string
  role?: string
  [key: string]: unknown
}

function decodeJwtPayload(token: string | null): JwtPayload | null {
  if (!token) return null
  try {
    const parts = token.split('.')
    const base64Url = parts[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    const parsed: unknown = JSON.parse(jsonPayload)
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as JwtPayload
    }
    return null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = getTokenFromLocalStorage()
    const payload = decodeJwtPayload(token)
    const storedUser = localStorage.getItem('user')
    let parsedUser: AuthUser | null = null

    if (storedUser) {
      try {
        const rawParsed: unknown = JSON.parse(storedUser)
        if (typeof rawParsed === 'object' && rawParsed !== null) {
          parsedUser = rawParsed as AuthUser
        }
      } catch {
        parsedUser = null
      }
    }

    const fallbackUser: AuthUser | null = payload
      ? {
          id: payload.sub ?? payload.id,
          usuario: payload.usuario ?? payload.username ?? payload.email ?? '',
          email: payload.email,
          nombre: payload.nombre ?? payload.usuario ?? payload.email ?? 'Usuario',
          rol: payload.rol ?? payload.role ?? '',
        }
      : null

    return {
      user: parsedUser ?? fallbackUser,
      token: token || null,
      returnUrl: null as string | null,
    }
  },

  getters: {
    rol(state): string {
      const rawRol = state.user?.rol ?? state.user?.role ?? decodeJwtPayload(state.token)?.rol ?? ''
      return String(rawRol).toLowerCase().trim()
    },
    isVendedor(): boolean {
      return this.rol === 'vendedor'
    },
    isComprador(): boolean {
      return this.rol === 'comprador'
    },
  },

  actions: {
    async login(usuario: string, clave: string) {
      const identificador = usuario.trim()
      const password = clave.trim()

      // Ajusta las claves según tu LoginDto en NestJS (por defecto envía usuario y clave;
      // si tu DTO espera email y/o password, cámbialo aquí directamente)
      let response
      try {
        response = await http.post('auth/login', {
          usuario: identificador,
          clave: password,
        })
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 400 && identificador.includes('@')) {
          response = await http.post('auth/login', {
            email: identificador,
            clave: password,
          })
        } else {
          throw err
        }
      }

      const responseData: unknown = response.data
      const recordData =
        typeof responseData === 'object' && responseData !== null
          ? (responseData as Record<string, unknown>)
          : {}

      const innerData =
        typeof recordData.data === 'object' && recordData.data !== null
          ? (recordData.data as Record<string, unknown>)
          : recordData

      const rawToken = innerData.access_token ?? innerData.token ?? innerData.accessToken ?? ''
      const accessToken = typeof rawToken === 'string' && rawToken.trim() ? rawToken.trim() : ''
      const payload = decodeJwtPayload(accessToken)

      const rawUserObj = innerData.usuario ?? innerData.user
      const userData: AuthUser =
        typeof rawUserObj === 'object' && rawUserObj !== null
          ? (rawUserObj as AuthUser)
          : {
              id: payload?.sub ?? payload?.id,
              usuario: identificador,
              nombre: payload?.nombre ?? identificador,
              rol: payload?.rol ?? payload?.role ?? '',
            }

      this.token = accessToken || null
      this.user = userData

      if (accessToken) {
        localStorage.setItem('token', accessToken)
      } else {
        localStorage.removeItem('token')
      }
      localStorage.setItem('user', JSON.stringify(userData))

      const destino = this.returnUrl || '/'
      this.returnUrl = null
      await router.push(destino)
    },

    logout() {
      this.token = null
      this.user = null
      this.returnUrl = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    },
  },
})

export default useAuthStore

export { useCarritoStore } from './carrito'
