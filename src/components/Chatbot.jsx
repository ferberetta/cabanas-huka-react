import { useEffect, useRef, useState } from 'react'

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const TEMAS = [
  {
    id: 'saludo',
    claves: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey'],
    resp: ['¡Hola! 🌲 Soy el asistente de Cabañas Huka. ¿En qué te puedo ayudar?'],
  },
  {
    id: 'gracias',
    claves: ['gracias', 'muchas gracias', 'genial', 'perfecto', 'excelente'],
    resp: ['¡De nada! 😊 Si necesitas algo más, aquí estoy.'],
  },
  {
    id: 'chao',
    claves: ['chao', 'adios', 'hasta luego', 'nos vemos'],
    resp: ['¡Hasta pronto! Esperamos recibirte en Pucón 🌋'],
  },
  {
    id: 'precio',
    claves: ['precio', 'valor', 'cuanto cuesta', 'cuanto sale', 'tarifa', 'costo', 'cotizar', 'cotizacion'],
    resp: ['Los valores dependen de la fecha y la cantidad de personas. Puedes cotizar en la sección "Reservar" o escribirnos por WhatsApp al +56 9 8180 0828.'],
  },
  {
    id: 'reserva',
    claves: ['reserva', 'reservar', 'disponibilidad', 'disponible', 'fechas', 'agendar'],
    resp: ['Para reservar entra a la sección "Reservar" del menú superior. Para confirmar disponibilidad también puedes escribirnos por WhatsApp.'],
  },
  {
    id: 'ubicacion',
    claves: ['ubicacion', 'donde', 'llegar', 'direccion', 'mapa', 'como llego', 'pucon'],
    resp: ['Estamos en Pucón, Región de La Araucanía. En la sección "Contacto" encontrarás el mapa con la ubicación exacta.'],
  },
  {
    id: 'contacto',
    claves: ['contacto', 'telefono', 'whatsapp', 'llamar', 'numero', 'correo', 'email'],
    resp: ['Escríbenos por WhatsApp al +56 9 8180 0828 o desde la sección "Contacto".'],
  },
  {
    id: 'cabanas',
    claves: ['cabana', 'cabanas', 'alojamiento', 'capacidad', 'personas', 'habitacion', 'dormitorio', 'tinaja'],
    resp: ['Nuestras cabañas están pensadas para descansar en medio de la naturaleza. Puedes ver los tipos y capacidades en la sección de cabañas del sitio.'],
  },
  {
    id: 'mascotas',
    claves: ['mascota', 'mascotas', 'perro', 'gato', 'pet'],
    resp: ['Sobre mascotas, te recomendamos confirmar directamente por WhatsApp para asegurar la política vigente.'],
  },
  {
    id: 'checkin',
    claves: ['check in', 'checkin', 'check out', 'checkout', 'horario', 'hora de llegada', 'hora de salida'],
    resp: ['Los horarios de check-in y check-out los coordinamos con cada reserva. Consúltanos por WhatsApp para confirmarlos.'],
  },
  {
    id: 'actividades',
    claves: ['actividad', 'actividades', 'hacer', 'volcan', 'termas', 'rafting', 'turismo', 'visitar'],
    resp: ['Pucón tiene mucho para hacer: volcán Villarrica, termas, rafting, lagos y senderos. Estamos muy bien ubicados para recorrerlo todo 🌋'],
  },
]

const DEFECTO = 'No estoy seguro de haber entendido 🤔. Puedo ayudarte con precios, reservas, ubicación o actividades en Pucón. Si prefieres, escríbenos por WhatsApp al +56 9 8180 0828.'

const SUGERENCIAS = ['¿Cuánto cuesta?', '¿Dónde están?', '¿Cómo reservo?', '¿Qué hacer en Pucón?']

// ⚠️ Reemplaza por los datos reales de Cabañas Huka
const CABANAS = [
  { nombre: 'Cabaña para 2 personas', capacidad: 2, precioNoche: 60000 },
  { nombre: 'Cabaña para 4 personas', capacidad: 4, precioNoche: 90000 },
  { nombre: 'Cabaña para 6 personas', capacidad: 6, precioNoche: 120000 },
]

const QUIERE_COTIZAR = /cotiz|cuanto (cuesta|sale|seria|pagar|es)|total|presupuesto|precio|valor|tarifa|costo/

const clp = (n) => '$' + n.toLocaleString('es-CL')

function extraer(t) {
  const n = t.match(/(\d+)\s*noche/)
  const p = t.match(/(\d+)\s*(persona|pax|adulto|huesped)/)
  return { noches: n ? +n[1] : null, personas: p ? +p[1] : null }
}

function cotizar(t, cot) {
  const ext = extraer(t)
  let noches = ext.noches ?? cot?.noches ?? null
  let personas = ext.personas ?? cot?.personas ?? null

  // Si el usuario responde solo con un número ("3"), se asigna al dato que falta
  const solo = t.match(/^\s*(\d+)\s*$/)
  if (solo) {
    if (!noches) noches = +solo[1]
    else if (!personas) personas = +solo[1]
  }

  if (!noches) return { texto: '¡Claro! Te calculo el total 🧮 ¿Cuántas noches se quedarían?', cot: { noches, personas } }
  if (!personas) return { texto: `Perfecto, ${noches} noche${noches > 1 ? 's' : ''}. ¿Cuántas personas serían?`, cot: { noches, personas } }

  if (noches < 1 || noches > 30 || personas < 1) {
    return { texto: 'Esos datos no me cuadran 🤔. ¿Cuántas noches serían? (entre 1 y 30)', cot: { noches: null, personas } }
  }

  const cab = CABANAS.find((c) => personas <= c.capacidad)
  if (!cab) {
    const max = CABANAS[CABANAS.length - 1].capacidad
    return { texto: `Para más de ${max} personas armamos una cotización especial. Escríbenos por WhatsApp al +56 9 8180 0828 😊`, cot: null }
  }

  const total = cab.precioNoche * noches
  return {
    texto: `Para ${personas} persona${personas > 1 ? 's' : ''} durante ${noches} noche${noches > 1 ? 's' : ''}, te recomiendo la ${cab.nombre.toLowerCase()}.\n${clp(cab.precioNoche)} x ${noches} = TOTAL ${clp(total)}.\nEs un valor referencial: confirma disponibilidad y tarifa final por WhatsApp al +56 9 8180 0828.`,
    cot: null,
  }
}

function responder(texto, ultimoTema, cot) {
  const t = norm(texto)

  if (cot && /cancelar|dejalo|no quiero/.test(t)) {
    return { texto: 'Listo, cancelé la cotización. ¿Te ayudo con algo más?', tema: ultimoTema, cot: null }
  }
  if (cot || QUIERE_COTIZAR.test(t)) {
    return { ...cotizar(t, cot), tema: 'precio' }
  }

  // Puntaje por tema: cuántas palabras clave aparecen
  let mejor = null
  let max = 0
  for (const tema of TEMAS) {
    const puntos = tema.claves.filter((c) => t.includes(c)).length
    if (puntos > max) { max = puntos; mejor = tema }
  }

  // Seguimiento corto como "¿y eso cuánto cuesta?" -> usa el tema anterior
  if (!mejor && ultimoTema && t.split(' ').length <= 5) {
    mejor = TEMAS.find((x) => x.id === ultimoTema)
  }

  if (!mejor) return { texto: DEFECTO, tema: ultimoTema, cot: null }

  return { texto: mejor.resp[Math.floor(Math.random() * mejor.resp.length)], tema: mejor.id, cot: null }
}

export default function Chatbot() {
  const [msgs, setMsgs] = useState([{ de: 'bot', texto: '¡Hola! 🌲 ¿Tienes dudas sobre ubicación, servicios o reservas en Pucón?' }])
  const [texto, setTexto] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [tema, setTema] = useState(null)
  const [cot, setCot] = useState(null) // cotización en curso
  const fin = useRef(null)

  useEffect(() => { fin.current?.scrollIntoView({ block: 'nearest' }) }, [msgs, escribiendo])

  const enviarTexto = (t) => {
    if (!t.trim() || escribiendo) return
    setMsgs((m) => [...m, { de: 'user', texto: t }])
    setTexto('')
    setEscribiendo(true)

    // Retardo para que la respuesta parezca natural
    setTimeout(() => {
      const r = responder(t, tema, cot)
      setMsgs((m) => [...m, { de: 'bot', texto: r.texto }])
      setTema(r.tema)
      setCot(r.cot ?? null)
      setEscribiendo(false)
    }, 700 + Math.random() * 500)
  }

  const enviar = (e) => {
    e.preventDefault()
    enviarTexto(texto.trim())
  }

  return (
    <div className="chat-box">
      <div className="chat-header">🤖 Asistente virtual Huka</div>
      <div className="chat-messages" aria-live="polite">
        {msgs.map((m, i) => <p key={i} className={m.de === 'bot' ? 'bot-msg' : 'user-msg'}>{m.texto}</p>)}
        {escribiendo && <p className="bot-msg">Escribiendo…</p>}
        <span ref={fin} />
      </div>

      <div className="chat-sugerencias">
        {SUGERENCIAS.map((s) => (
          <button key={s} type="button" onClick={() => enviarTexto(s)} disabled={escribiendo}>{s}</button>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={enviar}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu consulta aquí..." aria-label="Tu consulta" />
        <button type="submit" disabled={escribiendo}>Enviar</button>
      </form>
    </div>
  )
}