<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import type { Categoria } from '@/models/categoria'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const emit = defineEmits(['edit'])
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)

async function obtenerLista() {
  try {
    loading.value = true
    const response = await http.get(ENDPOINT)
    categorias.value = response.data
  } catch (error) {
    console.error('Error al obtener la lista de categorías:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

function emitirEdicion(categoria: Categoria) {
  emit('edit', categoria)
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
        <h3 class="mb-0 h5">Gestión de Categorías</h3>
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
                <th>Nombre de la Categoría</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(categoria, index) in categorias" :key="categoria.id">
                <td>{{ index + 1 }}</td>
                <td class="fw-bold">{{ categoria.nombre }}</td>
                <td class="text-center">
                  <Button
                    icon="pi pi-pencil"
                    aria-label="Editar"
                    text
                    severity="primary"
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
              <tr v-if="categorias.length === 0">
                <td colspan="3" class="text-center text-muted py-4">
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
