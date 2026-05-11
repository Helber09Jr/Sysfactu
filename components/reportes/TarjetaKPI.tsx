import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Tarjeta } from '@/components/ui/Tarjeta'

interface PropiedadesTarjetaKPI {
  titulo: string
  valor: string
  variacion?: number
  icono: ReactNode
  colorIcono?: string
}

export function TarjetaKPI({ titulo, valor, variacion, icono, colorIcono = 'bg-blue-100 text-blue-600' }: PropiedadesTarjetaKPI) {
  const hayVariacion = variacion !== undefined
  const esPositiva = hayVariacion && variacion >= 0

  return (
    <Tarjeta className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{titulo}</p>
          <p className="text-2xl font-bold text-gray-800">{valor}</p>
          {hayVariacion && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${esPositiva ? 'text-green-600' : 'text-red-600'}`}>
              {esPositiva ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(variacion).toFixed(1)}% vs período anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorIcono}`}>
          {icono}
        </div>
      </div>
    </Tarjeta>
  )
}
