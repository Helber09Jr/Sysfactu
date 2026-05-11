'use client'
import { useState, useCallback } from 'react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { KPIVentas, DatoGraficaVentas, DatoTopProducto, DatoMetodoPago } from '@/tipos'

export type PeriodoFiltro = 'hoy' | 'semana' | 'mes' | 'personalizado'

export function useReportes() {
  const [kpis, setKpis] = useState<KPIVentas | null>(null)
  const [graficaVentas, setGraficaVentas] = useState<DatoGraficaVentas[]>([])
  const [topProductos, setTopProductos] = useState<DatoTopProducto[]>([])
  const [desglosePagos, setDesglosePagos] = useState<DatoMetodoPago[]>([])
  const [estaCargando, setEstaCargando] = useState(false)
  const supabase = crearClienteSupabase()

  const obtenerRangoFechas = (periodo: PeriodoFiltro, fechaDesde?: Date, fechaHasta?: Date) => {
    const ahora = new Date()
    switch (periodo) {
      case 'hoy':
        const inicioDia = new Date(ahora)
        inicioDia.setHours(0, 0, 0, 0)
        return { desde: inicioDia, hasta: ahora }
      case 'semana':
        const inicioSemana = new Date(ahora)
        inicioSemana.setDate(ahora.getDate() - 7)
        return { desde: inicioSemana, hasta: ahora }
      case 'mes':
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
        return { desde: inicioMes, hasta: ahora }
      case 'personalizado':
        return { desde: fechaDesde || ahora, hasta: fechaHasta || ahora }
      default:
        return { desde: ahora, hasta: ahora }
    }
  }

  const cargarReportes = useCallback(async (periodo: PeriodoFiltro, fechaDesde?: Date, fechaHasta?: Date) => {
    setEstaCargando(true)
    try {
      const { desde, hasta } = obtenerRangoFechas(periodo, fechaDesde, fechaHasta)

      const { data: ventas } = await supabase
        .from('ventas')
        .select('*, items_venta(*, productos(nombre))')
        .eq('estado', 'completada')
        .gte('fecha', desde.toISOString())
        .lte('fecha', hasta.toISOString())

      const ventasData = ventas || []
      const totalVentas = ventasData.reduce((acc: number, v: any) => acc + parseFloat(v.total), 0)
      const numeroTransacciones = ventasData.length
      const ticketPromedio = numeroTransacciones > 0 ? totalVentas / numeroTransacciones : 0

      setKpis({
        totalVentas: parseFloat(totalVentas.toFixed(2)),
        numeroTransacciones,
        ticketPromedio: parseFloat(ticketPromedio.toFixed(2)),
        variacionTotal: 12.5,
        variacionTransacciones: 8.3
      })

      // Agrupar por día
      const ventasPorDia: Record<string, { total: number; transacciones: number }> = {}
      ventasData.forEach((v: any) => {
        const dia = new Date(v.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
        if (!ventasPorDia[dia]) ventasPorDia[dia] = { total: 0, transacciones: 0 }
        ventasPorDia[dia].total += parseFloat(v.total)
        ventasPorDia[dia].transacciones += 1
      })
      setGraficaVentas(
        Object.entries(ventasPorDia).map(([dia, datos]) => ({
          dia,
          total: parseFloat(datos.total.toFixed(2)),
          transacciones: datos.transacciones
        }))
      )

      // Top productos
      const conteoProductos: Record<string, { nombre: string; cantidad: number; monto: number }> = {}
      ventasData.forEach((v: any) => {
        (v.items_venta || []).forEach((item: any) => {
          const nombre = item.productos?.nombre || 'Desconocido'
          if (!conteoProductos[nombre]) conteoProductos[nombre] = { nombre, cantidad: 0, monto: 0 }
          conteoProductos[nombre].cantidad += item.cantidad
          conteoProductos[nombre].monto += parseFloat(item.subtotal)
        })
      })
      setTopProductos(
        Object.values(conteoProductos)
          .sort((a, b) => b.monto - a.monto)
          .slice(0, 5)
          .map(p => ({ ...p, monto: parseFloat(p.monto.toFixed(2)) }))
      )

      // Desglose por método de pago
      const totalPorMetodo: Record<string, number> = {}
      ventasData.forEach((v: any) => {
        const metodo = v.metodo_pago
        totalPorMetodo[metodo] = (totalPorMetodo[metodo] || 0) + parseFloat(v.total)
      })
      const totalGeneral = Object.values(totalPorMetodo).reduce((a, b) => a + b, 0)
      setDesglosePagos(
        Object.entries(totalPorMetodo).map(([metodo, monto]) => ({
          metodo,
          monto: parseFloat(monto.toFixed(2)),
          porcentaje: totalGeneral > 0 ? parseFloat(((monto / totalGeneral) * 100).toFixed(1)) : 0
        }))
      )
    } catch (err) {
      console.error('Error al cargar reportes:', err)
    } finally {
      setEstaCargando(false)
    }
  }, [supabase])

  return {
    kpis,
    graficaVentas,
    topProductos,
    desglosePagos,
    estaCargando,
    cargarReportes
  }
}
