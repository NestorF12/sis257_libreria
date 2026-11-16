<script setup lang="ts">
import AutorList from '@/components/autor/AutorList.vue'
import AutorForm from '@/components/autor/AutorForm.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const autorListRef = ref<any | null>(null)
const autorEdit = ref<any>(null)

function handleCreate() {
  autorEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(autor: any) {
  autorEdit.value = autor
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
  autorEdit.value = null
}

function handleGuardar() {
  mostrarDialog.value = false
  autorEdit.value = null
  autorListRef.value?.obtenerLista()
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
              <h2 class="mb-0">Autores</h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Contenedor principal con ancho completo -->
    <section class="product_list pb-5">
      <div class="container-fluid px-0">
        <!-- Fila 1: Botón Nuevo Autor alineado arriba -->
        <div class="row mb-4">
          <div
            class="col-12 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm"
          >
            <h4 class="m-0 fw-bold" style="color: #4b3049">Gestión de Autores</h4>
            <Button
              label="Nuevo Autor"
              icon="pi pi-plus"
              class="text-white px-4 py-2 btn-custom-pillomart"
              @click="handleCreate"
            />
          </div>
        </div>

        <!-- Fila 2: Tabla de registros por debajo a ancho completo (sin scroll) -->
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm p-4 bg-white rounded">
              <div
                class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
              >
                <h5 class="fw-bold m-0" style="color: #4b3049">Lista de Registros</h5>
              </div>

              <!-- Componente Lista con todo el ancho disponible -->
              <div class="table-wrapper">
                <AutorList ref="autorListRef" @edit="handleEdit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Diálogo / Modal para Crear y Editar -->
    <Dialog
      v-model:visible="mostrarDialog"
      :header="autorEdit ? 'Editar Autor' : 'Crear Nuevo Autor'"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '95vw' }"
      modal
    >
      <AutorForm :autorEdit="autorEdit" @saved="handleGuardar" @close="handleCloseDialog" />
    </Dialog>
  </div>
</template>

<style scoped>
/* Color personalizado del botón y efecto hover */
.btn-custom-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: background-color 0.3s ease;
}

.btn-custom-pillomart:hover {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
}

/* Asegura que la tabla interna se adapte al ancho sin barras de scroll innecesarias */
.table-wrapper :deep(.p-datatable-wrapper) {
  overflow-x: visible !important;
}

.table-wrapper :deep(table) {
  width: 100% !important;
  table-layout: auto;
}
</style>
