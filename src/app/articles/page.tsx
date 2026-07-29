import { getPublishedArticles } from "@/lib/articles-repository";
import { ArticleCard } from "@/components/article-card";
export const metadata={title:"每日研究"};
export default async function ArticlesPage(){const articles=await getPublishedArticles();return <div className="max-w-7xl mx-auto px-5 py-16"><p className="eyebrow">ARCHIVE</p><h1 className="text-4xl mt-3">每日完整研究</h1><p className="sans text-[#6d706b] mt-5">依日期閱讀企業、領導者與 IP 的交叉案例。</p><div className="grid md:grid-cols-2 gap-5 mt-12">{articles.map(a=><ArticleCard key={a.id} article={a}/>)}</div></div>}
