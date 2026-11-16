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
    errorMessage.value = null
    const response = await http.get(ENDPOINT)
    console.log('ugjgjg', import.meta.env.VITE_BASE_URL_ENDPOINT)
    // 👇 Protección clave: aseguramos que se extraiga el arreglo correctamente
    // por si el backend devuelve un objeto paginado o un arreglo directo.
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
  emit('edit', libro)
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro que desea eliminar el registro?')) {
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
  <div>
    <div class="card border-0">
      <!-- Encabezado superior con el tono ciruela de la plantilla -->
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
        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border custom-spinner" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Tabla de datos sin scroll forzado -->
        <div v-else class="w-100">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
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
              <template v-if="libros && libros.length > 0">
                <tr v-for="(libro, index) in libros" :key="libro.id || index">
                  <td>{{ index + 1 }}</td>
                  <td class="fw-bold" style="color: #4b3049">{{ libro.titulo }}</td>
                  <td>{{ libro.isbn || 'S/N' }}</td>
                  <td>Bs. {{ libro.precio }}</td>
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
                  </td>
                </tr>
              </template>
              <tr v-else>
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
}

/* Barra superior de la tabla en tono ciruela oscuro */
.custom-card-header {
  background-color: #4b3049;
  border-radius: 8px 8px 0 0;
}

/* Botón de actualizar en lila suave */
.btn-refresh-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: opacity 0.2s ease;
}

.btn-refresh-pillomart:hover {
  opacity: 0.85;
}

/* Spinner de carga armonizado */
.custom-spinner {
  color: #b08ead;
}

/* Cabecera de la tabla en tono lila suave con texto oscuro */
.custom-table thead th {
  background-color: #f4edf3;
  color: #4b3049;
  border-bottom: 2px solid #b08ead;
  font-weight: 700;
}

/* Efecto suave al pasar el mouse por una fila */
.custom-table tbody tr:hover {
  background-color: #faf7fa;
}

/* Ícono de editar en tono lila/ciruela */
.btn-edit-icon {
  color: #4b3049 !important;
}

.btn-edit-icon:hover {
  background-color: #f4edf3 !important;
}
</style>
