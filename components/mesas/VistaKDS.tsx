'use client'
import { ChefHat, Truck, ClipboardList } from 'lucide-react'
import { Boton } from '@/components/ui/Boton'
import { formatearTiempoTranscurrido } from '@/lib/utilidades/formato'
import { useMesas } from '@/lib/hooks/useMesas'

export function VistaKDS() {
  const { pedidos, actualizarEstadoPedido } = useMesas()

  const columnas = [
    { estado: 'solicitado', etiqueta: 'Solicitado', icono: <ClipboardList className="h-5 w-5" />, color: 'border-t-yellow-500' },
    { estado: 'en_preparacion', etiqueta: 'En preparación', icono: <ChefHat className="h-5 w-5" />, color: 'border-t-blue-500' },
    { estado: 'despachado', etiqueta: 'Despachado', icono: <Truck className="h-5 w-5" />, color: 'border-t-green-500' }
  ]

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {columnas.map(col => {
        const pedidosCol = pedidos.filter((p: any) => p.estado === col.estado)
        return (
          <div key={col.estado} className={`bg-white rounded-xl border-t-4 ${col.color} shadow-sm overflow-hidden flex flex-col`}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {col.icono}
              <span className="font-semibold text-gray-800">{col.etiqueta}</span>
              <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{pedidosCol.length}</span>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-3">
              {pedidosCol.map((pedido: any) => (
                <div key={pedido.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">Mesa {pedido.mesaId?.replace('mesa-', '') || '?'}</span>
                    <span className="text-xs text-gray-500">{formatearTiempoTranscurrido(pedido.horaCreacion)}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {(pedido.items || []).map((item: any, i: number) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{item.cantidad}x</span> {item.nombreProducto}
                        {item.observacion && <p className="text-xs text-orange-600 italic ml-4">{item.observacion}</p>}
                      </div>
                    ))}
                  </div>
                  {col.estado === 'solicitado' && (
                    <Boton variante="primario" tamaño="sm" onClick={() => actualizarEstadoPedido(pedido.id, 'en_preparacion')} className="w-full">
                      Iniciar preparación
                    </Boton>
                  )}
                  {col.estado === 'en_preparacion' && (
                    <Boton variante="exito" tamaño="sm" onClick={() => actualizarEstadoPedido(pedido.id, 'despachado')} className="w-full">
                      Despachar
                    </Boton>
                  )}
                </div>
              ))}
              {pedidosCol.length === 0 && <p className="text-center text-gray-400 text-sm py-6">Sin pedidos</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
