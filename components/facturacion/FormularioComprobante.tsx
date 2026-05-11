'use client'
import { useState } from 'react'
import { Search, FileText, Receipt } from 'lucide-react'
import { Entrada } from '@/components/ui/Entrada'
import { Boton } from '@/components/ui/Boton'
import { TipoComprobante } from '@/tipos'
import { validarRUC, validarDNI } from '@/lib/utilidades/validaciones'

interface DatosCliente {
  tipoComprobante: TipoComprobante
  ruc?: string
  dni?: string
  nombreCliente: string
  direccion?: string
}

interface PropiedadesFormulario {
  onChange: (datos: DatosCliente) => void
}

export function FormularioComprobante({ onChange }: PropiedadesFormulario) {
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>('boleta')
  const [ruc, setRuc] = useState('')
  const [dni, setDni] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [direccion, setDireccion] = useState('')
  const [buscandoRuc, setBuscandoRuc] = useState(false)
  const [errorRuc, setErrorRuc] = useState('')
  const [errorDni, setErrorDni] = useState('')

  const buscarRuc = async () => {
    if (!validarRUC(ruc)) {
      setErrorRuc('RUC inválido. Debe tener 11 dígitos.')
      return
    }
    setErrorRuc('')
    setBuscandoRuc(true)
    try {
      // Simulación de API SUNAT (en producción se conecta a la API real)
      await new Promise(resolve => setTimeout(resolve, 800))
      const datosSimulados = {
        razonSocial: `EMPRESA ${ruc.slice(-4)} SAC`,
        direccion: 'Av. Principal 123, Lima'
      }
      setNombreCliente(datosSimulados.razonSocial)
      setDireccion(datosSimulados.direccion)
      onChange({ tipoComprobante, ruc, nombreCliente: datosSimulados.razonSocial, direccion: datosSimulados.direccion })
    } catch {
      setErrorRuc('No se pudo consultar la SUNAT. Ingrese los datos manualmente.')
    } finally {
      setBuscandoRuc(false)
    }
  }

  const buscarDni = async () => {
    if (!validarDNI(dni)) {
      setErrorDni('DNI inválido. Debe tener 8 dígitos.')
      return
    }
    setErrorDni('')
    // Simulación de API RENIEC
    await new Promise(resolve => setTimeout(resolve, 500))
    const nombreSimulado = `CLIENTE ${dni.slice(-4)}`
    setNombreCliente(nombreSimulado)
    onChange({ tipoComprobante, dni, nombreCliente: nombreSimulado })
  }

  const actualizarDatos = (campo: string, valor: string) => {
    const datos: DatosCliente = {
      tipoComprobante,
      ruc: tipoComprobante === 'factura' ? ruc : undefined,
      dni: tipoComprobante === 'boleta' ? dni : undefined,
      nombreCliente: campo === 'nombre' ? valor : nombreCliente,
      direccion: campo === 'direccion' ? valor : direccion
    }
    onChange(datos)
  }

  return (
    <div className="space-y-5">
      {/* Selector tipo comprobante */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Tipo de comprobante</p>
        <div className="flex gap-3">
          {[
            { tipo: 'boleta' as TipoComprobante, etiqueta: 'Boleta de Venta', icono: <Receipt className="h-4 w-4" /> },
            { tipo: 'factura' as TipoComprobante, etiqueta: 'Factura Electrónica', icono: <FileText className="h-4 w-4" /> }
          ].map(({ tipo, etiqueta, icono }) => (
            <button
              key={tipo}
              onClick={() => setTipoComprobante(tipo)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all
                ${tipoComprobante === tipo
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
            >
              {icono}
              <span className="text-sm font-medium">{etiqueta}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Campos según tipo */}
      {tipoComprobante === 'factura' ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Entrada
                etiqueta="RUC del cliente"
                obligatorio
                placeholder="20123456789"
                value={ruc}
                onChange={e => setRuc(e.target.value)}
                error={errorRuc}
                maxLength={11}
              />
            </div>
            <div className="flex items-end">
              <Boton
                variante="secundario"
                onClick={buscarRuc}
                cargando={buscandoRuc}
                icono={<Search className="h-4 w-4" />}
              >
                Buscar
              </Boton>
            </div>
          </div>
          <Entrada
            etiqueta="Razón social"
            obligatorio
            placeholder="Nombre de la empresa"
            value={nombreCliente}
            onChange={e => { setNombreCliente(e.target.value); actualizarDatos('nombre', e.target.value) }}
          />
          <Entrada
            etiqueta="Dirección"
            placeholder="Dirección fiscal"
            value={direccion}
            onChange={e => { setDireccion(e.target.value); actualizarDatos('direccion', e.target.value) }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Entrada
                etiqueta="DNI (opcional)"
                placeholder="12345678"
                value={dni}
                onChange={e => setDni(e.target.value)}
                error={errorDni}
                maxLength={8}
              />
            </div>
            {dni && (
              <div className="flex items-end">
                <Boton variante="secundario" onClick={buscarDni} icono={<Search className="h-4 w-4" />}>
                  Buscar
                </Boton>
              </div>
            )}
          </div>
          <Entrada
            etiqueta="Nombre del cliente"
            placeholder="Cliente general"
            value={nombreCliente}
            onChange={e => { setNombreCliente(e.target.value); actualizarDatos('nombre', e.target.value) }}
          />
        </div>
      )}
    </div>
  )
}
