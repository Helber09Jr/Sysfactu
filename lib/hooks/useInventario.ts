'use client'
import { useState, useCallback } from 'react'
import { Insumo, MovimientoInventario } from '@/tipos'
import { INSUMOS_DEMO, MOVIMIENTOS_DEMO } from '@/lib/demo/datos'

export function useInventario() {
  const [insumos, setInsumos] = useState<Insumo[]>(INSUMOS_DEMO)
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(MOVIMIENTOS_DEMO)
  const [estaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const insumosConAlerta = insumos.filter(i => i.stockActual <= i.stockMinimo)

  const obtenerInsumos = useCallback(async () => {}, [])

  const registrarMovimiento = useCallback(async (datos: {
    insumoId: string
    tipo: 'entrada' | 'salida'
    cantidad: number
    motivo?: string
    proveedor?: string
    precioUnitario?: number
    usuarioId: string
    numeroGuia?: string
  }): Promise<boolean> => {
    const insumo = insumos.find(i => i.id === datos.insumoId)
    if (!insumo) { setError('Insumo no encontrado'); return false }

    const stockResultante = datos.tipo === 'entrada'
      ? insumo.stockActual + datos.cantidad
      : insumo.stockActual - datos.cantidad

    if (stockResultante < 0) { setError('Stock insuficiente para realizar la salida.'); return false }

    setInsumos(prev => prev.map(i =>
      i.id === datos.insumoId ? { ...i, stockActual: stockResultante } : i
    ))

    const nuevoMovimiento: MovimientoInventario = {
      id: `mov-demo-${Date.now()}`,
      insumoId: datos.insumoId,
      nombreInsumo: insumo.nombre,
      tipo: datos.tipo,
      cantidad: datos.cantidad,
      motivo: datos.motivo,
      proveedor: datos.proveedor,
      precioUnitario: datos.precioUnitario,
      stockResultante,
      usuarioId: datos.usuarioId,
      fecha: new Date(),
      numeroGuia: datos.numeroGuia
    }
    setMovimientos(prev => [nuevoMovimiento, ...prev])
    setError(null)
    return true
  }, [insumos])

  const obtenerKardex = useCallback(async (insumoId: string, fechaDesde?: Date, fechaHasta?: Date) => {
    return movimientos.filter(m => {
      if (m.insumoId !== insumoId) return false
      if (fechaDesde && m.fecha < fechaDesde) return false
      if (fechaHasta && m.fecha > fechaHasta) return false
      return true
    })
  }, [movimientos])

  const crearInsumo = useCallback(async (datos: Omit<Insumo, 'id'>): Promise<boolean> => {
    const nuevoInsumo: Insumo = { ...datos, id: `ins-demo-${Date.now()}` }
    setInsumos(prev => [...prev, nuevoInsumo])
    return true
  }, [])

  return {
    insumos, movimientos, insumosConAlerta, estaCargando, error,
    obtenerInsumos, registrarMovimiento, obtenerKardex, crearInsumo
  }
}
