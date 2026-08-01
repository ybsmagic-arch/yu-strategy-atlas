import { slugifyStrategyCase, type StrategyCase } from "@/types/strategyCase";

const pending = "待人工確認";

function clean(value: string) {
  return value.replace(/^\s*(?:#{1,6}|[一二三四五六七八九十]+[、.]|\d+[、.)．])\s*/, "").trim();
}

function section(text: string, names: string[]) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => names.some((name) => clean(line).includes(name)));
  if (start < 0) return "";
  const body: string[] = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^(?:#{1,6}\s*)?(?:[一二三四五六七八九十]+[、.]|\d+[、.)．])/.test(line) && body.length) break;
    if (line) body.push(clean(line));
  }
  return body.join("\n").trim();
}

function list(value: string) {
  const items = value.split(/\r?\n|[；;]/).map(clean).filter(Boolean);
  return items.length ? items : [pending];
}

function entityName(text: string, labels: string[]) {
  for (const label of labels) {
    const match = text.match(new RegExp(`${label}\\s*[：:]\\s*([^\\n｜|，,。]+)`, "i"));
    if (match?.[1]) return clean(match[1]);
  }
  return pending;
}

function sources(text: string) {
  const urls = [...text.matchAll(/https?:\/\/[^\s)\]＞>"']+/g)].map((match) => match[0].replace(/[。，、；;]+$/, ""));
  return [...new Set(urls)].map((url, index) => ({ title: `資料來源 ${index + 1}`, url, sourceType: "網路資料", note: "請在發布前核對來源標題與內容" }));
}

export function parseStrategyCaseText(text: string): StrategyCase {
  const normalized = text.trim();
  const lines = normalized.split(/\r?\n/).map(clean).filter(Boolean);
  const date = normalized.match(/\b(20\d{2})[-/.年](\d{1,2})[-/.月](\d{1,2})日?\b/);
  const caseDate = date ? `${date[1]}-${date[2].padStart(2, "0")}-${date[3].padStart(2, "0")}` : new Date().toISOString().slice(0, 10);
  const title = lines.find((line) => line.length >= 6 && !/^https?:/.test(line)) || `余氏商業案例研究｜${caseDate}`;
  const companyText = section(normalized, ["企業案例", "企業分析", "現代企業"]);
  const leaderText = section(normalized, ["政權／領導者", "政權/領導者", "領導者案例", "歷史政權", "歷史案例"]);
  const ipText = section(normalized, ["IP 案例", "IP案例", "IP 分析", "IP分析"]);
  const strategyText = section(normalized, ["兵法對照", "兵法", "戰略對照"]);
  const ymosText = section(normalized, ["YMOS 六層", "YMOS六層", "YMOS"]);
  const actionText = section(normalized, ["策略行動", "行動建議", "策略輸出"]);
  const riskText = section(normalized, ["風險提醒", "風險警示", "風險"]);
  const foundSources = sources(normalized);
  const companyName = entityName(normalized, ["企業名稱", "企業", "公司"]);
  const leaderName = entityName(normalized, ["人物名稱", "領導者", "人物"]);
  const ipName = entityName(normalized, ["IP 名稱", "IP名稱", "IP"]);
  const fallbackSummary = lines.slice(1, 4).join(" ").slice(0, 500) || pending;
  const value = (input: string) => input || pending;

  return {
    slug: slugifyStrategyCase(`${caseDate}-${companyName}-${ipName}`) || `strategy-case-${caseDate}`,
    caseDate, title, subtitle: lines[1] || title, summary: fallbackSummary,
    centralTheme: value(section(normalized, ["核心命題", "中心主題", "核心主題"])),
    tags: [...new Set([companyName, leaderName, ipName, "YMOS"].filter((item) => item !== pending))].length ? [...new Set([companyName, leaderName, ipName, "YMOS"].filter((item) => item !== pending))] : ["待整理"],
    status: "pending_review", manuallyEdited: false,
    company: { name: companyName, englishName: "", industry: pending, foundingBackground: value(companyText), timeline: list(companyText), firstWaveDividend: pending, foundingCore: value(companyText), businessFlywheel: value(companyText), revenueSources: [pending], vulnerableRevenue: pending, organizationalMaturity: pending, singlePointOfFailure: pending, crisisPath: value(riskText), organizationType: pending },
    leader: { name: leaderName, regime: pending, era: pending, historicalBackground: value(leaderText), coreDilemma: value(leaderText), breakthroughMethod: value(leaderText), institutionalDesign: value(leaderText), talentStrategy: value(leaderText), strategicTradeoff: value(leaderText), historicalCost: value(riskText), references: [] },
    ip: { name: ipName, englishName: "", type: pending, origin: value(ipText), coreNarrative: value(ipText), characterDesign: value(ipText), emotionalHook: value(ipText), worldBuilding: value(ipText), symbolSystem: value(ipText), communityMechanism: value(ipText), platformDividend: value(ipText), monetization: value(ipText), longevityMechanism: value(ipText), backlashRisk: value(riskText) },
    strategy: { quotation: value(strategyText.split(/\r?\n/)[0] || ""), source: value(strategyText), interpretation: value(strategyText), sharedLogic: value(strategyText) },
    ymos: { observationEntry: value(ymosText), coreMethod: value(ymosText), educationProduct: value(ymosText), lifestyleProduct: value(ymosText), operatingSystem: value(ymosText), brandSpirit: value(ymosText) },
    actions: { strategicConclusion: value(actionText), actionItems: list(actionText), riskWarnings: list(riskText), teacherInsight: value(section(normalized, ["余老師判讀", "老師判讀", "教師洞察"])) },
    sources: foundSources.length ? foundSources : [{ title: "待補資料來源", url: "https://example.com/", sourceType: "待確認", note: "發布前必須替換為實際來源" }],
  };
}
