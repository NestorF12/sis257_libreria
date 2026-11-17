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

    if (Array.isArray(response.data)) {
      ventas.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      ventas.value = response.data.data
    } else {
      ventas.value = []
    }
  } catch (error) {
    console.error('Error al obtener la lista de ventas:', error)
    errorMessage.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro que desea anular/eliminar esta venta?')) {
    try {
      await http.delete(`${ENDPOINT}/${id}`)
      await obtenerLista()
    } catch (error) {
      console.error('Error al eliminar la venta:', error)
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
        <span class="fw-bold">Ventas Registradas</span>
        <Button
          label="Actualizar lista"
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
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total (Bs)</th>
                <th>Estado</th>
                <th>Detalle de Libros</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="ventas && ventas.length > 0">
                <tr v-for="(venta, index) in ventas" :key="venta.id || index">
                  <td>#{{ venta.id }}</td>
                  <td class="fw-bold" style="color: #4b3049">
                    {{ venta.usuario?.nombre || 'Usuario ID: ' + venta.usuarioId }}
                  </td>
                  <td>
                    {{ venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleString() : 'S/F' }}
                  </td>
                  <td class="fw-bold text-success">Bs. {{ venta.total }}</td>
                  <td>
                    <span class="badge bg-success" style="color: #ffffff !important">
                      {{ venta.estado || 'completado' }}
                    </span>
                  </td>
                  <td>
                    <ul class="list-unstyled mb-0 small text-muted">
                      <li v-for="det in venta.detalles" :key="det.id">
                        • <strong>{{ det.libro?.titulo || 'Libro #' + det.libroId }}</strong> (x{{
                          det.cantidad
                        }}) - Bs. {{ det.subtotal }}
                      </li>
                    </ul>
                  </td>
                  <td class="text-center text-nowrap">
                    <Button
                      icon="pi pi-trash"
                      aria-label="Eliminar"
                      text
                      severity="danger"
                      @click="venta.id && eliminar(venta.id)"
                    />
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="7" class="text-center text-muted py-4">No hay ventas registradas.</td>
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
