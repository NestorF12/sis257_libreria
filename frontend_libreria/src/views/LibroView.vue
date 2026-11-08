<script setup lang="ts">
import LibroList from '@/components/libro/LibroList.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const libroListRef = ref<typeof LibroList | null>(null)
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
      <div class="p-fluid">
        <p class="text-muted">
          {{ libroEdit ? `Modificando registro ID: ${libroEdit.id}` : 'Formulario de registro' }}
        </p>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <Button label="Cancelar" severity="secondary" @click="handleCloseDialog" />
          <Button label="Guardar" severity="success" @click="handleGuardar" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
