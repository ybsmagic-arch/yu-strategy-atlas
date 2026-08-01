import { describe,expect,it } from "vitest";
import example from "@/data/strategy-case.example.json";
import { slugifyStrategyCase,strategyCaseSchema } from "./strategyCase";

describe("StrategyCase schema",()=>{
 it("accepts the complete example with six YMOS fields",()=>{const parsed=strategyCaseSchema.parse(example);expect(Object.keys(parsed.ymos)).toHaveLength(6);expect(parsed.actions.actionItems).toHaveLength(3);});
 it("rejects an incomplete case",()=>{expect(strategyCaseSchema.safeParse({caseDate:"2026-08-01"}).success).toBe(false);});
 it("creates safe slugs",()=>expect(slugifyStrategyCase("2026-08-01 Costco Trust")).toBe("2026-08-01-costco-trust"));
});
