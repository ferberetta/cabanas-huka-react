import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RequireAdmin from './components/RequireAdmin'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Cabanas from './pages/Cabanas'
import Contacto from './pages/Contacto'
import Reservar from './pages/Reservar'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/cabanas" element={<Cabanas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/reservar" element={<RequireAuth><Reservar /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="*" element={<p>Esta página no existe.</p>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}