import type { Metadata } from 'next'
import './globals.css'
import { ProveedorSesion } from '@/lib/demo/ContextoDemo'

export const metadata: Metadata = {
  title: 'SYSFACTU — WANVENDOR SAC',
  description: 'Sistema de gestión de ventas y facturación electrónica',
}

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ProveedorSesion>
          {children}
        </ProveedorSesion>
      </body>
    </html>
  )
}
