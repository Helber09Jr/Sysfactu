'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CatalogoProductos } from './CatalogoProductos'
import { CarritoVenta } from './CarritoVenta'
import { ModalPago } from './ModalPago'
import { Modal } from '@/components/ui/Modal'
import { Entrada } from '@/components/ui/Entrada'
import { Boton } from '@/components/ui/Boton'
import { useVentas } from '@/lib/hooks/useVentas'
import { Producto, MetodoPago, TipoAtencion } from '@/tipos'

interface PropiedadesPuntoDeVenta {
  cajeroId: string
}

export function PuntoDeVenta({ cajeroId }: PropiedadesPuntoDeVenta) {
  const [tipoAtencion, setTipoAtencion] = useState<TipoAtencion>('mostrador')
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false)
  const [modalDescuentoAbierto, setModalDescuentoAbierto] = useState(false)
  const [tipoDescuento, setTipoDescuento] = useState<'porcentaje' | 'monto'>('porcentaje')
  const [valorDescuento, setValorDescuento] = useState('')
  const router = useRouter()

  const {
    itemsCarrito,
    descuento,
    estaCargando,
    agregarAlCarrito,
    quitarDelCarrito,
    cambiarCantidad,
    aplicarDescuento,
    calcularTotal,
    registrarVenta,
    limpiarCarrito
  } = useVentas()

  const manejarAgregarProducto = (producto: Producto) => {
    agregarAlCarrito(producto)
  }

  const manejarCobrar = async (metodo: MetodoPago, montoRecibido?: number) => {
    const venta = await registrarVenta({
      tipoAtencion,
      metodoPago: metodo,
      montoRecibido,
      cajeroId
    })
    if (venta) {
      setModalPagoAbierto(false)
      router.push(`/facturacion?ventaId=${venta.id}`)
    }
  }

  const manejarAplicarDescuento = () => {
    const valor = parseFloat(valorDescuento)
    if (!isNaN(valor) && valor > 0) {
      aplicarDescuento(tipoDescuento, valor)
    }
    setModalDescuentoAbierto(false)
    setValorDescuento('')
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
        {/* Catálogo - Panel izquierdo */}
        <div className="lg:col-span-3 overflow-hidden flex flex-col">
          <CatalogoProductos onAgregarProducto={manejarAgregarProducto} />
        </div>

        {/* Carrito - Panel derecho */}
        <div className="lg:col-span-2 overflow-hidden">
          <CarritoVenta
            items={itemsCarrito}
            descuento={descuento}
            tipoAtencion={tipoAtencion}
            onCambiarTipoAtencion={setTipoAtencion}
            onCambiarCantidad={cambiarCantidad}
            onEliminar={quitarDelCarrito}
            onLimpiar={limpiarCarrito}
            onCobrar={() => setModalPagoAbierto(true)}
            onAplicarDescuento={() => setModalDescuentoAbierto(true)}
          />
        </div>
      </div>

      {/* Modal de pago */}
      <ModalPago
        abierto={modalPagoAbierto}
        total={calcularTotal()}
        onConfirmar={manejarCobrar}
        onCerrar={() => setModalPagoAbierto(false)}
        estaCargando={estaCargando}
      />

      {/* Modal de descuento */}
      <Modal
        abierto={modalDescuentoAbierto}
        titulo="Aplicar descuento"
        onCerrar={() => setModalDescuentoAbierto(false)}
        tamaño="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['porcentaje', 'monto'] as const).map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoDescuento(tipo)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tipoDescuento === tipo ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tipo === 'porcentaje' ? 'Porcentaje (%)' : 'Monto (S/.)'}
              </button>
            ))}
          </div>
          <Entrada
            etiqueta={tipoDescuento === 'porcentaje' ? 'Porcentaje de descuento' : 'Monto de descuento'}
            type="number"
            placeholder={tipoDescuento === 'porcentaje' ? 'Ej: 10' : 'Ej: 5.00'}
            value={valorDescuento}
            onChange={e => setValorDescuento(e.target.value)}
            min="0"
            max={tipoDescuento === 'porcentaje' ? '100' : undefined}
          />
          <div className="flex gap-2">
            <Boton variante="secundario" onClick={() => setModalDescuentoAbierto(false)} className="flex-1">
              Cancelar
            </Boton>
            <Boton variante="primario" onClick={manejarAplicarDescuento} className="flex-1">
              Aplicar
            </Boton>
          </div>
        </div>
      </Modal>
    </>
  )
}
