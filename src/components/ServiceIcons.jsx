import { SERVICES } from '../data/cabins'

export default function ServiceIcons({ keys = Object.keys(SERVICES) }) {
  return (
    <ul className="servicios">
      {keys.map((k) => (
        <li key={k}><span aria-hidden="true">{SERVICES[k].icon}</span> {SERVICES[k].label}</li>
      ))}
    </ul>
  )
}
