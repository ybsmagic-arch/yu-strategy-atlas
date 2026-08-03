import Link from "next/link";
const items=[["/","工作台"],["/research","六大研究庫"],["/tcm","中醫藥系統"],["/ymos-takeaways","YMOS 取經"],["/links/knowledge","知識好站"],["/links/tcm","中醫好站"],["/topics","主題標籤"],["/inbox","待審核"],["/search","全站搜尋"],["/admin/research","文章匯入"],["/admin/tcm","中醫匯入"],["/admin/links","連結管理"]];
export function WorkbenchNav(){return <div className="border-b border-[#34423a]/15 bg-[#ebe7de]"><nav className="sans mx-auto flex max-w-7xl gap-5 overflow-x-auto whitespace-nowrap px-5 py-3 text-sm">{items.map(([href,label])=><Link key={label} href={href}>{label}</Link>)}</nav></div>}
