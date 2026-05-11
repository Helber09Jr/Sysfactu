// Constantes del sistema SYSFACTU
import { RolUsuario } from '@/tipos'

export const ROLES_USUARIO: RolUsuario[] = [
  'administrador',
  'cajero',
  'mozo',
  'cocinero',
  'almacenero'
]

export const ETIQUETAS_ROL: Record<RolUsuario, string> = {
  administrador: 'Administrador',
  cajero: 'Cajero',
  mozo: 'Mozo',
  cocinero: 'Cocinero',
  almacenero: 'Almacenero'
}

export const ESTADOS_MESA = ['libre', 'ocupada', 'reservada', 'inactiva'] as const

export const COLORES_ESTADO_MESA: Record<string, string> = {
  libre: 'bg-green-100 border-green-400 text-green-800',
  ocupada: 'bg-red-100 border-red-400 text-red-800',
  reservada: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  inactiva: 'bg-gray-100 border-gray-400 text-gray-500'
}

export const METODOS_PAGO = ['efectivo', 'tarjeta', 'yape', 'mixto'] as const

export const ETIQUETAS_METODO_PAGO: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  yape: 'Yape',
  mixto: 'Mixto'
}

export const TIPOS_ATENCION = ['mesa', 'mostrador', 'delivery'] as const

export const ETIQUETAS_TIPO_ATENCION: Record<string, string> = {
  mesa: 'Mesa',
  mostrador: 'Mostrador',
  delivery: 'Delivery'
}

export const CATEGORIAS_PRODUCTO = [
  'Platos',
  'Bebidas',
  'Postres',
  'Combos',
  'Entradas'
] as const

export const UNIDADES_MEDIDA = ['kg', 'litros', 'unidades', 'cajas', 'bolsas'] as const

export const NAVEGACION_POR_ROL: Record<RolUsuario, string[]> = {
  administrador: ['dashboard', 'ventas', 'facturacion', 'mesas', 'inventario', 'reportes', 'configuracion'],
  cajero: ['ventas', 'facturacion'],
  mozo: ['mesas'],
  cocinero: ['mesas'],
  almacenero: ['inventario']
}

export const RUTAS_MODULOS: Record<string, { ruta: string; etiqueta: string; icono: string }> = {
  dashboard: { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'LayoutDashboard' },
  ventas: { ruta: '/ventas', etiqueta: 'Ventas', icono: 'ShoppingCart' },
  facturacion: { ruta: '/facturacion', etiqueta: 'Facturación', icono: 'FileText' },
  mesas: { ruta: '/mesas', etiqueta: 'Mesas', icono: 'UtensilsCrossed' },
  inventario: { ruta: '/inventario', etiqueta: 'Inventario', icono: 'Package' },
  reportes: { ruta: '/reportes', etiqueta: 'Reportes', icono: 'BarChart2' },
  configuracion: { ruta: '/configuracion', etiqueta: 'Configuración', icono: 'Settings' }
}

export const IGV_PORCENTAJE = 0.18
export const INTERVALO_ACTUALIZACION_DASHBOARD = 30000 // 30 segundos
