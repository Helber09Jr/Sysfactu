'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

type TamanoModal = 'sm' | 'md' | 'lg' | 'xl'

interface PropiedadesModal {
  abierto: boolean
  titulo?: string
  onCerrar: () => void
  children: ReactNode
  tamaño?: TamanoModal
  sinCerrar?: boolean
}

const anchoModal: Record<TamanoModal, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl'
}

export function Modal({ abierto, titulo, onCerrar, children, tamaño = 'md', sinCerrar = false }: PropiedadesModal) {
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={sinCerrar ? undefined : onCerrar}
      />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${anchoModal[tamaño]} max-h-[90vh] flex flex-col`}>
        {titulo && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
            {!sinCerrar && (
              <button
                onClick={onCerrar}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
