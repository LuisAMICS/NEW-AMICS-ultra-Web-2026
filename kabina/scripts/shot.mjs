// Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [fullPage=1]
import { chromium } from "@playwright/test";
const [url, out, w = "1280", h = "900", full = "1"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
const res = await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: full === "1" });
console.log("status", res?.status(), "->", out);
if (errors.length) console.log(errors.join("\n"));
await browser.close();
