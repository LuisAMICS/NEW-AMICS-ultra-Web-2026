import { NextResponse } from "next/server";
import { getDb, isDemoMode, schema } from "@/db";
import { count } from "drizzle-orm";

export async function GET() {
  const db = await getDb();
  const [row] = await db.select({ n: count() }).from(schema.listings);
  return NextResponse.json({ ok: true, demo: isDemoMode, listings: Number(row.n) });
}
