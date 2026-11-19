import { computed, ref, type Ref } from 'vue'

export function normalizarTexto(valor: unknown): string {
  return String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function useBuscador<T>(
  items: Ref<T[]> | (() => T[]),
  obtenerCampos: (item: T) => Array<unknown>,
) {
  const termino = ref('')

  const itemsFiltrados = computed<T[]>(() => {
    const lista = typeof items === 'function' ? items() : items.value
    const consulta = normalizarTexto(termino.value)

    if (!consulta) return lista

    return lista.filter((item) =>
      obtenerCampos(item).some((campo) => normalizarTexto(campo).includes(consulta)),
    )
  })

  function limpiarBusqueda() {
    termino.value = ''
  }

  return {
    termino,
    itemsFiltrados,
    limpiarBusqueda,
  }
}
