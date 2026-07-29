import { describe, expect, it } from "vitest";
import { parseResearchMarkdown } from "./markdown-parser";

describe("parseResearchMarkdown", () => {
  it("擷取標題、三類案例與標籤", () => {
    const result = parseResearchMarkdown(`# 信任如何成為複利

摘要：從三個案例理解信任。
企業名稱：好市多
人物名稱：唐太宗
IP 名稱：航海王
兵法出處：上下同欲者勝
標籤：信任、組織、品牌`);
    expect(result.title).toBe("信任如何成為複利");
    expect(result.companyName).toBe("好市多");
    expect(result.leaderName).toBe("唐太宗");
    expect(result.ipName).toBe("航海王");
    expect(result.tags).toEqual(["信任", "組織", "品牌"]);
  });
});
