<script setup lang="ts">
import { ref } from 'vue'
import DetalleVentaList from '@/components/detalleventa/DetalleVentaList.vue'
import Button from 'primevue/button'

const detalleListRef = ref<InstanceType<typeof DetalleVentaList> | null>(null)

function actualizarLista() {
  detalleListRef.value?.obtenerLista()
}
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
        <!-- Fila 1: Cabecera descriptiva -->
        <div class="row mb-4">
          <div
            class="col-12 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm"
          >
            <h4 class="m-0 fw-bold" style="color: #4b3049">Desglose Analítico de Ítems Vendidos</h4>
            <Button
              label="Refrescar Datos"
              icon="pi pi-refresh"
              size="small"
              class="text-white px-4 py-2 btn-custom-pillomart"
              @click="actualizarLista"
            />
          </div>
        </div>

        <!-- Fila 2: Componente Tabla de Detalles -->
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm p-4 bg-white rounded">
              <div class="table-wrapper">
                <DetalleVentaList ref="detalleListRef" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.btn-custom-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: background-color 0.3s ease;
}

.btn-custom-pillomart:hover {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.table-wrapper :deep(.p-datatable-wrapper) {
  overflow-x: visible !important;
}

.table-wrapper :deep(table) {
  width: 100% !important;
  table-layout: auto;
}
</style>
