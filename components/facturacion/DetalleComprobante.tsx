import { ItemComprobante } from '@/tipos'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface PropiedadesDetalle {
  items: ItemComprobante[]
  serie: string
  numero: number
}

export function DetalleComprobante({ items, serie, numero }: PropiedadesDetalle) {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0)
  const igv = parseFloat((subtotal * 0.18).toFixed(2))
  const total = parseFloat((subtotal + igv).toFixed(2))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Número de comprobante:</span>
        <span className="font-bold text-gray-800">{serie}-{String(numero).padStart(8, '0')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Descripción</th>
              <th className="text-center px-3 py-2 font-semibold text-gray-600">Cant.</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-600">P. Unit.</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-600">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-3 py-2">{item.descripcion}</td>
                <td className="px-3 py-2 text-center">{item.cantidad}</td>
                <td className="px-3 py-2 text-right">{formatearMoneda(item.precioUnitario)}</td>
                <td className="px-3 py-2 text-right">{formatearMoneda(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>OP. Gravada</span>
          <span>{formatearMoneda(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>IGV (18%)</span>
          <span>{formatearMoneda(igv)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-200 pt-2">
          <span>TOTAL</span>
          <span>{formatearMoneda(total)}</span>
        </div>
      </div>
    </div>
  )
}
