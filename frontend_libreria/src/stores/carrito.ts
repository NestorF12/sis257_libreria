import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import type { Libro } from '@/models/libro'
import { useAuthStore } from '@/stores/index'

export interface ItemCarrito {
  libro: Libro
  cantidad: number
}

const STORAGE_KEY = 'magnabooks_carrito'

export const useCarritoStore = defineStore('carrito', () => {
  const authStore = useAuthStore()

  const items = ref<ItemCarrito[]>(cargarDesdeStorage())
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  function cargarDesdeStorage(): ItemCarrito[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  watch(
    items,
    (nuevoValor) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoValor))
    },
    { deep: true },
  )

  const cantidadTotal = computed(() => items.value.reduce((acc, item) => acc + item.cantidad, 0))

  const totalPagar = computed(() =>
    items.value.reduce((acc, item) => acc + Number(item.libro.precio ?? 0) * item.cantidad, 0),
  )

  function agregarLibro(libro: Libro, cantidad = 1) {
    if (!libro?.id) return
    const stockDisponible = libro.stock ?? 0
    if (stockDisponible <= 0) return

    const existente = items.value.find((i) => i.libro.id === libro.id)
    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, stockDisponible)
    } else {
      items.value.push({
        libro,
        cantidad: Math.min(cantidad, stockDisponible),
      })
    }
  }

  function actualizarCantidad(libroId: number, cantidad: number) {
    const idx = items.value.findIndex((i) => i.libro.id === libroId)
    if (idx === -1) return

    if (cantidad <= 0) {
      items.value.splice(idx, 1)
      return
    }

    const item = items.value[idx]
    if (!item) return

    const stockDisponible = item.libro.stock ?? cantidad
    item.cantidad = Math.min(cantidad, stockDisponible)
  }

  function quitarLibro(libroId: number) {
    items.value = items.value.filter((i) => i.libro.id !== libroId)
  }

  function limpiarCarrito() {
    items.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  async function confirmarCompra(endpointVentas = 'ventas') {
    if (items.value.length === 0) return

    const usuarioId = authStore.user?.id
    if (!usuarioId) {
      errorMessage.value = 'No se pudo identificar al usuario autenticado.'
      throw new Error(errorMessage.value)
    }

    try {
      loading.value = true
      errorMessage.value = null

      const payload = {
        usuarioId: Number(usuarioId),
        detalles: items.value
          .filter(
            (item): item is ItemCarrito & { libro: Libro & { id: number } } =>
              typeof item.libro.id === 'number',
          )
          .map((item) => ({
            libroId: item.libro.id,
            cantidad: item.cantidad,
          })),
      }

      const response = await http.post(endpointVentas, payload)
      limpiarCarrito()
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string | string[] } } }
      const backendMessage = axiosError?.response?.data?.message

      if (Array.isArray(backendMessage)) {
        errorMessage.value = backendMessage.join(', ')
      } else if (typeof backendMessage === 'string') {
        errorMessage.value = backendMessage
      } else if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'No se pudo completar la compra.'
      }

      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    errorMessage,
    cantidadTotal,
    totalPagar,
    agregarLibro,
    actualizarCantidad,
    quitarLibro,
    limpiarCarrito,
    confirmarCompra,
  }
})
