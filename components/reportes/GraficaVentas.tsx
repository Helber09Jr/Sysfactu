'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DatoGraficaVentas } from '@/tipos'
import { formatearMoneda } from '@/lib/utilidades/formato'

interface PropiedadesGrafica {
  datos: DatoGraficaVentas[]
  onClickBarra?: (dato: DatoGraficaVentas) => void
}

const TooltipPersonalizado = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-blue-600">{formatearMoneda(payload[0].value)}</p>
        <p className="text-gray-500">{payload[0].payload.transacciones} transacciones</p>
      </div>
    )
  }
  return null
}

export function GraficaVentas({ datos, onClickBarra }: PropiedadesGrafica) {
  if (datos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <p className="text-sm">No hay datos para el período seleccionado</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} onClick={e => e?.activePayload && onClickBarra?.(e.activePayload[0].payload)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `S/.${v}`}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipPersonalizado />} />
          <Bar
            dataKey="total"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
