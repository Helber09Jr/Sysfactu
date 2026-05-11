import { ReactNode } from 'react'
import { BarraSuperior } from './BarraSuperior'
import { BarraLateral } from './BarraLateral'
import { RolUsuario } from '@/tipos'

interface PropiedadesPlantilla {
  children: ReactNode
  nombreUsuario: string
  rol: RolUsuario
}

export function PlantillaPrincipal({ children, nombreUsuario, rol }: PropiedadesPlantilla) {
  return (
    <div className="flex h-screen bg-gray-50">
      <BarraLateral rol={rol} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <BarraSuperior nombreUsuario={nombreUsuario} rol={rol} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
