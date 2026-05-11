import { Loader2 } from 'lucide-react'

interface PropiedadesCargando {
  mensaje?: string
  tamaño?: 'sm' | 'md' | 'lg'
}

const tamañoIcono = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
}

export function Cargando({ mensaje, tamaño = 'md' }: PropiedadesCargando) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${tamañoIcono[tamaño]} animate-spin text-blue-600`} />
      {mensaje && <p className="text-sm text-gray-500">{mensaje}</p>}
    </div>
  )
}

export function EsqueletoTarjeta() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  )
}
