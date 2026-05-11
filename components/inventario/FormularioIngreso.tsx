'use client'
import { useState } from 'react'
import { Save, Plus } from 'lucide-react'
import { Entrada } from '@/components/ui/Entrada'
import { Boton } from '@/components/ui/Boton'
import { Insumo, TipoMovimiento } from '@/tipos'
import { UNIDADES_MEDIDA } from '@/lib/utilidades/constantes'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface PropiedadesFormulario {
  tipo: TipoMovimiento
  insumos: Insumo[]
  usuarioId: string
  onGuardar: (datos: {
    insumoId: string
    tipo: TipoMovimiento
    cantidad: number
    motivo?: string
    proveedor?: string
    precioUnitario?: number
    usuarioId: string
    numeroGuia?: string
  }) => Promise<boolean>
  onCrearInsumo: () => void
}

export function FormularioIngreso({ tipo, insumos, usuarioId, onGuardar, onCrearInsumo }: PropiedadesFormulario) {
  const [insumoId, setInsumoId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [precioUnitario, setPrecioUnitario] = useState('')
  const [numeroGuia, setNumeroGuia] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarLista, setMostrarLista] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  const insumoSeleccionado = insumos.find(i => i.id === insumoId)
  const insumosFiltrados = insumos.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const validar = () => {
    const nuevosErrores: Record<string, string> = {}
    if (!insumoId) nuevosErrores.insumo = 'Seleccione un producto'
    if (!cantidad || parseFloat(cantidad) <= 0) nuevosErrores.cantidad = 'Ingrese una cantidad válida'
    if (tipo === 'entrada' && !proveedor) nuevosErrores.proveedor = 'Ingrese el proveedor'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarGuardar = async () => {
    if (!validar()) return
    setGuardando(true)
    const resultado = await onGuardar({
      insumoId,
      tipo,
      cantidad: parseFloat(cantidad),
      motivo: motivo || undefined,
      proveedor: proveedor || undefined,
      precioUnitario: precioUnitario ? parseFloat(precioUnitario) : undefined,
      usuarioId,
      numeroGuia: numeroGuia || undefined
    })
    if (resultado) {
      setInsumoId('')
      setCantidad('')
      setMotivo('')
      setProveedor('')
      setPrecioUnitario('')
      setNumeroGuia('')
      setBusqueda('')
      setExito(true)
      setTimeout(() => setExito(false), 3000)
    }
    setGuardando(false)
  }

  return (
    <div className="space-y-4">
      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✓ Movimiento registrado correctamente
        </div>
      )}

      {/* Buscador de insumo */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Producto / Insumo <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={insumoSeleccionado ? insumoSeleccionado.nombre : busqueda}
              onChange={e => {
                setBusqueda(e.target.value)
                setInsumoId('')
                setMostrarLista(true)
              }}
              onFocus={() => setMostrarLista(true)}
              className={`block w-full rounded-lg border shadow-sm text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.insumo ? 'border-red-300' : 'border-gray-300'}`}
            />
            {mostrarLista && insumosFiltrados.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {insumosFiltrados.map(insumo => (
                  <button
                    key={insumo.id}
                    onClick={() => {
                      setInsumoId(insumo.id)
                      setBusqueda('')
                      setMostrarLista(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-blue-50 text-left text-sm"
                  >
                    <span>{insumo.nombre}</span>
                    <span className="text-xs text-gray-500">Stock: {insumo.stockActual} {insumo.unidadMedida}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Boton variante="secundario" icono={<Plus className="h-4 w-4" />} onClick={onCrearInsumo} tamaño="md">
            Nuevo
          </Boton>
        </div>
        {errores.insumo && <p className="text-xs text-red-500 mt-1">{errores.insumo}</p>}
      </div>

      {/* Stock actual */}
      {insumoSeleccionado && (
        <div className="bg-blue-50 rounded-lg px-4 py-2 flex justify-between text-sm">
          <span className="text-blue-700">Stock actual:</span>
          <span className="font-semibold text-blue-800">
            {insumoSeleccionado.stockActual} {insumoSeleccionado.unidadMedida}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Entrada
          etiqueta="Cantidad"
          obligatorio
          type="number"
          placeholder="0"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          error={errores.cantidad}
          min="0.001"
          step="0.001"
        />
        {tipo === 'entrada' ? (
          <Entrada
            etiqueta="Precio unitario"
            type="number"
            placeholder="0.00"
            value={precioUnitario}
            onChange={e => setPrecioUnitario(e.target.value)}
            min="0"
            step="0.01"
          />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <select
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 shadow-sm text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option value="venta">Venta</option>
              <option value="merma">Merma</option>
              <option value="uso_interno">Uso interno</option>
            </select>
          </div>
        )}
      </div>

      {tipo === 'entrada' && (
        <div className="grid grid-cols-2 gap-4">
          <Entrada
            etiqueta="Proveedor"
            obligatorio
            placeholder="Nombre del proveedor"
            value={proveedor}
            onChange={e => setProveedor(e.target.value)}
            error={errores.proveedor}
          />
          <Entrada
            etiqueta="N° de guía"
            placeholder="Opcional"
            value={numeroGuia}
            onChange={e => setNumeroGuia(e.target.value)}
          />
        </div>
      )}

      <Boton
        variante={tipo === 'entrada' ? 'exito' : 'peligro'}
        icono={<Save className="h-4 w-4" />}
        onClick={manejarGuardar}
        cargando={guardando}
        className="w-full"
      >
        Registrar {tipo === 'entrada' ? 'ingreso' : 'salida'}
      </Boton>
    </div>
  )
}
