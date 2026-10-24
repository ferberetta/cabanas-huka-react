import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Field from '../components/Field'
import { emailValido } from '../utils/helpers'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [f, setF] = useState({ nombre: '', email: '', pass: '' })
  const [error, setError] = useState('')
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value })

  const cambiarTab = (t) => { setTab(t); setError('') }

  const enviar = (e) => {
    e.preventDefault()
    const email = f.email.trim().toLowerCase()
    if (tab === 'registro' && !f.nombre.trim()) return setError('Ingresa tu nombre.')
    if (!email || !f.pass.trim()) return setError('Completa todos los campos.')
    if (!emailValido(email)) return setError('Ingresa un correo válido.')
    login(email, tab === 'registro' ? f.nombre.trim() : '')
    navigate(email.endsWith('@huka.com') ? '/admin' : '/')
  }

  return (
    <div className="login-card">
      <h2>Bienvenido</h2>
      <div className="tab-buttons">
        <button type="button" className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => cambiarTab('login')}>Iniciar sesión</button>
        <button type="button" className={`tab-btn ${tab === 'registro' ? 'active' : ''}`} onClick={() => cambiarTab('registro')}>Registrarse</button>
      </div>
      <form onSubmit={enviar} noValidate>
        {tab === 'registro' && (
          <Field label="Nombre completo" id="nombre">
            <input id="nombre" name="nombre" value={f.nombre} onChange={set} />
          </Field>
        )}
        <Field label="Correo electrónico" id="email">
          <input id="email" name="email" type="email" value={f.email} onChange={set} />
        </Field>
        <Field label="Contraseña" id="pass">
          <input id="pass" name="pass" type="password" value={f.pass} onChange={set} />
        </Field>
        {error && <span className="error-msg" role="alert">{error}</span>}
        <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }}>
          {tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </form>
      <div className="guest-box">
        <p><strong>¿No quieres registrarte?</strong></p>
        <p>Puedes explorar el sitio y reservar como invitado.</p>
        <Link to="/" className="btn">Entrar como invitado</Link>
      </div>
    </div>
  )
}
