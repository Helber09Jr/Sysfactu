import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { RolUsuario } from '@/tipos'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default async function PaginaReporteMozos() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('supabase_user_id', session.user.id)
    .single()

  const { data: mozos } = await supabase
    .from('usuarios')
    .select('*, pedidos(id, mesas:mesa_id(numero))')
    .eq('rol', 'mozo')
    .eq('estado', 'activo')

  return (
    <PlantillaPrincipal
      nombreUsuario={usuario?.nombre || 'Usuario'}
      rol={(usuario?.rol as RolUsuario) || 'administrador'}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reporte por Mozo</h1>
          <p className="text-gray-500 text-sm">Desempeño del equipo de sala</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(mozos || []).map((mozo: any) => (
            <Tarjeta key={mozo.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {mozo.nombre[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{mozo.nombre}</p>
                  <p className="text-xs text-gray-500">Mozo</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">{(mozo.pedidos || []).length}</p>
                  <p className="text-xs text-gray-500">Pedidos</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">0</p>
                  <p className="text-xs text-gray-500">Mesas</p>
                </div>
              </div>
            </Tarjeta>
          ))}
          {(mozos || []).length === 0 && (
            <p className="col-span-3 text-center text-gray-400 py-12">No hay mozos activos registrados</p>
          )}
        </div>
      </div>
    </PlantillaPrincipal>
  )
}
