import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { GestionUsuarios } from '@/components/configuracion/GestionUsuarios'
import { RolUsuario } from '@/tipos'

export default async function PaginaUsuarios() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('supabase_user_id', session.user.id)
    .single()

  if (usuario?.rol !== 'administrador') redirect('/dashboard')

  return (
    <PlantillaPrincipal
      nombreUsuario={usuario?.nombre || 'Usuario'}
      rol={(usuario?.rol as RolUsuario) || 'administrador'}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuarios y Roles</h1>
          <p className="text-gray-500 text-sm">Gestione los accesos al sistema</p>
        </div>
        <GestionUsuarios />
      </div>
    </PlantillaPrincipal>
  )
}
