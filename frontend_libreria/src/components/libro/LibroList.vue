<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import type { Libro } from '@/models/libro'

const ENDPOINT = 'libros'
const libros = ref<Libro[]>([])
const emit = defineEmits(['edit'])
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)

async function obtenerLista() {
  try {
    loading.value = true
    const response = await http.get(ENDPOINT)
    libros.value = response.data
  } catch (error) {
    console.error('Error al obtener la lista de libros:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

function emitirEdicion(libro: Libro) {
  emit('edit', libro)
}

async function eliminar(id: number) {
  if (confirm('Está seguro que desea eliminar el registro?')) {
    try {
      await http.delete(`${ENDPOINT}/${id}`)
      await obtenerLista()
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div
        class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 h5">Catálogo de Libros</h3>
        <Button
          label="Actualizar"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          @click="obtenerLista"
        />
      </div>

      <div class="card-body">
        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Tabla de datos -->
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead class="table-dark">
              <tr>
                <th>N°</th>
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
              <tr v-for="(libro, index) in libros" :key="libro.id">
                <td>{{ index + 1 }}</td>
                <td class="fw-bold">{{ libro.titulo }}</td>
                <td>{{ libro.isbn || 'S/N' }}</td>
                <td>${{ libro.precio.toFixed(2) }}</td>
                <td>
                  <span class="badge" :class="libro.stock > 0 ? 'bg-success' : 'bg-danger'">
                    {{ libro.stock }}
                  </span>
                </td>
                <td>{{ libro.categoria?.nombre || libro.categoriaId }}</td>
                <td>
                  {{
                    libro.autor ? `${libro.autor.nombre} ${libro.autor.apellido}` : libro.autorId
                  }}
                </td>
                <td class="text-center">
                  <Button
                    icon="pi pi-pencil"
                    aria-label="Editar"
                    text
                    severity="primary"
                    @click="emitirEdicion(libro)"
                  />
                  <Button
                    icon="pi pi-trash"
                    aria-label="Eliminar"
                    text
                    severity="danger"
                    @click="libro.id && eliminar(libro.id)"
                  />
                </td>
              </tr>
              <tr v-if="libros.length === 0">
                <td colspan="8" class="text-center text-muted py-4">
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
  border: 1px solid var(--p-surface-border, #dee2e6);
}
</style>
