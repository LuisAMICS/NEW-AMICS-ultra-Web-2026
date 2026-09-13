# Identidad de marca — Kabina

## Nombre

**Kabina.** Del español *cabina*: la cabina de grabación, el espacio donde se graba la toma. Se escribe con **K** para hacerlo registrable y distintivo (como Kavak, Klarna o Kueski), y funciona igual en español, inglés y portugués: corto, pronunciable, con dos sílabas fuertes y sin significado ajeno al sector.

Alternativas descartadas: *Cabina* (dominios ocupados en todas las extensiones), *Roomtone* y *Takeroom* (ocupados), *Trackroom* y *Bookabooth* (libres pero genéricos y solo en inglés), *Studiobnb* (riesgo de marca con Airbnb).

Dominios comprobados el 13/09/2026 (Vercel Domains):

| Dominio | Estado |
| --- | --- |
| kabina.studio | Libre · 21,99 USD/año |
| kabina.io | Libre · 30 USD/año |
| kabina.es | Libre (registrar en un registrador español) |
| kabina.app / kabina.co | Ocupados |

Recomendación: registrar **kabina.studio** como dominio principal y **kabina.es** como redirección. Pendiente: búsqueda de marca en OEPM/EUIPO clase 42 (software) y 35 (intermediación) antes del lanzamiento.

## Tono

Directo, cercano y con oficio. Habla como un técnico de sonido amable, no como una agencia: frases cortas, sin jerga de marketing, precios y condiciones siempre explícitos. Tuteo en español. En inglés, británico neutro.

Claim: **«Tu próxima sesión empieza aquí»** / *Your next session starts here*.
Descriptor: «Estudios de grabación por horas» / *Book recording studios by the hour*.

## Color

La paleta parte de la luz cálida de un estudio de noche: tinta oscura cálida (no negro puro), papel crudo y un acento ámbar que recuerda a la cinta, a los vúmetros y a las lámparas de las salas de control. El rojo se reserva para la luz de «REC», estados de error y cancelaciones.

| Token | Hex | Uso |
| --- | --- | --- |
| `ink-950` | `#0f0e0c` | Fondos oscuros (hero, footer), texto principal, botones «dark» |
| `ink-900 … ink-50` | `#181613 … #f7f4ee` | Escala de grises cálidos para texto secundario, bordes y superficies |
| `paper` | `#faf8f3` | Fondo general de la aplicación |
| `brand-400` | `#f7b32b` | Acento principal: botones primarios, marcas del mapa, logo |
| `brand-300` / `brand-100` | `#ffcd4d` / `#ffefc2` | Texto de acento sobre oscuro, etiquetas suaves |
| `brand-600 / 800` | `#c47d0a` / `#7a4c0c` | Iconos y texto de acento sobre claro |
| `rec` | `#e5484d` | Luz de grabación, errores, cancelaciones |
| `ok` | `#2e9e6b` | Confirmaciones, descuentos, ingresos |
| `info` | `#3b7dd8` | Estados informativos (completada) |

Contraste: el ámbar `brand-400` se usa siempre con texto `ink-950` (ratio 10:1). Sobre fondo oscuro se usa `brand-300` para texto.

## Tipografía

- **Bricolage Grotesque** (variable, eje óptico) para titulares y cifras: tiene carácter editorial y se lee bien en móvil a tamaños grandes. Peso 700, tracking negativo.
- **Inter** (variable) para interfaz y texto de lectura. Activadas las alternativas `cv11`, `ss01`, `ss03`.

Ambas se sirven desde el propio proyecto (paquetes `@fontsource-variable`), sin dependencias de Google Fonts en tiempo de ejecución.

## Logo

Símbolo: un cuadrado redondeado (la cabina) con tres barras de nivel ámbar y un punto rojo de «REC» en la esquina. Wordmark «kabina» en Bricolage Grotesque 700, minúsculas, tracking -0.02em.

- Versión positiva: símbolo tinta con barras ámbar; wordmark tinta.
- Versión sobre oscuro: símbolo ámbar con barras tinta; wordmark blanco.
- Favicon: solo el símbolo (`src/app/icon.svg`).
- Imagen social (Open Graph): generada en tiempo de ejecución en `src/app/opengraph-image.tsx`.

El componente vive en `src/components/logo.tsx`.

## Ilustraciones

Mientras los estudios no suban fotos propias, las fichas usan **portadas ilustradas** generadas por código (`scripts/gen-covers.mjs`): cuatro escenas (sala de control, cabina de voz, sala de directo, lounge de podcast) en seis paletas. Estilo plano, luz cálida y detalles reconocibles (consola, monitores, micrófono con antipop, batería, letrero *on air*). Son SVG ligeros y se pueden regenerar con `npm run covers`.

## Componentes y radio

Cards y paneles con radio 24 px (`rounded-3xl`), botones 12 px, chips en píldora. Sombras suaves y cálidas (`shadow-card`, `shadow-float`). Los estados «reserva inmediata» usan una etiqueta oscura con el rayo en ámbar; el descuento de hora valle usa la etiqueta ámbar suave.
