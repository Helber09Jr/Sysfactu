'use client'
import { useEffect, useState } from 'react'
import { ChefHat, Truck, ClipboardList } from 'lucide-react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Boton } from '@/components/ui/Boton'
import { formatearTiempoTranscurrido } from '@/lib/utilidades/formato'

interface PedidoKDS {
  id: string
  mesaNumero: string
  estado: string
  horaCreacion: string
  items: { nombreProducto: string; cantidad: number; observacion?: string }[]
}

export function VistaKDS() {
  const [pedidos, setPedidos] = useState<PedidoKDS[]>([])
  const supabase = crearClienteSupabase()

  const cargarPedidos = async () => {
    const { data } = await supabase
      .from('pedidos')
      .select('*, mesas:mesa_id(numero), items_pedido(*)')
      .in('estado', ['solicitado', 'en_preparacion'])
      .order('hora_creacion')

    setPedidos((data || []).map((p: any) => ({
      id: p.id,
      mesaNumero: p.mesas?.numero || '?',
      estado: p.estado,
      horaCreacion: p.hora_creacion,
      items: (p.items_pedido || []).map((i: any) => ({
        nombreProducto: i.nombre_producto,
        cantidad: i.cantidad,
        observacion: i.observacion
      }))
    })))
  }

  useEffect(() => {
    cargarPedidos()
    const canal = supabase
      .channel('pedidos-kds')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, cargarPedidos)
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [supabase])

  const cambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    await supabase.from('pedidos').update({ estado: nuevoEstado }).eq('id', pedidoId)
    await cargarPedidos()
  }

  const columnas = [
    { estado: 'solicitado', etiqueta: 'Solicitado', icono: <ClipboardList className="h-5 w-5" />, color: 'border-t-yellow-500' },
    { estado: 'en_preparacion', etiqueta: 'En preparación', icono: <ChefHat className="h-5 w-5" />, color: 'border-t-blue-500' },
    { estado: 'despachado', etiqueta: 'Despachado', icono: <Truck className="h-5 w-5" />, color: 'border-t-green-500' }
  ]

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {columnas.map(col => {
        const pedidosCol = pedidos.filter(p => p.estado === col.estado)
        return (
          <div key={col.estado} className={`bg-white rounded-xl border-t-4 ${col.color} shadow-sm overflow-hidden flex flex-col`}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {col.icono}
              <span className="font-semibold text-gray-800">{col.etiqueta}</span>
              <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {pedidosCol.length}
              </span>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-3">
              {pedidosCol.map(pedido => (
                <div key={pedido.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">Mesa {pedido.mesaNumero}</span>
                    <span className="text-xs text-gray-500">
                      {formatearTiempoTranscurrido(pedido.horaCreacion)}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {pedido.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{item.cantidad}x</span> {item.nombreProducto}
                        {item.observacion && (
                          <p className="text-xs text-orange-600 italic ml-4">{item.observacion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {col.estado === 'solicitado' && (
                    <Boton
                      variante="primario"
                      tamaño="sm"
                      onClick={() => cambiarEstado(pedido.id, 'en_preparacion')}
                      className="w-full"
                    >
                      Iniciar preparación
                    </Boton>
                  )}
                  {col.estado === 'en_preparacion' && (
                    <Boton
                      variante="exito"
                      tamaño="sm"
                      onClick={() => cambiarEstado(pedido.id, 'despachado')}
                      className="w-full"
                    >
                      Despachar
                    </Boton>
                  )}
                </div>
              ))}
              {pedidosCol.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6">Sin pedidos</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
