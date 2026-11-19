import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/index'
import { getTokenFromLocalStorage } from '@/helpers/index'

import HomeView from '@/views/HomeView.vue'
import LibrosView from '@/views/LibroView.vue'
import AutoresView from '@/views/AutorView.vue'
import CategoriasView from '@/views/CategoriaView.vue'
import UsuarioView from '@/views/UsuarioView.vue'
import VentasView from '@/views/VentaView.vue'
import DetalleVentasView from '@/views/DetalleVentaView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistroView from '@/views/RegistroView.vue'
import CarritoView from '@/views/CarritoView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
    public?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { public: true },
        },
        {
          path: 'home',
          redirect: { name: 'home' },
        },
        {
          path: 'libros',
          name: 'libros',
          component: LibrosView,
          meta: { roles: ['vendedor', 'comprador'] },
        },
        {
          path: 'autores',
          name: 'autores',
          component: AutoresView,
          meta: { roles: ['vendedor', 'comprador'] },
        },
        {
          path: 'categorias',
          name: 'categorias',
          component: CategoriasView,
          meta: { roles: ['vendedor', 'comprador'] },
        },
        {
          path: 'carrito',
          name: 'carrito',
          component: CarritoView,
          meta: { roles: ['comprador'] },
        },
        {
          path: 'ventas',
          name: 'ventas',
          component: VentasView,
          meta: { roles: ['vendedor', 'comprador'] },
        },
        {
          path: 'detalle-ventas',
          name: 'detalle-ventas',
          component: DetalleVentasView,
          meta: { roles: ['vendedor', 'comprador'] },
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: UsuarioView,
          meta: { roles: ['vendedor'] },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegistroView,
      meta: { public: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const token = authStore.token || getTokenFromLocalStorage()
  const isPublic = to.meta.public === true

  // 1. Si no es público y no hay sesión -> ir a Iniciar Sesión
  if (!isPublic && !token) {
    authStore.returnUrl = to.fullPath
    return { name: 'login' }
  }

  // 2. Si ya inició sesión e intenta entrar a /login o /registro -> ir a Home
  if ((to.name === 'login' || to.name === 'registro') && token) {
    return { name: 'home' }
  }

  // 3. Validar rol en rutas protegidas
  const allowedRoles = to.meta.roles
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && token) {
    const userRole = authStore.rol
    if (!userRole || !allowedRoles.includes(userRole)) {
      return { name: 'home' }
    }
  }
})

export default router
