import type { SupabaseClient } from "@supabase/supabase-js";
import { thoughtSchema, type Thought } from "@/types/thought";

export async function listThoughts(db: SupabaseClient, filters: Record<string,string|undefined> = {}) {
  let q = db.from("ymos_thoughts").select("*");
  if (filters.q) q = q.or(`title.ilike.%${filters.q}%,summary.ilike.%${filters.q}%,content.ilike.%${filters.q}%,category.ilike.%${filters.q}%,source_reference.ilike.%${filters.q}%`);
  for (const key of ["thought_type","category","primary_element","status","maturity_level"] as const) if (filters[key]) q = q.eq(key, filters[key]!);
  if (filters.favorite === "true") q = q.eq("is_favorite", true);
  if (filters.from) q = q.gte("thought_date", filters.from); if (filters.to) q = q.lte("thought_date", filters.to);
  const order = filters.order === "oldest" ? ["thought_date", true] : filters.order === "newest" ? ["thought_date", false] : ["updated_at", false];
  const { data, error } = await q.order(order[0] as string, { ascending: order[1] as boolean });
  return error ? [] : (data as Thought[]);
}

export function validateThoughtJson(value: unknown) {
  const rows = Array.isArray(value) ? value : [value];
  return rows.map((row, index) => {
    const result = thoughtSchema.omit({ id:true, slug:true, created_at:true, updated_at:true, published_at:true }).safeParse(row);
    return result.success ? { index, data: result.data } : { index, errors: result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`) };
  });
}
