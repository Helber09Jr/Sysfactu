import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { RolUsuario } from '@/tipos'
import { AlertaStock } from '@/components/inventario/AlertaStock'
import { Tarjeta } from '@/components/ui/Tarjeta'

export default async function PaginaStock() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('supabase_user_id', session.user.id)
    .single()

  const { data: insumosData } = await supabase
    .from('insumos')
    .select('*')
    .eq('activo', true)

  const insumosBajoStock = (insumosData || [])
    .filter((i: any) => parseFloat(i.stock_actual) <= parseFloat(i.stock_minimo))
    .map((i: any) => ({
      id: i.id,
      nombre: i.nombre,
      categoria: i.categoria || '',
      unidadMedida: i.unidad_medida,
      stockActual: parseFloat(i.stock_actual),
      stockMinimo: parseFloat(i.stock_minimo),
      precioUnitario: parseFloat(i.precio_unitario || 0),
      activo: i.activo
    }))

  return (
    <PlantillaPrincipal
      nombreUsuario={usuario?.nombre || 'Usuario'}
      rol={(usuario?.rol as RolUsuario) || 'almacenero'}
    >
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
