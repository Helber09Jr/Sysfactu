'use client'
import { useState, useEffect } from 'react'
import { Download, DollarSign, ShoppingCart, TrendingUp, Receipt } from 'lucide-react'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { Boton } from '@/components/ui/Boton'
import { TarjetaKPI } from './TarjetaKPI'
import { GraficaVentas } from './GraficaVentas'
import { TablaTopProductos } from './TablaTopProductos'
import { useReportes, PeriodoFiltro } from '@/lib/hooks/useReportes'
import { Cargando } from '@/components/ui/Cargando'
import { formatearMoneda } from '@/lib/utilidades/formato'

const periodos: { id: PeriodoFiltro; etiqueta: string }[] = [
  { id: 'hoy', etiqueta: 'Hoy' },
  { id: 'semana', etiqueta: 'Esta semana' },
  { id: 'mes', etiqueta: 'Este mes' },
  { id: 'personalizado', etiqueta: 'Personalizado' }
]

export function ModuloReportes() {
  const [periodoActivo, setPeriodoActivo] = useState<PeriodoFiltro>('hoy')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const { kpis, graficaVentas, topProductos, desglosePagos, estaCargando, cargarReportes } = useReportes()

  useEffect(() => {
    cargarReportes(periodoActivo)
  }, [periodoActivo])

  const manejarFiltroPersonalizado = () => {
    if (fechaDesde && fechaHasta) {
      cargarReportes('personalizado', new Date(fechaDesde), new Date(fechaHasta))
    }
  }

  if (estaCargando) return <Cargando mensaje="Generando reportes..." />

  return (
    <div className="space-y-6">
      {/* Filtros de período */}
      <div className="flex flex-wrap gap-2 items-center">
        {periodos.map(p => (
          <button
            key={p.id}
            onClick={() => setPeriodoActivo(p.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${periodoActivo === p.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}
            `}
          >
            {p.etiqueta}
          </button>
        ))}
        {periodoActivo === 'personalizado' && (
          <div className="flex items-center gap-2">
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <span className="text-gray-400">—</span>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <Boton variante="primario" tamaño="sm" onClick={manejarFiltroPersonalizado}>Aplicar</Boton>
          </div>
        )}
        <Boton variante="secundario" icono={<Download className="h-4 w-4" />} tamaño="sm" className="ml-auto"
          onClick={() => alert('Exportando reporte...')}>
          Exportar
        </Boton>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TarjetaKPI
            titulo="Total ventas"
            valor={formatearMoneda(kpis.totalVentas)}
            variacion={kpis.variacionTotal}
            icono={<DollarSign className="h-6 w-6" />}
            colorIcono="bg-green-100 text-green-600"
          />
          <TarjetaKPI
            titulo="Transacciones"
            valor={kpis.numeroTransacciones.toString()}
            variacion={kpis.variacionTransacciones}
            icono={<ShoppingCart className="h-6 w-6" />}
            colorIcono="bg-blue-100 text-blue-600"
          />
          <TarjetaKPI
            titulo="Ticket promedio"
            valor={formatearMoneda(kpis.ticketPromedio)}
            icono={<Receipt className="h-6 w-6" />}
            colorIcono="bg-purple-100 text-purple-600"
          />
          <TarjetaKPI
            titulo="Variación"
            valor={`${kpis.variacionTotal >= 0 ? '+' : ''}${kpis.variacionTotal.toFixed(1)}%`}
            icono={<TrendingUp className="h-6 w-6" />}
            colorIcono="bg-orange-100 text-orange-600"
          />
        </div>
      )}

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Tarjeta titulo="Ventas por día" className="lg:col-span-2">
          <GraficaVentas datos={graficaVentas} />
        </Tarjeta>

        <Tarjeta titulo="Top 5 productos">
          <TablaTopProductos productos={topProductos} />
        </Tarjeta>
      </div>

      {/* Desglose por método de pago */}
      {desglosePagos.length > 0 && (
        <Tarjeta titulo="Desglose por método de pago">
          <div className="space-y-3">
            {desglosePagos.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize">{item.metodo}</span>
                  <div className="flex gap-3">
                    <span className="text-gray-500">{item.porcentaje}%</span>
                    <span className="font-semibold text-gray-800">{formatearMoneda(item.monto)}</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Tarjeta>
      )}
    </div>
  )
}
