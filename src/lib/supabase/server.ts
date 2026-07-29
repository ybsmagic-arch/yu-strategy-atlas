import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
type CookieToSet = { name: string; value: string; options?: CookieOptions };
export async function createClient(){const store=await cookies();const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)return null;return createServerClient(url,key,{cookies:{getAll:()=>store.getAll(),setAll(values:CookieToSet[]){try{values.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}})}
