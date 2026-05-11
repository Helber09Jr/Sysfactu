'use client'
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface PropiedadesEntrada extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string
  obligatorio?: boolean
  error?: string
  ayuda?: string
  iconoIzquierda?: ReactNode
  iconoDerecha?: ReactNode
  onClickIconoDerecha?: () => void
}

export const Entrada = forwardRef<HTMLInputElement, PropiedadesEntrada>(
  function Entrada({
    etiqueta,
    obligatorio = false,
    error,
    ayuda,
    iconoIzquierda,
    iconoDerecha,
    onClickIconoDerecha,
    className = '',
    ...props
  }, ref) {
    return (
      <div className="w-full">
        {etiqueta && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {etiqueta}
            {obligatorio && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {iconoIzquierda && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {iconoIzquierda}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              block w-full rounded-lg border shadow-sm text-sm transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
              ${iconoIzquierda ? 'pl-10' : 'pl-3'}
              ${iconoDerecha ? 'pr-10' : 'pr-3'}
              py-2
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
          />
          {iconoDerecha && (
            <button
              type="button"
              onClick={onClickIconoDerecha}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {iconoDerecha}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {ayuda && !error && <p className="mt-1 text-sm text-gray-500">{ayuda}</p>}
      </div>
    )
  }
)
