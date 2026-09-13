# Kabina — marketplace de estudios de grabación por horas

Kabina es un marketplace tipo Airbnb para **estudios de grabación, salas de mezcla, locales de ensayo, sets de podcast y cabinas de locución**. Los artistas buscan por ciudad, fecha, tipo de sala y equipo, reservan por horas con precio cerrado y pagan de forma segura; los estudios publican sus salas, gestionan disponibilidad, solicitudes y cobros.

Proyecto de Amics Consulting Group. Documentación de producto en [`docs/`](docs/):

- [`docs/analisis-mercado.md`](docs/analisis-mercado.md): competidores, tarifas, quejas de usuarios y oportunidades.
- [`docs/marca.md`](docs/marca.md): identidad visual (nombre, paleta, tipografía, logo).
- [`docs/roadmap.md`](docs/roadmap.md): estado actual y siguientes pasos.

## Qué incluye

| Área | Funcionalidad |
| --- | --- |
| Descubrimiento | Landing, búsqueda por ciudad/fecha/horas/tipo/precio/servicios, mapa (Leaflet + CARTO), ordenación, favoritos |
| Ficha de estudio | Galería, equipo por categorías (mesa, monitores, micros, previos, DAW, backline), servicios, horario, normas, política de cancelación, mapa, reseñas con subnotas, estudios similares |
| Reserva | Calendario con disponibilidad real, selector de horas, extras (técnico, backline…), descuento de hora valle, desglose de precio, reserva inmediata o solicitud, confirmación con código |
| Pagos | Modo demo sin cobro; con claves de Stripe: Checkout + Connect (destination charges, comisión del 12 % para la plataforma) y webhook |
| Área de artista | Reservas (próximas/anteriores), cancelación con reembolso según política, reseñas, favoritos, mensajería con el estudio, perfil |
| Panel de estudio | Alta/edición de espacios (9 pasos en una página), publicar/pausar, solicitudes (aceptar/rechazar), calendario con bloqueo de días, ingresos, cobros con Stripe Connect |
| Plataforma | Español e inglés, autenticación propia (scrypt + sesiones en BD), cuentas demo, páginas legales, SEO básico (metadatos, Open Graph) |

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack) · React 19 · TypeScript
- **Tailwind CSS 4** con tokens de marca propios · lucide-react · Bricolage Grotesque + Inter (self-hosted)
- **Drizzle ORM** sobre Postgres. Sin `DATABASE_URL` usa **PGlite** (Postgres en memoria) con datos de ejemplo: la demo funciona sin configurar nada.
- **Stripe** (opcional) para pagos reales · **Leaflet** para mapas · **Playwright** para pruebas end-to-end

## Empezar

```bash
npm install
npm run dev          # http://localhost:3000 en modo demo
```

Cuentas demo (también accesibles con un botón en `/login`):

| Rol | Email | Contraseña |
| --- | --- | --- |
| Artista | artista@kabina.demo | kabina2026 |
| Estudio | estudio@kabina.demo | kabina2026 |

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` / `npm run build` / `npm start` | Desarrollo, build y servidor de producción |
| `npm run typecheck` · `npm run lint` | Comprobación de tipos y ESLint |
| `npm run test:e2e` | Pruebas Playwright (arranca el servidor de desarrollo si hace falta) |
| `npm run db:generate` | Genera la migración SQL desde `src/db/schema.ts` y la incrusta para el modo demo |
| `npm run db:push` · `npm run db:seed` | Crea el esquema en tu Postgres y carga los estudios de ejemplo |
| `npm run covers` | Regenera las ilustraciones de portada (`public/covers`) |

## Producción

1. Crea un Postgres (Neon, Supabase, Vercel Postgres…) y define `DATABASE_URL`.
2. `npm run db:push && npm run db:seed` (el seed es opcional).
3. Opcional: `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` con el webhook apuntando a `/api/stripe/webhook`.
4. Despliega en Vercel con `kabina/` como *Root Directory*. Sin variables de entorno el despliegue queda en modo demo.

Ver [`.env.example`](.env.example).

## Estructura

```
src/app            rutas (App Router) y server actions (src/app/actions)
src/components     UI, búsqueda, ficha, reserva, panel de estudio
src/db             esquema Drizzle, cliente (Postgres o PGlite), seed
src/lib            i18n, auth, precios, disponibilidad, utilidades
scripts            generación de portadas, seed para Postgres, capturas
tests              pruebas end-to-end (Playwright)
docs               análisis de mercado, marca, roadmap
```
