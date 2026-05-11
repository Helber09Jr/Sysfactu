'use client'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Entrada } from '@/components/ui/Entrada'
import { Boton } from '@/components/ui/Boton'
import { Usuario, RolUsuario } from '@/tipos'
import { ROLES_USUARIO, ETIQUETAS_ROL } from '@/lib/utilidades/constantes'
import { validarContrasena, NivelContrasena } from '@/lib/utilidades/validaciones'

interface PropiedadesFormulario {
  usuarioInicial?: Partial<Usuario>
  onGuardar: (datos: { nombre: string; login: string; contrasena?: string; rol: RolUsuario }) => Promise<boolean>
  verificarLogin: (login: string) => Promise<boolean>
  modoEdicion?: boolean
}

const DESCRIPCIONES_ROL: Record<RolUsuario, string> = {
  administrador: 'Acceso total al sistema, configuración y reportes',
  cajero: 'Gestiona ventas y facturación electrónica',
  mozo: 'Atiende mesas y registra pedidos',
  cocinero: 'Visualiza y gestiona pedidos en cocina',
  almacenero: 'Controla inventario y stock de insumos'
}

const coloresFortaleza: Record<NivelContrasena, string> = {
  debil: 'text-red-600',
  media: 'text-yellow-600',
  fuerte: 'text-green-600'
}

export function FormularioUsuario({ usuarioInicial, onGuardar, verificarLogin, modoEdicion = false }: PropiedadesFormulario) {
  const [nombre, setNombre] = useState(usuarioInicial?.nombre || '')
  const [login, setLogin] = useState(usuarioInicial?.login || '')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [rol, setRol] = useState<RolUsuario>(usuarioInicial?.rol || 'cajero')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [loginDisponible, setLoginDisponible] = useState<boolean | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  const fortalezaContrasena = contrasena ? validarContrasena(contrasena) : null

  useEffect(() => {
    if (login && login !== usuarioInicial?.login) {
      const verificar = async () => {
        const disponible = await verificarLogin(login)
        setLoginDisponible(disponible)
      }
      const timeout = setTimeout(verificar, 500)
      return () => clearTimeout(timeout)
    }
  }, [login, usuarioInicial?.login, verificarLogin])

  const validar = () => {
    const nuevosErrores: Record<string, string> = {}
    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (!login.trim()) nuevosErrores.login = 'El login es obligatorio'
    if (!modoEdicion && !contrasena) nuevosErrores.contrasena = 'La contraseña es obligatoria'
    if (contrasena && contrasena !== confirmarContrasena) nuevosErrores.confirmar = 'Las contraseñas no coinciden'
    if (loginDisponible === false) nuevosErrores.login = 'Este login ya está en uso'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarGuardar = async () => {
    if (!validar()) return
    setGuardando(true)
    const resultado = await onGuardar({ nombre, login, contrasena: contrasena || undefined, rol })
    if (!resultado) setGuardando(false)
  }

  return (
    <div className="space-y-5">
      <Entrada
        etiqueta="Nombre completo"
        obligatorio
        placeholder="Juan Pérez García"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        error={errores.nombre}
      />

      <div>
        <Entrada
          etiqueta="Email / Login"
          obligatorio
          type="email"
          placeholder="juan@empresa.com"
          value={login}
          onChange={e => setLogin(e.target.value)}
          error={errores.login}
          iconoDerecha={
            loginDisponible !== null
              ? loginDisponible
                ? <CheckCircle className="h-4 w-4 text-green-500" />
                : <XCircle className="h-4 w-4 text-red-500" />
              : undefined
          }
        />
        {loginDisponible === true && (
          <p className="text-xs text-green-600 mt-1">✓ Login disponible</p>
        )}
      </div>

      <Entrada
        etiqueta={modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}
        obligatorio={!modoEdicion}
        type={mostrarContrasena ? 'text' : 'password'}
        placeholder="••••••••"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        error={errores.contrasena}
        iconoDerecha={mostrarContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        onClickIconoDerecha={() => setMostrarContrasena(!mostrarContrasena)}
      />

      {fortalezaContrasena && (
        <p className={`text-xs font-medium ${coloresFortaleza[fortalezaContrasena]}`}>
          Contraseña: {fortalezaContrasena === 'debil' ? 'Débil' : fortalezaContrasena === 'media' ? 'Media' : 'Fuerte'}
        </p>
      )}

      {contrasena && (
        <Entrada
          etiqueta="Confirmar contraseña"
          obligatorio
          type="password"
          placeholder="••••••••"
          value={confirmarContrasena}
          onChange={e => setConfirmarContrasena(e.target.value)}
          error={errores.confirmar}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {ROLES_USUARIO.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRol(r)}
              className={`
                w-full flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all
                ${rol === r ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className={`h-4 w-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${rol === r ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`} />
              <div>
                <p className="text-sm font-medium text-gray-800">{ETIQUETAS_ROL[r]}</p>
                <p className="text-xs text-gray-500">{DESCRIPCIONES_ROL[r]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Boton variante="primario" onClick={manejarGuardar} cargando={guardando} className="w-full">
        {modoEdicion ? 'Actualizar usuario' : 'Crear usuario'}
      </Boton>
    </div>
  )
}
