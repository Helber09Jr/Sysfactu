import { ReactNode } from 'react'

interface PropiedadesTarjeta {
  children: ReactNode
  className?: string
  titulo?: string
  accion?: ReactNode
  sinPadding?: boolean
}

export function Tarjeta({ children, className = '', titulo, accion, sinPadding = false }: PropiedadesTarjeta) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {(titulo || accion) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {titulo && <h3 className="text-base font-semibold text-gray-800">{titulo}</h3>}
          {accion && <div>{accion}</div>}
        </div>
      )}
      <div className={sinPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  )
}
