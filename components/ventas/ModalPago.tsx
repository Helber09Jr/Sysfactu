'use client'
import { useState } from 'react'
import { CreditCard, Smartphone, DollarSign, Shuffle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Boton } from '@/components/ui/Boton'
import { Entrada } from '@/components/ui/Entrada'
import { MetodoPago } from '@/tipos'
import { formatearMoneda, calcularVuelto } from '@/lib/utilidades/formato'
import { ETIQUETAS_METODO_PAGO } from '@/lib/utilidades/constantes'

interface PropiedadesModalPago {
  abierto: boolean
  total: number
  onConfirmar: (metodo: MetodoPago, montoRecibido?: number) => void
  onCerrar: () => void
  estaCargando: boolean
}

const iconosMetodo: Record<MetodoPago, React.ReactNode> = {
  efectivo: <DollarSign className="h-5 w-5" />,
  tarjeta: <CreditCard className="h-5 w-5" />,
  yape: <Smartphone className="h-5 w-5" />,
  mixto: <Shuffle className="h-5 w-5" />
}

export function ModalPago({ abierto, total, onConfirmar, onCerrar, estaCargando }: PropiedadesModalPago) {
  const [metodoActivo, setMetodoActivo] = useState<MetodoPago>('efectivo')
  const [montoRecibido, setMontoRecibido] = useState('')

  const vuelto = metodoActivo === 'efectivo' && montoRecibido
    ? calcularVuelto(total, parseFloat(montoRecibido) || 0)
    : 0

  const puedeConfirmar = () => {
    if (metodoActivo === 'efectivo') {
      return parseFloat(montoRecibido) >= total
    }
    return true
  }

  const manejarConfirmar = () => {
    onConfirmar(metodoActivo, metodoActivo === 'efectivo' ? parseFloat(montoRecibido) : undefined)
  }

  const metodos: MetodoPago[] = ['efectivo', 'tarjeta', 'yape', 'mixto']

  return (
    <Modal abierto={abierto} titulo="Confirmar pago" onCerrar={onCerrar} tamaño="md">
      <div className="space-y-5">
        {/* Total a cobrar */}
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-600 font-medium">Total a cobrar</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{formatearMoneda(total)}</p>
        </div>

        {/* Selector de método */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Método de pago</p>
          <div className="grid grid-cols-2 gap-2">
            {metodos.map(metodo => (
              <button
                key={metodo}
                onClick={() => setMetodoActivo(metodo)}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border-2 transition-all
                  ${metodoActivo === metodo
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                {iconosMetodo[metodo]}
                <span className="font-medium text-sm">{ETIQUETAS_METODO_PAGO[metodo]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campo de monto para efectivo */}
        {metodoActivo === 'efectivo' && (
          <div className="space-y-3">
            <Entrada
              etiqueta="Monto recibido"
              type="number"
              placeholder="0.00"
              value={montoRecibido}
              onChange={e => setMontoRecibido(e.target.value)}
              iconoIzquierda={<DollarSign className="h-4 w-4" />}
              min={total}
              step="0.50"
            />
            {parseFloat(montoRecibido) >= total && (
              <div className="bg-green-50 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Vuelto</span>
                <span className="text-lg font-bold text-green-700">{formatearMoneda(vuelto)}</span>
              </div>
            )}
            {parseFloat(montoRecibido) > 0 && parseFloat(montoRecibido) < total && (
              <p className="text-sm text-red-600">
                Monto insuficiente. Faltan {formatearMoneda(total - parseFloat(montoRecibido))}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Boton variante="secundario" onClick={onCerrar} className="flex-1">
            Cancelar
          </Boton>
          <Boton
            variante="exito"
            onClick={manejarConfirmar}
            disabled={!puedeConfirmar()}
            cargando={estaCargando}
            className="flex-1"
          >
            Confirmar pago
          </Boton>
        </div>
      </div>
    </Modal>
  )
}
