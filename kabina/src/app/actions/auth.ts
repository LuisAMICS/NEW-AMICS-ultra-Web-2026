"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getT } from "@/lib/i18n";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { newId } from "@/lib/utils";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> } | null;

function safeNext(value: FormDataEntryValue | null, fallback = "/account/bookings") {
  const s = typeof value === "string" ? value : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : fallback;
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { t } = await getT();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const db = await getDb();
  const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: t.auth.errors.invalid };
  }
  await createSession(user.id);
  redirect(next === "/account/bookings" && user.isHost ? "/host" : next);
}

export async function loginDemo(formData: FormData) {
  const role = formData.get("role") === "host" ? "host" : "guest";
  const account = DEMO_ACCOUNTS[role];
  const db = await getDb();
  const user = await db.query.users.findFirst({ where: eq(schema.users.email, account.email) });
  if (!user) redirect("/login");
  await createSession(user.id);
  const next = safeNext(formData.get("next"), role === "host" ? "/host" : "/account/bookings");
  redirect(next);
}

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { t, locale } = await getT();
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: String(formData.get("email") ?? "").toLowerCase(),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] = key === "name" ? t.auth.errors.name : key === "email" ? t.auth.errors.email : t.auth.errors.weak;
    }
    return { fieldErrors };
  }
  const wantsHost = formData.get("host") === "1";
  const next = safeNext(formData.get("next"), wantsHost ? "/host/listings/new" : "/account/bookings");
  const db = await getDb();
  const exists = await db.query.users.findFirst({ where: eq(schema.users.email, parsed.data.email), columns: { id: true } });
  if (exists) return { fieldErrors: { email: t.auth.errors.exists } };
  const id = newId();
  await db.insert(schema.users).values({
    id,
    email: parsed.data.email,
    name: parsed.data.name,
    passwordHash: hashPassword(parsed.data.password),
    isHost: wantsHost,
    locale,
  });
  await createSession(id);
  redirect(next);
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function becomeHost() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/profile?host=1");
  const db = await getDb();
  await db.update(schema.users).set({ isHost: true, updatedAt: new Date() }).where(eq(schema.users.id, user.id));
  redirect("/host/listings/new");
}
