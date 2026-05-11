'use client'
import { useState } from 'react'
import { LogOut, User, Bell, ChevronDown } from 'lucide-react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { useRouter } from 'next/navigation'
import { RolUsuario } from '@/tipos'
import { ETIQUETAS_ROL } from '@/lib/utilidades/constantes'

interface PropiedadesBarraSuperior {
  nombreUsuario: string
  rol: RolUsuario
}

export function BarraSuperior({ nombreUsuario, rol }: PropiedadesBarraSuperior) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const supabase = crearClienteSupabase()
  const router = useRouter()

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white font-bold text-lg px-3 py-1 rounded-lg">
          SYS
        </div>
        <span className="font-bold text-gray-800 text-lg">FACTU</span>
        <span className="text-xs text-gray-400 ml-2 hidden md:block">— WANVENDOR SAC</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-800">{nombreUsuario}</p>
              <p className="text-xs text-gray-500">{ETIQUETAS_ROL[rol]}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {menuAbierto && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuAbierto(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{nombreUsuario}</p>
                  <p className="text-xs text-gray-500">{ETIQUETAS_ROL[rol]}</p>
                </div>
                <button
                  onClick={cerrarSesion}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
