<script setup lang="ts">
import { ref, watch } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Usuario } from '@/models/usuario'

const ENDPOINT = 'usuarios'

const props = defineProps<{
  usuarioEdit?: Usuario | null
}>()

const emit = defineEmits(['saved', 'close'])

// Estado reactivo tipado estrictamente con Partial<Usuario>
const form = ref<Partial<Usuario>>({
  nombre: '',
  telefono: '',
  email: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

// Sincronizar datos si estamos editando
watch(
  () => props.usuarioEdit,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    } else {
      form.value = {
        nombre: '',
        telefono: '',
        email: '',
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
  } catch (error: unknown) {
    console.error('Error al guardar el usuario:', error)
    // Validación segura del error sin usar 'any'
    const err = error as { response?: { data?: { message?: string } } }
    errorMessage.value =
      err.response?.data?.message || 'Ocurrió un error al intentar guardar el usuario.'
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
      <label for="nombre" class="form-label fw-bold">Nombre Completo</label>
      <InputText id="nombre" v-model="form.nombre" required placeholder="Ej. Juan Pérez" />
    </div>

    <!-- Teléfono -->
    <div class="field mb-3">
      <label for="telefono" class="form-label fw-bold">Teléfono</label>
      <InputText id="telefono" v-model="form.telefono" required placeholder="Ej. 74829104" />
    </div>

    <!-- Correo Electrónico -->
    <div class="field mb-3">
      <label for="email" class="form-label fw-bold">Correo Electrónico</label>
      <InputText
        id="email"
        type="email"
        v-model="form.email"
        required
        placeholder="Ej. juan.perez@gmail.com"
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
