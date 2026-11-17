<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Rutas de tus 3 imágenes de fondo en la carpeta public/img/
const imagenesFondo = ['/img/fondo_1.jpg', '/img/fondo_2.jpg', '/img/fondo_3.jpg']

const indiceActual = ref(0)
let intervalo: ReturnType<typeof setInterval> | null = null

// Cambia de imagen automáticamente cada 5 segundos (5000 ms)
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
      <!-- Capa semi-transparente que se solapa encima de las imágenes -->
      <div class="bg-overlay"></div>
    </div>

    <!--::header part start::-->
    <header class="custom-navbar w-100">
      <div class="container mx-auto px-3 px-md-4">
        <!-- Contenedor flexible centrado -->
        <div class="d-flex flex-wrap justify-content-between align-items-center py-3 gap-3">
          <!-- 1. Título / Logotipo -->
          <router-link
            class="navbar-brand text-dark m-0 text-decoration-none"
            style="font-size: 2.2rem; font-weight: 900; letter-spacing: -0.5px; line-height: 1"
            to="/"
          >
            ⨝ MagnaBooks
          </router-link>

          <!-- 2. Menú de navegación principal (Incluye Libros, Autores, Categorías, Usuarios, Ventas y Detalle) -->
          <nav class="mx-auto mx-md-0">
            <ul
              class="navbar-nav flex-row flex-wrap justify-content-center gap-3 gap-md-4 mb-0"
              style="list-style: none"
            >
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/libros">Libros</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/autores">Autores</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/categorias">Categorías</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/usuarios">Usuarios</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/ventas">Ventas</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-2" to="/detalle-ventas">Detalle Ventas</router-link>
              </li>
            </ul>
          </nav>

          <!-- 3. Icono del carrito / Acciones a la derecha -->
          <div class="hearer_icon d-flex align-items-center">
            <router-link to="/libros" class="text-dark fs-5">
              <i class="flaticon-shopping-cart-black-shape"></i>
            </router-link>
          </div>
        </div>
      </div>
    </header>
    <!-- Header part end-->

    <!-- Main Content: Centrado horizontalmente en cualquier pantalla -->
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

<!-- Reseteo global limpio para evitar que Vite/Vue empuje el contenido a un lado -->
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

/* Cabecera de ancho completo */
.custom-navbar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 2px solid #b08ead;
  box-shadow: 0 2px 10px rgba(75, 48, 73, 0.08);
  position: relative;
  z-index: 10;
}

/* Estilos de los enlaces del menú */
.navbar-nav .nav-link {
  color: #4b3049 !important;
  font-weight: 600;
  font-size: 1.05rem;
  transition: color 0.2s ease;
}

.navbar-nav .nav-link:hover,
.navbar-nav .router-link-active {
  color: #b08ead !important;
}

/* Carrusel de fondo fijo */
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
