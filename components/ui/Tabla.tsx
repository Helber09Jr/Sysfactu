'use client'
import { ReactNode } from 'react'
import { Cargando } from './Cargando'

export interface ColumnaTabla<T> {
  clave: string
  encabezado: string
  renderizar?: (valor: any, fila: T) => ReactNode
  className?: string
}

interface PropiedadesTabla<T> {
  columnas: ColumnaTabla<T>[]
  datos: T[]
  cargando?: boolean
  sinDatos?: string
  keyExtractor?: (item: T, index: number) => string
}

export function Tabla<T extends Record<string, any>>({
  columnas,
  datos,
  cargando = false,
  sinDatos = 'No hay datos disponibles',
  keyExtractor
}: PropiedadesTabla<T>) {
  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <Cargando />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columnas.map(col => (
              <th
                key={col.clave}
                className={`px-4 py-3 font-semibold text-gray-600 ${col.className || ''}`}
              >
                {col.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="text-center py-12 text-gray-400">
                {sinDatos}
              </td>
            </tr>
          ) : (
            datos.map((fila, indice) => (
              <tr
                key={keyExtractor ? keyExtractor(fila, indice) : fila.id || indice}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columnas.map(col => (
                  <td key={col.clave} className={`px-4 py-3 text-gray-700 ${col.className || ''}`}>
                    {col.renderizar ? col.renderizar(fila[col.clave], fila) : fila[col.clave]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
