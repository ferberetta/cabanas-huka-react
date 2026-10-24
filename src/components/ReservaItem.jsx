import { clp } from '../utils/helpers'

export default function ReservaItem({ reserva, onBorrar }) {
  return (
    <li>
      <strong>{reserva.cabana}</strong> · {reserva.checkin} al {reserva.checkout} ({reserva.noches} noches, {reserva.personas} personas) · {clp(reserva.total)}{' '}
      <button type="button" onClick={() => onBorrar(reserva.id)}>Borrar</button>
    </li>
  )
}