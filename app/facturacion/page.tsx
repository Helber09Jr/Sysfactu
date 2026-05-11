'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { ModuloFacturacion } from '@/components/facturacion/ModuloFacturacion'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'
import { Suspense } from 'react'

function ContenidoFacturacion() {
  const searchParams = useSearchParams()
  const ventaId = searchParams.get('ventaId') || undefined
  const { usuario, cargando } = useSesion()
  const router = useRouter()

  useEffect(() => {
    if (!cargando && !usuario) router.push('/login')
  }, [usuario, cargando, router])

  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Facturación Electrónica</h1>
          <p className="text-gray-500 text-sm">Emita boletas y facturas electrónicas</p>
        </div>
        <ModuloFacturacion ventaIdInicial={ventaId} />
      </div>
    </PlantillaPrincipal>
  )
}

export default function PaginaFacturacion() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Cargando /></div>}><ContenidoFacturacion /></Suspense>
}
