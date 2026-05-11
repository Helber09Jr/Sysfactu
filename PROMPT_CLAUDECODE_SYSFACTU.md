# PROMPT PARA CLAUDE CODE — SISTEMA SYSFACTU (WANVENDOR SAC)

## CONTEXTO DEL PROYECTO

Construye el sistema **SYSFACTU** de WANVENDOR SAC: una plataforma web de gestión de ventas y facturación electrónica para restaurantes y negocios peruanos. El sistema tiene 6 módulos principales. El código debe estar completamente en español (variables, funciones, comentarios, componentes).

---

## STACK TECNOLÓGICO

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Despliegue:** Vercel
- **Iconos:** Lucide React

> Todas las variables, funciones, componentes y comentarios deben estar **en español**.

---

## ESTRUCTURA DE CARPETAS

```
sysfactu/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    ← Redirige al login
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx                ← Panel principal con KPIs
│   ├── ventas/
│   │   ├── page.tsx                ← POS / Punto de venta
│   │   └── historial/
│   │       └── page.tsx
│   ├── facturacion/
│   │   ├── page.tsx                ← Emitir comprobantes
│   │   └── notas/
│   │       └── page.tsx
│   ├── mesas/
│   │   └── page.tsx                ← Gestión de mesas y pedidos
│   ├── inventario/
│   │   ├── page.tsx                ← Registrar ingresos/salidas
│   │   ├── kardex/
│   │   │   └── page.tsx
│   │   └── stock/
│   │       └── page.tsx
│   ├── reportes/
│   │   ├── page.tsx                ← Reporte de ventas
│   │   └── mozos/
│   │       └── page.tsx
│   └── configuracion/
│       ├── usuarios/
│       │   └── page.tsx
│       ├── carta/
│       │   └── page.tsx
│       └── empresa/
│           └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Boton.tsx
│   │   ├── Entrada.tsx
│   │   ├── Tarjeta.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabla.tsx
│   │   ├── Insignia.tsx
│   │   └── Cargando.tsx
│   ├── layout/
│   │   ├── BarraSuperior.tsx
│   │   ├── BarraLateral.tsx
│   │   └── PlantillaPrincipal.tsx
│   ├── ventas/
│   │   ├── CatalogoProductos.tsx
│   │   ├── CarritoVenta.tsx
│   │   ├── ModalPago.tsx
│   │   └── TarjetaProducto.tsx
│   ├── mesas/
│   │   ├── MapaMesas.tsx
│   │   ├── TarjetaMesa.tsx
│   │   └── ModalPedido.tsx
│   ├── inventario/
│   │   ├── FormularioIngreso.tsx
│   │   ├── TablaKardex.tsx
│   │   └── AlertaStock.tsx
│   ├── reportes/
│   │   ├── GraficaVentas.tsx
│   │   ├── TarjetaKPI.tsx
│   │   └── TablaTopProductos.tsx
│   └── configuracion/
│       ├── FormularioUsuario.tsx
│       └── FormularioEmpresa.tsx
├── lib/
│   ├── supabase/
│   │   ├── cliente.ts
│   │   └── tipos.ts
│   ├── utilidades/
│   │   ├── formato.ts              ← formatearMoneda, formatearFecha
│   │   ├── validaciones.ts
│   │   └── constantes.ts
│   └── hooks/
│       ├── useVentas.ts
│       ├── useMesas.ts
│       ├── useInventario.ts
│       ├── useReportes.ts
│       └── useUsuarios.ts
├── tipos/
│   └── index.ts                    ← Todos los tipos TypeScript en español
├── .env.local
├── vercel.json
└── next.config.js
```

---

## MÓDULO 1 — LOGIN (`/login`)

### Descripción
Pantalla de inicio de sesión. El sistema valida usuario y contraseña contra Supabase Auth. Según el rol del usuario, redirige al módulo correspondiente.

### Funcionalidades
- Campo de usuario (email) y contraseña con toggle mostrar/ocultar
- Botón "Iniciar sesión"
- Validación: si los datos son incorrectos → mensaje de error en rojo
- Si los datos son correctos → redirige según rol:
  - Administrador → `/dashboard`
  - Cajero → `/ventas`
  - Mozo → `/mesas`
  - Cocinero → `/mesas` (solo vista cocina)
  - Almacenero → `/inventario`

### Componentes a crear
```tsx
// components/auth/FormularioLogin.tsx
// - Estado: usuario, contrasena, cargando, error
// - Función: manejarLogin()
// - Usa: Entrada, Boton, Cargando
```

### Tipos
```ts
interface DatosLogin {
  email: string
  contrasena: string
}

interface RespuestaLogin {
  exito: boolean
  rol: RolUsuario
  mensaje?: string
}

type RolUsuario = 'administrador' | 'cajero' | 'mozo' | 'cocinero' | 'almacenero'
```

---

## MÓDULO 2 — PUNTO DE VENTA (`/ventas`)

### Descripción
Pantalla principal del cajero. Permite seleccionar productos, agregar al carrito, aplicar descuentos y proceder al cobro.

### Funcionalidades
- **Panel izquierdo:** Catálogo de productos con filtro por categoría y búsqueda en tiempo real
- **Panel derecho:** Carrito de venta con ítems, cantidades ajustables y total
- Selector de tipo de atención: Mesa / Mostrador / Delivery
- Botón "Aplicar descuento" → modal con descuento % o monto fijo
- Botón "Cobrar" → abre ModalPago con opciones: Efectivo, Tarjeta, Yape, Mixto
- Si efectivo: calcula vuelto automáticamente
- Al confirmar pago → descuenta inventario → va a `/facturacion`
- Botón "Anular venta" disponible en historial

### Componentes a crear
```tsx
// components/ventas/CatalogoProductos.tsx
// Props: categoriaActiva, busqueda, onAgregarProducto
// - Muestra productos en grilla 2 columnas
// - Filtra por categoría y texto de búsqueda
// - Al hacer clic en producto: onAgregarProducto(producto)

// components/ventas/CarritoVenta.tsx
// Props: items, onCambiarCantidad, onEliminar, onLimpiar, onCobrar
// - Lista de ítems con botones + y -
// - Muestra subtotal por ítem y total general
// - Selector tipo de atención
// - Botón Cobrar (deshabilitado si carrito vacío)

// components/ventas/ModalPago.tsx
// Props: total, onConfirmar, onCerrar
// - Tabs: Efectivo | Tarjeta | Yape | Mixto
// - Efectivo: input monto recibido → calcula vuelto
// - Confirmar: valida stock → registra venta → emite comprobante

// components/ventas/TarjetaProducto.tsx
// Props: producto, onAgregar
// - Muestra nombre, precio, categoría
// - Click → onAgregar(producto)
```

### Tipos
```ts
interface Producto {
  id: string
  nombre: string
  precio: number
  categoria: string
  imagen?: string
  stockDisponible: number
  activo: boolean
}

interface ItemCarrito {
  producto: Producto
  cantidad: number
  subtotal: number
  observacion?: string
}

interface Venta {
  id: string
  items: ItemCarrito[]
  total: number
  descuento: number
  tipoAtencion: 'mesa' | 'mostrador' | 'delivery'
  metodoPago: 'efectivo' | 'tarjeta' | 'yape' | 'mixto'
  montoRecibido?: number
  vuelto?: number
  cajeroId: string
  mesaId?: string
  fecha: Date
  estado: 'completada' | 'anulada' | 'pendiente'
}
```

### Hook
```ts
// lib/hooks/useVentas.ts
export function useVentas() {
  // agregarAlCarrito(producto)
  // quitarDelCarrito(productoId)
  // cambiarCantidad(productoId, cantidad)
  // aplicarDescuento(tipo, valor)
  // calcularTotal()
  // registrarVenta(datosVenta)
  // anularVenta(ventaId, motivo)
  // limpiarCarrito()
}
```

---

## MÓDULO 3 — FACTURACIÓN ELECTRÓNICA (`/facturacion`)

### Descripción
Emisión de boletas y facturas electrónicas. Integración con API de SUNAT (simulada para el prototipo, real en producción).

### Funcionalidades
- Selector: Boleta de venta / Factura electrónica
- Si Factura: campo RUC con botón buscar → autocompleta razón social (API SUNAT)
- Si Boleta: campo DNI opcional
- Muestra detalle de la venta (productos, montos, IGV 18%)
- Botón "Emitir y enviar a SUNAT" → genera XML → envía → muestra CDR
- Si SUNAT acepta → botones: Imprimir / WhatsApp / Correo / Descargar PDF / Descargar XML
- Si SUNAT rechaza → muestra código de error + botón "Corregir y reenviar"
- Generación de Notas de Crédito/Débito con lista de motivos
- Historial de comprobantes emitidos con filtros

### Componentes a crear
```tsx
// components/facturacion/FormularioComprobante.tsx
// - tipoComprobante: 'boleta' | 'factura'
// - Muestra campo RUC o DNI según tipo
// - función buscarRuc(ruc) → llama API SUNAT
// - función buscarDni(dni) → llama API RENIEC

// components/facturacion/DetalleComprobante.tsx
// - Muestra tabla de productos, IGV, total
// - Número de serie generado

// components/facturacion/ResultadoSunat.tsx
// - Estado: aceptado | rechazado | pendiente
// - Si aceptado: botones de acción
// - Si rechazado: código de error y botón reenviar
```

### Tipos
```ts
interface Comprobante {
  id: string
  tipo: 'boleta' | 'factura'
  serie: string
  numero: number
  clienteRuc?: string
  clienteNombre: string
  clienteDireccion?: string
  items: ItemComprobante[]
  subtotal: number
  igv: number
  total: number
  estado: 'emitido' | 'aceptado' | 'rechazado' | 'pendiente' | 'anulado'
  cdrRespuesta?: string
  codigoError?: string
  fechaEmision: Date
  ventaId: string
}

interface ItemComprobante {
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface RespuestaSunat {
  aceptado: boolean
  cdr?: string
  codigoError?: string
  descripcionError?: string
}
```

---

## MÓDULO 4 — GESTIÓN DE MESAS Y PEDIDOS (`/mesas`)

### Descripción
Mapa visual del salón con estado de mesas en tiempo real. Mozos registran pedidos que se envían a cocina.

### Funcionalidades
- Mapa del salón con mesas coloreadas: Verde=libre, Rojo=ocupada, Amarillo=reservada, Gris=inactiva
- Al hacer clic en mesa libre: confirmación → asignar mozo → cambia a rojo
- Al hacer clic en mesa ocupada: panel lateral con detalle (mozo, hora inicio, tiempo transcurrido, ítems del pedido)
- Botón "+ Nuevo Pedido" → catálogo de productos → agregar con observaciones
- Botón "Confirmar y enviar a cocina" → cambia estado pedido a "Solicitado"
- Vista cocina (KDS): lista de pedidos por estado
  - [Iniciar preparación] → estado "En preparación"
  - [Despachar] → estado "Despachado" → notificación al mozo
- Botón "Solicitar cuenta" → mesa pasa a "En facturación" → notifica al cajero

### Componentes a crear
```tsx
// components/mesas/MapaMesas.tsx
// Props: mesas, onSeleccionarMesa
// - Grilla de mesas con colores por estado
// - Leyenda: Libre / Ocupada / Reservada / Inactiva

// components/mesas/TarjetaMesa.tsx
// Props: mesa, onClick
// - Muestra número, estado, mozo asignado, tiempo
// - Color de fondo según estado

// components/mesas/ModalPedido.tsx
// Props: mesa, onConfirmar, onCerrar
// - Lista de ítems del pedido actual
// - Botones: agregar ítem, eliminar ítem, observación
// - Botón: "Enviar a cocina"

// components/mesas/VistaKDS.tsx
// - Vista exclusiva para cocinero
// - Columnas: Solicitado | En preparación | Despachado
// - Cards con número de mesa, items y tiempo
```

### Tipos
```ts
interface Mesa {
  id: string
  numero: string
  capacidad: number
  estado: 'libre' | 'ocupada' | 'reservada' | 'inactiva'
  mozoAsignado?: string
  horaInicio?: Date
  pedidoActualId?: string
}

interface Pedido {
  id: string
  mesaId: string
  mozoId: string
  items: ItemPedido[]
  estado: 'solicitado' | 'en_preparacion' | 'despachado' | 'entregado'
  horaCreacion: Date
  observaciones?: string
}

interface ItemPedido {
  productoId: string
  nombreProducto: string
  cantidad: number
  observacion?: string
  estado: 'pendiente' | 'preparando' | 'listo'
}
```

---

## MÓDULO 5 — INVENTARIO (`/inventario`)

### Descripción
Control de stock de insumos y productos. Registro de ingresos y salidas con kardex automático.

### Funcionalidades
- **Registrar ingreso:** formulario con producto, cantidad, unidad, proveedor, fecha, precio unitario
  - Campo producto: autocompletado con lista de productos
  - Si producto no existe: botón "Crear nuevo producto"
  - Validación: cantidad y precio > 0, campos obligatorios (*)
  - Al guardar: actualiza stock + registra en kardex
- **Registrar salida:** similar al ingreso con campo "motivo" (venta/merma/uso interno)
- **Ver kardex:** tabla por producto con filtro de fechas. Columnas: Fecha, Tipo, Cantidad, Proveedor/Motivo, Stock resultante
- **Stock mínimo:** configurar mínimo por producto → alerta automática cuando stock ≤ mínimo
- Panel de alertas: lista de productos bajo stock mínimo

### Componentes a crear
```tsx
// components/inventario/FormularioIngreso.tsx
// Props: tipo: 'ingreso' | 'salida', onGuardar
// - Buscador de producto con autocompletado
// - Campos del formulario con validación en tiempo real
// - Muestra stock actual al seleccionar producto
// - Al guardar: llama useInventario.registrarMovimiento()

// components/inventario/TablaKardex.tsx
// Props: productoId, filtroFechas
// - Tabla paginada de movimientos
// - Exportar a Excel/PDF

// components/inventario/AlertaStock.tsx
// - Lista de productos con stock ≤ mínimo configurado
// - Badge con cantidad en rojo
```

### Tipos
```ts
interface Insumo {
  id: string
  nombre: string
  categoria: string
  unidadMedida: 'kg' | 'litros' | 'unidades' | 'cajas' | 'bolsas'
  stockActual: number
  stockMinimo: number
  precioUnitario: number
  activo: boolean
}

interface MovimientoInventario {
  id: string
  insumoId: string
  tipo: 'entrada' | 'salida'
  cantidad: number
  motivo?: string
  proveedor?: string
  precioUnitario?: number
  stockResultante: number
  usuarioId: string
  fecha: Date
  numeroGuia?: string
}
```

---

## MÓDULO 6 — REPORTES (`/reportes`)

### Descripción
Generación de reportes de ventas con gráficas e indicadores para la toma de decisiones.

### Funcionalidades
- **Filtros:** Hoy / Esta semana / Este mes / Rango personalizado
- **KPIs:** Total ventas (S/.), Número de transacciones, Ticket promedio, Variación vs período anterior (▲▼)
- **Gráfica de barras:** ventas por día del período seleccionado (usando Recharts)
- **Top 5 productos:** tabla con nombre, cantidad vendida y monto
- **Desglose por método de pago:** barra proporcional Efectivo / Tarjeta / Yape
- **Reporte por mozo:** selector de mozo + período → mesas atendidas, total pedidos, monto generado
- **Dashboard en tiempo real:** mesas activas, ventas del día, transacciones, producto más vendido
- **Exportar:** Excel (.xlsx) y PDF con encabezado del negocio

### Componentes a crear
```tsx
// components/reportes/TarjetaKPI.tsx
// Props: titulo, valor, variacion, icono
// - Muestra el indicador con variación en verde/rojo

// components/reportes/GraficaVentas.tsx
// Props: datos: { dia: string, total: number }[]
// - Gráfica de barras con Recharts
// - Al hacer clic en barra: muestra detalle del día

// components/reportes/TablaTopProductos.tsx
// Props: productos: { nombre, cantidad, monto }[]
// - Tabla con barra de progreso visual

// components/reportes/Dashboard.tsx
// - Se actualiza cada 30 segundos (setInterval + useEffect)
// - Mapa de mesas simplificado, KPIs del día
```

---

## MÓDULO 7 — CONFIGURACIÓN (`/configuracion`)

### Descripción
Gestión de usuarios, carta/menú y datos de la empresa.

### Subcategorías

### 7.1 Usuarios y Roles (`/configuracion/usuarios`)
- Tabla de usuarios con columnas: Nombre, Login, Rol, Estado, Acciones
- Botón "+ Nuevo usuario" → formulario con:
  - Nombre completo, login, contraseña, confirmar contraseña, rol
  - Validación login en tiempo real (✓ disponible / ✗ ya existe)
  - Indicador fortaleza de contraseña: Débil / Media / Fuerte
  - Selector de rol con descripción de permisos
  - Toggle para mostrar/ocultar contraseña
- Botón [Editar] → carga formulario pre-completado
- Botón [Desactivar] → confirmación → cambia estado a Inactivo
  - Validación: no puede desactivar al único administrador

### 7.2 Carta / Menú (`/configuracion/carta`)
- Lista de productos con [+ Nuevo producto] [Editar] [Eliminar]
- Formulario: nombre, categoría, precio, descripción, imagen, activo
- Al guardar → disponible en módulo POS inmediatamente

### 7.3 Datos de la Empresa (`/configuracion/empresa`)
- Formulario: RUC, razón social, dirección, teléfono, logo, certificado digital
- Al guardar: valida RUC con API SUNAT
- Los datos se usan en todos los comprobantes

### Tipos
```ts
interface Usuario {
  id: string
  nombre: string
  login: string
  rol: RolUsuario
  estado: 'activo' | 'inactivo'
  fotoPerfil?: string
  fechaCreacion: Date
}

interface Empresa {
  id: string
  ruc: string
  razonSocial: string
  direccion: string
  telefono: string
  logo?: string
  certificadoDigital?: string
  vencimientoCertificado?: Date
}
```

---

## BASE DE DATOS — SUPABASE

### Tablas a crear

```sql
-- Usuarios del sistema
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  login TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('administrador','cajero','mozo','cocinero','almacenero')),
  estado TEXT DEFAULT 'activo',
  supabase_user_id UUID REFERENCES auth.users(id),
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Productos del menú
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Ventas
CREATE TABLE ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  tipo_atencion TEXT NOT NULL,
  metodo_pago TEXT NOT NULL,
  monto_recibido DECIMAL(10,2),
  vuelto DECIMAL(10,2),
  cajero_id UUID REFERENCES usuarios(id),
  mesa_id UUID REFERENCES mesas(id),
  estado TEXT DEFAULT 'completada',
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Ítems de venta
CREATE TABLE items_venta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id),
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  observacion TEXT
);

-- Comprobantes electrónicos
CREATE TABLE comprobantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('boleta','factura')),
  serie TEXT NOT NULL,
  numero INTEGER NOT NULL,
  cliente_ruc TEXT,
  cliente_nombre TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  igv DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'emitido',
  cdr_respuesta TEXT,
  codigo_error TEXT,
  venta_id UUID REFERENCES ventas(id),
  fecha_emision TIMESTAMPTZ DEFAULT NOW()
);

-- Mesas
CREATE TABLE mesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  capacidad INTEGER DEFAULT 4,
  estado TEXT DEFAULT 'libre',
  mozo_asignado UUID REFERENCES usuarios(id),
  hora_inicio TIMESTAMPTZ,
  activa BOOLEAN DEFAULT true
);

-- Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id UUID REFERENCES mesas(id),
  mozo_id UUID REFERENCES usuarios(id),
  estado TEXT DEFAULT 'solicitado',
  hora_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Ítems de pedido
CREATE TABLE items_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id),
  producto_id UUID REFERENCES productos(id),
  nombre_producto TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  observacion TEXT,
  estado TEXT DEFAULT 'pendiente'
);

-- Insumos/Inventario
CREATE TABLE insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT,
  unidad_medida TEXT NOT NULL,
  stock_actual DECIMAL(10,3) DEFAULT 0,
  stock_minimo DECIMAL(10,3) DEFAULT 0,
  precio_unitario DECIMAL(10,2),
  activo BOOLEAN DEFAULT true
);

-- Movimientos de inventario (kardex)
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insumo_id UUID REFERENCES insumos(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada','salida')),
  cantidad DECIMAL(10,3) NOT NULL,
  motivo TEXT,
  proveedor TEXT,
  precio_unitario DECIMAL(10,2),
  stock_resultante DECIMAL(10,3) NOT NULL,
  usuario_id UUID REFERENCES usuarios(id),
  numero_guia TEXT,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Empresa
CREATE TABLE empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruc TEXT NOT NULL,
  razon_social TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  logo_url TEXT,
  certificado_digital TEXT,
  vencimiento_certificado DATE
);
```

---

## COMPONENTES UI REUTILIZABLES

```tsx
// components/ui/Boton.tsx
// Props: variante: 'primario'|'secundario'|'peligro'|'exito'
//        tamaño: 'sm'|'md'|'lg'
//        cargando: boolean, deshabilitado: boolean, icono
// Ejemplo: <Boton variante="primario" icono={<Save/>}>Guardar</Boton>

// components/ui/Entrada.tsx
// Props: etiqueta, obligatorio, error, ayuda, tipo, icono
// Ejemplo: <Entrada etiqueta="RUC" obligatorio error="RUC inválido"/>

// components/ui/Modal.tsx
// Props: abierto, titulo, onCerrar, tamaño: 'sm'|'md'|'lg'
// Ejemplo: <Modal abierto={mostrar} titulo="Nuevo usuario" onCerrar={cerrar}/>

// components/ui/Tabla.tsx
// Props: columnas, datos, cargando, sinDatos
// Renderiza tabla responsive con estados de carga y vacío

// components/ui/Insignia.tsx
// Props: variante: 'exito'|'error'|'advertencia'|'info'|'neutral'
// Ejemplo: <Insignia variante="exito">Activo</Insignia>

// components/ui/Cargando.tsx
// Spinner centrado para estados de carga
```

---

## UTILIDADES (`/lib/utilidades`)

```ts
// formato.ts
export function formatearMoneda(monto: number): string
// → "S/.75.00"

export function formatearFecha(fecha: Date, formato?: string): string
// → "10/05/2026" o "10 may 2026"

export function formatearHora(fecha: Date): string
// → "14:32"

export function calcularIGV(subtotal: number): number
// → subtotal * 0.18

export function calcularVuelto(total: number, montoRecibido: number): number
// → montoRecibido - total

// validaciones.ts
export function validarRUC(ruc: string): boolean
// → valida formato 11 dígitos peruano

export function validarDNI(dni: string): boolean
// → valida formato 8 dígitos

export function validarContrasena(contrasena: string): 'debil' | 'media' | 'fuerte'
// → evalúa longitud y caracteres

// constantes.ts
export const ROLES_USUARIO = ['administrador','cajero','mozo','cocinero','almacenero']
export const ESTADOS_MESA = ['libre','ocupada','reservada','inactiva']
export const METODOS_PAGO = ['efectivo','tarjeta','yape','mixto']
export const CATEGORIAS_PRODUCTO = ['Platos','Bebidas','Postres','Combos','Entradas']
```

---

## LAYOUT PRINCIPAL

```tsx
// components/layout/PlantillaPrincipal.tsx
// Estructura: BarraSuperior + BarraLateral + Contenido principal

// BarraSuperior: Logo "SYSFACTU", nombre usuario, rol, botón cerrar sesión
// BarraLateral: Links de navegación según rol del usuario
//   Administrador: ve todos los módulos
//   Cajero: ve Ventas, Facturación
//   Mozo: ve Mesas
//   Cocinero: ve Mesas (solo vista KDS)
//   Almacenero: ve Inventario

// Navegación por rol:
const NAVEGACION_POR_ROL = {
  administrador: ['dashboard','ventas','facturacion','mesas','inventario','reportes','configuracion'],
  cajero: ['ventas','facturacion'],
  mozo: ['mesas'],
  cocinero: ['mesas'],
  almacenero: ['inventario']
}
```

---

## CONFIGURACIÓN VERCEL

### `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_NAME=SYSFACTU
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const configuracion = {
  images: {
    domains: ['tu-proyecto.supabase.co']
  },
  experimental: {
    serverActions: true
  }
}
module.exports = configuracion
```

---

## CONVENCIONES DE CÓDIGO

### Nombres en español
```ts
// Variables
const totalVenta = 0
const itemsCarrito = []
const productoSeleccionado = null
const cargandoDatos = false

// Funciones
function calcularTotal() {}
function agregarAlCarrito(producto) {}
function registrarVenta(datos) {}
function obtenerProductos() {}
function formatearMoneda(monto) {}

// Componentes
function TarjetaProducto({ producto, onAgregar }) {}
function FormularioUsuario({ usuarioInicial, onGuardar }) {}
function ModalConfirmacion({ abierto, titulo, onConfirmar, onCancelar }) {}

// Hooks
function useVentas() {}
function useMesas() {}
function useInventario() {}

// Estados
const [estaAbierto, setEstaAbierto] = useState(false)
const [estaCargando, setEstaCargando] = useState(false)
const [hayError, setHayError] = useState(false)
const [mensajeError, setMensajeError] = useState('')

// Interfaces
interface DatosVenta {}
interface ConfiguracionEmpresa {}
interface MovimientoInventario {}
```

### Comentarios en español
```ts
// Calcular el total del carrito incluyendo descuentos
function calcularTotal(items: ItemCarrito[], descuento: number): number {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0)
  return subtotal - descuento
}
```

---

## ORDEN DE IMPLEMENTACIÓN SUGERIDO

1. **Configuración inicial:** Next.js + Supabase + Tailwind
2. **Base de datos:** Crear todas las tablas en Supabase
3. **Tipos:** `/tipos/index.ts` con todas las interfaces
4. **Utilidades:** `/lib/utilidades/` (formato, validaciones, constantes)
5. **Componentes UI:** Boton, Entrada, Modal, Tabla, Insignia, Cargando
6. **Layout:** BarraSuperior, BarraLateral, PlantillaPrincipal
7. **Login:** Formulario + autenticación Supabase
8. **Módulo Ventas (POS):** CatalogoProductos + CarritoVenta + ModalPago
9. **Módulo Facturación:** FormularioComprobante + DetalleComprobante + ResultadoSunat
10. **Módulo Mesas:** MapaMesas + TarjetaMesa + ModalPedido + VistaKDS
11. **Módulo Inventario:** FormularioIngreso + TablaKardex + AlertaStock
12. **Módulo Reportes:** TarjetaKPI + GraficaVentas + TablaTopProductos + Dashboard
13. **Módulo Configuración:** FormularioUsuario + Carta + Empresa
14. **Pruebas y ajustes**
15. **Deploy en Vercel**

---

## NOTAS IMPORTANTES PARA CLAUDE CODE

- Todo el código debe estar en **español** (variables, funciones, comentarios, tipos)
- Usar **Tailwind CSS** para todos los estilos, sin CSS personalizado
- Cada módulo debe ser **independiente** y funcionar por separado
- Incluir **estados de carga** (skeleton/spinner) en todas las consultas
- Incluir **manejo de errores** con mensajes claros al usuario en español
- Los formularios deben tener **validación en tiempo real**
- Usar **Server Components** de Next.js donde sea posible
- Las consultas a Supabase deben estar en los **hooks** (`/lib/hooks/`)
- El sistema debe ser **responsive** (funciona en tablet y desktop)
- Proteger las rutas según el **rol del usuario** con middleware de Next.js

---

## COMANDO DE INICIO

```bash
# Crear el proyecto
npx create-next-app@latest sysfactu --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# Instalar dependencias
cd sysfactu
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs lucide-react recharts xlsx jspdf

# Iniciar desarrollo
npm run dev

# Deploy en Vercel
vercel deploy
```
