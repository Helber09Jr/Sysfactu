'use client'
import { useState } from 'react'
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { FormularioIngreso } from './FormularioIngreso'
import { AlertaStock } from './AlertaStock'
import { Modal } from '@/components/ui/Modal'
import { Entrada } from '@/components/ui/Entrada'
import { Boton } from '@/components/ui/Boton'
import { useInventario } from '@/lib/hooks/useInventario'
import { Insignia } from '@/components/ui/Insignia'
import { TipoMovimiento, Insumo } from '@/tipos'
import { UNIDADES_MEDIDA } from '@/lib/utilidades/constantes'

interface PropiedadesModulo {
  usuarioId: string
}

export function ModuloInventario({ usuarioId }: PropiedadesModulo) {
  const [pestañaActiva, setPestañaActiva] = useState<TipoMovimiento>('entrada')
  const [modalNuevoInsumo, setModalNuevoInsumo] = useState(false)
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null)
  const [nuevoInsumo, setNuevoInsumo] = useState({ nombre: '', categoria: '', unidadMedida: 'unidades', stockMinimo: '' })
  const { insumos, insumosConAlerta, estaCargando, registrarMovimiento, crearInsumo } = useInventario()

  const manejarGuardar = async (datos: any) => {
    return await registrarMovimiento({ ...datos, usuarioId })
  }

  const manejarCrearInsumo = async () => {
    if (!nuevoInsumo.nombre) return
    const resultado = await crearInsumo({
      nombre: nuevoInsumo.nombre,
      categoria: nuevoInsumo.categoria,
      unidadMedida: nuevoInsumo.unidadMedida as any,
      stockActual: 0,
      stockMinimo: parseFloat(nuevoInsumo.stockMinimo) || 0,
      precioUnitario: 0,
      activo: true
    })
    if (resultado) {
      setModalNuevoInsumo(false)
      setNuevoInsumo({ nombre: '', categoria: '', unidadMedida: 'unidades', stockMinimo: '' })
    }
  }

  const pestañas = [
    { id: 'entrada' as TipoMovimiento, etiqueta: 'Registrar ingreso', icono: <TrendingUp className="h-4 w-4" /> },
    { id: 'salida' as TipoMovimiento, etiqueta: 'Registrar salida', icono: <TrendingDown className="h-4 w-4" /> }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel izquierdo: Formulario */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          {pestañas.map(tab => (
            <button
              key={tab.id}
              onClick={() => setPestañaActiva(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
                ${pestañaActiva === tab.id ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab.icono}
              {tab.etiqueta}
            </button>
          ))}
        </div>

        <Tarjeta titulo={pestañaActiva === 'entrada' ? 'Registrar ingreso de mercadería' : 'Registrar salida de stock'}>
          <FormularioIngreso
            tipo={pestañaActiva}
            insumos={insumos}
            usuarioId={usuarioId}
            onGuardar={manejarGuardar}
            onCrearInsumo={() => setModalNuevoInsumo(true)}
          />
        </Tarjeta>

        {/* Lista de productos */}
        <Tarjeta titulo="Productos en inventario">
          <div className="space-y-2">
            {insumos.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">No hay productos registrados</p>
            ) : (
              insumos.slice(0, 10).map(insumo => (
                <div
                  key={insumo.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                  onClick={() => setInsumoSeleccionado(insumo)}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{insumo.nombre}</p>
                      <p className="text-xs text-gray-500">{insumo.categoria}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {insumo.stockActual} {insumo.unidadMedida}
                    </span>
                    {insumo.stockActual <= insumo.stockMinimo && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Tarjeta>
      </div>

      {/* Panel derecho: Alertas */}
      <div className="space-y-4">
        <Tarjeta titulo="Alertas de stock">
          <AlertaStock insumos={insumosConAlerta} />
        </Tarjeta>

        <Tarjeta titulo="Resumen">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total productos</span>
              <span className="font-semibold">{insumos.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Con alerta</span>
              <span className="font-semibold text-red-600">{insumosConAlerta.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estado</span>
              <Insignia variante={insumosConAlerta.length === 0 ? 'exito' : 'advertencia'}>
                {insumosConAlerta.length === 0 ? 'Óptimo' : 'Revisar'}
              </Insignia>
            </div>
          </div>
        </Tarjeta>
      </div>

      {/* Modal nuevo insumo */}
      <Modal
        abierto={modalNuevoInsumo}
        titulo="Crear nuevo producto"
        onCerrar={() => setModalNuevoInsumo(false)}
        tamaño="sm"
      >
        <div className="space-y-4">
          <Entrada
            etiqueta="Nombre"
            obligatorio
            placeholder="Nombre del producto"
            value={nuevoInsumo.nombre}
            onChange={e => setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value })}
          />
          <Entrada
            etiqueta="Categoría"
            placeholder="Ej: Carnes, Verduras..."
            value={nuevoInsumo.categoria}
            onChange={e => setNuevoInsumo({ ...nuevoInsumo, categoria: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de medida</label>
            <select
              value={nuevoInsumo.unidadMedida}
              onChange={e => setNuevoInsumo({ ...nuevoInsumo, unidadMedida: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {UNIDADES_MEDIDA.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <Entrada
            etiqueta="Stock mínimo"
            type="number"
            placeholder="0"
            value={nuevoInsumo.stockMinimo}
            onChange={e => setNuevoInsumo({ ...nuevoInsumo, stockMinimo: e.target.value })}
            min="0"
          />
          <div className="flex gap-2">
            <Boton variante="secundario" onClick={() => setModalNuevoInsumo(false)} className="flex-1">Cancelar</Boton>
            <Boton variante="primario" onClick={manejarCrearInsumo} className="flex-1">Crear</Boton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
