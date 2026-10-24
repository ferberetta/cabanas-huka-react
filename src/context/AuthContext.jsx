import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// Misma clave que el sitio original, así las sesiones existentes siguen funcionando.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('usuarioHuka')
    return email ? { email, nombre: localStorage.getItem('nombreHuka') || '' } : null
  })

  const login = (email, nombre = '') => {
    localStorage.setItem('usuarioHuka', email)
    if (nombre) localStorage.setItem('nombreHuka', nombre)
    setUser({ email, nombre })
  }

  const logout = () => {
    localStorage.removeItem('usuarioHuka')
    localStorage.removeItem('nombreHuka')
    setUser(null)
  }

  const isAdmin = !!user && user.email.endsWith('@huka.com')

  return <AuthContext.Provider value={{ user, isAdmin, login, logout }}>{children}</AuthContext.Provider>
}
