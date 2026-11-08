import type { Categoria } from './categoria'
import type { Autor } from './autor'

export interface Libro {
  id?: number
  titulo: string
  isbn?: string
  precio: number
  stock: number
  categoriaId: number
  categoria?: Categoria
  autorId: number
  autor?: Autor
  createdAt?: string
  updatedAt?: string
}
