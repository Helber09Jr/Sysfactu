'use client'
import { useState, useCallback } from 'react'
import { Producto, ItemCarrito, Venta, TipoAtencion, MetodoPago } from '@/tipos'

export function useVentas() {
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([])
  const [descuento, setDescuento] = useState(0)
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    if (cantidad <= 0) { quitarDelCarrito(productoId); return }
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
      prev.map(item => item.producto.id === productoId ? { ...item, observacion } : item)
    )
  }, [])

  const aplicarDescuento = useCallback((tipo: 'porcentaje' | 'monto', valor: number) => {
    const subtotal = itemsCarrito.reduce((acc, item) => acc + item.subtotal, 0)
    setDescuento(tipo === 'porcentaje'
      ? parseFloat((subtotal * (valor / 100)).toFixed(2))
      : Math.min(valor, subtotal)
    )
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
    // Simular registro de venta (sin base de datos)
    await new Promise(r => setTimeout(r, 800))
    const ventaSimulada: Venta = {
      id: `vta-demo-${Date.now()}`,
      items: itemsCarrito,
      total: calcularTotal(),
      descuento,
      tipoAtencion: datos.tipoAtencion,
      metodoPago: datos.metodoPago,
      montoRecibido: datos.montoRecibido,
      vuelto: datos.montoRecibido ? parseFloat((datos.montoRecibido - calcularTotal()).toFixed(2)) : undefined,
      cajeroId: datos.cajeroId,
      mesaId: datos.mesaId,
      fecha: new Date(),
      estado: 'completada'
    }
    limpiarCarrito()
    setEstaCargando(false)
    return ventaSimulada
  }, [itemsCarrito, descuento, calcularTotal, limpiarCarrito])

  const anularVenta = useCallback(async (_ventaId: string, _motivo: string) => {
    await new Promise(r => setTimeout(r, 400))
    return true
  }, [])

  return {
    itemsCarrito, descuento, estaCargando, error,
    agregarAlCarrito, quitarDelCarrito, cambiarCantidad,
    agregarObservacion, aplicarDescuento, calcularTotal,
    registrarVenta, anularVenta, limpiarCarrito
  }
}
