'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { FormularioComprobante } from './FormularioComprobante'
import { DetalleComprobante } from './DetalleComprobante'
import { ResultadoSunat } from './ResultadoSunat'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { Boton } from '@/components/ui/Boton'
import { ItemComprobante, TipoComprobante, EstadoComprobante } from '@/tipos'
import { PRODUCTOS_DEMO } from '@/lib/demo/datos'

interface DatosCliente {
  tipoComprobante: TipoComprobante
  ruc?: string; dni?: string
  nombreCliente: string; direccion?: string
}

interface PropiedadesModulo {
  ventaIdInicial?: string
}

// Items de ejemplo para demostración
const ITEMS_DEMO: ItemComprobante[] = [
  { descripcion: 'Lomo Saltado', cantidad: 2, precioUnitario: 23.73, subtotal: 47.46 },
  { descripcion: 'Chicha Morada', cantidad: 2, precioUnitario: 4.24, subtotal: 8.48 },
]

export function ModuloFacturacion({ ventaIdInicial }: PropiedadesModulo) {
  const [datosCliente, setDatosCliente] = useState<DatosCliente>({ tipoComprobante: 'boleta', nombreCliente: 'Cliente general' })
  const [itemsComprobante] = useState<ItemComprobante[]>(ITEMS_DEMO)
  const [estadoSunat, setEstadoSunat] = useState<EstadoComprobante | null>(null)
  const [cdr, setCdr] = useState<string>('')
  const [emitiendo, setEmitiendo] = useState(false)
  const [serie] = useState('B001')
  const [numero] = useState(1043)

  const emitirComprobante = async () => {
    setEmitiendo(true)
    setEstadoSunat('pendiente')
    // Simular envío a SUNAT
    await new Promise(r => setTimeout(r, 2000))
    setCdr(`CDR-20260511-${numero}`)
    setEstadoSunat('aceptado')
    setEmitiendo(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Tarjeta titulo="Datos del comprobante">
          <FormularioComprobante onChange={setDatosCliente} />
        </Tarjeta>

        <Tarjeta titulo="Detalle de la venta">
          <DetalleComprobante
            items={itemsComprobante}
            serie={datosCliente.tipoComprobante === 'boleta' ? serie : `F001`}
            numero={numero}
          />
        </Tarjeta>

        {!estadoSunat && (
          <Boton variante="primario" tamaño="lg" icono={<Send className="h-4 w-4" />}
            cargando={emitiendo} onClick={emitirComprobante} className="w-full">
            Emitir y enviar a SUNAT
          </Boton>
        )}
      </div>

      {estadoSunat && (
        <Tarjeta titulo="Respuesta SUNAT">
          <ResultadoSunat
            estado={estadoSunat}
            cdr={cdr}
            onReenviar={() => { setEstadoSunat(null); setCdr('') }}
            onImprimir={() => window.print()}
            onDescargarPDF={() => alert('Demo: Descargando PDF...')}
            onDescargarXML={() => alert('Demo: Descargando XML...')}
            onWhatsApp={() => alert('Demo: Compartiendo por WhatsApp...')}
            onCorreo={() => alert('Demo: Enviando por correo...')}
          />
        </Tarjeta>
      )}
    </div>
  )
}
