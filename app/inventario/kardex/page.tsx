import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { TablaKardex } from '@/components/inventario/TablaKardex'
import { RolUsuario } from '@/tipos'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default async function PaginaKardex() {
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
      rol={(usuario?.rol as RolUsuario) || 'almacenero'}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kardex de Inventario</h1>
          <p className="text-gray-500 text-sm">Historial de movimientos de stock</p>
        </div>
        <Tarjeta titulo="Movimientos">
          <TablaKardex />
        </Tarjeta>
      </div>
    </PlantillaPrincipal>
  )
}
