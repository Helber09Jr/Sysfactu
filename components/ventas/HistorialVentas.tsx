'use client'
import { useState, useEffect } from 'react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Tabla, ColumnaTabla } from '@/components/ui/Tabla'
import { Insignia } from '@/components/ui/Insignia'
import { Boton } from '@/components/ui/Boton'
import { formatearMoneda, formatearFecha, formatearHora } from '@/lib/utilidades/formato'
import { ETIQUETAS_METODO_PAGO, ETIQUETAS_TIPO_ATENCION } from '@/lib/utilidades/constantes'
import { XCircle } from 'lucide-react'

interface VentaHistorial {
  id: string
  fecha: string
  total: number
  estado: string
  metodo_pago: string
  tipo_atencion: string
  cajero?: string
}

export function HistorialVentas() {
  const [ventas, setVentas] = useState<VentaHistorial[]>([])
  const [estaCargando, setEstaCargando] = useState(true)
  const supabase = crearClienteSupabase()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('ventas')
        .select('*, usuarios:cajero_id(nombre)')
        .order('fecha', { ascending: false })
        .limit(100)
      setVentas((data || []).map((v: any) => ({
        id: v.id,
        fecha: v.fecha,
        total: parseFloat(v.total),
        estado: v.estado,
        metodo_pago: v.metodo_pago,
        tipo_atencion: v.tipo_atencion,
        cajero: v.usuarios?.nombre
      })))
      setEstaCargando(false)
    }
    cargar()
  }, [supabase])

  const anularVenta = async (id: string) => {
    if (!confirm('¿Está seguro de anular esta venta?')) return
    await supabase.from('ventas').update({ estado: 'anulada' }).eq('id', id)
    setVentas(prev => prev.map(v => v.id === id ? { ...v, estado: 'anulada' } : v))
  }

  const columnas: ColumnaTabla<VentaHistorial>[] = [
    {
      clave: 'fecha',
      encabezado: 'Fecha',
      renderizar: (v) => (
        <div>
          <p className="text-sm">{formatearFecha(v)}</p>
          <p className="text-xs text-gray-400">{formatearHora(v)}</p>
        </div>
      )
    },
    {
      clave: 'cajero',
      encabezado: 'Cajero',
      renderizar: (v) => <span>{v || '—'}</span>
    },
    {
      clave: 'tipo_atencion',
      encabezado: 'Tipo',
      renderizar: (v) => <span className="capitalize">{ETIQUETAS_TIPO_ATENCION[v] || v}</span>
    },
    {
      clave: 'metodo_pago',
      encabezado: 'Pago',
      renderizar: (v) => <span>{ETIQUETAS_METODO_PAGO[v] || v}</span>
    },
    {
      clave: 'total',
      encabezado: 'Total',
      renderizar: (v) => <span className="font-semibold">{formatearMoneda(v)}</span>
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      renderizar: (v) => (
        <Insignia variante={v === 'completada' ? 'exito' : v === 'anulada' ? 'error' : 'advertencia'}>
          {v === 'completada' ? 'Completada' : v === 'anulada' ? 'Anulada' : 'Pendiente'}
        </Insignia>
      )
    },
    {
      clave: 'id',
      encabezado: 'Acciones',
      renderizar: (_, fila) => fila.estado !== 'anulada' ? (
        <Boton
          variante="peligro"
          tamaño="sm"
          icono={<XCircle className="h-3 w-3" />}
          onClick={() => anularVenta(fila.id)}
        >
          Anular
        </Boton>
      ) : null
    }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <Tabla
        columnas={columnas}
        datos={ventas}
        cargando={estaCargando}
        sinDatos="No hay ventas registradas"
      />
    </div>
  )
}
