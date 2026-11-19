<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import type { Libro } from '@/models/libro'
import { useAuthStore } from '@/stores/index'

const ENDPOINT = 'libros'
const libros = ref<Libro[]>([])
const brokenCovers = ref<Record<string, boolean>>({})
const emit = defineEmits(['edit', 'add-to-cart'])
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const authStore = useAuthStore()

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

async function obtenerLista() {
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
    console.error('Error al obtener la lista de libros:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

function emitirEdicion(libro: Libro) {
  if (!authStore.isVendedor) return
  emit('edit', libro)
}

async function eliminar(id: number) {
  if (!authStore.isVendedor) return
  if (confirm('¿Está seguro que desea eliminar el registro?')) {
    try {
      await http.delete(`${ENDPOINT}/${id}`)
      await obtenerLista()
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }
}

function agregarAlCarrito(libro: Libro) {
  if (!authStore.isComprador || (libro?.stock ?? 0) <= 0) return
  emit('add-to-cart', libro)
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="card border-0">
      <div
        class="card-header text-white d-flex justify-content-between align-items-center py-3 px-4 custom-card-header"
      >
        <span class="fw-bold">Libros</span>
        <Button
          label="Actualizar lista de libros"
          icon="pi pi-refresh"
          size="small"
          class="text-white btn-refresh-pillomart"
          @click="obtenerLista"
        />
      </div>

      <div class="card-body px-0 pb-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border custom-spinner" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <div v-else class="w-100">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Portada</th>
                <th>Título</th>
                <th>ISBN</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="libros && libros.length > 0">
                <tr v-for="(libro, index) in libros" :key="libro.id || index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <img
                      v-if="mostrarPortada(libro, index)"
                      :src="libro.portada!.trim()"
                      :alt="`Portada de ${libro.titulo}`"
                      class="book-cover-thumb rounded shadow-sm"
                      @error="marcarImagenRota(libro, index)"
                    />
                    <div
                      v-else
                      class="book-cover-placeholder rounded d-flex align-items-center justify-content-center text-muted"
                      title="Sin portada"
                    >
                      <i class="pi pi-book"></i>
                    </div>
                  </td>
                  <td class="fw-bold" style="color: #4b3049">{{ libro.titulo }}</td>
                  <td>{{ libro.isbn || 'S/N' }}</td>
                  <td>Bs. {{ Number(libro.precio ?? 0).toFixed(2) }}</td>
                  <td>
                    <span
                      class="badge text-white"
                      :class="(libro?.stock ?? 0) > 0 ? 'bg-success' : 'bg-danger'"
                      style="color: #ffffff !important"
                    >
                      {{ libro?.stock ?? 0 }}
                    </span>
                  </td>
                  <td>{{ libro?.categoria?.nombre || libro?.categoriaId || 'Sin categoría' }}</td>
                  <td>
                    {{
                      libro?.autor
                        ? `${libro.autor.nombre} ${libro.autor.apellido}`
                        : libro?.autorId || 'Sin autor'
                    }}
                  </td>
                  <td class="text-center text-nowrap">
                    <template v-if="authStore.isVendedor">
                      <Button
                        icon="pi pi-pencil"
                        aria-label="Editar"
                        text
                        class="btn-edit-icon"
                        @click="emitirEdicion(libro)"
                      />
                      <Button
                        icon="pi pi-trash"
                        aria-label="Eliminar"
                        text
                        severity="danger"
                        @click="libro.id && eliminar(libro.id)"
                      />
                    </template>

                    <Button
                      v-if="authStore.isComprador"
                      :label="(libro?.stock ?? 0) > 0 ? 'Agregar al carrito' : 'Sin stock'"
                      icon="pi pi-shopping-cart"
                      size="small"
                      class="text-white btn-cart-pillomart"
                      :disabled="(libro?.stock ?? 0) <= 0"
                      @click="agregarAlCarrito(libro)"
                    />
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="9" class="text-center text-muted py-4">
                  No hay registros disponibles.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 8px;
}

.custom-card-header {
  background-color: #4b3049;
  border-radius: 8px 8px 0 0;
}

.btn-refresh-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: opacity 0.2s ease;
}

.btn-refresh-pillomart:hover {
  opacity: 0.85;
}

.btn-cart-pillomart {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
  transition: background-color 0.2s ease;
}

.btn-cart-pillomart:hover:not(:disabled) {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
}

.book-cover-thumb {
  width: 44px;
  height: 62px;
  object-fit: cover;
  display: block;
}

.book-cover-placeholder {
  width: 44px;
  height: 62px;
  background-color: #f4edf3;
  border: 1px dashed #b08ead;
}

.custom-spinner {
  color: #b08ead;
}

.custom-table thead th {
  background-color: #f4edf3;
  color: #4b3049;
  border-bottom: 2px solid #b08ead;
  font-weight: 700;
}

.custom-table tbody tr:hover {
  background-color: #faf7fa;
}

.btn-edit-icon {
  color: #4b3049 !important;
}

.btn-edit-icon:hover {
  background-color: #f4edf3 !important;
}
</style>
