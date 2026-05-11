'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default function PaginaNotas() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notas de Crédito / Débito</h1>
          <p className="text-gray-500 text-sm">Gestione las notas de crédito y débito</p>
        </div>
        <Tarjeta titulo="Emitir nota">
          <p className="text-gray-500 text-sm text-center py-8">
            Seleccione un comprobante para emitir una nota de crédito o débito.
          </p>
        </Tarjeta>
      </div>
    </PlantillaPrincipal>
  )
}
