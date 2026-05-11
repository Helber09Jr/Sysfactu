import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { RolUsuario } from '@/tipos'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default async function PaginaNotas() {
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
      rol={(usuario?.rol as RolUsuario) || 'cajero'}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notas de Crédito / Débito</h1>
          <p className="text-gray-500 text-sm">Gestione las notas de crédito y débito</p>
        </div>
        <Tarjeta titulo="Emitir nota">
          <p className="text-gray-500 text-sm text-center py-8">
            Seleccione un comprobante para emitir una nota de crédito o débito.
          </p>
        </Tarjeta>
      </div>
    </PlantillaPrincipal>
  )
}
