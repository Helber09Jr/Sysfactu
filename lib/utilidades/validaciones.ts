// Validaciones del sistema SYSFACTU

export function validarRUC(ruc: string): boolean {
  if (!/^\d{11}$/.test(ruc)) return false
  const primerDigito = parseInt(ruc[0])
  return primerDigito === 1 || primerDigito === 2
}

export function validarDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni)
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export type NivelContrasena = 'debil' | 'media' | 'fuerte'

export function validarContrasena(contrasena: string): NivelContrasena {
  if (contrasena.length < 6) return 'debil'
  const tieneMayusculas = /[A-Z]/.test(contrasena)
  const tieneMinusculas = /[a-z]/.test(contrasena)
  const tieneNumeros = /\d/.test(contrasena)
  const tieneEspeciales = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena)
  const puntaje = [tieneMayusculas, tieneMinusculas, tieneNumeros, tieneEspeciales].filter(Boolean).length
  if (contrasena.length >= 8 && puntaje >= 3) return 'fuerte'
  if (contrasena.length >= 6 && puntaje >= 2) return 'media'
  return 'debil'
}

export function validarCantidad(cantidad: number): boolean {
  return cantidad > 0 && Number.isFinite(cantidad)
}

export function validarPrecio(precio: number): boolean {
  return precio >= 0 && Number.isFinite(precio)
}
