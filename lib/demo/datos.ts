// Datos de demostración para el prototipo SYSFACTU
import { Usuario, Producto, Mesa, Venta, Insumo, MovimientoInventario, Comprobante, Pedido } from '@/tipos'

export const USUARIO_DEMO: Usuario = {
  id: 'usr-admin-001',
  nombre: 'Carlos Mendoza',
  login: 'admin@sysfactu.com',
  rol: 'administrador',
  estado: 'activo',
  fechaCreacion: new Date('2026-01-01')
}

export const USUARIOS_DEMO: Usuario[] = [
  { id: 'usr-001', nombre: 'Carlos Mendoza', login: 'admin@sysfactu.com', rol: 'administrador', estado: 'activo', fechaCreacion: new Date('2026-01-01') },
  { id: 'usr-002', nombre: 'Ana Torres', login: 'cajero@sysfactu.com', rol: 'cajero', estado: 'activo', fechaCreacion: new Date('2026-01-15') },
  { id: 'usr-003', nombre: 'Luis Quispe', login: 'mozo1@sysfactu.com', rol: 'mozo', estado: 'activo', fechaCreacion: new Date('2026-02-01') },
  { id: 'usr-004', nombre: 'Rosa Mamani', login: 'mozo2@sysfactu.com', rol: 'mozo', estado: 'activo', fechaCreacion: new Date('2026-02-10') },
  { id: 'usr-005', nombre: 'Pedro Cáceres', login: 'cocina@sysfactu.com', rol: 'cocinero', estado: 'activo', fechaCreacion: new Date('2026-03-01') },
  { id: 'usr-006', nombre: 'Juana Flores', login: 'almacen@sysfactu.com', rol: 'almacenero', estado: 'inactivo', fechaCreacion: new Date('2026-03-15') },
]

export const PRODUCTOS_DEMO: Producto[] = [
  { id: 'prod-001', nombre: 'Lomo Saltado', precio: 28.00, categoria: 'Platos', stockDisponible: 50, activo: true, descripcion: 'Clásico lomo saltado con papas y arroz' },
  { id: 'prod-002', nombre: 'Ají de Gallina', precio: 22.00, categoria: 'Platos', stockDisponible: 40, activo: true, descripcion: 'Delicioso ají de gallina con arroz y papas' },
  { id: 'prod-003', nombre: 'Ceviche Clásico', precio: 32.00, categoria: 'Platos', stockDisponible: 30, activo: true, descripcion: 'Ceviche de pescado fresco con choclo y camote' },
  { id: 'prod-004', nombre: 'Pollo a la Brasa (1/4)', precio: 18.00, categoria: 'Platos', stockDisponible: 60, activo: true, descripcion: 'Pollo a la brasa con papas fritas y ensalada' },
  { id: 'prod-005', nombre: 'Arroz con Leche', precio: 8.00, categoria: 'Postres', stockDisponible: 25, activo: true, descripcion: 'Arroz con leche cremoso con canela' },
  { id: 'prod-006', nombre: 'Mazamorra Morada', precio: 8.00, categoria: 'Postres', stockDisponible: 20, activo: true, descripcion: 'Mazamorra morada tradicional' },
  { id: 'prod-007', nombre: 'Inca Kola 1L', precio: 6.00, categoria: 'Bebidas', stockDisponible: 100, activo: true },
  { id: 'prod-008', nombre: 'Chicha Morada', precio: 5.00, categoria: 'Bebidas', stockDisponible: 80, activo: true, descripcion: 'Chicha morada natural del día' },
  { id: 'prod-009', nombre: 'Agua San Luis', precio: 3.00, categoria: 'Bebidas', stockDisponible: 150, activo: true },
  { id: 'prod-010', nombre: 'Menú del Día', precio: 15.00, categoria: 'Combos', stockDisponible: 40, activo: true, descripcion: 'Sopa + segundo + refresco' },
  { id: 'prod-011', nombre: 'Anticuchos (6 und)', precio: 16.00, categoria: 'Entradas', stockDisponible: 35, activo: true, descripcion: 'Anticuchos de corazón con papas' },
  { id: 'prod-012', nombre: 'Tequeños (8 und)', precio: 12.00, categoria: 'Entradas', stockDisponible: 30, activo: true, descripcion: 'Tequeños de queso crujientes' },
]

export const MESAS_DEMO: Mesa[] = [
  { id: 'mesa-01', numero: '01', capacidad: 4, estado: 'libre' },
  { id: 'mesa-02', numero: '02', capacidad: 4, estado: 'ocupada', mozoAsignado: 'usr-003', nombreMozo: 'Luis Quispe', horaInicio: new Date(Date.now() - 45 * 60000) },
  { id: 'mesa-03', numero: '03', capacidad: 6, estado: 'libre' },
  { id: 'mesa-04', numero: '04', capacidad: 2, estado: 'reservada' },
  { id: 'mesa-05', numero: '05', capacidad: 4, estado: 'ocupada', mozoAsignado: 'usr-004', nombreMozo: 'Rosa Mamani', horaInicio: new Date(Date.now() - 20 * 60000) },
  { id: 'mesa-06', numero: '06', capacidad: 6, estado: 'libre' },
  { id: 'mesa-07', numero: '07', capacidad: 4, estado: 'libre' },
  { id: 'mesa-08', numero: '08', capacidad: 2, estado: 'inactiva' },
  { id: 'mesa-09', numero: '09', capacidad: 8, estado: 'ocupada', mozoAsignado: 'usr-003', nombreMozo: 'Luis Quispe', horaInicio: new Date(Date.now() - 90 * 60000) },
  { id: 'mesa-10', numero: '10', capacidad: 4, estado: 'libre' },
]

export const VENTAS_DEMO: Venta[] = [
  { id: 'vta-001', items: [], total: 85.00, descuento: 0, tipoAtencion: 'mesa', metodoPago: 'efectivo', cajeroId: 'usr-002', fecha: new Date(Date.now() - 2 * 3600000), estado: 'completada' },
  { id: 'vta-002', items: [], total: 46.00, descuento: 5, tipoAtencion: 'mostrador', metodoPago: 'yape', cajeroId: 'usr-002', fecha: new Date(Date.now() - 3 * 3600000), estado: 'completada' },
  { id: 'vta-003', items: [], total: 120.00, descuento: 0, tipoAtencion: 'delivery', metodoPago: 'tarjeta', cajeroId: 'usr-002', fecha: new Date(Date.now() - 5 * 3600000), estado: 'completada' },
  { id: 'vta-004', items: [], total: 34.00, descuento: 0, tipoAtencion: 'mesa', metodoPago: 'efectivo', montoRecibido: 50, vuelto: 16, cajeroId: 'usr-002', fecha: new Date(Date.now() - 6 * 3600000), estado: 'completada' },
  { id: 'vta-005', items: [], total: 28.00, descuento: 0, tipoAtencion: 'mostrador', metodoPago: 'mixto', cajeroId: 'usr-002', fecha: new Date(Date.now() - 24 * 3600000), estado: 'anulada' },
]

export const INSUMOS_DEMO: Insumo[] = [
  { id: 'ins-001', nombre: 'Lomo de res', categoria: 'Carnes', unidadMedida: 'kg', stockActual: 15, stockMinimo: 10, precioUnitario: 45.00, activo: true },
  { id: 'ins-002', nombre: 'Pechuga de pollo', categoria: 'Carnes', unidadMedida: 'kg', stockActual: 8, stockMinimo: 12, precioUnitario: 18.00, activo: true },
  { id: 'ins-003', nombre: 'Pescado fresco', categoria: 'Mariscos', unidadMedida: 'kg', stockActual: 6, stockMinimo: 8, precioUnitario: 25.00, activo: true },
  { id: 'ins-004', nombre: 'Arroz', categoria: 'Abarrotes', unidadMedida: 'kg', stockActual: 50, stockMinimo: 20, precioUnitario: 3.50, activo: true },
  { id: 'ins-005', nombre: 'Papa blanca', categoria: 'Verduras', unidadMedida: 'kg', stockActual: 30, stockMinimo: 15, precioUnitario: 2.00, activo: true },
  { id: 'ins-006', nombre: 'Aceite vegetal', categoria: 'Abarrotes', unidadMedida: 'litros', stockActual: 4, stockMinimo: 5, precioUnitario: 8.00, activo: true },
  { id: 'ins-007', nombre: 'Inca Kola 1L', categoria: 'Bebidas', unidadMedida: 'unidades', stockActual: 48, stockMinimo: 24, precioUnitario: 3.20, activo: true },
  { id: 'ins-008', nombre: 'Azúcar blanca', categoria: 'Abarrotes', unidadMedida: 'kg', stockActual: 12, stockMinimo: 10, precioUnitario: 2.80, activo: true },
]

export const MOVIMIENTOS_DEMO: MovimientoInventario[] = [
  { id: 'mov-001', insumoId: 'ins-001', nombreInsumo: 'Lomo de res', tipo: 'entrada', cantidad: 20, proveedor: 'Carnicería Central', precioUnitario: 45.00, stockResultante: 20, usuarioId: 'usr-006', fecha: new Date(Date.now() - 2 * 86400000) },
  { id: 'mov-002', insumoId: 'ins-001', nombreInsumo: 'Lomo de res', tipo: 'salida', cantidad: 5, motivo: 'venta', stockResultante: 15, usuarioId: 'usr-006', fecha: new Date(Date.now() - 1 * 86400000) },
  { id: 'mov-003', insumoId: 'ins-002', nombreInsumo: 'Pechuga de pollo', tipo: 'entrada', cantidad: 15, proveedor: 'Avícola Los Andes', precioUnitario: 18.00, stockResultante: 15, usuarioId: 'usr-006', fecha: new Date(Date.now() - 3 * 86400000) },
  { id: 'mov-004', insumoId: 'ins-002', nombreInsumo: 'Pechuga de pollo', tipo: 'salida', cantidad: 7, motivo: 'venta', stockResultante: 8, usuarioId: 'usr-006', fecha: new Date(Date.now() - 12 * 3600000) },
  { id: 'mov-005', insumoId: 'ins-004', nombreInsumo: 'Arroz', tipo: 'entrada', cantidad: 50, proveedor: 'Distribuidora Granos SA', precioUnitario: 3.50, stockResultante: 50, usuarioId: 'usr-006', fecha: new Date(Date.now() - 5 * 86400000) },
]

export const COMPROBANTES_DEMO: Comprobante[] = [
  { id: 'cmp-001', tipo: 'boleta', serie: 'B001', numero: 1042, clienteNombre: 'Cliente general', items: [], subtotal: 72.03, igv: 12.97, total: 85.00, estado: 'aceptado', cdrRespuesta: 'CDR-20260510-1042', fechaEmision: new Date(Date.now() - 2 * 3600000), ventaId: 'vta-001' },
  { id: 'cmp-002', tipo: 'boleta', serie: 'B001', numero: 1041, clienteNombre: 'María García', items: [], subtotal: 38.98, igv: 7.02, total: 46.00, estado: 'aceptado', cdrRespuesta: 'CDR-20260510-1041', fechaEmision: new Date(Date.now() - 3 * 3600000), ventaId: 'vta-002' },
  { id: 'cmp-003', tipo: 'factura', serie: 'F001', numero: 215, clienteRuc: '20123456789', clienteNombre: 'Restaurant El Buen Sabor SAC', items: [], subtotal: 101.69, igv: 18.31, total: 120.00, estado: 'aceptado', cdrRespuesta: 'CDR-20260510-215', fechaEmision: new Date(Date.now() - 5 * 3600000), ventaId: 'vta-003' },
]

export const PEDIDOS_DEMO: Pedido[] = [
  {
    id: 'ped-001', mesaId: 'mesa-02', mozoId: 'usr-003', estado: 'solicitado', horaCreacion: new Date(Date.now() - 10 * 60000),
    items: [
      { id: 'ip-001', productoId: 'prod-001', nombreProducto: 'Lomo Saltado', cantidad: 2, estado: 'pendiente' },
      { id: 'ip-002', productoId: 'prod-008', nombreProducto: 'Chicha Morada', cantidad: 2, estado: 'pendiente' },
    ]
  },
  {
    id: 'ped-002', mesaId: 'mesa-05', mozoId: 'usr-004', estado: 'en_preparacion', horaCreacion: new Date(Date.now() - 18 * 60000),
    items: [
      { id: 'ip-003', productoId: 'prod-003', nombreProducto: 'Ceviche Clásico', cantidad: 1, estado: 'preparando' },
      { id: 'ip-004', productoId: 'prod-011', nombreProducto: 'Anticuchos (6 und)', cantidad: 1, observacion: 'Poco picante', estado: 'preparando' },
    ]
  },
  {
    id: 'ped-003', mesaId: 'mesa-09', mozoId: 'usr-003', estado: 'solicitado', horaCreacion: new Date(Date.now() - 5 * 60000),
    items: [
      { id: 'ip-005', productoId: 'prod-004', nombreProducto: 'Pollo a la Brasa (1/4)', cantidad: 3, estado: 'pendiente' },
      { id: 'ip-006', productoId: 'prod-007', nombreProducto: 'Inca Kola 1L', cantidad: 2, estado: 'pendiente' },
    ]
  },
]

export const GRAFICA_VENTAS_DEMO = [
  { dia: '05/05', total: 320, transacciones: 12 },
  { dia: '06/05', total: 485, transacciones: 18 },
  { dia: '07/05', total: 290, transacciones: 10 },
  { dia: '08/05', total: 610, transacciones: 22 },
  { dia: '09/05', total: 540, transacciones: 20 },
  { dia: '10/05', total: 745, transacciones: 28 },
  { dia: '11/05', total: 383, transacciones: 14 },
]

export const TOP_PRODUCTOS_DEMO = [
  { nombre: 'Lomo Saltado', cantidad: 48, monto: 1344.00 },
  { nombre: 'Menú del Día', cantidad: 72, monto: 1080.00 },
  { nombre: 'Ceviche Clásico', cantidad: 32, monto: 1024.00 },
  { nombre: 'Pollo a la Brasa (1/4)', cantidad: 55, monto: 990.00 },
  { nombre: 'Chicha Morada', cantidad: 120, monto: 600.00 },
]

export const DESGLOSE_PAGOS_DEMO = [
  { metodo: 'Efectivo', monto: 1580, porcentaje: 42 },
  { metodo: 'Yape', monto: 1125, porcentaje: 30 },
  { metodo: 'Tarjeta', monto: 750, porcentaje: 20 },
  { metodo: 'Mixto', monto: 300, porcentaje: 8 },
]

export const KPI_DEMO = {
  totalVentas: 3755.00,
  numeroTransacciones: 124,
  ticketPromedio: 30.28,
  variacionTotal: 14.3,
  variacionTransacciones: 8.7,
}

// Credenciales válidas en modo demo
export const CREDENCIALES_DEMO = [
  { email: 'admin@sysfactu.com', contrasena: '123456', rol: 'administrador' as const, nombre: 'Carlos Mendoza' },
  { email: 'cajero@sysfactu.com', contrasena: '123456', rol: 'cajero' as const, nombre: 'Ana Torres' },
  { email: 'mozo@sysfactu.com', contrasena: '123456', rol: 'mozo' as const, nombre: 'Luis Quispe' },
  { email: 'cocina@sysfactu.com', contrasena: '123456', rol: 'cocinero' as const, nombre: 'Pedro Cáceres' },
  { email: 'almacen@sysfactu.com', contrasena: '123456', rol: 'almacenero' as const, nombre: 'Juana Flores' },
]
