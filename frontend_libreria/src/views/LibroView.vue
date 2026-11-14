<script setup lang="ts">
import LibroList from '@/components/libro/LibroList.vue'
import LibroForm from '@/components/libro/LibroForm.vue' // <-- Importante: Importar tu formulario
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const libroListRef = ref<any | null>(null)
const libroEdit = ref<any>(null)

function handleCreate() {
  libroEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(libro: any) {
  libroEdit.value = libro
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
  libroEdit.value = null
}

function handleGuardar() {
  mostrarDialog.value = false
  libroEdit.value = null
  libroListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Libros</h2>
      <Button label="Crear Nuevo" icon="pi pi-plus" severity="primary" @click="handleCreate" />
    </div>

    <!-- Componente Lista -->
    <LibroList ref="libroListRef" @edit="handleEdit" />

    <!-- Diálogo / Modal -->
    <Dialog
      v-model:visible="mostrarDialog"
      :header="libroEdit ? 'Editar Libro' : 'Crear Nuevo Libro'"
      :style="{ width: '50vw' }"
      modal
    >
      <!-- Reemplazamos los botones sueltos por tu componente real de formulario -->
      <LibroForm :libroEdit="libroEdit" @saved="handleGuardar" @close="handleCloseDialog" />
    </Dialog>
  </div>
</template>

<style scoped></style>
