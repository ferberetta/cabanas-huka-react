export const WHATSAPP = '56981800828'

export const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const clp = (n) => '$' + n.toLocaleString('es-CL')

export const abrirWhatsApp = (lineas) =>
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener')
