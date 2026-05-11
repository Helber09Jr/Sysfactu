import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { GestionCarta } from '@/components/configuracion/GestionCarta'
import { RolUsuario } from '@/tipos'

export default async function PaginaCarta() {
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
          <h1 className="text-2xl font-bold text-gray-800">Carta / Menú</h1>
          <p className="text-gray-500 text-sm">Administre los productos disponibles en el punto de venta</p>
        </div>
        <GestionCarta />
      </div>
    </PlantillaPrincipal>
  )
}
