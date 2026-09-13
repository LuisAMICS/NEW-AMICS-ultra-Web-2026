import { eq } from "drizzle-orm";
import type { Db } from "./index";
import * as schema from "./schema";
import { hashPassword } from "@/lib/password";
import { addDaysISO, newId, shortId, slugify, todayISO } from "@/lib/utils";
import { quote } from "@/lib/pricing";
import { DEMO_ACCOUNTS, DEFAULT_OPENING_HOURS, type Amenity, type Equipment, type ListingType, type OpeningHours, type CancellationPolicy } from "@/lib/constants";

type SeedListing = {
  host: string; // key into HOSTS
  title: string;
  type: ListingType;
  description: string;
  city: string;
  country: string;
  countryCode: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  timezone: string;
  sizeM2: number;
  capacity: number;
  rooms: number;
  hourlyRate: number; // cents
  currency: string;
  minHours: number;
  maxHours: number;
  instantBook: boolean;
  engineerAvailable: boolean;
  engineerRate?: number;
  offPeak?: { pct: number; endHour: number };
  opening?: OpeningHours;
  amenities: Amenity[];
  equipment: Equipment;
  rules: string;
  policy: CancellationPolicy;
  featured?: boolean;
  addons: { name: string; description?: string; priceCents: number; unit: "hour" | "session" }[];
};

const HOSTS: Record<string, { email: string; name: string; bio: string; avatar?: string }> = {
  demo: { email: DEMO_ACCOUNTS.host.email, name: "Iván Roldán", bio: "Técnico de sonido y propietario de Sala Norte, en Malasaña. Veinte años grabando bandas, locuciones y podcasts." },
  laia: { email: "laia@poblenou-sound.demo", name: "Laia Ferrer", bio: "Productora y propietaria de Poblenou Sound. Especializada en pop, electrónica y música para publicidad." },
  marcos: { email: "marcos@ruzafa.demo", name: "Marcos Peris", bio: "Batería y gestor de Ruzafa Rooms, locales de ensayo y grabación en Valencia." },
  valeria: { email: "valeria@roma-records.demo", name: "Valeria Ortiz", bio: "Ingeniera de mezcla en Ciudad de México. Roma Records es mi casa desde 2016." },
  andres: { email: "andres@chapinero.demo", name: "Andrés Castaño", bio: "Productor de hip-hop y reguetón en Bogotá. Abrí Chapinero Beats para que los artistas emergentes tuvieran una sala decente." },
  sofia: { email: "sofia@palermo-audio.demo", name: "Sofía Belmonte", bio: "Locutora y dueña de una cabina en Palermo pensada para doblaje y audiolibros." },
  tom: { email: "tom@hackney-tapes.demo", name: "Tom Ashcroft", bio: "Engineer and owner of Hackney Tapes. Analogue-first, but we love a hybrid session." },
  jordan: { email: "jordan@silverlake.demo", name: "Jordan Reyes", bio: "Producer and mixer in Silver Lake. Our control room is tuned for hip-hop, R&B and film scores." },
  ines: { email: "ines@alcantara.demo", name: "Inês Carvalho", bio: "Produtora em Lisboa. O estúdio fica numa antiga fábrica em Alcântara." },
};

const GUESTS: { email: string; name: string; bio: string }[] = [
  { email: DEMO_ACCOUNTS.guest.email, name: "Marta Vidal", bio: "Cantautora. Grabando mi segundo EP entre Valencia y Madrid." },
  { email: "diego@artist.demo", name: "Diego Aranda", bio: "Productor freelance. Trabajo con artistas de pop urbano y bandas indie." },
  { email: "lucia@artist.demo", name: "Lucía Montes", bio: "Podcaster. Presento un programa semanal sobre cine." },
  { email: "pablo@artist.demo", name: "Pablo Serrano", bio: "Guitarrista de una banda de rock. Ensayamos dos veces por semana." },
  { email: "aisha@artist.demo", name: "Aisha Khan", bio: "Voice actor and audiobook narrator." },
  { email: "carla@artist.demo", name: "Carla Nieto", bio: "Locutora publicitaria." },
  { email: "mateo@artist.demo", name: "Mateo Ruiz", bio: "Beatmaker. Trap y drill." },
  { email: "nora@artist.demo", name: "Nora Ekström", bio: "Singer-songwriter based in London." },
];

const hoursEU: OpeningHours = DEFAULT_OPENING_HOURS;
const hours247: OpeningHours = { mon: { open: 0, close: 24 }, tue: { open: 0, close: 24 }, wed: { open: 0, close: 24 }, thu: { open: 0, close: 24 }, fri: { open: 0, close: 24 }, sat: { open: 0, close: 24 }, sun: { open: 0, close: 24 } };
const hoursOffice: OpeningHours = { mon: { open: 9, close: 20 }, tue: { open: 9, close: 20 }, wed: { open: 9, close: 20 }, thu: { open: 9, close: 20 }, fri: { open: 9, close: 18 }, sat: null, sun: null };
const hoursLate: OpeningHours = { mon: { open: 12, close: 24 }, tue: { open: 12, close: 24 }, wed: { open: 12, close: 24 }, thu: { open: 12, close: 24 }, fri: { open: 12, close: 24 }, sat: { open: 12, close: 24 }, sun: { open: 14, close: 22 } };

const LISTINGS: SeedListing[] = [
  {
    host: "demo",
    title: "Sala Norte · Control room con SSL y live room de 40 m²",
    type: "recording",
    description:
      "Estudio de grabación en pleno Malasaña con control room tratado por Acústica Integral y un live room de 40 m² con techo de 4,5 m. Grabamos bandas completas en directo, voces con cadena Neve y baterías con 24 canales de previos. La sala tiene aislamiento total del exterior y una cabina de voces independiente con visual directa al control.\n\nIdeal para bandas, artistas pop y sesiones de producción que necesiten espacio y silencio. El precio incluye el uso de todo el backline listado; el técnico se contrata como extra por horas.",
    city: "Madrid",
    country: "España",
    countryCode: "ES",
    neighborhood: "Malasaña",
    address: "Calle del Espíritu Santo 23, local. 28004 Madrid",
    lat: 40.4255,
    lng: -3.7045,
    timezone: "Europe/Madrid",
    sizeM2: 95,
    capacity: 8,
    rooms: 3,
    hourlyRate: 4500,
    currency: "EUR",
    minHours: 3,
    maxHours: 12,
    instantBook: true,
    engineerAvailable: true,
    engineerRate: 2500,
    offPeak: { pct: 20, endHour: 15 },
    opening: hoursEU,
    amenities: ["soundproof", "isolation_booth", "engineer_onsite", "instruments", "ac", "lounge", "coffee", "wifi", "bathroom", "storage"],
    equipment: {
      console: ["SSL AWS 948 (48 canales)", "Pro Tools HDX con Avid MTRX", "Sistema de cue Hear Technologies (6 mezclas)"],
      monitors: ["ATC SCM45A Pro", "Yamaha NS-10M", "Avantone MixCube"],
      microphones: ["Neumann U87 Ai", "Telefunken ELA M 251 (réplica)", "AKG C414 XLS (par)", "Shure SM7B", "Sennheiser MD 421 (x4)", "Royer R-121", "Coles 4038 (par)"],
      preamps: ["Neve 1073 (x4)", "API 512c (x8)", "Universal Audio 1176LN", "Empirical Labs Distressor (x2)", "Tube-Tech CL 1B"],
      daw: ["Pro Tools Ultimate", "Logic Pro", "Ableton Live 12 Suite", "UAD Ultimate bundle"],
      instruments: ["Batería Gretsch USA Custom", "Piano vertical Yamaha U3", "Fender Rhodes Mark I", "Ampli Fender Deluxe Reverb", "Ampli Vox AC30", "Ampli Ampeg SVT + 8x10"],
    },
    rules: "No se fuma en ninguna sala. Llegada 10 minutos antes de la hora de inicio. El backline se devuelve tal como se encontró. Comida solo en la zona de descanso.",
    policy: "moderate",
    featured: true,
    addons: [
      { name: "Afinación de batería", description: "Baterista técnico afina el kit antes de la sesión.", priceCents: 4000, unit: "session" },
      { name: "Edición y entrega de stems", description: "Recibes las pistas editadas y organizadas en 48 h.", priceCents: 9000, unit: "session" },
    ],
  },
  {
    host: "demo",
    title: "Sala Norte · Cabina de locución y podcast",
    type: "voiceover",
    description:
      "Cabina de 9 m² totalmente aislada, con tratamiento absorbente y tiempo de reverberación por debajo de 0,15 s. Perfecta para doblaje, audiolibros, cuñas publicitarias y podcasts de una o dos personas. Conexión Source-Connect y Zoom para dirección remota.\n\nSe reserva por horas sueltas y el precio incluye la grabación con técnico en el control. Entregamos WAV y MP3 al terminar.",
    city: "Madrid",
    country: "España",
    countryCode: "ES",
    neighborhood: "Malasaña",
    address: "Calle del Espíritu Santo 23, local. 28004 Madrid",
    lat: 40.4258,
    lng: -3.7041,
    timezone: "Europe/Madrid",
    sizeM2: 9,
    capacity: 2,
    rooms: 1,
    hourlyRate: 3200,
    currency: "EUR",
    minHours: 1,
    maxHours: 6,
    instantBook: true,
    engineerAvailable: false,
    opening: hoursOffice,
    amenities: ["soundproof", "engineer_onsite", "ac", "coffee", "wifi", "accessible"],
    equipment: {
      microphones: ["Neumann U87 Ai", "Sennheiser MKH 416", "Shure SM7B"],
      preamps: ["Avalon VT-737sp", "Universal Audio Apollo x4"],
      daw: ["Pro Tools", "Source-Connect Pro", "Zoom / Riverside para dirección remota"],
      other: ["Atril con luz", "Auriculares Beyerdynamic DT 770 (x2)", "Pantalla para leer guion"],
    },
    rules: "Sesiones de una hora mínimo. Envía el guion con antelación si quieres que preparemos la sesión.",
    policy: "flexible",
    addons: [
      { name: "Edición y limpieza del audio", description: "Cortes, ruidos y niveles listos para entregar.", priceCents: 3500, unit: "session" },
    ],
  },
  {
    host: "demo",
    title: "Sala Norte · Local de ensayo B con backline completo",
    type: "rehearsal",
    description:
      "Local de ensayo de 30 m² insonorizado, con batería, dos amplis de guitarra, ampli de bajo, PA con dos monitores y micros para voces. Aire acondicionado y luz regulable. Está en el mismo edificio que el estudio, así que si el ensayo va bien podéis grabar la maqueta al lado.",
    city: "Madrid",
    country: "España",
    countryCode: "ES",
    neighborhood: "Malasaña",
    address: "Calle del Espíritu Santo 23, sótano. 28004 Madrid",
    lat: 40.4252,
    lng: -3.7049,
    timezone: "Europe/Madrid",
    sizeM2: 30,
    capacity: 6,
    rooms: 1,
    hourlyRate: 1400,
    currency: "EUR",
    minHours: 2,
    maxHours: 8,
    instantBook: true,
    engineerAvailable: false,
    opening: hoursLate,
    amenities: ["soundproof", "instruments", "ac", "wifi", "storage", "coffee"],
    equipment: {
      instruments: ["Batería Pearl Export con platos Zildjian", "Ampli Marshall JCM 900 + 4x12", "Ampli Fender Hot Rod Deluxe", "Ampli de bajo Hartke 500 W", "Teclado Nord Stage 3 (bajo petición)"],
      other: ["PA Yamaha 2x400 W con mesa de 12 canales", "Micros Shure SM58 (x3)", "Cables y pies de micro"],
    },
    rules: "Respeta la hora de salida: hay otra banda después. Los platos y parches rotos se cobran a precio de reposición.",
    policy: "flexible",
    addons: [{ name: "Grabación de maqueta en vivo", description: "Grabamos el ensayo a multipista y os enviamos una mezcla rápida.", priceCents: 6000, unit: "session" }],
  },
  {
    host: "laia",
    title: "Poblenou Sound · Sala de producción con Neve y vistas al mar",
    type: "production",
    description:
      "Sala de producción luminosa en una antigua fábrica textil de Poblenou. Mesa Neve Genesys Black de 16 canales, monitores Focal Trio11 y una colección de sintetizadores analógicos que puedes usar en la sesión: Prophet-6, Juno-60, Moog Sub 37 y una Roland TR-8S.\n\nPensada para productores que quieren un día de trabajo sin interrupciones con buen sonido, luz natural y café de verdad. Cabina de voces anexa de 6 m² incluida.",
    city: "Barcelona",
    country: "España",
    countryCode: "ES",
    neighborhood: "Poblenou",
    address: "Carrer de Pere IV 212, 2º. 08005 Barcelona",
    lat: 41.4036,
    lng: 2.195,
    timezone: "Europe/Madrid",
    sizeM2: 48,
    capacity: 5,
    rooms: 2,
    hourlyRate: 3800,
    currency: "EUR",
    minHours: 4,
    maxHours: 12,
    instantBook: false,
    engineerAvailable: true,
    opening: hoursEU,
    amenities: ["natural_light", "isolation_booth", "instruments", "ac", "coffee", "wifi", "lounge", "kitchen", "accessible"],
    equipment: {
      console: ["Neve Genesys Black 16", "Universal Audio Apollo x16"],
      monitors: ["Focal Trio11 Be", "Genelec 8030C"],
      microphones: ["Neumann TLM 103", "AKG C414 XLII", "Shure SM7B"],
      preamps: ["Neve 1073 (integrado)", "Chandler TG2", "Warm Audio WA-2A"],
      daw: ["Ableton Live 12 Suite", "Logic Pro", "Pro Tools Studio", "Push 3"],
      instruments: ["Sequential Prophet-6", "Roland Juno-60", "Moog Sub 37", "Roland TR-8S", "Fender Stratocaster + Deluxe Reverb"],
    },
    rules: "Los sintetizadores se manipulan con cuidado y no se mueven de sitio. Sin comida en la sala de control.",
    policy: "strict",
    featured: true,
    addons: [
      { name: "Técnico / co-producción", description: "Laia se sienta contigo en la sesión.", priceCents: 3000, unit: "hour" },
      { name: "Mezcla de un tema", description: "Mezcla completa de un tema entregada en 5 días.", priceCents: 25000, unit: "session" },
    ],
  },
  {
    host: "laia",
    title: "Poblenou Sound · Set de podcast con 4 micros y 3 cámaras",
    type: "podcast",
    description:
      "Set de podcast y videopodcast con mesa para cuatro, micrófonos Shure SM7B, mesa RØDECaster Pro II y tres cámaras Sony 4K con iluminación fija. Sales con el audio multipista y el vídeo de cada cámara en una tarjeta o por enlace.\n\nOpción de operador de cámara y edición como extra. Hay una zona de espera con sofá para invitados.",
    city: "Barcelona",
    country: "España",
    countryCode: "ES",
    neighborhood: "Poblenou",
    address: "Carrer de Pere IV 212, 1º. 08005 Barcelona",
    lat: 41.4032,
    lng: 2.1946,
    timezone: "Europe/Madrid",
    sizeM2: 35,
    capacity: 6,
    rooms: 1,
    hourlyRate: 4200,
    currency: "EUR",
    minHours: 2,
    maxHours: 8,
    instantBook: true,
    engineerAvailable: true,
    opening: hoursOffice,
    amenities: ["streaming", "soundproof", "lounge", "coffee", "wifi", "ac", "natural_light"],
    equipment: {
      microphones: ["Shure SM7B (x4) con Cloudlifter"],
      console: ["RØDECaster Pro II", "Blackmagic ATEM Mini Pro ISO"],
      other: ["Sony FX30 (x3)", "Iluminación Aputure 300d + softbox", "Teleprompter", "Auriculares (x4)"],
      daw: ["Adobe Premiere y Audition en la sala de edición"],
    },
    rules: "Los invitados pueden llegar 15 minutos antes. No se puede cambiar la iluminación sin el operador.",
    policy: "moderate",
    addons: [
      { name: "Operador de cámara y realización", priceCents: 2000, unit: "hour" },
      { name: "Edición de episodio (hasta 60 min)", priceCents: 15000, unit: "session" },
    ],
  },
  {
    host: "marcos",
    title: "Ruzafa Rooms · Local de ensayo grande con escenario",
    type: "rehearsal",
    description:
      "Local de 45 m² con tarima de escenario, PA de 2.000 W, luces y backline completo. Pensado para preparar directos: ensayas en condiciones parecidas a un concierto. Aparcamiento fácil y acceso para cargar equipo con carrito.",
    city: "Valencia",
    country: "España",
    countryCode: "ES",
    neighborhood: "Ruzafa",
    address: "Carrer de Sueca 61. 46006 València",
    lat: 39.462,
    lng: -0.374,
    timezone: "Europe/Madrid",
    sizeM2: 45,
    capacity: 8,
    rooms: 1,
    hourlyRate: 1600,
    currency: "EUR",
    minHours: 2,
    maxHours: 10,
    instantBook: true,
    engineerAvailable: false,
    offPeak: { pct: 25, endHour: 18 },
    opening: hoursLate,
    amenities: ["soundproof", "instruments", "parking", "ac", "wifi", "storage", "bathroom"],
    equipment: {
      instruments: ["Batería Tama Starclassic", "Ampli Orange Rockerverb 50 + 2x12", "Ampli Fender Twin Reverb", "Ampli de bajo Ampeg BA-210", "Piano digital Roland RD-2000"],
      other: ["PA dB Technologies 2x1000 W + subwoofer", "Mesa Allen & Heath 16 canales", "Micros SM58 (x4) y SM57 (x2)", "Luces LED PAR (x6)"],
    },
    rules: "Máximo 8 personas. Se puede traer bebida (sin cristal). Limpiad la sala al terminar.",
    policy: "flexible",
    addons: [{ name: "Alquiler de trastes de percusión", priceCents: 1500, unit: "session" }],
  },
  {
    host: "marcos",
    title: "Ruzafa Rooms · Estudio de grabación compacto",
    type: "recording",
    description:
      "Estudio compacto pero muy bien tratado: control room de 18 m² y live room de 22 m² con tarima flotante. Perfecto para grabar voces, guitarras y baterías de bandas pequeñas a buen precio. Técnico incluido en el precio de todas las sesiones.",
    city: "Valencia",
    country: "España",
    countryCode: "ES",
    neighborhood: "Ruzafa",
    address: "Carrer de Sueca 61, planta 1. 46006 València",
    lat: 39.4625,
    lng: -0.3736,
    timezone: "Europe/Madrid",
    sizeM2: 40,
    capacity: 5,
    rooms: 2,
    hourlyRate: 3000,
    currency: "EUR",
    minHours: 2,
    maxHours: 10,
    instantBook: false,
    engineerAvailable: true,
    opening: hoursEU,
    amenities: ["soundproof", "engineer_onsite", "isolation_booth", "instruments", "coffee", "wifi", "parking"],
    equipment: {
      console: ["Audient ASP4816", "Universal Audio Apollo x8p"],
      monitors: ["Adam A7V", "Yamaha HS8"],
      microphones: ["Neumann TLM 102", "AKG C214 (par)", "Shure SM57 (x4)", "Sennheiser e604 (x3)", "Audix D6"],
      preamps: ["Audient (integrados)", "Warm Audio WA76"],
      daw: ["Logic Pro", "Pro Tools Studio", "Reaper"],
      instruments: ["Batería Tama Starclassic", "Ampli Orange Rockerverb 50", "Ampli Fender Twin Reverb"],
    },
    rules: "El técnico residente controla la mesa. Podéis traer vuestro portátil y sesiones.",
    policy: "moderate",
    addons: [{ name: "Mezcla rápida por tema", priceCents: 8000, unit: "session" }],
  },
  {
    host: "valeria",
    title: "Roma Records · Sala de mezcla y mastering",
    type: "mixing",
    description:
      "Sala de mezcla tratada por Sonic Perception con monitores Amphion Two18 y subwoofer, más una cadena de mastering analógica. Ideal para mezclar tus producciones en un entorno de referencia o para sesiones de mastering asistido con Valeria.\n\nEstamos en la Roma Norte, a dos cuadras del metro Insurgentes. Café de olla y terraza para los descansos.",
    city: "Ciudad de México",
    country: "México",
    countryCode: "MX",
    neighborhood: "Roma Norte",
    address: "Calle Colima 168, int. 4. Roma Norte, 06700 CDMX",
    lat: 19.419,
    lng: -99.161,
    timezone: "America/Mexico_City",
    sizeM2: 32,
    capacity: 4,
    rooms: 1,
    hourlyRate: 65000,
    currency: "MXN",
    minHours: 3,
    maxHours: 10,
    instantBook: false,
    engineerAvailable: true,
    engineerRate: 45000,
    opening: hoursEU,
    amenities: ["soundproof", "engineer_onsite", "ac", "coffee", "wifi", "lounge", "natural_light"],
    equipment: {
      console: ["Dangerous Music 2-Bus+", "Avid HD I/O 16x16", "Controlador Avid S1"],
      monitors: ["Amphion Two18 + BaseTwo", "Avantone CLA-10", "Auriculares Audeze LCD-X"],
      preamps: ["Manley Massive Passive", "Shadow Hills Mastering Compressor", "SPL Passeq", "Elysia alpha compressor"],
      daw: ["Pro Tools Ultimate", "Sequoia", "iZotope Ozone 11"],
    },
    rules: "Sesiones de mezcla por horas o por tema. Trae tus sesiones en Pro Tools o stems consolidados.",
    policy: "moderate",
    featured: true,
    addons: [
      { name: "Mezcla asistida con Valeria", priceCents: 45000, unit: "hour" },
      { name: "Master de un tema (analógico)", priceCents: 250000, unit: "session" },
    ],
  },
  {
    host: "valeria",
    title: "Roma Records · Estudio A con live room y piano de cola",
    type: "recording",
    description:
      "Nuestro estudio principal: control room con API 1608 y live room de 55 m² con piano de cola Yamaha C3, ideal para grabar jazz, sesiones acústicas y cuerdas. Dos cabinas de aislamiento para voces y amplificadores.",
    city: "Ciudad de México",
    country: "México",
    countryCode: "MX",
    neighborhood: "Roma Norte",
    address: "Calle Colima 168, int. 1. Roma Norte, 06700 CDMX",
    lat: 19.4186,
    lng: -99.1616,
    timezone: "America/Mexico_City",
    sizeM2: 110,
    capacity: 12,
    rooms: 4,
    hourlyRate: 120000,
    currency: "MXN",
    minHours: 4,
    maxHours: 12,
    instantBook: false,
    engineerAvailable: true,
    engineerRate: 45000,
    opening: hoursEU,
    amenities: ["soundproof", "isolation_booth", "engineer_onsite", "instruments", "ac", "lounge", "kitchen", "coffee", "wifi", "parking"],
    equipment: {
      console: ["API 1608-II (32 canales)", "Pro Tools HDX", "Cue Furman HDS-16"],
      monitors: ["ATC SCM25A", "Yamaha NS-10M"],
      microphones: ["Neumann U67 (reedición)", "Neumann KM 184 (par)", "AKG C12 VR", "Coles 4038 (par)", "Shure SM57 (x6)", "Beyerdynamic M 160 (x2)"],
      preamps: ["API 512v (x16)", "Neve 1084 (x2)", "Teletronix LA-2A", "Universal Audio 1176 (x2)", "Fairchild 670 (réplica Undertone)"],
      daw: ["Pro Tools Ultimate", "Logic Pro"],
      instruments: ["Piano de cola Yamaha C3", "Batería Ludwig Classic Maple", "Hammond B3 con Leslie 122", "Wurlitzer 200A", "Amplis Fender, Vox y Ampeg"],
    },
    rules: "El piano se afina cada quince días; si necesitas afinación el día de la sesión, pídelo como extra.",
    policy: "strict",
    addons: [
      { name: "Afinación de piano el día de la sesión", priceCents: 180000, unit: "session" },
    ],
  },
  {
    host: "andres",
    title: "Chapinero Beats · Sala urbana con cabina y producción",
    type: "production",
    description:
      "Sala de producción y grabación de voces enfocada en hip-hop, reguetón y afrobeat. Cabina de voz con Sony C-800G (réplica), monitores Kali IN-8 y una colección de plugins lista para producir. Sesiones nocturnas disponibles.",
    city: "Bogotá",
    country: "Colombia",
    countryCode: "CO",
    neighborhood: "Chapinero",
    address: "Carrera 9 # 60-25, of. 302. Chapinero, Bogotá",
    lat: 4.6486,
    lng: -74.06,
    timezone: "America/Bogota",
    sizeM2: 28,
    capacity: 5,
    rooms: 2,
    hourlyRate: 12000000,
    currency: "COP",
    minHours: 2,
    maxHours: 10,
    instantBook: true,
    engineerAvailable: true,
    opening: hoursLate,
    amenities: ["soundproof", "isolation_booth", "engineer_onsite", "ac", "wifi", "coffee", "access_24h"],
    equipment: {
      microphones: ["Sony C-800G (réplica)", "Neumann TLM 103", "Shure SM7B"],
      preamps: ["Universal Audio Apollo Twin X", "Warm Audio WA73-EQ", "Avalon VT-737sp"],
      monitors: ["Kali IN-8 (2ª gen)", "Yamaha HS5"],
      daw: ["FL Studio 21", "Ableton Live 12", "Pro Tools Studio", "Autotune Pro X"],
      instruments: ["Maschine MK3", "Akai MPC One", "Arturia KeyLab 61"],
    },
    rules: "Máximo cinco personas en la sala. Sesiones nocturnas hasta las 2 h con reserva previa.",
    policy: "flexible",
    addons: [
      { name: "Ingeniero de grabación y afinación vocal", priceCents: 6000000, unit: "hour" },
      { name: "Beat exclusivo producido en sesión", priceCents: 30000000, unit: "session" },
    ],
  },
  {
    host: "sofia",
    title: "Palermo Audio · Cabina de locución con dirección remota",
    type: "voiceover",
    description:
      "Cabina profesional en Palermo Soho, con Source-Connect, Sennheiser MKH 416 y Neumann U87. Trabajamos con agencias y estudios de doblaje de toda Latinoamérica; puedes dirigir la sesión desde cualquier lugar. Precio por hora con técnico incluido.",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    neighborhood: "Palermo",
    address: "Gurruchaga 1650, PB. Palermo, CABA",
    lat: -34.588,
    lng: -58.43,
    timezone: "America/Argentina/Buenos_Aires",
    sizeM2: 12,
    capacity: 2,
    rooms: 1,
    hourlyRate: 3500000,
    currency: "ARS",
    minHours: 1,
    maxHours: 6,
    instantBook: true,
    engineerAvailable: false,
    opening: hoursOffice,
    amenities: ["soundproof", "engineer_onsite", "ac", "wifi", "coffee", "accessible"],
    equipment: {
      microphones: ["Neumann U87 Ai", "Sennheiser MKH 416", "Rode NT1"],
      preamps: ["Universal Audio Apollo x4", "Neve 1073SPX"],
      daw: ["Pro Tools", "Source-Connect Pro", "ipDTL"],
      other: ["Atril, pantalla de guion y auriculares Sony MDR-7506"],
    },
    rules: "Si dirigís de forma remota, enviá el enlace con antelación para probar la conexión.",
    policy: "flexible",
    addons: [{ name: "Edición y entrega por take", priceCents: 1500000, unit: "session" }],
  },
  {
    host: "tom",
    title: "Hackney Tapes · Analogue tracking room with 2-inch tape",
    type: "recording",
    description:
      "A hybrid analogue studio in a converted warehouse in Hackney Wick. Studer A827 2-inch tape machine, a 1978 MCI JH-636 console and a 60 m² live room with a great drum sound. We track bands live, straight to tape or Pro Tools, and love loud rock, soul and everything in between.\n\nThe price includes the room and our full mic locker; an engineer is available as an add-on. Kitchen and roof terrace for breaks.",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    neighborhood: "Hackney Wick",
    address: "Unit 4, 32 White Post Lane, London E9 5EN",
    lat: 51.545,
    lng: -0.025,
    timezone: "Europe/London",
    sizeM2: 120,
    capacity: 10,
    rooms: 3,
    hourlyRate: 5500,
    currency: "GBP",
    minHours: 4,
    maxHours: 12,
    instantBook: false,
    engineerAvailable: true,
    engineerRate: 3500,
    offPeak: { pct: 15, endHour: 14 },
    opening: hoursEU,
    amenities: ["soundproof", "isolation_booth", "engineer_onsite", "instruments", "kitchen", "lounge", "coffee", "wifi", "storage", "parking"],
    equipment: {
      console: ["MCI JH-636 (36 ch)", "Studer A827 24-track 2-inch", "Pro Tools HDX / Lynx Aurora"],
      monitors: ["PMC IB1S", "Yamaha NS-10M", "Auratone 5C"],
      microphones: ["Neumann U47 (Telefunken reissue)", "Neumann U87", "AKG D12", "Coles 4038 (pair)", "Beyer M88", "Shure SM57 (x6)", "Sennheiser MD 421 (x4)"],
      preamps: ["Neve 1073 (x2)", "API 312 (x8)", "UREI 1176 (x2)", "Teletronix LA-3A (x2)", "EMT 140 plate reverb"],
      daw: ["Pro Tools Ultimate", "Logic Pro"],
      instruments: ["Ludwig Vistalite kit", "Hammond A100 + Leslie", "Fender Rhodes", "Vox AC30", "Fender Bassman", "Marshall JMP"],
    },
    rules: "Tape stock is charged at cost if you track to tape. No smoking indoors. Load-in via the yard.",
    policy: "strict",
    featured: true,
    addons: [
      { name: "2-inch tape reel (30 min)", priceCents: 22000, unit: "session" },
    ],
  },
  {
    host: "tom",
    title: "Hackney Tapes · Rehearsal room with vintage backline",
    type: "rehearsal",
    description:
      "Our rehearsal space next to the main studio: 35 m², treated, with a Ludwig kit, Vox and Fender amps and a small PA. Great for pre-production before a session. Book by the hour, evenings and weekends included.",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    neighborhood: "Hackney Wick",
    address: "Unit 5, 32 White Post Lane, London E9 5EN",
    lat: 51.5454,
    lng: -0.0246,
    timezone: "Europe/London",
    sizeM2: 35,
    capacity: 6,
    rooms: 1,
    hourlyRate: 1800,
    currency: "GBP",
    minHours: 2,
    maxHours: 8,
    instantBook: true,
    engineerAvailable: false,
    opening: hoursLate,
    amenities: ["soundproof", "instruments", "wifi", "coffee", "storage"],
    equipment: {
      instruments: ["Ludwig Classic Maple kit", "Vox AC30", "Fender Deluxe Reverb", "Ampeg B-15", "Nord Electro 6D"],
      other: ["PA: QSC K12.2 (x2) + Soundcraft 12-ch mixer", "Shure SM58 (x3)"],
    },
    rules: "Please leave the room as you found it. Bands of up to six.",
    policy: "flexible",
    addons: [],
  },
  {
    host: "jordan",
    title: "Silver Lake Mix Room · Hip-hop & R&B control room with Dolby Atmos",
    type: "mixing",
    description:
      "A control room tuned for modern records: SSL Origin, Augspurger mains, a 7.1.4 Dolby Atmos monitoring setup and a vocal booth with a Sony C-800G. We host mix sessions, vocal tracking and Atmos deliverables for labels and independent artists.\n\nSessions include a runner and unlimited espresso. Engineer and Atmos mixer available as add-ons.",
    city: "Los Angeles",
    country: "United States",
    countryCode: "US",
    neighborhood: "Silver Lake",
    address: "2610 Sunset Blvd, Los Angeles, CA 90026",
    lat: 34.087,
    lng: -118.27,
    timezone: "America/Los_Angeles",
    sizeM2: 60,
    capacity: 6,
    rooms: 2,
    hourlyRate: 9500,
    currency: "USD",
    minHours: 4,
    maxHours: 12,
    instantBook: false,
    engineerAvailable: true,
    engineerRate: 6000,
    opening: hours247,
    amenities: ["soundproof", "isolation_booth", "engineer_onsite", "access_24h", "ac", "lounge", "kitchen", "coffee", "wifi", "parking"],
    equipment: {
      console: ["SSL Origin 32", "Avid MTRX Studio", "Avid S4 (24 faders)"],
      monitors: ["Augspurger Duo 12 + subs", "Genelec 8341A (x11) + 7370A subs (Atmos 7.1.4)", "Yamaha NS-10M"],
      microphones: ["Sony C-800G", "Neumann U87 Ai", "Telefunken ELA M 251E", "Shure SM7B"],
      preamps: ["Neve 1073 (x4)", "Tube-Tech CL 1B", "Empirical Labs Distressor (x2)", "Avalon VT-737sp"],
      daw: ["Pro Tools Ultimate", "Dolby Atmos Renderer", "Logic Pro", "Ableton Live"],
    },
    rules: "24/7 access with a confirmed booking. Sessions over 8 h require a 30-minute break for the engineer.",
    policy: "strict",
    featured: true,
    addons: [
      { name: "Dolby Atmos mix of one song", priceCents: 120000, unit: "session" },
    ],
  },
  {
    host: "ines",
    title: "Fábrica Alcântara · Live room para sessões ao vivo e streaming",
    type: "live",
    description:
      "Sala de 70 m² numa antiga fábrica em Alcântara preparada para live sessions, showcases e streaming: palco baixo, PA, três câmaras PTZ, iluminação e uma régie com mesa digital. Cabe um público de até 40 pessoas. Ideal para gravar sessões ao vivo com qualidade de disco e imagem.",
    city: "Lisboa",
    country: "Portugal",
    countryCode: "PT",
    neighborhood: "Alcântara",
    address: "Rua da Cozinha Económica 17, 1300-149 Lisboa",
    lat: 38.705,
    lng: -9.173,
    timezone: "Europe/Lisbon",
    sizeM2: 70,
    capacity: 40,
    rooms: 2,
    hourlyRate: 6000,
    currency: "EUR",
    minHours: 4,
    maxHours: 12,
    instantBook: false,
    engineerAvailable: true,
    opening: hoursLate,
    amenities: ["streaming", "soundproof", "instruments", "lounge", "kitchen", "bathroom", "parking", "wifi", "accessible"],
    equipment: {
      console: ["Allen & Heath dLive C1500", "Blackmagic ATEM Mini Extreme ISO"],
      other: ["PA d&b audiotechnik Y-Series", "Câmaras PTZ Sony (x3)", "Iluminação LED (12 focos) + fumo", "Backline: bateria Yamaha Stage Custom, amplis Fender e Ampeg"],
      microphones: ["Shure SM58 / SM57 / Beta 52", "Sennheiser e935 (x4)", "DPA 4099 (x4)"],
      daw: ["Pro Tools (multipista 48 canais)", "OBS / vMix"],
      instruments: ["Bateria Yamaha Stage Custom", "Fender Twin Reverb", "Ampeg SVT-CL"],
    },
    rules: "Eventos com público até 40 pessoas. A limpeza final está incluída. Som até às 24 h.",
    policy: "strict",
    addons: [
      { name: "Técnico de som + realização", priceCents: 3000, unit: "hour" },
      { name: "Streaming multi-câmara com realização", priceCents: 40000, unit: "session" },
    ],
  },
];

const PHOTO_ORDER: Record<ListingType, Array<"control" | "booth" | "live" | "lounge">> = {
  recording: ["control", "live", "booth", "lounge"],
  mixing: ["control", "lounge", "booth", "live"],
  rehearsal: ["live", "lounge", "control", "booth"],
  podcast: ["lounge", "booth", "control", "live"],
  voiceover: ["booth", "control", "lounge", "live"],
  production: ["control", "booth", "lounge", "live"],
  live: ["live", "control", "lounge", "booth"],
};

type SeedReview = { author: number; rating: [number, number, number, number, number]; comment: string; daysAgo: number; reply?: string };

const REVIEWS: Record<number, SeedReview[]> = {
  0: [
    { author: 1, rating: [5, 5, 5, 5, 4], comment: "La batería suena enorme en el live room y la cadena Neve para voces es exactamente lo que esperábamos. Iván nos ayudó con el cue y salimos con 8 temas grabados en dos días.", daysAgo: 12, reply: "¡Gracias, Diego! Un placer teneros. Cuando queráis volvemos a por las voces definitivas." },
    { author: 3, rating: [5, 5, 5, 5, 5], comment: "Ensayamos en la sala B y grabamos la maqueta arriba el mismo día. Muy cómodo tenerlo todo en el mismo sitio.", daysAgo: 30 },
    { author: 6, rating: [4, 4, 5, 4, 4], comment: "Buen estudio, buen equipo. El único pero: el parking en Malasaña es complicado, id en transporte público.", daysAgo: 55 },
    { author: 7, rating: [5, 5, 4, 5, 5], comment: "Booked from London for a two-day vocal session. Great room, great mics, and the price was exactly what the listing said.", daysAgo: 80 },
  ],
  1: [
    { author: 5, rating: [5, 5, 5, 5, 5], comment: "Cabina impecable para cuñas. Grabé cuatro spots en una hora y me enviaron los archivos limpios antes de llegar a casa.", daysAgo: 8 },
    { author: 2, rating: [5, 5, 4, 5, 5], comment: "Grabo mi podcast aquí cada dos semanas. Silencio absoluto y siempre puntuales.", daysAgo: 20 },
    { author: 4, rating: [4, 5, 5, 5, 4], comment: "Great booth and the Source-Connect worked first time with the director in Dublin.", daysAgo: 60 },
  ],
  2: [
    { author: 3, rating: [4, 4, 4, 5, 5], comment: "Local limpio, backline que funciona y precio muy justo. Repetimos cada semana.", daysAgo: 5 },
    { author: 6, rating: [4, 4, 4, 4, 4], comment: "Correcto para ensayar. La batería podría tener parches nuevos.", daysAgo: 45, reply: "Parches cambiados esta semana. ¡Gracias por el aviso!" },
  ],
  3: [
    { author: 1, rating: [5, 5, 5, 5, 4], comment: "Los sintes son una pasada y la sala tiene una luz preciosa. Laia se involucró en la producción y aportó muchísimo.", daysAgo: 15 },
    { author: 6, rating: [5, 5, 5, 4, 4], comment: "Pasé un día entero produciendo con el Prophet y el Juno. La Neve suena tal como esperas.", daysAgo: 40 },
    { author: 0, rating: [5, 4, 5, 5, 5], comment: "Un lujo de sala. La cabina de voces anexa es pequeña pero suena muy bien.", daysAgo: 95 },
  ],
  4: [
    { author: 2, rating: [5, 5, 5, 5, 5], comment: "Set de podcast completo: entramos, grabamos con tres cámaras y salimos con todo en una tarjeta. Sin sorpresas.", daysAgo: 10 },
    { author: 5, rating: [4, 4, 5, 4, 4], comment: "Muy profesional. Recomendable contratar el operador si vais a hacer vídeo.", daysAgo: 33 },
  ],
  5: [
    { author: 3, rating: [5, 5, 4, 5, 5], comment: "El escenario cambia el ensayo por completo: preparamos la gira aquí. PA de sobra.", daysAgo: 9 },
    { author: 0, rating: [4, 4, 4, 5, 5], comment: "Amplio y bien de precio. Buen parking.", daysAgo: 70 },
  ],
  6: [
    { author: 0, rating: [5, 5, 4, 5, 5], comment: "Grabé las voces de mi EP con Marcos. Muy buen trato, muy buena relación calidad-precio.", daysAgo: 25 },
  ],
  7: [
    { author: 1, rating: [5, 5, 5, 5, 4], comment: "Mezclé un disco entero con Valeria. Los Amphion no perdonan nada y el resultado se tradujo perfecto en el coche.", daysAgo: 18 },
    { author: 6, rating: [5, 5, 5, 5, 5], comment: "El master analógico le dio a mi tema justo lo que le faltaba. Muy recomendable.", daysAgo: 50 },
    { author: 4, rating: [4, 5, 5, 4, 4], comment: "Great room, brilliant engineer. Coffee is dangerous.", daysAgo: 88 },
  ],
  8: [
    { author: 1, rating: [5, 5, 5, 5, 4], comment: "La API con el live room y el piano de cola: sesión de jazz de manual. Salió redonda.", daysAgo: 22 },
    { author: 7, rating: [5, 5, 5, 4, 4], comment: "Tracked strings and piano here for a film cue. The room is gorgeous.", daysAgo: 65 },
  ],
  9: [
    { author: 6, rating: [5, 5, 5, 5, 5], comment: "Sesión nocturna perfecta. Andrés afina voces como nadie y el ambiente es muy tranquilo.", daysAgo: 4 },
    { author: 1, rating: [4, 4, 4, 5, 5], comment: "Buena sala para producir y grabar voces rápido. Precio muy justo.", daysAgo: 38 },
  ],
  10: [
    { author: 5, rating: [5, 5, 5, 5, 5], comment: "Grabé un audiolibro completo en cinco sesiones. Sofía es puntual, atenta y la cabina es silenciosa de verdad.", daysAgo: 14 },
    { author: 4, rating: [5, 5, 5, 5, 4], comment: "Remote-directed session from New York went perfectly.", daysAgo: 42 },
  ],
  11: [
    { author: 7, rating: [5, 5, 5, 5, 4], comment: "Tracked our album live to tape over four days. The drum room is special and Tom is a joy to work with.", daysAgo: 20, reply: "Thanks Nora, can't wait to hear the mixes!" },
    { author: 3, rating: [5, 5, 4, 5, 4], comment: "Fuimos desde Madrid a grabar a cinta. Merece la pena el viaje.", daysAgo: 58 },
    { author: 1, rating: [4, 5, 5, 4, 4], comment: "Excellent mic locker and outboard. Pricey but fair for what it is.", daysAgo: 100 },
  ],
  12: [
    { author: 7, rating: [4, 4, 4, 5, 5], comment: "Nice room, decent backline, easy to get to. We rehearse here before every gig.", daysAgo: 7 },
  ],
  13: [
    { author: 6, rating: [5, 5, 5, 5, 4], comment: "Atmos mix session for two songs. Jordan's room translates everywhere. Runner brought espresso every hour.", daysAgo: 11 },
    { author: 1, rating: [5, 5, 5, 4, 4], comment: "Mezclé dos temas en el SSL Origin con Jordan. Impecable.", daysAgo: 47 },
    { author: 4, rating: [5, 5, 5, 5, 5], comment: "Booked a late-night vocal session. The C-800G is the real deal.", daysAgo: 76 },
  ],
  14: [
    { author: 7, rating: [5, 5, 5, 5, 4], comment: "We recorded a live session with an audience of 30. Sound and cameras were flawless.", daysAgo: 16 },
    { author: 0, rating: [5, 4, 5, 5, 4], comment: "Showcase para nuestra discográfica. Sala preciosa y equipo muy profesional.", daysAgo: 62 },
  ],
};

export async function seed(db: Db) {
  const existing = await db.select({ id: schema.listings.id }).from(schema.listings).limit(1);
  if (existing.length > 0) return;

  const now = new Date();
  const passwordHash = hashPassword(DEMO_ACCOUNTS.guest.password);
  const daysAgoDate = (days: number, hour = 12) => new Date(now.getTime() - days * 864e5 - (12 - hour) * 36e5);

  // Users
  const hostIds: Record<string, string> = {};
  const userRows: (typeof schema.users.$inferInsert)[] = [];
  for (const [key, h] of Object.entries(HOSTS)) {
    const id = newId();
    hostIds[key] = id;
    userRows.push({ id, email: h.email, passwordHash, name: h.name, bio: h.bio, isHost: true, locale: key === "tom" || key === "jordan" ? "en" : "es", createdAt: daysAgoDate(400 + userRows.length * 7), updatedAt: now });
  }
  const guestIds: string[] = [];
  GUESTS.forEach((g, i) => {
    const id = newId();
    guestIds.push(id);
    userRows.push({ id, email: g.email, passwordHash, name: g.name, bio: g.bio, isHost: false, locale: i === 4 || i === 7 ? "en" : "es", createdAt: daysAgoDate(300 - i * 20), updatedAt: now });
  });
  await db.insert(schema.users).values(userRows);

  // Listings, photos, add-ons
  const listingIds: string[] = [];
  const listingRows: (typeof schema.listings.$inferInsert)[] = [];
  const photoRows: (typeof schema.listingPhotos.$inferInsert)[] = [];
  const addonRows: (typeof schema.listingAddons.$inferInsert)[] = [];
  LISTINGS.forEach((l, i) => {
    const id = newId();
    listingIds.push(id);
    const palette = i % 6;
    listingRows.push({
      id,
      hostId: hostIds[l.host],
      slug: `${slugify(l.title)}-${shortId(4).toLowerCase()}`,
      title: l.title,
      type: l.type,
      description: l.description,
      city: l.city,
      country: l.country,
      countryCode: l.countryCode,
      neighborhood: l.neighborhood,
      address: l.address,
      lat: l.lat,
      lng: l.lng,
      timezone: l.timezone,
      sizeM2: l.sizeM2,
      capacity: l.capacity,
      rooms: l.rooms,
      hourlyRate: l.hourlyRate,
      currency: l.currency,
      minHours: l.minHours,
      maxHours: l.maxHours,
      instantBook: l.instantBook,
      engineerAvailable: l.engineerAvailable,
      engineerRate: l.engineerRate ?? null,
      offPeakDiscount: l.offPeak?.pct ?? 0,
      offPeakEndHour: l.offPeak?.endHour ?? 14,
      openingHours: l.opening ?? DEFAULT_OPENING_HOURS,
      amenities: l.amenities,
      equipment: l.equipment,
      rules: l.rules,
      cancellationPolicy: l.policy,
      status: "published",
      featured: l.featured ?? false,
      createdAt: daysAgoDate(380 - i * 15),
      updatedAt: now,
    });
    PHOTO_ORDER[l.type].forEach((scene, position) => {
      photoRows.push({ id: newId(), listingId: id, url: `/covers/${scene}-${palette}.svg`, alt: `${l.title} · ${scene}`, position });
    });
    l.addons.forEach((a, position) => {
      addonRows.push({ id: newId(), listingId: id, name: a.name, description: a.description ?? null, priceCents: a.priceCents, unit: a.unit, position });
    });
  });
  await db.insert(schema.listings).values(listingRows);
  await db.insert(schema.listingPhotos).values(photoRows);
  if (addonRows.length) await db.insert(schema.listingAddons).values(addonRows);

  // Bookings + reviews from the review fixtures (past, completed)
  const bookingRows: (typeof schema.bookings.$inferInsert)[] = [];
  const reviewRows: (typeof schema.reviews.$inferInsert)[] = [];
  const ratingAgg: Record<string, { sum: number; count: number }> = {};
  const today = todayISO();

  const makeBooking = (
    listingIndex: number,
    guestIndex: number,
    date: string,
    startHour: number,
    hours: number,
    status: "pending" | "confirmed" | "completed" | "cancelled" | "declined",
    opts: { notes?: string; createdAt?: Date; addons?: number[] } = {},
  ) => {
    const l = LISTINGS[listingIndex];
    const listingId = listingIds[listingIndex];
    const addons = (opts.addons ?? []).map((ai) => l.addons[ai]).filter(Boolean);
    const q = quote(l.hourlyRate, hours, addons);
    const id = newId();
    bookingRows.push({
      id,
      code: `KB-${shortId(6)}`,
      listingId,
      guestId: guestIds[guestIndex],
      hostId: hostIds[l.host],
      date,
      startHour,
      endHour: startHour + hours,
      hours,
      currency: l.currency,
      hourlyRate: l.hourlyRate,
      subtotalCents: q.subtotalCents,
      discountCents: q.discountCents,
      addonsCents: q.addonsCents,
      guestFeeCents: q.guestFeeCents,
      hostFeeCents: q.hostFeeCents,
      totalCents: q.totalCents,
      hostPayoutCents: q.hostPayoutCents,
      addons: q.addons,
      notes: opts.notes ?? null,
      status,
      paymentStatus: status === "pending" || status === "declined" ? "unpaid" : status === "cancelled" ? "refunded" : "demo",
      cancellationPolicy: l.policy,
      confirmedAt: status === "confirmed" || status === "completed" ? (opts.createdAt ?? now) : null,
      createdAt: opts.createdAt ?? now,
      updatedAt: opts.createdAt ?? now,
    });
    return id;
  };

  for (const [idxStr, list] of Object.entries(REVIEWS)) {
    const listingIndex = Number(idxStr);
    const l = LISTINGS[listingIndex];
    for (const r of list) {
      const date = addDaysISO(today, -r.daysAgo);
      const start = Math.max(l.opening?.mon?.open ?? 10, 11);
      const bookingId = makeBooking(listingIndex, r.author, date, start, Math.max(l.minHours, 3), "completed", { createdAt: daysAgoDate(r.daysAgo + 6) });
      const [rating, sound, equipment, host, value] = r.rating;
      reviewRows.push({
        id: newId(),
        bookingId,
        listingId: listingIds[listingIndex],
        authorId: guestIds[r.author],
        rating,
        ratingSound: sound,
        ratingEquipment: equipment,
        ratingHost: host,
        ratingValue: value,
        comment: r.comment,
        hostReply: r.reply ?? null,
        createdAt: daysAgoDate(r.daysAgo - 1),
      });
      const agg = (ratingAgg[listingIds[listingIndex]] ??= { sum: 0, count: 0 });
      agg.sum += rating;
      agg.count += 1;
    }
  }

  // Upcoming bookings so the demo calendar shows real availability gaps
  makeBooking(0, 1, addDaysISO(today, 2), 16, 4, "confirmed", { notes: "Voces y guitarras para dos temas. Somos tres.", createdAt: daysAgoDate(3), addons: [0] });
  makeBooking(0, 3, addDaysISO(today, 4), 11, 5, "confirmed", { notes: "Grabación de batería y bajo, base rítmica de 4 temas.", createdAt: daysAgoDate(5) });
  makeBooking(1, 5, addDaysISO(today, 1), 10, 2, "confirmed", { notes: "Cuña de radio, 30 segundos, tres versiones.", createdAt: daysAgoDate(1) });
  makeBooking(2, 3, addDaysISO(today, 3), 19, 3, "confirmed", { createdAt: daysAgoDate(2) });
  makeBooking(3, 6, addDaysISO(today, 6), 12, 6, "pending", { notes: "Día de producción, quiero usar el Prophet y el Juno. Voy solo.", createdAt: daysAgoDate(0.2) });
  makeBooking(7, 1, addDaysISO(today, 5), 12, 5, "confirmed", { createdAt: daysAgoDate(4) });
  makeBooking(11, 7, addDaysISO(today, 9), 11, 8, "confirmed", { notes: "Day one of tracking, full band live to tape.", createdAt: daysAgoDate(6), addons: [0] });
  makeBooking(13, 6, addDaysISO(today, 3), 20, 4, "confirmed", { createdAt: daysAgoDate(2) });

  // Demo artist (guest 0): upcoming confirmed, one pending request, and a past session waiting for a review
  makeBooking(0, 0, addDaysISO(today, 7), 12, 4, "confirmed", { notes: "Voces definitivas para tres temas del EP. Vamos dos personas.", createdAt: daysAgoDate(2), addons: [0] });
  makeBooking(3, 0, addDaysISO(today, 12), 11, 5, "pending", { notes: "Producción de un tema nuevo, me gustaría usar el Juno-60.", createdAt: daysAgoDate(0.1) });
  makeBooking(1, 0, addDaysISO(today, -3), 10, 1, "completed", { notes: "Voz en off para un vídeo corporativo.", createdAt: daysAgoDate(9) });
  makeBooking(5, 0, addDaysISO(today, -40), 18, 3, "cancelled", { createdAt: daysAgoDate(48) });

  await db.insert(schema.bookings).values(bookingRows);
  await db.insert(schema.reviews).values(reviewRows);

  // Aggregate ratings and booking counts
  for (const [i, id] of listingIds.entries()) {
    const agg = ratingAgg[id];
    const count = bookingRows.filter((b) => b.listingId === id && (b.status === "completed" || b.status === "confirmed")).length;
    await db
      .update(schema.listings)
      .set({ ratingAvg: agg ? Math.round((agg.sum / agg.count) * 100) / 100 : 0, ratingCount: agg?.count ?? 0, bookingCount: count + 20 + i * 3 })
      .where(eq(schema.listings.id, id));
  }

  // Blocked dates
  await db.insert(schema.blockedDates).values([
    { listingId: listingIds[0], date: addDaysISO(today, 10), reason: "Mantenimiento" },
    { listingId: listingIds[0], date: addDaysISO(today, 11), reason: "Mantenimiento" },
    { listingId: listingIds[3], date: addDaysISO(today, 8), reason: "Sesión propia" },
    { listingId: listingIds[11], date: addDaysISO(today, 14), reason: "Holiday" },
  ]);

  // Favorites for the demo artist
  await db.insert(schema.favorites).values([
    { userId: guestIds[0], listingId: listingIds[3] },
    { userId: guestIds[0], listingId: listingIds[11] },
    { userId: guestIds[0], listingId: listingIds[7] },
  ]);

  // A conversation between the demo artist and the demo studio
  const convId = newId();
  const demoBooking = bookingRows.find((b) => b.guestId === guestIds[0] && b.listingId === listingIds[0]);
  await db.insert(schema.conversations).values({ id: convId, listingId: listingIds[0], guestId: guestIds[0], hostId: hostIds.demo, bookingId: demoBooking?.id ?? null, lastMessageAt: daysAgoDate(1, 18), createdAt: daysAgoDate(2) });
  await db.insert(schema.messages).values([
    { id: newId(), conversationId: convId, senderId: guestIds[0], body: "Hola Iván, ¿podemos usar el Rhodes en la sesión del jueves? Es para un tema lento.", createdAt: daysAgoDate(2, 11) },
    { id: newId(), conversationId: convId, senderId: hostIds.demo, body: "¡Claro! Lo dejo afinado y microfoneado en estéreo. Si queréis también tengo un Wurlitzer de un amigo esa semana.", createdAt: daysAgoDate(2, 12) },
    { id: newId(), conversationId: convId, senderId: guestIds[0], body: "Perfecto, con el Rhodes de sobra. ¡Gracias!", createdAt: daysAgoDate(1, 18) },
  ]);
}
