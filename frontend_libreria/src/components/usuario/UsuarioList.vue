<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import type { Usuario } from '@/models/usuario'

const ENDPOINT = 'usuarios'
const usuarios = ref<Usuario[]>([])
const emit = defineEmits(['edit'])
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)

async function obtenerLista() {
  try {
    loading.value = true
    errorMessage.value = null
    const response = await http.get(ENDPOINT)

    // Protección clave para extraer el arreglo correctamente
    if (Array.isArray(response.data)) {
      usuarios.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      usuarios.value = response.data.data
    } else {
      usuarios.value = []
    }
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

function emitirEdicion(usuario: Usuario) {
  emit('edit', usuario)
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
        <span class="fw-bold">Usuarios</span>
        <Button
          label="Actualizar lista de usuarios"
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

        <!-- Tabla de datos -->
        <div v-else class="w-100">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo Electrónico</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="usuarios && usuarios.length > 0">
                <tr v-for="(usuario, index) in usuarios" :key="usuario.id || index">
                  <td>{{ index + 1 }}</td>
                  <td class="fw-bold" style="color: #4b3049">{{ usuario.nombre }}</td>
                  <td>{{ usuario.telefono || 'S/N' }}</td>
                  <td>{{ usuario.email }}</td>
                  <td class="text-center text-nowrap">
                    <Button
                      icon="pi pi-pencil"
                      aria-label="Editar"
                      text
                      class="btn-edit-icon"
                      @click="emitirEdicion(usuario)"
                    />
                    <Button
                      icon="pi pi-trash"
                      aria-label="Eliminar"
                      text
                      severity="danger"
                      @click="usuario.id && eliminar(usuario.id)"
                    />
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="5" class="text-center text-muted py-4">
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
