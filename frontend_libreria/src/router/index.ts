import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
// Importa tus vistas del CRUD
import LibrosView from '@/views/LibroView.vue' // (Ajusta la ruta si tus vistas están en otra carpeta, ej: '@/views/libro/LibroView.vue')
import AutoresView from '@/views/AutorView.vue'
import CategoriasView from '@/views/CategoriaView.vue'

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
      ],
    },
    // Si tienes una vista de Login u otras fuera del layout, las pones aquí afuera:
    // { path: '/login', component: LoginView }
  ],
})

export default router
