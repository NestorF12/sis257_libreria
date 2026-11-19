<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/index'
import { useCarritoStore } from '@/stores/carrito'

const imagenesFondo = ['/img/fondo_1.jpg', '/img/fondo_2.jpg', '/img/fondo_3.jpg']
const authStore = useAuthStore()
const carritoStore = useCarritoStore()
const indiceActual = ref(0)
let intervalo: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  intervalo = setInterval(() => {
    indiceActual.value = (indiceActual.value + 1) % imagenesFondo.length
  }, 5000)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>

<template>
  <div class="app-container d-flex flex-column min-vh-100 w-100">
    <!-- Contenedor fijo del fondo animado -->
    <div class="background-slideshow">
      <div
        v-for="(img, index) in imagenesFondo"
        :key="index"
        class="bg-slide"
        :class="{ active: indiceActual === index }"
        :style="{ backgroundImage: `url(${img})` }"
      ></div>
      <div class="bg-overlay"></div>
    </div>

    <!--::header part start::-->
    <header class="custom-navbar w-100">
      <div class="container mx-auto px-3 px-md-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center py-3 gap-3">
          <!-- 1. Título / Logotipo -->
          <router-link
            class="navbar-brand text-dark m-0 text-decoration-none"
            style="font-size: 2.2rem; font-weight: 900; letter-spacing: -0.5px; line-height: 1"
            to="/"
          >
            ⨝ MagnaBooks
          </router-link>

          <!-- 2. Menú de navegación principal -->
          <nav class="mx-auto mx-md-0">
            <ul
              class="navbar-nav flex-row flex-wrap justify-content-center gap-3 gap-md-4 mb-0"
              style="list-style: none"
            >
              <li class="nav-item">
                <router-link
                  class="nav-link px-2"
                  exact-active-class="router-link-exact-active"
                  to="/"
                >
                  Home
                </router-link>
              </li>

              <!-- Pestañas protegidas: visibles al iniciar sesión o redirigen a /login si se intenta entrar -->
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/libros">Libros</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/autores">Autores</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/categorias">Categorías</router-link>
              </li>

              <!-- Opciones exclusivas de "vendedor" -->
              <li v-if="authStore.isVendedor" class="nav-item">
                <router-link class="nav-link px-2" to="/usuarios">Usuarios</router-link>
              </li>
              <li v-if="authStore.isVendedor" class="nav-item">
                <router-link class="nav-link px-2" to="/ventas">Ventas</router-link>
              </li>
              <li v-if="authStore.isVendedor" class="nav-item">
                <router-link class="nav-link px-2" to="/detalle-ventas">Detalle Ventas</router-link>
              </li>

              <!-- Opciones orientadas a "comprador" -->
              <li v-if="authStore.isComprador" class="nav-item">
                <router-link
                  class="nav-link px-2 d-inline-flex align-items-center gap-1"
                  to="/carrito"
                >
                  <span>Carrito</span>
                  <span v-if="carritoStore.cantidadTotal > 0" class="badge rounded-pill cart-badge">
                    {{ carritoStore.cantidadTotal }}
                  </span>
                </router-link>
              </li>
              <li v-if="authStore.isComprador" class="nav-item">
                <router-link class="nav-link px-2" to="/ventas">Mis Compras</router-link>
              </li>
            </ul>
          </nav>

          <!-- 3. Acciones de sesión y carrito -->
          <div class="hearer_icon d-flex align-items-center gap-2 gap-sm-3">
            <router-link
              v-if="authStore.isComprador"
              to="/carrito"
              class="text-dark fs-5 position-relative text-decoration-none d-inline-flex align-items-center"
              title="Ver carrito"
            >
              <i class="flaticon-shopping-cart-black-shape"></i>
              <span
                v-if="carritoStore.cantidadTotal > 0"
                class="badge rounded-pill cart-badge ms-1"
              >
                {{ carritoStore.cantidadTotal }}
              </span>
            </router-link>

            <template v-if="authStore.token">
              <span v-if="authStore.user" class="fw-bold">
                Hola, {{ authStore.user.nombre }} ({{ authStore.rol ?? authStore.user.rol }})
              </span>

              <button @click="authStore.logout()" class="btn btn-danger btn-sm">
                Cerrar Sesión
              </button>
            </template>

            <template v-else>
              <router-link to="/registro" class="btn btn-sm fw-semibold px-3 py-2 btn-register-nav">
                Registrarse
              </router-link>

              <router-link
                to="/login"
                class="btn btn-sm text-white fw-semibold px-3 py-2 btn-login-nav"
              >
                Iniciar Sesión
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>
    <!-- Header part end-->

    <!-- Main Content -->
    <main class="main-content flex-fill my-4 w-100">
      <div class="container mx-auto px-3 px-md-4">
        <router-view />
      </div>
    </main>

    <!--::footer_part start::-->
    <footer
      class="footer_part mt-auto py-4 w-100"
      style="background-color: #faf7fa; border-top: 2px solid #b08ead"
    >
      <div class="container mx-auto px-3 px-md-4 text-center">
        <p class="mb-1 fw-bold" style="color: #4b3049">
          <i class="fas fa-phone-alt me-2" style="color: #b08ead"></i> Contacto: +591 74829104
        </p>
        <p class="mb-0" style="color: #4b3049">
          <i class="fas fa-map-marker-alt me-2" style="color: #b08ead"></i> Dirección: Av. Las
          Américas #452, Zona Central
        </p>
      </div>
    </footer>
    <!--::footer_part end::-->
  </div>
</template>

<style>
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  overflow-x: hidden;
  display: block !important;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  display: block !important;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.custom-navbar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 2px solid #b08ead;
  box-shadow: 0 2px 10px rgba(75, 48, 73, 0.08);
  position: relative;
  z-index: 10;
}

.navbar-nav .nav-link {
  color: #4b3049 !important;
  font-weight: 600;
  font-size: 1.05rem;
  transition: color 0.2s ease;
}

.navbar-nav .nav-link:hover,
.navbar-nav .router-link-exact-active {
  color: #b08ead !important;
}

.btn-register-nav {
  background-color: transparent;
  color: #4b3049;
  border: 1.5px solid #4b3049;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-register-nav:hover {
  background-color: #faf7fa;
  color: #b08ead;
  border-color: #b08ead;
}

.btn-login-nav {
  background-color: #4b3049;
  border-color: #4b3049;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.btn-login-nav:hover {
  background-color: #b08ead;
  border-color: #b08ead;
  color: #ffffff;
}

.cart-badge {
  background-color: #4b3049;
  color: #ffffff;
  font-size: 0.75rem;
  padding: 0.25em 0.5em;
}

.background-slideshow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.bg-slide.active {
  opacity: 1;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 245, 248, 0.5);
}

header,
footer {
  position: relative;
  z-index: 2;
}

main {
  position: relative;
  z-index: 1;
}

.main-content {
  min-height: 60vh;
}
</style>
