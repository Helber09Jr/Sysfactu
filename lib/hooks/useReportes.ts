'use client'
import { useState, useCallback } from 'react'
import { KPIVentas, DatoGraficaVentas, DatoTopProducto, DatoMetodoPago } from '@/tipos'
import { KPI_DEMO, GRAFICA_VENTAS_DEMO, TOP_PRODUCTOS_DEMO, DESGLOSE_PAGOS_DEMO } from '@/lib/demo/datos'

export type PeriodoFiltro = 'hoy' | 'semana' | 'mes' | 'personalizado'

export function useReportes() {
  const [kpis, setKpis] = useState<KPIVentas | null>(null)
  const [graficaVentas, setGraficaVentas] = useState<DatoGraficaVentas[]>([])
  const [topProductos, setTopProductos] = useState<DatoTopProducto[]>([])
  const [desglosePagos, setDesglosePagos] = useState<DatoMetodoPago[]>([])
  const [estaCargando, setEstaCargando] = useState(false)

  const cargarReportes = useCallback(async (periodo: PeriodoFiltro) => {
    setEstaCargando(true)
    await new Promise(r => setTimeout(r, 600))

    // Ajustar datos demo según período
    const multiplicador = periodo === 'hoy' ? 0.15 : periodo === 'semana' ? 0.8 : 1
    const diasGrafica = periodo === 'hoy' ? 1 : periodo === 'semana' ? 7 : GRAFICA_VENTAS_DEMO.length

    setKpis({
      ...KPI_DEMO,
      totalVentas: parseFloat((KPI_DEMO.totalVentas * multiplicador).toFixed(2)),
      numeroTransacciones: Math.round(KPI_DEMO.numeroTransacciones * multiplicador),
      ticketPromedio: KPI_DEMO.ticketPromedio
    })
    setGraficaVentas(GRAFICA_VENTAS_DEMO.slice(-diasGrafica))
    setTopProductos(TOP_PRODUCTOS_DEMO)
    setDesglosePagos(DESGLOSE_PAGOS_DEMO)
    setEstaCargando(false)
  }, [])

  return { kpis, graficaVentas, topProductos, desglosePagos, estaCargando, cargarReportes }
}
