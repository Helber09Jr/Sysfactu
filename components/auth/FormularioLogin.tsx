'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Boton } from '@/components/ui/Boton'
import { Entrada } from '@/components/ui/Entrada'
import { RolUsuario } from '@/tipos'
import { NAVEGACION_POR_ROL } from '@/lib/utilidades/constantes'

const RUTA_POR_ROL: Record<RolUsuario, string> = {
  administrador: '/dashboard',
  cajero: '/ventas',
  mozo: '/mesas',
  cocinero: '/mesas',
  almacenero: '/inventario'
}

export function FormularioLogin() {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState('')
  const supabase = crearClienteSupabase()
  const router = useRouter()

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !contrasena) {
      setError('Por favor, ingrese su email y contraseña.')
      return
    }

    setEstaCargando(true)
    setError('')

    try {
      const { data, error: errorAuth } = await supabase.auth.signInWithPassword({
        email,
        password: contrasena
      })

      if (errorAuth || !data.user) {
        setError('Credenciales incorrectas. Verifique su email y contraseña.')
        return
      }

      // Obtener el rol del usuario desde la tabla usuarios
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('supabase_user_id', data.user.id)
        .single()

      const rol = (usuario?.rol as RolUsuario) || 'cajero'
      const rutaDestino = RUTA_POR_ROL[rol]
      router.push(rutaDestino)
      router.refresh()
    } catch {
      setError('Error al iniciar sesión. Intente nuevamente.')
    } finally {
      setEstaCargando(false)
    }
  }

  return (
    <form onSubmit={manejarLogin} className="space-y-5">
      <Entrada
        etiqueta="Correo electrónico"
        type="email"
        placeholder="usuario@empresa.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        obligatorio
        iconoIzquierda={<Mail className="h-4 w-4" />}
        autoComplete="email"
      />

      <Entrada
        etiqueta="Contraseña"
        type={mostrarContrasena ? 'text' : 'password'}
        placeholder="••••••••"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        obligatorio
        iconoIzquierda={<Lock className="h-4 w-4" />}
        iconoDerecha={
          mostrarContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
        }
        onClickIconoDerecha={() => setMostrarContrasena(!mostrarContrasena)}
        autoComplete="current-password"
      />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Boton
        type="submit"
        variante="primario"
        tamaño="lg"
        cargando={estaCargando}
        className="w-full"
      >
        Iniciar sesión
      </Boton>
    </form>
  )
}
