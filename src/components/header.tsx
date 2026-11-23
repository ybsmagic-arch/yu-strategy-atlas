import Link from "next/link";
import Image from "next/image";
import {WorkbenchNav} from "@/components/workbench-nav";
import {headers} from "next/headers";
import {getCurrentUser} from "@/lib/auth";

const primary=[
 ["/","工作台"],
 ["/sites","網站戶籍"],
 ["/sites?view=incubator","網站孵化"],
 ["/research","知識系統"],
 ["/admin","管理中心"],
] as const;

export async function Header(){
 const loginPage=(await headers()).get("x-atlas-login-page")==="true";
 const user=loginPage?null:await getCurrentUser();
 return <header className="sticky top-0 z-50 border-b border-[#34423a]/10 bg-[#f5f1e8]/95 backdrop-blur"><div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 py-2"><Link href="/" className="flex min-w-0 items-center gap-3"><Image src="/yu-tcm-logo.png" alt="余氏中醫 YU TCM" width={52} height={52} priority className="h-13 w-13 shrink-0 object-contain"/><span className="min-w-0"><b className="block truncate text-sm tracking-[.12em]">YMOS｜余氏總知識網站管理中心</b><small className="sans hidden text-[10px] tracking-[.15em] text-[#6d706b] sm:block">藏萬卷於內，留一室清明於外</small></span></Link><nav aria-label="主要導覽" className="sans hidden items-center gap-5 text-sm md:flex">{primary.map(([href,label])=><Link href={href} key={label} className="whitespace-nowrap hover:text-[#8c7445]">{label}</Link>)}</nav><details className="quiet-menu sans relative md:hidden"><summary aria-label="開啟主要導覽" className="cursor-pointer list-none border border-[#34423a]/25 px-3 py-2 text-sm">選單</summary><nav aria-label="手機主要導覽" className="absolute right-0 top-12 w-52 border border-[#34423a]/15 bg-[#fffdf7] p-2 shadow-lg">{primary.map(([href,label])=><Link href={href} key={label} className="block border-b border-[#34423a]/10 px-3 py-3 last:border-0">{label}</Link>)}</nav></details></div>{user&&<WorkbenchNav/>}</header>
}
