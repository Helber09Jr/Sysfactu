'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { GestionMesas } from '@/components/mesas/GestionMesas'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'

export default function PaginaMesas() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4 h-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {usuario.rol === 'cocinero' ? 'Vista Cocina (KDS)' : 'Gestión de Mesas'}
          </h1>
          <p className="text-gray-500 text-sm">
            {usuario.rol === 'cocinero' ? 'Gestione los pedidos en tiempo real' : 'Estado del salón en tiempo real'}
          </p>
        </div>
        <GestionMesas usuarioId={usuario.id} rol={usuario.rol} />
      </div>
    </PlantillaPrincipal>
  )
}
