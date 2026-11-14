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
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Autores</h2>
      <Button label="Crear Nuevo" icon="pi pi-plus" severity="primary" @click="handleCreate" />
    </div>

    <!-- Componente Lista -->
    <AutorList ref="autorListRef" @edit="handleEdit" />

    <!-- Diálogo / Modal -->
    <Dialog
      v-model:visible="mostrarDialog"
      :header="autorEdit ? 'Editar Autor' : 'Crear Nuevo Autor'"
      :style="{ width: '50vw' }"
      modal
    >
      <AutorForm :autorEdit="autorEdit" @saved="handleGuardar" @close="handleCloseDialog" />
    </Dialog>
  </div>
</template>

<style scoped></style>
