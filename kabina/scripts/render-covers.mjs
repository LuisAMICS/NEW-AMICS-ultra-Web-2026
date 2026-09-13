import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const scenes = ["control", "booth", "live", "lounge"];
const html = `<html><body style="margin:0;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;width:1200px">
${scenes.map((s) => `<div>${readFileSync(`public/covers/${s}-${scenes.indexOf(s)}.svg`, "utf8").replace(/width="1200" height="800"/, 'width="590" height="393"')}</div>`).join("")}
</body></html>`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1216, height: 820 } });
await page.setContent(html);
await page.screenshot({ path: process.argv[2], fullPage: true });
await browser.close();
console.log("rendered");
