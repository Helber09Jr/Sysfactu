'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { PuntoDeVenta } from '@/components/ventas/PuntoDeVenta'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'

export default function PaginaVentas() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()

  useEffect(() => {
    if (!cargando && !usuario) router.push('/login')
  }, [usuario, cargando, router])

  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="h-full">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Punto de Venta</h1>
          <p className="text-gray-500 text-sm">Seleccione productos y procese el cobro</p>
        </div>
        <PuntoDeVenta cajeroId={usuario.id} />
      </div>
    </PlantillaPrincipal>
  )
}
