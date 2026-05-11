'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Entrada } from '@/components/ui/Entrada'
import { Insignia } from '@/components/ui/Insignia'
import { Tabla, ColumnaTabla } from '@/components/ui/Tabla'
import { Producto } from '@/tipos'
import { CATEGORIAS_PRODUCTO } from '@/lib/utilidades/constantes'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface ProductoForm {
  nombre: string
  categoria: string
  precio: string
  descripcion: string
  activo: boolean
}

const formularioVacio: ProductoForm = {
  nombre: '', categoria: 'Platos', precio: '', descripcion: '', activo: true
}

export function GestionCarta() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [estaCargando, setEstaCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [formulario, setFormulario] = useState<ProductoForm>(formularioVacio)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const supabase = crearClienteSupabase()

  const cargarProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('nombre')
    setProductos((data || []).map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      precio: parseFloat(p.precio),
      categoria: p.categoria,
      imagen: p.imagen_url,
      stockDisponible: 999,
      activo: p.activo,
      descripcion: p.descripcion
    })))
    setEstaCargando(false)
  }

  useEffect(() => { cargarProductos() }, [])

  const abrirCrear = () => {
    setProductoEditar(null)
    setFormulario(formularioVacio)
    setErrores({})
    setModalAbierto(true)
  }

  const abrirEditar = (producto: Producto) => {
    setProductoEditar(producto)
    setFormulario({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      descripcion: producto.descripcion || '',
      activo: producto.activo
    })
    setErrores({})
    setModalAbierto(true)
  }

  const validar = () => {
    const nuevos: Record<string, string> = {}
    if (!formulario.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio'
    if (!formulario.precio || parseFloat(formulario.precio) < 0) nuevos.precio = 'Ingrese un precio válido'
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  const guardar = async () => {
    if (!validar()) return
    setGuardando(true)
    const datos = {
      nombre: formulario.nombre,
      categoria: formulario.categoria,
      precio: parseFloat(formulario.precio),
      descripcion: formulario.descripcion || null,
      activo: formulario.activo
    }
    if (productoEditar) {
      await supabase.from('productos').update(datos).eq('id', productoEditar.id)
    } else {
      await supabase.from('productos').insert(datos)
    }
    await cargarProductos()
    setModalAbierto(false)
    setGuardando(false)
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    await supabase.from('productos').delete().eq('id', id)
    await cargarProductos()
  }

  const columnas: ColumnaTabla<Producto>[] = [
    {
      clave: 'nombre',
      encabezado: 'Producto',
      renderizar: (v, fila) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Package className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{v}</p>
            {fila.descripcion && <p className="text-xs text-gray-400 truncate max-w-xs">{fila.descripcion}</p>}
          </div>
        </div>
      )
    },
    { clave: 'categoria', encabezado: 'Categoría' },
    {
      clave: 'precio',
      encabezado: 'Precio',
      renderizar: (v) => <span className="font-semibold text-blue-600">{formatearMoneda(v)}</span>
    },
    {
      clave: 'activo',
      encabezado: 'Estado',
      renderizar: (v) => (
        <Insignia variante={v ? 'exito' : 'neutral'}>{v ? 'Activo' : 'Inactivo'}</Insignia>
      )
    },
    {
      clave: 'id',
      encabezado: 'Acciones',
      renderizar: (_, fila) => (
        <div className="flex gap-2">
          <Boton variante="secundario" tamaño="sm" icono={<Edit className="h-3 w-3" />} onClick={() => abrirEditar(fila)}>
            Editar
          </Boton>
          <Boton variante="peligro" tamaño="sm" icono={<Trash2 className="h-3 w-3" />} onClick={() => eliminar(fila.id)}>
            Eliminar
          </Boton>
        </div>
      )
    }
  ]

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800">{productos.length} producto(s) en la carta</p>
          <Boton variante="primario" tamaño="sm" icono={<Plus className="h-4 w-4" />} onClick={abrirCrear}>
            Nuevo producto
          </Boton>
        </div>
        <Tabla columnas={columnas} datos={productos} cargando={estaCargando} sinDatos="No hay productos en la carta" />
      </div>

      <Modal
        abierto={modalAbierto}
        titulo={productoEditar ? 'Editar producto' : 'Nuevo producto'}
        onCerrar={() => setModalAbierto(false)}
        tamaño="md"
      >
        <div className="space-y-4">
          <Entrada
            etiqueta="Nombre"
            obligatorio
            placeholder="Ej: Lomo saltado"
            value={formulario.nombre}
            onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
            error={errores.nombre}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formulario.categoria}
              onChange={e => setFormulario({ ...formulario, categoria: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CATEGORIAS_PRODUCTO.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Entrada
            etiqueta="Precio (S/.)"
            obligatorio
            type="number"
            placeholder="0.00"
            value={formulario.precio}
            onChange={e => setFormulario({ ...formulario, precio: e.target.value })}
            error={errores.precio}
            min="0"
            step="0.50"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formulario.descripcion}
              onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })}
              placeholder="Descripción opcional del producto..."
              rows={2}
              className="block w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formulario.activo}
              onChange={e => setFormulario({ ...formulario, activo: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Producto activo (visible en el POS)</span>
          </label>

          <div className="flex gap-2 pt-2">
            <Boton variante="secundario" onClick={() => setModalAbierto(false)} className="flex-1">Cancelar</Boton>
            <Boton variante="primario" onClick={guardar} cargando={guardando} className="flex-1">
              {productoEditar ? 'Actualizar' : 'Crear producto'}
            </Boton>
          </div>
        </div>
      </Modal>
    </>
  )
}
