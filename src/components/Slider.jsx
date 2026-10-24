import { useEffect, useState } from 'react'

export default function Slider({ slides }) {
  const [i, setI] = useState(0)
  const go = (d) => setI((v) => (v + d + slides.length) % slides.length)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => go(1), 5000)
    return () => clearInterval(t)
  }, [i])

  return (
    <section className="slider" aria-roledescription="carrusel" aria-label="Nuestras cabañas">
      <img src={slides[i].image} alt={slides[i].caption} />
      <p className="slider-caption">{slides[i].caption}</p>
      <button type="button" className="slider-btn prev" onClick={() => go(-1)} aria-label="Anterior">‹</button>
      <button type="button" className="slider-btn next" onClick={() => go(1)} aria-label="Siguiente">›</button>
      <div className="slider-dots">
        {slides.map((s, n) => (
          <button key={s.caption} type="button" className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Ir a ${s.caption}`} />
        ))}
      </div>
    </section>
  )
}
