'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { USUARIOS_DEMO } from '@/lib/demo/datos'

export default function PaginaReporteMozos() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  const mozos = USUARIOS_DEMO.filter(u => u.rol === 'mozo' && u.estado === 'activo')
  const statsDemo = [
    { mesas: 8, pedidos: 24, monto: 720.00 },
    { mesas: 6, pedidos: 18, monto: 540.00 },
  ]

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reporte por Mozo</h1>
          <p className="text-gray-500 text-sm">Desempeño del equipo de sala</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mozos.map((mozo, i) => (
            <Tarjeta key={mozo.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {mozo.nombre[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{mozo.nombre}</p>
                  <p className="text-xs text-gray-500">Mozo</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">{statsDemo[i]?.mesas ?? 5}</p>
                  <p className="text-xs text-gray-500">Mesas</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">{statsDemo[i]?.pedidos ?? 15}</p>
                  <p className="text-xs text-gray-500">Pedidos</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-green-600">S/.{statsDemo[i]?.monto ?? 0}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </Tarjeta>
          ))}
        </div>
      </div>
    </PlantillaPrincipal>
  )
}
