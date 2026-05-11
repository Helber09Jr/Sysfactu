'use client'
import { useState } from 'react'
import { Save, Search } from 'lucide-react'
import { Entrada } from '@/components/ui/Entrada'
import { Boton } from '@/components/ui/Boton'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Empresa } from '@/tipos'
import { validarRUC } from '@/lib/utilidades/validaciones'

interface PropiedadesFormulario {
  empresaInicial?: Partial<Empresa>
}

export function FormularioEmpresa({ empresaInicial }: PropiedadesFormulario) {
  const [ruc, setRuc] = useState(empresaInicial?.ruc || '')
  const [razonSocial, setRazonSocial] = useState(empresaInicial?.razonSocial || '')
  const [direccion, setDireccion] = useState(empresaInicial?.direccion || '')
  const [telefono, setTelefono] = useState(empresaInicial?.telefono || '')
  const [guardando, setGuardando] = useState(false)
  const [buscandoRuc, setBuscandoRuc] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [exito, setExito] = useState(false)
  const supabase = crearClienteSupabase()

  const validarRuc = async () => {
    if (!validarRUC(ruc)) {
      setErrores(prev => ({ ...prev, ruc: 'RUC inválido. Debe tener 11 dígitos.' }))
      return
    }
    setErrores(prev => ({ ...prev, ruc: '' }))
    setBuscandoRuc(true)
    await new Promise(r => setTimeout(r, 800))
    setRazonSocial(`EMPRESA ${ruc.slice(-4)} SAC`)
    setDireccion('Av. Principal 123, Lima')
    setBuscandoRuc(false)
  }

  const guardar = async () => {
    if (!ruc || !razonSocial) {
      setErrores({ ruc: !ruc ? 'El RUC es obligatorio' : '', razonSocial: !razonSocial ? 'La razón social es obligatoria' : '' })
      return
    }
    setGuardando(true)
    const { error } = await supabase
      .from('empresa')
      .upsert({ ruc, razon_social: razonSocial, direccion, telefono }, { onConflict: 'ruc' })
    if (!error) {
      setExito(true)
      setTimeout(() => setExito(false), 3000)
    }
    setGuardando(false)
  }

  return (
    <div className="space-y-5">
      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✓ Datos de la empresa guardados correctamente
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <Entrada
            etiqueta="RUC"
            obligatorio
            placeholder="20123456789"
            value={ruc}
            onChange={e => setRuc(e.target.value)}
            error={errores.ruc}
            maxLength={11}
          />
        </div>
        <div className="flex items-end">
          <Boton
            variante="secundario"
            icono={<Search className="h-4 w-4" />}
            cargando={buscandoRuc}
            onClick={validarRuc}
          >
            Validar
          </Boton>
        </div>
      </div>

      <Entrada
        etiqueta="Razón social"
        obligatorio
        placeholder="WANVENDOR SAC"
        value={razonSocial}
        onChange={e => setRazonSocial(e.target.value)}
        error={errores.razonSocial}
      />

      <Entrada
        etiqueta="Dirección"
        placeholder="Av. Principal 123, Lima"
        value={direccion}
        onChange={e => setDireccion(e.target.value)}
      />

      <Entrada
        etiqueta="Teléfono"
        placeholder="01-234-5678"
        value={telefono}
        onChange={e => setTelefono(e.target.value)}
      />

      <Boton
        variante="primario"
        icono={<Save className="h-4 w-4" />}
        onClick={guardar}
        cargando={guardando}
        className="w-full"
      >
        Guardar datos de la empresa
      </Boton>
    </div>
  )
}
