import type { Libro } from './libro'

export interface DetalleVentaDto {
  libroId: number | null
  cantidad: number
}

export interface DetalleVenta {
  id?: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  libroId?: number
  libro?: Libro
}
