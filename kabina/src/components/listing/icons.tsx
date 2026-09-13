import {
  Wifi, VolumeX, DoorClosed, Headphones, Guitar, Snowflake, Sofa, Utensils, Coffee, Bath, CarFront, Clock, Accessibility, Sun, Video, Package,
  Sliders, Speaker, Mic2, Cable, Laptop, Box,
} from "lucide-react";
import type { Amenity, EquipmentCategory } from "@/lib/constants";

export const AMENITY_ICONS: Record<Amenity, typeof Wifi> = {
  wifi: Wifi,
  soundproof: VolumeX,
  isolation_booth: DoorClosed,
  engineer_onsite: Headphones,
  instruments: Guitar,
  ac: Snowflake,
  lounge: Sofa,
  kitchen: Utensils,
  coffee: Coffee,
  bathroom: Bath,
  parking: CarFront,
  access_24h: Clock,
  accessible: Accessibility,
  natural_light: Sun,
  streaming: Video,
  storage: Package,
};

export const EQUIPMENT_ICONS: Record<EquipmentCategory, typeof Wifi> = {
  console: Sliders,
  monitors: Speaker,
  microphones: Mic2,
  preamps: Cable,
  daw: Laptop,
  instruments: Guitar,
  other: Box,
};
