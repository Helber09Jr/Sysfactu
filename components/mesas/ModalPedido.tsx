'use client'
import { useState } from 'react'
import { Plus, Minus, Trash2, Send } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Boton } from '@/components/ui/Boton'
import { Entrada } from '@/components/ui/Entrada'
import { Mesa, Producto } from '@/tipos'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { useEffect } from 'react'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface ItemPedidoLocal {
  productoId: string
  nombreProducto: string
  precio: number
  cantidad: number
  observacion: string
}

interface PropiedadesModalPedido {
  mesa: Mesa
  mozoId: string
  onConfirmar: (items: { productoId: string; nombreProducto: string; cantidad: number; observacion?: string }[]) => Promise<void>
  onCerrar: () => void
  estaCargando: boolean
}

export function ModalPedido({ mesa, mozoId, onConfirmar, onCerrar, estaCargando }: PropiedadesModalPedido) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [items, setItems] = useState<ItemPedidoLocal[]>([])
  const [busqueda, setBusqueda] = useState('')
  const supabase = crearClienteSupabase()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('productos').select('*').eq('activo', true).order('nombre')
      setProductos((data || []).map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        precio: parseFloat(p.precio),
        categoria: p.categoria,
        stockDisponible: 999,
        activo: p.activo
      })))
    }
    cargar()
  }, [supabase])

  const agregarItem = (producto: Producto) => {
    setItems(prev => {
      const existente = prev.find(i => i.productoId === producto.id)
      if (existente) {
        return prev.map(i => i.productoId === producto.id
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
        )
      }
      return [...prev, {
        productoId: producto.id,
        nombreProducto: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        observacion: ''
      }]
    })
  }

  const cambiarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setItems(prev => prev.filter(i => i.productoId !== productoId))
    } else {
      setItems(prev => prev.map(i => i.productoId === productoId ? { ...i, cantidad } : i))
    }
  }

  const cambiarObservacion = (productoId: string, obs: string) => {
    setItems(prev => prev.map(i => i.productoId === productoId ? { ...i, observacion: obs } : i))
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <Modal
      abierto={true}
      titulo={`Pedido — Mesa ${mesa.numero}`}
      onCerrar={onCerrar}
      tamaño="xl"
    >
      <div className="grid grid-cols-2 gap-6 h-96">
        {/* Catálogo rápido */}
        <div className="flex flex-col">
          <Entrada
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="mb-3"
          />
          <div className="overflow-y-auto flex-1 space-y-1">
            {productosFiltrados.map(p => (
              <button
                key={p.id}
                onClick={() => agregarItem(p)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 text-left transition-colors"
              >
                <span className="text-sm font-medium text-gray-800">{p.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-600">{formatearMoneda(p.precio)}</span>
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Items del pedido */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Pedido ({items.length} productos)
          </h3>
          <div className="overflow-y-auto flex-1 space-y-3">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                Seleccione productos del catálogo
              </p>
            ) : (
              items.map(item => (
                <div key={item.productoId} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 flex-1">{item.nombreProducto}</span>
                    <button onClick={() => cambiarCantidad(item.productoId, 0)}>
                      <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
                        className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
                        className="h-6 w-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatearMoneda(item.precio * item.cantidad)}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Observación..."
                    value={item.observacion}
                    onChange={e => cambiarObservacion(item.productoId, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))
            )}
          </div>

          <Boton
            variante="primario"
            icono={<Send className="h-4 w-4" />}
            onClick={() => onConfirmar(items.map(i => ({
              productoId: i.productoId,
              nombreProducto: i.nombreProducto,
              cantidad: i.cantidad,
              observacion: i.observacion || undefined
            })))}
            disabled={items.length === 0}
            cargando={estaCargando}
            className="mt-3 w-full"
          >
            Enviar a cocina
          </Boton>
        </div>
      </div>
    </Modal>
  )
}
