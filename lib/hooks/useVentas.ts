'use client'
import { useState, useCallback } from 'react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Producto, ItemCarrito, Venta, TipoAtencion, MetodoPago } from '@/tipos'

export function useVentas() {
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([])
  const [descuento, setDescuento] = useState(0)
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = crearClienteSupabase()

  const agregarAlCarrito = useCallback((producto: Producto) => {
    setItemsCarrito(prev => {
      const existente = prev.find(item => item.producto.id === producto.id)
      if (existente) {
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.producto.precio }
            : item
        )
      }
      return [...prev, { producto, cantidad: 1, subtotal: producto.precio }]
    })
  }, [])

  const quitarDelCarrito = useCallback((productoId: string) => {
    setItemsCarrito(prev => prev.filter(item => item.producto.id !== productoId))
  }, [])

  const cambiarCantidad = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      quitarDelCarrito(productoId)
      return
    }
    setItemsCarrito(prev =>
      prev.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad, subtotal: cantidad * item.producto.precio }
          : item
      )
    )
  }, [quitarDelCarrito])

  const agregarObservacion = useCallback((productoId: string, observacion: string) => {
    setItemsCarrito(prev =>
      prev.map(item =>
        item.producto.id === productoId ? { ...item, observacion } : item
      )
    )
  }, [])

  const aplicarDescuento = useCallback((tipo: 'porcentaje' | 'monto', valor: number) => {
    const subtotal = itemsCarrito.reduce((acc, item) => acc + item.subtotal, 0)
    if (tipo === 'porcentaje') {
      setDescuento(parseFloat((subtotal * (valor / 100)).toFixed(2)))
    } else {
      setDescuento(Math.min(valor, subtotal))
    }
  }, [itemsCarrito])

  const calcularTotal = useCallback(() => {
    const subtotal = itemsCarrito.reduce((acc, item) => acc + item.subtotal, 0)
    return parseFloat((subtotal - descuento).toFixed(2))
  }, [itemsCarrito, descuento])

  const limpiarCarrito = useCallback(() => {
    setItemsCarrito([])
    setDescuento(0)
    setError(null)
  }, [])

  const registrarVenta = useCallback(async (datos: {
    tipoAtencion: TipoAtencion
    metodoPago: MetodoPago
    montoRecibido?: number
    mesaId?: string
    cajeroId: string
  }): Promise<Venta | null> => {
    setEstaCargando(true)
    setError(null)
    try {
      const total = calcularTotal()
      const { data: venta, error: errorVenta } = await supabase
        .from('ventas')
        .insert({
          total,
          descuento,
          tipo_atencion: datos.tipoAtencion,
          metodo_pago: datos.metodoPago,
          monto_recibido: datos.montoRecibido,
          vuelto: datos.montoRecibido ? parseFloat((datos.montoRecibido - total).toFixed(2)) : null,
          cajero_id: datos.cajeroId,
          mesa_id: datos.mesaId || null,
          estado: 'completada'
        })
        .select()
        .single()

      if (errorVenta) throw errorVenta

      // Registrar ítems de venta
      const itemsVenta = itemsCarrito.map(item => ({
        venta_id: venta.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        subtotal: item.subtotal,
        observacion: item.observacion || null
      }))

      const { error: errorItems } = await supabase.from('items_venta').insert(itemsVenta)
      if (errorItems) throw errorItems

      limpiarCarrito()
      return venta as unknown as Venta
    } catch (err) {
      setError('Error al registrar la venta. Intente nuevamente.')
      return null
    } finally {
      setEstaCargando(false)
    }
  }, [itemsCarrito, descuento, calcularTotal, limpiarCarrito, supabase])

  const anularVenta = useCallback(async (ventaId: string, motivo: string) => {
    setEstaCargando(true)
    try {
      const { error } = await supabase
        .from('ventas')
        .update({ estado: 'anulada' })
        .eq('id', ventaId)
      if (error) throw error
      return true
    } catch {
      setError('Error al anular la venta.')
      return false
    } finally {
      setEstaCargando(false)
    }
  }, [supabase])

  return {
    itemsCarrito,
    descuento,
    estaCargando,
    error,
    agregarAlCarrito,
    quitarDelCarrito,
    cambiarCantidad,
    agregarObservacion,
    aplicarDescuento,
    calcularTotal,
    registrarVenta,
    anularVenta,
    limpiarCarrito
  }
}
