'use client'
import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type VarianteBoton = 'primario' | 'secundario' | 'peligro' | 'exito' | 'fantasma'
type TamanoBoton = 'sm' | 'md' | 'lg'

interface PropiedadesBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton
  tamaño?: TamanoBoton
  cargando?: boolean
  icono?: ReactNode
  children?: ReactNode
}

const estilosVariante: Record<VarianteBoton, string> = {
  primario: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secundario: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
  peligro: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  exito: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  fantasma: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
}

const estilosTamaño: Record<TamanoBoton, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export function Boton({
  variante = 'primario',
  tamaño = 'md',
  cargando = false,
  icono,
  children,
  disabled,
  className = '',
  ...props
}: PropiedadesBoton) {
  const estaDeshabilitado = disabled || cargando

  return (
    <button
      {...props}
      disabled={estaDeshabilitado}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${estilosVariante[variante]}
        ${estilosTamaño[tamaño]}
        ${className}
      `}
    >
      {cargando ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icono ? (
        <span className="h-4 w-4 flex items-center">{icono}</span>
      ) : null}
      {children}
    </button>
  )
}
