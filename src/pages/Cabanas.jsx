import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cabins } from '../data/cabins'
import ServiceIcons from '../components/ServiceIcons'
import { clp } from '../utils/helpers'

export default function Cabanas() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  const alReservar = (c) => {
    console.log('Reservar cabaña:', c.name, '| Precio por noche:', clp(c.price), '| Capacidad:', c.capacity)
  }

  return (
    <>
      <h2>Elige tu cabaña ideal</h2>
      {cabins.map((c) => (
        <article key={c.id} id={c.id} className="cabin-detail">
          <img src={c.image} alt={c.name} loading="lazy" />
          <div>
            <h3>{c.name}</h3>
            <p>{c.capacity}</p>
            <p>{c.description}</p>
            <ServiceIcons keys={c.services} />
            <p><strong>{clp(c.price)}</strong> por noche</p>
            <Link to={`/reservar?cabana=${c.id}`} className="btn btn-reservar" onClick={() => alReservar(c)}>Reservar esta cabaña</Link>
          </div>
        </article>
      ))}
    </>
  )
}