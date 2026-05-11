import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { PuntoDeVenta } from '@/components/ventas/PuntoDeVenta'
import { RolUsuario } from '@/tipos'

export default async function PaginaVentas() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol, id')
    .eq('supabase_user_id', session.user.id)
    .single()

  const nombreUsuario = usuario?.nombre || 'Usuario'
  const rol = (usuario?.rol as RolUsuario) || 'cajero'
  const cajeroId = usuario?.id || ''

  return (
    <PlantillaPrincipal nombreUsuario={nombreUsuario} rol={rol}>
      <div className="h-full">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Punto de Venta</h1>
          <p className="text-gray-500 text-sm">Seleccione productos y procese el cobro</p>
        </div>
        <PuntoDeVenta cajeroId={cajeroId} />
      </div>
    </PlantillaPrincipal>
  )
}
