import type { CaseKind } from "./types";
export interface CaseOccurrence { kind: CaseKind; normalizedName: string; articleDate: string; articleId?: string }
export interface DuplicateResult { allowed: boolean; previousDay: CaseOccurrence[]; within30Days: CaseOccurrence[]; message: string }
export const normalizeCaseName=(name:string)=>name.normalize("NFKC").trim().toLocaleLowerCase("zh-Hant").replace(/[\s·・|｜—–_-]+/g,"");
const daysBetween=(newer:string,older:string)=>Math.floor((Date.parse(`${newer}T00:00:00Z`)-Date.parse(`${older}T00:00:00Z`))/86_400_000);
export function checkCaseDuplicates(candidate:{date:string;cases:Array<{kind:CaseKind;name:string}>},history:CaseOccurrence[]):DuplicateResult{
  const wanted=new Set(candidate.cases.map(x=>`${x.kind}:${normalizeCaseName(x.name)}`));
  const matches=history.filter(x=>wanted.has(`${x.kind}:${normalizeCaseName(x.normalizedName)}`)).map(x=>({...x,normalizedName:normalizeCaseName(x.normalizedName)}));
  const previousDay=matches.filter(x=>daysBetween(candidate.date,x.articleDate)===1);
  const within30Days=matches.filter(x=>{const d=daysBetween(candidate.date,x.articleDate);return d>=0&&d<30});
  const allowed=previousDay.length===0&&within30Days.length===0;
  return {allowed,previousDay,within30Days,message:allowed?"檢查通過，可發布。":previousDay.length?"與前一日案例重複，禁止發布。":"案例在過去 30 天內已出現，禁止發布。"};
}
