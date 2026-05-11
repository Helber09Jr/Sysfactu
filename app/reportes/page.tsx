import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { ModuloReportes } from '@/components/reportes/ModuloReportes'
import { RolUsuario } from '@/tipos'

export default async function PaginaReportes() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('supabase_user_id', session.user.id)
    .single()

  return (
    <PlantillaPrincipal
      nombreUsuario={usuario?.nombre || 'Usuario'}
      rol={(usuario?.rol as RolUsuario) || 'administrador'}
    >
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
