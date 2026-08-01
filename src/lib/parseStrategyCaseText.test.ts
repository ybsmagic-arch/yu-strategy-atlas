import { describe, expect, it } from "vitest";
import { parseStrategyCaseText } from "./parseStrategyCaseText";
import { strategyCaseSchema } from "@/types/strategyCase";

describe("parseStrategyCaseText", () => {
  it("creates a valid pending-review case from plain text", () => {
    const item = parseStrategyCaseText(`# 2026-08-01 每日案例\n企業名稱：任天堂\n## 企業案例\n以角色資產建立飛輪。\n## 領導者案例\n制度先於個人。\n## IP 案例\nIP 名稱：寶可夢\n跨媒體敘事。\n## 兵法對照\n勝兵先勝。\n## YMOS 六層\n理解系統。\n## 行動建議\n- 建立內容節奏\n- 追蹤回購\n## 風險提醒\n單一平台依賴。\nhttps://example.com/source`);
    expect(strategyCaseSchema.safeParse(item).success).toBe(true);
    expect(item.status).toBe("pending_review");
    expect(item.company.name).toBe("任天堂");
    expect(item.sources[0].url).toBe("https://example.com/source");
  });
});
