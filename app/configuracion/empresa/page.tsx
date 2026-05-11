import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { FormularioEmpresa } from '@/components/configuracion/FormularioEmpresa'
import { RolUsuario } from '@/tipos'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default async function PaginaEmpresa() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('supabase_user_id', session.user.id)
    .single()

  if (usuario?.rol !== 'administrador') redirect('/dashboard')

  const { data: empresa } = await supabase
    .from('empresa')
    .select('*')
    .single()

  const empresaInicial = empresa ? {
    id: empresa.id,
    ruc: empresa.ruc,
    razonSocial: empresa.razon_social,
    direccion: empresa.direccion || '',
    telefono: empresa.telefono || ''
  } : undefined

  return (
    <PlantillaPrincipal
      nombreUsuario={usuario?.nombre || 'Usuario'}
      rol={(usuario?.rol as RolUsuario) || 'administrador'}
    >
      <div className="space-y-4 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Datos de la Empresa</h1>
          <p className="text-gray-500 text-sm">Información que aparecerá en todos los comprobantes</p>
        </div>
        <Tarjeta titulo="Información fiscal">
          <FormularioEmpresa empresaInicial={empresaInicial} />
        </Tarjeta>
      </div>
    </PlantillaPrincipal>
  )
}
