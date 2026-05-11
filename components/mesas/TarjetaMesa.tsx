'use client'
import { Users, Clock, User } from 'lucide-react'
import { Mesa } from '@/tipos'
import { formatearTiempoTranscurrido } from '@/lib/utilidades/formato'
import { COLORES_ESTADO_MESA } from '@/lib/utilidades/constantes'

interface PropiedadesTarjetaMesa {
  mesa: Mesa
  onClick: (mesa: Mesa) => void
}

const etiquetaEstado: Record<string, string> = {
  libre: 'Libre',
  ocupada: 'Ocupada',
  reservada: 'Reservada',
  inactiva: 'Inactiva'
}

export function TarjetaMesa({ mesa, onClick }: PropiedadesTarjetaMesa) {
  const colorEstilo = COLORES_ESTADO_MESA[mesa.estado] || COLORES_ESTADO_MESA.inactiva

  return (
    <button
      onClick={() => onClick(mesa)}
      disabled={mesa.estado === 'inactiva'}
      className={`
        w-full rounded-xl border-2 p-4 transition-all duration-200
        hover:shadow-md active:scale-95
        disabled:cursor-not-allowed disabled:opacity-60
        ${colorEstilo}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold">Mesa {mesa.numero}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/50">
          {etiquetaEstado[mesa.estado]}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs opacity-70">
        <Users className="h-3 w-3" />
        <span>{mesa.capacidad} personas</span>
      </div>

      {mesa.estado === 'ocupada' && (
        <div className="mt-2 space-y-1">
          {mesa.nombreMozo && (
            <div className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3" />
              <span>{mesa.nombreMozo}</span>
            </div>
          )}
          {mesa.horaInicio && (
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>{formatearTiempoTranscurrido(mesa.horaInicio)}</span>
            </div>
          )}
        </div>
      )}
    </button>
  )
}
