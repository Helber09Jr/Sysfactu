'use client'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { ItemCarrito, TipoAtencion } from '@/tipos'
import { Boton } from '@/components/ui/Boton'
import { formatearMoneda } from '@/lib/utilidades/formato'
import { ETIQUETAS_TIPO_ATENCION, TIPOS_ATENCION } from '@/lib/utilidades/constantes'

interface PropiedadesCarrito {
  items: ItemCarrito[]
  descuento: number
  tipoAtencion: TipoAtencion
  onCambiarTipoAtencion: (tipo: TipoAtencion) => void
  onCambiarCantidad: (productoId: string, cantidad: number) => void
  onEliminar: (productoId: string) => void
  onLimpiar: () => void
  onCobrar: () => void
  onAplicarDescuento: () => void
}

export function CarritoVenta({
  items,
  descuento,
  tipoAtencion,
  onCambiarTipoAtencion,
  onCambiarCantidad,
  onEliminar,
  onLimpiar,
  onCobrar,
  onAplicarDescuento
}: PropiedadesCarrito) {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0)
  const total = subtotal - descuento

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200">
      {/* Encabezado */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-800">Carrito</span>
          {items.length > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button onClick={onLimpiar} className="text-xs text-red-500 hover:text-red-700">
            Limpiar
          </button>
        )}
      </div>

      {/* Tipo de atención */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          {TIPOS_ATENCION.map(tipo => (
            <button
              key={tipo}
              onClick={() => onCambiarTipoAtencion(tipo)}
              className={`
                flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors
                ${tipoAtencion === tipo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {ETIQUETAS_TIPO_ATENCION[tipo]}
            </button>
          ))}
        </div>
      </div>

      {/* Items del carrito */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">El carrito está vacío</p>
            <p className="text-xs mt-1">Agregue productos del catálogo</p>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            {items.map(item => (
              <div key={item.producto.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.producto.nombre}</p>
                  <p className="text-xs text-blue-600">{formatearMoneda(item.producto.precio)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCambiarCantidad(item.producto.id, item.cantidad - 1)}
                    className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                  <button
                    onClick={() => onCambiarCantidad(item.producto.id, item.cantidad + 1)}
                    className="h-6 w-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-sm font-semibold text-gray-800 w-16 text-right">
                  {formatearMoneda(item.subtotal)}
                </div>
                <button
                  onClick={() => onEliminar(item.producto.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totales y botones */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatearMoneda(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento</span>
                <span>-{formatearMoneda(descuento)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-gray-100">
              <span>Total</span>
              <span>{formatearMoneda(total)}</span>
            </div>
          </div>

          <button
            onClick={onAplicarDescuento}
            className="w-full text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Aplicar descuento
          </button>

          <Boton
            variante="exito"
            tamaño="lg"
            onClick={onCobrar}
            className="w-full"
          >
            Cobrar {formatearMoneda(total)}
          </Boton>
        </div>
      )}
    </div>
  )
}
