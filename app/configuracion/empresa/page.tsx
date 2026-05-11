'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { FormularioEmpresa } from '@/components/configuracion/FormularioEmpresa'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default function PaginaEmpresa() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Datos de la Empresa</h1>
          <p className="text-gray-500 text-sm">Información que aparecerá en todos los comprobantes</p>
        </div>
        <Tarjeta titulo="Información fiscal">
          <FormularioEmpresa empresaInicial={{ ruc: '20512345678', razonSocial: 'WANVENDOR SAC', direccion: 'Av. Principal 123, Lima', telefono: '01-234-5678' }} />
        </Tarjeta>
      </div>
    </PlantillaPrincipal>
  )
}
