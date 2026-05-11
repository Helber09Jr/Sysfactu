# SYSFACTU — WANVENDOR SAC

Sistema de gestión de ventas y facturación electrónica para restaurantes y negocios peruanos.

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Despliegue:** Vercel
- **Iconos:** Lucide React
- **Gráficas:** Recharts

## Módulos

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Login | `/login` | Autenticación con roles |
| Dashboard | `/dashboard` | KPIs y resumen del día |
| Ventas (POS) | `/ventas` | Punto de venta, carrito y cobro |
| Facturación | `/facturacion` | Boletas y facturas electrónicas |
| Mesas | `/mesas` | Mapa de mesas y pedidos / Vista KDS |
| Inventario | `/inventario` | Control de stock y kardex |
| Reportes | `/reportes` | Gráficas y estadísticas |
| Configuración | `/configuracion` | Usuarios, carta y empresa |

## Roles de Usuario

| Rol | Acceso |
|-----|--------|
| Administrador | Todos los módulos |
| Cajero | Ventas, Facturación |
| Mozo | Mesas |
| Cocinero | Mesas (Vista KDS) |
| Almacenero | Inventario |

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Cree el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_NAME=SYSFACTU
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Crear tablas en Supabase

Ejecute el script SQL en el panel de Supabase:

```
supabase/schema.sql
```

### 4. Iniciar desarrollo

```bash
npm run dev
```

### 5. Deploy en Vercel

```bash
vercel deploy
```

## Estructura del Proyecto

```
sysfactu/
├── app/                    # Páginas Next.js 14 (App Router)
├── components/             # Componentes React
│   ├── auth/               # Formulario de login
│   ├── ui/                 # Componentes reutilizables
│   ├── layout/             # Layout principal
│   ├── ventas/             # Módulo POS
│   ├── facturacion/        # Módulo facturación
│   ├── mesas/              # Módulo mesas/KDS
│   ├── inventario/         # Módulo inventario
│   ├── reportes/           # Módulo reportes
│   └── configuracion/      # Módulo configuración
├── lib/
│   ├── supabase/           # Cliente Supabase
│   ├── hooks/              # Custom hooks
│   └── utilidades/         # Utilidades (formato, validaciones)
├── tipos/                  # Tipos TypeScript globales
└── supabase/               # Scripts SQL
```

---

© 2026 WANVENDOR SAC
