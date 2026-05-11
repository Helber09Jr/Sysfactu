'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Producto } from '@/tipos'
import { TarjetaProducto } from './TarjetaProducto'
import { Entrada } from '@/components/ui/Entrada'
import { Cargando } from '@/components/ui/Cargando'
import { CATEGORIAS_PRODUCTO } from '@/lib/utilidades/constantes'

interface PropiedadesCatalogo {
  onAgregarProducto: (producto: Producto) => void
}

export function CatalogoProductos({ onAgregarProducto }: PropiedadesCatalogo) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [estaCargando, setEstaCargando] = useState(true)
  const supabase = crearClienteSupabase()

  useEffect(() => {
    const cargarProductos = async () => {
      const { data } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .order('nombre')
      setProductos((data || []).map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        precio: parseFloat(p.precio),
        categoria: p.categoria,
        imagen: p.imagen_url,
        stockDisponible: 999, // Simplificado para el POS
        activo: p.activo
      })))
      setEstaCargando(false)
    }
    cargarProductos()
  }, [supabase])

  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
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
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                ${categoriaActiva === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {estaCargando ? (
        <Cargando mensaje="Cargando productos..." />
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
          {productosFiltrados.map(producto => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              onAgregar={onAgregarProducto}
            />
          ))}
        </div>
      )}
    </div>
  )
}
