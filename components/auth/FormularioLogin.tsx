'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Info } from 'lucide-react'
import { Boton } from '@/components/ui/Boton'
import { Entrada } from '@/components/ui/Entrada'
import { useSesion } from '@/lib/demo/ContextoDemo'
import { CREDENCIALES_DEMO } from '@/lib/demo/datos'
import { RolUsuario } from '@/tipos'

const RUTA_POR_ROL: Record<RolUsuario, string> = {
  administrador: '/dashboard',
  cajero: '/ventas',
  mozo: '/mesas',
  cocinero: '/mesas',
  almacenero: '/inventario'
}

export function FormularioLogin() {
  const [email, setEmail] = useState('admin@sysfactu.com')
  const [contrasena, setContrasena] = useState('123456')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState('')
  const { iniciarSesion } = useSesion()
  const router = useRouter()

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !contrasena) {
      setError('Por favor, ingrese su email y contraseña.')
      return
    }
    setEstaCargando(true)
    setError('')
    // Simular delay de red
    await new Promise(r => setTimeout(r, 600))

    const credencial = CREDENCIALES_DEMO.find(
      c => c.email === email && c.contrasena === contrasena
    )

    if (!credencial) {
      setError('Credenciales incorrectas. Use las cuentas de demostración.')
      setEstaCargando(false)
      return
    }

    iniciarSesion({
      id: `usr-${credencial.rol}`,
      nombre: credencial.nombre,
      login: credencial.email,
      rol: credencial.rol,
      estado: 'activo',
      fechaCreacion: new Date('2026-01-01')
    })

    router.push(RUTA_POR_ROL[credencial.rol])
  }

  return (
    <form onSubmit={manejarLogin} className="space-y-5">
      {/* Banner modo demo */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Modo demostración — cuentas disponibles:</p>
          <p>admin@sysfactu.com · cajero@sysfactu.com · mozo@sysfactu.com</p>
          <p>cocina@sysfactu.com · almacen@sysfactu.com</p>
          <p className="mt-1">Contraseña de todas: <span className="font-mono font-bold">123456</span></p>
        </div>
      </div>

      <Entrada
        etiqueta="Correo electrónico"
        type="email"
        placeholder="admin@sysfactu.com"
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
        iconoDerecha={mostrarContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        onClickIconoDerecha={() => setMostrarContrasena(!mostrarContrasena)}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Boton type="submit" variante="primario" tamaño="lg" cargando={estaCargando} className="w-full">
        Iniciar sesión
      </Boton>

      {/* Acceso rápido por rol */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center mb-2">Acceso rápido por rol</p>
        <div className="grid grid-cols-2 gap-1.5">
          {CREDENCIALES_DEMO.map(c => (
            <button
              key={c.email}
              type="button"
              onClick={() => { setEmail(c.email); setContrasena(c.contrasena) }}
              className="text-xs px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 transition-colors text-left"
            >
              <span className="font-medium capitalize">{c.rol}</span>
              <br />
              <span className="text-gray-400">{c.nombre}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
