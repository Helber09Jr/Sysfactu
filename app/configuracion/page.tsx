'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlantillaPrincipal } from '@/components/layout/PlantillaPrincipal'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { Cargando } from '@/components/ui/Cargando'
import Link from 'next/link'
import { Users, BookOpen, Building2, ChevronRight } from 'lucide-react'

export default function PaginaConfiguracion() {
  const { usuario, cargando } = useSesion()
  const router = useRouter()
  useEffect(() => { if (!cargando && !usuario) router.push('/login') }, [usuario, cargando, router])
  if (cargando || !usuario) return <div className="min-h-screen flex items-center justify-center"><Cargando /></div>

  const secciones = [
    { ruta: '/configuracion/usuarios', titulo: 'Usuarios y Roles', descripcion: 'Gestione los usuarios y sus permisos', icono: <Users className="h-6 w-6 text-blue-600" />, color: 'bg-blue-50' },
    { ruta: '/configuracion/carta', titulo: 'Carta / Menú', descripcion: 'Administre los productos del menú', icono: <BookOpen className="h-6 w-6 text-green-600" />, color: 'bg-green-50' },
    { ruta: '/configuracion/empresa', titulo: 'Datos de la Empresa', descripcion: 'Configure RUC y razón social', icono: <Building2 className="h-6 w-6 text-purple-600" />, color: 'bg-purple-50' },
  ]

  return (
    <PlantillaPrincipal nombreUsuario={usuario.nombre} rol={usuario.rol}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
          <p className="text-gray-500 text-sm">Administre las opciones del sistema</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secciones.map(sec => (
            <Link key={sec.ruta} href={sec.ruta} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all group">
              <div className={`h-12 w-12 ${sec.color} rounded-xl flex items-center justify-center mb-4`}>{sec.icono}</div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{sec.titulo}</h3>
                  <p className="text-sm text-gray-500">{sec.descripcion}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 mt-0.5 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PlantillaPrincipal>
  )
}
