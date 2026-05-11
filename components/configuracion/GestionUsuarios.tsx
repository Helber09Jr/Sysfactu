'use client'
import { useState } from 'react'
import { Plus, Edit, UserX } from 'lucide-react'
import { Boton } from '@/components/ui/Boton'
import { Tabla, ColumnaTabla } from '@/components/ui/Tabla'
import { Insignia } from '@/components/ui/Insignia'
import { Modal } from '@/components/ui/Modal'
import { FormularioUsuario } from './FormularioUsuario'
import { useUsuarios } from '@/lib/hooks/useUsuarios'
import { Usuario, RolUsuario } from '@/tipos'
import { ETIQUETAS_ROL } from '@/lib/utilidades/constantes'

export function GestionUsuarios() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null)
  const { usuarios, estaCargando, error, crearUsuario, actualizarUsuario, desactivarUsuario, verificarLoginDisponible } = useUsuarios()

  const abrirCrear = () => {
    setUsuarioEditar(null)
    setModalAbierto(true)
  }

  const abrirEditar = (usuario: Usuario) => {
    setUsuarioEditar(usuario)
    setModalAbierto(true)
  }

  const manejarGuardar = async (datos: { nombre: string; login: string; contrasena?: string; rol: RolUsuario }) => {
    let resultado: boolean
    if (usuarioEditar) {
      resultado = await actualizarUsuario(usuarioEditar.id, { nombre: datos.nombre, rol: datos.rol })
    } else {
      resultado = await crearUsuario({ ...datos, contrasena: datos.contrasena! })
    }
    if (resultado) setModalAbierto(false)
    return resultado
  }

  const manejarDesactivar = async (usuario: Usuario) => {
    const confirmar = confirm(`¿Desactivar al usuario "${usuario.nombre}"?`)
    if (confirmar) await desactivarUsuario(usuario.id)
  }

  const columnas: ColumnaTabla<Usuario>[] = [
    {
      clave: 'nombre',
      encabezado: 'Nombre',
      renderizar: (v, fila) => (
        <div>
          <p className="font-medium text-gray-800">{v}</p>
          <p className="text-xs text-gray-400">{fila.login}</p>
        </div>
      )
    },
    {
      clave: 'rol',
      encabezado: 'Rol',
      renderizar: (v) => (
        <Insignia variante="info">{ETIQUETAS_ROL[v as RolUsuario]}</Insignia>
      )
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      renderizar: (v) => (
        <Insignia variante={v === 'activo' ? 'exito' : 'neutral'}>
          {v === 'activo' ? 'Activo' : 'Inactivo'}
        </Insignia>
      )
    },
    {
      clave: 'id',
      encabezado: 'Acciones',
      renderizar: (_, fila) => (
        <div className="flex gap-2">
          <Boton variante="secundario" tamaño="sm" icono={<Edit className="h-3 w-3" />} onClick={() => abrirEditar(fila)}>
            Editar
          </Boton>
          {fila.estado === 'activo' && (
            <Boton variante="peligro" tamaño="sm" icono={<UserX className="h-3 w-3" />} onClick={() => manejarDesactivar(fila)}>
              Desactivar
            </Boton>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800">{usuarios.length} usuario(s) registrados</p>
          <Boton variante="primario" tamaño="sm" icono={<Plus className="h-4 w-4" />} onClick={abrirCrear}>
            Nuevo usuario
          </Boton>
        </div>
        <Tabla
          columnas={columnas}
          datos={usuarios}
          cargando={estaCargando}
          sinDatos="No hay usuarios registrados"
        />
      </div>

      <Modal
        abierto={modalAbierto}
        titulo={usuarioEditar ? 'Editar usuario' : 'Nuevo usuario'}
        onCerrar={() => setModalAbierto(false)}
        tamaño="md"
      >
        <FormularioUsuario
          usuarioInicial={usuarioEditar || undefined}
          onGuardar={manejarGuardar}
          verificarLogin={verificarLoginDisponible}
          modoEdicion={!!usuarioEditar}
        />
      </Modal>
    </>
  )
}
