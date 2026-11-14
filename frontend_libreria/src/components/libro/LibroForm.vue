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

// Estado reactivo del formulario (actualizado con categoriaId e autorId)
const form = ref<Partial<Libro>>({
  titulo: '',
  isbn: '',
  precio: 0,
  stock: 0,
  categoriaId: undefined,
  autorId: undefined,
})

// Listas para los Selects (Llaves foráneas)
const categorias = ref<Categoria[]>([])
const autores = ref<Autor[]>([])

const loading = ref(false)
const errorMessage = ref<string | null>(null)

// Cargar categorías y autores para los selects
async function cargarCatalogos() {
  try {
    const [resCategorias, resAutores] = await Promise.all([
      http.get('categorias'),
      http.get('autores'),
    ])
    categorias.value = resCategorias.data
    autores.value = resAutores.data
  } catch (error) {
    console.error('Error al cargar catálogos:', error)
  }
}

// Sincronizar datos si estamos editando
watch(
  () => props.libroEdit,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    } else {
      form.value = {
        titulo: '',
        isbn: '',
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

    if (form.value.id) {
      await http.patch(`${ENDPOINT}/${form.value.id}`, form.value)
    } else {
      await http.post(ENDPOINT, form.value)
    }

    emit('saved')
  } catch (error) {
    console.error('Error al guardar el libro:', error)
    errorMessage.value = 'Ocurrió un error al intentar guardar el libro.'
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
      <InputText id="isbn" v-model="form.isbn" placeholder="Ej. 978-3-16-148410-0" />
    </div>

    <!-- Precio y Stock (Fila doble) -->
    <div class="row">
      <div class="col-md-6 field mb-3">
        <label for="precio" class="form-label fw-bold">Precio ($us)</label>
        <InputNumber
          id="precio"
          v-model="form.precio"
          mode="currency"
          currency="USD"
          locale="en-US"
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
