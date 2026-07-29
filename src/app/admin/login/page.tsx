import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signIn } from "../actions";

export const metadata = { title: "管理者登入" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const client = await createClient();
  const { data } = client ? await client.auth.getUser() : { data: { user: null } };
  if (data.user) redirect("/admin");
  const { error } = await searchParams;
  return <div className="max-w-md mx-auto px-5 py-20"><p className="eyebrow">EDITOR SIGN IN</p><h1 className="text-4xl mt-3">管理者登入</h1><p className="sans text-sm text-[#6d706b] mt-5">使用 Supabase 中建立的管理者帳號。</p>{error&&<p className="sans text-sm mt-6 p-3 border border-red-800/30 text-red-900">{error==="config"?"尚未設定 Supabase 環境變數":error}</p>}<form action={signIn} className="mt-9 space-y-5"><label className="sans text-sm block">電子郵件<input name="email" type="email" required className="block w-full mt-2 p-3 bg-white/60 border border-[#34423a]/20"/></label><label className="sans text-sm block">密碼<input name="password" type="password" required className="block w-full mt-2 p-3 bg-white/60 border border-[#34423a]/20"/></label><button className="sans w-full p-3 bg-[#34423a] text-[#f5f1e8]">登入後台</button></form></div>;
}
