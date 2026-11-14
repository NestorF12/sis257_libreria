<script setup lang="ts">
import { ref, watch } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Autor } from '@/models/autor'

const ENDPOINT = 'autores'

const props = defineProps<{
  autorEdit?: Autor | null
}>()

const emit = defineEmits(['saved', 'close'])

const form = ref<Partial<Autor>>({
  nombre: '',
  apellido: '',
  nacionalidad: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

watch(
  () => props.autorEdit,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    } else {
      form.value = {
        nombre: '',
        apellido: '',
        nacionalidad: '',
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
    console.error('Error al guardar el autor:', error)
    errorMessage.value = 'Ocurrió un error al intentar guardar el autor.'
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

    <!-- Nombre -->
    <div class="field mb-3">
      <label for="nombre" class="form-label fw-bold">Nombre</label>
      <InputText id="nombre" v-model="form.nombre" required placeholder="Ej. Gabriel" />
    </div>

    <!-- Apellido -->
    <div class="field mb-3">
      <label for="apellido" class="form-label fw-bold">Apellido</label>
      <InputText id="apellido" v-model="form.apellido" required placeholder="Ej. García Márquez" />
    </div>

    <!-- Nacionalidad -->
    <div class="field mb-3">
      <label for="nacionalidad" class="form-label fw-bold">Nacionalidad</label>
      <InputText id="nacionalidad" v-model="form.nacionalidad" placeholder="Ej. Colombiana" />
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
