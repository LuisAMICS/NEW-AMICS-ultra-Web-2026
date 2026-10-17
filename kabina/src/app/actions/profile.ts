"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { LOCALE_COOKIE } from "@/lib/constants";
import { isLocale } from "@/lib/i18n/types";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(600).optional(),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")),
  locale: z.string(),
});

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") ?? "",
    avatarUrl: formData.get("avatarUrl") ?? "",
    locale: formData.get("locale") ?? user.locale,
  });
  if (!parsed.success) redirect("/account/profile?error=1");
  const db = await getDb();
  const locale = isLocale(parsed.data.locale) ? parsed.data.locale : "es";
  await db
    .update(schema.users)
    .set({ name: parsed.data.name, bio: parsed.data.bio || null, avatarUrl: parsed.data.avatarUrl || null, locale, updatedAt: new Date() })
    .where(eq(schema.users.id, user.id));
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
  redirect("/account/profile?saved=1");
}
