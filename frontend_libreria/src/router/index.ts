import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/index'
import { getTokenFromLocalStorage } from '@/helpers/index'

// Importa tus vistas del CRUD
import LibrosView from '@/views/LibroView.vue'
import AutoresView from '@/views/AutorView.vue'
import CategoriasView from '@/views/CategoriaView.vue'
import UsuarioView from '@/views/UsuarioView.vue'
import VentasView from '@/views/VentaView.vue'
import DetalleVentasView from '@/views/DetalleVentaView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout, // 👈 La ruta padre usa el layout con el diseño de la plantilla
      children: [
        {
          path: '',
          redirect: '/libros', // Si entran a la raíz '/', los manda directo a libros
        },
        {
          path: 'libros',
          name: 'libros',
          component: LibrosView,
        },
        {
          path: 'autores',
          name: 'autores',
          component: AutoresView,
        },
        {
          path: 'categorias',
          name: 'categorias',
          component: CategoriasView,
        },
        {
          path: 'usuarios', // Sin barra '/' al inicio porque es ruta hija
          name: 'usuarios',
          component: UsuarioView,
        },
        {
          path: 'ventas', // Sin barra '/' al inicio
          name: 'ventas',
          component: VentasView,
        },
        {
          path: 'detalle-ventas', // Sin barra '/' al inicio
          name: 'detalle-ventas',
          component: DetalleVentasView,
        },
      ],
    },
    // Vista de Login fuera del layout principal para que ocupe toda la pantalla
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

// Guardia de navegación global para proteger rutas privadas
router.beforeEach(async (to) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
