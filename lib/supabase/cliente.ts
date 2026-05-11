import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Cliente para componentes del lado del cliente
export const crearClienteSupabase = () => createClientComponentClient()

// Cliente para componentes del lado del servidor
export const crearClienteServidor = () =>
  createServerComponentClient({ cookies })
