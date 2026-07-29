import { describe,expect,it } from "vitest";
import { checkCaseDuplicates,normalizeCaseName } from "./duplicate-check";

describe("normalizeCaseName",()=>{it("正規化全形、空白與分隔符",()=>{expect(normalizeCaseName("ＣＯＳＴＣＯ｜好市多")).toBe("costco好市多")})});
describe("checkCaseDuplicates",()=>{
 const history=[{kind:"company" as const,normalizedName:"Costco 好市多",articleDate:"2026-07-28"},{kind:"leader" as const,normalizedName:"唐太宗",articleDate:"2026-07-05"},{kind:"ip" as const,normalizedName:"寶可夢",articleDate:"2026-06-01"}];
 it("禁止前一日重複",()=>{const r=checkCaseDuplicates({date:"2026-07-29",cases:[{kind:"company",name:"Costco｜好市多"}]},history);expect(r.allowed).toBe(false);expect(r.previousDay).toHaveLength(1);expect(r.message).toContain("前一日")});
 it("禁止過去 30 天重複",()=>{const r=checkCaseDuplicates({date:"2026-07-29",cases:[{kind:"leader",name:"唐太宗"}]},history);expect(r.allowed).toBe(false);expect(r.within30Days).toHaveLength(1)});
 it("允許 30 天以前案例",()=>{const r=checkCaseDuplicates({date:"2026-07-29",cases:[{kind:"ip",name:"寶可夢"}]},history);expect(r.allowed).toBe(true)});
 it("不同種類同名不視為重複",()=>{const r=checkCaseDuplicates({date:"2026-07-29",cases:[{kind:"ip",name:"Costco 好市多"}]},history);expect(r.allowed).toBe(true)});
});
