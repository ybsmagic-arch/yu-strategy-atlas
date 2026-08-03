import Link from "next/link";
import Image from "next/image";
import {createClient} from "@/lib/supabase/server";
import {WorkbenchNav} from "@/components/workbench-nav";
import {signOut} from "@/app/admin/actions";

export async function Header(){
 const db=await createClient();const {data}=db?await db.auth.getUser():{data:{user:null}};
 return <header className="sticky top-0 z-50 bg-[#f5f1e8]/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5"><Link href="/" className="flex items-center gap-3"><Image src="/yu-tcm-logo.png" alt="余氏中醫 YU TCM" width={56} height={56} priority className="h-14 w-14 object-contain"/><span><b className="block text-sm tracking-[.12em]">YMOS Knowledge Platform</b><small className="sans text-[10px] tracking-[.15em] text-[#6d706b]">YU STRATEGY ATLAS · 余氏中醫</small></span></Link><div className="sans flex items-center gap-4 text-xs"><Link href="/research">知識作業系統</Link><Link href="/tcm">中醫藥系統</Link><Link href="/links" className="hidden sm:inline">好站連結</Link><Link href="/ymos-takeaways" className="hidden lg:inline">YMOS 取經</Link><Link href={data.user?"/admin":"/admin/login"}>{data.user?"管理中心":"管理者登入"}</Link>{data.user&&<form action={signOut}><button type="submit" className="border px-2 py-1">登出</button></form>}</div></div>{data.user&&<WorkbenchNav/>}</header>
}
