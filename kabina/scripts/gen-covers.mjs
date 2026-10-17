// Generates the illustrated studio "covers" used by the seed data.
// Output: public/covers/{scene}-{palette}.svg  (4 scenes × 6 palettes)
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1200;
const H = 800;

const PALETTES = [
  { name: "amber", bg1: "#2a1f14", bg2: "#0f0e0c", wall: "#3a2c1c", panel: "#4a3823", accent: "#f7b32b", glow: "#ffcd4d", wood: "#7a4c0c", light: "#ffe08a" },
  { name: "teal", bg1: "#0f2a2c", bg2: "#0a1416", wall: "#153a3d", panel: "#1d4c50", accent: "#5fd3c8", glow: "#8be9de", wood: "#5a4632", light: "#c9fff8" },
  { name: "plum", bg1: "#2a1430", bg2: "#120a16", wall: "#3a1d44", panel: "#4b2758", accent: "#e88bff", glow: "#f2b1ff", wood: "#6b4c3b", light: "#ffd8ff" },
  { name: "forest", bg1: "#14281a", bg2: "#0a130c", wall: "#1c3a24", panel: "#264a30", accent: "#9be15d", glow: "#c3f58f", wood: "#6d5033", light: "#e8ffd0" },
  { name: "rust", bg1: "#2e1a12", bg2: "#140b08", wall: "#452619", panel: "#5a3222", accent: "#ff7a45", glow: "#ffa17a", wood: "#8a5a3a", light: "#ffd9c7" },
  { name: "slate", bg1: "#151c2e", bg2: "#0a0d16", wall: "#1f2a44", panel: "#2a3860", accent: "#7ea6ff", glow: "#a9c4ff", wood: "#5c5266", light: "#dbe6ff" },
];

const defs = (p, id) => `
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.bg1}"/><stop offset="1" stop-color="${p.bg2}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${p.glow}" stop-opacity="0.75"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.wood}" stop-opacity="0.9"/><stop offset="1" stop-color="${p.bg2}"/>
    </linearGradient>
    <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.light}" stop-opacity="0.22"/><stop offset="1" stop-color="${p.light}" stop-opacity="0.04"/>
    </linearGradient>
    <filter id="blur-${id}"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="soft-${id}"><feGaussianBlur stdDeviation="4"/></filter>
  </defs>`;

const wrap = (p, id, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Studio illustration">${defs(p, id)}
  <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
  ${body}
  <rect width="${W}" height="${H}" fill="none"/>
</svg>`;

// Acoustic panel grid on the back wall.
function panels(p, x, y, cols, rows, w, h, gap, opacity = 1) {
  let s = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shade = (r + c) % 2 === 0 ? p.panel : p.wall;
      s += `<rect x="${x + c * (w + gap)}" y="${y + r * (h + gap)}" width="${w}" height="${h}" rx="6" fill="${shade}" opacity="${opacity}"/>`;
    }
  }
  return s;
}

function floor(p, id, y) {
  return `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="url(#floor-${id})"/>
  <g stroke="${p.bg2}" stroke-opacity="0.35" stroke-width="2">${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 150}" y1="${y}" x2="${(i - 4) * 320 + 600}" y2="${H}"/>`).join("")}</g>`;
}

function knobRow(p, x, y, n, step, r = 7) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += `<circle cx="${x + i * step}" cy="${y}" r="${r}" fill="#1a1713" stroke="#3a352d" stroke-width="2"/><line x1="${x + i * step}" y1="${y}" x2="${x + i * step + 3}" y2="${y - r + 2}" stroke="${p.accent}" stroke-width="2"/>`;
  }
  return s;
}

function faders(p, x, y, n, step) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const pos = 20 + ((i * 37) % 60);
    s += `<rect x="${x + i * step}" y="${y}" width="4" height="90" rx="2" fill="#12100d"/><rect x="${x + i * step - 8}" y="${y + pos}" width="20" height="14" rx="3" fill="#e9e2d5"/>`;
  }
  return s;
}

function monitor(p, x, y, w = 110, h = 170) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#1c1916" stroke="#3a352d" stroke-width="3"/>
  <circle cx="${x + w / 2}" cy="${y + h * 0.62}" r="${w * 0.3}" fill="#0c0b09" stroke="#4a443a" stroke-width="3"/>
  <circle cx="${x + w / 2}" cy="${y + h * 0.62}" r="${w * 0.12}" fill="#2a2620"/>
  <circle cx="${x + w / 2}" cy="${y + h * 0.25}" r="${w * 0.12}" fill="#0c0b09" stroke="#4a443a" stroke-width="3"/>
  <circle cx="${x + w - 14}" cy="${y + h - 12}" r="3" fill="${p.accent}"/>`;
}

function recLight(x, y) {
  return `<circle cx="${x}" cy="${y}" r="18" fill="#e5484d" opacity="0.35" filter="url(#soft-rec)"/><circle cx="${x}" cy="${y}" r="7" fill="#e5484d"/>`;
}

/* ---------- scene 1: control room ---------- */
function controlRoom(p, id) {
  const wallBottom = 520;
  let s = `<rect x="0" y="0" width="${W}" height="${wallBottom}" fill="${p.wall}"/>`;
  s += panels(p, 40, 40, 6, 3, 110, 90, 14, 0.9);
  s += panels(p, 1000, 40, 2, 3, 80, 90, 14, 0.9);
  // window to the live room
  s += `<rect x="330" y="70" width="540" height="300" rx="18" fill="url(#glass-${id})" stroke="#0c0b09" stroke-width="10"/>`;
  s += `<circle cx="600" cy="220" r="170" fill="url(#glow-${id})" filter="url(#blur-${id})"/>`;
  s += `<g opacity="0.55">${panels(p, 360, 100, 4, 2, 110, 70, 14, 0.5)}</g>`;
  // drum kit silhouette behind glass
  s += `<g fill="#0c0b09" opacity="0.7"><ellipse cx="560" cy="330" rx="70" ry="24"/><circle cx="640" cy="260" r="34"/><ellipse cx="720" cy="230" rx="52" ry="12"/><rect x="718" y="235" width="4" height="100"/><rect x="470" y="280" width="4" height="70"/></g>`;
  s += `<rect x="330" y="70" width="540" height="300" rx="18" fill="none" stroke="${p.light}" stroke-opacity="0.3" stroke-width="3"/>`;
  s += floor(p, id, wallBottom);
  // console desk
  s += `<path d="M120 640 L1080 640 L1010 520 L190 520 Z" fill="#26221d" stroke="#3a352d" stroke-width="4"/>`;
  s += `<path d="M190 522 L1010 522 L1000 560 L200 560 Z" fill="#2f2a24"/>`;
  s += faders(p, 250, 545, 20, 36);
  s += knobRow(p, 250, 590, 21, 34, 6);
  s += `<rect x="470" y="600" width="260" height="20" rx="4" fill="#0c0b09"/>`;
  s += `<g>${Array.from({ length: 24 }, (_, i) => `<rect x="${478 + i * 10.6}" y="${606 - (i % 7)}" width="6" height="${8 + (i % 7)}" fill="${i < 18 ? p.accent : "#e5484d"}" opacity="${0.55 + (i % 3) * 0.15}"/>`).join("")}</g>`;
  // monitors
  s += monitor(p, 150, 350);
  s += monitor(p, 940, 350);
  // screen
  s += `<rect x="520" y="380" width="160" height="110" rx="8" fill="#0c0b09" stroke="#3a352d" stroke-width="4"/>`;
  s += `<g stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.9"><path d="M530 435 ${Array.from({ length: 30 }, (_, i) => `L${530 + i * 4.8} ${435 + Math.sin(i * 1.3) * (8 + (i % 5) * 4)}`).join(" ")}"/></g>`;
  // lamp
  s += `<circle cx="1000" cy="300" r="120" fill="url(#glow-${id})" filter="url(#blur-${id})"/>`;
  s += `<defs><filter id="soft-rec"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
  s += recLight(1120, 70);
  return s;
}

/* ---------- scene 2: vocal booth ---------- */
function booth(p, id) {
  let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="${p.wall}"/>`;
  // foam wedges
  let wedges = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 12; c++) {
      const x = c * 100;
      const y = r * 100;
      const dark = (r + c) % 2 === 0;
      wedges += `<polygon points="${x},${y} ${x + 100},${y} ${x + 50},${y + 50}" fill="${dark ? p.panel : p.wall}"/><polygon points="${x},${y + 100} ${x + 100},${y + 100} ${x + 50},${y + 50}" fill="${dark ? p.wall : p.panel}"/>`;
    }
  }
  s += `<g opacity="0.85">${wedges}</g>`;
  // spotlight cone
  s += `<polygon points="600,-20 250,820 950,820" fill="${p.light}" opacity="0.08"/>`;
  s += `<circle cx="600" cy="330" r="260" fill="url(#glow-${id})" filter="url(#blur-${id})"/>`;
  s += floor(p, id, 620);
  // mic stand
  s += `<rect x="596" y="420" width="8" height="380" fill="#1a1713"/><ellipse cx="600" cy="790" rx="90" ry="14" fill="#1a1713"/>`;
  s += `<line x1="600" y1="430" x2="600" y2="300" stroke="#1a1713" stroke-width="8"/>`;
  // shock mount ring
  s += `<ellipse cx="600" cy="300" rx="62" ry="76" fill="none" stroke="#2a2620" stroke-width="10"/>`;
  // microphone body
  s += `<rect x="565" y="250" width="70" height="120" rx="35" fill="#23201b" stroke="#4a443a" stroke-width="4"/>`;
  s += `<rect x="565" y="250" width="70" height="60" rx="30" fill="#d9d3c8"/>`;
  s += `<g stroke="#8a8378" stroke-width="2">${Array.from({ length: 6 }, (_, i) => `<line x1="572" y1="${258 + i * 8}" x2="628" y2="${258 + i * 8}"/>`).join("")}</g>`;
  s += `<rect x="588" y="322" width="24" height="10" rx="3" fill="${p.accent}"/>`;
  // pop filter
  s += `<circle cx="470" cy="300" r="60" fill="#0c0b09" opacity="0.7" stroke="#2a2620" stroke-width="8"/><circle cx="470" cy="300" r="52" fill="none" stroke="${p.light}" stroke-opacity="0.15" stroke-width="2" stroke-dasharray="4 6"/>`;
  s += `<path d="M530 300 Q560 300 580 300" stroke="#1a1713" stroke-width="8" fill="none"/>`;
  // headphones hanging
  s += `<path d="M760 190 a70 70 0 0 1 140 0" stroke="#1a1713" stroke-width="12" fill="none"/><rect x="746" y="185" width="30" height="60" rx="12" fill="#1a1713"/><rect x="884" y="185" width="30" height="60" rx="12" fill="#1a1713"/><rect x="752" y="192" width="18" height="46" rx="8" fill="${p.accent}" opacity="0.8"/><rect x="890" y="192" width="18" height="46" rx="8" fill="${p.accent}" opacity="0.8"/>`;
  // music stand
  s += `<rect x="300" y="560" width="6" height="240" fill="#1a1713"/><path d="M240 480 L370 480 L360 560 L250 560 Z" fill="#26221d" stroke="#3a352d" stroke-width="3"/>`;
  s += `<defs><filter id="soft-rec"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
  s += recLight(80, 70);
  return s;
}

/* ---------- scene 3: live / rehearsal room ---------- */
function liveRoom(p, id) {
  const wallBottom = 540;
  let s = `<rect x="0" y="0" width="${W}" height="${wallBottom}" fill="${p.wall}"/>`;
  // wood slats
  s += `<g>${Array.from({ length: 60 }, (_, i) => `<rect x="${i * 20}" y="0" width="8" height="${wallBottom}" fill="${p.wood}" opacity="${i % 3 === 0 ? 0.35 : 0.2}"/>`).join("")}</g>`;
  s += panels(p, 60, 60, 3, 2, 120, 90, 16, 0.95);
  s += panels(p, 780, 60, 3, 2, 120, 90, 16, 0.95);
  // window strip / lights
  s += `<rect x="470" y="40" width="260" height="60" rx="12" fill="url(#glass-${id})" stroke="#0c0b09" stroke-width="6"/>`;
  s += `<circle cx="600" cy="120" r="200" fill="url(#glow-${id})" filter="url(#blur-${id})"/>`;
  s += floor(p, id, wallBottom);
  // rug
  s += `<ellipse cx="600" cy="660" rx="420" ry="110" fill="${p.accent}" opacity="0.18"/><ellipse cx="600" cy="660" rx="380" ry="90" fill="none" stroke="${p.accent}" stroke-opacity="0.35" stroke-width="3"/>`;
  // drum kit
  s += `<g>
    <rect x="655" y="470" width="5" height="200" fill="#1a1713"/><ellipse cx="700" cy="470" rx="80" ry="16" fill="#e0c56b" stroke="#a88a2a" stroke-width="3"/>
    <rect x="485" y="480" width="5" height="190" fill="#1a1713"/><ellipse cx="470" cy="480" rx="60" ry="12" fill="#e0c56b" stroke="#a88a2a" stroke-width="3"/>
    <circle cx="600" cy="620" r="92" fill="#23201b" stroke="#4a443a" stroke-width="8"/><circle cx="600" cy="620" r="62" fill="#e9e2d5"/><circle cx="600" cy="620" r="10" fill="${p.accent}"/>
    <ellipse cx="520" cy="540" rx="46" ry="18" fill="#e9e2d5" stroke="#4a443a" stroke-width="5"/><rect x="474" y="540" width="92" height="36" fill="#23201b"/><ellipse cx="520" cy="576" rx="46" ry="18" fill="#2a2620"/>
    <ellipse cx="690" cy="540" rx="46" ry="18" fill="#e9e2d5" stroke="#4a443a" stroke-width="5"/><rect x="644" y="540" width="92" height="36" fill="#23201b"/><ellipse cx="690" cy="576" rx="46" ry="18" fill="#2a2620"/>
    <ellipse cx="430" cy="600" rx="52" ry="20" fill="#e9e2d5" stroke="#4a443a" stroke-width="5"/><rect x="378" y="600" width="104" height="44" fill="#23201b"/><ellipse cx="430" cy="644" rx="52" ry="20" fill="#2a2620"/>
  </g>`;
  // guitar amp
  s += `<rect x="140" y="560" width="190" height="180" rx="12" fill="#1c1916" stroke="#3a352d" stroke-width="4"/><rect x="150" y="600" width="170" height="130" rx="8" fill="#2a2620"/><g stroke="#4a443a" stroke-width="2">${Array.from({ length: 12 }, (_, i) => `<line x1="150" y1="${606 + i * 10}" x2="320" y2="${606 + i * 10}"/>`).join("")}</g><rect x="150" y="568" width="170" height="24" fill="#12100d"/>${knobRow(p, 175, 580, 5, 30, 6)}<circle cx="310" cy="580" r="4" fill="${p.accent}"/>`;
  // bass amp / cab
  s += `<rect x="900" y="540" width="170" height="200" rx="12" fill="#1c1916" stroke="#3a352d" stroke-width="4"/><circle cx="985" cy="640" r="60" fill="#0c0b09" stroke="#4a443a" stroke-width="4"/><circle cx="985" cy="640" r="20" fill="#2a2620"/>`;
  // keyboard
  s += `<rect x="830" y="470" width="300" height="46" rx="6" fill="#23201b" stroke="#3a352d" stroke-width="3"/><rect x="838" y="486" width="284" height="26" fill="#e9e2d5"/><g fill="#12100d">${Array.from({ length: 20 }, (_, i) => (i % 7 === 2 || i % 7 === 6 ? "" : `<rect x="${846 + i * 14}" y="486" width="8" height="16"/>`)).join("")}</g><rect x="850" y="520" width="6" height="140" fill="#1a1713"/><rect x="1104" y="520" width="6" height="140" fill="#1a1713"/>`;
  // mic stands
  s += `<rect x="238" y="440" width="4" height="320" fill="#1a1713"/><rect x="220" y="400" width="40" height="70" rx="20" fill="#d9d3c8"/>`;
  s += `<defs><filter id="soft-rec"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
  s += recLight(1120, 70);
  return s;
}

/* ---------- scene 4: podcast / lounge ---------- */
function lounge(p, id) {
  const wallBottom = 540;
  let s = `<rect x="0" y="0" width="${W}" height="${wallBottom}" fill="${p.wall}"/>`;
  // brick-ish texture
  s += `<g fill="${p.panel}" opacity="0.5">${Array.from({ length: 14 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${(r % 2) * 60 + c * 120 - 60}" y="${r * 40}" width="112" height="32" rx="3"/>`).join("")).join("")}</g>`;
  // neon sign
  s += `<circle cx="600" cy="150" r="240" fill="url(#glow-${id})" filter="url(#blur-${id})"/>`;
  s += `<text x="600" y="175" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="120" fill="${p.accent}" stroke="${p.light}" stroke-width="2" opacity="0.95">on air</text>`;
  s += `<text x="600" y="175" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="120" fill="${p.accent}" filter="url(#soft-${id})" opacity="0.6">on air</text>`;
  // string lights
  s += `<path d="M0 60 Q300 140 600 60 T1200 60" stroke="#1a1713" stroke-width="3" fill="none"/>${Array.from({ length: 13 }, (_, i) => { const x = i * 100; const y = 60 + Math.sin((i / 12) * Math.PI * 2) * 0 + (i % 2 === 0 ? 30 : 60); return `<circle cx="${x}" cy="${y}" r="7" fill="${p.light}" opacity="0.9"/><circle cx="${x}" cy="${y}" r="16" fill="${p.light}" opacity="0.15"/>`; }).join("")}`;
  s += floor(p, id, wallBottom);
  // round table
  s += `<ellipse cx="600" cy="600" rx="300" ry="90" fill="#26221d" stroke="#3a352d" stroke-width="5"/><ellipse cx="600" cy="600" rx="280" ry="76" fill="${p.wood}" opacity="0.8"/><rect x="590" y="640" width="20" height="130" fill="#1a1713"/><ellipse cx="600" cy="770" rx="120" ry="20" fill="#1a1713"/>`;
  // mics on boom arms
  const mic = (x, y, dir) => `<path d="M${x} ${y + 90} L${x + dir * 60} ${y + 30} L${x + dir * 120} ${y}" stroke="#1a1713" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="${x + dir * 120 - 18}" y="${y - 50}" width="36" height="70" rx="18" fill="#d9d3c8"/><rect x="${x + dir * 120 - 18}" y="${y - 50}" width="36" height="34" rx="16" fill="#8a8378"/><circle cx="${x + dir * 120 - 10}" cy="${y + 10}" r="3" fill="${p.accent}"/>`;
  s += mic(360, 470, 1) + mic(840, 470, -1) + mic(560, 430, 1);
  // headphones on table
  s += `<path d="M700 585 a30 30 0 0 1 60 0" stroke="#1a1713" stroke-width="6" fill="none"/><circle cx="700" cy="590" r="10" fill="#1a1713"/><circle cx="760" cy="590" r="10" fill="#1a1713"/>`;
  // mugs
  s += `<rect x="470" y="580" width="30" height="34" rx="6" fill="${p.accent}"/><path d="M500 590 a10 10 0 0 1 0 18" stroke="${p.accent}" stroke-width="5" fill="none"/>`;
  // sofa
  s += `<rect x="40" y="560" width="280" height="150" rx="24" fill="#2a2620" stroke="#3a352d" stroke-width="4"/><rect x="60" y="540" width="240" height="70" rx="20" fill="#33302a"/><rect x="60" y="600" width="110" height="60" rx="12" fill="#3d3932"/><rect x="190" y="600" width="110" height="60" rx="12" fill="#3d3932"/>`;
  // plant
  s += `<rect x="1020" y="620" width="70" height="90" rx="10" fill="#26221d"/><g fill="#4b8a3c"><ellipse cx="1055" cy="580" rx="24" ry="70" transform="rotate(-25 1055 580)"/><ellipse cx="1055" cy="580" rx="24" ry="70" transform="rotate(25 1055 580)"/><ellipse cx="1055" cy="560" rx="22" ry="80"/></g>`;
  s += `<defs><filter id="soft-rec"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
  s += recLight(1120, 380);
  return s;
}

const SCENES = { control: controlRoom, booth, live: liveRoom, lounge };

mkdirSync("public/covers", { recursive: true });
let count = 0;
for (const [sceneName, draw] of Object.entries(SCENES)) {
  PALETTES.forEach((p, i) => {
    const id = `${sceneName}${i}`;
    const svg = wrap(p, id, draw(p, id));
    writeFileSync(`public/covers/${sceneName}-${i}.svg`, svg);
    count++;
  });
}
console.log(`Generated ${count} covers in public/covers`);
