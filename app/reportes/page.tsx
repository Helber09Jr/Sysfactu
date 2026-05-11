'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { ModuloReportes } from '@/components/reportes/ModuloReportes'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'

export default function PaginaReportes() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>
          <p className="text-gray-500 text-sm">Análisis de ventas y desempeño del negocio</p>
        </div>
        <ModuloReportes />
      </div>
    </PlantillaPrincipal>
  )
}
