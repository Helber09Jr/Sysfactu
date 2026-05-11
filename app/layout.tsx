import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SYSFACTU — WANVENDOR SAC',
  description: 'Sistema de gestión de ventas y facturación electrónica',
}

export default function LayoutRaiz({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
