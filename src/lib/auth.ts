import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { withAuthDeadline } from "@/lib/supabase/auth-deadline";

// React cache is scoped to one server render. It avoids repeated Auth network
// calls inside the same request without sharing user data across requests.
export const getCurrentUser = cache(async () => withAuthDeadline(async (fetcher, signal) => {
  const db = await createClient(fetcher, signal);
  if (!db) return null;
  const { data, error } = await db.auth.getUser();
  return error ? null : data.user;
}).catch(() => null));

export async function requireAdmin() {
  const db = await createClient();
  if (!db) redirect("/admin/login?error=config");
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return { db, user };
}
