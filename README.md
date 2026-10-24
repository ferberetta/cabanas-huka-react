# Cabañas Huka (React + Vite)

Sitio web de Cabañas Huka, en Pucón. Permite ver las cabañas, iniciar sesión, solicitar una reserva (que se envía por WhatsApp con el total calculado) y administrar las cabañas desde un panel.

## Tecnologías

- React 18 y React Router 6
- Vite 7
- Bootstrap 5 (tarjetas y cuadrícula en las cabañas del inicio)
- Vitest + Playwright (Chromium) + Testing Library para las pruebas

## Instalación y ejecución

Requisitos: Node.js 20.19 o superior.

    npm install
    npx playwright install chromium
    npm run dev

El sitio queda en http://localhost:5173

Para generar la versión final: `npm run build` (queda en `/dist`).

## Cómo probar el proyecto

    npm run test:run

Ejecuta las pruebas en un Chromium real y muestra el resultado en la terminal. Hoy hay 16 pruebas en 3 archivos:

| Archivo | Pruebas | Qué verifica |
| --- | --- | --- |
| `src/utils/helpers.browser.test.js` | 4 | Validación de correo y formato de precios |
| `src/pages/Login.browser.test.jsx` | 7 | Formulario, escritura, sesión en localStorage, errores, acceso de administrador y pestaña de registro |
| `src/components/CabinCard.browser.test.jsx` | 5 | Props, reutilización del componente, enlaces y mensaje en consola |

## Cómo usar el sitio

- **Cliente:** entra a *Reservar*, inicia sesión con cualquier correo y contraseña, completa el formulario y revisa el total antes de enviar la solicitud por WhatsApp.
- **Administrador:** inicia sesión con un correo que termine en `@huka.com` para entrar al panel y crear, editar o eliminar cabañas.

El inicio de sesión es simulado: guarda los datos en el navegador (localStorage) y no es seguridad real.

## Dónde editar cosas

- Cabañas, precios, fotos y servicios iniciales: `src/data/cabins.js`
- Funciones del CRUD de cabañas: `src/data/cabinsStore.js`
- Número de WhatsApp: `src/utils/helpers.js`
- Colores y estilos: `src/index.css`

## Datos guardados en el navegador (localStorage)

| Clave | Contenido |
| --- | --- |
| `usuarioHuka`, `nombreHuka` | Sesión iniciada |
| `cabanasHuka` | Cabañas del panel de administración |
| `estadoCabanas` | Estado (disponible o reservada) de cada cabaña |
| `reservasHuka` | Reservas enviadas |
