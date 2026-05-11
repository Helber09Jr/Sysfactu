'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Producto } from '@/tipos'
import { TarjetaProducto } from './TarjetaProducto'
import { Entrada } from '@/components/ui/Entrada'
import { CATEGORIAS_PRODUCTO } from '@/lib/utilidades/constantes'
import { PRODUCTOS_DEMO } from '@/lib/demo/datos'

interface PropiedadesCatalogo {
  onAgregarProducto: (producto: Producto) => void
}

export function CatalogoProductos({ onAgregarProducto }: PropiedadesCatalogo) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos')
  const [busqueda, setBusqueda] = useState('')

  const productosFiltrados = PRODUCTOS_DEMO.filter(p => {
    const coincideCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda && p.activo
  })

  const categorias = ['Todos', ...CATEGORIAS_PRODUCTO]

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 space-y-3">
        <Entrada
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          iconoIzquierda={<Search className="h-4 w-4" />}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                ${categoriaActiva === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
          {productosFiltrados.map(producto => (
            <TarjetaProducto key={producto.id} producto={producto} onAgregar={onAgregarProducto} />
          ))}
        </div>
      )}
    </div>
  )
}
