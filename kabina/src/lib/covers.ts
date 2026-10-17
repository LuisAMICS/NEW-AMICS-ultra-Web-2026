export const COVER_SCENES = ["control", "booth", "live", "lounge"] as const;
export const COVER_PALETTES = [0, 1, 2, 3, 4, 5] as const;
export const COVERS = COVER_PALETTES.flatMap((p) => COVER_SCENES.map((s) => `/covers/${s}-${p}.svg`));

export const TIMEZONES = [
  "Europe/Madrid",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Argentina/Buenos_Aires",
  "America/Montevideo",
  "America/Sao_Paulo",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Atlantic/Canary",
] as const;

export const COUNTRY_CODES = ["ES", "PT", "MX", "CO", "AR", "CL", "PE", "UY", "BR", "US", "GB", "FR", "DE", "IT", "NL", "IE"] as const;
