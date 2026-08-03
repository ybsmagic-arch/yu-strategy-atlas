export type TungArchiveItem = {
  code: string;
  name: string;
  entityType: "classic" | "treatment" | "medical-case" | "tung-point";
  format: "PDF" | "PPT" | "DOC";
  pages?: number;
  category: string;
  notes: string;
  series?: string;
};

export const tungArchiveItems: TungArchiveItem[] = [
  {code:"TUNG-SRC-ZHEN-JIU-JING-WEI-1993",name:"《針灸經緯》（楊維傑，1993）",entityType:"classic",format:"PDF",pages:498,category:"針灸典籍",notes:"掃描型 PDF；僅建立書目索引，全文尚待人工校讀。"},
  {code:"TUNG-SRC-72-ABSOLUTE-NEEDLES",name:"董氏七十二絕針",entityType:"tung-point",format:"PDF",pages:16,category:"董氏奇穴",notes:"穴位與針法資料，療效敘述尚未查證。"},
  {code:"TUNG-SRC-PRESCRIPTION-STUDIES",name:"董氏奇穴處方學",entityType:"treatment",format:"PDF",pages:123,category:"治療與處方",notes:"可搜尋文字型 PDF；處方內容須由合格專業人員審核。"},
  {code:"TUNG-SRC-SPECIAL-EFFECT-POINTS",name:"董氏奇穴特效穴",entityType:"tung-point",format:"PDF",pages:8,category:"董氏奇穴",notes:"穴位速查資料；特效等療效用語視為待查證主張。"},
  {code:"TUNG-SRC-ACUPUNCTURE-YANG",name:"董氏奇穴針灸學（楊維傑）",entityType:"classic",format:"PDF",pages:247,category:"針灸典籍",notes:"可搜尋文字型 PDF；先保存書目與來源資訊。"},
  {code:"TUNG-SRC-ACUPUNCTURE-DEVELOPMENT-1993",name:"董氏奇穴針灸發揮（楊維傑，1993）",entityType:"classic",format:"PDF",pages:136,category:"針灸典籍",notes:"掃描型 PDF；與《董氏針灸全集驗證（下）》內容疑似高度重疊，待人工比對。"},
  {code:"TUNG-SRC-COMPLETE-VERIFICATION-1",name:"董氏針灸全集驗證（上）",entityType:"medical-case",format:"PDF",pages:142,category:"醫案與驗證",notes:"案例與驗證資料；不可直接視為臨床療效證據。",series:"董氏針灸全集驗證"},
  {code:"TUNG-SRC-COMPLETE-VERIFICATION-2",name:"董氏針灸全集驗證（下）",entityType:"medical-case",format:"PDF",pages:136,category:"醫案與驗證",notes:"案例與驗證資料；與《董氏奇穴針灸發揮》疑似高度重疊，待人工比對。",series:"董氏針灸全集驗證"},
  {code:"TUNG-SRC-CASE-STUDIES",name:"董氏針灸醫案",entityType:"medical-case",format:"PDF",pages:76,category:"醫案與驗證",notes:"封面標示 Tung's Acupuncture Case Study；個案不能取代對照研究。"},
  {code:"TUNG-SRC-TREATMENT-STUDIES",name:"董氏奇穴治療學",entityType:"treatment",format:"PPT",category:"治療與處方",notes:"疾病與治療對照投影片；舊版 PPT，內容待專業審核。"},
  {code:"TUNG-SRC-POINT-STUDIES",name:"董氏奇穴穴位學",entityType:"tung-point",format:"PPT",category:"董氏奇穴",notes:"含穴位、定位與作用說明；舊版 PPT，內容待校讀。"},
  {code:"TUNG-SRC-THEORY-02",name:"董氏奇穴相關理論 2",entityType:"classic",format:"PPT",category:"理論",notes:"涉及動氣、倒馬與牽引針法。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-03",name:"董氏奇穴相關理論 3",entityType:"classic",format:"PPT",category:"理論",notes:"涉及臟腑別通等理論。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-04",name:"董氏奇穴相關理論 4",entityType:"classic",format:"PPT",category:"理論",notes:"系列分冊，需與全集交叉校讀。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-05",name:"董氏奇穴相關理論 5",entityType:"classic",format:"PPT",category:"理論",notes:"系列分冊，需與全集交叉校讀。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-06",name:"董氏奇穴相關理論 6",entityType:"classic",format:"PPT",category:"理論",notes:"系列分冊，需與全集交叉校讀。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-08",name:"董氏奇穴相關理論 8",entityType:"classic",format:"PPT",category:"理論",notes:"涉及臟腑別通、開闔樞與經絡通治。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-09",name:"董氏奇穴相關理論 9",entityType:"classic",format:"PPT",category:"理論",notes:"涉及臟腑別通、開闔樞與經絡通治。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-10",name:"董氏奇穴相關理論 10",entityType:"classic",format:"PPT",category:"理論",notes:"涉及常用穴與刺血資料。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-THEORY-COMPLETE",name:"董氏奇穴相關理論（全）",entityType:"classic",format:"PPT",category:"理論",notes:"疑為分冊彙編版；保留為系列總集，不當作重複檔刪除。",series:"董氏奇穴相關理論"},
  {code:"TUNG-SRC-COLOR-POINT-ATLAS",name:"董氏針灸彩色穴位圖最全收集",entityType:"tung-point",format:"DOC",category:"董氏奇穴",notes:"含外部圖片連結與著作權提示；只建索引，不複製圖片。"},
  {code:"TUNG-SRC-WEIGHT-MANAGEMENT",name:"董氏奇穴減肥",entityType:"treatment",format:"DOC",category:"治療與處方",notes:"網路轉載整理，來源品質未明；不可作為醫療建議。"},
  {code:"TUNG-SRC-PALM-DIAGNOSIS",name:"董氏特色掌診",entityType:"classic",format:"DOC",category:"診斷理論",notes:"文內提及胡文智、李國政及《董氏針灸真傳掌診法》；需回查原始出版品。"},
];

