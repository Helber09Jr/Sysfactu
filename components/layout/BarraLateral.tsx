'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, FileText, UtensilsCrossed,
  Package, BarChart2, Settings, ChevronRight
} from 'lucide-react'
import { RolUsuario } from '@/tipos'
import { NAVEGACION_POR_ROL, RUTAS_MODULOS } from '@/lib/utilidades/constantes'

const iconosModulo: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-5 w-5" />,
  ventas: <ShoppingCart className="h-5 w-5" />,
  facturacion: <FileText className="h-5 w-5" />,
  mesas: <UtensilsCrossed className="h-5 w-5" />,
  inventario: <Package className="h-5 w-5" />,
  reportes: <BarChart2 className="h-5 w-5" />,
  configuracion: <Settings className="h-5 w-5" />
}

interface PropiedadesBarraLateral {
  rol: RolUsuario
}

export function BarraLateral({ rol }: PropiedadesBarraLateral) {
  const rutaActual = usePathname()
  const modulosPermitidos = NAVEGACION_POR_ROL[rol] || []

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="px-4 py-6">
        <nav className="space-y-1">
          {modulosPermitidos.map(modulo => {
            const info = RUTAS_MODULOS[modulo]
            if (!info) return null
            const estaActivo = rutaActual.startsWith(info.ruta)
            return (
              <Link
                key={modulo}
                href={info.ruta}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${estaActivo
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <span className={estaActivo ? 'text-white' : 'text-gray-400 group-hover:text-white'}>
                  {iconosModulo[modulo]}
                </span>
                <span className="flex-1">{info.etiqueta}</span>
                {estaActivo && <ChevronRight className="h-4 w-4" />}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto px-4 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          SYSFACTU v1.0.0
        </p>
      </div>
    </aside>
  )
}
