import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cabins } from '../data/cabins'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import { emailValido, abrirWhatsApp, clp } from '../utils/helpers'
import ReservaItem from '../components/ReservaItem'

const hoy = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const calcNoches = (a, b) => (a && b ? Math.round((new Date(b) - new Date(a)) / 86400000) : 0)

export default function Reservar() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const inicial = cabins.some((c) => c.id === params.get('cabana')) ? params.get('cabana') : cabins[0].id
  const [f, setF] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: '', checkin: '', checkout: '', cabana: inicial, personas: '',
  })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [reservas, setReservas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('reservasHuka')) ?? [] } catch { return [] }
  })
  const guardar = (lista) => {
    setReservas(lista)
    localStorage.setItem('reservasHuka', JSON.stringify(lista))
  }
  const borrar = (id) => guardar(reservas.filter((r) => r.id !== id))
  const mias = reservas.filter((r) => r.email === user?.email)
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value })

  const cabana = cabins.find((c) => c.id === f.cabana)
  const noches = calcNoches(f.checkin, f.checkout)
  const total = noches > 0 ? noches * cabana.price : 0

  const validar = () => {
    const e = {}
    const p = Number(f.personas)
    if (!f.nombre.trim()) e.nombre = 'Ingresa tu nombre'
    if (!emailValido(f.email)) e.email = 'Ingresa un correo válido, por ejemplo nombre@correo.cl'
    if (!/^\d{9}$/.test(f.telefono.trim())) e.telefono = 'Ingresa exactamente 9 números'
    if (!f.checkin || f.checkin < hoy()) e.checkin = 'Elige una fecha desde hoy'
    if (noches < 1) e.checkout = 'La salida debe ser posterior a la llegada'
    if (!p || p < 1) e.personas = 'Ingresa al menos 1 persona'
    else if (p > cabana.maxGuests) e.personas = `${cabana.name} admite hasta ${cabana.maxGuests} personas`
    return e
  }

  const enviar = (ev) => {
    ev.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length) return
    const nueva = {
      id: Date.now(),
      email: user?.email,
      cabana: cabana.name,
      checkin: f.checkin,
      checkout: f.checkout,
      noches,
      personas: f.personas,
      total,
    }
    guardar([...reservas, nueva])
    console.log('Reserva guardada:', nueva)
    abrirWhatsApp([
      'Hola Cabañas Huka, quiero solicitar una reserva:',
      `- Nombre: ${f.nombre}`,
      `- Correo: ${f.email.trim()}`,
      `- Teléfono: +56${f.telefono}`,
      `- Cabaña: ${cabana.name}`,
      `- Llegada: ${f.checkin} / Salida: ${f.checkout} (${noches} noches)`,
      `- Huéspedes: ${f.personas}`,
      `- Total estimado: ${clp(total)}`,
    ])
    setEnviado(true)
  }

  return (
    <>
      <h2>Reservar</h2>
      <form onSubmit={enviar} noValidate>
        <Field label="Nombre completo" id="nombre" error={errores.nombre}>
          <input id="nombre" name="nombre" value={f.nombre} onChange={set} />
        </Field>
        <Field label="Correo electrónico" id="email" error={errores.email}>
          <input id="email" name="email" type="email" value={f.email} onChange={set} />
        </Field>
        <Field label="Teléfono (+56)" id="telefono" error={errores.telefono}>
          <input id="telefono" name="telefono" type="tel" maxLength="9" placeholder="912345678" value={f.telefono} onChange={set} />
        </Field>
        <div className="fila">
          <Field label="Check-in" id="checkin" error={errores.checkin}>
            <input id="checkin" name="checkin" type="date" min={hoy()} value={f.checkin} onChange={set} />
          </Field>
          <Field label="Check-out" id="checkout" error={errores.checkout}>
            <input id="checkout" name="checkout" type="date" min={f.checkin || hoy()} value={f.checkout} onChange={set} />
          </Field>
        </div>
        <Field label="Cabaña" id="cabana">
          <select id="cabana" name="cabana" value={f.cabana} onChange={set}>
            {cabins.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.capacity})</option>)}
          </select>
        </Field>
        <Field label="Cantidad de personas" id="personas" error={errores.personas}>
          <input id="personas" name="personas" type="number" min="1" max={cabana.maxGuests} value={f.personas} onChange={set} />
        </Field>
        <p className="total">
          Total reserva: {clp(total)}
          {noches > 0 && <small> ({noches} {noches === 1 ? 'noche' : 'noches'} × {clp(cabana.price)})</small>}
        </p>
        <button type="submit" className="btn btn-reservar">Reservar</button>
        {enviado && <p className="exito-msg">Abrimos WhatsApp con los datos de tu reserva. Envía el mensaje para confirmarla.</p>}
      </form>
      <h3>Mis reservas</h3>
      {mias.length === 0 ? (
        <p>Aún no tienes reservas guardadas.</p>
      ) : (
        <ul>
          {mias.map((r) => <ReservaItem key={r.id} reserva={r} onBorrar={borrar} />)}
        </ul>
      )}
    </>
  )
}