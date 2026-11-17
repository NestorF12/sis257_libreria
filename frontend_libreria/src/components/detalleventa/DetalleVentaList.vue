<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import type { Venta } from '@/models/venta'

const ENDPOINT = 'ventas'
const ventas = ref<Venta[]>([])
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)

async function obtenerLista() {
  try {
    loading.value = true
    errorMessage.value = null
    const response = await http.get(ENDPOINT)

    // Extracción segura del arreglo
    if (Array.isArray(response.data)) {
      ventas.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      ventas.value = response.data.data
    } else {
      ventas.value = []
    }
  } catch (error) {
    console.error('Error al obtener la lista de detalles de ventas:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
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
        <span class="fw-bold">Detalle Analítico de Ítems Vendidos</span>
        <Button
          label="Actualizar lista"
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

        <!-- Tabla analítica de detalles -->
        <div v-else class="w-100">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Comprador (Cliente)</th>
                <th>Libro Adquirido</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="ventas && ventas.length > 0">
                <template v-for="venta in ventas" :key="venta.id">
                  <tr v-for="detalle in venta.detalles" :key="detalle.id">
                    <td class="fw-bold">#{{ venta.id }}</td>
                    <td>{{ venta.usuario?.nombre || 'Usuario ID: ' + venta.usuarioId }}</td>
                    <td class="fw-bold" style="color: #4b3049">
                      {{ detalle.libro?.titulo || 'Libro ID: ' + detalle.libroId }}
                    </td>
                    <td>Bs. {{ detalle.precioUnitario }}</td>
                    <td>
                      <span class="badge bg-secondary text-white">
                        {{ detalle.cantidad }}
                      </span>
                    </td>
                    <td class="fw-bold text-success">Bs. {{ detalle.subtotal }}</td>
                  </tr>
                </template>
              </template>
              <tr v-else>
                <td colspan="6" class="text-center text-muted py-4">
                  No hay detalles de ventas registrados.
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
</style>
