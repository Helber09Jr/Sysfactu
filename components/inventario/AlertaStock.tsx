import { AlertTriangle } from 'lucide-react'
import { Insumo } from '@/tipos'

interface PropiedadesAlerta {
  insumos: Insumo[]
}

export function AlertaStock({ insumos }: PropiedadesAlerta) {
  if (insumos.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <div className="h-2 w-2 bg-green-500 rounded-full" />
        <span>Todos los productos tienen stock suficiente</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-red-600 font-medium text-sm mb-3">
        <AlertTriangle className="h-4 w-4" />
        <span>{insumos.length} producto(s) bajo stock mínimo</span>
      </div>
      {insumos.map(insumo => (
        <div
          key={insumo.id}
          className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
        >
          <div>
            <p className="text-sm font-medium text-red-800">{insumo.nombre}</p>
            <p className="text-xs text-red-600">
              Mínimo: {insumo.stockMinimo} {insumo.unidadMedida}
            </p>
          </div>
          <div className="text-right">
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
              {insumo.stockActual} {insumo.unidadMedida}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
