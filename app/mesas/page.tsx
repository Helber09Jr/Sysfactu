import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { GestionMesas } from '@/components/mesas/GestionMesas'
import { RolUsuario } from '@/tipos'

export default async function PaginaMesas() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol, id')
    .eq('supabase_user_id', session.user.id)
    .single()

  const rol = (usuario?.rol as RolUsuario) || 'mozo'

  return (
    <PlantillaPrincipal
      nombreUsuario={usuario?.nombre || 'Usuario'}
      rol={rol}
    >
      <div className="space-y-4 h-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {rol === 'cocinero' ? 'Vista Cocina (KDS)' : 'Gestión de Mesas'}
          </h1>
          <p className="text-gray-500 text-sm">
            {rol === 'cocinero' ? 'Gestione los pedidos en tiempo real' : 'Estado del salón en tiempo real'}
          </p>
        </div>
        <GestionMesas usuarioId={usuario?.id || ''} rol={rol} />
      </div>
    </PlantillaPrincipal>
  )
}
