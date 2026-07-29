import Link from "next/link";
import { Menu, Search } from "lucide-react";

const nav = [["/articles","每日研究"],["/companies","企業"],["/leaders","政權人物"],["/ips","IP"],["/stratagems","兵法"],["/ymos","YMOS 六層"]];

export function Header() {
  return <header className="border-b border-[#34423a]/15 bg-[#f5f1e8]/90 backdrop-blur-md sticky top-0 z-50">
    <div className="mx-auto max-w-7xl px-5 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3"><span className="grid place-items-center w-10 h-10 rounded-full border border-[#b59962] text-[#34423a] text-lg">余</span><span><b className="block tracking-[.12em] text-sm">余氏案例智庫</b><small className="sans text-[10px] tracking-[.18em] text-[#6d706b]">YU STRATEGY ATLAS</small></span></Link>
      <nav className="hidden lg:flex items-center gap-7 sans text-sm text-[#505751]">{nav.map(([href,label])=><Link key={href} href={href} className="hover:text-[#9b7d46]">{label}</Link>)}</nav>
      <div className="flex items-center gap-4"><button aria-label="搜尋"><Search size={19}/></button><button aria-label="開啟選單" className="lg:hidden"><Menu size={22}/></button><Link href="/admin" className="hidden sm:block sans text-xs px-4 py-2 border border-[#34423a]/30">管理入口</Link></div>
    </div>
  </header>;
}
