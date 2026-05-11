'use client'
import { useState } from 'react'
import { MapaMesas } from './MapaMesas'
import { ModalPedido } from './ModalPedido'
import { VistaKDS } from './VistaKDS'
import { Cargando } from '@/components/ui/Cargando'
import { useMesas } from '@/lib/hooks/useMesas'
import { Mesa, RolUsuario } from '@/tipos'

interface PropiedadesGestion {
  usuarioId: string
  rol: RolUsuario
}

export function GestionMesas({ usuarioId, rol }: PropiedadesGestion) {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null)
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState(false)
  const { mesas, estaCargando, cambiarEstadoMesa, crearPedido } = useMesas()

  const manejarSeleccionMesa = async (mesa: Mesa) => {
    if (mesa.estado === 'libre') {
      const confirmar = confirm(`¿Abrir la mesa ${mesa.numero}?`)
      if (confirmar) {
        await cambiarEstadoMesa(mesa.id, 'ocupada', usuarioId)
      }
    } else if (mesa.estado === 'ocupada') {
      setMesaSeleccionada(mesa)
      setModalPedidoAbierto(true)
    }
  }

  const manejarConfirmarPedido = async (items: { productoId: string; nombreProducto: string; cantidad: number; observacion?: string }[]) => {
    if (!mesaSeleccionada) return
    const pedidoId = await crearPedido(mesaSeleccionada.id, usuarioId, items)
    if (pedidoId) {
      setModalPedidoAbierto(false)
      setMesaSeleccionada(null)
    }
  }

  if (rol === 'cocinero') {
    return <VistaKDS />
  }

  if (estaCargando) {
    return <Cargando mensaje="Cargando mesas..." />
  }

  return (
    <>
      <MapaMesas mesas={mesas} onSeleccionarMesa={manejarSeleccionMesa} />

      {modalPedidoAbierto && mesaSeleccionada && (
        <ModalPedido
          mesa={mesaSeleccionada}
          mozoId={usuarioId}
          onConfirmar={manejarConfirmarPedido}
          onCerrar={() => { setModalPedidoAbierto(false); setMesaSeleccionada(null) }}
          estaCargando={false}
        />
      )}
    </>
  )
}
