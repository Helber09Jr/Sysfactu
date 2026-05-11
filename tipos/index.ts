// Tipos principales del sistema SYSFACTU

// ==================== AUTENTICACIÓN ====================
export type RolUsuario = 'administrador' | 'cajero' | 'mozo' | 'cocinero' | 'almacenero'

export interface DatosLogin {
  email: string
  contrasena: string
}

export interface RespuestaLogin {
  exito: boolean
  rol: RolUsuario
  mensaje?: string
}

// ==================== USUARIOS ====================
export interface Usuario {
  id: string
  nombre: string
  login: string
  rol: RolUsuario
  estado: 'activo' | 'inactivo'
  fotoPerfil?: string
  fechaCreacion: Date
  supabaseUserId?: string
}

// ==================== EMPRESA ====================
export interface Empresa {
  id: string
  ruc: string
  razonSocial: string
  direccion: string
  telefono: string
  logo?: string
  certificadoDigital?: string
  vencimientoCertificado?: Date
}

// ==================== PRODUCTOS ====================
export interface Producto {
  id: string
  nombre: string
  precio: number
  categoria: string
  imagen?: string
  stockDisponible: number
  activo: boolean
  descripcion?: string
}

// ==================== VENTAS ====================
export interface ItemCarrito {
  producto: Producto
  cantidad: number
  subtotal: number
  observacion?: string
}

export type TipoAtencion = 'mesa' | 'mostrador' | 'delivery'
export type MetodoPago = 'efectivo' | 'tarjeta' | 'yape' | 'mixto'
export type EstadoVenta = 'completada' | 'anulada' | 'pendiente'

export interface Venta {
  id: string
  items: ItemCarrito[]
  total: number
  descuento: number
  tipoAtencion: TipoAtencion
  metodoPago: MetodoPago
  montoRecibido?: number
  vuelto?: number
  cajeroId: string
  mesaId?: string
  fecha: Date
  estado: EstadoVenta
}

// ==================== FACTURACIÓN ====================
export interface ItemComprobante {
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export type TipoComprobante = 'boleta' | 'factura'
export type EstadoComprobante = 'emitido' | 'aceptado' | 'rechazado' | 'pendiente' | 'anulado'

export interface Comprobante {
  id: string
  tipo: TipoComprobante
  serie: string
  numero: number
  clienteRuc?: string
  clienteNombre: string
  clienteDireccion?: string
  items: ItemComprobante[]
  subtotal: number
  igv: number
  total: number
  estado: EstadoComprobante
  cdrRespuesta?: string
  codigoError?: string
  fechaEmision: Date
  ventaId: string
}

export interface RespuestaSunat {
  aceptado: boolean
  cdr?: string
  codigoError?: string
  descripcionError?: string
}

// ==================== MESAS ====================
export type EstadoMesa = 'libre' | 'ocupada' | 'reservada' | 'inactiva'

export interface Mesa {
  id: string
  numero: string
  capacidad: number
  estado: EstadoMesa
  mozoAsignado?: string
  nombreMozo?: string
  horaInicio?: Date
  pedidoActualId?: string
}

export type EstadoPedido = 'solicitado' | 'en_preparacion' | 'despachado' | 'entregado'
export type EstadoItemPedido = 'pendiente' | 'preparando' | 'listo'

export interface ItemPedido {
  id?: string
  productoId: string
  nombreProducto: string
  cantidad: number
  observacion?: string
  estado: EstadoItemPedido
}

export interface Pedido {
  id: string
  mesaId: string
  mozoId: string
  items: ItemPedido[]
  estado: EstadoPedido
  horaCreacion: Date
  observaciones?: string
}

// ==================== INVENTARIO ====================
export type UnidadMedida = 'kg' | 'litros' | 'unidades' | 'cajas' | 'bolsas'
export type TipoMovimiento = 'entrada' | 'salida'

export interface Insumo {
  id: string
  nombre: string
  categoria: string
  unidadMedida: UnidadMedida
  stockActual: number
  stockMinimo: number
  precioUnitario: number
  activo: boolean
}

export interface MovimientoInventario {
  id: string
  insumoId: string
  nombreInsumo?: string
  tipo: TipoMovimiento
  cantidad: number
  motivo?: string
  proveedor?: string
  precioUnitario?: number
  stockResultante: number
  usuarioId: string
  fecha: Date
  numeroGuia?: string
}

// ==================== REPORTES ====================
export interface DatoGraficaVentas {
  dia: string
  total: number
  transacciones: number
}

export interface DatoTopProducto {
  nombre: string
  cantidad: number
  monto: number
}

export interface DatoMetodoPago {
  metodo: string
  monto: number
  porcentaje: number
}

export interface KPIVentas {
  totalVentas: number
  numeroTransacciones: number
  ticketPromedio: number
  variacionTotal: number
  variacionTransacciones: number
}

export interface ReporteMozo {
  mozo: Usuario
  mesasAtendidas: number
  totalPedidos: number
  montoGenerado: number
}

// ==================== NAVEGACIÓN ====================
export interface ItemNavegacion {
  ruta: string
  etiqueta: string
  icono: string
  roles: RolUsuario[]
}
