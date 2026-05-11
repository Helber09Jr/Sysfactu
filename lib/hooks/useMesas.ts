'use client'
import { useState, useEffect, useCallback } from 'react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Mesa, Pedido, EstadoMesa } from '@/tipos'

export function useMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = crearClienteSupabase()

  const obtenerMesas = useCallback(async () => {
    setEstaCargando(true)
    try {
      const { data, error } = await supabase
        .from('mesas')
        .select('*, usuarios:mozo_asignado(nombre)')
        .eq('activa', true)
        .order('numero')

      if (error) throw error
      const mesasFormateadas = (data || []).map((m: any) => ({
        id: m.id,
        numero: m.numero,
        capacidad: m.capacidad,
        estado: m.estado as EstadoMesa,
        mozoAsignado: m.mozo_asignado,
        nombreMozo: m.usuarios?.nombre,
        horaInicio: m.hora_inicio ? new Date(m.hora_inicio) : undefined,
        pedidoActualId: m.pedido_actual_id
      }))
      setMesas(mesasFormateadas)
    } catch {
      setError('Error al cargar las mesas.')
    } finally {
      setEstaCargando(false)
    }
  }, [supabase])

  useEffect(() => {
    obtenerMesas()
    // Suscripción en tiempo real
    const canal = supabase
      .channel('mesas-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mesas' }, () => {
        obtenerMesas()
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [obtenerMesas, supabase])

  const cambiarEstadoMesa = useCallback(async (mesaId: string, estado: EstadoMesa, mozoId?: string) => {
    try {
      const actualizacion: any = {
        estado,
        hora_inicio: estado === 'ocupada' ? new Date().toISOString() : null,
        mozo_asignado: estado === 'ocupada' ? mozoId : null
      }
      const { error } = await supabase.from('mesas').update(actualizacion).eq('id', mesaId)
      if (error) throw error
      await obtenerMesas()
      return true
    } catch {
      setError('Error al actualizar la mesa.')
      return false
    }
  }, [supabase, obtenerMesas])

  const crearPedido = useCallback(async (mesaId: string, mozoId: string, items: { productoId: string; nombreProducto: string; cantidad: number; observacion?: string }[]) => {
    try {
      const { data: pedido, error: errorPedido } = await supabase
        .from('pedidos')
        .insert({ mesa_id: mesaId, mozo_id: mozoId, estado: 'solicitado' })
        .select()
        .single()

      if (errorPedido) throw errorPedido

      const itemsPedido = items.map(item => ({
        pedido_id: pedido.id,
        producto_id: item.productoId,
        nombre_producto: item.nombreProducto,
        cantidad: item.cantidad,
        observacion: item.observacion || null,
        estado: 'pendiente'
      }))

      const { error: errorItems } = await supabase.from('items_pedido').insert(itemsPedido)
      if (errorItems) throw errorItems

      await obtenerMesas()
      return pedido.id
    } catch {
      setError('Error al crear el pedido.')
      return null
    }
  }, [supabase, obtenerMesas])

  const actualizarEstadoPedido = useCallback(async (pedidoId: string, estado: string) => {
    try {
      const { error } = await supabase.from('pedidos').update({ estado }).eq('id', pedidoId)
      if (error) throw error
      return true
    } catch {
      setError('Error al actualizar el pedido.')
      return false
    }
  }, [supabase])

  const obtenerPedidosMesa = useCallback(async (mesaId: string) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, items_pedido(*)')
        .eq('mesa_id', mesaId)
        .neq('estado', 'entregado')
        .order('hora_creacion', { ascending: false })

      if (error) throw error
      return data || []
    } catch {
      return []
    }
  }, [supabase])

  const obtenerTodosPedidos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, items_pedido(*), mesas:mesa_id(numero)')
        .in('estado', ['solicitado', 'en_preparacion'])
        .order('hora_creacion', { ascending: true })

      if (error) throw error
      setPedidos(data as unknown as Pedido[] || [])
    } catch {
      setError('Error al cargar pedidos.')
    }
  }, [supabase])

  return {
    mesas,
    pedidos,
    estaCargando,
    error,
    obtenerMesas,
    cambiarEstadoMesa,
    crearPedido,
    actualizarEstadoPedido,
    obtenerPedidosMesa,
    obtenerTodosPedidos
  }
}
