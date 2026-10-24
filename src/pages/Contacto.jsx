import { useState } from 'react'
import Field from '../components/Field'
import { emailValido, abrirWhatsApp } from '../utils/helpers'

export default function Contacto() {
  const [f, setF] = useState({ nombre: '', email: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    const err = {}
    if (!f.nombre.trim()) err.nombre = 'Ingresa tu nombre'
    if (!emailValido(f.email)) err.email = 'Ingresa un correo válido, por ejemplo nombre@correo.cl'
    if (!f.mensaje.trim()) err.mensaje = 'Escribe tu mensaje'
    setErrores(err)
    if (Object.keys(err).length) return
    abrirWhatsApp(['Hola Cabañas Huka, les escribo desde el sitio web:', `- Nombre: ${f.nombre}`, `- Correo: ${f.email}`, `- Mensaje: ${f.mensaje}`])
  }

  return (
    <>
      <h2>Contacto</h2>
      <div className="contacto-grid">
        <form onSubmit={enviar} noValidate>
          <Field label="Nombre" id="nombre" error={errores.nombre}>
            <input id="nombre" name="nombre" value={f.nombre} onChange={set} />
          </Field>
          <Field label="Correo electrónico" id="email" error={errores.email}>
            <input id="email" name="email" type="email" value={f.email} onChange={set} />
          </Field>
          <Field label="Mensaje" id="mensaje" error={errores.mensaje}>
            <textarea id="mensaje" name="mensaje" rows="5" value={f.mensaje} onChange={set} />
          </Field>
          <button type="submit" className="btn">Enviar por WhatsApp</button>
        </form>
        <iframe
          title="Mapa de Cabañas Huka en Pucón"
          className="mapa"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49148.24358693761!2d-71.998492!3d-39.278385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96147ea41a293633%3A0x280e2124eebe1cb!2zUHVjw7NuLCBBcmF1Y2Fuw6lh!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
        />
      </div>
      <p><strong>WhatsApp:</strong> +56 9 8180 0828</p>
    </>
  )
}
