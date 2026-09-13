import { ImageResponse } from "next/og";

export const alt = "Kabina · Reserva estudios de grabación por horas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "linear-gradient(135deg, #2a1f14 0%, #0f0e0c 55%, #1a0d0e 100%)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f7b32b", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 5, padding: "0 0 12px" }}>
              <div style={{ width: 6, height: 14, borderRadius: 3, background: "#0f0e0c" }} />
              <div style={{ width: 6, height: 24, borderRadius: 3, background: "#0f0e0c" }} />
              <div style={{ width: 6, height: 18, borderRadius: 3, background: "#0f0e0c" }} />
            </div>
            <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>kabina</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 56, fontSize: 18, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#ffcd4d" }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "#e5484d" }} />
            Estudios de grabación por horas
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, marginTop: 16, maxWidth: 900 }}>Tu próxima sesión empieza aquí</div>
          <div style={{ fontSize: 30, color: "#bcb5a9", marginTop: 22, maxWidth: 840, lineHeight: 1.35 }}>Estudios de grabación, salas de mezcla, locales de ensayo y sets de podcast. Precio cerrado, disponibilidad real y pago seguro.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#968f84", fontSize: 22 }}>
          <span>kabina.studio</span>
          <span>Reserva · Graba · Reseña</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
