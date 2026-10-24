import { Link } from 'react-router-dom'
import { clp } from '../utils/helpers'

export default function CabinCard({ cabin }) {
  const alReservar = () => {
    console.log('Reservar cabaña:', cabin.name, '| Precio por noche:', clp(cabin.price), '| Capacidad:', cabin.capacity)
  }

  return (
    <article className="card h-100 shadow-sm">
      <img
        src={cabin.image}
        alt={cabin.name}
        loading="lazy"
        className="card-img-top"
        style={{ height: 200, objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{cabin.name}</h3>
        <p className="card-text mb-1">{cabin.capacity}</p>
        <p className="card-text"><strong>{clp(cabin.price)}</strong> por noche</p>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/cabanas#${cabin.id}`} className="btn btn-outline-secondary">Ver</Link>
          <Link to={`/reservar?cabana=${cabin.id}`} className="btn btn-reservar" onClick={alReservar}>Reservar</Link>
        </div>
      </div>
    </article>
  )
}