'use client'
import { useState, useCallback } from 'react'
import { Usuario, RolUsuario } from '@/tipos'
import { USUARIOS_DEMO } from '@/lib/demo/datos'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_DEMO)
  const [estaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const obtenerUsuarios = useCallback(async () => {}, [])

  const crearUsuario = useCallback(async (datos: {
    nombre: string; login: string; contrasena: string; rol: RolUsuario
  }): Promise<boolean> => {
    const loginExiste = usuarios.some(u => u.login === datos.login)
    if (loginExiste) { setError('Este login ya está en uso.'); return false }
    const nuevo: Usuario = {
      id: `usr-demo-${Date.now()}`,
      nombre: datos.nombre,
      login: datos.login,
      rol: datos.rol,
      estado: 'activo',
      fechaCreacion: new Date()
    }
    setUsuarios(prev => [...prev, nuevo])
    return true
  }, [usuarios])

  const actualizarUsuario = useCallback(async (id: string, datos: Partial<Usuario>): Promise<boolean> => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...datos } : u))
    return true
  }, [])

  const desactivarUsuario = useCallback(async (id: string): Promise<boolean> => {
    const admins = usuarios.filter(u => u.rol === 'administrador' && u.estado === 'activo')
    const usuario = usuarios.find(u => u.id === id)
    if (usuario?.rol === 'administrador' && admins.length === 1) {
      setError('No se puede desactivar el único administrador del sistema.')
      return false
    }
    return actualizarUsuario(id, { estado: 'inactivo' })
  }, [usuarios, actualizarUsuario])

  const verificarLoginDisponible = useCallback(async (login: string): Promise<boolean> => {
    return !usuarios.some(u => u.login === login)
  }, [usuarios])

  return {
    usuarios, estaCargando, error,
    obtenerUsuarios, crearUsuario, actualizarUsuario,
    desactivarUsuario, verificarLoginDisponible
  }
}
