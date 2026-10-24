import { cabins } from '../data/cabins'
import Slider from '../components/Slider'
import CabinCard from '../components/CabinCard'
import Chatbot from '../components/Chatbot'

export default function Home() {
  const slides = cabins.map((c) => ({ image: c.image, caption: c.name }))
  return (
    <>
      <section className="hero">
        <h2>Tu refugio soñado en medio de la naturaleza</h2>
        <p>Disfruta de la comodidad, tranquilidad y paisajes únicos que Cabañas Huka tiene para ti.</p>
      </section>
      <Slider slides={slides} />
      <div className="row g-4">
        {cabins.map((c) => (
          <div key={c.id} className="col-12 col-md-6 col-lg-4">
            <CabinCard cabin={c} />
          </div>
        ))}
      </div>
      <section className="media-box" style={{ marginTop: 20 }}>
        <h3>¿Tienes dudas?</h3>
        <Chatbot />
      </section>
    </>
  )
}
