<script setup lang="ts">
import AutorList from '@/components/autor/AutorList.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const autorListRef = ref<typeof AutorList | null>(null)
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
  autorListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Autores</h2>
      <Button label="Crear Nuevo" icon="pi pi-plus" severity="primary" @click="handleCreate" />
    </div>

    <!-- Componente Lista -->
    <AutorList ref="autorListRef" @edit="handleEdit" />

    <!-- Diálogo / Modal para Crear y Editar -->
    <Dialog
      v-model:visible="mostrarDialog"
      :header="autorEdit ? 'Editar Autor' : 'Crear Nuevo Autor'"
      :style="{ width: '50vw' }"
      modal
    >
      <!-- Aquí puedes integrar tu componente AutorForm o tu formulario -->
      <div class="p-fluid">
        <p class="text-muted">
          {{ autorEdit ? `Modificando registro ID: ${autorEdit.id}` : 'Formulario de registro' }}
        </p>
        <!-- Ejemplo de botones de control del modal -->
        <div class="d-flex justify-content-end gap-2 mt-3">
          <Button label="Cancelar" severity="secondary" @click="handleCloseDialog" />
          <Button label="Guardar" severity="success" @click="handleGuardar" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* Estilos personalizados si se requieren */
</style>
