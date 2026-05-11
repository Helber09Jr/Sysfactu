import { DatoTopProducto } from '@/tipos'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface PropiedadesTabla {
  productos: DatoTopProducto[]
}

export function TablaTopProductos({ productos }: PropiedadesTabla) {
  const maxMonto = Math.max(...productos.map(p => p.monto), 1)

  if (productos.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-6">Sin datos disponibles</p>
  }

  return (
    <div className="space-y-3">
      {productos.map((producto, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-800">{producto.nombre}</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-800">{formatearMoneda(producto.monto)}</span>
                <span className="text-xs text-gray-500 ml-2">({producto.cantidad} uds.)</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(producto.monto / maxMonto) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
