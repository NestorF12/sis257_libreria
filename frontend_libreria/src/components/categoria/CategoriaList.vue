<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Categoria } from '@/models/categoria'
import { useAuthStore } from '@/stores/index'
import { useBuscador } from '@/composables/useBuscador'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const emit = defineEmits(['edit'])
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const authStore = useAuthStore()

const {
  termino: buscarCategoria,
  itemsFiltrados: categoriasFiltradas,
  limpiarBusqueda: limpiarCategoria,
} = useBuscador(categorias, (categoria) => [categoria.nombre, categoria.descripcion])

async function obtenerLista() {
  try {
    loading.value = true
    errorMessage.value = null
    const response = await http.get(ENDPOINT)

    if (Array.isArray(response.data)) {
      categorias.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      categorias.value = response.data.data
    } else {
      categorias.value = []
    }
  } catch (error) {
    console.error('Error al obtener la lista de categorías:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

function emitirEdicion(categoria: Categoria) {
  if (!authStore.isVendedor) return
  emit('edit', categoria)
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
        <span class="fw-bold">Categorías</span>
        <Button
          label="Actualizar lista de categorías"
          icon="pi pi-refresh"
          size="small"
          class="text-white btn-refresh-pillomart"
          @click="obtenerLista"
        />
      </div>

      <!-- Barra de búsqueda de categorías -->
      <div
        class="d-flex flex-wrap justify-content-between align-items-center gap-2 px-4 py-3 border-bottom search-bar-box"
      >
        <div class="d-flex gap-2 flex-grow-1" style="max-width: 460px">
          <InputText
            v-model="buscarCategoria"
            placeholder="Buscar categoría por nombre o descripción..."
            class="w-100"
          />
          <Button
            v-if="buscarCategoria"
            icon="pi pi-times"
            severity="secondary"
            outlined
            aria-label="Limpiar búsqueda"
            @click="limpiarCategoria"
          />
        </div>

        <small class="text-muted">
          Mostrando <strong>{{ categoriasFiltradas.length }}</strong> de
          <strong>{{ categorias.length }}</strong> categoría(s)
        </small>
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
                <th>Nombre</th>
                <th>Descripción</th>
                <th v-if="authStore.isVendedor" class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="categoriasFiltradas && categoriasFiltradas.length > 0">
                <tr v-for="(categoria, index) in categoriasFiltradas" :key="categoria.id || index">
                  <td>{{ index + 1 }}</td>
                  <td class="fw-bold" style="color: #4b3049">{{ categoria.nombre }}</td>
                  <td>{{ categoria.descripcion || 'Sin descripción' }}</td>
                  <td v-if="authStore.isVendedor" class="text-center text-nowrap">
                    <Button
                      icon="pi pi-pencil"
                      aria-label="Editar"
                      text
                      class="btn-edit-icon"
                      @click="emitirEdicion(categoria)"
                    />
                    <Button
                      icon="pi pi-trash"
                      aria-label="Eliminar"
                      text
                      severity="danger"
                      @click="categoria.id && eliminar(categoria.id)"
                    />
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td :colspan="authStore.isVendedor ? 4 : 3" class="text-center text-muted py-4">
                  {{
                    buscarCategoria
                      ? `No se encontraron categorías que coincidan con "${buscarCategoria}".`
                      : 'No hay registros disponibles.'
                  }}
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

.search-bar-box {
  background-color: #faf7fa;
}

.btn-refresh-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: opacity 0.2s ease;
}

.btn-refresh-pillomart:hover {
  opacity: 0.85;
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
