export type RolUsuario = 'comprador' | 'vendedor'

export interface RegistroCompradorPayload {
  nombre: string
  telefono: string
  email: string
  clave: string
  rol: RolUsuario
}
