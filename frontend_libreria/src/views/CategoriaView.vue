<script setup lang="ts">
import CategoriaList from '@/components/categoria/CategoriaList.vue'
import CategoriaForm from '@/components/categoria/CategoriaForm.vue' // <-- 1. Importas tu formulario
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const categoriaListRef = ref<any | null>(null) // Cambiado a any para evitar problemas con la referencia de tipo
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
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Categorías</h2>
      <Button label="Crear Nueva" icon="pi pi-plus" severity="primary" @click="handleCreate" />
    </div>

    <!-- Componente Lista -->
    <CategoriaList ref="categoriaListRef" @edit="handleEdit" />

    <!-- Diálogo / Modal -->
    <Dialog
      v-model:visible="mostrarDialog"
      :header="categoriaEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'"
      :style="{ width: '50vw' }"
      modal
    >
      <!-- 2. Reemplazamos los botones sueltos por tu formulario real -->
      <CategoriaForm
        :categoriaEdit="categoriaEdit"
        @saved="handleGuardar"
        @close="handleCloseDialog"
      />
    </Dialog>
  </div>
</template>

<style scoped></style>
