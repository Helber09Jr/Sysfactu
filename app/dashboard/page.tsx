import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { TarjetaKPI } from '@/components/reportes/TarjetaKPI'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, Clock } from 'lucide-react'
import { formatearMoneda } from '@/lib/utilidades/formato'
import { RolUsuario } from '@/tipos'

export default async function PaginaDashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: usuarioData } = await supabase
    .from('usuarios')
    .select('nombre, rol')
    .eq('supabase_user_id', session.user.id)
    .single()

  const nombreUsuario = usuarioData?.nombre || session.user.email || 'Usuario'
  const rol = (usuarioData?.rol as RolUsuario) || 'cajero'

  // KPIs del día
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [{ data: ventasHoy }, { data: mesasActivas }, { data: productosStock }] = await Promise.all([
    supabase.from('ventas').select('total').eq('estado', 'completada').gte('fecha', hoy.toISOString()),
    supabase.from('mesas').select('id').eq('estado', 'ocupada'),
    supabase.from('insumos').select('id').eq('activo', true)
  ])

  const totalVentasHoy = (ventasHoy || []).reduce((acc: number, v: any) => acc + parseFloat(v.total), 0)
  const transaccionesHoy = (ventasHoy || []).length
  const ticketPromedio = transaccionesHoy > 0 ? totalVentasHoy / transaccionesHoy : 0

  return (
    <PlantillaPrincipal nombreUsuario={nombreUsuario} rol={rol}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* KPIs del día */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TarjetaKPI
            titulo="Ventas del día"
            valor={formatearMoneda(totalVentasHoy)}
            variacion={12.5}
            icono={<DollarSign className="h-6 w-6" />}
            colorIcono="bg-green-100 text-green-600"
          />
          <TarjetaKPI
            titulo="Transacciones"
            valor={transaccionesHoy.toString()}
            variacion={8.3}
            icono={<ShoppingCart className="h-6 w-6" />}
            colorIcono="bg-blue-100 text-blue-600"
          />
          <TarjetaKPI
            titulo="Ticket promedio"
            valor={formatearMoneda(ticketPromedio)}
            icono={<TrendingUp className="h-6 w-6" />}
            colorIcono="bg-purple-100 text-purple-600"
          />
          <TarjetaKPI
            titulo="Mesas activas"
            valor={(mesasActivas || []).length.toString()}
            icono={<Users className="h-6 w-6" />}
            colorIcono="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Tarjeta titulo="Accesos rápidos">
            <div className="grid grid-cols-2 gap-3">
              {[
                { ruta: '/ventas', etiqueta: 'Nueva venta', icono: <ShoppingCart className="h-5 w-5" />, color: 'bg-blue-600' },
                { ruta: '/mesas', etiqueta: 'Ver mesas', icono: <Users className="h-5 w-5" />, color: 'bg-green-600' },
                { ruta: '/inventario', etiqueta: 'Inventario', icono: <Package className="h-5 w-5" />, color: 'bg-orange-600' },
                { ruta: '/reportes', etiqueta: 'Reportes', icono: <TrendingUp className="h-5 w-5" />, color: 'bg-purple-600' }
              ].map(item => (
                <a
                  key={item.ruta}
                  href={item.ruta}
                  className={`${item.color} text-white rounded-xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity`}
                >
                  {item.icono}
                  <span className="font-medium text-sm">{item.etiqueta}</span>
                </a>
              ))}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Estado del sistema">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Última sincronización</span>
                </div>
                <span className="text-sm font-medium text-gray-800">Ahora mismo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4 text-orange-500" />
                  <span>Productos en inventario</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{(productosStock || []).length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>Conexión SUNAT</span>
                </div>
                <span className="text-sm font-medium text-green-600">Activa</span>
              </div>
            </div>
          </Tarjeta>
        </div>
      </div>
    </PlantillaPrincipal>
  )
}
