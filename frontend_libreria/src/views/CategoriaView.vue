<script setup lang="ts">
import CategoriaList from '@/components/categoria/CategoriaList.vue'
import CategoriaForm from '@/components/categoria/CategoriaForm.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const categoriaListRef = ref<any | null>(null)
const categoriaEdit = ref<any>(null)

function handleCreate() {
  categoriaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(categoria: any) {
  categoriaEdit.value = categoria
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
  categoriaEdit.value = null
}

function handleGuardar() {
  mostrarDialog.value = false
  categoriaEdit.value = null
  categoriaListRef.value?.obtenerLista()
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
              <h2 class="mb-0">Categorías</h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Contenedor principal con ancho completo -->
    <section class="product_list pb-5">
      <div class="container-fluid px-0">
        <!-- Fila 1: Botón Nueva Categoría alineado arriba -->
        <div class="row mb-4">
          <div
            class="col-12 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm"
          >
            <h4 class="m-0 fw-bold" style="color: #4b3049">Gestión de Categorías</h4>
            <Button
              label="Nueva Categoría"
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
                <CategoriaList ref="categoriaListRef" @edit="handleEdit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Diálogo / Modal para Crear y Editar -->
    <Dialog
      v-model:visible="mostrarDialog"
      :header="categoriaEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '95vw' }"
      modal
    >
      <CategoriaForm
        :categoriaEdit="categoriaEdit"
        @saved="handleGuardar"
        @close="handleCloseDialog"
      />
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
