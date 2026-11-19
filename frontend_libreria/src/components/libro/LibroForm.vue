<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import type { Libro } from '@/models/libro'
import type { Categoria } from '@/models/categoria'
import type { Autor } from '@/models/autor'

const ENDPOINT = 'libros'

const props = defineProps<{
  libroEdit?: Libro | null
}>()

const emit = defineEmits(['saved', 'close'])

interface LibroFormState {
  id?: number
  titulo: string
  isbn: string
  portada: string
  precio: number
  stock: number
  categoriaId?: number
  autorId?: number
}

const form = ref<LibroFormState>({
  titulo: '',
  isbn: '',
  portada: '',
  precio: 0,
  stock: 0,
  categoriaId: undefined,
  autorId: undefined,
})

const categorias = ref<Categoria[]>([])
const autores = ref<Autor[]>([])
const previewError = ref(false)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

watch(
  () => form.value.portada,
  () => {
    previewError.value = false
  },
)

async function cargarCatalogos() {
  try {
    const [resCategorias, resAutores] = await Promise.all([
      http.get('categorias'),
      http.get('autores'),
    ])
    categorias.value = Array.isArray(resCategorias.data)
      ? resCategorias.data
      : resCategorias.data?.data || []
    autores.value = Array.isArray(resAutores.data) ? resAutores.data : resAutores.data?.data || []
  } catch (error) {
    console.error('Error al cargar catálogos:', error)
  }
}

watch(
  () => props.libroEdit,
  (newVal) => {
    previewError.value = false
    if (newVal) {
      form.value = {
        id: newVal.id,
        titulo: newVal.titulo ?? '',
        isbn: newVal.isbn ?? '',
        portada: newVal.portada ?? '',
        precio: Number(newVal.precio ?? 0),
        stock: Number(newVal.stock ?? 0),
        categoriaId: newVal.categoria?.id ?? newVal.categoriaId,
        autorId: newVal.autor?.id ?? newVal.autorId,
      }
    } else {
      form.value = {
        titulo: '',
        isbn: '',
        portada: '',
        precio: 0,
        stock: 0,
        categoriaId: undefined,
        autorId: undefined,
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  cargarCatalogos()
})

async function guardar() {
  try {
    loading.value = true
    errorMessage.value = null

    const portadaLimpia = form.value.portada.trim()
    const payload = {
      titulo: form.value.titulo.trim(),
      isbn: form.value.isbn.trim(),
      portada: portadaLimpia || undefined,
      precio: Number(form.value.precio ?? 0),
      stock: Number(form.value.stock ?? 0),
      categoriaId: Number(form.value.categoriaId),
      autorId: Number(form.value.autorId),
    }

    if (form.value.id) {
      await http.patch(`${ENDPOINT}/${form.value.id}`, payload)
    } else {
      await http.post(ENDPOINT, payload)
    }

    emit('saved')
  } catch (error: unknown) {
    console.error('Error al guardar el libro:', error)
    const axiosError = error as { response?: { data?: { message?: string | string[] } } }
    const msg = axiosError?.response?.data?.message
    errorMessage.value = Array.isArray(msg)
      ? msg.join(', ')
      : typeof msg === 'string'
        ? msg
        : 'Ocurrió un error al intentar guardar el libro.'
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

    <!-- Título -->
    <div class="field mb-3">
      <label for="titulo" class="form-label fw-bold">Título del Libro</label>
      <InputText
        id="titulo"
        v-model="form.titulo"
        required
        placeholder="Ej. Cien años de soledad"
      />
    </div>

    <!-- ISBN -->
    <div class="field mb-3">
      <label for="isbn" class="form-label fw-bold">ISBN</label>
      <InputText id="isbn" v-model="form.isbn" required placeholder="Ej. 978-3-16-148410-0" />
    </div>

    <!-- URL de Portada -->
    <div class="field mb-3">
      <label for="portada" class="form-label fw-bold">URL de Portada</label>
      <InputText
        id="portada"
        v-model="form.portada"
        type="url"
        placeholder="https://ejemplo.com/portada.jpg"
      />
      <div v-if="form.portada.trim()" class="mt-2 d-flex align-items-center gap-3">
        <img
          v-if="!previewError"
          :src="form.portada.trim()"
          alt="Vista previa de portada"
          class="rounded border"
          style="width: 56px; height: 78px; object-fit: cover"
          @error="previewError = true"
        />
        <small class="text-muted">
          {{
            previewError
              ? 'No se pudo cargar la vista previa de esta URL.'
              : 'Vista previa de la portada'
          }}
        </small>
      </div>
    </div>

    <!-- Precio y Stock -->
    <div class="row">
      <div class="col-md-6 field mb-3">
        <label for="precio" class="form-label fw-bold">Precio (Bs)</label>
        <InputNumber
          id="precio"
          v-model="form.precio"
          prefix="Bs. "
          :minFractionDigits="2"
          :maxFractionDigits="2"
          :min="0"
          required
        />
      </div>
      <div class="col-md-6 field mb-3">
        <label for="stock" class="form-label fw-bold">Stock</label>
        <InputNumber id="stock" v-model="form.stock" :min="0" required />
      </div>
    </div>

    <!-- Categoría -->
    <div class="field mb-3">
      <label for="categoria" class="form-label fw-bold">Categoría</label>
      <Select
        id="categoria"
        v-model="form.categoriaId"
        :options="categorias"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Seleccione una categoría"
        class="w-100"
        required
      />
    </div>

    <!-- Autor -->
    <div class="field mb-3">
      <label for="autor" class="form-label fw-bold">Autor</label>
      <Select
        id="autor"
        v-model="form.autorId"
        :options="autores"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Seleccione un autor"
        class="w-100"
        required
      >
        <template #option="slotProps">
          <div>{{ slotProps.option.nombre }} {{ slotProps.option.apellido }}</div>
        </template>
      </Select>
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
