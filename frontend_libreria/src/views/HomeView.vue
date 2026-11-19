<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Libro } from '@/models/libro'
import { useAuthStore } from '@/stores/index'
import { useCarritoStore } from '@/stores/carrito'
import { useBuscador, normalizarTexto } from '@/composables/useBuscador'

const ENDPOINT = 'libros'
const router = useRouter()
const authStore = useAuthStore()
const carritoStore = useCarritoStore()

const libros = ref<Libro[]>([])
const brokenCovers = ref<Record<string, boolean>>({})
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const addedId = ref<number | null>(null)
const filtroDisponibilidad = ref<'todos' | 'disponibles'>('todos')

function nombreAutor(libro: Libro): string {
  if (!libro.autor) return ''
  return `${libro.autor.nombre ?? ''} ${libro.autor.apellido ?? ''}`.trim()
}

function nombreCategoria(libro: Libro): string {
  return libro.categoria?.nombre?.trim() ?? ''
}

const {
  termino: busquedaGeneral,
  itemsFiltrados: coincidenciasCatalogo,
  limpiarBusqueda,
} = useBuscador(libros, (libro) => [
  libro.titulo,
  libro.isbn,
  nombreAutor(libro),
  nombreCategoria(libro),
])

const hayBusquedaActiva = computed(() => normalizarTexto(busquedaGeneral.value).length > 0)

const librosRecientes = computed(() => {
  const copia = [...libros.value]
  copia.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (!Number.isNaN(diff) && diff !== 0) return diff
    }
    return (b.id ?? 0) - (a.id ?? 0)
  })
  return copia.slice(0, 8)
})

const librosMostrados = computed(() => {
  const base = hayBusquedaActiva.value ? coincidenciasCatalogo.value : librosRecientes.value
  if (filtroDisponibilidad.value === 'disponibles') {
    return base.filter((libro) => (libro.stock ?? 0) > 0)
  }
  return base
})

function coverKey(libro: Libro, index: number): string {
  return String(libro.id ?? index)
}

function mostrarPortada(libro: Libro, index: number): boolean {
  const url = libro.portada?.trim()
  if (!url) return false
  return !brokenCovers.value[coverKey(libro, index)]
}

function marcarImagenRota(libro: Libro, index: number) {
  brokenCovers.value[coverKey(libro, index)] = true
}

function handleAgregarCarrito(libro: Libro) {
  if (!authStore.token) {
    authStore.returnUrl = '/libros'
    router.push('/login')
    return
  }
  if (!authStore.isComprador) {
    router.push('/libros')
    return
  }
  if ((libro.stock ?? 0) <= 0) return

  carritoStore.agregarLibro(libro)
  if (libro.id) {
    addedId.value = libro.id
    setTimeout(() => {
      if (addedId.value === libro.id) {
        addedId.value = null
      }
    }, 1200)
  }
}

async function cargarLibrosRecientes() {
  try {
    loading.value = true
    errorMessage.value = null
    brokenCovers.value = {}

    const response = await http.get(ENDPOINT)
    if (Array.isArray(response.data)) {
      libros.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      libros.value = response.data.data
    } else {
      libros.value = []
    }
  } catch (error) {
    console.error('Error al cargar los libros recientes:', error)
    errorMessage.value = 'No se pudieron cargar los libros recientes.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarLibrosRecientes()
})
</script>

<template>
  <div>
    <!-- Encabezado de bienvenida -->
    <section class="breadcrumb_part mb-4" style="height: auto; min-height: unset; padding: 36px 0">
      <div class="container-fluid px-4">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="breadcrumb_iner" style="height: auto; min-height: unset; padding: 0">
              <h2 class="mb-1">Bienvenido a MagnaBooks</h2>
              <p class="mb-0 text-white-50">
                Consulta si tenemos el libro que buscas y revisa su disponibilidad sin registrarte
              </p>
            </div>
          </div>
          <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Button
              label="Ver todo el catálogo"
              icon="pi pi-book"
              class="text-white btn-home-secondary"
              @click="router.push('/libros')"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Buscador general para visitantes + Cuadrícula de libros -->
    <section class="pb-5">
      <div class="container-fluid px-4">
        <!-- Barra de búsqueda general -->
        <div class="card border-0 shadow-sm p-4 mb-4 bg-white home-search-card">
          <div class="row g-3 align-items-end">
            <div class="col-lg-7">
              <label
                for="buscador-general-home"
                class="form-label fw-bold mb-2"
                style="color: #4b3049"
              >
                Buscador general de libros (sin necesidad de cuenta)
              </label>
              <div class="d-flex gap-2">
                <span class="p-input-icon-left w-100">
                  <InputText
                    id="buscador-general-home"
                    v-model="busquedaGeneral"
                    placeholder="Escribe título, autor, categoría o ISBN para verificar si lo tenemos..."
                    class="w-100"
                  />
                </span>
                <Button
                  v-if="hayBusquedaActiva"
                  icon="pi pi-times"
                  label="Limpiar"
                  severity="secondary"
                  outlined
                  @click="limpiarBusqueda"
                />
              </div>
            </div>

            <div class="col-lg-5 d-flex flex-wrap justify-content-lg-end align-items-center gap-2">
              <Button
                :label="`Todos (${libros.length})`"
                size="small"
                :outlined="filtroDisponibilidad !== 'todos'"
                class="btn-filter-pill"
                :class="{ 'text-white': filtroDisponibilidad === 'todos' }"
                @click="filtroDisponibilidad = 'todos'"
              />
              <Button
                label="Solo con stock"
                icon="pi pi-check-circle"
                size="small"
                :outlined="filtroDisponibilidad !== 'disponibles'"
                class="btn-filter-pill"
                :class="{ 'text-white': filtroDisponibilidad === 'disponibles' }"
                @click="filtroDisponibilidad = 'disponibles'"
              />
            </div>
          </div>

          <div
            class="mt-3 pt-2 border-top d-flex flex-wrap justify-content-between align-items-center small text-muted gap-2"
          >
            <span v-if="hayBusquedaActiva">
              Resultados para <strong>"{{ busquedaGeneral }}"</strong>:
              <strong>{{ librosMostrados.length }}</strong> coincidencia(s) en todo el catálogo.
            </span>
            <span v-else>
              Mostrando los <strong>{{ librosMostrados.length }}</strong> libros más recientes.
              Escribe arriba para buscar en todo el catálogo.
            </span>
            <span v-if="!authStore.token">
              ¿Quieres comprar? Inicia sesión solo cuando estés listo para agregar al carrito.
            </span>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h3 class="fw-bold m-0" style="color: #4b3049">
              {{ hayBusquedaActiva ? 'Resultados de Búsqueda' : 'Recién Agregados' }}
            </h3>
            <small class="text-muted">
              {{
                hayBusquedaActiva
                  ? 'Disponibilidad y precio actualizados del catálogo'
                  : 'Últimas novedades disponibles'
              }}
            </small>
          </div>
          <Button
            label="Actualizar"
            icon="pi pi-refresh"
            size="small"
            class="text-white btn-home-accent"
            @click="cargarLibrosRecientes"
          />
        </div>

        <!-- Cargando -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border custom-spinner" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Grid grande -->
        <div v-else-if="librosMostrados.length > 0" class="row g-4">
          <div
            v-for="(libro, index) in librosMostrados"
            :key="libro.id ?? index"
            class="col-12 col-sm-6 col-md-4 col-xl-3"
          >
            <div class="card h-100 border-0 shadow-sm book-grid-card">
              <div class="book-cover-box position-relative">
                <img
                  v-if="mostrarPortada(libro, index)"
                  :src="libro.portada!.trim()"
                  :alt="`Portada de ${libro.titulo}`"
                  class="book-cover-img"
                  @error="marcarImagenRota(libro, index)"
                />
                <div
                  v-else
                  class="book-cover-fallback d-flex flex-column align-items-center justify-content-center text-muted"
                >
                  <i class="pi pi-book mb-2" style="font-size: 2.2rem"></i>
                  <small>Sin portada</small>
                </div>

                <span
                  class="badge position-absolute top-0 end-0 m-3 px-2 py-1 text-white"
                  :class="(libro.stock ?? 0) > 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{ (libro.stock ?? 0) > 0 ? `Stock: ${libro.stock}` : 'Agotado' }}
                </span>
              </div>

              <div class="card-body d-flex flex-column justify-content-between p-4">
                <div>
                  <span class="badge book-category-badge mb-2">
                    {{ libro.categoria?.nombre || 'General' }}
                  </span>
                  <h5 class="fw-bold mb-1 book-title" style="color: #4b3049">
                    {{ libro.titulo }}
                  </h5>
                  <p class="text-muted small mb-3">
                    {{
                      libro.autor
                        ? `${libro.autor.nombre} ${libro.autor.apellido}`
                        : 'Autor no especificado'
                    }}
                  </p>
                </div>

                <div
                  class="pt-3 border-top d-flex align-items-center justify-content-between gap-2"
                >
                  <span class="fw-bold fs-5 text-success">
                    Bs. {{ Number(libro.precio ?? 0).toFixed(2) }}
                  </span>

                  <Button
                    v-if="authStore.isComprador"
                    :label="
                      addedId === libro.id
                        ? 'Agregado'
                        : (libro.stock ?? 0) > 0
                          ? 'Agregar'
                          : 'Sin stock'
                    "
                    :icon="addedId === libro.id ? 'pi pi-check' : 'pi pi-shopping-cart'"
                    size="small"
                    class="text-white btn-home-primary"
                    :disabled="(libro.stock ?? 0) <= 0"
                    @click="handleAgregarCarrito(libro)"
                  />

                  <Button
                    v-else
                    label="Ver libro"
                    icon="pi pi-arrow-right"
                    size="small"
                    outlined
                    class="btn-home-outline"
                    @click="router.push('/libros')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vacío o sin coincidencias -->
        <div v-else class="text-center py-5 bg-white rounded shadow-sm px-3">
          <p class="text-muted mb-3">
            {{
              hayBusquedaActiva
                ? `No se encontraron libros que coincidan con "${busquedaGeneral}".`
                : 'Aún no hay libros registrados en el catálogo.'
            }}
          </p>
          <Button
            v-if="hayBusquedaActiva"
            label="Limpiar búsqueda"
            icon="pi pi-refresh"
            class="text-white btn-home-primary"
            @click="limpiarBusqueda"
          />
          <Button
            v-else
            label="Ir a Libros"
            icon="pi pi-book"
            class="text-white btn-home-primary"
            @click="router.push('/libros')"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-search-card {
  border-radius: 12px;
  border-left: 4px solid #4b3049 !important;
}

.book-grid-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.book-grid-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(75, 48, 73, 0.12) !important;
}

.book-cover-box {
  height: 290px;
  background-color: #f4edf3;
  overflow: hidden;
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-cover-fallback {
  width: 100%;
  height: 100%;
  background-color: #f4edf3;
}

.book-category-badge {
  background-color: #f4edf3;
  color: #4b3049;
  font-weight: 600;
}

.book-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-home-primary {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.btn-home-primary:hover:not(:disabled) {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
}

.btn-home-accent {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
}

.btn-home-accent:hover {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.btn-home-secondary {
  background-color: rgba(255, 255, 255, 0.16) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
}

.btn-home-secondary:hover {
  background-color: rgba(255, 255, 255, 0.28) !important;
}

.btn-home-outline {
  color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.btn-filter-pill {
  color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.btn-filter-pill:not(.p-button-outlined) {
  background-color: #4b3049 !important;
  color: #ffffff !important;
}

.custom-spinner {
  color: #b08ead;
}
</style>
