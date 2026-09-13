"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export type MapPoint = { id: string; slug: string; title: string; lat: number; lng: number; hourlyRate: number; currency: string; photo?: string | null };

const TILES = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
}

export function StudioMap({ points, locale, activeId, className, interactive = true }: { points: MapPoint[]; locale: Locale; activeId?: string | null; className?: string; interactive?: boolean }) {
  const center = useMemo<[number, number]>(() => (points.length ? [points[0].lat, points[0].lng] : [40.4168, -3.7038]), [points]);
  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={interactive} dragging={interactive} zoomControl={interactive} className={className ?? "h-full w-full"} attributionControl>
      <TileLayer url={TILES} attribution={ATTRIBUTION} subdomains="abcd" maxZoom={19} />
      <FitBounds points={points} />
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={L.divIcon({
            className: "",
            html: `<div class="kb-marker${activeId === p.id ? " is-active" : ""}">${formatMoney(p.hourlyRate, p.currency, locale, { compact: true })}</div>`,
            iconSize: [0, 0],
          })}
        >
          {interactive ? (
            <Popup>
              <div className="w-44">
                {p.photo ? <img src={p.photo} alt="" className="mb-2 aspect-[4/3] w-full rounded-lg object-cover" /> : null}
                <Link href={`/studios/${p.slug}`} className="block text-sm font-semibold leading-snug text-ink-950 hover:underline">
                  {p.title}
                </Link>
                <p className="mt-1 text-xs text-ink-600">
                  {formatMoney(p.hourlyRate, p.currency, locale, { compact: true })} / h
                </p>
              </div>
            </Popup>
          ) : null}
        </Marker>
      ))}
    </MapContainer>
  );
}
