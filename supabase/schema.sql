-- =========================================
-- SYSFACTU — WANVENDOR SAC
-- Script de creación de tablas en Supabase
-- =========================================

-- Usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  login TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('administrador','cajero','mozo','cocinero','almacenero')),
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo','inactivo')),
  supabase_user_id UUID REFERENCES auth.users(id),
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Empresa
CREATE TABLE IF NOT EXISTS empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruc TEXT NOT NULL UNIQUE,
  razon_social TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  logo_url TEXT,
  certificado_digital TEXT,
  vencimiento_certificado DATE
);

-- Productos del menú
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Mesas
CREATE TABLE IF NOT EXISTS mesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  capacidad INTEGER DEFAULT 4,
  estado TEXT DEFAULT 'libre' CHECK (estado IN ('libre','ocupada','reservada','inactiva')),
  mozo_asignado UUID REFERENCES usuarios(id),
  hora_inicio TIMESTAMPTZ,
  activa BOOLEAN DEFAULT true
);

-- Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  tipo_atencion TEXT NOT NULL CHECK (tipo_atencion IN ('mesa','mostrador','delivery')),
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('efectivo','tarjeta','yape','mixto')),
  monto_recibido DECIMAL(10,2),
  vuelto DECIMAL(10,2),
  cajero_id UUID REFERENCES usuarios(id),
  mesa_id UUID REFERENCES mesas(id),
  estado TEXT DEFAULT 'completada' CHECK (estado IN ('completada','anulada','pendiente')),
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Ítems de venta
CREATE TABLE IF NOT EXISTS items_venta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  observacion TEXT
);

-- Comprobantes electrónicos
CREATE TABLE IF NOT EXISTS comprobantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('boleta','factura')),
  serie TEXT NOT NULL,
  numero INTEGER NOT NULL,
  cliente_ruc TEXT,
  cliente_nombre TEXT NOT NULL,
  cliente_direccion TEXT,
  total DECIMAL(10,2) NOT NULL,
  igv DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'emitido' CHECK (estado IN ('emitido','aceptado','rechazado','pendiente','anulado')),
  cdr_respuesta TEXT,
  codigo_error TEXT,
  venta_id UUID REFERENCES ventas(id),
  fecha_emision TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id UUID REFERENCES mesas(id),
  mozo_id UUID REFERENCES usuarios(id),
  estado TEXT DEFAULT 'solicitado' CHECK (estado IN ('solicitado','en_preparacion','despachado','entregado')),
  hora_creacion TIMESTAMPTZ DEFAULT NOW(),
  observaciones TEXT
);

-- Ítems de pedido
CREATE TABLE IF NOT EXISTS items_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  nombre_producto TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  observacion TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','preparando','listo'))
);

-- Insumos / Inventario
CREATE TABLE IF NOT EXISTS insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT,
  unidad_medida TEXT NOT NULL CHECK (unidad_medida IN ('kg','litros','unidades','cajas','bolsas')),
  stock_actual DECIMAL(10,3) DEFAULT 0,
  stock_minimo DECIMAL(10,3) DEFAULT 0,
  precio_unitario DECIMAL(10,2),
  activo BOOLEAN DEFAULT true
);

-- Movimientos de inventario (kardex)
CREATE TABLE IF NOT EXISTS movimientos_inventario (
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

-- =========================================
-- ÍNDICES para mejorar rendimiento
-- =========================================
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_mesa ON pedidos(mesa_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_insumo ON movimientos_inventario(insumo_id);
CREATE INDEX IF NOT EXISTS idx_comprobantes_venta ON comprobantes(venta_id);

-- =========================================
-- RLS (Row Level Security) básico
-- =========================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprobantes ENABLE ROW LEVEL SECURITY;

-- Política: usuarios autenticados pueden leer todo
CREATE POLICY "Lectura autenticada" ON usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura autenticada" ON productos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura autenticada" ON ventas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura autenticada" ON mesas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura autenticada" ON pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura autenticada" ON insumos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lectura autenticada" ON comprobantes FOR SELECT TO authenticated USING (true);

-- Política: usuarios autenticados pueden insertar/actualizar
CREATE POLICY "Escritura autenticada" ON ventas FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON pedidos FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON mesas FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON insumos FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON movimientos_inventario FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON comprobantes FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON productos FOR ALL TO authenticated USING (true);
CREATE POLICY "Escritura autenticada" ON usuarios FOR ALL TO authenticated USING (true);

-- =========================================
-- DATOS DE PRUEBA
-- =========================================

-- Insertar mesas de ejemplo
INSERT INTO mesas (numero, capacidad, estado) VALUES
  ('01', 4, 'libre'),
  ('02', 4, 'libre'),
  ('03', 6, 'libre'),
  ('04', 2, 'libre'),
  ('05', 4, 'libre'),
  ('06', 6, 'libre'),
  ('07', 4, 'libre'),
  ('08', 2, 'libre'),
  ('09', 8, 'libre'),
  ('10', 4, 'libre')
ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, categoria, precio, descripcion, activo) VALUES
  ('Lomo Saltado', 'Platos', 28.00, 'Clásico lomo saltado con papas y arroz', true),
  ('Ají de Gallina', 'Platos', 22.00, 'Delicioso ají de gallina con arroz', true),
  ('Ceviche Clásico', 'Platos', 32.00, 'Ceviche de pescado fresco con choclo y camote', true),
  ('Pollo a la Brasa (1/4)', 'Platos', 18.00, 'Pollo a la brasa con papas fritas y ensalada', true),
  ('Arroz con Leche', 'Postres', 8.00, 'Arroz con leche cremoso con canela', true),
  ('Mazamorra Morada', 'Postres', 8.00, 'Mazamorra morada tradicional', true),
  ('Inca Kola 1L', 'Bebidas', 6.00, 'Inca Kola en botella de 1 litro', true),
  ('Chicha Morada', 'Bebidas', 5.00, 'Chicha morada natural del día', true),
  ('Agua San Luis', 'Bebidas', 3.00, 'Agua mineral San Luis 625ml', true),
  ('Menú del Día', 'Combos', 15.00, 'Sopa + segundo + refresco', true),
  ('Anticuchos (6 und)', 'Entradas', 16.00, 'Anticuchos de corazón con papas', true),
  ('Tequeños (8 und)', 'Entradas', 12.00, 'Tequeños de queso crujientes', true)
ON CONFLICT DO NOTHING;
