import ServiceIcons from '../components/ServiceIcons'

export default function Nosotros() {
  return (
    <>
      <h2>Nosotros</h2>
      <div className="media-container">
        <div className="media-box">
          <video controls playsInline preload="metadata" className="chat-video">
            <source src={`${import.meta.env.BASE_URL}cabana.mp4`} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
        </div>
        <div className="media-box">
          <h3>Cabañas Huka, Pucón</h3>
          <p>Disfruta de la comodidad, la tranquilidad y los paisajes únicos de la Región de La Araucanía, en cabañas equipadas para descansar en familia o con amigos.</p>
        </div>
      </div>
      <h3>Servicios</h3>
      <ServiceIcons />
    </>
  )
}
