import type { AuthUser } from '@/stores/index'

export interface ItemDetalleComprobante {
  titulo: string
  cantidad: number
  precioUnitario: number
  subtotal?: number
}

export interface DatosComprobanteCompra {
  codigoVenta?: string | number
  fecha?: string | Date
  comprador: AuthUser | null
  items: ItemDetalleComprobante[]
  total: number
  observacion?: string
}

function formatearMoneda(monto: number): string {
  return `Bs. ${Number(monto || 0).toFixed(2)}`
}

function formatearFecha(fecha?: string | Date): string {
  const dateObj = fecha ? new Date(fecha) : new Date()
  if (Number.isNaN(dateObj.getTime())) {
    return new Date().toLocaleString('es-BO')
  }
  return dateObj.toLocaleString('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function descargarComprobantePng(datos: DatosComprobanteCompra): void {
  const itemsNormalizados = datos.items.map((item) => {
    const subtotal =
      typeof item.subtotal === 'number'
        ? item.subtotal
        : Number(item.cantidad || 0) * Number(item.precioUnitario || 0)
    return {
      ...item,
      subtotal,
    }
  })

  const totalCalculado =
    typeof datos.total === 'number' && datos.total > 0
      ? datos.total
      : itemsNormalizados.reduce((acc, row) => acc + row.subtotal, 0)

  const ancho = 760
  const altoBase = 360
  const altoFila = 46
  const altoTotal = Math.max(540, altoBase + itemsNormalizados.length * altoFila + 120)

  const canvas = document.createElement('canvas')
  canvas.width = ancho
  canvas.height = altoTotal

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Fondo general
  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(0, 0, ancho, altoTotal)

  // Tarjeta del comprobante
  const margen = 28
  const cardX = margen
  const cardY = margen
  const cardW = ancho - margen * 2
  const cardH = altoTotal - margen * 2

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cardX, cardY, cardW, cardH)

  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.strokeRect(cardX, cardY, cardW, cardH)

  // Encabezado superior
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(cardX, cardY, cardW, 92)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 26px sans-serif'
  ctx.fillText('MAGNABOOKS', cardX + 28, cardY + 42)

  ctx.fillStyle = '#cbd5e1'
  ctx.font = '14px sans-serif'
  ctx.fillText('COMPROBANTE DE COMPRA Y RECOJO DE LIBROS', cardX + 28, cardY + 68)

  const codigoTexto = datos.codigoVenta
    ? `#${datos.codigoVenta}`
    : `CMP-${Date.now().toString().slice(-6)}`
  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`N° ${codigoTexto}`, cardX + cardW - 28, cardY + 40)

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '13px sans-serif'
  ctx.fillText(formatearFecha(datos.fecha), cardX + cardW - 28, cardY + 66)
  ctx.textAlign = 'left'

  // Sección: Datos del comprador
  let y = cardY + 122
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText('DATOS DEL COMPRADOR', cardX + 28, y)

  y += 24
  ctx.fillStyle = '#334155'
  ctx.font = '14px sans-serif'

  const comprador = datos.comprador
  const nombreComprador = String(comprador?.nombre ?? comprador?.usuario ?? 'Cliente registrado')
  const usuarioComprador = String(comprador?.usuario ?? '—')
  const idComprador = comprador?.id !== undefined ? String(comprador.id) : '—'
  const rolComprador = String(comprador?.rol ?? comprador?.role ?? 'comprador')

  ctx.fillText(`Nombre: ${nombreComprador}`, cardX + 28, y)
  ctx.fillText(`Usuario: ${usuarioComprador}`, cardX + cardW / 2 + 10, y)

  y += 22
  ctx.fillText(`ID Comprador: ${idComprador}`, cardX + 28, y)
  ctx.fillText(`Rol: ${rolComprador}`, cardX + cardW / 2 + 10, y)

  // Línea separadora
  y += 20
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cardX + 28, y)
  ctx.lineTo(cardX + cardW - 28, y)
  ctx.stroke()

  // Encabezado de tabla del detalle de venta
  y += 28
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText('DETALLE DE VENTA', cardX + 28, y)

  y += 26
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(cardX + 28, y - 16, cardW - 56, 30)

  ctx.fillStyle = '#475569'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillText('Libro', cardX + 36, y + 3)
  ctx.textAlign = 'right'
  ctx.fillText('Cant.', cardX + cardW - 255, y + 3)
  ctx.fillText('P. Unit.', cardX + cardW - 140, y + 3)
  ctx.fillText('Subtotal', cardX + cardW - 36, y + 3)
  ctx.textAlign = 'left'

  // Filas del detalle
  y += 28
  ctx.font = '14px sans-serif'
  for (const item of itemsNormalizados) {
    ctx.fillStyle = '#0f172a'
    const tituloCorto = item.titulo.length > 38 ? `${item.titulo.slice(0, 35)}...` : item.titulo
    ctx.fillText(tituloCorto, cardX + 36, y)

    ctx.textAlign = 'right'
    ctx.fillStyle = '#334155'
    ctx.fillText(String(item.cantidad), cardX + cardW - 255, y)
    ctx.fillText(formatearMoneda(item.precioUnitario), cardX + cardW - 140, y)

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(formatearMoneda(item.subtotal), cardX + cardW - 36, y)
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'left'

    ctx.strokeStyle = '#f1f5f9'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cardX + 28, y + 12)
    ctx.lineTo(cardX + cardW - 28, y + 12)
    ctx.stroke()

    y += altoFila
  }

  // Total a pagar
  y += 12
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`TOTAL PAGADO: ${formatearMoneda(totalCalculado)}`, cardX + cardW - 36, y)
  ctx.textAlign = 'left'

  // Nota de recojo al pie
  y += 42
  ctx.fillStyle = '#fef3c7'
  ctx.fillRect(cardX + 28, y - 18, cardW - 56, 44)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1
  ctx.strokeRect(cardX + 28, y - 18, cardW - 56, 44)

  ctx.fillStyle = '#92400e'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillText(
    datos.observacion ||
      'Presenta este comprobante (digital o impreso) junto con tu identificación para recoger tus libros.',
    cardX + 40,
    y + 8,
  )

  const nombreArchivo = `comprobante-magnabooks-${codigoTexto.replace(/[^a-zA-Z0-9-_]/g, '')}.png`

  canvas.toBlob((blob) => {
    if (!blob) {
      const fallbackLink = document.createElement('a')
      fallbackLink.download = nombreArchivo
      fallbackLink.href = canvas.toDataURL('image/png')
      document.body.appendChild(fallbackLink)
      fallbackLink.click()
      fallbackLink.remove()
      return
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombreArchivo
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}
