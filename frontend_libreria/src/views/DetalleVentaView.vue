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

    // Extracción segura del arreglo (igual que en tus otros componentes)
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
</script>

<template>
  <div>
    <!-- 1. Franja de título compacta -->
    <section class="breadcrumb_part mb-4" style="height: auto; min-height: unset; padding: 30px 0">
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="breadcrumb_iner" style="height: auto; min-height: unset; padding: 0">
              <h2 class="mb-0">Detalle de Ventas</h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Contenedor principal con ancho completo -->
    <section class="product_list pb-5">
      <div class="container-fluid px-0">
        <!-- Fila 1: Cabecera descriptiva y botón de refrescar -->
        <div class="row mb-4">
          <div
            class="col-12 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm"
          >
            <h4 class="m-0 fw-bold" style="color: #4b3049">Desglose Analítico de Ítems Vendidos</h4>
            <Button
              label="Actualizar Lista"
              icon="pi pi-refresh"
              size="small"
              class="text-white btn-refresh-pillomart"
              @click="obtenerLista"
            />
          </div>
        </div>

        <!-- Fila 2: Tabla de detalles analíticos -->
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm p-4 bg-white rounded">
              <div
                class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
              >
                <h5 class="fw-bold m-0" style="color: #4b3049">Ítems por Transacción</h5>
              </div>

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

              <!-- Tabla de datos analíticos -->
              <div v-else class="table-wrapper w-100">
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
                      <!-- Recorremos cada venta y luego aplanamos sus detalles -->
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
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilos alineados con la plantilla de MagnaBooks */
.card {
  border-radius: 8px;
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

.table-wrapper :deep(.p-datatable-wrapper) {
  overflow-x: visible !important;
}

.table-wrapper :deep(table) {
  width: 100% !important;
  table-layout: auto;
}
</style>
