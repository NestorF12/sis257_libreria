<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import type { Usuario } from '@/models/usuario'
import type { Libro } from '@/models/libro'
import type { DetalleVentaDto } from '@/models/venta'

const ENDPOINT = 'ventas'

const emit = defineEmits(['saved', 'close'])

const usuarios = ref<Usuario[]>([])
const libros = ref<Libro[]>([])

// Estructura estrictamente tipada
interface FormVenta {
  usuarioId: number | null
  detalles: DetalleVentaDto[]
}

const form = ref<FormVenta>({
  usuarioId: null,
  detalles: [
    {
      libroId: null,
      cantidad: 1,
    },
  ],
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

async function cargarCatalogos() {
  try {
    const [resUsuarios, resLibros] = await Promise.all([http.get('usuarios'), http.get('libros')])
    usuarios.value = Array.isArray(resUsuarios.data)
      ? resUsuarios.data
      : resUsuarios.data?.data || []
    libros.value = Array.isArray(resLibros.data) ? resLibros.data : resLibros.data?.data || []
  } catch (error) {
    console.error('Error al cargar catálogos para ventas:', error)
  }
}

function agregarItem() {
  form.value.detalles.push({ libroId: null, cantidad: 1 })
}

function removerItem(index: number) {
  if (form.value.detalles.length > 1) {
    form.value.detalles.splice(index, 1)
  }
}

async function guardar() {
  try {
    loading.value = true
    errorMessage.value = null

    await http.post(ENDPOINT, form.value)
    emit('saved')
  } catch (error: unknown) {
    console.error('Error al registrar la venta:', error)
    const err = error as { response?: { data?: { message?: string } } }
    errorMessage.value = err.response?.data?.message || 'Ocurrió un error al registrar la venta.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarCatalogos()
})
</script>

<template>
  <form @submit.prevent="guardar" class="p-fluid">
    <div v-if="errorMessage" class="alert alert-danger mb-3" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Selección de Usuario / Cliente -->
    <div class="field mb-3">
      <label for="usuario" class="form-label fw-bold">Cliente (Usuario)</label>
      <Select
        id="usuario"
        v-model="form.usuarioId"
        :options="usuarios"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Seleccione un usuario comprador"
        class="w-100"
        required
      >
        <template #option="slotProps">
          <div>{{ slotProps.option.nombre }} ({{ slotProps.option.email }})</div>
        </template>
      </Select>
    </div>

    <hr class="my-4" />
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="fw-bold m-0" style="color: #4b3049">Libros en el Carrito</h6>
      <Button
        type="button"
        label="Agregar Libro"
        icon="pi pi-plus"
        size="small"
        class="p-button-outlined"
        @click="agregarItem"
      />
    </div>

    <!-- Dinámica de Ítems del Carrito -->
    <div
      v-for="(item, index) in form.detalles"
      :key="index"
      class="card p-3 mb-3 bg-light border-0"
    >
      <div class="row g-2 align-items-center">
        <div class="col-md-7">
          <label class="form-label small fw-bold">Libro</label>
          <Select
            v-model="item.libroId"
            :options="libros"
            optionLabel="titulo"
            optionValue="id"
            placeholder="Seleccione un libro"
            class="w-100"
            required
          >
            <template #option="slotProps">
              <div>{{ slotProps.option.titulo }} - Bs. {{ slotProps.option.precio }}</div>
            </template>
          </Select>
        </div>
        <div class="col-md-3">
          <label class="form-label small fw-bold">Cantidad</label>
          <InputNumber v-model="item.cantidad" :min="1" required class="w-100" />
        </div>
        <div class="col-md-2 text-center pt-3">
          <Button
            type="button"
            icon="pi pi-trash"
            severity="danger"
            text
            @click="removerItem(index)"
            :disabled="form.detalles.length === 1"
          />
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="d-flex justify-content-end gap-2 mt-4">
      <Button type="button" label="Cancelar" severity="secondary" text @click="emit('close')" />
      <Button
        type="submit"
        label="Procesar Venta"
        icon="pi pi-check"
        severity="success"
        :loading="loading"
      />
    </div>
  </form>
</template>
