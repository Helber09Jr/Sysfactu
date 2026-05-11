import { FormularioLogin } from '@/components/auth/FormularioLogin'
import { Building2 } from 'lucide-react'

export default function PaginaLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-white rounded-2xl shadow-lg mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">SYSFACTU</h1>
          <p className="text-blue-200 text-sm mt-1">WANVENDOR SAC</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-500 text-sm mt-1">Ingrese sus credenciales para continuar</p>
          </div>
          <FormularioLogin />
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          © 2026 WANVENDOR SAC — Sistema de Facturación Electrónica
        </p>
      </div>
    </div>
  )
}
