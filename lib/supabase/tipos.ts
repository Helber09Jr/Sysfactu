// Tipos de la base de datos Supabase

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface BaseDatos {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nombre: string
          login: string
          rol: string
          estado: string
          supabase_user_id: string | null
          creado_en: string
        }
        Insert: {
          id?: string
          nombre: string
          login: string
          rol: string
          estado?: string
          supabase_user_id?: string | null
          creado_en?: string
        }
        Update: {
          id?: string
          nombre?: string
          login?: string
          rol?: string
          estado?: string
          supabase_user_id?: string | null
          creado_en?: string
        }
      }
      productos: {
        Row: {
          id: string
          nombre: string
          categoria: string
          precio: number
          descripcion: string | null
          imagen_url: string | null
          activo: boolean
          creado_en: string
        }
        Insert: {
          id?: string
          nombre: string
          categoria: string
          precio: number
          descripcion?: string | null
          imagen_url?: string | null
          activo?: boolean
          creado_en?: string
        }
        Update: {
          id?: string
          nombre?: string
          categoria?: string
          precio?: number
          descripcion?: string | null
          imagen_url?: string | null
          activo?: boolean
          creado_en?: string
        }
      }
      ventas: {
        Row: {
          id: string
          total: number
          descuento: number
          tipo_atencion: string
          metodo_pago: string
          monto_recibido: number | null
          vuelto: number | null
          cajero_id: string | null
          mesa_id: string | null
          estado: string
          fecha: string
        }
        Insert: {
          id?: string
          total: number
          descuento?: number
          tipo_atencion: string
          metodo_pago: string
          monto_recibido?: number | null
          vuelto?: number | null
          cajero_id?: string | null
          mesa_id?: string | null
          estado?: string
          fecha?: string
        }
        Update: {
          id?: string
          total?: number
          descuento?: number
          tipo_atencion?: string
          metodo_pago?: string
          monto_recibido?: number | null
          vuelto?: number | null
          cajero_id?: string | null
          mesa_id?: string | null
          estado?: string
          fecha?: string
        }
      }
      mesas: {
        Row: {
          id: string
          numero: string
          capacidad: number
          estado: string
          mozo_asignado: string | null
          hora_inicio: string | null
          activa: boolean
        }
        Insert: {
          id?: string
          numero: string
          capacidad?: number
          estado?: string
          mozo_asignado?: string | null
          hora_inicio?: string | null
          activa?: boolean
        }
        Update: {
          id?: string
          numero?: string
          capacidad?: number
          estado?: string
          mozo_asignado?: string | null
          hora_inicio?: string | null
          activa?: boolean
        }
      }
      insumos: {
        Row: {
          id: string
          nombre: string
          categoria: string | null
          unidad_medida: string
          stock_actual: number
          stock_minimo: number
          precio_unitario: number | null
          activo: boolean
        }
        Insert: {
          id?: string
          nombre: string
          categoria?: string | null
          unidad_medida: string
          stock_actual?: number
          stock_minimo?: number
          precio_unitario?: number | null
          activo?: boolean
        }
        Update: {
          id?: string
          nombre?: string
          categoria?: string | null
          unidad_medida?: string
          stock_actual?: number
          stock_minimo?: number
          precio_unitario?: number | null
          activo?: boolean
        }
      }
    }
  }
}
