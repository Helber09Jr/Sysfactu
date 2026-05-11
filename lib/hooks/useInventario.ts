'use client'
import { useState, useEffect, useCallback } from 'react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Insumo, MovimientoInventario } from '@/tipos'

export function useInventario() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [insumosConAlerta, setInsumosConAlerta] = useState<Insumo[]>([])
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = crearClienteSupabase()

  const obtenerInsumos = useCallback(async () => {
    setEstaCargando(true)
    try {
      const { data, error } = await supabase
        .from('insumos')
        .select('*')
        .eq('activo', true)
        .order('nombre')
      if (error) throw error
      const insumosData = (data || []).map((i: any) => ({
        id: i.id,
        nombre: i.nombre,
        categoria: i.categoria || '',
        unidadMedida: i.unidad_medida,
        stockActual: parseFloat(i.stock_actual),
        stockMinimo: parseFloat(i.stock_minimo),
        precioUnitario: parseFloat(i.precio_unitario || 0),
        activo: i.activo
      }))
      setInsumos(insumosData)
      setInsumosConAlerta(insumosData.filter((i: Insumo) => i.stockActual <= i.stockMinimo))
    } catch {
      setError('Error al cargar el inventario.')
    } finally {
      setEstaCargando(false)
    }
  }, [supabase])

  useEffect(() => {
    obtenerInsumos()
  }, [obtenerInsumos])

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
    setEstaCargando(true)
    setError(null)
    try {
      const insumo = insumos.find(i => i.id === datos.insumoId)
      if (!insumo) throw new Error('Insumo no encontrado')

      const stockResultante = datos.tipo === 'entrada'
        ? insumo.stockActual + datos.cantidad
        : insumo.stockActual - datos.cantidad

      if (stockResultante < 0) {
        setError('Stock insuficiente para realizar la salida.')
        return false
      }

      const { error: errorMovimiento } = await supabase.from('movimientos_inventario').insert({
        insumo_id: datos.insumoId,
        tipo: datos.tipo,
        cantidad: datos.cantidad,
        motivo: datos.motivo || null,
        proveedor: datos.proveedor || null,
        precio_unitario: datos.precioUnitario || null,
        stock_resultante: stockResultante,
        usuario_id: datos.usuarioId,
        numero_guia: datos.numeroGuia || null
      })
      if (errorMovimiento) throw errorMovimiento

      const { error: errorStock } = await supabase
        .from('insumos')
        .update({ stock_actual: stockResultante })
        .eq('id', datos.insumoId)
      if (errorStock) throw errorStock

      await obtenerInsumos()
      return true
    } catch (err: any) {
      setError(err.message || 'Error al registrar el movimiento.')
      return false
    } finally {
      setEstaCargando(false)
    }
  }, [insumos, supabase, obtenerInsumos])

  const obtenerKardex = useCallback(async (insumoId: string, fechaDesde?: Date, fechaHasta?: Date) => {
    try {
      let consulta = supabase
        .from('movimientos_inventario')
        .select('*')
        .eq('insumo_id', insumoId)
        .order('fecha', { ascending: false })

      if (fechaDesde) {
        consulta = consulta.gte('fecha', fechaDesde.toISOString())
      }
      if (fechaHasta) {
        consulta = consulta.lte('fecha', fechaHasta.toISOString())
      }

      const { data, error } = await consulta
      if (error) throw error
      return (data || []).map((m: any) => ({
        id: m.id,
        insumoId: m.insumo_id,
        tipo: m.tipo,
        cantidad: parseFloat(m.cantidad),
        motivo: m.motivo,
        proveedor: m.proveedor,
        precioUnitario: m.precio_unitario ? parseFloat(m.precio_unitario) : undefined,
        stockResultante: parseFloat(m.stock_resultante),
        usuarioId: m.usuario_id,
        fecha: new Date(m.fecha),
        numeroGuia: m.numero_guia
      }))
    } catch {
      return []
    }
  }, [supabase])

  const crearInsumo = useCallback(async (datos: Omit<Insumo, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('insumos').insert({
        nombre: datos.nombre,
        categoria: datos.categoria,
        unidad_medida: datos.unidadMedida,
        stock_actual: datos.stockActual,
        stock_minimo: datos.stockMinimo,
        precio_unitario: datos.precioUnitario,
        activo: true
      })
      if (error) throw error
      await obtenerInsumos()
      return true
    } catch {
      setError('Error al crear el insumo.')
      return false
    }
  }, [supabase, obtenerInsumos])

  return {
    insumos,
    movimientos,
    insumosConAlerta,
    estaCargando,
    error,
    obtenerInsumos,
    registrarMovimiento,
    obtenerKardex,
    crearInsumo
  }
}
