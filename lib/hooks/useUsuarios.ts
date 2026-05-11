'use client'
import { useState, useEffect, useCallback } from 'react'
import { crearClienteSupabase } from '@/lib/supabase/cliente'
import { Usuario, RolUsuario } from '@/tipos'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [estaCargando, setEstaCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = crearClienteSupabase()

  const obtenerUsuarios = useCallback(async () => {
    setEstaCargando(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nombre')
      if (error) throw error
      setUsuarios((data || []).map((u: any) => ({
        id: u.id,
        nombre: u.nombre,
        login: u.login,
        rol: u.rol as RolUsuario,
        estado: u.estado,
        fechaCreacion: new Date(u.creado_en),
        supabaseUserId: u.supabase_user_id
      })))
    } catch {
      setError('Error al cargar los usuarios.')
    } finally {
      setEstaCargando(false)
    }
  }, [supabase])

  useEffect(() => {
    obtenerUsuarios()
  }, [obtenerUsuarios])

  const crearUsuario = useCallback(async (datos: {
    nombre: string
    login: string
    contrasena: string
    rol: RolUsuario
  }): Promise<boolean> => {
    setEstaCargando(true)
    setError(null)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: datos.login,
        password: datos.contrasena
      })
      if (authError) throw authError

      const { error: dbError } = await supabase.from('usuarios').insert({
        nombre: datos.nombre,
        login: datos.login,
        rol: datos.rol,
        estado: 'activo',
        supabase_user_id: authData.user?.id
      })
      if (dbError) throw dbError

      await obtenerUsuarios()
      return true
    } catch (err: any) {
      setError(err.message || 'Error al crear el usuario.')
      return false
    } finally {
      setEstaCargando(false)
    }
  }, [supabase, obtenerUsuarios])

  const actualizarUsuario = useCallback(async (id: string, datos: Partial<Usuario>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('usuarios').update({
        nombre: datos.nombre,
        rol: datos.rol,
        estado: datos.estado
      }).eq('id', id)
      if (error) throw error
      await obtenerUsuarios()
      return true
    } catch {
      setError('Error al actualizar el usuario.')
      return false
    }
  }, [supabase, obtenerUsuarios])

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
    const { data } = await supabase.from('usuarios').select('id').eq('login', login).single()
    return !data
  }, [supabase])

  return {
    usuarios,
    estaCargando,
    error,
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    desactivarUsuario,
    verificarLoginDisponible
  }
}
