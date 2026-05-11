'use client'
import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { Tabla, ColumnaTabla } from '@/components/ui/Tabla'
import { Insignia } from '@/components/ui/Insignia'
import { Boton } from '@/components/ui/Boton'
import { MovimientoInventario } from '@/tipos'
import { formatearFecha, formatearMoneda } from '@/lib/utilidades/formato'
import { useInventario } from '@/lib/hooks/useInventario'

interface PropiedadesTablaKardex {
  insumoId?: string
}

export function TablaKardex({ insumoId }: PropiedadesTablaKardex) {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [cargando, setCargando] = useState(false)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const { obtenerKardex } = useInventario()

  useEffect(() => {
    if (insumoId) cargarMovimientos()
  }, [insumoId])

  const cargarMovimientos = async () => {
    if (!insumoId) return
    setCargando(true)
    const datos = await obtenerKardex(
      insumoId,
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined
    )
    setMovimientos(datos)
    setCargando(false)
  }

  const columnas: ColumnaTabla<MovimientoInventario>[] = [
    {
      clave: 'fecha',
      encabezado: 'Fecha',
      renderizar: (v) => formatearFecha(v)
    },
    {
      clave: 'tipo',
      encabezado: 'Tipo',
      renderizar: (v) => (
        <Insignia variante={v === 'entrada' ? 'exito' : 'error'}>
          {v === 'entrada' ? 'Entrada' : 'Salida'}
        </Insignia>
      )
    },
    {
      clave: 'cantidad',
      encabezado: 'Cantidad',
      renderizar: (v, fila) => (
        <span className={fila.tipo === 'entrada' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {fila.tipo === 'entrada' ? '+' : '-'}{v}
        </span>
      )
    },
    {
      clave: 'proveedor',
      encabezado: 'Proveedor / Motivo',
      renderizar: (v, fila) => v || fila.motivo || '—'
    },
    {
      clave: 'stockResultante',
      encabezado: 'Stock resultante',
      renderizar: (v) => <span className="font-semibold">{v}</span>
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <Boton variante="secundario" onClick={cargarMovimientos}>Filtrar</Boton>
        <Boton variante="secundario" icono={<Download className="h-4 w-4" />} onClick={() => alert('Exportando...')}>
          Exportar
        </Boton>
      </div>
      <Tabla columnas={columnas} datos={movimientos} cargando={cargando} sinDatos="No hay movimientos en el kardex" />
    </div>
  )
}
