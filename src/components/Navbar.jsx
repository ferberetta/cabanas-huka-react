import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    logout()
    navigate('/login')
  }

  return (
    <header>
      <Link to="/" className="logo-link">
        <img src={`${import.meta.env.BASE_URL}logo_Huka.png`} alt="Cabañas Huka, ir al inicio" className="logo" />
      </Link>
      <nav>
        <ul>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/cabanas">Cabañas</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
          <li><NavLink to="/reservar">Reservar</NavLink></li>
          {isAdmin && <li><NavLink to="/admin">Admin</NavLink></li>}
          <li>
            {user
              ? <button type="button" className="link-btn" onClick={salir}>Cerrar sesión</button>
              : <NavLink to="/login">Ingresar</NavLink>}
          </li>
        </ul>
      </nav>
    </header>
  )
}
