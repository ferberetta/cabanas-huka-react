import { useState } from 'react'
import { SERVICES } from '../data/cabins'
import { listar, crear, actualizar, eliminar, restaurar } from '../data/cabinsStore'
import { useAuth } from '../context/AuthContext'
import Field from '../components/Field'
import { clp } from '../utils/helpers'

const KEY = 'estadoCabanas'
const leerEstados = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

const vacio = { name: '', capacity: '', maxGuests: '', price: '', description: '', image: '', services: [] }

export default function Admin() {
  const { user } = useAuth()
  const [cabanas, setCabanas] = useState(listar)
  const [estados, setEstados] = useState(leerEstados)
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null) // id de la cabaña que se edita, o null
  const [errores, setErrores] = useState({})

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleServicio = (s) =>
    setForm({
      ...form,
      services: form.services.includes(s) ? form.services.filter((x) => x !== s) : [...form.services, s],
    })

  const cambiarEstado = (id) => {
    const nuevo = { ...estados, [id]: (estados[id] ?? 'Disponible') === 'Disponible' ? 'Reservada' : 'Disponible' }
    setEstados(nuevo)
    localStorage.setItem(KEY, JSON.stringify(nuevo))
  }

  const validar = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Ingresa un nombre'
    if (!form.capacity.trim()) e.capacity = 'Ej: 2 a 4 personas'
    if (!Number(form.maxGuests) || Number(form.maxGuests) < 1) e.maxGuests = 'Ingresa un número mayor a 0'
    if (!Number(form.price) || Number(form.price) < 1) e.price = 'Ingresa un precio mayor a 0'
    return e
  }

  const limpiar = () => { setForm(vacio); setEditando(null); setErrores({}) }

  const guardar = (ev) => {
    ev.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length) return

    const datos = {
      name: form.name.trim(),
      capacity: form.capacity.trim(),
      maxGuests: Number(form.maxGuests),
      price: Number(form.price),
      description: form.description.trim(),
      image: form.image.trim(),
      services: form.services,
    }
    try {
      const lista = editando ? actualizar(editando, datos) : crear(datos)
      console.log(editando ? 'Cabaña actualizada:' : 'Cabaña creada:', datos)
      setCabanas(lista)
      limpiar()
    } catch (error) {
      setErrores({ name: error.message })
    }
  }

  const editar = (c) => {
    setEditando(c.id)
    setErrores({})
    setForm({
      name: c.name, capacity: c.capacity, maxGuests: String(c.maxGuests), price: String(c.price),
      description: c.description || '', image: c.image || '', services: c.services || [],
    })
  }

  const borrar = (c) => {
    if (!window.confirm(`¿Eliminar ${c.name}?`)) return
    console.log('Cabaña eliminada:', c.name)
    setCabanas(eliminar(c.id))
    if (editando === c.id) limpiar()
  }

  const volverOriginales = () => {
    if (!window.confirm('¿Volver a las cabañas originales? Se perderán los cambios.')) return
    setCabanas(restaurar())
    limpiar()
  }

  return (
    <>
      <h2>Panel de administración</h2>
      <p>Bienvenido/a {user.email}</p>

      <h3>Cabañas</h3>
      <table className="tabla-admin">
        <thead>
          <tr><th>Cabaña</th><th>Estado</th><th>Capacidad</th><th>Precio</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {cabanas.map((c) => {
            const estado = estados[c.id] ?? 'Disponible'
            return (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className={estado === 'Disponible' ? 'ok' : 'no'}>{estado}</td>
                <td>{c.capacity}</td>
                <td>{clp(c.price)}</td>
                <td>
                  <div className="acciones-admin">
                    <button type="button" className="btn" onClick={() => cambiarEstado(c.id)}>Cambiar estado</button>
                    <button type="button" className="btn" onClick={() => editar(c)}>Editar</button>
                    <button type="button" className="btn btn-peligro" onClick={() => borrar(c)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p><button type="button" className="btn" onClick={volverOriginales}>Volver a las cabañas originales</button></p>

      <h3>{editando ? 'Editar cabaña' : 'Agregar cabaña'}</h3>
      <form onSubmit={guardar} noValidate>
        <Field label="Nombre" id="name" error={errores.name}>
          <input id="name" name="name" value={form.name} onChange={set} />
        </Field>
        <Field label="Capacidad (texto)" id="capacity" error={errores.capacity}>
          <input id="capacity" name="capacity" placeholder="2 a 4 personas" value={form.capacity} onChange={set} />
        </Field>
        <Field label="Máximo de huéspedes" id="maxGuests" error={errores.maxGuests}>
          <input id="maxGuests" name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={set} />
        </Field>
        <Field label="Precio por noche (CLP)" id="price" error={errores.price}>
          <input id="price" name="price" type="number" min="1" value={form.price} onChange={set} />
        </Field>
        <Field label="Descripción" id="description">
          <textarea id="description" name="description" value={form.description} onChange={set} />
        </Field>
        <Field label="URL de la imagen" id="image">
          <input id="image" name="image" value={form.image} onChange={set} />
        </Field>
        <fieldset>
          <legend>Servicios</legend>
          {Object.entries(SERVICES).map(([clave, s]) => (
            <label key={clave} style={{ marginRight: 12 }}>
              <input type="checkbox" checked={form.services.includes(clave)} onChange={() => toggleServicio(clave)} /> {s.icon} {s.label}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="btn btn-reservar">{editando ? 'Guardar cambios' : 'Agregar cabaña'}</button>{' '}
        {editando && <button type="button" className="btn" onClick={limpiar}>Cancelar</button>}
      </form>
    </>
  )
}