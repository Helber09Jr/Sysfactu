'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Usuario, RolUsuario } from '@/tipos'
import { USUARIO_DEMO } from './datos'

interface EstadoSesion {
  usuario: Usuario | null
  cargando: boolean
  iniciarSesion: (usuario: Usuario) => void
  cerrarSesion: () => void
}

const ContextoSesion = createContext<EstadoSesion>({
  usuario: null,
  cargando: true,
  iniciarSesion: () => {},
  cerrarSesion: () => {},
})

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Recuperar sesión guardada en localStorage
    try {
      const sesionGuardada = localStorage.getItem('sysfactu_demo_usuario')
      if (sesionGuardada) {
        setUsuario(JSON.parse(sesionGuardada))
      }
    } catch {}
    setCargando(false)
  }, [])

  const iniciarSesion = (usr: Usuario) => {
    setUsuario(usr)
    localStorage.setItem('sysfactu_demo_usuario', JSON.stringify(usr))
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem('sysfactu_demo_usuario')
  }

  return (
    <ContextoSesion.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoSesion.Provider>
  )
}

export function useSesion() {
  return useContext(ContextoSesion)
}
