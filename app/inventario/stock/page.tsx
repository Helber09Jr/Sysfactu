'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { AlertaStock } from '@/components/inventario/AlertaStock'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { INSUMOS_DEMO } from '@/lib/demo/datos'

export default function PaginaStock() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  const insumosBajoStock = INSUMOS_DEMO.filter(i => i.stockActual <= i.stockMinimo)

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Estado de Stock</h1>
          <p className="text-gray-500 text-sm">Productos que necesitan reposición</p>
        </div>
        <Tarjeta titulo="Alertas de stock mínimo">
          <AlertaStock insumos={insumosBajoStock} />
        </Tarjeta>
      </div>
    </PlantillaPrincipal>
  )
}
