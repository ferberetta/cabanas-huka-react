import { cabins as iniciales } from './cabins'

const KEY = 'cabanasHuka'

// Lee las cabañas guardadas; si no hay nada, usa las de cabins.js
const leer = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(guardado) ? guardado : iniciales
  } catch {
    return iniciales
  }
}

const guardar = (lista) => {
  localStorage.setItem(KEY, JSON.stringify(lista))
  return lista
}

const crearId = (nombre) =>
  nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// READ
export const listar = () => leer()
export const obtener = (id) => leer().find((c) => c.id === id)

// CREATE
export const crear = (cabana) => {
  const lista = leer()
  const id = crearId(cabana.name)
  if (lista.some((c) => c.id === id)) throw new Error('Ya existe una cabaña con ese nombre.')
  return guardar([...lista, { services: [], image: '', description: '', ...cabana, id }])
}

// UPDATE
export const actualizar = (id, cambios) =>
  guardar(leer().map((c) => (c.id === id ? { ...c, ...cambios, id } : c)))

// DELETE
export const eliminar = (id) => guardar(leer().filter((c) => c.id !== id))

// Vuelve a los datos originales de cabins.js
export const restaurar = () => {
  localStorage.removeItem(KEY)
  return iniciales
}