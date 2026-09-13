# Análisis de mercado — marketplaces de estudios de grabación por horas

*Elaborado el 13 de septiembre de 2026 a partir de unas 95 búsquedas y fuentes públicas. Cada afirmación relevante lleva su fuente; lo que no se pudo verificar se indica.*

## 1. Resumen ejecutivo

1. **Nadie domina la categoría.** El único marketplace específico de estudios que llegó a escala global, **Studiotime** («Airbnb for music studios», 35+ países), fue vendido en 2021 y su comprador lo cerró como plataforma independiente. Antes de eso ya había abandonado la comisión por reserva (los estudios tenían «procesos de facturación complejos») y pasado a una suscripción de unos 20 USD/mes sin comisiones ([Sharetribe](https://www.sharetribe.com/customers/studiotime/), [Studiotime fees](https://www.studiotime.io/fees), [Mike Williams](https://www.iammikewilliams.com/)).
2. **El volumen real está en marketplaces genéricos de espacios por horas.** Peerspace (45.000+ espacios, 7 países, 39,7 M USD levantados) cobra a los anfitriones un **20 %** más una tarifa variable al cliente; Giggster (45.000+ propiedades) cobra **19 %** más tarifa al cliente. Ninguno tiene modelo de datos musical (mesa, micros, backline, técnico) y ambos acumulan quejas por pagos, cancelaciones y soporte ([Peerspace](https://support.peerspace.com/en/articles/10119442-what-is-the-peerspace-service-fee), [Giggster](https://help.giggster.com/en/articles/2832062-how-much-commission-does-giggster-take), [Trustpilot Peerspace](https://www.trustpilot.com/review/peerspace.com), [Trustpilot Giggster](https://www.trustpilot.com/review/www.giggster.com)).
3. **El modelo de inventario propio (Pirate) demuestra la demanda, no la calidad.** Pirate opera 700+ estudios autoservicio 24/7, superó el millón de reservas y declara 40.000+ reservas al mes, pero tiene un **2,9/5 en Trustpilot** (822 reseñas) dominado por equipo roto, y ha cerrado sedes en Cardiff, Hamburgo y Berlín (las alemanas por insolvencia) ([Music Ally](https://musically.com/2022/03/23/pirate-gets-new-funding-after-250k-customers-milestone/), [Groover](https://blog.groover.co/en/interviews/pirate-com-studios-worldwide/), [Trustpilot Pirate](https://www.trustpilot.com/review/pirate.com), [Pirate support](https://support.pirate.com/hc/en-gb/articles/31133706850065-Hamburg-and-Tempelhof-Closures)).
4. **Hay una ola de entrantes musicales pequeños (2021-2025), ninguno dominante:** Stufinder (app EE. UU./CA/UK, 5 % artista + 10 % estudio, quejas de reembolsos), ProStudioTime (Londres, beta cerrada, 130+ estudios pro, concierge), NoisyCamp (Bélgica, 4-9 % al estudio), Tutti (UK, 1.500+ espacios, 10 %, crowdfunding de 300 k£), EngineEars (Los Ángeles, 8,5 M USD, centrado en ingenieros), Music Traveler (Viena, 10 %).
5. **España y Latinoamérica tienen directorios y widgets de reserva por estudio, pero ningún marketplace transaccional y musical con escala.** España: Sounds Market (Barcelona, directorio/app gratuita), Peerspace ES (Madrid, media 47 €/h). México: StereoPass (CDMX, por formulario). Argentina: DondeEnsayo, salaensayo.com, TurnoLink. Chile: Roomband (5.000+ usuarios, quiere expandirse a CO/MX/AR).
6. **La oferta sufre:** en el Reino Unido, con la subida del 25 % de las tasas empresariales, el 50 % de los estudios encuestados por el MPG se planteaba cerrar ([UK Music](https://www.ukmusic.org/policy-campaigns/business-rates/)). Los estudios no pueden repercutir costes; las horas muertas son la palanca que un marketplace puede monetizar (los descuentos de hora valle del 15-30 % son práctica habitual, [BusinessDojo](https://dojobusiness.com/blogs/news/recording-studio-hourly-rates-maximize-revenue)).
7. **Referencias de tarifas para diseñar el modelo:** Airbnb pasa a una única comisión del **15,5 % al anfitrión** sin tarifa al huésped entre septiembre y octubre de 2026 ([Smoobu](https://www.smoobu.com/en/blog/airbnb-host-only-fee-increase/)); Splacer 15 % + 5 %; Tagvenue 0 % cliente / 10-15 % anfitrión; Tutti 10 %; NoisyCamp 4-9 %; Jammed 20 USD/sala/mes sin comisiones.

**Conclusión:** existe hueco para un marketplace **bilingüe (ES/EN), específico de audio**, con esquema de equipo real, extra de técnico, reserva inmediata sobre disponibilidad real, precio cerrado sin tarifa al artista, protección de equipo, rails de pago para Latinoamérica y herramientas para el estudio que reduzcan el incentivo a desintermediar. **Kabina** está diseñado sobre esas conclusiones.

## 2. Competidores

### Studiotime (studiotime.io) — cerrado como plataforma independiente
- Marketplace de estudios musicales «desde home studios hasta los más exclusivos del mundo»; los artistas solicitaban reserva y confirmaban en la plataforma ([how it works](https://www.studiotime.io/how-it-works)).
- Fundado por Mike Williams (Los Ángeles) sobre Sharetribe; rentable «más de cinco años» antes de la venta en 2021 ([Sharetribe](https://www.sharetribe.com/customers/studiotime/), [Founder Institute](https://fi.co/insight/how-this-entrepreneur-built-the-airbnb-for-music-studios-in-one-evening)).
- Modelo: empezó con comisión estilo Airbnb, la bajó y añadió suscripción (desde 20 USD/mes «sin otras comisiones»). Desde el 31/03/2020 dejó de gestionar pagos y eliminó las comisiones por transacción; sus condiciones lo definían como «meramente una plataforma de comunicación» ([fees](https://www.studiotime.io/fees), [ToS](https://www.studiotime.io/terms-of-service)).
- **Pros:** pionero, SEO global, barato para el estudio. **Contras:** sin capa de pago/escrow/confianza tras 2020; solo solicitud; cerrado. **Lección:** la facturación e IVA de los estudios rompe los modelos de comisión ingenuos.

### Peerspace (peerspace.com)
- Marketplace por horas para reuniones, eventos y producciones, incluidos estudios de grabación y podcast. Fundado en 2014 en San Francisco; 39,7 M USD en 9 rondas; 45.000+ espacios en 7 países; páginas en español para Madrid y Barcelona ([Wikipedia](https://en.wikipedia.org/wiki/Peerspace), [Tracxn](https://tracxn.com/d/companies/peerspace/__HPumyuIXIs8rv-aK69A06t8zEBZkj1p8L7B63CvDlPU/funding-and-investors), [Peerspace Madrid](https://www.peerspace.com/es/venues/es/madrid--md/recording-studio)).
- **Tarifas:** 20 % al anfitrión sobre reserva y extras; el cliente paga una tarifa de procesamiento variable (baja con el importe) ([fee](https://support.peerspace.com/en/articles/10119442-what-is-the-peerspace-service-fee), [guest fee](https://support.peerspace.com/en/articles/10119157-what-is-the-peerspace-processing-fee-for-guests)). Ejemplo de un blog de músicos: un estudio de 65 USD/h acaba en 74,75 USD/h más 30-50 USD de tasas por día ([Inside The Industry](https://insidetheindustrycom.wordpress.com/2023/06/21/is-peerspace-worth-it-should-musicians-use-it/)).
- **Reserva:** por horas; el anfitrión elige entre cuatro políticas de cancelación; cancelación gratuita 24 h tras confirmar si faltan ≥48 h ([política](https://www.peerspace.com/legal/terms/cancellation-policy)).
- **Confianza:** responsabilidad civil de 1 M USD; garantía de daños hasta 25.000 USD por reserva; pagos por Stripe/ACH 72 h después de la reserva ([Peace of Mind](https://peaceofmind.peerspace.com/), [payout](https://support.peerspace.com/en/articles/10119435-how-do-i-get-paid-for-a-booking)).
- **Precios de referencia:** Madrid media 47 €/h; L'Hospitalet 36 €/h; Londres ~77 £/h; Los Ángeles «espacio decente» 35-50 USD/h.
- **Quejas:** anfitrión que nunca cobró 65,72 €; espacio cancelado una semana después de reservar; reembolsos «procesados» sin fondos a tiempo; presión para contratar seguro tras pagar; espacios distintos a las fotos; app «buggy» ([Trustpilot](https://www.trustpilot.com/review/peerspace.com), [App Store](https://apps.apple.com/us/app/peerspace-rent-unique-venues/id823879288?see-all=reviews&platform=iphone)). Propietarios de estudios y blogs de músicos recomiendan reservar directo tras la primera sesión ([Creative Studio Hire](https://www.creativestudiohire.com/blog/peerspace-vs-direct-booking)).
- **Pros:** escala, marca, programa de protección, Stripe. **Contras:** taxonomía genérica, ~20 % + tarifa al cliente, desintermediación, fricción de soporte y pagos.

### Giggster (giggster.com)
- Marketplace de localizaciones (cine/foto/eventos) que también lista estudios de grabación con reserva inmediata. Fundado en 2016 en Santa Mónica; 45.000+ propiedades; última ronda nov. 2024 ([CB Insights](https://www.cbinsights.com/company/giggster), [PitchBook](https://pitchbook.com/profiles/company/277223-68)).
- **Tarifas:** 19 % al anfitrión; tarifa de procesamiento variable al cliente ([comisión](https://help.giggster.com/en/articles/2832062-how-much-commission-does-giggster-take)). Cancelación gratuita 24 h si se reservó con ≥48 h; responsabilidad civil 1 M USD; precios por tamaño de grupo (absurdo para una cabina de voz).
- **Pros:** reserva inmediata, seguro, inventario en EE. UU. **Contras:** ADN de rodajes, 19 % + tarifa, centrado en EE. UU.; anfitriones dicen que «las tarifas son bastante altas» ([YourEventKit](https://youreventkit.com/tools/giggster/)).

### Tutti (tutti.space, Reino Unido)
- «Airbnb de espacios creativos», empezó con salas de ensayo. Lanzado en 2018 en Londres por Gabriel Isserlis; 1.500+ espacios; **30+ filtros creativos** (ruido exterior, instrumentos, tipo de suelo, metro cercano) ([Republic](https://europe.republic.com/tutti-space)).
- **Tarifas:** gratis para artistas; **10 %** al espacio por reserva; plan SaaS previsto de 30 £/mes + 4 % ([Tutti help](https://tutti.tawk.help/article/how-much-does-tutti-cost-to-list-a-space)). Reservas por solicitud.
- Ronda de crowdfunding de 300 k£ (dic. 2022) a 1,5 M£ de valoración ([UKTN](https://www.uktech.news/events/tutti-scores-300k-in-crowdfund-20221223)).
- **Pros:** filtros musicales, comisión baja. **Contras:** solo solicitud, capitalización mínima, solo UK.

### Pirate (pirate.com) — red propia de estudios autoservicio 24/7 (no es marketplace)
- Salas de ensayo, grabación, DJ, podcast y baile reservadas online y abiertas con código, sin personal. Nacido en 2014 en Bristol; ~26,7 M USD levantados; 737 estudios en UK, Alemania, EE. UU. e Irlanda (2023); 40.000+ reservas/mes ([TechCrunch](https://techcrunch.com/2018/11/14/pirate-studios/), [Craft](https://craft.co/pirate-studios), [Groover](https://blog.groover.co/en/interviews/pirate-com-studios-worldwide/)).
- **Precios:** ensayo UK desde 5,30-8,90 £/h; grabación Londres 10,50-20 £/h; Nueva York 18,40-23,10 USD/h; hasta 30 % de descuento en reservas de 4 h+ y precios valle/punta ([Pirate](https://pirate.com/en/recording-studios/london/)).
- **Señales de estrés:** cierre de Cardiff (2024); Hamburgo y Berlín-Tempelhof «declarados insolventes y cerrados». Trustpilot 2,9/5: «el equipo está roto y siguen alquilando», cables que faltan, hi-hats «sujetos con cinta», aire acondicionado que no funciona, sangrado de sonido entre salas; elogios al soporte por WhatsApp ([Trustpilot](https://www.trustpilot.com/review/pirate.com?page=3)).
- **Lección:** hay demanda por horas a 5-20 £/h y la tecnología de acceso funciona, pero el modelo de inventario propio es intensivo en capital y frágil en calidad.

### EngineEars (engineears.com)
- Plataforma vertical para encontrar, reservar y pagar ingenieros de audio **y estudios**: reservas, facturación, precios personalizados. Lanzada a finales de 2020 por Derek «MixedByAli» Ali (Los Ángeles); 8,5 M USD levantados (7,5 M en feb. 2024 con Drive Capital, YG, DJ Khaled…) ([MBW](https://www.musicbusinessworldwide.com/audio-engineer-marketplace-engineears-founded-by-grammy-winning-mixedbyali-raises-7-5m/)).
- **Tarifas:** 10 % para miembros gratuitos, 0 % con Platinum (15 USD/mes); membresías de artista 59,99-180 USD/año ([subscription](https://support.engineears.com/en/knowledge-base/subscription)).
- **Pros:** nativo musical, centrado en el ingeniero, bien financiado. **Contras:** muy centrado en hip-hop en EE. UU., inventario de salas opaco, producto disperso (distribución, cursos).

### Otros entrantes recientes
- **Stufinder** (app EE. UU./CA/UK, 2023): 15 % total (5 % artista + 10 % estudio); 400+ estudios; quejas de reembolsos sin respuesta y de «700 USD retenidos» ([Google Play](https://play.google.com/store/apps/details?id=com.stufinder.stu&hl=en_US)).
- **ProStudioTime** (Londres): beta cerrada, 130+ estudios pro en Londres/NY/LA, lista corta curada en 24 h, sin tarifas al usuario ([about](https://www.prostudiotime.com/about-us)).
- **NoisyCamp** (Lieja): disponibilidad en tiempo real; 9/6/4 % según plan ([become a host](https://noisycamp.com/become-a-host)).
- **Music Traveler** (Viena): salas de práctica y ensayo; el mayor de 1 €/h o 10 % ([terms](https://www.musictraveler.co/terms)).
- **SoundBetter** (servicios de mezcla/mastering, 5 % + Premium 59 USD/mes; comprada por Spotify en 2019 y devuelta a sus fundadores en 2021): referencia para el extra de técnico y el pago en garantía.

### España
- **Sounds Market** (Barcelona): app/directorio gratuito para músicos con secciones de locales de ensayo y estudios; no consta que transaccione reservas ([Via Empresa](https://www.viaempresa.cat/es/sounds-market-el-wallapop-de-los-musicos_209341_102.html)).
- **Peerspace ES**: Madrid, media 47 €/h. **Spathios**, **By Moments**: espacios genéricos por horas. Directorios: estudiosdegrabacion.es, IndyRock, Hispasonic.
- Reserva directa con calendario propio en decenas de estudios (Hui Toca en Valencia con acceso 24 h, Navel Art y Locales VK en Madrid, Onda Estudios y HG Sonido en Barcelona, Urbanstart a 16 €/h…). **La oferta está fragmentada y no existe un marketplace transaccional musical.**

### Latinoamérica
- **México:** StereoPass (CDMX) reserva por formulario; tarifas típicas 500-1.000 MXN/h, *lockouts* de 10 h por 4.500-7.500 MXN, podcast desde 550 MXN/h, recargo nocturno del 50 % en IMER.
- **Argentina:** DondeEnsayo (pago al reservar, confirmación inmediata, «pequeño porcentaje» sobre el precio de la sala), salaensayo.com (expandiéndose a Chile), SaaS como TurnoLink y ReservaSimple. Tarifas: grabación 20.000-25.000 ARS/h con técnico; ensayo 12.000-25.000 ARS/h.
- **Colombia:** sin plataforma transaccional encontrada; directorio Rockombia; Ensaya (ensayapp.com) promete buscar y reservar. No se encontraron tarifas de audio publicadas.
- **Chile:** Roomband (5.000+ usuarios, Santiago; planes para Perú, Colombia, México o Argentina) ([El Mostrador](https://www.elmostrador.cl/agenda-pais/agenda-innovacion/2023/10/11/la-plataforma-que-busca-acercar-los-espacios-de-ensayo-y-grabacion-para-la-industria-creativa/)).

### SaaS para estudios (competencia indirecta)
Jammed (20 USD/sala/mes, sin comisiones, extras de equipo y técnico), Skedda (99-199 USD/mes), Podyx (200+ estudios de podcast), Anolla, y usos ad hoc de Calendly/Acuity. Reducen la desintermediación pero no generan demanda.

## 3. Tabla comparativa

| Actor | Modelo | Tarifas | Reserva | Mercados | Fortalezas | Debilidades |
| --- | --- | --- | --- | --- | --- | --- |
| Studiotime (cerrado) | Marketplace musical → suscripción | 20 USD/mes; 0 % desde 2020 | Solicitud, pago fuera | 35+ países | Pionero, SEO | Sin confianza/pagos; cerrado |
| Peerspace | Espacios genéricos por horas | 20 % anfitrión + tarifa cliente | Inmediata/solicitud; 4 políticas; 1 M USD RC; 25 k USD daños | EE. UU. + 7 países (ES, UK) | Escala, protección, Stripe | Genérico, take alto, quejas de pagos |
| Giggster | Localizaciones | 19 % + tarifa cliente | Inmediata; cancelación 24 h; 1 M USD RC | EE. UU. | Inmediata, seguro | ADN de rodajes, tarifas «altas» |
| Tutti | Espacios creativos (+SaaS) | 10 % espacio | Solicitud | UK (1.500+) | Filtros musicales, comisión baja | Solo solicitud, tamaño |
| Pirate | Estudios propios 24/7 | 5-20 £/h retail | Inmediata con código | UK, US, DE, IE (700+) | Demanda probada, acceso | 2,9★, equipo roto, insolvencias |
| EngineEars | Ingenieros + estudios | 10 % o 15 USD/mes | Reserva, depósitos | EE. UU. | Nativo musical, financiado | Inventario opaco |
| Stufinder | App de estudios | 5 % + 10 % | Inmediata en app | US/CA/UK | Móvil, musical | Quejas de reembolsos |
| NoisyCamp | Marketplace + SaaS | 4-9 % | Tiempo real | BE/EU/NY | Tarifas bajas | Tamaño mínimo |
| Sounds Market | Directorio | Gratis (por confirmar) | Contacto | España | Marca entre músicos | No transaccional |
| DondeEnsayo / salaensayo | Salas de ensayo | «pequeño %» | Pago al reservar | Argentina (+Chile) | Inmediata | Local, inflación |
| Roomband | Marketplace creativo | n/d | Online | Chile | Intención LatAm | Solo Santiago |
| Jammed / Skedda / Podyx | SaaS del estudio | 20 USD/sala/mes; 99+ USD/mes | Web propia | UK/US/EU | Evita desintermediación | Sin demanda |

## 4. Tamaño de mercado y tarifas

- **EE. UU.:** IBISWorld cuenta 22.009 empresas de «audio production studios» con ~1.700 M USD de ingresos y crecimiento del 0,7 % anual (2021-2026); una serie alternativa cita 25.267 estudios en 2025 ([IBISWorld](https://www.ibisworld.com/united-states/industry/audio-production-studios/1254/)).
- **Reino Unido:** «unos 500 estudios» según UK Music; el estudio del DCMS de 2021 mapeó 2.482 (1.858 abiertos) con una definición más amplia. Encuesta MPG 2024: tasas +25 %, el 50 % se plantea cerrar, ~250 en riesgo ([DCMS](https://assets.publishing.service.gov.uk/media/610901c88fa8f5042c338d51/DCMS_Studio_Market_Assessment.pdf), [UK Music](https://www.ukmusic.org/policy-campaigns/business-rates/)).
- **España:** 2.447-2.862 empresas en CNAE 5920 (grabación de sonido y edición musical; más amplio que estudios) ([eInforma](https://www.einforma.com/informes-sectoriales/cnae-5920-empresas-actividades-de-grabacion-de-sonido-y-edicion-musical)). No hay recuento solo de estudios.
- **México:** no encontrado; habría que extraerlo del DENUE de INEGI (SCIAN 512290).
- **Global:** no existe un recuento creíble; la cifra de 6.200 M USD (2025) circula desde un proveedor de planes de negocio con metodología poco clara.

| Ciudad | Rango por hora | Fuentes |
| --- | --- | --- |
| Londres | 25-60 £ básico; 60-100 medio; 100-200 alto; autoservicio 10-15 £; media Peerspace ~77 £ | [Finchley](https://www.finchley.co.uk/finchley-learning/visual-podcast/recording-studio-costs-a-full-breakdown-of-2025-pricing), [Peerspace UK](https://www.peerspace.com/uk/resources/hire-recording-studio-cost/) |
| Los Ángeles | 35-150 USD típico; salas pro 70-200+; técnico 25-150 USD/h aparte | [The Room Studios](https://theroomstudios.us/average-cost-of-recording-studio-services/), [RS Santa Monica](https://recordingstudiossantamonica.com/blog/recording-studio-costs-la) |
| Madrid | 45-80 € (estimación); ejemplos 25-34 €/h; media Peerspace 47 €; técnico aparte (150+ €/día) | [Modelos de Plan de Negocios](https://modelosdeplandenegocios.com/blogs/news/analisis-mercado-estudios-grabacion-espana), [Aire Estudio](https://www.aire-estudio.es/tarifas-de-estudio-de-grabacion/) |
| Barcelona | 40-75 € (estimación); desde 12 €/h en salas de producción | [Fixion Wave](https://fixionwave.com/alquiler-de-estudio-de-produccion/) |
| Valencia | 30-60 € (estimación); La Nau Estudi 35 €/h | [La Nau](https://www.lanauestudi.es/tarifas-estudio-de-grabacion/) |
| Ensayo en España | 5-20 €/h; Madrid desde 7,50-8 €/h; 150-300 €/mes | [Sounds Market](https://soundsmarket.com/blog/locales-de-ensayo) |
| Ciudad de México | 500-1.000 MXN/h; lockout 10 h 4.500-7.500 MXN; podcast desde 550 MXN/h | [VICE](https://www.vice.com/es/article/vistazo-a-tres-estudios-en-cdmx-la-bestia-noviembre-sl-studio-2019/), [In House Work](https://inhousework.mx/en/studio/) |
| Buenos Aires | Grabación 20.000-25.000 ARS/h con técnico; ensayo 12.000-25.000 ARS/h | [Estudio 434](https://estudio434.com/), [Belgrano Studio](https://www.belgranostudio.com/salas-de-ensayo/) |
| Podcast (EE. UU.) | 50-150 USD/h habitual; premium 300-500 | [Flexwork](https://flexworkstudios.com/podcast-studio-rental-rates/) |

**Ocupación:** las guías de negocio sitúan la ocupación rentable en 60-80 % y el punto de equilibrio en 65-75 %; las mañanas entre semana y las noches tardías están crónicamente vacías, y se llenan con descuentos del 15-30 % ([BusinessDojo](https://dojobusiness.com/blogs/news/recording-studio-hourly-rates-maximize-revenue)). Un supuesto «30 % de ocupación» en estudios tradicionales no pudo atribuirse a una fuente primaria.

## 5. Tendencias

1. **Los home studios sustituyen; los comerciales se especializan.** Cerca de la mitad de los encuestados por Production Expert (2024) nunca o casi nunca usa un estudio comercial ([Production Expert](https://www.production-expert.com/production-expert-1/are-professional-studios-still-relevant-in-2024-the-results)).
2. **Podcast y videopodcast.** Ingresos publicitarios de podcast en EE. UU.: 2.400 M USD (2024, +26 %), 2.860 M (2025) y camino de los 3.000 M ([IAB](https://www.iab.com/insights/us-podcast-advertising-revenue-study-2024/)). Los creadores necesitan salas preparadas para vídeo por horas.
3. **Autoservicio 24/7.** Las 40.000 reservas/mes de Pirate validan salas sin personal a 5-20 £/h; estudios independientes españoles lo replican (Hui Toca, Navel Art, Locales VK). El control de calidad es el punto de fallo.
4. **Economía de creadores:** ~200-250.000 M USD (2024-2025).
5. **IA y equipo barato** empujan a los estudios profesionales hacia la especialización (acústica, talento, audio inmersivo).
6. **Cierres y presión de costes:** crisis de tasas en UK (petición MPG/UK Music, dic. 2025); insolvencias de Pirate en Alemania.
7. **Escasez de salas de ensayo** (MVT: 67 % de los músicos tienen dificultades para encontrar espacio asequible; fuente primaria no verificada).
8. **Normalización de tarifas:** el paso de Airbnb a una comisión única al anfitrión marca la nueva base de experiencia: sin tarifa al cliente.

## 6. Referencias de tarifas y confianza

| Plataforma | Comisión oferta | Tarifa cliente | Protección |
| --- | --- | --- | --- |
| Airbnb | 15,5 % solo anfitrión (2026) | Ninguna | AirCover: 3 M USD daños, 1 M USD RC, verificación |
| Peerspace | 20 % | Variable | 1 M USD RC, 25 k USD daños |
| Giggster | 19 % | Variable | 1 M USD RC |
| Splacer | 15 % | 5 % | — |
| Tagvenue | 10-15 % | 0 % | — |
| Tutti | 10 % | 0 % | Solicitud |
| NoisyCamp | 4-9 % | 0 % | Calendario en vivo |
| Stufinder | 10 % | 5 % | Pago en app |
| EngineEars | 10 % o 15 USD/mes | — | Depósitos, facturación |
| **Kabina** | **12 %** | **0 %** | Pago retenido hasta la sesión, reembolso 100 % si cancela el estudio, protección de equipo hasta 5.000 € |

## 7. Aspectos regulatorios y prácticos

- **Ruido y licencias (España).** Madrid: OPCAT 2011 y Ley 37/2003; hace falta estudio/certificado acústico para la licencia de actividad; límites en zona residencial ~60 dB día / 40 dB noche ([ALLPE](https://www.allpe.com/acustica/campos-de-trabajo-ingenieria-acustica/acustica-y-licencias-de-apertura/)). Barcelona: Ordenanza de Medio Ambiente 2011, aislamiento ≥60 dB(A) ([Addient](https://www.addient.com/blog/aprobadas-las-modificaciones-de-la-ordenanza-de-medio-ambiente-de-barcelona-en-contaminacion-acustica)). Los home studios sin licencia son un riesgo.
- **IVA.** El alquiler de local y los servicios de estudio llevan el 21 % ([AEAT](https://sede.agenciatributaria.gob.es/Sede/iva/iva-operaciones-inmobiliarias/alquilo-local-tengo-que-ingresar-iva.html)). Los estudios necesitan factura: exactamente la «facturación compleja» que rompió el modelo de Studiotime.
- **Seguro, daños y fianzas.** Las pólizas de estudio cubren RC, equipo y bienes de clientes; los marketplaces sustituyen la fianza por garantías (Peerspace 25 k USD; Airbnb 3 M USD).
- **Pagos y escrow.** Stripe Connect con *destination charges* permite cobrar al artista y transferir al estudio tras la sesión ([Stripe](https://docs.stripe.com/connect/charges)). Coste: 2,9 % + 0,30 más cuotas de Connect.
- **Rails en Latinoamérica.** Stripe opera en México pero no directamente en Argentina ni Colombia; Mercado Pago exige entidad local por país; dLocal cobra en 15+ países desde una cuenta; PayU es fuerte en CO/MX/AR/CL ([guía 2026](https://cristiantala.com/pasarelas-de-pago-en-latam-2026-la-guia-que-necesitas-antes-de-cobrar-tu-primer-dolar/)).

## 8. Dolores de usuario (por frecuencia y gravedad)

1. **Tarifas apiladas y desintermediación:** 19-20 % + tarifa al cliente; blogs y estudios recomiendan reservar directo tras la primera sesión.
2. **Equipo roto y estado de la sala** en autoservicio (Pirate): faders rotos, cables que faltan, sesiones perdidas.
3. **Pagos y reembolsos fallidos, soporte inalcanzable** (Peerspace, Stufinder).
4. **Cancelaciones del anfitrión** cerca de la fecha.
5. **Fichas que no coinciden con las fotos.**
6. **Aislamiento, ventilación y limpieza.**
7. **Plataformas genéricas sin datos musicales** (por eso Tutti tiene 30+ filtros).
8. **Presión para contratar seguro** tras pagar.
9. **Calidad de las apps** (Peerspace «buggy», Stufinder se cierra, CAPTURE de Pirate sin conexión).
10. **Fricción de la solicitud**: esperar respuestas, formularios, listas cortas en 24 h.
11. **Mal uso de salas sin personal** (fiestas) y conflictos de ruido con vecinos.
12. **Economía del estudio**: no pueden repercutir costes.

## 9. Oportunidades para Kabina (y cómo se han aplicado)

| Oportunidad | Aplicación en el producto |
| --- | --- |
| Esquema de ficha específico de audio | Equipo por categorías (mesa/control, monitores, micrófonos, previos, DAW, backline), cabina aislada, técnico en sala, streaming, m², capacidad, salas |
| Extra de técnico/productor en el checkout | Extra de técnico por hora en la propia ficha, más extras libres por hora o por sesión (afinación de batería, mezcla, operador de cámara…) |
| Precio cerrado, comisión única baja y 0 % al artista | 0 % al artista, 12 % al estudio; desglose completo antes de pagar |
| Reserva inmediata sobre disponibilidad real | Calendario y selector de horas con horario semanal, días bloqueados y reservas existentes; reserva inmediata opcional |
| Rendimiento de horas muertas | Descuento de hora valle configurable por el estudio (p. ej. -20 % si la sesión termina antes de las 15:00 entre semana) |
| Protección de equipo y confianza | Pago retenido hasta la sesión, reembolso automático según política, reseñas solo de sesiones completadas con subnotas (sonido, equipo, trato, precio) |
| Bilingüe ES/EN con foco en España y LatAm | Interfaz completa en español e inglés; monedas EUR, USD, GBP, MXN, COP, ARS; ciudades de ejemplo en Madrid, Barcelona, Valencia, CDMX, Bogotá, Buenos Aires, Londres, Los Ángeles y Lisboa |
| Herramientas para el estudio | Panel con solicitudes, calendario con bloqueo de días, ingresos, cobros con Stripe Connect |
| Notas de sesión | El artista describe qué va a grabar y cuántas personas van; el estudio lo ve antes de aceptar |

Pendientes para siguientes versiones: sincronización de calendarios (iCal/Google), widget de reserva para la web del estudio (SaaS), facturas con IVA, protección de daños con check-in fotográfico, rails de pago LatAm (Mercado Pago/dLocal), páginas SEO por ciudad, app móvil.

## 10. Riesgos

- **Desintermediación** tras la primera reserva → herramientas SaaS para el estudio e incentivos de repetición.
- **Márgenes finos** en ensayo (5-20 €/h) → el valor medio del pedido importa más que la tarifa.
- **Fragmentación de la oferta y complejidad de facturación/IVA** (la lección de Studiotime).
- **Exposición a daños y calidad** en salas sin personal.
- **Responsabilidad por ruido** de anfitriones sin licencia.
- **Pagos en LatAm** (sin Stripe directo en AR/CO; inflación).
- **Incumbentes financiados** (Peerspace ya localizado en España; EngineEars podría añadir salas).
- **Sustitución por home studios e IA.**
- **Cementerio de pequeños entrantes**: la confianza hay que diseñarla desde el primer día.

## 11. Fuentes principales

1. https://www.sharetribe.com/customers/studiotime/
2. https://www.studiotime.io/fees
3. https://www.iammikewilliams.com/
4. https://support.peerspace.com/en/articles/10119442-what-is-the-peerspace-service-fee
5. https://www.peerspace.com/es/venues/es/madrid--md/recording-studio
6. https://www.trustpilot.com/review/peerspace.com
7. https://help.giggster.com/en/articles/2832062-how-much-commission-does-giggster-take
8. https://europe.republic.com/tutti-space
9. https://tutti.tawk.help/article/how-much-does-tutti-cost-to-list-a-space
10. https://musically.com/2022/03/23/pirate-gets-new-funding-after-250k-customers-milestone/
11. https://www.trustpilot.com/review/pirate.com
12. https://support.pirate.com/hc/en-gb/articles/31133706850065-Hamburg-and-Tempelhof-Closures
13. https://www.musicbusinessworldwide.com/audio-engineer-marketplace-engineears-founded-by-grammy-winning-mixedbyali-raises-7-5m/
14. https://support.engineears.com/en/knowledge-base/subscription
15. https://stufinder.com/how-it-works/
16. https://play.google.com/store/apps/details?id=com.stufinder.stu&hl=en_US
17. https://www.prostudiotime.com/about-us
18. https://noisycamp.com/become-a-host
19. https://www.viaempresa.cat/es/sounds-market-el-wallapop-de-los-musicos_209341_102.html
20. https://www.stereopass.com/
21. https://dondeensayo.com/
22. https://www.elmostrador.cl/agenda-pais/agenda-innovacion/2023/10/11/la-plataforma-que-busca-acercar-los-espacios-de-ensayo-y-grabacion-para-la-industria-creativa/
23. https://jammed.app/pricing/
24. https://www.ibisworld.com/united-states/industry/audio-production-studios/1254/
25. https://www.ukmusic.org/policy-campaigns/business-rates/
26. https://assets.publishing.service.gov.uk/media/610901c88fa8f5042c338d51/DCMS_Studio_Market_Assessment.pdf
27. https://modelosdeplandenegocios.com/blogs/news/analisis-mercado-estudios-grabacion-espana
28. https://dojobusiness.com/blogs/news/recording-studio-hourly-rates-maximize-revenue
29. https://www.production-expert.com/production-expert-1/are-professional-studios-still-relevant-in-2024-the-results
30. https://www.iab.com/insights/us-podcast-advertising-revenue-study-2024/
31. https://www.smoobu.com/en/blog/airbnb-host-only-fee-increase/
32. https://support.tagvenue.com/hc/en-gb/articles/32748248265757-What-are-the-commission-rates
33. https://sede.agenciatributaria.gob.es/Sede/iva/iva-operaciones-inmobiliarias/alquilo-local-tengo-que-ingresar-iva.html
34. https://docs.stripe.com/connect/charges
35. https://cristiantala.com/pasarelas-de-pago-en-latam-2026-la-guia-que-necesitas-antes-de-cobrar-tu-primer-dolar/
