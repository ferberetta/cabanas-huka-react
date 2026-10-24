// Las URLs de imagen son las de tu sitio original (enlaces externos que pueden dejar de funcionar).
// Lo ideal es guardar fotos propias en /public/img y usar image: '/img/roble.jpg'.
// Los precios son de ejemplo: reemplázalos por los reales.
export const SERVICES = {
  wifi: { icon: '📶', label: 'WiFi' },
  tv: { icon: '📺', label: 'TV' },
  cocina: { icon: '🍳', label: 'Cocina completa' },
  chimenea: { icon: '🔥', label: 'Chimenea' },
  tinaja: { icon: '♨️', label: 'Tinaja caliente' },
  parrilla: { icon: '🥩', label: 'Parrilla' },
  estacionamiento: { icon: '🚗', label: 'Estacionamiento' },
}

export const cabins = [
  {
    id: 'roble',
    name: 'Cabaña Roble',
    capacity: '2 a 4 personas',
    maxGuests: 4,
    price: 60000,
    description: 'Equipada con chimenea, cocina completa y vista panorámica al bosque.',
    services: ['wifi', 'tv', 'chimenea', 'cocina'],
    image: 'https://images.trvl-media.com/lodging/10000000/9410000/9403000/9402924/0d5d05c4.jpg?impolicy=fcrop&w=578&h=578',
  },
  {
    id: 'araucaria',
    name: 'Cabaña Araucaria',
    capacity: '4 a 6 personas',
    maxGuests: 6,
    price: 85000,
    description: 'Incluye tinaja de agua caliente privada, terraza espaciosa y parrilla.',
    services: ['wifi', 'tv', 'tinaja', 'parrilla'],
    image: 'https://www.monteverdepucon.cl/wp-content/uploads/2019/01/Caban%CC%83a-3-dormitorios-4-o-5-hue%CC%81spedes-Monte-Verde-Puco%CC%81n-1-1.jpg',
  },
  {
    id: 'arrayan',
    name: 'Cabaña Arrayán',
    capacity: 'Familia grande, hasta 8 personas',
    maxGuests: 8,
    price: 120000,
    description: 'Dos pisos, 3 dormitorios, estacionamiento privado y acceso directo al río.',
    services: ['wifi', 'tv', 'cocina', 'estacionamiento'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3tkGqb2hIK-qRfpOx8dC0Vh4Uk0qcPUumFzOrizFzlWJyrU27PIqNnord&s=10',
  },
]
