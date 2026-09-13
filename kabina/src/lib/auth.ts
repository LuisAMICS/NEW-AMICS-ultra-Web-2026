import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/constants";
import { newId } from "@/lib/utils";
import type { User } from "@/db/schema";

export { hashPassword, verifyPassword } from "@/lib/password";

export async function createSession(userId: string) {
  const db = await getDb();
  const id = newId() + newId().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.insert(schema.sessions).values({ id, userId, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) {
    const db = await getDb();
    await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
  }
  store.delete(SESSION_COOKIE);
}

export type SessionUser = Pick<User, "id" | "email" | "name" | "avatarUrl" | "bio" | "isHost" | "locale" | "stripeAccountId" | "createdAt">;

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const db = await getDb();
  const rows = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      avatarUrl: schema.users.avatarUrl,
      bio: schema.users.bio,
      isHost: schema.users.isHost,
      locale: schema.users.locale,
      stripeAccountId: schema.users.stripeAccountId,
      createdAt: schema.users.createdAt,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
});

/** Redirects to the login page (remembering where to come back) when logged out. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

export async function requireHost(next?: string): Promise<SessionUser> {
  const user = await requireUser(next);
  if (!user.isHost) redirect("/account/profile?host=1");
  return user;
}
