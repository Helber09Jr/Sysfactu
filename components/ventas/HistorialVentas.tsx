'use client'
import { useState } from 'react'
import { Tabla, ColumnaTabla } from '@/components/ui/Tabla'
import { Insignia } from '@/components/ui/Insignia'
import { Boton } from '@/components/ui/Boton'
import { formatearMoneda, formatearFecha, formatearHora } from '@/lib/utilidades/formato'
import { ETIQUETAS_METODO_PAGO, ETIQUETAS_TIPO_ATENCION } from '@/lib/utilidades/constantes'
import { VENTAS_DEMO, USUARIOS_DEMO } from '@/lib/demo/datos'
import { XCircle } from 'lucide-react'
import { Venta } from '@/tipos'

export function HistorialVentas() {
  const [ventas, setVentas] = useState<Venta[]>(VENTAS_DEMO)

  const obtenerNombreCajero = (cajeroId: string) =>
    USUARIOS_DEMO.find(u => u.id === cajeroId)?.nombre || '—'

  const anularVenta = (id: string) => {
    if (!confirm('¿Está seguro de anular esta venta?')) return
    setVentas(prev => prev.map(v => v.id === id ? { ...v, estado: 'anulada' as const } : v))
  }

  const columnas: ColumnaTabla<Venta>[] = [
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
      clave: 'cajeroId',
      encabezado: 'Cajero',
      renderizar: (v) => <span>{obtenerNombreCajero(v)}</span>
    },
    {
      clave: 'tipoAtencion',
      encabezado: 'Tipo',
      renderizar: (v) => <span>{ETIQUETAS_TIPO_ATENCION[v] || v}</span>
    },
    {
      clave: 'metodoPago',
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
        <Boton variante="peligro" tamaño="sm" icono={<XCircle className="h-3 w-3" />} onClick={() => anularVenta(fila.id)}>
          Anular
        </Boton>
      ) : null
    }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <Tabla columnas={columnas} datos={ventas} sinDatos="No hay ventas registradas" />
    </div>
  )
}
