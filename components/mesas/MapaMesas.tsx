import { Mesa } from '@/tipos'
import { TarjetaMesa } from './TarjetaMesa'

interface PropiedadesMapaMesas {
  mesas: Mesa[]
  onSeleccionarMesa: (mesa: Mesa) => void
}

export function MapaMesas({ mesas, onSeleccionarMesa }: PropiedadesMapaMesas) {
  const leyenda = [
    { estado: 'libre', color: 'bg-green-100 border-green-400', etiqueta: 'Libre' },
    { estado: 'ocupada', color: 'bg-red-100 border-red-400', etiqueta: 'Ocupada' },
    { estado: 'reservada', color: 'bg-yellow-100 border-yellow-400', etiqueta: 'Reservada' },
    { estado: 'inactiva', color: 'bg-gray-100 border-gray-400', etiqueta: 'Inactiva' }
  ]

  return (
    <div className="space-y-4">
      {/* Leyenda */}
      <div className="flex flex-wrap gap-3">
        {leyenda.map(item => (
          <div key={item.estado} className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border-2 ${item.color}`} />
            <span className="text-sm text-gray-600">{item.etiqueta}</span>
          </div>
        ))}
      </div>

      {/* Grilla de mesas */}
      {mesas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay mesas configuradas</p>
          <p className="text-sm mt-1">Configure las mesas en Configuración → Empresa</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mesas.map(mesa => (
            <TarjetaMesa key={mesa.id} mesa={mesa} onClick={onSeleccionarMesa} />
          ))}
        </div>
      )}
    </div>
  )
}
