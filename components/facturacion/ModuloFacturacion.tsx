'use client'
import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { FormularioComprobante } from './FormularioComprobante'
import { DetalleComprobante } from './DetalleComprobante'
import { ResultadoSunat } from './ResultadoSunat'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { Boton } from '@/components/ui/Boton'
import { ItemComprobante, TipoComprobante, EstadoComprobante } from '@/tipos'
import { calcularSubtotalSinIGV, calcularIGV } from '@/lib/utilidades/formato'

interface DatosCliente {
  tipoComprobante: TipoComprobante
  ruc?: string
  dni?: string
  nombreCliente: string
  direccion?: string
}

interface PropiedadesModulo {
  ventaIdInicial?: string
}

export function ModuloFacturacion({ ventaIdInicial }: PropiedadesModulo) {
  const [datosCliente, setDatosCliente] = useState<DatosCliente>({
    tipoComprobante: 'boleta',
    nombreCliente: 'Cliente general'
  })
  const [itemsComprobante, setItemsComprobante] = useState<ItemComprobante[]>([])
  const [estadoSunat, setEstadoSunat] = useState<EstadoComprobante | null>(null)
  const [cdr, setCdr] = useState<string>('')
  const [emitiendo, setEmitiendo] = useState(false)
  const [serie] = useState('B001')
  const [numero] = useState(Math.floor(Math.random() * 9000) + 1000)
  const supabase = crearClienteSupabase()

  useEffect(() => {
    if (ventaIdInicial) {
      cargarItemsVenta(ventaIdInicial)
    }
  }, [ventaIdInicial])

  const cargarItemsVenta = async (ventaId: string) => {
    const { data } = await supabase
      .from('items_venta')
      .select('*, productos(nombre)')
      .eq('venta_id', ventaId)

    if (data) {
      setItemsComprobante(data.map((item: any) => ({
        descripcion: item.productos?.nombre || 'Producto',
        cantidad: item.cantidad,
        precioUnitario: parseFloat(item.precio_unitario) / 1.18,
        subtotal: parseFloat(item.subtotal) / 1.18
      })))
    }
  }

  const emitirComprobante = async () => {
    if (itemsComprobante.length === 0) return
    setEmitiendo(true)
    setEstadoSunat('pendiente')

    try {
      // Simular envío a SUNAT (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000))

      const subtotal = itemsComprobante.reduce((acc, item) => acc + item.subtotal, 0)
      const igv = calcularIGV(subtotal)
      const total = subtotal + igv

      // Registrar en base de datos
      const { error } = await supabase.from('comprobantes').insert({
        tipo: datosCliente.tipoComprobante,
        serie,
        numero,
        cliente_ruc: datosCliente.ruc || null,
        cliente_nombre: datosCliente.nombreCliente || 'Cliente general',
        total,
        igv,
        estado: 'aceptado',
        cdr_respuesta: `CDR-${Date.now()}`,
        venta_id: ventaIdInicial || null
      })

      if (error) throw error

      const codigoCdr = `CDR-${Date.now()}`
      setCdr(codigoCdr)
      setEstadoSunat('aceptado')
    } catch {
      setEstadoSunat('rechazado')
    } finally {
      setEmitiendo(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel izquierdo */}
      <div className="space-y-6">
        <Tarjeta titulo="Datos del comprobante">
          <FormularioComprobante onChange={setDatosCliente} />
        </Tarjeta>

        {itemsComprobante.length > 0 && (
          <Tarjeta titulo="Detalle de la venta">
            <DetalleComprobante
              items={itemsComprobante}
              serie={datosCliente.tipoComprobante === 'boleta' ? `B${serie.slice(1)}` : `F${serie.slice(1)}`}
              numero={numero}
            />
          </Tarjeta>
        )}

        {!estadoSunat && (
          <Boton
            variante="primario"
            tamaño="lg"
            icono={<Send className="h-4 w-4" />}
            cargando={emitiendo}
            onClick={emitirComprobante}
            disabled={itemsComprobante.length === 0}
            className="w-full"
          >
            Emitir y enviar a SUNAT
          </Boton>
        )}
      </div>

      {/* Panel derecho - Resultado SUNAT */}
      {estadoSunat && (
        <Tarjeta titulo="Respuesta SUNAT">
          <ResultadoSunat
            estado={estadoSunat}
            cdr={cdr}
            onReenviar={() => { setEstadoSunat(null); setCdr('') }}
            onImprimir={() => window.print()}
            onDescargarPDF={() => alert('Descargando PDF...')}
            onDescargarXML={() => alert('Descargando XML...')}
            onWhatsApp={() => alert('Compartiendo por WhatsApp...')}
            onCorreo={() => alert('Enviando por correo...')}
          />
        </Tarjeta>
      )}
    </div>
  )
}
