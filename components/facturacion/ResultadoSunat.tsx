'use client'
import { CheckCircle2, XCircle, Clock, Printer, MessageCircle, Mail, Download, RefreshCw } from 'lucide-react'
import { Boton } from '@/components/ui/Boton'
import { EstadoComprobante } from '@/tipos'

interface PropiedadesResultado {
  estado: EstadoComprobante
  cdr?: string
  codigoError?: string
  descripcionError?: string
  onReenviar?: () => void
  onImprimir?: () => void
  onDescargarPDF?: () => void
  onDescargarXML?: () => void
  onWhatsApp?: () => void
  onCorreo?: () => void
}

export function ResultadoSunat({
  estado,
  cdr,
  codigoError,
  descripcionError,
  onReenviar,
  onImprimir,
  onDescargarPDF,
  onDescargarXML,
  onWhatsApp,
  onCorreo
}: PropiedadesResultado) {
  if (estado === 'pendiente') {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Clock className="h-12 w-12 text-yellow-500 animate-pulse mb-3" />
        <p className="font-semibold text-gray-800">Enviando a SUNAT...</p>
        <p className="text-sm text-gray-500 mt-1">Procesando el comprobante electrónico</p>
      </div>
    )
  }

  if (estado === 'aceptado') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center py-6 text-center bg-green-50 rounded-xl">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
          <p className="font-bold text-green-800 text-lg">¡Comprobante aceptado!</p>
          {cdr && (
            <p className="text-xs text-green-600 mt-2 font-mono bg-green-100 px-3 py-1 rounded">
              CDR: {cdr}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Boton variante="secundario" tamaño="sm" icono={<Printer className="h-4 w-4" />} onClick={onImprimir}>
            Imprimir
          </Boton>
          <Boton variante="secundario" tamaño="sm" icono={<MessageCircle className="h-4 w-4" />} onClick={onWhatsApp}>
            WhatsApp
          </Boton>
          <Boton variante="secundario" tamaño="sm" icono={<Mail className="h-4 w-4" />} onClick={onCorreo}>
            Correo
          </Boton>
          <Boton variante="secundario" tamaño="sm" icono={<Download className="h-4 w-4" />} onClick={onDescargarPDF}>
            PDF
          </Boton>
        </div>
        <Boton variante="secundario" tamaño="sm" icono={<Download className="h-4 w-4" />} onClick={onDescargarXML} className="w-full">
          Descargar XML
        </Boton>
      </div>
    )
  }

  if (estado === 'rechazado') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center py-6 text-center bg-red-50 rounded-xl">
          <XCircle className="h-12 w-12 text-red-500 mb-3" />
          <p className="font-bold text-red-800 text-lg">Comprobante rechazado</p>
          {codigoError && (
            <p className="text-sm text-red-600 mt-2">
              Código de error: <span className="font-mono font-bold">{codigoError}</span>
            </p>
          )}
          {descripcionError && (
            <p className="text-sm text-red-600 mt-1">{descripcionError}</p>
          )}
        </div>
        <Boton variante="primario" icono={<RefreshCw className="h-4 w-4" />} onClick={onReenviar} className="w-full">
          Corregir y reenviar
        </Boton>
      </div>
    )
  }

  return null
}
