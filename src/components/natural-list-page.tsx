import { createClient } from "@/lib/supabase/server";
import { naturalFromRow } from "@/lib/naturalWisdom";
import { NaturalCard } from "@/components/natural-card";
import { naturalWisdomSchema, type NaturalWisdomEntry } from "@/types/naturalWisdom";
import honeybeeJson from "../../examples/natural-wisdom.example.json";

const honeybee = naturalWisdomSchema.parse({
  ...honeybeeJson,
  status: "published",
  publishedAt: new Date().toISOString(),
});

export async function NaturalListPage({ title, types, level }: { title: string; types?: string[]; level?: string }) {
  const db = await createClient();
  let items: NaturalWisdomEntry[] = [];

  if (db) {
    let query = db.from("natural_wisdom_entries").select("*").eq("status", "published").order("published_at", { ascending: false });
    if (types) query = query.in("entry_type", types);
    if (level) query = query.eq("ymos_level", level);
    const { data } = await query;
    items = (data ?? []).map((row) => naturalFromRow(row));
  }

  const sampleMatches = (!types || types.includes(honeybee.entryType)) && (!level || level === honeybee.ymosLevel);
  if (sampleMatches && !items.some((item) => item.slug === honeybee.slug)) items.push(honeybee);

  return <div className="mx-auto max-w-7xl px-5 py-10">
    <h1 className="text-4xl">{title}</h1>
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <NaturalCard item={item} key={item.slug} />)}</div>
    {!items.length && <p className="card mt-8 p-10 text-center sans">尚無已發布條目。</p>}
  </div>;
}
