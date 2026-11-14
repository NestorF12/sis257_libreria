<script setup lang="ts">
import { ref, watch } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Categoria } from '@/models/categoria'

const ENDPOINT = 'categorias'

const props = defineProps<{
  categoriaEdit?: Categoria | null
}>()

const emit = defineEmits(['saved', 'close'])

// Estado reactivo del formulario
const form = ref<Partial<Categoria>>({
  nombre: '',
  descripcion: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

// Sincronizar datos si estamos editando
watch(
  () => props.categoriaEdit,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    } else {
      form.value = {
        nombre: '',
        descripcion: '',
      }
    }
  },
  { immediate: true },
)

async function guardar() {
  try {
    loading.value = true
    errorMessage.value = null

    if (form.value.id) {
      await http.patch(`${ENDPOINT}/${form.value.id}`, form.value)
    } else {
      await http.post(ENDPOINT, form.value)
    }

    emit('saved')
  } catch (error) {
    console.error('Error al guardar la categoría:', error)
    errorMessage.value = 'Ocurrió un error al intentar guardar la categoría.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="guardar" class="p-fluid">
    <div v-if="errorMessage" class="alert alert-danger mb-3" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Nombre de la Categoría -->
    <div class="field mb-3">
      <label for="nombre" class="form-label fw-bold">Nombre</label>
      <InputText id="nombre" v-model="form.nombre" required placeholder="Ej. Ficción" />
    </div>

    <!-- Descripción -->
    <div class="field mb-3">
      <label for="descripcion" class="form-label fw-bold">Descripción</label>
      <InputText
        id="descripcion"
        v-model="form.descripcion"
        placeholder="Ej. Libros de novelas y literatura fantástica"
      />
    </div>

    <!-- Botones de Acción -->
    <div class="d-flex justify-content-end gap-2 mt-4">
      <Button type="button" label="Cancelar" severity="secondary" text @click="emit('close')" />
      <Button
        type="submit"
        :label="form.id ? 'Actualizar' : 'Guardar'"
        icon="pi pi-save"
        severity="success"
        :loading="loading"
      />
    </div>
  </form>
</template>

<style scoped></style>
