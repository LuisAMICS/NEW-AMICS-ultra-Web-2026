# Estado y roadmap

## Hecho (v0.1, 13/09/2026)

- Análisis de mercado con fuentes (`docs/analisis-mercado.md`) e identidad de marca (`docs/marca.md`).
- Aplicación completa en Next.js 16 con modo demo sin base de datos externa (PGlite) y modo producción (Postgres + Stripe).
- Flujos verificados con Playwright: búsqueda, reserva completa como artista, alta de espacio y aceptación de solicitud como estudio.
- Bilingüe ES/EN, responsive, accesible por teclado en los componentes principales.

## Siguiente (para lanzar una beta con estudios reales)

1. **Base de datos persistente**: crear un Postgres (Neon/Supabase), `npm run db:push`, quitar el seed de demo y publicar fichas reales.
2. **Stripe**: activar cuenta, claves en Vercel, webhook `/api/stripe/webhook`, onboarding Connect de los estudios; revisar la retención del pago hasta la sesión (hoy Checkout cobra al reservar y transfiere al estudio con *destination charge*).
3. **Subida de fotos** (hoy por URL o ilustración): Vercel Blob o Cloudinary desde el editor de espacios.
4. **Emails transaccionales** (confirmación, solicitud, cancelación, recordatorio 24 h): Resend o Brevo.
5. **Facturas con IVA** para estudios y artistas (PDF por reserva).
6. **Sincronización de calendarios** (exportar iCal por espacio; importar Google Calendar para bloquear horas).
7. **Verificación de estudios** (documentación, visita o vídeo) y sello «verificado».
8. **Protección de daños**: check-in/check-out fotográfico y fianza opcional con Stripe.
9. **Páginas SEO por ciudad y tipo** («estudio de grabación por horas Madrid»), *sitemap* y datos estructurados.
10. **Pagos LatAm** (Mercado Pago / dLocal) cuando haya oferta en México, Colombia y Argentina.
11. **Panel de administración** (moderación de fichas y reseñas, disputas, métricas).
12. **App móvil** (PWA primero: manifest, instalación, notificaciones push).

## Deuda técnica conocida

- El modo demo se reinicia en cada despliegue o arranque de instancia (por diseño).
- Las reseñas del anfitrión al artista no están implementadas (solo artista → estudio).
- No hay límite de intentos en el login ni verificación de email.
- El editor de espacios guarda todo en una página; falta autoguardado y previsualización en vivo.
