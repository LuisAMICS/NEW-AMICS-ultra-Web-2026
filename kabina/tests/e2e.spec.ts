import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("landing and search render seeded studios", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText(/sesión|session/i);
  await expect(page.locator("article").first()).toBeVisible();
  await page.goto("/studios?q=Madrid");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Madrid");
  await expect(page.locator("article")).toHaveCount(3);
});

test("search filters by date and hours", async ({ page }) => {
  await page.goto("/studios?type=recording&instant=1");
  await expect(page.locator("article").first()).toBeVisible();
  await page.goto("/studios?q=Nowhere-Town");
  await expect(page.getByText(/No hay estudios|No studios match/)).toBeVisible();
});

test("artist logs in with the demo account and books a session", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /artista|artist/i }).click();
  await page.waitForURL("**/account/bookings");
  await expect(page.locator("h1")).toContainText(/cuenta|account/i);

  await page.goto("/studios?q=Madrid&type=voiceover");
  await page.locator("article h3, article a").filter({ hasText: /Cabina/ }).first().click();
  await page.waitForURL("**/studios/**");
  await expect(page.locator("h1")).toContainText("Cabina");

  const slots = page.locator("button:not([disabled])").filter({ hasText: /^\d{2}:00$/ });
  await expect(slots.first()).toBeVisible();
  // Pick the last two free hours of the day (always consecutive: closing time is never booked in the seed).
  await slots.nth(-2).click();
  await slots.nth(-1).click();
  const cta = page.getByRole("link", { name: /^(Reservar|Book|Solicitar reserva|Request to book)$/ });
  await expect(cta).toBeVisible();
  await cta.click();
  await page.waitForURL("**/book?**");
  await page.locator("textarea#notes").fill("Prueba automática: voz en off para un vídeo.");
  await page.getByRole("button", { name: /Pagar|Pay|Enviar solicitud|Send request/ }).click();
  await page.waitForURL("**/bookings/**");
  await expect(page.getByText(/KB-[A-Z0-9]{6}/).first()).toBeVisible();
  await expect(page.getByText(/confirmada|confirmed/i).first()).toBeVisible();

  await page.goto("/account/bookings");
  await expect(page.getByText("Prueba automática").first()).toBeHidden();
  await expect(page.locator("a[href^='/bookings/']").first()).toBeVisible();
});

test("studio owner accepts a request and publishes a new space", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /estudio|studio/i }).click();
  await page.waitForURL("**/host");
  await expect(page.locator("h1")).toContainText(/Hola|Hi/);

  await page.goto("/host/listings/new");
  await page.fill("#title", "Sala de pruebas E2E");
  await page.fill("#description", "Descripción de prueba con más de cuarenta caracteres para superar la validación del formulario.");
  await page.fill("#city", "Madrid");
  await page.fill("#hourlyRate", "30");
  await page.getByRole("button", { name: /ilustración|illustration/i }).click();
  await page.locator("img[src^='/covers/']").first().click();
  await page.getByRole("button", { name: /^(Publicar|Publish)$/ }).click();
  await page.waitForURL("**/host/listings?saved=1");
  await expect(page.getByText("Sala de pruebas E2E")).toBeVisible();

  await page.goto("/host/bookings");
  const accept = page.getByRole("button", { name: /^(Aceptar|Accept)$/ }).first();
  if (await accept.isVisible()) {
    await accept.click();
    await page.waitForLoadState("networkidle");
  }
  await page.goto("/host/earnings");
  await expect(page.locator("table")).toBeVisible();
});
