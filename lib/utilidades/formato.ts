// Utilidades de formato para el sistema SYSFACTU

export function formatearMoneda(monto: number): string {
  return `S/.${monto.toFixed(2)}`
}

export function formatearFecha(fecha: Date | string, formato?: string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  if (formato === 'largo') {
    return fechaObj.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
  return fechaObj.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatearHora(fecha: Date | string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  return fechaObj.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calcularIGV(subtotal: number): number {
  return parseFloat((subtotal * 0.18).toFixed(2))
}

export function calcularVuelto(total: number, montoRecibido: number): number {
  return parseFloat((montoRecibido - total).toFixed(2))
}

export function calcularSubtotalSinIGV(totalConIGV: number): number {
  return parseFloat((totalConIGV / 1.18).toFixed(2))
}

export function formatearTiempoTranscurrido(horaInicio: Date | string): string {
  const inicio = typeof horaInicio === 'string' ? new Date(horaInicio) : horaInicio
  const ahora = new Date()
  const diferencia = ahora.getTime() - inicio.getTime()
  const minutos = Math.floor(diferencia / 60000)
  const horas = Math.floor(minutos / 60)
  if (horas > 0) {
    return `${horas}h ${minutos % 60}m`
  }
  return `${minutos}m`
}
