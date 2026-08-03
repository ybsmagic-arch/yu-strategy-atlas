import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const db = await createClient();
  if (!db) redirect("/admin/login?error=config");
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");
  return { db, user: data.user };
}
