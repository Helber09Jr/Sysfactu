'use client'
import { useState, useCallback } from 'react'
import { Mesa, Pedido, EstadoMesa } from '@/tipos'
import { MESAS_DEMO, PEDIDOS_DEMO } from '@/lib/demo/datos'

export function useMesas() {
  const [mesas, setMesas] = useState<Mesa[]>(MESAS_DEMO)
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_DEMO)
  const [estaCargando] = useState(false)
  const [error] = useState<string | null>(null)

  const obtenerMesas = useCallback(async () => {
    // En demo los datos ya están cargados
  }, [])

  const cambiarEstadoMesa = useCallback(async (mesaId: string, estado: EstadoMesa, mozoId?: string) => {
    setMesas(prev => prev.map(m =>
      m.id === mesaId
        ? { ...m, estado, horaInicio: estado === 'ocupada' ? new Date() : undefined, mozoAsignado: estado === 'ocupada' ? mozoId : undefined }
        : m
    ))
    return true
  }, [])

  const crearPedido = useCallback(async (
    mesaId: string,
    mozoId: string,
    items: { productoId: string; nombreProducto: string; cantidad: number; observacion?: string }[]
  ) => {
    const nuevoPedidoId = `ped-demo-${Date.now()}`
    const nuevoPedido: Pedido = {
      id: nuevoPedidoId,
      mesaId,
      mozoId,
      items: items.map((item, i) => ({
        id: `ip-demo-${i}`,
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        cantidad: item.cantidad,
        observacion: item.observacion,
        estado: 'pendiente'
      })),
      estado: 'solicitado',
      horaCreacion: new Date()
    }
    setPedidos(prev => [...prev, nuevoPedido])
    return nuevoPedidoId
  }, [])

  const actualizarEstadoPedido = useCallback(async (pedidoId: string, estado: string) => {
    setPedidos(prev => prev.map(p =>
      p.id === pedidoId ? { ...p, estado: estado as any } : p
    ))
    return true
  }, [])

  const obtenerPedidosMesa = useCallback(async (mesaId: string) => {
    return pedidos.filter(p => p.mesaId === mesaId)
  }, [pedidos])

  const obtenerTodosPedidos = useCallback(async () => {
    // En demo ya tenemos los pedidos en estado
  }, [])

  return {
    mesas, pedidos, estaCargando, error,
    obtenerMesas, cambiarEstadoMesa, crearPedido,
    actualizarEstadoPedido, obtenerPedidosMesa, obtenerTodosPedidos
  }
}
