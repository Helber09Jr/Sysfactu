'use client'
import { Plus, Package } from 'lucide-react'
import { Producto } from '@/tipos'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface PropiedadesTarjetaProducto {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

export function TarjetaProducto({ producto, onAgregar }: PropiedadesTarjetaProducto) {
  return (
    <button
      onClick={() => onAgregar(producto)}
      disabled={producto.stockDisponible === 0}
      className={`
        w-full text-left bg-white rounded-xl border border-gray-200 p-4
        hover:border-blue-300 hover:shadow-md transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:shadow-none
        active:scale-95
      `}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
          <Package className="h-5 w-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 text-sm truncate">{producto.nombre}</p>
          <p className="text-xs text-gray-500">{producto.categoria}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-base font-bold text-blue-600">{formatearMoneda(producto.precio)}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs ${producto.stockDisponible > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {producto.stockDisponible > 0 ? `Stock: ${producto.stockDisponible}` : 'Sin stock'}
          </span>
          <div className="h-5 w-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
            <Plus className="h-3 w-3" />
          </div>
        </div>
      </div>
    </button>
  )
}
