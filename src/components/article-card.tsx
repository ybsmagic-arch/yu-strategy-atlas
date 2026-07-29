import Link from "next/link";
import type { Article } from "@/lib/types";

export function ArticleCard({article}:{article:Article}) { return <Link href={`/articles/${article.slug}`} className="card block p-6 sm:p-8 group"><div className="eyebrow mb-5">{article.publishedAt.replaceAll("-"," · ")}</div><h3 className="text-xl sm:text-2xl leading-relaxed group-hover:text-[#66745f]">{article.title}</h3><p className="sans text-sm leading-7 text-[#6d706b] mt-4">{article.excerpt}</p><div className="mt-7 pt-5 border-t border-[#34423a]/10 flex flex-wrap gap-2">{article.tags.slice(0,3).map(tag=><span key={tag} className="sans text-[11px] px-3 py-1 bg-[#dce0d4]/60 text-[#53604f]">{tag}</span>)}</div></Link> }
