import Link from "next/link";
const groups=[
 {label:"知識書架",items:[["/research","六大研究庫"],["/tcm","中醫藥系統"],["/ymos-takeaways","YMOS 取經"],["/topics","主題標籤"],["/search","全站搜尋"]]},
 {label:"好站典藏",items:[["/links/knowledge","知識好站"],["/links/tcm","中醫好站"]]},
 {label:"專業工具",items:[["/body-atlas","人體知識系統"],["/nature","自然智慧"],["/thoughts","思想筆記"],["/articles","案例文章"]]},
 {label:"編修管理",items:[["/inbox","審核與發布"],["/admin/research","文章匯入"],["/admin/tcm","中醫匯入"],["/admin/links","連結管理"],["/admin/account","帳號安全"]]},
] as const;
export function WorkbenchNav(){return <div className="border-t border-[#34423a]/10 bg-[#ebe7de]"><div className="sans mx-auto flex max-w-7xl justify-end px-5 py-2"><details className="quiet-menu relative"><summary className="cursor-pointer list-none text-xs tracking-[.14em] text-[#596258]">第二層書架 ＋</summary><div className="absolute right-0 top-8 grid w-[min(48rem,calc(100vw-2rem))] gap-5 border border-[#34423a]/15 bg-[#fffdf7] p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-4">{groups.map(group=><section key={group.label}><h2 className="mb-2 text-xs tracking-[.16em] text-[#8c7445]">{group.label}</h2>{group.items.map(([href,label])=><Link prefetch={false} key={label} href={href} className="block border-b border-[#34423a]/10 py-2 text-sm last:border-0">{label}</Link>)}</section>)}</div></details></div></div>}
