import { ReactNode } from 'react'

type VarianteInsignia = 'exito' | 'error' | 'advertencia' | 'info' | 'neutral'

interface PropiedadesInsignia {
  variante?: VarianteInsignia
  children: ReactNode
  className?: string
}

const estilosVariante: Record<VarianteInsignia, string> = {
  exito: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  advertencia: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200'
}

export function Insignia({ variante = 'neutral', children, className = '' }: PropiedadesInsignia) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${estilosVariante[variante]}
      ${className}
    `}>
      {children}
    </span>
  )
}
